'use strict';
/**
 * Shared vault parser for the design database.
 *
 * Both the MCP server (design-mcp.js) and the studio server (studio.js) import this,
 * so there is exactly one parser and it cannot drift. Zero dependencies.
 *
 * Root resolves to the vault this file belongs to, overridable with DESIGN_VAULT
 * so tests can point at a fixture vault instead of the real one. Resolution order:
 * DESIGN_VAULT, then the folder this file lives in (design/tools/ in the vault,
 * server/ in the packaged app — which is not a vault), then the design/ snapshot
 * next to it. On Windows the vault is D:/Memory/design and the first two find it;
 * on a machine with no vault the repo's own design/ snapshot is the working copy,
 * so the app runs with no setup and no environment variables.
 */

const fs = require('fs');
const path = require('path');

/** A folder counts as the vault when it holds the model and the two libraries. */
const looksLikeVault = (dir) => {
  try {
    return fs.existsSync(path.join(dir, '00-model.md'))
      && fs.existsSync(path.join(dir, 'facets'))
      && fs.existsSync(path.join(dir, 'references'));
  } catch { return false; }
};

function resolveRoot() {
  if (process.env.DESIGN_VAULT) return path.resolve(process.env.DESIGN_VAULT);
  const here = path.resolve(__dirname, '..');
  if (looksLikeVault(here)) return here;
  // Reached only when this file is the bundled copy in server/: the snapshot
  // is the design/ folder next to server/, i.e. one level up from here.
  const snapshot = path.resolve(__dirname, '..', 'design');
  if (looksLikeVault(snapshot)) return snapshot;
  return here;
}

const ROOT = resolveRoot();
const FACETS = path.join(ROOT, 'facets');

const FACET_NAMES = {
  A: 'Style families', B: 'Structure & layout', C: 'Colour', D: 'Typography',
  E: 'Shape & surface', F: 'Imagery & iconography', G: 'Motion & interaction',
  H: 'Content & voice', I: 'Components', J: 'Screen archetypes',
  K: 'Platform & context', L: 'Evaluation rubric',
};

const RECORD_DIRS = {
  'design-pref': 'preferences',
  'design-ddr': 'decisions',
  'design-ref': 'references',
  'design-brief': 'briefs',
};

const read = (p) => { try { return fs.readFileSync(p, 'utf8'); } catch { return null; } };

/* ---------- facets ---------- */

function facetFile(letter) {
  if (!fs.existsSync(FACETS)) return null;
  const hit = fs.readdirSync(FACETS).find((f) => f.toUpperCase().startsWith(String(letter).toUpperCase() + '-'));
  return hit ? path.join(FACETS, hit) : null;
}

/** Parse a facet file into dimensions -> terms, reading the Stance column where present. */
function parseFacet(letter) {
  const p = facetFile(letter);
  if (!p) return null;
  const text = read(p);
  if (!text) return null;
  const L = String(letter).toUpperCase();
  const out = { letter: L, name: FACET_NAMES[L] || '', file: path.basename(p), dimensions: [], open_questions: [] };
  let dim = null, inOpen = false;
  for (const line of text.split(/\r?\n/)) {
    const h = line.match(/^##\s+([A-L]\.[A-Z0-9-]+)\s*[—-]\s*(.+)$/);
    if (h) { dim = { id: h[1], name: h[2].trim(), terms: [] }; out.dimensions.push(dim); inOpen = false; continue; }
    if (/^##\s+Open questions/i.test(line)) { inOpen = true; dim = null; continue; }
    if (inOpen) { const b = line.match(/^[-*]\s+(.*)$/); if (b) out.open_questions.push(b[1].trim()); continue; }
    const row = line.match(/^\|\s*`([A-L]\.[A-Z0-9-]+\.[a-z0-9-]+)`\s*\|(.*)$/);
    if (row && dim) {
      const cells = row[2].split('|').map((c) => c.trim()).filter((c, i, a) => !(i === a.length - 1 && c === ''));
      const term = { id: row[1], name: cells[0] || '', definition: cells[1] || '' };
      if (cells.length >= 3) {
        const s = cells[2];
        // `req` is a constraint, NOT a taste — it must never read back as Sam liking it.
        term.stance = /^req\b/i.test(s) ? 'required'
          : s.startsWith('✓') ? 'likes' : s.startsWith('✗') ? 'rejects'
            : s.startsWith('~') ? 'conditional'
              : (s.startsWith('–') || s.startsWith('-')) ? 'unknown' : 'note';
        const note = s.replace(/^(req\b|[✓✗~–-])\s*/i, '').trim();
        if (note) term.stance_note = note;
        term.cited = /PREF-\d|DDR-\d/.test(s);
      }
      dim.terms.push(term);
    }
  }
  return out;
}

/** Every term across every facet, flattened. */
function allTerms() {
  const terms = [];
  for (const L of Object.keys(FACET_NAMES)) {
    const f = parseFacet(L);
    if (!f) continue;
    for (const d of f.dimensions) for (const t of d.terms) terms.push({ ...t, facet: f.letter, dimension: d.id });
  }
  return terms;
}

let _termIndex = null;
function termIndex() {
  if (!_termIndex) {
    _termIndex = new Map();
    for (const t of allTerms()) _termIndex.set(t.id.toLowerCase(), t);
  }
  return _termIndex;
}
const resetCache = () => { _termIndex = null; };

function validateTerms(ids) {
  const known = termIndex();
  const valid = [], unknown = [];
  for (const raw of ids || []) {
    const id = String(raw).replace(/`/g, '').trim();
    const hit = known.get(id.toLowerCase());
    if (hit) valid.push(hit);
    else {
      const tail = id.split('.').pop().toLowerCase();
      const near = [...known.values()]
        .filter((t) => t.id.toLowerCase().includes(tail) || t.name.toLowerCase().includes(tail))
        .slice(0, 4).map((t) => t.id);
      unknown.push({ id, suggestions: near });
    }
  }
  return { valid, unknown };
}

/* ---------- records ---------- */

/** Read one scalar: double-quoted (JSON escapes), single-quoted, inline list, or bare. */
function scalar(rawVal) {
  if (rawVal.startsWith('"')) {
    try { return JSON.parse(rawVal); } catch { return rawVal.replace(/^"|"$/g, ''); }
  }
  if (rawVal.startsWith("'")) {
    const endQ = rawVal.lastIndexOf("'");
    return rawVal.slice(1, endQ > 0 ? endQ : undefined).replace(/''/g, "'");
  }
  if (rawVal.startsWith('[') && rawVal.endsWith(']')) {
    return rawVal.slice(1, -1).split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
  }
  // Only an unquoted scalar can carry a trailing comment.
  return rawVal.replace(/\s+#\s.*$/, '').trim();
}

/**
 * Minimal YAML-subset reader: `key: value`, inline `[a, b]`, quoted scalars, block lists
 * (`key:` then indented `- item`) and one level of nested mapping.
 *
 * It also flattens a nested `metadata:` block up to the top level. This matters: the
 * vault's auto-memory system normalises any new .md file here into its own memory schema,
 * moving our keys under `metadata:` and expanding inline arrays into block lists. Rather
 * than fight that watcher, the parser reads both shapes.
 */
function frontmatter(text) {
  if (!text || !text.startsWith('---')) return null;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return null;
  const fm = {};
  const lines = text.slice(4, end).split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^([a-z_][a-z0-9_]*):\s*(.*)$/i);
    if (!m) continue;
    const key = m[1];
    const rest = m[2].trim();
    if (rest !== '') { fm[key] = scalar(rest); continue; }

    // Empty value: look ahead for an indented block list or mapping.
    const list = [];
    const map = {};
    let j = i + 1;
    for (; j < lines.length; j++) {
      const l = lines[j];
      if (!l.trim()) continue;
      if (!/^\s+\S/.test(l)) break;              // dedented: block is over
      const item = l.match(/^\s+-\s*(.*)$/);
      if (item) { list.push(scalar(item[1].trim())); continue; }
      const kv = l.match(/^\s+([a-z_][a-z0-9_]*):\s*(.*)$/i);
      if (kv) {
        if (kv[2].trim() !== '') { map[kv[1]] = scalar(kv[2].trim()); continue; }
        // nested-empty (e.g. metadata: facets:) — collect its own indented list
        const sub = [];
        let k = j + 1;
        for (; k < lines.length; k++) {
          const sl = lines[k];
          if (!sl.trim()) continue;
          const si = sl.match(/^\s+-\s*(.*)$/);
          if (!si) break;
          sub.push(scalar(si[1].trim()));
        }
        map[kv[1]] = sub;
        j = k - 1;
      }
    }
    if (list.length) fm[key] = list;
    else if (Object.keys(map).length) fm[key] = map;
    else fm[key] = '';
    i = j - 1;
  }

  // Flatten metadata.* up, without clobbering a real top-level value.
  if (fm.metadata && typeof fm.metadata === 'object' && !Array.isArray(fm.metadata)) {
    for (const [k, v] of Object.entries(fm.metadata)) {
      if (fm[k] === undefined || fm[k] === '') fm[k] = v;
    }
  }
  return fm;
}

function bodyOf(text) {
  const end = text.indexOf('\n---', 3);
  return end === -1 ? text : text.slice(end + 4).trim();
}

function records(kind) {
  const dir = path.join(ROOT, RECORD_DIRS[kind] || '');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_') && f !== 'index.md')
    .map((f) => {
      const full = path.join(dir, f);
      const text = read(full) || '';
      const fm = frontmatter(text);
      if (!fm || fm.type !== kind) return null;
      return { ...fm, _file: path.relative(ROOT, full).replace(/\\/g, '/'), _body: bodyOf(text) };
    })
    .filter(Boolean)
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
}

const asList = (v) => (Array.isArray(v) ? v : v ? [v] : []);

/** Return the body of a `## <heading>` section (JS has no \Z, so split on headings). */
function section(body, heading) {
  const want = String(heading).toLowerCase();
  for (const chunk of String(body).split(/^##\s+/m).slice(1)) {
    const nl = chunk.indexOf('\n');
    const head = (nl === -1 ? chunk : chunk.slice(0, nl)).trim().toLowerCase();
    if (head === want) return (nl === -1 ? '' : chunk.slice(nl + 1)).trim();
  }
  return '';
}

/* ---------- writing ---------- */

/**
 * Rewrite only the given frontmatter keys of a record, byte-for-byte preserving the body
 * and every other key. Returns the new text. Values: string, number, or array of strings.
 */
function setFrontmatter(text, updates) {
  if (!text.startsWith('---')) throw new Error('file has no frontmatter');
  const end = text.indexOf('\n---', 3);
  if (end === -1) throw new Error('unterminated frontmatter');
  const head = text.slice(4, end);
  const rest = text.slice(end); // starts with "\n---"
  const fmt = (v) => {
    if (Array.isArray(v)) return '[' + v.map((x) => String(x)).join(', ') + ']';
    const s = String(v);
    // JSON.stringify produces a valid YAML double-quoted scalar, and frontmatter() reads
    // it back with JSON.parse — so quotes, newlines and " # " all survive a round trip.
    return /[:#"'\[\]{}&*?|<>=!%@`,\n]|^\s|\s$|^$/.test(s) ? JSON.stringify(s) : s;
  };
  const lines = head.split(/\r?\n/);
  const done = new Set();
  const out = lines.map((line) => {
    const m = line.match(/^([a-z_][a-z0-9_]*):\s*(.*)$/i);
    if (!m) return line;
    if (!(m[1] in updates)) return line;
    done.add(m[1]);
    const v = updates[m[1]];
    if (v === null) return null; // delete the key
    // Only an unquoted scalar can have carried a trailing comment worth preserving.
    const old = m[2].trim();
    const quoted = old.startsWith('"') || old.startsWith("'") || old.startsWith('[');
    const trailing = quoted ? '' : (old.match(/\s+#\s.*$/) || [''])[0];
    return `${m[1]}: ${fmt(v)}${trailing}`;
  }).filter((l) => l !== null);
  for (const [k, v] of Object.entries(updates)) {
    if (!done.has(k) && v !== null) out.push(`${k}: ${fmt(v)}`);
  }
  return '---\n' + out.join('\n').replace(/\n+$/, '') + rest;
}

/* ---------- stance editing ---------- */

const MARKS = { like: '✓', reject: '✗', conditional: '~' };
const MARK_OF = { '✓': 'like', '✗': 'reject', '~': 'conditional' };

/** Locate a term's row: which facet file, which line, and the cell layout. */
function findTermRow(termId) {
  const letter = String(termId).charAt(0).toUpperCase();
  const file = facetFile(letter);
  if (!file) throw new Error(`no facet file for ${termId}`);
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  const re = new RegExp('^(\\|\\s*`' + termId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '`\\s*\\|)(.*)$');
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(re);
    if (!m) continue;
    const cells = m[2].split('|');
    const trailingEmpty = cells.length && cells[cells.length - 1].trim() === '';
    const stanceIdx = trailingEmpty ? cells.length - 2 : cells.length - 1;
    if (stanceIdx < 2) throw new Error(`${termId} is in a table with no Stance column — its stance cannot be set`);
    return { file, text, lines, line: i, head: m[1], cells, stanceIdx };
  }
  throw new Error(`term not found in any facet table: ${termId}`);
}

/**
 * Set a term's stance, with the guards that make this safe to automate.
 *
 *  - `✓ / ✗ / ~` require a PREF that exists AND lists this term, so a stance can never
 *    cite unrelated evidence.
 *  - `~` requires a stated condition.
 *  - A matching polarity appends the new citation; a conflicting one is refused outright
 *    and handed back to Sam. A stance is never silently flipped.
 *  - Exactly one line may change. The file is re-parsed afterwards and rolled back if the
 *    stance did not land or anything else moved.
 */
function setStance(termId, { stance, prefId, condition, note } = {}) {
  const known = termIndex().get(String(termId).toLowerCase());
  if (!known) throw new Error(`unknown term: ${termId}`);
  const id = known.id;

  const mark = MARKS[stance];
  if (!mark && stance !== 'unknown' && stance !== 'required') {
    throw new Error(`stance must be like | reject | conditional | required | unknown (got ${stance})`);
  }
  if (mark) {
    if (!prefId) throw new Error(`${stance} needs a PREF id — a stance without evidence is exactly what this database forbids`);
    const pref = records('design-pref').find((p) => String(p.id).toLowerCase() === String(prefId).toLowerCase());
    if (!pref) throw new Error(`no such preference record: ${prefId}`);
    if (!asList(pref.facets).map((x) => String(x).toLowerCase()).includes(id.toLowerCase())) {
      throw new Error(`${prefId} does not list ${id} in its facets — it cannot be the evidence for this stance`);
    }
    const want = stance === 'like' ? 'like' : stance === 'reject' ? 'reject' : 'conditional';
    if (String(pref.polarity) !== want) {
      throw new Error(`${prefId} has polarity "${pref.polarity}" but the stance asked for is "${want}"`);
    }
    if (stance === 'conditional' && !condition) throw new Error('a conditional stance needs its condition stated');
  }

  const row = findTermRow(id);
  const before = row.cells[row.stanceIdx].trim();
  const beforeMark = /^req\b/i.test(before) ? 'req' : (MARK_OF[before.charAt(0)] || (before.startsWith('–') || before.startsWith('-') ? 'unknown' : 'other'));

  let cell;
  if (stance === 'unknown') {
    cell = note ? `– ${note}` : '–';
  } else if (stance === 'required') {
    cell = note ? `req ${note}` : 'req';
  } else if (beforeMark === stance) {
    // same polarity: append the citation rather than replacing the existing evidence
    if (new RegExp(prefId, 'i').test(before)) return { file: row.file, unchanged: true, cell: before };
    const cites = before.replace(/^[✓✗~]\s*/, '').trim();
    cell = `${mark} ${cites ? cites + ', ' + prefId : prefId}`;
  } else if (beforeMark === 'unknown' || beforeMark === 'req' || beforeMark === 'other') {
    // A `req` is a statement about the work and stays true even once a taste is recorded
    // on the same term — carry it into the new cell rather than destroying it.
    const keep = beforeMark === 'req' ? before.replace(/^req\b\s*/i, '').trim() : '';
    cell = `${mark} ${prefId}${condition ? ' — ' + condition : ''}${keep ? ' · req ' + keep : ''}`;
  } else {
    throw new Error(
      `conflict on ${id}: the table says "${before}" and ${prefId} asks for "${stance}". ` +
      'Refusing to flip a recorded stance — resolve it yourself.');
  }

  const cells = row.cells.slice();
  cells[row.stanceIdx] = ' ' + cell + ' ';
  const newLine = row.head + cells.join('|');
  if (newLine === row.lines[row.line]) return { file: row.file, unchanged: true, cell: before };

  const original = row.text;
  const lines = row.lines.slice();
  lines[row.line] = newLine;
  fs.writeFileSync(row.file, lines.join('\n'), 'utf8');

  // verify: exactly one line changed, and the stance parses back as intended
  const after = fs.readFileSync(row.file, 'utf8').split(/\r?\n/);
  const diff = after.map((l, i) => (l !== row.lines[i] ? i : -1)).filter((i) => i !== -1);
  resetCache();
  const reparsed = termIndex().get(id.toLowerCase());
  const expect = stance === 'like' ? 'likes' : stance === 'reject' ? 'rejects'
    : stance === 'conditional' ? 'conditional' : stance;
  if (diff.length !== 1 || diff[0] !== row.line || !reparsed || reparsed.stance !== expect) {
    fs.writeFileSync(row.file, original, 'utf8');
    resetCache();
    throw new Error(`stance write did not verify for ${id} (changed ${diff.length} lines, parsed "${reparsed && reparsed.stance}") — rolled back`);
  }
  return { file: row.file, line: row.line + 1, from: before, to: cell };
}

/* ---------- the candidate queue ---------- */

const QUEUE = () => path.join(ROOT, 'preferences', '_candidates.md');

const QUEUE_HEADER = '# Candidate preferences — the queue\n\n'
  + 'Reasons Sam gave in the studio, waiting to be written up as PREF records.\n'
  + 'A row here is **evidence**, not yet a preference: it carries his words and the date.\n'
  + 'Turn each into a record with `preferences/_template.md`, then delete the row.\n';

/** One queue entry, in the format the studio writes and the skill reads. */
function queueEntry({ term, leaning, refs, reason, date }) {
  const d = date || new Date().toISOString().slice(0, 10);
  return `\n---\n\n**${term}** · leaning \`${leaning || '?'}\` · ${d}\n`
    + `refs: ${asList(refs).join(', ') || '(none given)'}\n\n`
    + `> ${String(reason).replace(/\n+/g, '\n> ')}\n`;
}

function appendQueue(entry) {
  const file = QUEUE();
  if (!fs.existsSync(file)) fs.writeFileSync(file, QUEUE_HEADER, 'utf8');
  fs.appendFileSync(file, queueEntry(entry), 'utf8');
  return file;
}

function readQueue() {
  const file = QUEUE();
  const text = read(file);
  if (!text) return [];
  const out = [];
  for (const chunk of text.split(/^---\s*$/m).slice(1)) {
    const m = chunk.match(/\*\*([A-L]\.[A-Z0-9-]+\.[a-z0-9-]+)\*\*\s*·\s*leaning\s*`([^`]*)`\s*·\s*(\S+)/);
    if (!m) continue;
    const refs = (chunk.match(/^refs:\s*(.*)$/m) || [, ''])[1]
      .split(',').map((s) => s.trim()).filter((s) => s && s !== '(none given)');
    const reason = chunk.split(/\n/).filter((l) => l.startsWith('> ')).map((l) => l.slice(2)).join('\n').trim();
    if (!reason) continue;
    out.push({ term: m[1], leaning: m[2], date: m[3], refs, reason, raw: chunk });
  }
  return out;
}

/** Remove one entry after it has become a PREF. Matches on term + date + reason. */
function removeQueueEntry(entry) {
  const file = QUEUE();
  const text = read(file);
  if (!text) return false;
  const parts = text.split(/^---\s*$/m);
  const keep = [parts[0]];
  let removed = false;
  for (const chunk of parts.slice(1)) {
    const same = chunk.includes(`**${entry.term}**`) && chunk.includes(entry.date)
      && chunk.includes(entry.reason.split('\n')[0]);
    if (same && !removed) { removed = true; continue; }
    keep.push(chunk);
  }
  if (!removed) return false;
  fs.writeFileSync(file, keep[0] + keep.slice(1).map((c) => '---' + c).join(''), 'utf8');
  return true;
}

/**
 * Rewrite the reference index table from the records themselves.
 *
 * Hand-maintaining it guarantees drift — it sat empty through three ingests before anyone
 * noticed. Only the table between the markers is replaced; the prose around it is kept.
 */
function writeRefIndex() {
  const file = path.join(ROOT, 'references', 'index.md');
  const text = read(file);
  if (!text) return null;
  const refs = records('design-ref');

  const rows = refs.length
    ? refs.map((r) => {
      const link = `[${r.id}](${path.basename(r._file)})`;
      const arch = asList(r.archetype).join(', ') || '—';
      const reaction = r.sam_reaction ? ` ${r.sam_reaction}` : '';
      return `| ${link} | ${r.title || ''} | ${r.kind || ''} | ${arch} | ${r.imagery_dep || ''} | `
        + `${r.rtl || ''} | ${r.cost || ''} | ${r.verdict || ''} | ${r.status || ''}${reaction} |`;
    }).join('\n')
    : '| | | | | | | | | |';

  const table = [
    '| ID | What | Kind | Archetype | Imagery dep. | RTL | Cost | Verdict | Review |',
    '|---|---|---|---|---|---|---|---|---|',
    rows,
  ].join('\n');

  const START = '<!-- refs:start -->';
  const END = '<!-- refs:end -->';
  const block = `${START}\n\n${table}\n\n${END}`;
  let out;
  if (text.includes(START) && text.includes(END)) {
    out = text.replace(new RegExp(`${START}[\\s\\S]*?${END}`), block);
  } else {
    // first run: replace the placeholder table, else append
    const m = text.match(/\|\s*ID\s*\|[\s\S]*?\n(?:\|.*\n)+/);
    out = m ? text.replace(m[0], block + '\n') : text.replace(/\n---\n/, `\n${block}\n\n---\n`);
  }
  if (out === text) return { file, refs: refs.length, changed: false };
  fs.writeFileSync(file, out, 'utf8');
  return { file, refs: refs.length, changed: true };
}

/** Next free record id for a type, as max + 1. Gaps are never refilled. */
function nextId(kind, prefix) {
  const n = records(kind)
    .map((r) => Number(String(r.id).replace(/^\D+/, '')))
    .filter((x) => Number.isFinite(x));
  return `${prefix}-${String((n.length ? Math.max(...n) : 0) + 1).padStart(4, '0')}`;
}

/* ---------- the concept: what artefact is depicted ---------- */

/**
 * The concept is the first thing image analysis must decide, before any style
 * term: what design artefact is actually in the picture, ignoring staging
 * (a laptop frame, a rock, a poster border). Five values, nothing else:
 *
 *   web       — a website / landing / dashboard / pricing page (desktop screen)
 *   mobile    — a phone or watch app screen
 *   component — one isolated card / component, not a full screen
 *   slide     — one or more presentation slides / a deck
 *   imagery   — no UI design at all: photo, 3D render, still life, mood, gradient
 *
 * Why this exists: the old graph mixed all five. A slide and a landing share
 * headline type, a single accent and a two-tier scale, so flat facet cosine
 * linked them at 0.4–0.6 while two slides with different colours scored lower
 * and never linked. Style terms describe how something looks; the concept
 * describes what it is — and grouping must be by what it is first.
 *
 * Stored as a `concept:` frontmatter field on each REF. Records that predate
 * the field fall back to inference below, and records with no usable signal
 * get no concept at all — which is a wildcard, never a wrong group.
 */
const CONCEPTS = ['web', 'mobile', 'component', 'slide', 'imagery', 'mockup'];
const CONCEPT_LABELS = {
  web: 'Web design', mobile: 'Mobile app', component: 'Component',
  slide: 'Slide / deck', imagery: 'Imagery / mood', mockup: 'Mockup / device in environment',
};
/** Fixed vector weights: the concept and the archetype are grouping signals, not style. */
const CONCEPT_WEIGHT = 7.0;
const ARCHETYPE_WEIGHT = 2.5;
/** Partial credit for sharing an archetype dimension (J.PRES.slide ~ J.PRES.deck). */
const ARCHETYPE_DIM_WEIGHT = 1.5;

function conceptOf(r) {
  const raw = String((r && r.concept) || '').trim().toLowerCase();
  if (CONCEPTS.includes(raw)) return raw;
  // Back-compat inference for records written before the concept field existed.
  const title = String((r && r.title) || '').toLowerCase();
  const arch = asList(r && r.archetype);
  const facets = asList(r && r.facets);
  const has = (t) => facets.includes(t) || arch.includes(t);
  // A device shown in an environment is a mockup reference, whatever is on its
  // screen: the image was saved for the device presentation, not the UI.
  if (/\b(laptop|monitor|tablet|iphone|ipad|macbook|phone)\b/.test(title)) return 'mockup';
  if (arch.length === 0 && (has('F.IMG.render-3d') || has('F.IMG.photography'))) return 'imagery';
  if (/presentation deck|slides?\b.*\bdeck|deck\b/.test(title) && /slide|deck|presentation/.test(title)) return 'slide';
  if (/slide/.test(title) && has('J.DATA.report')) return 'slide';
  if (has('K.DEV.handheld') || has('K.DEV.wearable')) return 'mobile';
  if (/card\b/.test(title) && !/landing|dashboard|screen|app\b/.test(title)) return 'component';
  return '';
}

/* ---------- the vector space ---------- */

/**
 * Every reference is a sparse vector over the facet vocabulary: its `facets` plus its
 * `archetype` terms. Terms are IDF-weighted, so a term shared by every record counts for
 * little and a rare one counts for a lot — then cosine similarity between records.
 *
 * Two additions make the grouping follow the concept, not just the style:
 *  - the concept is a pseudo-term with a fixed heavy weight (CONCEPT_WEIGHT),
 *    so two slides share a large component of their vectors whatever their colours;
 *  - archetype terms carry a fixed boost (ARCHETYPE_WEIGHT) on top of their IDF,
 *    so the screen's job counts for more than one more shared type scale.
 *
 * This is still a real vector space and, unlike an image embedding, every number in it is
 * explainable: two records are close *because they share these named terms*.
 */
function vectors(refs) {
  const docs = refs.map((r) => {
    const set = new Set([...asList(r.facets), ...asList(r.archetype)].map((t) => String(t).trim()).filter(Boolean));
    return { id: r.id, terms: set, concept: conceptOf(r), archetype: new Set(asList(r.archetype).map((t) => String(t).trim()).filter(Boolean)) };
  });
  const N = docs.length || 1;
  const df = new Map();
  for (const d of docs) for (const t of d.terms) df.set(t, (df.get(t) || 0) + 1);
  const idf = new Map();
  for (const [t, n] of df) idf.set(t, Math.log((N + 1) / (n + 0.5)));
  const vecs = new Map();
  for (const d of docs) {
    const v = new Map();
    let sq = 0;
    for (const t of d.terms) {
      const w = (idf.get(t) || 0) * (d.archetype.has(t) ? ARCHETYPE_WEIGHT : 1);
      v.set(t, w); sq += w * w;
    }
    // Archetype dimension (J.PRES, J.ACQ, …): a slide and a deck share a job family
    // even when their exact archetype terms differ.
    for (const a of d.archetype) {
      const dim = 'dim:' + String(a).split('.').slice(0, 2).join('.');
      v.set(dim, (v.get(dim) || 0) + ARCHETYPE_DIM_WEIGHT);
      sq += ARCHETYPE_DIM_WEIGHT * ARCHETYPE_DIM_WEIGHT;
    }
    if (d.concept) { v.set('concept:' + d.concept, CONCEPT_WEIGHT); sq += CONCEPT_WEIGHT * CONCEPT_WEIGHT; }
    const norm = Math.sqrt(sq) || 1;
    vecs.set(d.id, { v, norm, terms: d.terms, concept: d.concept });
  }
  return { vecs, idf, df, N: docs.length };
}

function cosine(a, b) {
  if (!a || !b) return 0;
  let dot = 0;
  const [small, large] = a.v.size <= b.v.size ? [a.v, b.v] : [b.v, a.v];
  for (const [t, w] of small) { const o = large.get(t); if (o !== undefined) dot += w * o; }
  return dot / (a.norm * b.norm);
}

/**
 * Same-concept pairs keep their score. Cross-concept pairs are discounted:
 * a slide and a landing that share a style can still link, but only if the
 * resemblance is strong (adjusted score clears the threshold anyway). A record
 * with no concept is a wildcard — no bonus, no penalty.
 */
function adjustedScore(a, b, raw) {
  if (!a || !b) return 0;
  if (!a.concept || !b.concept || a.concept === b.concept) return raw;
  return raw * 0.4;
}

/** Nearest neighbours of one reference, with the shared terms that explain each score. */
function neighbours(refId, refs, limit = 8) {
  const { vecs } = vectors(refs);
  const self = vecs.get(refId);
  if (!self) return [];
  const byId = new Map(refs.map((r) => [r.id, r]));
  const out = [];
  for (const [id, vec] of vecs) {
    if (id === refId) continue;
    const score = adjustedScore(self, vec, cosine(self, vec));
    if (score <= 0) continue;
    const shared = [...self.terms].filter((t) => vec.terms.has(t));
    out.push({ id, score, shared, title: (byId.get(id) || {}).title || '' });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit);
}

/** All pairs above a threshold — the edge list for the graph view. */
function edges(refs, threshold = 0.25, maxPerNode = 4) {
  const { vecs } = vectors(refs);
  const ids = [...vecs.keys()];
  const scored = [];
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const s = adjustedScore(vecs.get(ids[i]), vecs.get(ids[j]), cosine(vecs.get(ids[i]), vecs.get(ids[j])));
      if (s >= threshold) scored.push({ a: ids[i], b: ids[j], score: s });
    }
  }
  scored.sort((x, y) => y.score - x.score);
  const degree = new Map();
  const kept = [];
  for (const e of scored) {
    const da = degree.get(e.a) || 0, db = degree.get(e.b) || 0;
    if (da >= maxPerNode && db >= maxPerNode) continue;
    kept.push(e);
    degree.set(e.a, da + 1);
    degree.set(e.b, db + 1);
  }
  return kept;
}

/**
 * Facet terms whose reactions lean strongly one way — candidate preferences.
 * These are NOT preferences. A PREF needs a stated reason from Sam; this only says
 * where it is worth asking him for one.
 */
function candidatePrefs(refs, minCount = 4, minRatio = 0.75) {
  const tally = new Map();
  // Only the descriptive facets A–H can carry a taste. I–K are situational: liking three
  // LTR dashboards says nothing about preferring `K.LOC.ltr-latin`, and the archetype (J)
  // just says what the references were of. Counting those produces confident nonsense.
  const descriptive = (t) => /^[A-H]\./.test(String(t));
  for (const r of refs) {
    const reaction = r.sam_reaction;
    if (reaction !== 'like' && reaction !== 'dislike') continue;
    for (const t of new Set([...asList(r.facets), ...asList(r.archetype)].filter(descriptive))) {
      const e = tally.get(t) || { term: t, like: 0, dislike: 0, refs: [] };
      e[reaction]++;
      e.refs.push(r.id);
      tally.set(t, e);
    }
  }
  const known = termIndex();
  const out = [];
  for (const e of tally.values()) {
    const total = e.like + e.dislike;
    if (total < minCount) continue;
    const ratio = Math.max(e.like, e.dislike) / total;
    if (ratio < minRatio) continue;
    const term = known.get(e.term.toLowerCase());
    out.push({
      term: e.term,
      name: term ? term.name : '',
      stance: term ? term.stance || 'unknown' : 'unknown',
      leaning: e.like >= e.dislike ? 'like' : 'dislike',
      like: e.like, dislike: e.dislike, total, ratio,
      refs: e.refs,
    });
  }
  return out.sort((a, b) => b.total * b.ratio - a.total * a.ratio);
}

module.exports = {
  ROOT, FACETS, FACET_NAMES, RECORD_DIRS,
  read, facetFile, parseFacet, allTerms, termIndex, resetCache, validateTerms,
  frontmatter, bodyOf, records, asList, section, setFrontmatter,
  findTermRow, setStance, MARKS,
  queueEntry, appendQueue, readQueue, removeQueueEntry, nextId, writeRefIndex,
  vectors, cosine, neighbours, edges, candidatePrefs, conceptOf, CONCEPTS, CONCEPT_LABELS,
};

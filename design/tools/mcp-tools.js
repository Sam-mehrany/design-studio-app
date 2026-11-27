'use strict';
/**
 * mcp-tools — the Design Studio MCP service: every tool, and the JSON-RPC handler.
 *
 * Transport-free on purpose. Two thin shells use it:
 *   design-mcp.js   stdio  — Claude Code / Claude Desktop on the machine that holds the vault
 *   studio.js /mcp  HTTP   — any Claude client that can reach the running studio (token-guarded)
 * so both speak the same tools, read through the same parser (lib.js) and write through the
 * same validated writer (vault-write.js). Zero dependencies.
 *
 *   handleMessage(msg, ctx) -> JSON-RPC response object, or null for a notification
 *   ctx = { who, baseUrl, ingestStatus }   all optional; baseUrl turns paths into links
 */

const fs = require('fs');
const path = require('path');
const lib = require('./lib.js');
const vw = require('./vault-write.js');

const { ROOT, FACET_NAMES, read, facetFile, parseFacet, allTerms, records, section } = lib;

const VERSION = '2.0.0';
const SUPPORTED_PROTOCOLS = ['2025-06-18', '2025-03-26', '2024-11-05'];
const IMAGE_MAX = Number(process.env.MCP_IMAGE_MAX_BYTES) || 3.5 * 1024 * 1024;
const IMAGE_MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp' };
const INBOX_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.svg']);

const INSTRUCTIONS = [
  "Design Studio: Sam's design reference library — analysed screenshots (REF records), a",
  'twelve-facet design vocabulary (A–L) with his stances, his evidenced preferences (PREF),',
  'decisions (DDR) and surface briefs.',
  'Start with design_overview. Look before you judge: design_image shows a reference.',
  'Two rules: (1) taste is evidence or unknown — never infer a preference Sam did not state;',
  '(2) write tools record only what Sam actually told you, in his words.',
].join(' ');

/* ---------- helpers ---------- */

const firstPara = (body) => {
  const m = body.match(/^\*\*The preference\.\*\*\s*([\s\S]*?)\n\n/m)
    || body.match(/\n\n([^#*][\s\S]*?)\n\n/);
  return m ? ' ' + m[1].replace(/\s+/g, ' ').trim() : '';
};
const refsAll = () => records('design-ref');
const findRef = (id) => {
  const want = String(id || '').trim().toLowerCase();
  const all = refsAll();
  // "32", "0032", "REF-32" and "ref-0032" all mean REF-0032.
  const num = want.match(/^(?:ref-?)?(\d{1,4})$/);
  const norm = num ? `ref-${num[1].padStart(4, '0')}` : want;
  return all.find((r) => String(r.id).toLowerCase() === norm) || null;
};
const termNames = () => new Map(allTerms().map((t) => [t.id, t]));
const link = (ctx, p) => (ctx && ctx.baseUrl ? ctx.baseUrl.replace(/\/+$/, '') + p : null);
const tally = (list, key) => {
  const m = new Map();
  for (const r of list) for (const v of [].concat(key(r))) if (v) m.set(v, (m.get(v) || 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
};
const fmtTally = (rows) => rows.map(([k, n]) => `${k} ${n}`).join(' · ') || '—';
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

function inboxFiles() {
  const dir = path.join(ROOT, 'references', 'inbox');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => INBOX_EXT.has(path.extname(f).toLowerCase()))
    .map((f) => {
      let size = 0, mtime = 0;
      try { const st = fs.statSync(path.join(dir, f)); size = st.size; mtime = st.mtimeMs; } catch { /* ignore */ }
      return { name: f, size, mtime };
    })
    .sort((a, b) => a.mtime - b.mtime);
}
const kb = (n) => (n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB');

/* ---------- tool definitions ---------- */

const RO = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };
const RW = { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false };
const str = (description, extra = {}) => ({ type: 'string', description, ...extra });

const TOOLS = [
  /* --- orientation --- */
  { name: 'design_overview', title: 'Design database primer', annotations: RO,
    description: 'Start here. The design database primer: the twelve facets, every recorded preference in one line each, the decision records, the briefs, and the size and review state of the reference library. Cheap — read this before any design work rather than loading the facet files.',
    inputSchema: { type: 'object', properties: {} } },
  { name: 'design_stats', title: 'Library statistics', annotations: RO,
    description: 'The reference library in numbers — the studio dashboard: totals, review progress, reactions, and breakdowns by concept, archetype, verdict, RTL survivability, imagery dependency, cost and confidence, plus the inbox count.',
    inputSchema: { type: 'object', properties: {} } },

  /* --- vocabulary --- */
  { name: 'design_facet', title: 'One facet vocabulary', annotations: RO,
    description: "One facet's full vocabulary: its dimensions, every term with its definition, and Sam's stance (likes / rejects / conditional / unknown). Pass the letter A–L.",
    inputSchema: { type: 'object', properties: { facet: str('Facet letter A–L'), stance: str('Optional filter', { enum: ['likes', 'rejects', 'conditional', 'unknown', 'required'] }) }, required: ['facet'] } },
  { name: 'design_terms', title: 'Search the vocabulary', annotations: RO,
    description: 'Search the whole vocabulary by substring across term IDs, names and definitions. Use when you know the concept but not the term ID.',
    inputSchema: { type: 'object', properties: { query: str('Substring, e.g. "hairline" or "C.PAL"'), limit: { type: 'number', description: 'Default 40' } }, required: ['query'] } },
  { name: 'design_validate', title: 'Validate term IDs', annotations: RO,
    description: 'Validate facet term IDs against the vocabulary before writing them into a record or a brief. Guards against drift and invented terms. Returns unknown IDs with near-miss suggestions.',
    inputSchema: { type: 'object', properties: { terms: { type: 'array', items: { type: 'string' } } }, required: ['terms'] } },
  { name: 'design_rubric', title: 'Evaluation rubric', annotations: RO,
    description: 'The evaluation rubric (facet L) and the critique output format. Use when judging a design against a brief.',
    inputSchema: { type: 'object', properties: {} } },

  /* --- taste --- */
  { name: 'design_prefs', title: "Sam's preferences", annotations: RO,
    description: "Sam's recorded design preferences, with the evidence behind each. Filterable by polarity or facet term. Read these before proposing any visual treatment.",
    inputSchema: { type: 'object', properties: { polarity: str('like | reject | conditional'), facet: str('Facet term or prefix, e.g. C.PAL or E.ACC.side-stripe'), full: { type: 'boolean', description: 'Include the full body of each record' } } } },
  { name: 'design_candidates', title: 'Preferences awaiting write-up', annotations: RO,
    description: "Preferences waiting to be written up: reasons Sam gave in the studio (evidence, ready to become PREF records) and, separately, the facet terms his reactions lean on (not evidence). Check this before design work — a queued reason is a preference he has already stated.",
    inputSchema: { type: 'object', properties: {} } },
  { name: 'design_brief', title: 'Surface brief', annotations: RO,
    description: 'A surface brief: its DNA string, constraints, archetypes in priority order and explicit reject line. Call with no id to list the briefs.',
    inputSchema: { type: 'object', properties: { id: { type: 'string' } } } },

  /* --- the reference library --- */
  { name: 'design_refs', title: 'Query references', annotations: RO,
    description: 'Query the analysed reference library. Filters combine (AND): concept, archetype, verdict, kind, imagery dependency, RTL survivability, cost, review status, Sam\'s reaction, a facet term or prefix, and free text over id/title/source/terms. Use compact:true for one line per reference.',
    inputSchema: { type: 'object', properties: {
      query: str('Free text over id, title, source and terms'),
      concept: str('What the image depicts', { enum: lib.CONCEPTS }),
      archetype: str('Archetype ID or prefix, e.g. J.DATA or J.ACQ.landing'),
      verdict: str('adopt | adapt | reject'), kind: str('shipped | concept | print | brand'),
      imagery_dep: str('hard | soft | none'), rtl: str('clean | risky | breaks'), cost: str('low | med | high'),
      status: str('unreviewed | reviewed | corrected'), sam_reaction: str('like | dislike | none'),
      facet: str('Facet term or prefix, e.g. C.PAL or B.CONT.seams'),
      compact: { type: 'boolean', description: 'One line per reference' },
      limit: { type: 'number', description: 'Default 40' }, offset: { type: 'number', description: 'Skip this many matches (paging)' },
    } } },
  { name: 'design_ref', title: 'One reference in full', annotations: RO,
    description: 'Everything about one reference: classification, Sam\'s reaction and words, archetype and facet terms with names, definitions and Sam\'s stances (grouped by family), the measured Read, the verdict reasoning, notes, and its nearest neighbours in the library with similarity scores and shared terms. Accepts REF-0032, ref-32 or 32.',
    inputSchema: { type: 'object', properties: { id: str('Reference ID') }, required: ['id'] } },
  { name: 'design_image', title: 'See a reference image', annotations: RO,
    description: 'Return the actual image of a library reference (by id) or of an inbox file (by inbox name), so you can look at it. Images over the size cap come back as a link instead.',
    inputSchema: { type: 'object', properties: { id: str('Reference ID, e.g. REF-0032'), inbox: str('Inbox file name, from design_inbox') } } },
  { name: 'design_record', title: 'Raw record text', annotations: RO,
    description: 'The full Markdown text of one record by ID — PREF-0002, DDR-0001, REF-0014, BRIEF-training-athlete-pwa.',
    inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
  { name: 'design_inbox', title: 'Inbox and analysis status', annotations: RO,
    description: 'Images waiting in the inbox to be analysed into REF records, with sizes, plus the state of the last analysis run when the studio is serving. Look at one with design_image {inbox: name}.',
    inputSchema: { type: 'object', properties: {} } },

  /* --- writes: Sam's words only --- */
  { name: 'design_react', title: "Record Sam's reaction", annotations: RW,
    description: "Record Sam's OWN reaction to a reference — like, dislike, or none to clear — and/or his reason in his own words. Only call this when Sam has told you his reaction in this conversation; never infer one from his other likes. A reaction marks the reference reviewed. It never changes a facet stance: for that the reason must become a PREF record.",
    inputSchema: { type: 'object', properties: {
      id: str('Reference ID'),
      reaction: str("Sam's reaction", { enum: ['like', 'dislike', 'none'] }),
      note: str("Sam's reason, quoted as he said it. Empty string clears it."),
    }, required: ['id'] } },
  { name: 'design_review', title: 'Confirm or correct a classification', annotations: RW,
    description: "Review mode: record Sam's verdict on the proposed CLASSIFICATION of a reference. outcome 'agree' marks it reviewed with no change. outcome 'correct' writes the corrected fields Sam gave (validated against the vocabulary) and marks it corrected. This is descriptive — it never records taste.",
    inputSchema: { type: 'object', properties: {
      id: str('Reference ID'),
      outcome: str("'agree' or 'correct'", { enum: ['agree', 'correct'] }),
      verdict: str('adopt | adapt | reject'), confidence: str('low | med | high'),
      imagery_dep: str('hard | soft | none'), rtl: str('clean | risky | breaks'), cost: str('low | med | high'),
      kind: str('shipped | concept | print | brand'), title: str('Corrected title'),
      archetype: { type: 'array', items: { type: 'string' }, description: 'Full replacement list of archetype IDs' },
      facets: { type: 'array', items: { type: 'string' }, description: 'Full replacement list of facet term IDs — validate first' },
    }, required: ['id', 'outcome'] } },
  { name: 'design_queue_reason', title: "Queue Sam's stated reason", annotations: { ...RW, idempotentHint: false },
    description: "Queue a preference reason Sam stated, in his words, against one facet term, for write-up as a PREF record (Mode 3). This is evidence — only call it with something Sam actually said. Appears in design_candidates.",
    inputSchema: { type: 'object', properties: {
      term: str('Facet term ID the reason is about, e.g. B.CONT.seams'),
      leaning: str('like | dislike', { enum: ['like', 'dislike'] }),
      reason: str("Sam's words"),
      refs: { type: 'array', items: { type: 'string' }, description: 'References that prompted it' },
    }, required: ['term', 'leaning', 'reason'] } },
];

/* ---------- read tools ---------- */

function toolOverview() {
  const L = [];
  L.push('# Design database — primer');
  L.push('');
  L.push('A faceted UI design taxonomy plus Sam\'s evidenced taste record. Grammar: 00-model.md.');
  L.push('');
  L.push('## The twelve facets');
  for (const [k, v] of Object.entries(FACET_NAMES)) {
    if (k === 'L') { L.push(`- **L** ${v} — 11 scored dimensions and the critique format  (design_rubric)`); continue; }
    const f = parseFacet(k);
    const n = f ? f.dimensions.reduce((a, d) => a + d.terms.length, 0) : 0;
    L.push(`- **${k}** ${v} — ${f ? f.dimensions.length : 0} dimensions, ${n} terms  (design_facet "${k}")`);
  }
  L.push('');
  L.push('## Term ID grammar');
  L.push('`<facet>.<dimension>.<term>` — e.g. `C.PAL.single-accent`, `B.DEN.dense`, `E.DEP.border-only`.');
  L.push('Validate every ID with design_validate before writing it anywhere.');
  L.push('');
  const prefs = records('design-pref');
  L.push(`## Recorded preferences (${prefs.length})`);
  for (const p of prefs) L.push(`- **${p.id}** [${p.polarity}] ${p.title} — *scope: ${p.scope}*`);
  L.push('');
  const ddrs = records('design-ddr');
  L.push(`## Decisions (${ddrs.length})`);
  for (const d of ddrs) L.push(`- **${d.id}** [${d.status}] ${d.title} — *${d.scope}*`);
  L.push('');
  const briefs = records('design-brief');
  L.push(`## Briefs (${briefs.length})`);
  for (const b of briefs) L.push(`- **${b.id}** ${b.project} / ${b.surface} [${b.status}]\n  DNA: ${b.dna}`);
  L.push('');
  const refs = refsAll();
  const unrev = refs.filter((r) => r.status === 'unreviewed').length;
  L.push('## Reference library');
  L.push(`${refs.length} analysed references, ${unrev} awaiting review. By concept: ${fmtTally(tally(refs, lib.conceptOf))}.`);
  L.push('Query with design_refs, open one with design_ref, look at it with design_image, numbers in design_stats.');
  const inbox = inboxFiles().length;
  if (inbox) L.push(`${inbox} image${inbox === 1 ? '' : 's'} in the inbox waiting for analysis (design_inbox).`);
  const queued = lib.readQueue().length;
  if (queued) {
    L.push('');
    L.push(`**${queued} reason${queued === 1 ? '' : 's'} awaiting write-up** — Sam has stated `
      + 'these preferences but they are not PREF records yet. Call design_candidates.');
  }
  L.push('');
  L.push('## The two rules');
  L.push('1. **Evidence or unknown.** A stance is `likes`/`rejects` only from something Sam actually said or rejected — never from inference. `unknown` is the honest default and the backlog.');
  L.push('2. **Taste decides between survivors, not what survives.** A pattern is admitted by appearing in 3+ shipped products, by answering a named constraint, or as a written differentiation call with its cost stated. Liking it only chooses among those.');
  return L.join('\n');
}

function toolStats() {
  const R = refsAll();
  const n = R.length;
  if (!n) return 'The reference library is empty — nothing has been ingested yet.';
  const reviewed = R.filter((r) => r.status && r.status !== 'unreviewed').length;
  const liked = R.filter((r) => r.sam_reaction === 'like').length;
  const disliked = R.filter((r) => r.sam_reaction === 'dislike').length;
  const names = termNames();
  const arch = tally(R, (r) => lib.asList(r.archetype)).slice(0, 12)
    .map(([id, c]) => `${(names.get(id) || {}).name || id} (${id}) ${c}`);
  return [
    '# Reference library — statistics',
    '',
    `- **References:** ${n}`,
    `- **Reviewed:** ${reviewed} (${pct(reviewed, n)}%) · waiting: ${n - reviewed}`,
    `- **Reactions:** ${liked} like · ${disliked} not for me${liked + disliked ? ` · ${pct(liked, liked + disliked)}% liked` : ''}`,
    `- **Inbox:** ${inboxFiles().length} image(s) waiting for analysis`,
    `- **Queued reasons:** ${lib.readQueue().length}`,
    '',
    `**Concept:** ${fmtTally(tally(R, lib.conceptOf))}`,
    `**Verdict:** ${fmtTally(tally(R, (r) => r.verdict))}`,
    `**Review status:** ${fmtTally(tally(R, (r) => r.status))}`,
    `**RTL:** ${fmtTally(tally(R, (r) => r.rtl))} — ${pct(R.filter((r) => r.rtl === 'clean').length, n)}% clean`,
    `**Imagery dependency:** ${fmtTally(tally(R, (r) => r.imagery_dep))} — ${pct(R.filter((r) => r.imagery_dep === 'none').length, n)}% stand without a photo`,
    `**Cost:** ${fmtTally(tally(R, (r) => r.cost))}`,
    `**Confidence:** ${fmtTally(tally(R, (r) => r.confidence))}`,
    `**Kind:** ${fmtTally(tally(R, (r) => r.kind))}`,
    '',
    `**Top archetypes:** ${arch.join(' · ')}`,
    '',
    `**Most-used facet terms:** ${tally(R, (r) => lib.asList(r.facets)).slice(0, 15).map(([t, c]) => `${t} ${c}`).join(' · ')}`,
  ].join('\n');
}

function toolFacet(a) {
  const f = parseFacet(String(a.facet || '').trim().charAt(0).toUpperCase());
  if (!f) return `Unknown facet "${a.facet}". Valid: ${Object.keys(FACET_NAMES).join(', ')}`;
  const want = a.stance ? String(a.stance).toLowerCase() : null;
  const L = [`# Facet ${f.letter} — ${f.name}`, `Source: facets/${f.file}`, ''];
  for (const d of f.dimensions) {
    const terms = want ? d.terms.filter((t) => t.stance === want) : d.terms;
    if (!terms.length) continue;
    L.push(`## ${d.id} — ${d.name}`);
    for (const t of terms) {
      const st = t.stance ? ` [${t.stance}${t.stance_note ? ': ' + t.stance_note : ''}]` : '';
      L.push(`- \`${t.id}\` **${t.name}** — ${t.definition}${st}`);
    }
    L.push('');
  }
  if (f.open_questions.length && !want) {
    L.push('## Open questions'); for (const q of f.open_questions) L.push(`- ${q}`);
  }
  return L.join('\n');
}

function toolTerms(a) {
  const q = String(a.query || '').toLowerCase();
  const hits = allTerms().filter((t) => (t.id + ' ' + t.name + ' ' + t.definition).toLowerCase().includes(q)).slice(0, a.limit || 40);
  if (!hits.length) return `No terms matching "${a.query}".`;
  return hits.map((t) => `\`${t.id}\` **${t.name}** (${t.facet}/${t.dimension}) — ${t.definition}${t.stance ? ` [${t.stance}]` : ''}`).join('\n');
}

function toolValidate(a) {
  const known = new Map(allTerms().map((t) => [t.id.toLowerCase(), t]));
  const ok = [], bad = [];
  for (const raw of a.terms || []) {
    const id = String(raw).replace(/`/g, '').trim();
    const hit = known.get(id.toLowerCase());
    if (hit) ok.push(`\`${hit.id}\` ${hit.name}${hit.stance ? ` [${hit.stance}]` : ''}`);
    else {
      const tail = id.split('.').pop().toLowerCase();
      const near = [...known.values()].filter((t) => t.id.toLowerCase().includes(tail) || t.name.toLowerCase().includes(tail)).slice(0, 4).map((t) => t.id);
      bad.push(`\`${id}\` UNKNOWN${near.length ? ` — did you mean: ${near.join(', ')}` : ''}`);
    }
  }
  return [bad.length ? `## ${bad.length} unknown\n` + bad.join('\n') : '## All terms valid', ok.length ? `\n## ${ok.length} valid\n` + ok.join('\n') : ''].join('\n').trim();
}

function toolPrefs(a) {
  let list = records('design-pref');
  if (a.polarity) list = list.filter((p) => String(p.polarity).toLowerCase() === String(a.polarity).toLowerCase());
  if (a.facet) { const f = String(a.facet).toLowerCase(); list = list.filter((p) => (p.facets || []).some((t) => String(t).toLowerCase().startsWith(f))); }
  if (!list.length) return 'No preference records match.';
  return list.map((p) => {
    const head = `## ${p.id} — ${p.title}\n**${p.polarity}** · scope: ${p.scope} · evidence: ${p.evidence_date}\nterms: ${(p.facets || []).join(', ') || '(none — governs all)'}`;
    if (a.full) return head + '\n\n' + p._body;
    const why = section(p._body, 'Why') || '';
    const ev = (p._body.match(/^\*\*Evidence:\*\*\s*(.+)$/m) || [])[1] || '';
    return head + (ev ? `\nEvidence: ${ev}` : '') + firstPara(p._body) + (why ? `\nWhy: ${why.replace(/\s+/g, ' ').slice(0, 300)}` : '');
  }).join('\n\n');
}

function toolBrief(a) {
  const list = records('design-brief');
  if (!a.id) {
    if (!list.length) return 'No briefs yet.';
    return list.map((b) => `- **${b.id}** ${b.project}/${b.surface} [${b.status}]\n  ${b.dna}`).join('\n');
  }
  const b = list.find((x) => String(x.id).toLowerCase() === String(a.id).toLowerCase() || String(x._file).toLowerCase().includes(String(a.id).toLowerCase()));
  return b ? `# ${b.id}\n\n${b._body}` : `No brief "${a.id}". Available: ${list.map((x) => x.id).join(', ') || '(none)'}`;
}

function toolRefs(a, ctx) {
  const all = refsAll();
  let list = all;
  const eq = (k) => { if (a[k]) { const v = String(a[k]).toLowerCase(); list = list.filter((r) => String(r[k] || '').toLowerCase() === v); } };
  ['verdict', 'kind', 'imagery_dep', 'rtl', 'cost', 'status'].forEach(eq);
  if (a.sam_reaction) {
    const v = String(a.sam_reaction).toLowerCase();
    list = list.filter((r) => (v === 'none' ? !r.sam_reaction : String(r.sam_reaction || '').toLowerCase() === v));
  }
  if (a.concept) { const v = String(a.concept).toLowerCase(); list = list.filter((r) => lib.conceptOf(r) === v); }
  if (a.archetype) { const v = String(a.archetype).toLowerCase(); list = list.filter((r) => lib.asList(r.archetype).some((x) => String(x).toLowerCase().startsWith(v))); }
  if (a.facet) { const v = String(a.facet).toLowerCase(); list = list.filter((r) => lib.asList(r.facets).some((x) => String(x).toLowerCase().startsWith(v))); }
  if (a.query) {
    const q = String(a.query).toLowerCase();
    list = list.filter((r) => [r.id, r.title, r.source, ...lib.asList(r.facets), ...lib.asList(r.archetype)].join(' ').toLowerCase().includes(q));
  }
  if (!list.length) return all.length ? 'No references match those filters.' : 'The reference library is empty — nothing has been ingested yet.';
  const offset = Math.max(0, Number(a.offset) || 0);
  const limit = Math.max(1, Number(a.limit) || 40);
  const page = list.slice(offset, offset + limit);
  const more = list.length > offset + page.length ? `\n\n…${list.length - offset - page.length} more — call again with offset ${offset + page.length}.` : '';
  const head = `${list.length} match${offset ? ` (showing ${offset + 1}–${offset + page.length})` : ''}:\n\n`;
  if (a.compact) {
    return head + page.map((r) => `- **${r.id}** [${lib.conceptOf(r)} · ${r.verdict} · ${r.status}${r.sam_reaction ? ' · Sam: ' + r.sam_reaction : ''}] ${r.title}`).join('\n') + more;
  }
  return head + page.map((r) => {
    const reaction = r.sam_reaction ? ` · Sam: ${r.sam_reaction}` : '';
    const note = r.sam_note ? `\n  Sam's words: "${r.sam_note}"` : '';
    const page2 = link(ctx, `/#ref/${r.id}`);
    return `- **${r.id}** ${r.title} (${lib.conceptOf(r)}, ${r.kind}) — ${lib.asList(r.archetype).join(', ')}\n`
      + `  verdict: ${r.verdict} · photo-dep: ${r.imagery_dep} · rtl: ${r.rtl} · cost: ${r.cost} · ${r.status}${reaction}\n`
      + `  terms: ${lib.asList(r.facets).join(', ')}${note}\n  file: ${r._file}${page2 ? `\n  page: ${page2}` : ''}`;
  }).join('\n') + more;
}

function toolRef(a, ctx) {
  const r = findRef(a.id);
  if (!r) return { error: `No reference "${a.id}". Find one with design_refs.` };
  const names = termNames();
  const describe = (t) => {
    const hit = names.get(t);
    if (!hit) return `- \`${t}\` — *unknown term*`;
    return `- \`${t}\` **${hit.name}** — ${hit.definition}${hit.stance ? ` [Sam: ${hit.stance}]` : ''}`;
  };
  const fam = new Map();
  for (const t of lib.asList(r.facets)) {
    const L = String(t).split('.')[0];
    if (!fam.has(L)) fam.set(L, []);
    fam.get(L).push(t);
  }
  const all = refsAll();
  const near = lib.neighbours(r.id, all, 8);
  const byId = new Map(all.map((x) => [x.id, x]));
  const page = link(ctx, `/#ref/${r.id}`);
  const img = r.image ? link(ctx, `/img/${r.image}`) : null;
  const out = [
    `# ${r.id} — ${r.title}`,
    '',
    page ? `Studio page: ${page}` : null,
    r.image ? `Image: references/${r.image}${img ? ` — ${img}` : ''} (look at it with design_image)` : 'Image: none recorded',
    `Source: ${r.source || '—'} · captured ${r.captured || '—'} · kind ${r.kind || '—'}`,
    '',
    '## Classification',
    `- concept: **${lib.conceptOf(r)}**`,
    `- verdict: **${r.verdict || '—'}** (confidence ${r.confidence || '—'})`,
    `- imagery dependency: ${r.imagery_dep || '—'} · RTL: ${r.rtl || '—'} · cost: ${r.cost || '—'}`,
    `- review status: **${r.status || '—'}**`,
    `- Sam's reaction: ${r.sam_reaction || 'none yet'}${r.sam_note ? ` — "${r.sam_note}"` : ''}`,
    '',
    '## Archetype',
    ...lib.asList(r.archetype).map(describe),
    '',
    `## Facet terms (${lib.asList(r.facets).length})`,
    ...[...fam.entries()].sort((x, y) => x[0].localeCompare(y[0])).flatMap(([L, terms]) => [`### ${L} — ${FACET_NAMES[L] || ''}`, ...terms.map(describe)]),
  ];
  for (const [h, k] of [['Read', 'Read'], ['Why the verdict', 'Why the verdict'], ['Notes', 'Notes']]) {
    const body = section(r._body, k);
    if (body) out.push('', `## ${h}`, body.trim());
  }
  out.push('', `## Nearest in the library (${near.length})`);
  if (!near.length) out.push('Nothing else shares terms with this one yet.');
  for (const n of near) {
    const x = byId.get(n.id);
    out.push(`- **${n.id}** ${Math.round(n.score * 100)}% — ${n.title || (x && x.title) || ''} [${x ? lib.conceptOf(x) : '?'}]\n  shares ${n.shared.length}: ${n.shared.join(', ')}`);
  }
  out.push('', `File: ${r._file}`);
  return out.filter((l) => l !== null).join('\n');
}

function imageContent(file, label, url) {
  const ext = path.extname(file).toLowerCase();
  const mime = IMAGE_MIME[ext];
  if (!fs.existsSync(file)) return { error: `${label}: the image file is not in this copy of the vault (${path.relative(ROOT, file)}).` };
  const size = fs.statSync(file).size;
  if (!mime || size > IMAGE_MAX) {
    const why = !mime ? `${ext} is not a format MCP clients display` : `it is ${kb(size)}, over the ${kb(IMAGE_MAX)} cap`;
    return { text: `${label}: not sent inline because ${why}.${url ? ` Open it at ${url}` : ` File: ${path.relative(ROOT, file)}`}` };
  }
  return {
    content: [
      { type: 'text', text: `${label} — ${kb(size)}${url ? ` — ${url}` : ''}` },
      { type: 'image', data: fs.readFileSync(file).toString('base64'), mimeType: mime },
    ],
  };
}

function toolImage(a, ctx) {
  if (a.inbox) {
    const name = path.basename(String(a.inbox));
    if (!INBOX_EXT.has(path.extname(name).toLowerCase())) return { error: `"${name}" is not an inbox image.` };
    const file = vw.safePath(path.join('references', 'inbox', name));
    return imageContent(file, `Inbox: ${name}`, link(ctx, `/img/inbox/${encodeURIComponent(name)}`));
  }
  if (!a.id) return { error: 'Pass id (a reference) or inbox (an inbox file name).' };
  const r = findRef(a.id);
  if (!r) return { error: `No reference "${a.id}".` };
  if (!r.image) return { error: `${r.id} has no image recorded.` };
  const file = vw.safePath(path.join('references', String(r.image)));
  return imageContent(file, `${r.id} — ${r.title}`, link(ctx, `/img/${r.image}`));
}

function toolRecord(a) {
  const id = String(a.id || '').toLowerCase();
  for (const kind of ['design-pref', 'design-ddr', 'design-ref', 'design-brief']) {
    const hit = records(kind).find((r) => String(r.id).toLowerCase() === id);
    if (hit) return `# ${hit.id} — ${hit.title || hit.project || ''}\nfile: ${hit._file}\n\n${hit._body}`;
  }
  const ref = findRef(a.id);
  if (ref) return `# ${ref.id} — ${ref.title}\nfile: ${ref._file}\n\n${ref._body}`;
  return { error: `No record "${a.id}".` };
}

function toolCandidates() {
  const queued = lib.readQueue();
  const leanings = lib.candidatePrefs(refsAll(), 3, 0.7);
  const L = [];
  L.push('# Candidate preferences');
  L.push('');
  L.push(`## Reasons awaiting write-up (${queued.length})`);
  L.push('');
  L.push('**This is evidence.** Sam gave these reasons in the studio; each one is ready to');
  L.push('become a PREF record. Nothing else here counts as evidence.');
  L.push('');
  if (!queued.length) L.push('_Nothing queued._');
  for (const q of queued) {
    L.push(`- \`${q.term}\` · leaning **${q.leaning}** · ${q.date}`);
    L.push(`  > ${q.reason.replace(/\n/g, '\n  > ')}`);
    L.push(`  from: ${q.refs.join(', ') || '(no refs recorded)'}`);
  }
  L.push('');
  L.push(`## Computed leanings (${leanings.length}) — NOT evidence`);
  L.push('');
  L.push('Terms his reactions agree on. These only say where it is worth asking him for a');
  L.push('reason; they never justify a stance on their own.');
  L.push('');
  if (!leanings.length) L.push('_No clear leanings yet._');
  for (const c of leanings) {
    L.push(`- \`${c.term}\` ${c.name ? '(' + c.name + ')' : ''} — leans **${c.leaning}**, `
      + `${c.like} like / ${c.dislike} not, ${Math.round(c.ratio * 100)}% agree · stance now: ${c.stance}`);
  }
  return L.join('\n');
}

function toolRubric() {
  return read(facetFile('L')) || { error: 'Rubric file missing.' };
}

function toolInbox(_a, ctx) {
  const files = inboxFiles();
  const L = ['# Inbox', ''];
  if (!files.length) L.push('Empty — nothing waiting for analysis.');
  else {
    L.push(`${files.length} image${files.length === 1 ? '' : 's'} waiting for analysis (oldest first):`);
    for (const f of files) L.push(`- ${f.name} — ${kb(f.size)}, added ${new Date(f.mtime).toISOString().slice(0, 16).replace('T', ' ')}`);
    L.push('', 'Look at one with design_image {inbox: "<name>"}. Analysis itself follows design-ingest-SKILL.md in the vault.');
  }
  const st = ctx && typeof ctx.ingestStatus === 'function' ? ctx.ingestStatus() : null;
  if (st && (st.running || st.code !== undefined)) {
    L.push('', '## Last analysis run');
    L.push(st.running ? `Running on ${st.count} image(s).` : `${st.queued ? 'Queued for Hark' : 'Finished'} — ${st.count || 0} image(s), exit ${st.code}${st.model ? ', ' + st.model : ''}.`);
    if (st.hint) L.push(st.hint);
  }
  return L.join('\n');
}

/* ---------- write tools ---------- */

function toolReact(a, ctx) {
  const r = findRef(a.id);
  if (!r) return { error: `No reference "${a.id}".` };
  const has = (k) => a[k] !== undefined && a[k] !== null;
  if (!has('reaction') && !has('note')) return { error: 'Pass reaction (like | dislike | none) and/or note.' };
  const upd = {};
  if (has('reaction')) {
    const v = String(a.reaction).toLowerCase();
    if (!['like', 'dislike', 'none'].includes(v)) return { error: 'reaction must be like, dislike or none.' };
    upd.sam_reaction = v === 'none' ? '' : v;
    // Same rule as the studio: a reaction reviews the reference; clearing it un-reviews it.
    // A classification Sam already corrected stays "corrected" either way.
    if (r.status !== 'corrected') upd.status = v === 'none' ? 'unreviewed' : 'reviewed';
  }
  if (has('note')) upd.sam_note = String(a.note);
  vw.updateRecord(r.id, upd, ctx.who || 'mcp');
  const parts = [];
  if (has('reaction')) parts.push(upd.sam_reaction ? `reaction **${upd.sam_reaction}**` : 'reaction cleared');
  if (has('note')) parts.push(upd.sam_note ? `reason "${upd.sam_note}"` : 'reason cleared');
  return `Recorded on ${r.id}: ${parts.join(', ')}${upd.status ? ` · status ${upd.status}` : ''}.`
    + (upd.sam_note ? '\nIf this reason is about a specific facet term, also queue it with design_queue_reason so it can become a PREF record.' : '');
}

const CLASS_FIELDS = ['verdict', 'confidence', 'imagery_dep', 'rtl', 'cost', 'kind', 'title', 'archetype', 'facets'];
function toolReview(a, ctx) {
  const r = findRef(a.id);
  if (!r) return { error: `No reference "${a.id}".` };
  const fields = CLASS_FIELDS.filter((k) => a[k] !== undefined && a[k] !== null && a[k] !== '');
  if (a.outcome === 'agree') {
    if (fields.length) return { error: `outcome "agree" takes no fields; use outcome "correct" to change ${fields.join(', ')}.` };
    vw.updateRecord(r.id, { status: 'reviewed' }, ctx.who || 'mcp');
    return `${r.id} marked reviewed — Sam agrees with the classification. (Agreement is not a statement of taste; no stance changes.)`;
  }
  if (a.outcome !== 'correct') return { error: 'outcome must be "agree" or "correct".' };
  if (!fields.length) return { error: `outcome "correct" needs at least one field: ${CLASS_FIELDS.join(', ')}.` };
  const upd = { status: 'corrected' };
  for (const k of fields) upd[k] = a[k];
  vw.updateRecord(r.id, upd, ctx.who || 'mcp');
  const was = fields.map((k) => `${k}: ${JSON.stringify(r[k] ?? null)} → ${JSON.stringify(a[k])}`);
  return `${r.id} corrected and marked corrected:\n- ${was.join('\n- ')}\nIf the same correction keeps recurring, the vocabulary may be wrong — tell Sam.`;
}

function toolQueueReason(a, ctx) {
  const refs = lib.asList(a.refs).map((x) => (findRef(x) || { id: x }).id);
  const file = vw.queueReason({ term: a.term, leaning: a.leaning, refs, reason: a.reason }, ctx.who || 'mcp');
  return `Queued in ${file}: \`${a.term}\` leaning ${a.leaning} — "${String(a.reason).trim()}". It now appears in design_candidates as evidence awaiting a PREF write-up.`;
}

const DISPATCH = {
  design_overview: toolOverview, design_stats: toolStats,
  design_facet: toolFacet, design_terms: toolTerms, design_validate: toolValidate, design_rubric: toolRubric,
  design_prefs: toolPrefs, design_candidates: toolCandidates, design_brief: toolBrief,
  design_refs: toolRefs, design_ref: toolRef, design_image: toolImage, design_record: toolRecord, design_inbox: toolInbox,
  design_react: toolReact, design_review: toolReview, design_queue_reason: toolQueueReason,
};

/** Run one tool and shape its result as MCP CallToolResult. Tool errors are results, not RPC errors. */
function callTool(name, args, ctx = {}) {
  const fn = DISPATCH[name];
  if (!fn) return null;
  try {
    const out = fn(args || {}, ctx);
    if (out && typeof out === 'object') {
      if (out.error) return { content: [{ type: 'text', text: out.error }], isError: true };
      if (out.content) return { content: out.content };
      if (out.text) return { content: [{ type: 'text', text: out.text }] };
    }
    return { content: [{ type: 'text', text: String(out) }] };
  } catch (e) {
    return { content: [{ type: 'text', text: `Error: ${e.message}` }], isError: true };
  }
}

/* ---------- JSON-RPC ---------- */

const rpcOk = (id, result) => ({ jsonrpc: '2.0', id, result });
const rpcErr = (id, code, message) => ({ jsonrpc: '2.0', id: id === undefined ? null : id, error: { code, message } });

/** Handle one JSON-RPC message. Returns a response, or null for notifications (no id). */
function handleMessage(msg, ctx = {}) {
  if (!msg || typeof msg !== 'object' || msg.jsonrpc !== '2.0' || typeof msg.method !== 'string') {
    // A response from the client (to a server request we never send) or junk.
    return msg && msg.id !== undefined && !('result' in msg || 'error' in msg) ? rpcErr(msg.id, -32600, 'Invalid Request') : null;
  }
  const { id, method, params } = msg;
  const isNotification = id === undefined || id === null;
  if (isNotification) return null;    // notifications/initialized, notifications/cancelled, …

  switch (method) {
    case 'initialize': {
      const asked = params && params.protocolVersion;
      const protocolVersion = SUPPORTED_PROTOCOLS.includes(asked) ? asked : SUPPORTED_PROTOCOLS[0];
      return rpcOk(id, {
        protocolVersion,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'design-studio', title: 'Design Studio', version: VERSION },
        instructions: INSTRUCTIONS,
      });
    }
    case 'ping': return rpcOk(id, {});
    case 'tools/list': return rpcOk(id, { tools: TOOLS });
    case 'resources/list': return rpcOk(id, { resources: [] });
    case 'resources/templates/list': return rpcOk(id, { resourceTemplates: [] });
    case 'prompts/list': return rpcOk(id, { prompts: [] });
    case 'tools/call': {
      const name = params && params.name;
      const result = callTool(name, params && params.arguments, ctx);
      return result ? rpcOk(id, result) : rpcErr(id, -32602, `Unknown tool: ${name}`);
    }
    default: return rpcErr(id, -32601, `Method not found: ${method}`);
  }
}

module.exports = { TOOLS, callTool, handleMessage, SUPPORTED_PROTOCOLS, VERSION, INSTRUCTIONS };

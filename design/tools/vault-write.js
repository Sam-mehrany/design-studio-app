'use strict';
/**
 * vault-write — the only code that writes reference records and the candidate queue.
 *
 * Shared by the studio's JSON API and both MCP transports (stdio and HTTP), so a write from
 * the UI and a write from Claude go through the same whitelist, the same enum and term
 * validation, the same corruption check and the same git commit.
 *
 * What is deliberately NOT here: writing a facet Stance or a PREF record. Those change only
 * from something Sam said, through Mode 3 of the ingest skill, in the vault itself.
 */

const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const lib = require('./lib.js');

const ROOT = lib.ROOT;

/** Resolve a vault-relative path and refuse anything that escapes design/. */
function safePath(rel) {
  const p = path.resolve(ROOT, String(rel || '').replace(/^[/\\]+/, ''));
  const base = path.resolve(ROOT);
  if (p !== base && !p.startsWith(base + path.sep)) throw new Error('path outside the design folder');
  return p;
}

/* ---------- git ---------- */

const gitRoot = path.resolve(ROOT, '..');
const gitAvailable = fs.existsSync(path.join(gitRoot, '.git'));
function commit(message, files) {
  if (!gitAvailable) return;
  execFile('git', ['-C', gitRoot, 'add', ...files], (e1) => {
    if (e1) return;
    execFile('git', ['-C', gitRoot, '-c', 'user.name=design-studio',
      '-c', 'user.email=studio@localhost', 'commit', '-q', '-m', message], () => {});
  });
}

/* ---------- reference records ---------- */

/** Only these frontmatter keys may be written. */
const WRITABLE = new Set([
  'sam_reaction', 'sam_note', 'status', 'verdict', 'facets', 'archetype',
  'imagery_dep', 'rtl', 'cost', 'kind', 'title', 'source', 'confidence',
]);
const ENUMS = {
  sam_reaction: ['like', 'dislike', ''],
  status: ['unreviewed', 'reviewed', 'corrected'],
  verdict: ['adopt', 'adapt', 'reject'],
  imagery_dep: ['hard', 'soft', 'none'],
  rtl: ['clean', 'risky', 'breaks'],
  cost: ['low', 'med', 'high'],
  kind: ['shipped', 'concept', 'print', 'brand'],
  confidence: ['low', 'med', 'high'],
};

/**
 * Write whitelisted frontmatter keys on one REF record. Validates enums and facet terms,
 * re-parses the file to prove it is intact (rolling back if not), and commits.
 * `who` names the writer in the commit message: "studio" or "mcp".
 */
function updateRecord(id, updates, who = 'studio') {
  const rec = lib.records('design-ref').find((r) => String(r.id) === String(id));
  if (!rec) throw new Error(`no record ${id}`);
  const file = safePath(rec._file);

  const clean = {};
  for (const [k, v] of Object.entries(updates)) {
    if (!WRITABLE.has(k)) throw new Error(`key not writable: ${k}`);
    if (ENUMS[k] && !Array.isArray(v) && !ENUMS[k].includes(String(v))) {
      throw new Error(`invalid value for ${k}: ${v} (allowed: ${ENUMS[k].filter(Boolean).join(', ')})`);
    }
    if (k === 'facets' || k === 'archetype') {
      const list = (Array.isArray(v) ? v : [v]).map((x) => String(x).trim()).filter(Boolean);
      const { unknown } = lib.validateTerms(list);
      if (unknown.length) throw new Error(`unknown facet terms: ${unknown.map((u) => u.id).join(', ')}`);
      clean[k] = list;
    } else {
      clean[k] = v === '' && k === 'sam_reaction' ? null : v;
    }
  }

  const before = fs.readFileSync(file, 'utf8');
  const after = lib.setFrontmatter(before, clean);
  fs.writeFileSync(file, after, 'utf8');

  // Re-parse to prove the write did not corrupt the file, and that the body is untouched.
  const reread = fs.readFileSync(file, 'utf8');
  const fm = lib.frontmatter(reread);
  if (!fm || fm.type !== 'design-ref') {
    fs.writeFileSync(file, before, 'utf8');
    throw new Error('write would have corrupted the record; rolled back');
  }
  if (lib.bodyOf(reread) !== lib.bodyOf(before)) {
    fs.writeFileSync(file, before, 'utf8');
    throw new Error('write altered the record body; rolled back');
  }
  commit(`${who}: ${id} ${Object.keys(clean).join(', ')}`, [file]);
  return fm;
}

/* ---------- candidate reasons (Sam's words, queued for Mode 3) ---------- */

/** Append one reason to preferences/_candidates.md. Returns the vault-relative file. */
function queueReason({ term, leaning, refs, reason }, who = 'studio') {
  term = String(term || '').trim();
  reason = String(reason || '').trim();
  if (!term || !reason) throw new Error('term and reason are both required');
  const { unknown } = lib.validateTerms([term]);
  if (unknown.length) throw new Error(`unknown term: ${term}`);
  if (leaning && !['like', 'dislike'].includes(String(leaning))) throw new Error(`leaning must be like or dislike, not ${leaning}`);
  // The queue format lives in lib.js so this writer and the skill's reader cannot drift apart.
  const file = lib.appendQueue({ term, leaning, refs, reason });
  commit(`${who}: candidate reason for ${term}`, [file]);
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

module.exports = { ROOT, safePath, gitAvailable, commit, WRITABLE, ENUMS, updateRecord, queueReason };

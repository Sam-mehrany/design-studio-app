'use strict';
/**
 * Copy the design database out of the vault into design/ so it can be committed.
 *
 * The vault at D:/Memory/design is the live working copy — the studio reads and writes it,
 * and Obsidian browses it. This repo holds a **snapshot**, refreshed deliberately before a
 * push rather than mirrored continuously, so a half-finished edit never lands in history.
 *
 *   node sync-design.js            copy the vault into design/
 *   node sync-design.js --check    report what would change, write nothing
 *   node sync-design.js --to-vault the other direction, for CODE ONLY: install this repo's tools/,
 *                                  nature.md and the record template into the vault, and add the
 *                                  I.TYPE table to its facet I if missing. Never touches a record,
 *                                  a preference, a decision or a stance. Combine with --check.
 *
 * Override the source with DESIGN_VAULT.
 */
const fs = require('fs');
const path = require('path');

/**
 * Where the live vault is: DESIGN_VAULT wins; otherwise D:/Memory/design when
 * it exists (Windows). When there is no vault at all — for example on a machine
 * that only has this repo — there is nothing to copy and the design/ snapshot
 * in the repo is left untouched instead of being wiped.
 */
function pickVault() {
  if (process.env.DESIGN_VAULT) return process.env.DESIGN_VAULT;
  const win = 'D:/Memory/design';
  if (fs.existsSync(path.join(win, '00-model.md'))) return win;
  return null;
}

const SRC = pickVault();
const OUT = path.join(__dirname, 'design');
const CHECK = process.argv.includes('--check');

if (!SRC) {
  console.error('sync-design: no vault found — set DESIGN_VAULT to the design folder, or run where D:/Memory/design exists.\n' +
    'The design/ snapshot in this repo is left untouched.');
  process.exit(1);
}
if (path.resolve(SRC) === path.resolve(OUT)) {
  console.error('sync-design: DESIGN_VAULT points at this repo\'s own design/ folder — nothing to copy.');
  process.exit(1);
}

// Generated or machine-local; never worth committing.
const SKIP_DIRS = new Set(['node_modules', '.git', 'inbox', '.vectors']);
const SKIP_FILES = new Set(['.DS_Store', 'Thumbs.db']);

if (!fs.existsSync(path.join(SRC, '00-model.md'))) {
  console.error(`sync-design: ${SRC} does not look like the design database (no 00-model.md).`);
  process.exit(1);
}

let copied = 0, skipped = 0, bytes = 0;

/**
 * Repo → vault, code and vocabulary only. The vault is the live library: its records carry
 * reactions and corrections this snapshot may not have, so they are never overwritten here.
 * Facet I is patched (the I.TYPE section inserted) rather than replaced, so a stance recorded
 * in the vault's copy survives.
 */
if (process.argv.includes('--to-vault')) {
  const put = (rel) => {
    const s = path.join(OUT, rel), d = path.join(SRC, rel);
    const same = fs.existsSync(d) && fs.readFileSync(d).equals(fs.readFileSync(s));
    if (same) return;
    console.log(`  ${fs.existsSync(d) ? 'update' : 'add   '} ${rel}`);
    if (!CHECK) { fs.mkdirSync(path.dirname(d), { recursive: true }); fs.copyFileSync(s, d); }
    copied++;
  };
  const tree = (rel) => {
    for (const e of fs.readdirSync(path.join(OUT, rel), { withFileTypes: true })) {
      if (SKIP_DIRS.has(e.name) || SKIP_FILES.has(e.name)) continue;
      const r = path.join(rel, e.name);
      if (e.isDirectory()) tree(r); else put(r);
    }
  };
  tree('tools');
  put('nature.md');
  put(path.join('references', '_template.md'));
  const facetI = fs.readdirSync(path.join(SRC, 'facets')).find((f) => f.startsWith('I-'));
  const vaultI = path.join(SRC, 'facets', facetI);
  const text = fs.readFileSync(vaultI, 'utf8');
  if (!/^## I\.TYPE\b/m.test(text)) {
    const repoI = fs.readFileSync(path.join(OUT, 'facets', facetI), 'utf8');
    const block = repoI.slice(repoI.search(/^## I\.TYPE\b/m), repoI.search(/^## I\.STATE\b/m));
    const at = text.search(/^## I\.STATE\b/m);
    console.log(`  patch  facets/${facetI} (insert the I.TYPE component-type table)`);
    if (!CHECK) fs.writeFileSync(vaultI, at === -1 ? text + '\n' + block : text.slice(0, at) + block + text.slice(at), 'utf8');
    copied++;
  }
  console.log(`sync-design: ${CHECK ? 'would install' : 'installed'} ${copied} change(s) into ${SRC}`);
  if (!CHECK && copied) console.log('Next, in the vault: node tools/backfill-nature.js   (fills the nature fields of REF-0001..0101)');
  process.exit(0);
}

function walk(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) { skipped++; continue; }
      walk(path.join(from, entry.name), path.join(to, entry.name));
      continue;
    }
    if (SKIP_FILES.has(entry.name)) { skipped++; continue; }
    const s = path.join(from, entry.name);
    const d = path.join(to, entry.name);
    const st = fs.statSync(s);
    if (!CHECK) fs.copyFileSync(s, d);
    copied++;
    bytes += st.size;
  }
}

// Start clean so a file deleted in the vault also disappears here.
if (!CHECK) fs.rmSync(OUT, { recursive: true, force: true });
walk(SRC, OUT);

console.log(
  `sync-design: ${CHECK ? 'would copy' : 'copied'} ${copied} files `
  + `(${(bytes / 1024 / 1024).toFixed(2)} MB) from ${SRC}`
  + (skipped ? `, skipped ${skipped} generated/local` : '')
);

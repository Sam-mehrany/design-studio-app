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
 *
 * Override the source with DESIGN_VAULT.
 */
const fs = require('fs');
const path = require('path');

const SRC = process.env.DESIGN_VAULT || 'D:/Memory/design';
const OUT = path.join(__dirname, 'design');
const CHECK = process.argv.includes('--check');

// Generated or machine-local; never worth committing.
const SKIP_DIRS = new Set(['node_modules', '.git', 'inbox']);
const SKIP_FILES = new Set(['.DS_Store', 'Thumbs.db']);

if (!fs.existsSync(path.join(SRC, '00-model.md'))) {
  console.error(`sync-design: ${SRC} does not look like the design database (no 00-model.md).`);
  process.exit(1);
}

let copied = 0, skipped = 0, bytes = 0;

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

'use strict';
/**
 * Copy the studio server out of the vault into server/ before packaging.
 *
 * The vault is the single source of truth: D:/Memory/design/tools holds lib.js, studio.js
 * and the ui/ folder, and the MCP server shares that same lib. Bundling a copy keeps the
 * packaged app self-contained without a second implementation to drift.
 *
 * Override the source with DESIGN_TOOLS if the vault ever moves.
 */
const fs = require('fs');
const path = require('path');

const SRC = process.env.DESIGN_TOOLS || 'D:/Memory/design/tools';
const OUT = path.join(__dirname, 'server');

if (!fs.existsSync(path.join(SRC, 'studio.js'))) {
  console.error(`sync-server: no studio.js under ${SRC}\n` +
    'Set DESIGN_TOOLS to the vault\'s design/tools folder.');
  process.exit(1);
}

function copyTree(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, entry.name);
    const d = path.join(to, entry.name);
    if (entry.isDirectory()) copyTree(s, d);
    else fs.copyFileSync(s, d);
  }
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
for (const f of ['lib.js', 'studio.js']) fs.copyFileSync(path.join(SRC, f), path.join(OUT, f));
copyTree(path.join(SRC, 'ui'), path.join(OUT, 'ui'));

const files = fs.readdirSync(OUT).length + fs.readdirSync(path.join(OUT, 'ui')).length;
console.log(`sync-server: copied ${files} files from ${SRC}`);

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

/**
 * Where the server comes from: DESIGN_TOOLS wins; otherwise the vault's
 * D:/Memory/design/tools when it exists (Windows); otherwise the design/tools
 * snapshot in this repo, so the app builds with no setup on a machine that has
 * no vault at all. The vault stays the single source of truth wherever it is.
 */
function pickTools() {
  if (process.env.DESIGN_TOOLS) return process.env.DESIGN_TOOLS;
  const win = 'D:/Memory/design/tools';
  if (fs.existsSync(path.join(win, 'studio.js'))) return win;
  return path.join(__dirname, 'design', 'tools');
}

const SRC = pickTools();
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

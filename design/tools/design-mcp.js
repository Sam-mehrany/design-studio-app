#!/usr/bin/env node
/**
 * design-mcp — the Design Studio MCP service over stdio.
 *
 * For Claude Code / Claude Desktop on the machine that holds the vault. Every tool lives in
 * mcp-tools.js, shared with the studio's HTTP endpoint (/mcp), so the two cannot drift.
 * Zero dependencies: newline-delimited JSON-RPC on stdin/stdout. Logs go to stderr only —
 * stdout is the protocol.
 *
 *   claude mcp add design-db -- node /path/to/design/tools/design-mcp.js
 *
 * Root resolves to this file's parent folder (design/), overridable with DESIGN_VAULT.
 * Set DESIGN_STUDIO_URL (e.g. http://127.0.0.1:7391) to get studio links in tool output.
 */

'use strict';
const { handleMessage } = require('./mcp-tools.js');

const ctx = { who: 'mcp', baseUrl: process.env.DESIGN_STUDIO_URL || null };
const send = (msg) => process.stdout.write(JSON.stringify(msg) + '\n');

function dispatch(parsed) {
  if (Array.isArray(parsed)) {             // JSON-RPC batch (2025-03-26)
    const out = parsed.map((m) => handleMessage(m, ctx)).filter(Boolean);
    if (out.length) send(out);
    return;
  }
  const res = handleMessage(parsed, ctx);
  if (res) send(res);
}

let buf = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  buf += chunk;
  let nl;
  while ((nl = buf.indexOf('\n')) !== -1) {
    const line = buf.slice(0, nl).trim();
    buf = buf.slice(nl + 1);
    if (!line) continue;
    let parsed;
    try { parsed = JSON.parse(line); } catch (e) {
      send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: `Parse error: ${e.message}` } });
      continue;
    }
    dispatch(parsed);
  }
});
process.stdin.on('end', () => process.exit(0));

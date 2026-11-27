#!/usr/bin/env node
'use strict';
/**
 * design-studio — a local interface for the design reference library.
 *
 * Zero dependencies: Node's own http module, serving a vanilla front end and a small
 * JSON API over the same markdown the MCP server reads (tools/lib.js is the only parser).
 *
 *   node studio.js [--port 7391] [--open]
 *   DESIGN_VAULT=<dir> node studio.js      # point at a fixture vault
 *
 * Safety: binds to 127.0.0.1 only; every read and write path is resolved and must stay
 * inside the design/ folder; writes touch only whitelisted frontmatter keys and the inbox;
 * each record write is committed to git when the vault is a repo.
 */

const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const lib = require('./lib.js');
const auth = require('./auth.js');

const ROOT = lib.ROOT;

/**
 * Serve the UI from the vault when it is there, falling back to the copy bundled beside
 * this file. In the packaged app the bundled copy lives inside the asar, so without this a
 * one-line CSS fix would need a full rebuild and reinstall. The vault is the source of
 * truth for the server anyway (sync-server.js copies from it), so preferring it keeps the
 * app and the vault from drifting and makes UI changes a reload instead of a release.
 */
const UI = (() => {
  const live = path.join(ROOT, 'tools', 'ui');
  try { if (fs.existsSync(path.join(live, 'index.html'))) return live; } catch { /* fall through */ }
  return path.join(__dirname, 'ui');
})();
const PORT = (() => {
  const i = process.argv.indexOf('--port');
  if (i !== -1) return Number(process.argv[i + 1]);
  return Number(process.env.PORT) || 7391;
})();
/** 127.0.0.1 for the desktop app; 0.0.0.0 (STUDIO_HOST) when hosted so the platform's proxy can reach it. */
const HOST = process.env.STUDIO_HOST || '127.0.0.1';
const PUBLIC = !['127.0.0.1', 'localhost', '::1'].includes(HOST);
if (PUBLIC && !auth.enabled) {
  console.error('Refusing to listen on ' + HOST + ' without a password. Set STUDIO_PASSWORD_HASH ' +
    '(node design/tools/set-password.js) or STUDIO_PASSWORD.');
  process.exit(1);
}

/* ---------- writes: one shared writer for the studio and both MCP transports ---------- */

const { safePath, gitAvailable, updateRecord, queueReason } = require('./vault-write.js');
const mcp = require('./mcp-tools.js');

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.avif': 'image/avif',
};
const IMAGE_EXT = new Set(['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif']);

/* ---------- API ---------- */

const refs = () => lib.records('design-ref');

/** Models offered for analysis. Ordered cheapest-first within each tier. */
const MODELS = [
  { id: 'hark', name: 'Hark', note: 'analysed by Hark in your chat, following design-ingest', default: true },
];
const MODEL_IDS = new Set(MODELS.map((m) => m.id));

function inboxCount() {
  const dir = path.join(ROOT, 'references', 'inbox');
  if (!fs.existsSync(dir)) return { count: 0, files: [] };
  const files = fs.readdirSync(dir)
    .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
    .map((f) => {
      let size = 0, mtime = 0;
      try { const st = fs.statSync(path.join(dir, f)); size = st.size; mtime = st.mtimeMs; } catch { /* ignore */ }
      return { name: f, size, mtime, url: '/img/inbox/' + encodeURIComponent(f) };
    })
    .sort((a, b) => a.mtime - b.mtime);
  return { count: files.length, files };
}

function overview() {
  const all = refs();
  const facetMeta = Object.keys(lib.FACET_NAMES).map((L) => {
    const f = lib.parseFacet(L);
    return {
      letter: L, name: lib.FACET_NAMES[L],
      dimensions: f ? f.dimensions.map((d) => ({
        id: d.id, name: d.name,
        terms: d.terms.map((t) => ({ id: t.id, name: t.name, definition: t.definition, stance: t.stance || null })),
      })) : [],
    };
  });
  const prefs = lib.records('design-pref').map((p) => ({
    id: p.id, title: p.title, polarity: p.polarity, scope: p.scope, facets: lib.asList(p.facets),
  }));
  const briefs = lib.records('design-brief').map((b) => ({
    id: b.id, project: b.project, surface: b.surface, status: b.status, dna: b.dna,
  }));
  return {
    root: ROOT,
    counts: {
      refs: all.length,
      unreviewed: all.filter((r) => r.status === 'unreviewed').length,
      liked: all.filter((r) => r.sam_reaction === 'like').length,
      disliked: all.filter((r) => r.sam_reaction === 'dislike').length,
      inbox: inboxCount().count,
    },
    facets: facetMeta,
    prefs, briefs,
    gitTracked: gitAvailable,
  };
}

function refList() {
  return refs().map((r) => ({
    id: r.id, title: r.title, source: r.source, kind: r.kind, image: r.image,
    concept: lib.conceptOf(r), captured: r.captured || '',
    archetype: lib.asList(r.archetype), facets: lib.asList(r.facets),
    imagery_dep: r.imagery_dep, rtl: r.rtl, cost: r.cost, verdict: r.verdict,
    status: r.status, confidence: r.confidence,
    sam_reaction: r.sam_reaction || '', sam_note: r.sam_note || '',
    file: r._file,
  }));
}

function refDetail(id) {
  const all = refs();
  const r = all.find((x) => String(x.id) === String(id));
  if (!r) return null;
  const known = lib.termIndex();
  const describe = (t) => {
    const hit = known.get(String(t).toLowerCase());
    return { id: t, name: hit ? hit.name : '', definition: hit ? hit.definition : '', stance: hit ? hit.stance || null : null, valid: !!hit };
  };
  return {
    ...r,
    _body: undefined,
    read: lib.section(r._body, 'Read'),
    why: lib.section(r._body, 'Why the verdict'),
    notes: lib.section(r._body, 'Notes'),
    facetDetail: lib.asList(r.facets).map(describe),
    archetypeDetail: lib.asList(r.archetype).map(describe),
    neighbours: lib.neighbours(r.id, all, 8),
    file: r._file,
  };
}

function graph() {
  const all = refs();
  const e = lib.edges(all, 0.2, 5);
  return {
    nodes: all.map((r) => ({
      id: r.id, title: r.title, kind: r.kind, verdict: r.verdict,
      concept: lib.conceptOf(r),
      archetype: lib.asList(r.archetype)[0] || '', image: r.image,
      reaction: r.sam_reaction || '', terms: lib.asList(r.facets).length,
    })),
    edges: e.map((x) => ({ source: x.a, target: x.b, score: Number(x.score.toFixed(3)) })),
  };
}

/**
 * Find a spawnable Claude CLI. On Windows the PATH entry is `claude.cmd`, which Node
 * refuses to execFile without a shell — so prefer the real `claude.exe` the npm package
 * ships, and fall back to the bare name on platforms where that just works.
 */
function claudeBinary() {
  const candidates = [];
  const appData = process.env.APPDATA;
  if (appData) candidates.push(path.join(appData, 'npm', 'node_modules', '@anthropic-ai', 'claude-code', 'bin', 'claude.exe'));
  if (process.env.LOCALAPPDATA) candidates.push(path.join(process.env.LOCALAPPDATA, 'node_modules', '@anthropic-ai', 'claude-code', 'bin', 'claude.exe'));
  const home = process.env.HOME || process.env.USERPROFILE;
  if (home) {
    candidates.push(path.join(home, '.npm-global', 'lib', 'node_modules', '@anthropic-ai', 'claude-code', 'bin', 'claude'));
    candidates.push(path.join(home, '.local', 'bin', 'claude'));
  }
  for (const c of candidates) { try { if (fs.existsSync(c)) return c; } catch { /* keep looking */ } }
  // A Claude CLI on PATH (for example /usr/bin/claude on Linux) — resolve it so
  // the ingest log names the real binary instead of the bare command. Only the
  // bare name is matched, so on Windows claude.cmd is never picked up here and
  // the behaviour there is unchanged.
  for (const dir of String(process.env.PATH || '').split(path.delimiter)) {
    if (!dir) continue;
    const c = path.join(dir, 'claude');
    try { if (fs.existsSync(c) && fs.statSync(c).isFile()) return c; } catch { /* keep looking */ }
  }
  return 'claude';
}

/** Run /design-ingest headlessly over the inbox via `claude -p`. */
let ingestJob = null;
function startIngest(model) {
  if (ingestJob && ingestJob.running) return { ok: false, error: 'an ingest is already running' };
  const { count } = inboxCount();
  if (!count) return { ok: false, error: 'the inbox is empty' };
  if (model && !MODEL_IDS.has(model)) return { ok: false, error: `unknown model: ${model}` };
  const chosen = model || MODELS.find((m) => m.default).id;
  if (chosen === 'hark') {
    const req = path.join(ROOT, 'references', 'inbox', '.hark-request.json');
    fs.writeFileSync(req, JSON.stringify({ requested: new Date().toISOString(), count }, null, 2));
    ingestJob = { running: false, started: Date.now(), count, log: [`queued ${count} image(s) for Hark`], code: 0, model: 'Hark',
      hint: null, queued: true };
    return { ok: true, count, queued: true };
  }
  const log = [];
  ingestJob = { running: true, started: Date.now(), count, log, code: null, model: chosen };
  const args = [
    '-p', `/design-ingest ${path.join(ROOT, 'references', 'inbox')}`,
    '--model', chosen,
    '--permission-mode', 'acceptEdits',
    '--output-format', 'json',
    '--allowedTools', 'Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep',
  ];
  const bin = claudeBinary();
  log.push(`spawning: ${bin}`);
  const child = execFile(bin, args, { cwd: ROOT, maxBuffer: 1 << 24 }, (err, stdout, stderr) => {
    ingestJob.running = false;
    ingestJob.code = err ? (err.code ?? 1) : 0;
    if (err && (err.code === 'ENOENT' || err.code === 'EINVAL')) {
      ingestJob.hint = `Could not launch the Claude CLI (${err.code}) at ${bin}. Run /design-ingest inside a Claude Code session instead.`;
    }
    // `claude -p` exits 0 even when the run itself failed, so read its own verdict.
    let parsed = null;
    try { parsed = JSON.parse(String(stdout || '')); } catch { /* not json */ }
    if (parsed) {
      if (parsed.is_error) {
        ingestJob.code = 1;
        const msg = String(parsed.result || parsed.terminal_reason || 'unknown failure');
        ingestJob.hint = /authenticate|oauth|login/i.test(msg)
          ? 'The Claude CLI could not authenticate on its own. Run `claude` once in a terminal to refresh its login, then try again — or just run `/design-ingest` inside a Claude Code session, which always works.'
          : null;
        log.push(msg);
      } else if (parsed.result) {
        log.push(String(parsed.result).slice(-4000));
      }
    } else if (stdout) {
      log.push(String(stdout).slice(-4000));
    }
    if (stderr) log.push(String(stderr).slice(-2000));
    if (err && !stdout && !stderr) log.push(String(err.message));
  });
  ingestJob.pid = child.pid;
  return { ok: true, count };
}

function ingestState() {
  return ingestJob
    ? {
      running: ingestJob.running, count: ingestJob.count, code: ingestJob.code,
      model: ingestJob.model || null, queued: !!ingestJob.queued,
      hint: ingestJob.hint || null, log: ingestJob.log.join('\n').slice(-4000),
    }
    : { running: false };
}

/* ---------- HTTP ---------- */

const json = (res, code, body) => {
  const s = JSON.stringify(body);
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'content-length': Buffer.byteLength(s) });
  res.end(s);
};

function serveFile(res, file, cache) {
  fs.readFile(file, (err, buf) => {
    if (err) { json(res, 404, { error: 'not found' }); return; }
    res.writeHead(200, {
      'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'content-length': buf.length,
      'cache-control': cache || 'no-cache',
    });
    res.end(buf);
  });
}

function readBody(req, limit = 32 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) { reject(new Error('body too large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

/**
 * Binding to 127.0.0.1 does NOT stop a web page the user is browsing from POSTing here:
 * a `text/plain` POST is a "simple request" and skips the preflight, and DNS rebinding
 * defeats the loopback bind. So: pin the Host header, refuse any foreign Origin, and
 * require a custom header on writes — a custom header forces a preflight, which we fail.
 */
const ALLOWED_HOSTS = new Set([`127.0.0.1:${PORT}`, `localhost:${PORT}`, `[::1]:${PORT}`]);
// Extra hosts (e.g. a tunnel) allowed via env, comma-separated.
// Render, Railway and Fly publish the app's own hostname; trust it without extra setup.
for (const h of [process.env.RENDER_EXTERNAL_HOSTNAME, process.env.RAILWAY_PUBLIC_DOMAIN,
  process.env.FLY_APP_NAME && `${process.env.FLY_APP_NAME}.fly.dev`]) if (h) ALLOWED_HOSTS.add(h);
for (const h of String(process.env.STUDIO_EXTRA_HOSTS || '').split(',').map(x => x.trim()).filter(Boolean)) ALLOWED_HOSTS.add(h);

function guard(req, res) {
  const host = String(req.headers.host || '');
  if (!ALLOWED_HOSTS.has(host)) {
    json(res, 403, { error: `unexpected Host header: ${host || '(none)'}` });
    return false;
  }
  const origin = req.headers.origin;
  if (origin && !ALLOWED_HOSTS.has(origin.replace(/^https?:\/\//, ''))) {
    json(res, 403, { error: 'cross-origin request refused' });
    return false;
  }
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.headers['x-studio'] !== '1') {
    json(res, 403, { error: 'missing X-Studio header — writes only come from the studio UI' });
    return false;
  }
  return true;
}

/* ---------- MCP over HTTP (Streamable HTTP, stateless, JSON responses) ----------
 *
 * The same tools as the stdio server (mcp-tools.js), for Claude clients that cannot spawn a
 * process on this machine: a cloud session, claude.ai, the phone. It skips the X-Studio
 * header (MCP clients do not send it) and is guarded by a token instead:
 *
 *   STUDIO_MCP_TOKEN   required whenever the studio is hosted or has a password.
 *                      Sent as `Authorization: Bearer <token>`, or in the path as
 *                      /mcp/<token> for clients that cannot set headers (claude.ai).
 *   With no token and a local, password-less studio, /mcp answers direct loopback
 *   connections only — anything forwarded by a tunnel or proxy is refused.
 */
const MCP_TOKEN = String(process.env.STUDIO_MCP_TOKEN || '').trim();
const MCP_PROTOCOLS = new Set(mcp.SUPPORTED_PROTOCOLS);

function sameSecret(a, b) {
  const x = crypto.createHash('sha256').update(String(a)).digest();
  const y = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
}

/** Returns null when the request may use MCP, else [status, message]. */
function mcpDenied(req, route) {
  let pathToken = '';
  if (route.startsWith('/mcp/')) {
    try { pathToken = decodeURIComponent(route.slice('/mcp/'.length)); } catch { pathToken = ''; }
  }
  const bearer = (/^Bearer\s+(.+)$/i.exec(String(req.headers.authorization || '')) || [])[1];
  const given = (bearer || pathToken || '').trim();
  if (MCP_TOKEN) {
    const wait = auth.lockedFor(req);
    if (wait) return [429, `Too many failed attempts. Try again in ${Math.ceil(wait / 60)} min.`];
    if (!given) return [401, 'MCP token required: Authorization: Bearer <token>, or the /mcp/<token> URL.'];
    if (!sameSecret(given, MCP_TOKEN)) { auth.recordMiss(req); return [401, 'Wrong MCP token.']; }
    auth.clearMisses(req);
    return null;
  }
  if (PUBLIC || auth.enabled) {
    return [403, 'MCP is off on a hosted or password-protected studio until STUDIO_MCP_TOKEN is set.'];
  }
  if (given) return [401, 'This studio has no MCP token configured; connect to /mcp without one.'];
  // Tokenless MCP is for this machine only. A tunnel (cloudflared, ngrok, a reverse proxy)
  // runs locally and forwards the internet as loopback connections, so also refuse anything
  // that carries forwarding headers: remote use always needs the token.
  const loopback = ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress);
  const proxied = ['x-forwarded-for', 'forwarded', 'x-real-ip', 'cf-connecting-ip', 'x-forwarded-host', 'true-client-ip']
    .some((h) => req.headers[h] !== undefined);
  if (!loopback || proxied) {
    return [403, 'This request came through a proxy or tunnel. Set STUDIO_MCP_TOKEN to use MCP from outside this machine.'];
  }
  return null;
}

async function handleMcp(req, res, route) {
  const reply = (code, body, headers = {}) => {
    const s = body === undefined ? '' : JSON.stringify(body);
    res.writeHead(code, {
      'cache-control': 'no-store',
      ...(s ? { 'content-type': 'application/json; charset=utf-8', 'content-length': Buffer.byteLength(s) } : {}),
      ...headers,
    });
    res.end(s);
  };
  // DNS-rebinding and browser defences, same as the rest of the API.
  const host = String(req.headers.host || '');
  if (!ALLOWED_HOSTS.has(host)) {
    return reply(403, { jsonrpc: '2.0', id: null, error: { code: -32000, message: `unexpected Host header: ${host || '(none)'} — add it to STUDIO_EXTRA_HOSTS` } });
  }
  const origin = req.headers.origin;
  if (origin && !ALLOWED_HOSTS.has(origin.replace(/^https?:\/\//, ''))) {
    return reply(403, { jsonrpc: '2.0', id: null, error: { code: -32000, message: 'cross-origin request refused' } });
  }
  const denied = mcpDenied(req, route);
  if (denied) {
    return reply(denied[0], { jsonrpc: '2.0', id: null, error: { code: -32001, message: denied[1] } },
      denied[0] === 401 ? { 'www-authenticate': 'Bearer realm="design-studio"' } : {});
  }
  // Stateless server: no SSE stream to open and no session to end.
  if (req.method !== 'POST') {
    return reply(405, { jsonrpc: '2.0', id: null, error: { code: -32000, message: 'Use POST. This server has no SSE stream or sessions.' } }, { allow: 'POST' });
  }
  const pv = req.headers['mcp-protocol-version'];
  if (pv && !MCP_PROTOCOLS.has(String(pv))) {
    return reply(400, { jsonrpc: '2.0', id: null, error: { code: -32000, message: `Unsupported MCP-Protocol-Version: ${pv}` } });
  }
  let parsed;
  try {
    parsed = JSON.parse((await readBody(req, 4 << 20)).toString('utf8'));
  } catch (e) {
    return reply(400, { jsonrpc: '2.0', id: null, error: { code: -32700, message: `Parse error: ${e.message}` } });
  }
  const proto = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim() || (req.socket.encrypted ? 'https' : 'http');
  const ctx = { who: 'mcp', baseUrl: `${proto}://${host}`, ingestStatus: ingestState };
  const batch = Array.isArray(parsed);
  const out = (batch ? parsed : [parsed]).map((m) => mcp.handleMessage(m, ctx)).filter(Boolean);
  if (!out.length) return reply(202);           // only notifications / responses: accepted, no body
  return reply(200, batch ? out : out[0]);
}

const server = http.createServer(async (req, res) => {
  let url;
  try { url = new URL(req.url, 'http://127.0.0.1'); } catch { json(res, 400, { error: 'bad url' }); return; }
  const route = url.pathname;
  if (route === '/healthz') return json(res, 200, { ok: true });  // platform health checks use internal hosts
  if (route === '/mcp' || route.startsWith('/mcp/')) return handleMcp(req, res, route);
  if (!guard(req, res)) return;

  try {
    /* --- sign-in --- */
    if (route === '/login' || route === '/login.html') {
      if (!auth.enabled || auth.isAuthed(req)) { res.writeHead(302, { location: '/' }); return res.end(); }
      return serveFile(res, path.join(UI, 'login.html'));
    }
    if (route === '/api/login' && req.method === 'POST') {
      if (!auth.enabled) return json(res, 200, { ok: true });
      const wait = auth.lockedFor(req);
      if (wait) return json(res, 429, { error: `Too many attempts. Try again in ${Math.ceil(wait / 60)} min.` });
      const body = JSON.parse((await readBody(req, 1 << 12)).toString('utf8') || '{}');
      if (!auth.checkPassword(body.password)) {
        auth.recordMiss(req);
        return json(res, 401, { error: 'Wrong password.' });
      }
      auth.clearMisses(req);
      res.setHeader('set-cookie', auth.sessionCookie(req));
      return json(res, 200, { ok: true });
    }
    if (route === '/api/logout' && req.method === 'POST') {
      res.setHeader('set-cookie', auth.clearCookie(req));
      return json(res, 200, { ok: true });
    }
    if (route === '/api/session') return json(res, 200, { auth: auth.enabled, signedIn: auth.isAuthed(req) });
    if (!auth.isAuthed(req)) {
      if (route.startsWith('/api/') || route.startsWith('/img/')) return json(res, 401, { error: 'sign in required' });
      res.writeHead(302, { location: '/login' + (route === '/' ? '' : `?next=${encodeURIComponent(route)}`) });
      return res.end();
    }

    /* --- API --- */
    if (route === '/api/overview') return json(res, 200, overview());
    if (route === '/api/refs') return json(res, 200, { refs: refList() });
    if (route === '/api/graph') return json(res, 200, graph());
    if (route === '/api/inbox') return json(res, 200, inboxCount());
    if (route === '/api/candidates') {
      return json(res, 200, { candidates: lib.candidatePrefs(refs(), 3, 0.7) });
    }
    if (route.startsWith('/api/ref/')) {
      const id = decodeURIComponent(route.slice('/api/ref/'.length));
      if (req.method === 'GET') {
        const d = refDetail(id);
        return d ? json(res, 200, d) : json(res, 404, { error: 'no such record' });
      }
      if (req.method === 'POST') {
        const body = JSON.parse((await readBody(req, 1 << 20)).toString('utf8') || '{}');
        const fm = updateRecord(id, body);
        return json(res, 200, { ok: true, record: fm });
      }
    }
    if (route === '/api/candidate-reason' && req.method === 'POST') {
      const body = JSON.parse((await readBody(req, 1 << 20)).toString('utf8') || '{}');
      const file = queueReason({ term: body.term, leaning: body.leaning, refs: body.refs, reason: body.reason }, 'studio');
      return json(res, 200, { ok: true, file });
    }
    if (route === '/api/models') return json(res, 200, { models: MODELS });
    if (route === '/api/inbox/remove' && req.method === 'POST') {
      const body = JSON.parse((await readBody(req, 1 << 16)).toString('utf8') || '{}');
      const name = path.basename(String(body.name || ''));
      if (!name || !IMAGE_EXT.has(path.extname(name).toLowerCase())) return json(res, 400, { error: 'not an inbox image' });
      const file = safePath(path.join('references', 'inbox', name));
      if (!fs.existsSync(file)) return json(res, 404, { error: 'no such file' });
      fs.unlinkSync(file);
      return json(res, 200, { ok: true, removed: name, inbox: inboxCount().count });
    }
    if (route === '/api/ingest' && req.method === 'POST') {
      const body = JSON.parse((await readBody(req, 1 << 16)).toString('utf8') || '{}');
      return json(res, 200, startIngest(body.model));
    }
    if (route === '/api/ingest/status') return json(res, 200, ingestState());
    if (route === '/api/upload' && req.method === 'POST') {
      const name = path.basename(String(url.searchParams.get('name') || 'drop.png'));
      const ext = path.extname(name).toLowerCase();
      if (!IMAGE_EXT.has(ext)) return json(res, 400, { error: `unsupported file type: ${ext || '(none)'}` });
      const buf = await readBody(req);
      const dir = safePath(path.join('references', 'inbox'));
      fs.mkdirSync(dir, { recursive: true });
      let target = path.join(dir, name);
      let i = 1;
      while (fs.existsSync(target)) target = path.join(dir, `${path.basename(name, ext)}-${i++}${ext}`);
      fs.writeFileSync(target, buf);
      return json(res, 200, { ok: true, saved: path.basename(target), inbox: inboxCount().count });
    }

    /* --- images from the library and inbox --- */
    if (route.startsWith('/img/')) {
      const rel = decodeURIComponent(route.slice('/img/'.length));
      const file = safePath(path.join('references', rel));
      if (!IMAGE_EXT.has(path.extname(file).toLowerCase())) return json(res, 400, { error: 'not an image' });
      return serveFile(res, file, 'public, max-age=300');
    }

    /* --- the UI --- */
    if (route === '/' || route === '/index.html') return serveFile(res, path.join(UI, 'index.html'));
    const uiFile = path.resolve(UI, route.replace(/^\/+/, ''));
    if (uiFile.startsWith(UI + path.sep) && fs.existsSync(uiFile)) return serveFile(res, uiFile);

    return json(res, 404, { error: 'not found', route });
  } catch (e) {
    return json(res, 400, { error: e.message });
  }
});

server.listen(PORT, HOST, () => {
  const { count } = inboxCount();
  process.stdout.write(
    `design-studio on http://${HOST}:${PORT}${auth.enabled ? '  (login on)' : ''}\n` +
    `  vault:  ${ROOT}\n` +
    `  ui:     ${UI}${UI.startsWith(ROOT) ? '  (live from the vault)' : '  (bundled)'}\n` +
    `  refs:   ${refs().length}    inbox: ${count}    git: ${gitAvailable ? 'yes' : 'no'}\n` +
    `  mcp:    http://${HOST}:${PORT}/mcp  ${MCP_TOKEN ? '(token required)' : (PUBLIC || auth.enabled) ? '(off: set STUDIO_MCP_TOKEN)' : '(local, no token)'}\n`
  );
});

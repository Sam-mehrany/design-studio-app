#!/usr/bin/env node
'use strict';
/**
 * Pinterest → Design Studio agent. One run:
 *
 *   1. SYNC     (plain code)  pinterest-sync.js downloads new pins into references/inbox/
 *   2. ANALYSE  (the agent)   for each inbox image, the model loop in loop.js writes a REF
 *   3. INDEX    (plain code)  regenerate references/index.md
 *   4. COMMIT   (plain code)  git commit in the vault, if it is a git repo
 *
 * Only step 2 needs judgement, so only step 2 is an agent. Everything that can be
 * deterministic is — that is the first rule of building agents that run unattended.
 *
 *   node src/run.js                 full run (what the daily schedule calls)
 *   node src/run.js --check         only report which pins are new; change nothing
 *   node src/run.js --doctor        check the model, the key/Ollama, the vault
 *   node src/run.js --preview       analyse inbox images into runs/ — the vault is untouched
 *   node src/run.js --compare       --preview with BOTH models on the same images
 *   options: --provider ollama|claude   --image <file>   --limit <n>   --no-sync
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const AGENT_DIR = path.resolve(__dirname, '..');
const REPO = path.resolve(AGENT_DIR, '..');
const envFile = path.join(AGENT_DIR, '.env');
if (fs.existsSync(envFile) && process.loadEnvFile) process.loadEnvFile(envFile);

const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const opt = (f, d) => { const i = args.indexOf(f); return i >= 0 && args[i + 1] ? args[i + 1] : d; };

const VAULT = path.resolve(process.env.DESIGN_VAULT || path.join(REPO, 'design'));
process.env.DESIGN_VAULT = VAULT; // lib.js reads this when it loads, so set it first
const REPO_TOOLS = path.join(REPO, 'design', 'tools');
const lib = require(path.join(REPO_TOOLS, 'lib.js'));

const { runAgent } = require('./loop');
const { systemPrompt, firstMessage } = require('./prompt');
const img = require('./image');
const { createClaudeAdapter } = require('./adapters/claude');
const { createOllamaAdapter } = require('./adapters/ollama');

const INBOX = path.join(VAULT, 'references', 'inbox');
const LEDGER = path.join(VAULT, 'references', 'pinterest-seen.json');
const ledgerHelp = () => `no ${LEDGER} — copy it from ${path.join(REPO, 'design', 'references')}. Without it, pins from records that predate pin IDs look new and would be ingested again.`;
const STAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const RUN_DIR = path.join(AGENT_DIR, 'runs', STAMP);
const PREVIEW = flag('--preview') || flag('--compare');

function makeAdapter(name) {
  if (name === 'claude') {
    return createClaudeAdapter({ model: process.env.CLAUDE_MODEL || 'claude-opus-5-5', effort: process.env.CLAUDE_EFFORT || 'high' });
  }
  if (name === 'ollama') {
    return createOllamaAdapter({
      model: process.env.OLLAMA_MODEL || 'qwen3-vl:8b',
      host: process.env.OLLAMA_HOST || 'http://127.0.0.1:11434',
      numCtx: Number(process.env.OLLAMA_NUM_CTX || 32768),
      think: process.env.OLLAMA_THINK === undefined ? undefined : process.env.OLLAMA_THINK === '1',
    });
  }
  if (name === 'fake') return require('../test/fake-adapter').createFakeAdapter(); // tests only
  throw new Error(`unknown provider "${name}" — use ollama or claude`);
}

const providers = flag('--compare') ? ['ollama', 'claude'] : [opt('--provider', process.env.AGENT_PROVIDER || 'ollama')];

function say(...a) { console.log(...a); }

function sync(dry) {
  const r = spawnSync(process.execPath, [path.join(REPO_TOOLS, 'pinterest-sync.js'), ...(dry ? ['--dry-run'] : [])], {
    env: { ...process.env, DESIGN_VAULT: VAULT }, encoding: 'utf8',
  });
  process.stdout.write(r.stdout || '');
  if (r.status !== 0) throw new Error(`pinterest-sync failed: ${(r.stderr || '').trim()}`);
}

function inboxPins() {
  const user = (() => { try { return JSON.parse(fs.readFileSync(path.join(VAULT, 'references', 'pinterest-seen.json'), 'utf8')).user; } catch { return null; } })();
  const files = opt('--image') ? [path.resolve(opt('--image'))]
    : fs.existsSync(INBOX) ? fs.readdirSync(INBOX).sort().map((f) => path.join(INBOX, f)).filter(img.isImage) : [];
  return files.slice(0, Number(opt('--limit', process.env.AGENT_MAX_PINS || 10))).map((file) => {
    const sidecarFile = file.replace(/\.[a-z]+$/i, '.json');
    let sidecar = null;
    try { sidecar = JSON.parse(fs.readFileSync(sidecarFile, 'utf8')); } catch { /* not from Pinterest */ }
    return { file, sidecarFile, sidecar, user };
  });
}

async function doctor() {
  let ok = true;
  const line = (good, what) => { say(`  ${good ? 'ok ' : 'XX '} ${what}`); if (!good) ok = false; };
  say(`Vault: ${VAULT}`);
  line(fs.existsSync(path.join(VAULT, '00-model.md')), 'vault looks like a Design Studio vault');
  line(lib.allTerms().length > 100, `vocabulary loaded (${lib.allTerms().length} terms)`);
  try { systemPrompt({ lib, vault: VAULT, repoTools: REPO_TOOLS }); line(true, 'ingest skill found (Mode 1)'); } catch (e) { line(false, e.message); }
  line(fs.existsSync(LEDGER), fs.existsSync(LEDGER) ? 'pin ledger found (pinterest-seen.json)' : ledgerHelp());
  const git = spawnSync('git', ['-C', VAULT, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' });
  say(`  ${git.status === 0 ? 'ok ' : '-- '} git: ${git.status === 0 ? git.stdout.trim() : 'vault is not in a git repo — runs will not commit'}`);
  for (const p of flag('--compare') ? ['ollama', 'claude'] : providers) {
    const d = await makeAdapter(p).doctor();
    line(d.ok, `${p}: ${d.ok ? d.info : d.problem}`);
  }
  return ok;
}

function commit(written, label) {
  if (process.env.AGENT_GIT_COMMIT === '0') return 'commit skipped (AGENT_GIT_COMMIT=0)';
  const top = spawnSync('git', ['-C', VAULT, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' });
  if (top.status !== 0) return 'vault is not a git repo — nothing committed';
  const refsDir = path.join(VAULT, 'references');
  spawnSync('git', ['-C', VAULT, 'add', '-A', '--', refsDir], { encoding: 'utf8' });
  const ids = written.map((w) => w.id).sort();
  const span = ids.length ? ` (${ids[0]}${ids.length > 1 ? '–' + ids[ids.length - 1] : ''})` : '';
  const msg = `Ingest ${ids.length} ref${ids.length === 1 ? '' : 's'}${span} from Pinterest, analysed by ${label}`;
  const c = spawnSync('git', ['-C', VAULT, 'commit', '-m', msg, '--', refsDir], { encoding: 'utf8' });
  if (c.status !== 0) return `git commit failed: ${(c.stderr || c.stdout).trim().split('\n').pop()}`;
  if (process.env.AGENT_GIT_PUSH === '1') {
    const p = spawnSync('git', ['-C', VAULT, 'push'], { encoding: 'utf8' });
    return p.status === 0 ? `committed and pushed: ${msg}` : `committed (push failed: ${(p.stderr || '').trim().split('\n').pop()})`;
  }
  return `committed: ${msg}`;
}

/** One lock per vault, so a slow run and the next scheduled one never ingest at the same time. */
function lock() {
  const file = path.join(AGENT_DIR, 'runs', '.lock');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  try {
    const age = Date.now() - fs.statSync(file).mtimeMs;
    if (age < 3 * 3600 * 1000) throw new Error(`another run holds ${file} (started ${Math.round(age / 60000)} min ago) — delete it if that run is dead`);
  } catch (e) { if (e.code !== 'ENOENT') throw e; }
  fs.writeFileSync(file, String(process.pid));
  return () => { try { fs.unlinkSync(file); } catch { /* already gone */ } };
}

async function main() {
  if (flag('--doctor')) process.exit((await doctor()) ? 0 : 1);
  if (!fs.existsSync(LEDGER) && !flag('--doctor')) throw new Error(ledgerHelp());
  if (flag('--check')) { sync(true); return; }

  const release = PREVIEW ? () => {} : lock();
  try {
    if (!PREVIEW && !flag('--no-sync') && !opt('--image')) sync(false);
    if (!PREVIEW && opt('--image') && path.dirname(path.resolve(opt('--image'))) !== INBOX) {
      throw new Error('--image outside the inbox only works with --preview or --compare (a real run moves the file into the library)');
    }
    const pins = inboxPins();
    if (!pins.length) { say(PREVIEW ? 'Inbox is empty — pass --image <file> to preview any image.' : 'Nothing to analyse.'); return; }

    fs.mkdirSync(RUN_DIR, { recursive: true });
    const results = [];
    for (const provider of providers) {
      const adapter = makeAdapter(provider);
      const label = `${provider}:${adapter.model}`;
      const vocab = process.env.AGENT_VOCAB || 'full';
      const system = systemPrompt({ lib, vault: VAULT, repoTools: REPO_TOOLS, vocab });
      say(`\n${label} — ${pins.length} image(s)${PREVIEW ? ' (preview: the vault is not changed)' : ''}`);

      for (const pin of pins) {
        const name = path.basename(pin.file);
        const transcript = path.join(RUN_DIR, `${provider}-${name}.jsonl`);
        const log = (e) => fs.appendFileSync(transcript, JSON.stringify({ t: new Date().toISOString(), ...e }) + '\n');
        const ctx = {
          lib, vault: VAULT, pin, mode: PREVIEW ? 'preview' : 'vault', outDir: RUN_DIR, label: provider,
          measured: new Set(), result: null,
        };
        const started = Date.now();
        let out;
        try {
          const meta = await img.meta(pin.file);
          out = await runAgent({ adapter, system, userText: firstMessage(pin, meta), image: await img.forModel(pin.file), ctx, log });
        } catch (e) {
          out = { ok: false, reason: e.message, turns: 0, usage: {} };
          log({ role: 'error', text: e.stack || e.message });
        }
        const secs = Math.round((Date.now() - started) / 1000);
        const cost = adapter.cost(out.usage || {});
        const r = ctx.result || {};
        results.push({ provider: label, pin: name, ok: out.ok, id: r.id, action: r.action, title: r.rec ? r.rec.title : r.line, concept: r.rec ? r.rec.concept : '', verdict: r.rec ? r.rec.verdict : '', turns: out.turns, secs, cost, reason: out.reason });
        say(`  ${out.ok ? '✓' : '✗'} ${name} → ${out.ok ? `${r.action === 'duplicate' ? 'duplicate of ' : ''}${r.id}` : out.reason}  [${out.turns} turns, ${secs}s${cost ? `, $${cost.toFixed(3)}` : ''}]`);
      }
    }

    const written = results.filter((r) => r.ok && r.action === 'written');
    let commitNote = '';
    if (!PREVIEW && results.some((r) => r.ok)) {
      lib.writeRefIndex();
      commitNote = commit(written, results[0].provider);
      say(`\n${commitNote}`);
    }
    const summary = [
      `# Agent run ${STAMP}${PREVIEW ? ' (preview)' : ''}`, '',
      '| Model | Image | Result | Concept | Verdict | Turns | Time | Cost |', '|---|---|---|---|---|---|---|---|',
      ...results.map((r) => `| ${r.provider} | ${r.pin} | ${r.ok ? `${r.action === 'duplicate' ? 'dup of ' : ''}${r.id}` : `failed: ${r.reason}`} | ${r.concept || ''} | ${r.verdict || ''} | ${r.turns} | ${r.secs}s | ${r.cost ? '$' + r.cost.toFixed(3) : '—'} |`),
      '', commitNote, '', 'Transcripts (every turn and tool call) are the .jsonl files in this folder.',
    ].join('\n');
    fs.writeFileSync(path.join(RUN_DIR, 'summary.md'), summary + '\n');
    say(`\nRun folder: ${RUN_DIR}`);
    if (results.some((r) => !r.ok)) process.exitCode = 2; // Task Scheduler shows this as "last result 0x2"
  } finally {
    release();
  }
}

main().catch((e) => { console.error(`agent failed: ${e.message}`); process.exit(1); });

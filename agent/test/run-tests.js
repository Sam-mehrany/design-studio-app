#!/usr/bin/env node
'use strict';
/**
 * End-to-end test of the agent WITHOUT a real model: a copy of the vault in a temp folder,
 * the scripted fake model, and the real run.js. Checks the bookkeeping a model must never
 * be trusted with — IDs, files, the pin line, the index, the git commit, failure handling.
 *
 *   node test/run-tests.js
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');
const { spawnSync } = require('child_process');
const sharp = require('sharp');

const AGENT = path.resolve(__dirname, '..');
const REPO_DESIGN = path.resolve(AGENT, '..', 'design');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-test-'));
const VAULT = path.join(tmp, 'design');
const INBOX = path.join(VAULT, 'references', 'inbox');
const git = (...a) => spawnSync('git', ['-C', VAULT, ...a], { encoding: 'utf8' });

function agent(args, env = {}) {
  return spawnSync(process.execPath, [path.join(AGENT, 'src', 'run.js'), ...args], {
    encoding: 'utf8',
    env: { ...process.env, DESIGN_VAULT: VAULT, AGENT_PROVIDER: 'fake', AGENT_GIT_COMMIT: '1', AGENT_GIT_PUSH: '0', ...env },
  });
}
function pin(name, id, board) {
  fs.writeFileSync(path.join(INBOX, name.replace(/\.\w+$/, '.json')), JSON.stringify({
    id, board, pin: `https://www.pinterest.com/pin/${id}/`, link: 'https://example.com/shot', description: 'test pin',
  }));
}
let passed = 0;
const ok = (cond, what) => { assert.ok(cond, what); passed++; console.log(`  ✓ ${what}`); };

(async () => {
  console.log(`scratch vault: ${VAULT}`);
  fs.cpSync(REPO_DESIGN, VAULT, { recursive: true });
  fs.mkdirSync(INBOX, { recursive: true });
  git('init', '-q'); git('add', '-A'); git('-c', 'user.name=test', '-c', 'user.email=test@example.com', 'commit', '-qm', 'base');
  git('config', 'user.name', 'test'); git('config', 'user.email', 'test@example.com');

  // 1) a re-pin of an image already in the library, 2) a genuinely new image
  fs.copyFileSync(path.join(VAULT, 'references', 'library', 'REF-0045.jpg'), path.join(INBOX, 'pin-login-page-design-1111111111111111111.jpg'));
  pin('pin-login-page-design-1111111111111111111.jpg', '1111111111111111111', 'login-page-design');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="#eef1f4"/>
    <rect x="250" y="140" width="300" height="320" rx="18" fill="#ffffff"/><rect x="280" y="380" width="240" height="44" rx="10" fill="#14161a"/>
    <text x="400" y="220" font-size="28" text-anchor="middle" fill="#14161a" font-family="sans-serif">Sign in</text></svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(INBOX, 'pin-component-design-idea-2222222222222222222.png'));
  pin('pin-component-design-idea-2222222222222222222.png', '2222222222222222222', 'component-design-idea');

  console.log('\nfull run with the scripted model');
  const r1 = agent(['--no-sync']);
  process.stdout.write(r1.stdout.split('\n').map((l) => '    | ' + l).join('\n') + '\n');
  ok(r1.status === 0, `run exits 0 (got ${r1.status}${r1.stderr ? ': ' + r1.stderr.trim() : ''})`);

  const newFile = fs.readdirSync(path.join(VAULT, 'references')).find((f) => f.startsWith('REF-0102-'));
  ok(newFile, 'new record got the next free ID, REF-0102');
  const text = fs.readFileSync(path.join(VAULT, 'references', newFile), 'utf8');
  ok(text.includes('https://www.pinterest.com/pin/2222222222222222222/'), 'record Notes carry the pin URL (so the next sync skips it)');
  ok(text.includes('status: unreviewed') && /sam_reaction:\n/.test(text), 'record lands unreviewed with no reaction');
  ok(text.includes("source: \"Pinterest board 'component-design-idea' (mehrani0146)\""), 'source names the board and account');
  ok(text.includes('D.SCALE.two-tier') && !text.includes('D.SCL.two-tier'), 'the invalid term was rejected and the corrected one written');
  ok(fs.existsSync(path.join(VAULT, 'references', 'library', 'REF-0102.png')), 'image moved into library/ as REF-0102.png');
  const left = fs.readdirSync(INBOX);
  ok(left.length === 0, `inbox emptied, sidecars included (left: ${left.join(', ') || 'nothing'})`);
  const dup = fs.readFileSync(fs.readdirSync(path.join(VAULT, 'references')).map((f) => path.join(VAULT, 'references', f)).find((f) => /REF-0045-/.test(f)), 'utf8');
  ok(dup.includes('Near-duplicate seen') && dup.includes('pin/1111111111111111111/'), 'the re-pin was noted on REF-0045 instead of becoming a new record');
  ok(fs.readFileSync(path.join(VAULT, 'references', 'index.md'), 'utf8').includes('REF-0102'), 'index.md regenerated with REF-0102');
  const log = git('log', '-1', '--format=%s').stdout.trim();
  ok(/^Ingest 1 ref \(REF-0102\) from Pinterest, analysed by fake:scripted$/.test(log), `git commit made: "${log}"`);
  ok(git('status', '--porcelain').stdout.trim() === '', 'nothing left uncommitted in the vault');
  const runDir = path.join(AGENT, 'runs', fs.readdirSync(path.join(AGENT, 'runs')).filter((d) => /^\d{4}-/.test(d)).sort().pop());
  const tr = fs.readFileSync(path.join(runDir, 'fake-pin-component-design-idea-2222222222222222222.png.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
  const writes = tr.filter((e) => e.role === 'tool' && e.name === 'write_record');
  ok(writes.length === 2 && writes[0].isError && !writes[1].isError, 'transcript shows write_record rejected once, then accepted (self-correction)');

  console.log('\na model that never calls a tool');
  await sharp(Buffer.from(svg)).png().toFile(path.join(INBOX, 'pin-component-design-idea-3333333333333333333.png'));
  const r2 = agent(['--no-sync'], { FAKE_BEHAVIOUR: 'lazy' });
  ok(r2.status === 2, `run exits 2 so the scheduler shows a failure (got ${r2.status})`);
  ok(/after one reminder/.test(r2.stdout), 'it was reminded once, then the pin was reported as failed');
  ok(fs.existsSync(path.join(INBOX, 'pin-component-design-idea-3333333333333333333.png')), 'the failed image stays in the inbox for the next run');
  ok(git('log', '-1', '--format=%s').stdout.trim() === log, 'no commit for a run that wrote nothing');

  console.log('\npreview mode');
  const r3 = agent(['--preview']);
  ok(r3.status === 0, 'preview run exits 0');
  ok(fs.existsSync(path.join(INBOX, 'pin-component-design-idea-3333333333333333333.png')), 'preview leaves the image in the inbox');
  ok(git('status', '--porcelain').stdout.trim() === '?? references/inbox/', 'preview changes nothing tracked in the vault');
  const prevDir = path.join(AGENT, 'runs', fs.readdirSync(path.join(AGENT, 'runs')).filter((d) => /^\d{4}-/.test(d)).sort().pop());
  ok(fs.readdirSync(prevDir).some((f) => f.endsWith('.fake.md')), 'preview record written to the run folder instead');

  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`\n${passed} checks passed`);
})().catch((e) => { console.error(`\nFAILED: ${e.message}\nscratch vault kept at ${tmp}`); process.exit(1); });

#!/usr/bin/env node
/**
 * pinterest-sync.js — find pins on your Pinterest boards that are not yet in the
 * library, and drop them into references/inbox/ for the ingest skill.
 *
 *   node design/tools/pinterest-sync.js              # check + download new pins
 *   node design/tools/pinterest-sync.js --dry-run    # check only, download nothing
 *   node design/tools/pinterest-sync.js --json       # machine-readable report on stdout
 *   node design/tools/pinterest-sync.js --user NAME  # another account (default: ledger's user)
 *
 * Zero dependencies. Reads public boards only (no login, no API key), through
 * Pinterest's public widget endpoint, which returns each board's 50 most recent pins.
 *
 * A pin counts as already known when its ID is
 *   - in references/pinterest-seen.json (the ledger: pins matched to legacy records,
 *     and pins that were skipped as duplicates), or
 *   - written anywhere in a REF record (ingest puts "Pin: https://www.pinterest.com/pin/<id>/"
 *     in ## Notes, and a near-duplicate note in an existing record names the pin too), or
 *   - already waiting in the inbox as pin-<board>-<id>.<ext>.
 * A new pin whose image URL is identical to a known pin's (the same image saved twice)
 * is recorded in the ledger as a duplicate instead of being downloaded.
 *
 * For each new pin it writes references/inbox/pin-<board>-<id>.<ext> plus a sidecar
 * pin-<board>-<id>.json (board, pin URL, outbound link, description) for the ingest
 * step to copy into the record's ## Notes. The studio's inbox ignores the .json files.
 *
 * Exit code: 0 always on a successful check; 1 on a network/parse failure.
 */
'use strict';

// Node's fetch ignores HTTPS_PROXY unless NODE_USE_ENV_PROXY is set; re-exec once so the
// script works behind a proxy (cloud sandboxes) and unchanged without one (Sam's machine).
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const { spawnSync } = require('child_process');
  const r = spawnSync(process.execPath, ['--no-warnings', ...process.argv.slice(1)], {
    stdio: 'inherit', env: { ...process.env, NODE_USE_ENV_PROXY: '1' },
  });
  process.exit(r.status ?? 1);
}

const fs = require('fs');
const path = require('path');

const ROOT = process.env.DESIGN_VAULT || path.resolve(__dirname, '..');
const REFS = path.join(ROOT, 'references');
const INBOX = path.join(REFS, 'inbox');
const LEDGER = path.join(REFS, 'pinterest-seen.json');
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';

const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const opt = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
const DRY = flag('--dry-run');
const JSON_OUT = flag('--json');
const log = (...a) => { if (!JSON_OUT) console.log(...a); };

function readLedger() {
  if (!fs.existsSync(LEDGER)) return { user: null, pins: {} };
  return JSON.parse(fs.readFileSync(LEDGER, 'utf8'));
}

function writeLedger(ledger) {
  const pins = {};
  for (const k of Object.keys(ledger.pins).sort()) pins[k] = ledger.pins[k];
  fs.writeFileSync(LEDGER, JSON.stringify({ ...ledger, pins }, null, 2) + '\n');
}

/** Pin IDs mentioned anywhere in REF records. Pinterest pin IDs are 15–20 digits. */
function pinIdsInRecords() {
  const ids = new Map();
  for (const f of fs.readdirSync(REFS)) {
    if (!/^REF-\d+.*\.md$/.test(f)) continue;
    const text = fs.readFileSync(path.join(REFS, f), 'utf8');
    const ref = (text.match(/^id:\s*(REF-\d+)/m) || [])[1] || f.slice(0, 8);
    for (const m of text.matchAll(/(?:pinterest\.[a-z.]+\/pin\/|pin-[a-z0-9-]+?-)(\d{15,20})/g)) {
      if (!ids.has(m[1])) ids.set(m[1], ref);
    }
  }
  return ids;
}

function pinIdsInInbox() {
  const ids = new Set();
  if (!fs.existsSync(INBOX)) return ids;
  for (const f of fs.readdirSync(INBOX)) {
    const m = f.match(/^pin-.+-(\d{15,20})\.[a-z]+$/i);
    if (m) ids.add(m[1]);
  }
  return ids;
}

async function get(url, as = 'json') {
  for (let attempt = 1; ; attempt++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: as === 'json' ? 'application/json' : '*/*' } });
      if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
      if (as === 'json') return await r.json();
      if (as === 'text') return await r.text();
      return Buffer.from(await r.arrayBuffer());
    } catch (e) {
      if (attempt >= 3) throw e;
      await new Promise((res) => setTimeout(res, 1500 * attempt));
    }
  }
}

/** Board slugs from the public profile page; falls back to boards seen in the ledger. */
async function listBoards(user, ledger) {
  const html = await get(`https://www.pinterest.com/${user}/`, 'text').catch(() => '');
  const re = new RegExp(`"url":"/${user}/([a-z0-9][a-z0-9_-]*)/"`, 'gi');
  const slugs = new Set([...html.matchAll(re)].map((m) => m[1]));
  for (const p of Object.values(ledger.pins)) if (p.board) slugs.add(p.board);
  for (const skip of ['_saved', '_created', 'pins', 'boards']) slugs.delete(skip);
  return [...slugs].sort();
}

const decode = (s) => String(s || '')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();

/** The image key (the hash path) is the same across sizes, so it identifies the image. */
const imageKey = (url) => (String(url).match(/\/([0-9a-f]{2}\/[0-9a-f]{2}\/[0-9a-f]{2}\/[0-9a-f]{32})\./) || [])[1] || null;

function bestImage(images) {
  const order = ['564x', 'orig', 'originals', '736x', '474x', '237x', '236x'];
  for (const k of order) if (images && images[k]) return images[k];
  return images ? Object.values(images)[0] : null;
}

async function main() {
  const ledger = readLedger();
  const user = opt('--user') || ledger.user || process.env.PINTEREST_USER;
  if (!user) throw new Error('no Pinterest user: pass --user NAME (it is then remembered in the ledger)');
  ledger.user = user;

  const inRecords = pinIdsInRecords();
  const inInbox = pinIdsInInbox();
  const knownImages = new Map();
  for (const [id, p] of Object.entries(ledger.pins)) if (p.img) knownImages.set(p.img, p.ref || id);

  const boards = await listBoards(user, ledger);
  log(`Pinterest ${user}: ${boards.length} boards`);
  const report = { user, checked: new Date().toISOString(), boards: [], new: [], duplicates: [] };
  let ledgerChanged = false;

  for (const board of boards) {
    let data;
    try {
      data = (await get(`https://widgets.pinterest.com/v3/pidgets/boards/${user}/${board}/pins/`)).data;
    } catch (e) {
      log(`  ${board}: could not read (${e.message}) — skipped`);
      report.boards.push({ board, error: e.message });
      continue;
    }
    const pins = data.pins || [];
    const total = data.board && data.board.pin_count;
    let fresh = 0, pending = 0;

    for (const p of pins) {
      const id = String(p.id);
      const img = bestImage(p.images);
      const key = imageKey(img && img.url);
      if (ledger.pins[id] || inRecords.has(id)) {
        if (key && !(ledger.pins[id] && ledger.pins[id].img)) knownImages.set(key, (ledger.pins[id] || {}).ref || inRecords.get(id));
        continue;
      }
      if (inInbox.has(id)) { pending++; continue; }
      if (key && knownImages.has(key)) {
        const of = knownImages.get(key);
        report.duplicates.push({ id, board, duplicate_of: of });
        if (!DRY) { ledger.pins[id] = { board, ref: of, img: key, note: 'same image pinned again' }; ledgerChanged = true; }
        continue;
      }
      if (p.is_video) log(`  note: pin ${id} on ${board} is a video; its cover image is downloaded`);

      const ext = (path.extname(new URL(img.url).pathname) || '.jpg').toLowerCase();
      const base = `pin-${board}-${id}`;
      const entry = {
        id, board, pin: `https://www.pinterest.com/pin/${id}/`,
        link: decode(p.link) || null, description: decode(p.description) || null,
        domain: p.domain || null, image: img.url, width: img.width, height: img.height,
        file: base + ext, found: report.checked,
      };
      if (!DRY) {
        fs.mkdirSync(INBOX, { recursive: true });
        fs.writeFileSync(path.join(INBOX, base + ext), await get(img.url, 'buffer'));
        fs.writeFileSync(path.join(INBOX, base + '.json'), JSON.stringify(entry, null, 2) + '\n');
      }
      if (key) knownImages.set(key, id);
      report.new.push(entry);
      fresh++;
    }

    const note = pins.length < (total || 0) ? ` (widget shows the ${pins.length} most recent of ${total})` : '';
    log(`  ${board.padEnd(28)} ${String(total ?? pins.length).padStart(3)} pins  ${fresh} new${pending ? `, ${pending} already in inbox` : ''}${note}`);
    report.boards.push({ board, pins: total ?? pins.length, seen: pins.length, new: fresh, pending });
  }

  if (ledgerChanged || !fs.existsSync(LEDGER) || readLedger().user !== user) writeLedger(ledger);

  if (JSON_OUT) { console.log(JSON.stringify(report, null, 2)); return; }
  log('');
  if (report.duplicates.length) log(`${report.duplicates.length} pin(s) were the same image as one already in the library — recorded in the ledger, not downloaded.`);
  if (!report.new.length) { log('No new pins.'); return; }
  log(`${report.new.length} new pin(s) ${DRY ? 'found (dry run, nothing downloaded)' : 'downloaded to references/inbox/'}:`);
  for (const n of report.new) log(`  ${n.file}  ${n.pin}${n.description ? '  — ' + n.description.slice(0, 60) : ''}`);
  if (!DRY) log('\nNext: ingest the inbox with design/tools/design-ingest-SKILL.md. Copy each sidecar .json\'s pin URL and link into the record\'s ## Notes, then delete the sidecar.');
}

main().catch((e) => { console.error('pinterest-sync failed:', e.message); process.exit(1); });

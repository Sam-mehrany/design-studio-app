#!/usr/bin/env node
'use strict';
/**
 * The vector index over the reference library: keeps the vector database in step with the
 * REF records, and answers semantic search, "more like this" and near-duplicate questions.
 *
 *   node tools/vindex.js                 # sync: embed what is new or changed, drop what is gone
 *   node tools/vindex.js --rebuild       # drop the collection and embed everything again
 *   node tools/vindex.js status
 *   node tools/vindex.js search "dark footer with a giant ghost wordmark" [--concept component] [--type I.TYPE.footer]
 *   node tools/vindex.js similar REF-0037
 *
 * The markdown records stay the source of truth. The vector store is derived data: deleting
 * .vectors/ loses nothing but the embedding cost of rebuilding it.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const lib = require('./lib.js');
const config = require('./config.js');
const embed = require('./embed.js');
const vectordb = require('./vectordb.js');

const sha = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 16);

/* ---------- what gets embedded ---------- */

function termNames(ids) {
  const idx = lib.termIndex();
  return lib.asList(ids).map((t) => { const h = idx.get(String(t).toLowerCase()); return h ? h.name : ''; }).filter(Boolean);
}

/** The text a reference is searched by: what it is first, then how it looks. */
function docText(r) {
  const concept = lib.conceptOf(r);
  const ct = lib.componentTypeOf(r);
  const ctName = ct ? termNames([ct])[0] || ct : '';
  const medium = r.medium ? lib.MEDIUM_LABELS[r.medium] || r.medium : '';
  const lines = [
    r.title || '',
    [concept && lib.CONCEPT_LABELS[concept], ctName, medium, r.platform && r.platform !== 'none' ? `${r.platform} UI` : ''].filter(Boolean).join(' · '),
    termNames(r.archetype).join(', '),
    termNames(r.facets).join(', '),
    lib.section(r._body || '', 'Nature'),
    lib.section(r._body || '', 'Read'),
    lib.section(r._body || '', 'Why the verdict'),
  ];
  // Measured hex codes are noise to a text embedder; keep the words around them.
  return lines.filter(Boolean).join('\n').replace(/`/g, '').slice(0, 12000);
}

function payloadOf(r) {
  return {
    title: r.title || '',
    concept: lib.conceptOf(r) || '',
    component_type: lib.componentTypeOf(r),
    medium: lib.MEDIA.includes(r.medium) ? r.medium : '',
    platform: lib.PLATFORMS.includes(r.platform) ? r.platform : '',
    verdict: r.verdict || '', kind: r.kind || '', status: r.status || '',
    reaction: r.sam_reaction || '',
    image: r.image || '',
  };
}

const imageFile = (r) => (r.image ? path.join(lib.ROOT, 'references', r.image) : null);
function imageStamp(r) {
  const f = imageFile(r);
  try { const st = fs.statSync(f); return `${st.size}:${Math.round(st.mtimeMs)}`; } catch { return ''; }
}

/* ---------- the index ---------- */

let syncing = null;
const state = { last: null, error: null, progress: null };

function store() { return vectordb.open(config.settings()); }

/**
 * Bring the store in line with the records. Text and image are hashed separately, so editing
 * a note re-embeds a few hundred words and never re-pays for the picture.
 */
async function sync({ rebuild = false, onProgress } = {}) {
  if (syncing) return syncing;
  syncing = (async () => {
    const t0 = Date.now();
    const db = store();
    const prov = embed.provider();
    if (rebuild) await db.drop();
    const refs = lib.records('design-ref');
    const existing = new Map((await db.all()).map((p) => [p.id, p]));

    const work = [];
    for (const r of refs) {
      const text = docText(r);
      const tHash = sha(prov.model + '\n' + text);
      const stamp = imageStamp(r);
      const iHash = prov.image && stamp ? sha(prov.model + '\n' + r.image + '\n' + stamp) : '';
      const prev = existing.get(r.id);
      const [pt, pi] = String((prev && prev.hash) || '').split('|');
      const needText = !prev || pt !== tHash || (prev.models || {}).text !== prov.model;
      const needImage = !!iHash && (!prev || pi !== iHash || (prev.models || {}).image !== prov.model);
      const payloadChanged = !prev || JSON.stringify(prev.payload) !== JSON.stringify(payloadOf(r));
      if (needText || needImage || payloadChanged) work.push({ r, text, tHash, iHash, needText, needImage, prev });
    }

    const report = { provider: prov.id, model: prov.model, refs: refs.length, embeddedText: 0, embeddedImages: 0, imageErrors: [], removed: 0 };
    const BATCH = 16;
    for (let i = 0; i < work.length; i += BATCH) {
      const chunk = work.slice(i, i + BATCH);
      state.progress = { done: i, total: work.length };
      if (onProgress) onProgress(state.progress);
      const textVecs = await prov.text(chunk.filter((w) => w.needText).map((w) => w.text), 'document');
      let ti = 0;
      const imgs = [];
      if (prov.image) {
        const image = require('./image.js');
        for (const w of chunk.filter((x) => x.needImage)) {
          try { imgs.push({ w, prep: image.prepare(imageFile(w.r)) }); } catch (e) { report.imageErrors.push(`${w.r.id}: ${e.message}`); }
        }
      }
      const imgVecs = imgs.length ? await prov.images(imgs.map((x) => x.prep)) : [];
      const imgOf = new Map(imgs.map((x, k) => [x.w.r.id, imgVecs[k]]));

      const points = [];
      for (const w of chunk) {
        const vectors = {};
        const models = {};
        if (w.needText) { vectors.text = textVecs[ti++]; models.text = prov.model; report.embeddedText++; }
        else { vectors.text = await db.vector(w.r.id, 'text'); models.text = prov.model; }
        if (imgOf.has(w.r.id)) { vectors.image = imgOf.get(w.r.id); models.image = prov.model; report.embeddedImages++; }
        else if (w.iHash && !w.needImage) { vectors.image = await db.vector(w.r.id, 'image'); models.image = prov.model; }
        const [, oldI] = String((w.prev && w.prev.hash) || '').split('|');
        const iKeep = imgOf.has(w.r.id) ? w.iHash : (w.needImage ? '' : oldI || '');
        points.push({ id: w.r.id, vectors, models, payload: payloadOf(w.r), hash: `${w.tHash}|${iKeep}` });
      }
      await db.upsert(points);
    }

    const live = new Set(refs.map((r) => r.id));
    const gone = [...existing.keys()].filter((id) => !live.has(id));
    if (gone.length) report.removed = await db.remove(gone);
    report.ms = Date.now() - t0;
    state.last = { at: new Date().toISOString(), ...report };
    state.error = null;
    state.progress = null;
    return report;
  })().catch((e) => { state.error = e.message; state.progress = null; throw e; })
    .finally(() => { syncing = null; });
  return syncing;
}

/** Reciprocal-rank fusion: robust to the text and image spaces scoring on different scales. */
function fuse(lists, k = 60) {
  const out = new Map();
  for (const { hits, weight } of lists) {
    hits.forEach((h, rank) => {
      const e = out.get(h.id) || { id: h.id, payload: h.payload, score: 0, text: null, image: null };
      e.score += weight / (k + rank + 1);
      if (h.space) e[h.space] = Number(h.score.toFixed(4));
      out.set(h.id, e);
    });
  }
  return [...out.values()].sort((a, b) => b.score - a.score);
}

/** Natural-language search over the library, with payload filters. */
async function search(query, { filter, limit = 24 } = {}) {
  const q = String(query || '').trim();
  if (!q) return { query: q, hits: [] };
  const prov = embed.provider();
  const db = store();
  const [qv] = await prov.text([q], 'query');
  const pool = Math.max(limit * 3, 40);
  const textHits = (await db.search('text', qv, { limit: pool, filter })).map((h) => ({ ...h, space: 'text' }));
  const lists = [{ hits: textHits, weight: 1 }];
  if (prov.image) {
    const imageHits = (await db.search('image', qv, { limit: pool, filter })).map((h) => ({ ...h, space: 'image' }));
    lists.push({ hits: imageHits, weight: 1 });
  }
  return { query: q, provider: prov.id, semantic: prov.semantic, hits: fuse(lists).slice(0, limit) };
}

/** "More like this": the picture when we have it, the analysis otherwise. */
async function similar(id, { filter, limit = 12, space } = {}) {
  const db = store();
  const prov = embed.provider();
  const spaces = space ? [space] : prov.image ? ['image', 'text'] : ['text'];
  for (const s of spaces) {
    const v = await db.vector(id, s);
    if (!v) continue;
    const hits = await db.search(s, v, { limit, filter, exclude: [id] });
    return { id, space: s, hits: hits.map((h) => ({ ...h, score: Number(h.score.toFixed(4)) })) };
  }
  return { id, space: null, hits: [], note: 'not indexed yet — run a sync' };
}

/**
 * Library records that look like a new image. Used at ingest so a re-saved pin becomes a note
 * on the existing record instead of a second REF. Needs an image embedder.
 */
async function nearDuplicates(prep, threshold = 0.93) {
  const prov = embed.provider();
  if (!prov.image) return [];
  const [v] = await prov.images([prep]);
  return (await store().search('image', v, { limit: 5 })).filter((h) => h.score >= threshold);
}

/** References to show the analyser as worked examples: nearest by the picture, reviewed first. */
async function examplesFor(prep, limit = 3) {
  const prov = embed.provider();
  if (!prov.image) return [];
  const [v] = await prov.images([prep]);
  const hits = await store().search('image', v, { limit: limit * 4 });
  const rank = (h) => (h.payload.status === 'corrected' ? 0 : h.payload.status === 'reviewed' ? 1 : 2);
  return hits.sort((a, b) => rank(a) - rank(b) || b.score - a.score).slice(0, limit);
}

async function status() {
  const s = config.settings();
  let prov, provError = null;
  try { prov = embed.provider(); } catch (e) { provError = e.message; }
  let info = null, infoError = null;
  try { info = await store().info(); } catch (e) { infoError = e.message; }
  const refs = lib.records('design-ref').length;
  return {
    backend: s.vectors.backend,
    store: info, storeError: infoError,
    embedder: prov ? { id: prov.id, model: prov.model, label: prov.label, image: prov.image, semantic: prov.semantic } : null,
    embedderError: provError,
    refs,
    indexed: info ? info.count : 0,
    syncing: !!syncing, progress: state.progress,
    last: state.last, error: state.error,
  };
}

module.exports = { sync, search, similar, nearDuplicates, examplesFor, status, docText, payloadOf };

/* ---------- CLI ---------- */

if (require.main === module) {
  const argv = process.argv.slice(2);
  const flag = (k) => { const i = argv.indexOf(k); return i === -1 ? undefined : argv[i + 1]; };
  const filter = { concept: flag('--concept'), component_type: flag('--type'), medium: flag('--medium'), platform: flag('--platform') };
  const print = (x) => process.stdout.write(JSON.stringify(x, null, 2) + '\n');
  const cmd = argv[0] && !argv[0].startsWith('--') ? argv[0] : 'sync';
  (async () => {
    if (cmd === 'status') return print(await status());
    if (cmd === 'search') {
      const r = await search(argv[1], { filter, limit: Number(flag('--limit')) || 10 });
      for (const h of r.hits) process.stdout.write(`${h.id}  ${h.score.toFixed(4)}  [${h.payload.concept}${h.payload.component_type ? ' · ' + h.payload.component_type : ''}]  ${h.payload.title}\n`);
      return;
    }
    if (cmd === 'similar') {
      const r = await similar(argv[1], { filter, limit: Number(flag('--limit')) || 8 });
      process.stdout.write(`by ${r.space || '—'}\n`);
      for (const h of r.hits) process.stdout.write(`${h.id}  ${h.score.toFixed(4)}  [${h.payload.concept}${h.payload.component_type ? ' · ' + h.payload.component_type : ''}]  ${h.payload.title}\n`);
      return;
    }
    const r = await sync({ rebuild: argv.includes('--rebuild'), onProgress: (p) => process.stderr.write(`  ${p.done}/${p.total}\r`) });
    print(r);
  })().catch((e) => { process.stderr.write(`vindex: ${e.message}\n`); process.exit(1); });
}

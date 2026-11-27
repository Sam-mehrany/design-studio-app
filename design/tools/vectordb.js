'use strict';
/**
 * The vector database behind the library.
 *
 * Each reference is one point with up to two named vectors and a payload:
 *
 *   text   the embedded analysis — nature, component type, title, the Read section, terms
 *   image  the embedded picture itself (only with an image-capable embedder: Voyage)
 *   payload  concept, component_type, medium, platform, verdict, kind, status, reaction …
 *            so every search can be filtered ("footers only", "3D-rendered mockups only")
 *
 * Two interchangeable backends:
 *
 *   local   (default) an embedded store in <vault>/.vectors/<collection>/ — a JSON payload
 *           file plus one Float32 matrix per vector space, searched exactly (brute-force
 *           cosine). For a personal library of hundreds to tens of thousands of references
 *           exact search is faster than building an ANN index and is never approximate.
 *           Zero dependencies, nothing to run.
 *   qdrant  a Qdrant server over its REST API (QDRANT_URL, QDRANT_API_KEY) — for a hosted
 *           studio or a library big enough to want HNSW. `docker run -p 6333:6333 qdrant/qdrant`.
 *
 * Both expose the same interface; vindex.js never knows which one it is talking to.
 */

const fs = require('fs');
const path = require('path');
const lib = require('./lib.js');

const SPACES = ['text', 'image'];

/* ---------- filters (shared) ---------- */

/** { concept: 'component', component_type: ['I.TYPE.footer', …] } → predicate over payloads. */
function predicate(filter) {
  const entries = Object.entries(filter || {}).filter(([, v]) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && !v.length));
  return (p) => entries.every(([k, v]) => {
    const want = Array.isArray(v) ? v : [v];
    const have = Array.isArray(p[k]) ? p[k] : [p[k]];
    return have.some((x) => want.includes(x));
  });
}

/* ---------- local backend ---------- */

function localStore(collection) {
  const dir = path.join(lib.ROOT, '.vectors', collection);
  const META = path.join(dir, 'meta.json');
  const bin = (space) => path.join(dir, `${space}.f32`);

  let cache = null, cacheMtime = 0;

  function load() {
    let mtime = 0;
    try { mtime = fs.statSync(META).mtimeMs; } catch { /* empty store */ }
    if (cache && mtime === cacheMtime) return cache;
    const empty = { version: 1, points: {}, spaces: {} };
    let meta = empty;
    try { meta = JSON.parse(fs.readFileSync(META, 'utf8')); } catch { meta = empty; }
    const mats = {};
    for (const [space, s] of Object.entries(meta.spaces || {})) {
      try {
        const buf = fs.readFileSync(bin(space));
        const all = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
        const rows = new Map();
        s.ids.forEach((id, i) => rows.set(id, all.subarray(i * s.dims, (i + 1) * s.dims)));
        mats[space] = rows;
      } catch { mats[space] = new Map(); }
    }
    cache = { meta, mats };
    cacheMtime = mtime;
    return cache;
  }

  /** Write every file to a temp name first, then rename, so a crash never leaves half a store. */
  function save(meta, mats) {
    fs.mkdirSync(dir, { recursive: true });
    const tmp = [];
    for (const space of Object.keys(meta.spaces)) {
      const rows = mats[space];
      const ids = [...rows.keys()];
      const dims = meta.spaces[space].dims;
      const out = new Float32Array(ids.length * dims);
      ids.forEach((id, i) => out.set(rows.get(id), i * dims));
      meta.spaces[space].ids = ids;
      fs.writeFileSync(bin(space) + '.tmp', Buffer.from(out.buffer));
      tmp.push([bin(space) + '.tmp', bin(space)]);
    }
    fs.writeFileSync(META + '.tmp', JSON.stringify(meta));
    for (const [a, b] of tmp) fs.renameSync(a, b);
    fs.renameSync(META + '.tmp', META);       // meta last: it is what readers key on
    cache = null;
  }

  return {
    backend: 'local',
    where: dir,
    async info() {
      const { meta, mats } = load();
      return {
        backend: 'local', collection, location: path.relative(lib.ROOT, dir).replace(/\\/g, '/'),
        count: Object.keys(meta.points).length,
        spaces: Object.fromEntries(Object.entries(meta.spaces).map(([k, s]) => [k, { model: s.model, dims: s.dims, count: mats[k] ? mats[k].size : 0 }])),
      };
    },
    async all() {
      const { meta } = load();
      return Object.entries(meta.points).map(([id, p]) => ({ id, ...p }));
    },
    async upsert(points) {
      if (!points.length) return;
      const { meta: m0, mats: m1 } = load();
      const meta = JSON.parse(JSON.stringify(m0));
      const mats = Object.fromEntries(Object.entries(m1).map(([k, v]) => [k, new Map(v)]));
      for (const pt of points) {
        const prev = meta.points[pt.id] || {};
        const models = { ...(prev.models || {}) };
        for (const space of SPACES) {
          const v = pt.vectors && pt.vectors[space];
          if (!v) continue;
          const model = pt.models[space];
          const s = meta.spaces[space];
          if (!s || s.model !== model || s.dims !== v.length) {
            // A different embedding model is a different space: start it fresh rather than
            // mixing vectors that cannot be compared.
            meta.spaces[space] = { model, dims: v.length, ids: [] };
            mats[space] = new Map();
            for (const p of Object.values(meta.points)) if (p.models) delete p.models[space];
          }
          mats[space].set(pt.id, Float32Array.from(v));
          models[space] = model;
        }
        meta.points[pt.id] = { payload: pt.payload || {}, hash: pt.hash || '', models, indexed: new Date().toISOString() };
      }
      save(meta, mats);
    },
    async remove(ids) {
      const { meta: m0, mats: m1 } = load();
      const meta = JSON.parse(JSON.stringify(m0));
      const mats = Object.fromEntries(Object.entries(m1).map(([k, v]) => [k, new Map(v)]));
      let n = 0;
      for (const id of ids) {
        if (meta.points[id]) { delete meta.points[id]; n++; }
        for (const rows of Object.values(mats)) rows.delete(id);
      }
      if (n) save(meta, mats);
      return n;
    },
    async vector(id, space) {
      const { mats } = load();
      return (mats[space] && mats[space].get(id)) || null;
    },
    async search(space, vector, { limit = 20, filter, exclude = [] } = {}) {
      const { meta, mats } = load();
      const rows = mats[space];
      if (!rows || !rows.size) return [];
      const ok = predicate(filter);
      const skip = new Set(exclude);
      const out = [];
      for (const [id, v] of rows) {
        if (skip.has(id)) continue;
        const p = meta.points[id];
        if (!p || !ok(p.payload)) continue;
        let dot = 0;
        for (let i = 0; i < v.length; i++) dot += v[i] * vector[i];
        out.push({ id, score: dot, payload: p.payload });
      }
      return out.sort((a, b) => b.score - a.score).slice(0, limit);
    },
    async drop() { fs.rmSync(dir, { recursive: true, force: true }); cache = null; },
  };
}

/* ---------- qdrant backend ---------- */

function qdrantStore(collection, { url, apiKey }) {
  const base = `${url}/collections/${encodeURIComponent(collection)}`;
  const once = (p, method, body) => fetch(base + p, {
    method,
    headers: { 'content-type': 'application/json', ...(apiKey ? { 'api-key': apiKey } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const q = async (p, method = 'GET', body) => {
    // Qdrant closes idle keep-alive sockets; when that races a reused connection (after a
    // slow image decode, say) fetch fails with a socket error. Every call here is safe to
    // repeat — upserts are by id — so retry once on a dropped connection.
    const dropped = (e) => e.cause && /UND_ERR_SOCKET|ECONNRESET|EPIPE/.test(String(e.cause.code));
    const res = await once(p, method, body)
      .catch((e) => (dropped(e) ? once(p, method, body) : Promise.reject(e)))
      .catch((e) => { throw new Error(`cannot reach Qdrant at ${url}: ${e.cause ? e.cause.code : e.message}`); });
    const text = await res.text();
    if (res.status === 404 && method === 'GET' && p === '') return null;
    if (!res.ok) throw new Error(`Qdrant ${method} ${p || '/'} → ${res.status}: ${text.slice(0, 300)}`);
    return JSON.parse(text).result;
  };
  // Qdrant ids must be integers or UUIDs; REF-0037 → 37, and the REF id rides in the payload.
  const num = (id) => Number(String(id).replace(/^\D+/, ''));
  const refFilter = (filter, exclude) => {
    const must = Object.entries(filter || {})
      .filter(([, v]) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && !v.length))
      .map(([k, v]) => ({ key: k, match: Array.isArray(v) ? { any: v } : { value: v } }));
    const must_not = exclude && exclude.length ? [{ has_id: exclude.map(num) }] : [];
    return must.length || must_not.length ? { must, must_not } : undefined;
  };
  let schema = null;
  async function ensure(points) {
    if (!schema) schema = await q('');
    const need = {};
    for (const pt of points) for (const s of SPACES) if (pt.vectors[s]) need[s] = pt.vectors[s].length;
    const have = schema && schema.config && schema.config.params && schema.config.params.vectors;
    const fits = have && Object.entries(need).every(([s, d]) => have[s] && have[s].size === d);
    if (fits) return;
    // New collection, or a new model with different dimensions: recreate. vindex re-embeds.
    if (schema) await q('', 'DELETE');
    await q('', 'PUT', { vectors: Object.fromEntries(Object.entries(need).map(([s, d]) => [s, { size: d, distance: 'Cosine' }])) });
    for (const key of ['concept', 'component_type', 'medium', 'platform', 'verdict', 'kind', 'status']) {
      await q('/index', 'PUT', { field_name: key, field_schema: 'keyword' }).catch(() => {});
    }
    schema = await q('');
  }
  const unpack = (pt) => ({ id: pt.payload.ref_id, payload: pt.payload.p || {}, hash: pt.payload.hash || '', models: pt.payload.models || {}, indexed: pt.payload.indexed });

  return {
    backend: 'qdrant',
    where: base,
    async info() {
      const c = await q('');
      if (!c) return { backend: 'qdrant', collection, location: url, count: 0, spaces: {} };
      const first = (await q('/points/scroll', 'POST', { limit: 1, with_payload: true, with_vector: false })).points[0];
      const models = first ? first.payload.models || {} : {};
      const vecs = (c.config.params && c.config.params.vectors) || {};
      return {
        backend: 'qdrant', collection, location: url, count: c.points_count || 0,
        spaces: Object.fromEntries(Object.entries(vecs).map(([k, v]) => [k, { model: models[k] || '', dims: v.size }])),
      };
    },
    async all() {
      if (!(await q(''))) return [];
      const out = [];
      let offset = null;
      do {
        const r = await q('/points/scroll', 'POST', { limit: 256, with_payload: true, with_vector: false, ...(offset !== null ? { offset } : {}) });
        out.push(...r.points.map(unpack));
        offset = r.next_page_offset;
      } while (offset !== null && offset !== undefined);
      return out;
    },
    async upsert(points) {
      if (!points.length) return;
      await ensure(points);
      for (let i = 0; i < points.length; i += 64) {
        await q('/points?wait=true', 'PUT', {
          points: points.slice(i, i + 64).map((pt) => ({
            id: num(pt.id),
            vector: Object.fromEntries(SPACES.filter((s) => pt.vectors[s]).map((s) => [s, Array.from(pt.vectors[s])])),
            // Top-level keys are what filters read; `p` keeps the full payload for unpacking.
            payload: { ...pt.payload, p: pt.payload, ref_id: pt.id, hash: pt.hash || '', models: pt.models, indexed: new Date().toISOString() },
          })),
        });
      }
    },
    async remove(ids) {
      if (!ids.length || !(await q(''))) return 0;
      await q('/points/delete?wait=true', 'POST', { points: ids.map(num) });
      return ids.length;
    },
    async vector(id, space) {
      if (!(await q(''))) return null;
      const r = await q('/points', 'POST', { ids: [num(id)], with_vector: [space], with_payload: false });
      const v = r[0] && r[0].vector && r[0].vector[space];
      return v ? Float32Array.from(v) : null;
    },
    async search(space, vector, { limit = 20, filter, exclude = [] } = {}) {
      const c = await q('');
      if (!c || !(c.config.params.vectors || {})[space]) return [];
      const r = await q('/points/search', 'POST', {
        vector: { name: space, vector: Array.from(vector) }, limit, with_payload: true, filter: refFilter(filter, exclude),
      });
      return r.map((pt) => ({ id: pt.payload.ref_id, score: pt.score, payload: pt.payload.p || {} }));
    },
    async drop() { if (await q('')) await q('', 'DELETE'); schema = null; },
  };
}

/* ---------- open ---------- */

function open(settings) {
  const v = settings.vectors;
  if (v.backend === 'qdrant') return qdrantStore(v.collection, { url: v.qdrantUrl, apiKey: settings.keys.qdrant });
  return localStore(v.collection);
}

module.exports = { open, predicate, SPACES };

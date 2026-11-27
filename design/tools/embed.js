'use strict';
/**
 * Embedding providers for the vector database. Each one turns text — and, where the model
 * can, images — into vectors in one space.
 *
 *   voyage  voyage-multimodal-3.5 over the Voyage REST API (VOYAGE_API_KEY). Images AND text
 *           land in the same space, so "dark footer with a giant wordmark" finds footers by
 *           how they look, and "more like this" compares pixels, not words.
 *   local   a text-embedding model on this machine (Ollama / LM Studio). Free and offline.
 *           Text only: it embeds the analysis, so search finds what the analysis says.
 *   hash    hashed bag of words and bigrams, 512-d. Needs nothing at all; lexical, not
 *           semantic. It exists so the vector database works on first run with no setup —
 *           and it says so, rather than pretending to understand anything.
 *
 * Every provider returns L2-normalised Float32Arrays.
 */

const config = require('./config.js');
const localLLM = require('./local-llm.js');

const norm = (v) => {
  const a = Float32Array.from(v);
  let s = 0; for (const x of a) s += x * x;
  s = Math.sqrt(s) || 1;
  for (let i = 0; i < a.length; i++) a[i] /= s;
  return a;
};

/* ---------- hash ---------- */

const HASH_DIMS = 512;
const STOP = new Set('a an and are as at be by for from has in is it its of on or the to with this that over into'.split(' '));
function fnv(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return h >>> 0; }
function hashEmbed(text) {
  const words = String(text).toLowerCase().replace(/#[0-9a-f]{6}\b/g, ' ').match(/[a-z][a-z0-9.-]*[a-z0-9]|[a-z]/g) || [];
  const toks = words.filter((w) => !STOP.has(w));
  const v = new Float32Array(HASH_DIMS);
  const add = (t, w) => { const h = fnv(t); v[h % HASH_DIMS] += (h & 0x80000000 ? -1 : 1) * w; };
  const tf = new Map();
  for (let i = 0; i < toks.length; i++) {
    tf.set(toks[i], (tf.get(toks[i]) || 0) + 1);
    if (i + 1 < toks.length) tf.set(toks[i] + ' ' + toks[i + 1], (tf.get(toks[i] + ' ' + toks[i + 1]) || 0) + 0.7);
  }
  for (const [t, n] of tf) add(t, 1 + Math.log(n));
  return norm(v);
}

/* ---------- voyage ---------- */

async function voyage(model, key, inputs, inputType) {
  const res = await fetch('https://api.voyageai.com/v1/multimodalembeddings', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, input_type: inputType, inputs }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Voyage ${res.status}: ${text.slice(0, 300)}`);
  const body = JSON.parse(text);
  return body.data.sort((a, b) => a.index - b.index).map((d) => norm(d.embedding));
}

/* ---------- selection ---------- */

/**
 * The active provider. `image` says whether it can embed pictures; `model` is stored with
 * every vector so a change of model is detected and triggers a re-embed, never a silent mix
 * of incompatible spaces.
 */
function provider() {
  const s = config.settings();
  let want = s.embed.provider;
  if (want === 'auto') want = s.keys.voyage ? 'voyage' : s.embed.localModel ? 'local' : 'hash';

  if (want === 'voyage') {
    if (!s.keys.voyage) throw new Error('embed.provider is voyage but VOYAGE_API_KEY is not set');
    const model = s.embed.voyageModel;
    return {
      id: 'voyage', model: `voyage:${model}`, image: true, semantic: true,
      label: `Voyage ${model} — images and text in one space`,
      async text(texts, inputType = 'document') {
        const out = [];
        for (let i = 0; i < texts.length; i += 32) {
          out.push(...await voyage(model, s.keys.voyage, texts.slice(i, i + 32).map((t) => ({ content: [{ type: 'text', text: t }] })), inputType));
        }
        return out;
      },
      async images(images) {
        const out = [];
        for (let i = 0; i < images.length; i += 8) {
          out.push(...await voyage(model, s.keys.voyage, images.slice(i, i + 8).map((im) => ({
            content: [{ type: 'image_base64', image_base64: `data:${im.mediaType};base64,${im.data.toString('base64')}` }],
          })), 'document'));
        }
        return out;
      },
    };
  }
  if (want === 'local') {
    const model = s.embed.localModel;
    if (!model) throw new Error('embed.provider is local but no embed.localModel is set (for example "nomic-embed-text")');
    return {
      id: 'local', model: `local:${model}`, image: false, semantic: true,
      label: `${model} on this machine — text only`,
      async text(texts, inputType = 'document') {
        // nomic/e5-style models expect a task prefix; harmless for the rest.
        const pre = /nomic/i.test(model) ? (inputType === 'query' ? 'search_query: ' : 'search_document: ') : '';
        const out = [];
        for (let i = 0; i < texts.length; i += 16) {
          out.push(...(await localLLM.embed(s.local, model, texts.slice(i, i + 16).map((t) => pre + t))).map(norm));
        }
        return out;
      },
      async images() { throw new Error('the local embedder is text-only'); },
    };
  }
  return {
    id: 'hash', model: `hash:${HASH_DIMS}`, image: false, semantic: false,
    label: 'Hashed keywords — no setup, lexical only',
    async text(texts) { return texts.map(hashEmbed); },
    async images() { throw new Error('the hash embedder is text-only'); },
  };
}

module.exports = { provider, hashEmbed, norm };

'use strict';
/**
 * Client for a model running on this machine — Ollama, or anything that speaks the
 * OpenAI-compatible chat API (LM Studio, llama.cpp `llama-server`, vLLM, LocalAI).
 *
 * Zero dependencies: plain fetch. Used for two jobs:
 *   chatJSON()  — vision analysis with a JSON-schema-constrained answer
 *   embed()     — text embeddings for the vector database
 *
 * `api: auto` probes Ollama's /api/version first. Ollama's native API is preferred when it
 * is there, because it takes `options.num_ctx`: Ollama's default context window is small
 * enough to silently cut off the analysis prompt, and the OpenAI-compatible endpoint has no
 * way to raise it per request.
 */

const TIMEOUT_MS = 15 * 60 * 1000; // a 30B vision model on CPU can take minutes per image

async function call(url, body, { apiKey, method = 'POST', timeout = TIMEOUT_MS } = {}) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeout);
  try {
    const res = await fetch(url, {
      method,
      headers: { 'content-type': 'application/json', ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: ctl.signal,
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`${url} → ${res.status}: ${text.slice(0, 400)}`);
    try { return JSON.parse(text); } catch { throw new Error(`${url} returned non-JSON: ${text.slice(0, 200)}`); }
  } catch (e) {
    if (e.name === 'AbortError') throw new Error(`${url} timed out after ${Math.round(timeout / 1000)}s`);
    if (e.cause && (e.cause.code === 'ECONNREFUSED' || e.cause.code === 'ENOTFOUND')) {
      throw new Error(`no local model server at ${new URL(url).origin} — start Ollama (or LM Studio) or set local.url`);
    }
    throw e;
  } finally { clearTimeout(t); }
}

const detected = new Map();
/** 'ollama' | 'openai', cached per URL. */
async function apiOf(local) {
  if (local.api === 'ollama' || local.api === 'openai') return local.api;
  if (detected.has(local.url)) return detected.get(local.url);
  let kind = 'openai';
  try { await call(`${local.url}/api/version`, undefined, { method: 'GET', timeout: 2500 }); kind = 'ollama'; } catch { /* not ollama */ }
  detected.set(local.url, kind);
  return kind;
}

/** Root of the OpenAI-compatible API: accept both "http://host:1234" and "http://host:1234/v1". */
const v1 = (url) => (/\/v1$/.test(url) ? url : `${url}/v1`);

/** Installed models, or [] when the server is down. Never throws: used to fill a picker. */
async function listModels(local) {
  try {
    const kind = await apiOf(local);
    if (kind === 'ollama') {
      const r = await call(`${local.url}/api/tags`, undefined, { method: 'GET', timeout: 3000 });
      return (r.models || []).map((m) => ({
        id: m.name,
        family: (m.details && (m.details.families || [m.details.family]).filter(Boolean).join(',')) || '',
        size: m.size || 0,
        // Ollama does not say "vision" in /api/tags; families with a projector are the tell.
        vision: /clip|mllama|vl|vision|llava|gemma3|qwen2\.5vl|qwen3vl|minicpm|moondream|pixtral|mistral3/i
          .test(`${m.name} ${(m.details && (m.details.families || []).join(' ')) || ''}`),
        embedding: /embed|bge|e5|gte|minilm|nomic/i.test(m.name),
      }));
    }
    const r = await call(`${v1(local.url)}/models`, undefined, { method: 'GET', timeout: 3000, apiKey: local.apiKey });
    return (r.data || []).map((m) => ({ id: m.id, vision: /vl|vision|llava|gemma-?3|pixtral|minicpm|qwen.*vl/i.test(m.id), embedding: /embed|bge|e5|gte|minilm|nomic/i.test(m.id) }));
  } catch { return []; }
}

/** Pull the first JSON object out of a reply — for servers that ignore the schema. */
function firstJSON(text) {
  const s = String(text || '').replace(/^```(?:json)?\s*|\s*```$/g, '').trim();
  try { return JSON.parse(s); } catch { /* fall through */ }
  const a = s.indexOf('{'), b = s.lastIndexOf('}');
  if (a !== -1 && b > a) { try { return JSON.parse(s.slice(a, b + 1)); } catch { /* fall through */ } }
  throw new Error('the local model did not return valid JSON — try a larger model, or raise local.contextTokens');
}

/**
 * One vision request that must come back as JSON matching `schema`.
 * image: { data: Buffer, mediaType }
 */
async function chatJSON(local, { system, prompt, image, schema }) {
  if (!local.model) throw new Error('no local model chosen — set local.model (for example "qwen2.5vl:7b") or pick one in the Inbox');
  const kind = await apiOf(local);
  const b64 = image.data.toString('base64');
  if (kind === 'ollama') {
    const r = await call(`${local.url}/api/chat`, {
      model: local.model,
      stream: false,
      format: schema,                                  // Ollama constrains decoding to the schema
      options: { num_ctx: local.contextTokens, temperature: 0.2 },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt, images: [b64] },
      ],
    });
    return { json: firstJSON(r.message && r.message.content), usage: { input: r.prompt_eval_count, output: r.eval_count }, api: 'ollama' };
  }
  const r = await call(`${v1(local.url)}/chat/completions`, {
    model: local.model,
    temperature: 0.2,
    response_format: { type: 'json_schema', json_schema: { name: 'design_reference', schema, strict: true } },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: `data:${image.mediaType};base64,${b64}` } },
      ] },
    ],
  }, { apiKey: local.apiKey });
  const msg = r.choices && r.choices[0] && r.choices[0].message;
  return { json: firstJSON(msg && msg.content), usage: { input: r.usage && r.usage.prompt_tokens, output: r.usage && r.usage.completion_tokens }, api: 'openai' };
}

/** Text embeddings. Returns number[][] in input order. */
async function embed(local, model, texts) {
  const kind = await apiOf(local);
  if (kind === 'ollama') {
    const r = await call(`${local.url}/api/embed`, { model, input: texts, options: { num_ctx: 8192 } });
    return r.embeddings;
  }
  const r = await call(`${v1(local.url)}/embeddings`, { model, input: texts }, { apiKey: local.apiKey });
  return (r.data || []).sort((a, b) => a.index - b.index).map((d) => d.embedding);
}

module.exports = { apiOf, listModels, chatJSON, embed, firstJSON };

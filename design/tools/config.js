'use strict';
/**
 * Settings for analysis, embeddings and the vector database.
 *
 * Read from `<vault>/studio.config.json` (optional, non-secret) and overridden by environment
 * variables. API keys are read from the environment ONLY — never put one in the config file,
 * because the vault is a git repo and the file would be committed.
 *
 *   {
 *     "analysis": { "provider": "local", "claudeModel": "claude-opus-5-5", "effort": "medium" },
 *     "local":    { "url": "http://127.0.0.1:11434", "api": "auto", "model": "qwen2.5vl:7b", "contextTokens": 16384 },
 *     "embed":    { "provider": "auto", "localModel": "nomic-embed-text" },
 *     "vectors":  { "backend": "local", "qdrantUrl": "http://127.0.0.1:6333", "collection": "design_refs" }
 *   }
 */

const fs = require('fs');
const path = require('path');
const lib = require('./lib.js');

const FILE = () => path.join(lib.ROOT, 'studio.config.json');

function readFile() {
  try { return JSON.parse(fs.readFileSync(FILE(), 'utf8')); } catch { return {}; }
}

const env = (k) => (process.env[k] !== undefined && process.env[k] !== '' ? process.env[k] : undefined);

/** Resolved settings. Re-read on every call so editing the file needs no restart. */
function settings() {
  const f = readFile();
  const a = f.analysis || {}, l = f.local || {}, e = f.embed || {}, v = f.vectors || {};
  return {
    analysis: {
      // claude | local | hark — '' means "pick the best one available" (see analyse.js).
      provider: env('STUDIO_ANALYSER') || a.provider || '',
      claudeModel: env('STUDIO_CLAUDE_MODEL') || a.claudeModel || 'claude-opus-5-5',
      effort: env('STUDIO_EFFORT') || a.effort || 'medium',
    },
    local: {
      url: (env('STUDIO_LOCAL_URL') || l.url || 'http://127.0.0.1:11434').replace(/\/+$/, ''),
      api: env('STUDIO_LOCAL_API') || l.api || 'auto',          // auto | ollama | openai
      model: env('STUDIO_LOCAL_MODEL') || l.model || '',
      contextTokens: Number(env('STUDIO_LOCAL_CONTEXT') || l.contextTokens || 16384),
      apiKey: env('STUDIO_LOCAL_API_KEY') || '',                  // some OpenAI-compatible servers want one
    },
    embed: {
      provider: env('STUDIO_EMBED') || e.provider || 'auto',      // auto | voyage | local | hash
      voyageModel: env('STUDIO_VOYAGE_MODEL') || e.voyageModel || 'voyage-multimodal-3.5',
      localModel: env('STUDIO_EMBED_MODEL') || e.localModel || '',
    },
    vectors: {
      backend: env('STUDIO_VECTOR_DB') || v.backend || (env('QDRANT_URL') ? 'qdrant' : 'local'),
      qdrantUrl: (env('QDRANT_URL') || v.qdrantUrl || 'http://127.0.0.1:6333').replace(/\/+$/, ''),
      collection: env('STUDIO_VECTOR_COLLECTION') || v.collection || 'design_refs',
    },
    keys: {
      anthropic: !!(env('ANTHROPIC_API_KEY') || env('ANTHROPIC_AUTH_TOKEN')),
      voyage: env('VOYAGE_API_KEY') || '',
      qdrant: env('QDRANT_API_KEY') || '',
    },
  };
}

module.exports = { settings, FILE };

#!/usr/bin/env node
'use strict';
/**
 * The analyser: turns a reference image into a REF record — what it is (nature), how it is
 * built (facets A–H), what job it does (J), and a deep, measured read of its design.
 *
 * Analysers (pick per run in the Inbox, or with --with):
 *
 *   claude:claude-opus-5-5     deepest read; the default when ANTHROPIC_API_KEY is set
 *   claude:claude-sonnet-5-5   faster, cheaper
 *   claude:claude-haiku-5-5    cheapest Claude — about a fortieth of Opus per token
 *   local:<model>              a vision model on this machine through Ollama / LM Studio /
 *                              llama.cpp / vLLM — free per image, fully offline
 *
 * Whatever the model, the pipeline around it is the same and is what keeps the library honest:
 *   1. the image is downscaled to an API-safe copy (image.js) — the library keeps the original
 *   2. its palette and contrast are MEASURED off the pixels and handed to the model as fact
 *   3. the nearest references already in the vector DB — reviewed and corrected ones first —
 *      are shown as worked examples, so the 101st footer is filed like the first 100
 *   4. the answer is schema-constrained JSON; every term ID is validated against the facet
 *      tables and unknown ones are dropped into Notes as proposals, never written as terms
 *   5. the record lands `status: unreviewed`. A classifier never writes a Stance.
 *
 *   node tools/analyse.js                       # analyse everything in references/inbox/
 *   node tools/analyse.js --with local:qwen2.5vl:7b
 *   node tools/analyse.js --nature REF-0037 [REF-0038 …|--all]   # re-decide only the nature fields
 *   node tools/analyse.js --list                # which analysers are available here
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const lib = require('./lib.js');
const config = require('./config.js');
const image = require('./image.js');
const localLLM = require('./local-llm.js');

const INBOX = () => path.join(lib.ROOT, 'references', 'inbox');
const LIBRARY = () => path.join(lib.ROOT, 'references', 'library');
const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);

const CLAUDE_MODELS = [
  { id: 'claude-opus-5-5', name: 'Claude Opus 5.5', note: 'deepest read · $4 / $20 per M tokens' },
  { id: 'claude-sonnet-5-5', name: 'Claude Sonnet 5.5', note: 'faster · $2 / $10 per M tokens' },
  { id: 'claude-haiku-5-5', name: 'Claude Haiku 5.5', note: 'cheapest Claude · $0.10 / $0.50 per M tokens' },
];

/* ---------- the prompt (static, so it caches) ---------- */

const ROLE = `You are a senior UI/UX design analyst filing references into a designer's faceted library.

You analyse the DESIGN — colour, type, layout, surface, components, imagery, contrast — not the
product's business. One line of product context at most; every other sentence is about design
mechanism, with real values. "Hero numeral at ~72px beside a 14px unit, everything else 13px, so
the value reads from across a room" is the register. "Clean and modern" is useless.

Order of judgement, always: NATURE first (what kind of artefact is this picture), then the
archetype (what job the screen does), then the descriptive facets, then the verdict.

Rules that cannot be broken:
- Use only term IDs that appear in the vocabulary below, spelled exactly. If a real distinction
  has no term, put your proposed term in proposed_terms and explain it in notes — never invent
  an ID inside facets or archetype.
- Colour values: the user message carries a palette MEASURED from the pixels. Cite those hex
  values and contrast ratios. A value you estimate yourself must say "≈" or "estimated".
- Name contrast failures against WCAG (4.5:1 body, 3:1 large text and UI parts).
- kind: "shipped" only with evidence of a real product (real data, edge cases, status bars, odd
  long labels). Perfect three-point data and lorem-quality copy is "concept". A concept can
  never be verdict "adopt".
- verdict: adopt = usable as-is; adapt = the mechanism is right, the finish does not transfer;
  reject = fails one of the three killers (imagery_dep, rtl, cost) badly.
- imagery_dep: delete the photography/render in your head — does the composition stand?
  hard = collapses, soft = it was decoration, none = there was none.
- rtl: would this mirror for Persian/Arabic? breaks = hierarchy depends on a left-anchored hero
  or the layout reads as a left-to-right sentence; risky = directional icons, charts, numerals
  would need rework; clean = symmetric or list-based.
- cost: live blur, mesh gradients, video, large renders, many font weights = high; vector, type,
  flat colour = low.
- confidence is YOUR confidence in the classification: low | med | high.`;

function vocabulary(compact) {
  const terms = lib.allTerms().filter((t) => /^[A-HJK]$/.test(t.facet));
  const by = new Map();
  for (const t of terms) {
    const key = `${t.facet} ${lib.FACET_NAMES[t.facet]}`;
    if (!by.has(key)) by.set(key, []);
    by.get(key).push(compact ? t.id : `${t.id} — ${t.name}${t.definition ? ': ' + t.definition : ''}`);
  }
  return [...by.entries()].map(([k, v]) => `### ${k}\n${compact ? v.join(', ') : v.join('\n')}`).join('\n\n');
}

let promptCache = {};
function systemPrompt(compact) {
  const key = compact ? 'c' : 'f';
  if (promptCache[key]) return promptCache[key];
  const nature = fs.readFileSync(path.join(lib.ROOT, 'nature.md'), 'utf8');
  const types = lib.componentTypes().map((t) => `${t.id} — ${t.name}: ${t.cue}`).join('\n');
  promptCache[key] = [
    ROLE,
    '## Nature rules\n\n' + nature,
    '## Component types (component_type, only when concept is component)\n\n' + types,
    '## Vocabulary — the only valid term IDs for facets and archetype\n\n'
      + 'facets: terms from A–H and K (6–14 of them). archetype: 1–3 terms from J. '
      + 'An imagery reference with no UI takes J.REF.imagery; a slide takes J.PRES.slide or J.PRES.deck.\n\n'
      + vocabulary(compact),
  ].join('\n\n');
  return promptCache[key];
}

/* ---------- the answer's shape ---------- */

function schema() {
  const str = { type: 'string' };
  const en = (values) => ({ type: 'string', enum: values });
  const jTerms = lib.allTerms().filter((t) => t.facet === 'J').map((t) => t.id);
  const props = {
    title: { type: 'string', description: 'What this is, concretely, under 120 characters: "Black footer: monospace display, grey/white split headline, particle render"' },
    concept: en(lib.CONCEPTS),
    component_type: en(['', ...lib.componentTypes().map((t) => t.id)]),
    medium: en(lib.MEDIA),
    platform: en(lib.PLATFORMS),
    nature: { type: 'string', description: 'The ## Nature section: one line naming the four nature fields in words, then the visual evidence that decided each' },
    kind: en(['shipped', 'concept', 'print', 'brand']),
    archetype: { type: 'array', items: en(jTerms) },
    facets: { type: 'array', items: str },
    imagery_dep: en(['hard', 'soft', 'none']),
    rtl: en(['clean', 'risky', 'breaks']),
    cost: en(['low', 'med', 'high']),
    verdict: en(['adopt', 'adapt', 'reject']),
    confidence: en(['low', 'med', 'high']),
    read: {
      type: 'object',
      additionalProperties: false,
      required: ['colour', 'typography', 'layout', 'shape_surface', 'components', 'imagery', 'contrast'],
      properties: {
        colour: { type: 'string', description: 'Surface ladder, accent values, which hues carry meaning, how many semantic hues' },
        typography: { type: 'string', description: 'Scale and ratio, hero-to-body multiple, weights, numerals, the face and its lineage' },
        layout: { type: 'string', description: 'Grid, density, what ranks the hierarchy, spacing rhythm, whether radii/shadows/icons are one family' },
        shape_surface: { type: 'string', description: 'Radius scale, border vs shadow vs tone, elevation logic' },
        components: { type: 'string', description: 'Buttons and components: fill, weight, how loud they are relative to the content' },
        imagery: { type: 'string', description: 'Gradients, photos, renders: where they are, what they cost, what breaks without them' },
        contrast: { type: 'string', description: 'Measured ratios and the named failures' },
      },
    },
    why_verdict: { type: 'string', description: 'One or two sentences tying the verdict to the killers or a constraint' },
    reuse: { type: 'string', description: 'What exactly to take from this reference into a real product, and what to leave' },
    notes: { type: 'string', description: 'Anything the fields cannot hold; ambiguity between two concepts; proposed terms explained' },
    proposed_terms: { type: 'array', items: str },
  };
  return { type: 'object', additionalProperties: false, required: Object.keys(props), properties: props };
}

/* ---------- the user message ---------- */

function userPrompt({ measurement, examples, filename, natureOnly }) {
  const parts = [];
  parts.push(image.measurementText(measurement));
  if (examples && examples.length) {
    parts.push('The most similar references already in the library (by image), with how they were filed — '
      + 'follow their precedent unless this image is genuinely different, and say why if so:\n'
      + examples.map((e) => `- ${e.id} [${e.payload.status}] concept=${e.payload.concept || '?'}`
        + `${e.payload.component_type ? ' component_type=' + e.payload.component_type : ''}`
        + `${e.payload.medium ? ' medium=' + e.payload.medium : ''} — ${e.payload.title}`).join('\n'));
  }
  if (filename) parts.push(`Original filename (a hint only — judge from the image): ${filename}`);
  parts.push(natureOnly
    ? 'Decide the NATURE of this reference. Fill every field of the schema, but only concept, component_type, medium, platform, nature and confidence will be used.'
    : 'Analyse this reference and return the JSON.');
  return parts.join('\n\n');
}

/* ---------- providers ---------- */

let sdkClient = null;
function anthropic() {
  if (sdkClient) return sdkClient;
  let Anthropic;
  try { Anthropic = require('@anthropic-ai/sdk'); } catch {
    throw new Error('the Anthropic SDK is not installed here — run `npm install` in the app folder (the desktop app ships it)');
  }
  Anthropic = Anthropic.default || Anthropic;
  sdkClient = { Anthropic, client: new Anthropic() };
  return sdkClient;
}

async function runClaude(model, effort, { system, prompt, prep }) {
  const { Anthropic, client } = anthropic();
  const params = {
    model,
    max_tokens: 16000,
    // Adaptive thinking is on by default on these models; effort is the depth control.
    output_config: { effort, format: { type: 'json_schema', schema: schema() } },
    system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: prep.mediaType, data: prep.data.toString('base64') } },
        { type: 'text', text: prompt },
      ],
    }],
  };
  let res;
  try {
    // Opus and Sonnet get the server-side refusal fallback; Haiku has none.
    res = /haiku/.test(model)
      ? await client.messages.create(params)
      : await client.beta.messages.create({ ...params, betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' });
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) throw new Error('Claude rejected the API key — set ANTHROPIC_API_KEY for the studio server');
    if (e instanceof Anthropic.RateLimitError) throw new Error('Claude rate limit hit — wait a minute, or analyse with a local model');
    if (e instanceof Anthropic.BadRequestError) throw new Error(`Claude refused the request: ${e.message}`);
    if (e instanceof Anthropic.APIConnectionError) throw new Error('cannot reach the Claude API from this machine');
    throw e;
  }
  if (res.stop_reason === 'refusal') {
    const d = res.stop_details || {};
    throw new Error(`Claude declined this image${d.category ? ` (${d.category})` : ''}${d.explanation ? ': ' + d.explanation : ''}`);
  }
  if (res.stop_reason === 'max_tokens') throw new Error('the analysis ran out of tokens before finishing — retry, or lower effort');
  const text = res.content.filter((b) => b.type === 'text').map((b) => b.text).pop();
  const u = res.usage || {};
  return {
    json: JSON.parse(text),
    by: model,
    usage: { input: u.input_tokens, output: u.output_tokens, cache_read: u.cache_read_input_tokens, cache_write: u.cache_creation_input_tokens },
  };
}

async function runLocal(model, { prompt, prep }) {
  const s = config.settings();
  const local = { ...s.local, model: model || s.local.model };
  const out = await localLLM.chatJSON(local, { system: systemPrompt(true), prompt, image: prep, schema: schema() });
  return { json: out.json, by: `local:${local.model}`, usage: out.usage };
}

/** "claude:claude-haiku-5-5" | "local:qwen2.5vl:7b" | "claude" | "local" → { kind, model } */
function parseAnalyser(spec) {
  const s = config.settings();
  const raw = String(spec || s.analysis.provider || '').trim();
  const [kind, ...rest] = raw.split(':');
  const model = rest.join(':');
  if (kind === 'claude') return { kind, model: model || s.analysis.claudeModel };
  if (kind === 'local') return { kind, model: model || s.local.model };
  if (kind === 'hark') return { kind: 'hark', model: '' };
  // Nothing chosen: Claude if there is a key, else a local model if one is configured.
  if (s.keys.anthropic) return { kind: 'claude', model: s.analysis.claudeModel };
  if (s.local.model) return { kind: 'local', model: s.local.model };
  return { kind: 'hark', model: '' };
}

/** Everything that can analyse on this machine right now, for the Inbox picker. */
async function listAnalysers() {
  const s = config.settings();
  const out = [];
  const def = parseAnalyser('');
  for (const m of CLAUDE_MODELS) {
    out.push({
      id: `claude:${m.id}`, name: m.name, note: m.note, group: 'Claude API',
      available: s.keys.anthropic, why: s.keys.anthropic ? null : 'set ANTHROPIC_API_KEY for the studio server',
    });
  }
  const models = await localLLM.listModels(s.local);
  const vision = models.filter((m) => m.vision && !m.embedding);
  for (const m of vision) {
    out.push({ id: `local:${m.id}`, name: m.id, note: `on this machine · free${m.size ? ' · ' + (m.size / 1e9).toFixed(1) + ' GB' : ''}`, group: 'Local model', available: true });
  }
  if (s.local.model && !vision.some((m) => m.id === s.local.model)) {
    const up = models.length > 0;
    out.push({
      id: `local:${s.local.model}`, name: s.local.model, note: 'configured local model', group: 'Local model',
      available: up, why: up ? null : `no model server answering at ${s.local.url}`,
    });
  }
  out.push({ id: 'hark', name: 'Hark', note: 'analysed in your chat, following design-ingest', group: 'Chat', available: true });
  // No key and nothing configured, but a vision model is installed: that beats asking Hark.
  const defId = def.kind === 'hark' ? (vision[0] ? `local:${vision[0].id}` : 'hark') : `${def.kind}:${def.model}`;
  for (const a of out) a.default = a.id === defId;
  if (!out.some((a) => a.default)) (out.find((a) => a.available) || out[out.length - 1]).default = true;
  return { analysers: out, local: { url: s.local.url, reachable: models.length > 0, models: models.map((m) => m.id) } };
}

/* ---------- normalising what came back ---------- */

const pick = (v, allowed, fallback) => (allowed.includes(v) ? v : fallback);

function normalise(raw) {
  const r = raw || {};
  const concept = pick(r.concept, lib.CONCEPTS, '');
  const validTypes = new Set(lib.componentTypes().map((t) => t.id));
  const component_type = concept === 'component' && validTypes.has(r.component_type) ? r.component_type : '';
  const facets = lib.validateTerms(lib.asList(r.facets));
  // A J term in facets, or an A–K term in archetype, is a valid term in the wrong slot.
  const misplaced = facets.valid.filter((t) => t.facet === 'J' || t.facet === 'I');
  facets.valid = facets.valid.filter((t) => !misplaced.includes(t));
  const arch = lib.validateTerms([...lib.asList(r.archetype), ...misplaced.filter((t) => t.facet === 'J').map((t) => t.id)]);
  arch.valid = arch.valid.filter((t) => t.facet === 'J');
  let archetype = arch.valid.map((t) => t.id).slice(0, 3);
  if (!archetype.length) archetype = concept === 'imagery' ? ['J.REF.imagery'] : concept === 'slide' ? ['J.PRES.slide'] : [];
  const kind = pick(r.kind, ['shipped', 'concept', 'print', 'brand'], 'concept');
  let verdict = pick(r.verdict, ['adopt', 'adapt', 'reject'], 'adapt');
  const notes = [String(r.notes || '').trim()];
  if (verdict === 'adopt' && kind !== 'shipped') {
    verdict = 'adapt';
    notes.push('Verdict lowered from adopt to adapt: a concept needs shipped evidence before it can be adopted (00-model gate).');
  }
  if (concept === 'component' && !component_type) notes.push('Component, but the analyser gave no valid component type — set one in the studio.');
  const dropped = [...facets.unknown, ...arch.unknown].map((u) => u.id);
  if (dropped.length) notes.push(`Terms the analyser used that are not in the vocabulary (dropped): ${dropped.join(', ')}.`);
  const proposed = lib.asList(r.proposed_terms).filter(Boolean);
  if (proposed.length) notes.push(`Proposed new terms: ${proposed.join(', ')}.`);
  return {
    title: String(r.title || '').replace(/\s+/g, ' ').trim().slice(0, 160) || 'Untitled reference',
    concept, component_type,
    medium: pick(r.medium, lib.MEDIA, ''),
    platform: pick(r.platform, lib.PLATFORMS, ''),
    nature: String(r.nature || '').trim(),
    kind,
    archetype,
    facets: [...new Set(facets.valid.map((t) => t.id))],
    imagery_dep: pick(r.imagery_dep, ['hard', 'soft', 'none'], 'none'),
    rtl: pick(r.rtl, ['clean', 'risky', 'breaks'], 'risky'),
    cost: pick(r.cost, ['low', 'med', 'high'], 'med'),
    verdict,
    confidence: pick(r.confidence, ['low', 'med', 'high'], 'low'),
    read: r.read || {},
    why_verdict: String(r.why_verdict || '').trim(),
    reuse: String(r.reuse || '').trim(),
    notes: notes.filter(Boolean),
  };
}

/* ---------- writing the record ---------- */

const slug = (s) => String(s).toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, ' ').replace(/[\s_]+/g, '-')
  .replace(/-+/g, '-').replace(/^-|-$/g, '').split('-').slice(0, 7).join('-') || 'reference';
const yamlStr = (s) => JSON.stringify(String(s));
const list = (a) => '[' + a.join(', ') + ']';

function recordText(id, a, meta) {
  const today = new Date().toISOString().slice(0, 10);
  const R = a.read || {};
  const para = (label, text) => (text && String(text).trim() ? `**${label}.** ${String(text).trim()}` : null);
  const header = meta.measured
    ? `*Analysed by ${meta.by}. Palette and contrast measured off the pixels (histogram-bin means over the whole frame; small-text ratios are lower bounds); other values are the model's reading.*`
    : `*Analysed by ${meta.by}. No pixel measurement for this format — every value is the model's estimate.*`;
  return `---
type: design-ref
id: ${id}
title: ${yamlStr(a.title)}
source: ${yamlStr(meta.source || '')}
kind: ${a.kind}
concept: ${a.concept}
component_type: ${a.component_type}
medium: ${a.medium}
platform: ${a.platform}
captured: ${today}
image: library/${meta.imageName}
archetype: ${list(a.archetype)}
facets: ${list(a.facets)}
imagery_dep: ${a.imagery_dep}
rtl: ${a.rtl}
cost: ${a.cost}
verdict: ${a.verdict}
confidence: ${a.confidence}
status: unreviewed
analysed_by: ${yamlStr(meta.by)}
sam_reaction:
sam_note:
tags: [design/ref]
modified: ${new Date().toISOString()}
---

# ${id} — ${a.title}

## Nature

${a.nature || '—'}

## Read

${[header,
    para('Colour', R.colour), para('Typography', R.typography), para('Layout & harmony', R.layout),
    para('Shape & surface', R.shape_surface), para('Buttons & components', R.components),
    para('Gradient & imagery', R.imagery), para('Contrast', R.contrast)].filter(Boolean).join('\n\n')}

## Why the verdict

${a.why_verdict || '—'}

## How to reuse it

${a.reuse || '—'}

## Notes

${[...a.notes, ...(meta.extraNotes || []), meta.original ? `Original filename: \`${meta.original}\`.` : null].filter(Boolean).join('\n\n') || '—'}

**Related:** ${meta.related && meta.related.length ? meta.related.join(' · ') : '—'}
`;
}

/** Replace a `## heading` section in a body, or insert it before `before`. */
function putSection(text, heading, content, before) {
  const re = new RegExp(`(^## ${heading}\\s*\\n)[\\s\\S]*?(?=^## |(?![\\s\\S]))`, 'm');
  if (re.test(text)) return text.replace(re, `$1\n${content.trim()}\n\n`);
  const at = new RegExp(`^## ${before}\\s*$`, 'm');
  const m = text.match(at);
  if (m) return text.slice(0, m.index) + `## ${heading}\n\n${content.trim()}\n\n` + text.slice(m.index);
  return text.trimEnd() + `\n\n## ${heading}\n\n${content.trim()}\n`;
}

/* ---------- one image ---------- */

async function analyseImage(file, { analyser, natureOnly = false } = {}) {
  const which = parseAnalyser(analyser);
  if (which.kind === 'hark') throw new Error('Hark runs in your chat, not in the server');
  const prep = image.prepare(file);
  const measurement = image.measure(file);
  let examples = [], dups = [];
  try {
    const vindex = require('./vindex.js');
    examples = await vindex.examplesFor(prep, 3);
    dups = examples.filter((e) => e.score >= 0.93);
  } catch { /* no image embedder or no index yet: analyse without precedent */ }
  const prompt = userPrompt({ measurement, examples, filename: path.basename(file), natureOnly });
  const out = which.kind === 'claude'
    ? await runClaude(which.model, config.settings().analysis.effort, { system: systemPrompt(false), prompt, prep })
    : await runLocal(which.model, { prompt, prep });
  return { analysis: normalise(out.json), by: out.by, usage: out.usage, measured: !!measurement, examples, dups };
}

/* ---------- the inbox ---------- */

function inboxFiles() {
  const dir = INBOX();
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
    .map((f) => path.join(dir, f))
    .sort((a, b) => fs.statSync(a).mtimeMs - fs.statSync(b).mtimeMs);
}

/**
 * Analyse every inbox image into a record, one at a time, moving each image into the library
 * only once its record is written — so a failure leaves that image in the inbox to retry.
 */
async function ingestInbox({ analyser, log = () => {}, shouldStop = () => false } = {}) {
  const files = inboxFiles();
  const written = [];
  const failed = [];
  let tokens = { input: 0, output: 0, cache_read: 0 };
  for (const file of files) {
    if (shouldStop()) { log('stopped before ' + path.basename(file)); break; }
    const name = path.basename(file);
    log(`analysing ${name}…`);
    try {
      const res = await analyseImage(file, { analyser });
      const id = lib.nextId('design-ref', 'REF');
      const ext = path.extname(file).toLowerCase().replace('.jpeg', '.jpg');
      const imageName = `${id}${ext}`;
      const extraNotes = res.dups.map((d) => `Possible near-duplicate of ${d.id} (image similarity ${d.score.toFixed(3)}) — compare before keeping both.`);
      const related = res.examples.filter((e) => e.score >= 0.8).map((e) => e.id);
      const text = recordText(id, res.analysis, { by: res.by, measured: res.measured, imageName, original: name, extraNotes, related, source: 'inbox' });
      const recFile = path.join(lib.ROOT, 'references', `${id}-${slug(res.analysis.title)}.md`);
      fs.mkdirSync(LIBRARY(), { recursive: true });
      fs.writeFileSync(recFile, text, 'utf8');
      // Prove the record parses before the image leaves the inbox.
      const fm = lib.frontmatter(fs.readFileSync(recFile, 'utf8'));
      if (!fm || fm.id !== id) { fs.unlinkSync(recFile); throw new Error('the written record did not parse back — nothing was moved'); }
      fs.renameSync(file, path.join(LIBRARY(), imageName));
      written.push({ id, file: recFile, image: path.join(LIBRARY(), imageName), title: res.analysis.title, concept: res.analysis.concept, component_type: res.analysis.component_type, medium: res.analysis.medium, verdict: res.analysis.verdict, confidence: res.analysis.confidence, by: res.by });
      for (const k of Object.keys(tokens)) tokens[k] += (res.usage && res.usage[k]) || 0;
      log(`  ${id}  ${res.analysis.concept}${res.analysis.component_type ? ' · ' + res.analysis.component_type : ''} · ${res.analysis.medium} · ${res.analysis.verdict} (${res.analysis.confidence})  ${res.analysis.title}`);
    } catch (e) {
      failed.push({ file: name, error: e.message });
      log(`  ✗ ${name}: ${e.message}`);
    }
  }
  if (written.length) {
    lib.writeRefIndex();
    try {
      const r = await require('./vindex.js').sync();
      log(`vector index: ${r.embeddedText} text / ${r.embeddedImages} image embeddings (${r.provider})`);
    } catch (e) { log(`vector index not updated: ${e.message}`); }
  }
  return { written, failed, tokens };
}

/* ---------- re-deciding the nature of existing records ---------- */

async function reclassifyNature(id, { analyser } = {}) {
  const rec = lib.records('design-ref').find((r) => r.id === id);
  if (!rec) throw new Error(`no record ${id}`);
  const img = rec.image && path.join(lib.ROOT, 'references', rec.image);
  if (!img || !fs.existsSync(img)) throw new Error(`${id}: image not in this copy of the library`);
  const res = await analyseImage(img, { analyser, natureOnly: true });
  const a = res.analysis;
  const file = path.join(lib.ROOT, rec._file);
  const before = fs.readFileSync(file, 'utf8');
  let text = lib.setFrontmatter(before, {
    concept: a.concept, component_type: a.component_type || '', medium: a.medium, platform: a.platform,
  });
  text = putSection(text, 'Nature', `${a.nature}\n\n*Nature re-decided by ${res.by} (confidence ${a.confidence}).*`, 'Read');
  fs.writeFileSync(file, text, 'utf8');
  const fm = lib.frontmatter(fs.readFileSync(file, 'utf8'));
  if (!fm || fm.id !== id) { fs.writeFileSync(file, before, 'utf8'); throw new Error(`${id}: rewrite did not parse back — rolled back`); }
  return { id, from: { concept: lib.conceptOf(rec), component_type: lib.componentTypeOf(rec), medium: rec.medium || '' }, to: { concept: a.concept, component_type: a.component_type, medium: a.medium, platform: a.platform }, by: res.by, file };
}

module.exports = {
  analyseImage, ingestInbox, reclassifyNature, listAnalysers, parseAnalyser,
  systemPrompt, schema, normalise, recordText, putSection, CLAUDE_MODELS,
};

/* ---------- CLI ---------- */

if (require.main === module) {
  const argv = process.argv.slice(2);
  const flag = (k) => { const i = argv.indexOf(k); return i === -1 ? undefined : argv[i + 1]; };
  let analyser = flag('--with');
  const gitCommit = (msg) => {
    try {
      const root = path.resolve(lib.ROOT, '..');
      if (!fs.existsSync(path.join(root, '.git'))) return;
      execFileSync('git', ['-C', root, 'add', path.join(lib.ROOT, 'references')]);
      execFileSync('git', ['-C', root, '-c', 'user.name=design-studio', '-c', 'user.email=studio@localhost', 'commit', '-q', '-m', msg]);
    } catch { /* nothing to commit, or no git */ }
  };
  (async () => {
    if (!analyser && !argv.includes('--list')) {
      const d = (await listAnalysers()).analysers.find((a) => a.default);
      if (!d || d.id === 'hark') throw new Error('no analyser available — set ANTHROPIC_API_KEY, or start Ollama with a vision model (see --list)');
      analyser = d.id;
    }
    if (argv.includes('--list')) {
      const { analysers, local } = await listAnalysers();
      for (const a of analysers) process.stdout.write(`${a.default ? '*' : ' '} ${a.available ? ' ' : '✗'} ${a.id.padEnd(34)} ${a.note}${a.why ? '  — ' + a.why : ''}\n`);
      process.stdout.write(`\nlocal server ${local.url}: ${local.reachable ? local.models.join(', ') || '(no models)' : 'not reachable'}\n`);
      return;
    }
    if (argv.includes('--nature')) {
      const ids = argv.includes('--all') ? lib.records('design-ref').map((r) => r.id) : argv.filter((x) => /^REF-\d+$/.test(x));
      const done = [];
      for (const id of ids) {
        try {
          const r = await reclassifyNature(id, { analyser });
          done.push(id);
          process.stdout.write(`${id}  ${r.from.concept || '?'} → ${r.to.concept}${r.to.component_type ? ' · ' + r.to.component_type : ''} · ${r.to.medium} · ${r.to.platform}\n`);
        } catch (e) { process.stdout.write(`${id}  ✗ ${e.message}\n`); }
      }
      if (done.length) { gitCommit(`Re-decide nature for ${done.length} refs (${parseAnalyser(analyser).kind})`); await require('./vindex.js').sync().catch(() => {}); }
      return;
    }
    const r = await ingestInbox({ analyser, log: (m) => process.stdout.write(m + '\n') });
    if (r.written.length) gitCommit(`Ingest ${r.written.length} refs (${r.written[0].id}–${r.written[r.written.length - 1].id}), analysed by ${r.written[0].by}`);
    process.stdout.write(`\n${r.written.length} written, ${r.failed.length} failed. Tokens: ${JSON.stringify(r.tokens)}\n`);
    if (r.failed.length) process.exitCode = 1;
  })().catch((e) => { process.stderr.write(`analyse: ${e.message}\n`); process.exit(1); });
}

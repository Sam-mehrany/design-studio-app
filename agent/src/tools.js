'use strict';
/**
 * The agent's tools.
 *
 * A tool is two things: a DEFINITION (name, description, JSON Schema) that the model
 * reads, and an IMPLEMENTATION that our code runs when the model asks. The model never
 * touches files or pixels itself — it can only ask for one of these.
 *
 * Definitions are written once in a neutral shape { name, description, input_schema };
 * each model adapter converts them to its provider's format.
 *
 * Two tools FINISH a pin: write_record and mark_duplicate. They validate everything and
 * reply with precise errors when something is wrong, so the model can fix it and retry.
 * That retry — the model reading an error and correcting itself — is the core of what
 * makes this an agent rather than a single prompt.
 */
const fs = require('fs');
const path = require('path');
const img = require('./image');
const { writeRecord, noteDuplicate } = require('./record');

const ENUMS = {
  concept: ['web', 'mobile', 'component', 'slide', 'imagery', 'mockup'],
  kind: ['shipped', 'concept', 'print', 'brand'],
  imagery_dep: ['hard', 'soft', 'none'],
  rtl: ['clean', 'risky', 'breaks'],
  cost: ['low', 'med', 'high'],
  verdict: ['adopt', 'adapt', 'reject'],
  confidence: ['low', 'med', 'high'],
};

const str = (description) => ({ type: 'string', description });
const strList = (description) => ({ type: 'array', items: { type: 'string' }, description });

const DEFINITIONS = [
  {
    name: 'sample_colors',
    description: 'Measure the dominant colours of the image, or of one region of it. Call this before writing ANY hex value: every hex code in the record must come from this tool. Use regions to isolate a surface, a button, body text on its background, an accent. Returns hex values with their share of the area in %.',
    input_schema: {
      type: 'object',
      properties: {
        region: {
          type: 'object',
          description: 'Optional crop, as fractions of the image (0–1): x,y = top-left corner, w,h = size. Omit for the whole image.',
          properties: { x: { type: 'number' }, y: { type: 'number' }, w: { type: 'number' }, h: { type: 'number' } },
          required: ['x', 'y', 'w', 'h'],
        },
        count: { type: 'integer', description: 'How many colours to return (1–12, default 6).' },
      },
    },
  },
  {
    name: 'contrast_ratio',
    description: 'WCAG contrast ratio between two measured colours, e.g. body text on its background. Use it for every contrast claim. AA needs 4.5:1 for body text, 3:1 for large text and UI.',
    input_schema: {
      type: 'object',
      properties: { foreground: str('Hex colour of the text or icon, e.g. #5a5a5a'), background: str('Hex colour behind it') },
      required: ['foreground', 'background'],
    },
  },
  {
    name: 'search_terms',
    description: 'Search the facet vocabulary when you know the idea but not the term ID. Matches IDs, names and definitions.',
    input_schema: {
      type: 'object',
      properties: { query: str('A word or phrase, e.g. "glass", "bento", "serif display"'), facet: str('Optional facet letter A–K to restrict the search') },
      required: ['query'],
    },
  },
  {
    name: 'validate_terms',
    description: 'Check term IDs against the vocabulary. Returns which are valid and, for unknown ones, near-miss suggestions. write_record runs the same check, so use this to fix terms early.',
    input_schema: { type: 'object', properties: { terms: strList('Term IDs, e.g. ["C.PAL.neutral-only", "J.ACQ.landing"]') }, required: ['terms'] },
  },
  {
    name: 'find_similar_refs',
    description: 'Compare this image against every image already in the library by visual fingerprint. Call it once, early, to check for duplicates. Distance is 0–256: under ~20 is almost certainly the same image (crop or re-save), 20–40 is worth checking, over 60 is unrelated.',
    input_schema: { type: 'object', properties: { limit: { type: 'integer', description: 'How many to return (default 5)' } } },
  },
  {
    name: 'read_record',
    description: 'Read an existing REF record (frontmatter and analysis). Use it to check a possible duplicate, or to see how a related reference was classified.',
    input_schema: { type: 'object', properties: { ref_id: str('e.g. REF-0054') }, required: ['ref_id'] },
  },
  {
    name: 'write_record',
    description: 'FINISH this image by writing its analysed REF record. Call it exactly once, after measuring colours and choosing terms. Every term is validated; every hex code must have been measured with sample_colors or contrast_ratio. If anything is wrong you get the list of problems back — fix them and call write_record again.',
    input_schema: {
      type: 'object',
      properties: {
        title: str('What the image is, specific and visual, max ~110 characters. e.g. "Laptop mockup on a dark plinth — concrete-texture landing, orange single accent"'),
        concept: { type: 'string', enum: ENUMS.concept, description: 'What artefact the image depicts — decide this FIRST (skill step 0).' },
        kind: { type: 'string', enum: ENUMS.kind, description: 'shipped = a real product; concept = a portfolio/Dribbble shot.' },
        archetype: strList('One or two J.* terms. imagery → J.REF.imagery; slides → J.PRES.slide or J.PRES.deck (+ a subject archetype).'),
        facets: strList('Descriptive terms from facets A–I and K. Typically 6–14.'),
        imagery_dep: { type: 'string', enum: ENUMS.imagery_dep },
        rtl: { type: 'string', enum: ENUMS.rtl },
        cost: { type: 'string', enum: ENUMS.cost },
        verdict: { type: 'string', enum: ENUMS.verdict },
        confidence: { type: 'string', enum: ENUMS.confidence },
        read: {
          type: 'object',
          description: 'The ## Read section: one short paragraph per design subject, with real measured values. About the DESIGN, not the product.',
          properties: {
            method: str('One sentence: what was measured and how (e.g. "Measured: palette by region sampling; contrast by WCAG formula on sampled pairs.") and what was only estimated.'),
            colour: str('Surface ladder and accents with hex values; which hues carry meaning.'),
            typography: str('Scale and ratio, weights, numerals, lineage. "None — no type in frame." if none.'),
            layout: str('Grid, density, what ranks the hierarchy, spacing rhythm.'),
            shape: str('Radius scale, border vs shadow vs tone, elevation.'),
            components: str('Buttons and components: fill, weight, loudness relative to content.'),
            imagery: str('Gradients and imagery: where, what they cost, what breaks without them.'),
            contrast: str('Measured ratios for real text/background pairs, and named failures.'),
          },
          required: ['method', 'colour', 'typography', 'layout', 'shape', 'components', 'imagery', 'contrast'],
        },
        why_verdict: str('One or two sentences tying the verdict to the killers (imagery_dep, rtl, cost) or the shipped/concept gate.'),
        notes: str('Optional: concept doubts, missing vocabulary to propose, adaptation ideas. The pin URL and file name are added automatically.'),
        related: strList('Optional: REF IDs of close relatives in the library.'),
      },
      required: ['title', 'concept', 'kind', 'archetype', 'facets', 'imagery_dep', 'rtl', 'cost', 'verdict', 'confidence', 'read', 'why_verdict'],
    },
  },
  {
    name: 'mark_duplicate',
    description: 'FINISH this image WITHOUT a new record, because it is the same picture as an existing REF (a crop, re-save or re-pin). Adds a dated note with the pin URL to the existing record. Only use it after find_similar_refs and read_record have convinced you it is the same image, not just a similar style.',
    input_schema: {
      type: 'object',
      properties: { ref_id: str('The existing record it duplicates'), reason: str('Why it is the same image, e.g. "square crop of the same render".') },
      required: ['ref_id', 'reason'],
    },
  },
];

/* ---------- implementations ---------- */

const normHex = (h) => '#' + img.parseHex(h).map((v) => v.toString(16).padStart(2, '0')).join('');
const near = (a, b) => { const x = img.parseHex(a), y = img.parseHex(b); return x.every((v, i) => Math.abs(v - y[i]) <= 8); };

let libraryHashes = null; // computed once per process, shared by every pin
async function hashLibrary(lib, vault) {
  if (libraryHashes) return libraryHashes;
  const dir = path.join(vault, 'references', 'library');
  const titles = new Map(lib.records('design-ref').map((r) => [r.id, r]));
  libraryHashes = [];
  for (const f of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
    const id = f.split('.')[0];
    try { libraryHashes.push({ id, hash: await img.dhash(path.join(dir, f)), rec: titles.get(id) }); } catch { /* unreadable image: skip */ }
  }
  return libraryHashes;
}

function checkRecord(ctx, rec) {
  const problems = [];
  for (const [k, allowed] of Object.entries(ENUMS)) {
    if (!allowed.includes(rec[k])) problems.push(`${k} must be one of ${allowed.join(' | ')} (got ${JSON.stringify(rec[k])})`);
  }
  if (!rec.title || String(rec.title).length < 8) problems.push('title is missing or too short');
  const arch = Array.isArray(rec.archetype) ? rec.archetype : [];
  const facets = Array.isArray(rec.facets) ? rec.facets : [];
  if (!arch.length) problems.push('archetype needs at least one J.* term');
  if (arch.some((t) => !/^J\./.test(t))) problems.push('archetype may only hold J.* terms; put other terms in facets');
  if (facets.some((t) => /^[JL]\./.test(t))) problems.push('facets may not hold J.* (archetype) or L.* (rubric) terms');
  if (facets.length < 3) problems.push('facets: give at least 3 descriptive terms');
  const { unknown } = ctx.lib.validateTerms([...arch, ...facets]);
  for (const u of unknown) problems.push(`unknown term ${u.id}${u.suggestions.length ? ` — did you mean ${u.suggestions.join(', ')}?` : ' — search_terms to find the right one, or describe the gap in notes'}`);
  if (rec.concept === 'imagery' && !arch.includes('J.REF.imagery')) problems.push('concept imagery takes archetype J.REF.imagery');
  if (rec.concept === 'slide' && !arch.some((t) => /^J\.PRES\./.test(t))) problems.push('concept slide takes J.PRES.slide or J.PRES.deck');
  if (rec.kind === 'concept' && rec.verdict === 'adopt') problems.push('a concept shot can never be verdict adopt on its own (shipped beats concept) — use adapt');
  const read = rec.read || {};
  for (const k of ['method', 'colour', 'typography', 'layout', 'shape', 'components', 'imagery', 'contrast']) {
    if (!read[k] || String(read[k]).trim().length < 3) problems.push(`read.${k} is missing`);
  }
  // Measured, not guessed: every hex in the analysis must match something a tool returned.
  const text = Object.values(read).join(' ') + ' ' + (rec.why_verdict || '') + ' ' + (rec.notes || '');
  const hexes = [...new Set((text.match(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/gi) || []).map(normHex))];
  const unmeasured = hexes.filter((h) => ![...ctx.measured].some((m) => near(h, m)));
  if (unmeasured.length) problems.push(`these hex values were never measured: ${unmeasured.join(', ')} — sample the region they belong to, or remove them`);
  const known = new Set(ctx.lib.records('design-ref').map((r) => r.id));
  for (const r of rec.related || []) if (!known.has(r)) problems.push(`related ${r} does not exist`);
  return problems;
}

async function run(ctx, name, input) {
  input = input || {};
  switch (name) {
    case 'sample_colors': {
      const colors = await img.palette(ctx.pin.file, { region: input.region, count: input.count || 6 });
      colors.forEach((c) => ctx.measured.add(c.hex));
      return { region: input.region || 'whole image', colors };
    }
    case 'contrast_ratio': {
      const fg = normHex(input.foreground), bg = normHex(input.background);
      ctx.measured.add(fg); ctx.measured.add(bg);
      const ratio = img.contrastRatio(fg, bg);
      return { foreground: fg, background: bg, ratio: `${ratio}:1`, AA_body_text: ratio >= 4.5, AA_large_text_and_UI: ratio >= 3 };
    }
    case 'search_terms': {
      const q = String(input.query || '').toLowerCase();
      const facet = input.facet ? String(input.facet).toUpperCase() : null;
      const hits = ctx.lib.allTerms()
        .filter((t) => t.facet !== 'L' && (!facet || t.facet === facet))
        .filter((t) => `${t.id} ${t.name} ${t.definition}`.toLowerCase().includes(q))
        .slice(0, 20).map((t) => ({ id: t.id, name: t.name, definition: t.definition }));
      return hits.length ? hits : { none: `no term matches "${input.query}"` };
    }
    case 'validate_terms': {
      const { valid, unknown } = ctx.lib.validateTerms(input.terms || []);
      return { valid: valid.map((t) => t.id), unknown };
    }
    case 'find_similar_refs': {
      const all = await hashLibrary(ctx.lib, ctx.vault);
      const mine = await img.dhash(ctx.pin.file);
      return all.map((e) => ({ ref: e.id, distance: img.hamming(mine, e.hash), title: e.rec ? e.rec.title : '', concept: e.rec ? e.rec.concept : '' }))
        .sort((a, b) => a.distance - b.distance).slice(0, Math.min(10, input.limit || 5));
    }
    case 'read_record': {
      const rec = ctx.lib.records('design-ref').find((r) => r.id === String(input.ref_id).toUpperCase());
      if (!rec) throw new Error(`no record ${input.ref_id}`);
      return fs.readFileSync(path.join(ctx.vault, rec._file), 'utf8').slice(0, 6000);
    }
    case 'write_record': {
      const problems = checkRecord(ctx, input);
      if (problems.length) throw new Error(`Record not written. Fix these and call write_record again:\n- ${problems.join('\n- ')}`);
      const out = writeRecord({ lib: ctx.lib, vault: ctx.vault, pin: ctx.pin, rec: input, mode: ctx.mode, outDir: ctx.outDir, label: ctx.label });
      ctx.result = { action: 'written', ...out, rec: input };
      return `Written as ${out.id}. This image is finished — stop now and reply with one line summarising it.`;
    }
    case 'mark_duplicate': {
      const out = noteDuplicate({ lib: ctx.lib, vault: ctx.vault, pin: ctx.pin, refId: String(input.ref_id).toUpperCase(), reason: input.reason, mode: ctx.mode, outDir: ctx.outDir, label: ctx.label });
      ctx.result = { action: 'duplicate', ...out };
      return `Noted on ${out.id}. This image is finished — stop now.`;
    }
    default:
      throw new Error(`unknown tool ${name}`);
  }
}

/** Run one tool call and always return a result the model can read — errors included. */
async function execute(ctx, name, input) {
  try {
    if (ctx.result) throw new Error('this image is already finished — stop now');
    const out = await run(ctx, name, input);
    return { content: typeof out === 'string' ? out : JSON.stringify(out), isError: false };
  } catch (e) {
    return { content: `Error: ${e.message}`, isError: true };
  }
}

module.exports = { DEFINITIONS, execute, ENUMS };

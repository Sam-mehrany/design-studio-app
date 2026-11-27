'use strict';
/**
 * Builds the system prompt.
 *
 * Three parts, in this order (stable → so the Claude adapter can cache it):
 *   1. What this agent is and how its tools map onto the ingest steps.
 *   2. "Mode 1 — Ingest" from design/tools/design-ingest-SKILL.md, read live from the vault,
 *      so this agent and every other ingester follow ONE copy of the rules.
 *   3. The facet vocabulary (A–K), so the model picks terms from the real list instead
 *      of inventing plausible-looking ones.
 */
const fs = require('fs');
const path = require('path');

const PREAMBLE = `You are the Design Studio ingest agent. You analyse ONE design reference image at a time into the
design taxonomy, using tools. You run unattended: nobody will answer questions, so decide, and record
doubts in notes.

How your tools map onto the ingest steps below:
- Step 1 (look at the image): the image is attached to the first message. Look at it carefully.
- Step 2 (dedupe): call find_similar_refs once, early. If a distance is under ~25, read_record that REF
  and decide whether it is the SAME picture (crop, re-save, re-pin) — then call mark_duplicate. A similar
  style is not a duplicate.
- Steps 3, 6, 7, 8 (ID, write, move image, index): write_record does all of these. Never invent an ID.
- Step 4 (classify): follow the reading order — concept first, then archetype, shipped-or-concept,
  the three killers, then facets A–H.
- Step 5 (validate terms): use only term IDs from the vocabulary at the end of this prompt; use
  search_terms / validate_terms when unsure. write_record rejects unknown terms.
- Measuring: every hex value you write must come from sample_colors (sample regions: the page
  background, a card surface, body text, the accent, the main button) and every contrast claim
  from contrast_ratio. write_record rejects hex values that were never measured.

Finish every image by calling write_record (or mark_duplicate) — that is the only way the work is
saved. If write_record returns problems, fix exactly those and call it again. After it succeeds, reply
with one line and stop. A classifier never writes a stance: you only describe and propose a verdict.

Below is the ingest skill you follow. Where it mentions the design_validate MCP tool, moving files,
the inbox path or index-refs.js, your tools above already do that for you.

`;

function ingestSkill(vault, repoTools) {
  const candidates = [path.join(vault, 'tools', 'design-ingest-SKILL.md'), path.join(repoTools, 'design-ingest-SKILL.md')];
  const file = candidates.find((f) => fs.existsSync(f));
  if (!file) throw new Error('design-ingest-SKILL.md not found in the vault or the repo');
  const text = fs.readFileSync(file, 'utf8');
  const start = text.indexOf('## Mode 1');
  const end = text.indexOf('## Mode 2');
  if (start < 0) throw new Error(`no "## Mode 1" section in ${file}`);
  // The opening rule ("a classifier never writes a Stance") sits above Mode 1 — keep it too.
  const rule = text.match(/## The rule that cannot be broken[\s\S]*?(?=\n## )/);
  return (rule ? rule[0].trim() + '\n\n' : '') + text.slice(start, end > start ? end : undefined).trim();
}

/** detail: "full" = id + name + definition (best results), "names" = id + name (smaller, for small local models). */
function vocabulary(lib, detail = 'full') {
  const out = ['## Facet vocabulary (the only valid term IDs)', ''];
  for (const [letter, name] of Object.entries(lib.FACET_NAMES)) {
    if (letter === 'L') continue; // the evaluation rubric is for critique, not classification
    const f = lib.parseFacet(letter);
    if (!f) continue;
    out.push(`### ${letter} — ${name}`);
    for (const d of f.dimensions) {
      out.push(`${d.id} — ${d.name}:`);
      for (const t of d.terms) out.push(detail === 'names' ? `- ${t.id} (${t.name})` : `- ${t.id} — ${t.name}: ${t.definition}`);
    }
    out.push('');
  }
  return out.join('\n');
}

function systemPrompt({ lib, vault, repoTools, vocab = 'full' }) {
  return PREAMBLE + ingestSkill(vault, repoTools) + '\n\n' + vocabulary(lib, vocab);
}

/** The per-image opening message. Volatile details go here, never in the system prompt. */
function firstMessage(pin, meta) {
  const s = pin.sidecar;
  const lines = [`Analyse this image and file it. File: ${path.basename(pin.file)} (${meta.width}×${meta.height}px).`];
  if (s) {
    lines.push(`It was saved to the Pinterest board "${s.board}".`);
    if (s.description) lines.push(`Pin description: ${s.description}`);
    if (s.link) lines.push(`The pin links to: ${s.link}`);
    lines.push('The board is a hint about why it was saved, not proof of what it depicts — judge the concept from the image.');
  }
  return lines.join('\n');
}

module.exports = { systemPrompt, firstMessage, vocabulary };

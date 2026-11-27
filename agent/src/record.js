'use strict';
/**
 * Turns the model's structured answer into a REF record, in exactly the layout the
 * ingest skill (and the studio's parser in lib.js) expects.
 *
 * The model decides WHAT goes in the record. This file decides HOW it is written:
 * the ID, the filename, the frontmatter syntax, the image move, and the pin line in
 * ## Notes. Those are bookkeeping, and bookkeeping is never left to a model, because a
 * slip there (a reused ID, a missing pin URL) corrupts the library silently.
 */
const fs = require('fs');
const path = require('path');

const READ_SECTIONS = [
  ['colour', 'Colour'], ['typography', 'Typography'], ['layout', 'Layout & harmony'],
  ['shape', 'Shape & surface'], ['components', 'Buttons & components'],
  ['imagery', 'Gradient & imagery'], ['contrast', 'Contrast'],
];

const list = (a) => `[${(a || []).join(', ')}]`;
const today = () => new Date().toISOString().slice(0, 10);

function slugify(title) {
  return String(title).toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .split('-').filter(Boolean).slice(0, 8).join('-').slice(0, 60).replace(/-+$/, '') || 'reference';
}

/** The pin facts come from the sync sidecar, written by code, so they are always right. */
function pinNotes(pin) {
  const s = pin.sidecar;
  const parts = [`Original file: \`${path.basename(pin.file)}\`.`];
  if (s) {
    parts.push(`Pin: ${s.pin}`);
    if (s.link) parts[parts.length - 1] += ` — outbound link: ${s.link}`;
    parts[parts.length - 1] += '.';
    if (s.description) parts.push(`Pin description: ${s.description.replace(/\s+/g, ' ').trim()}.`);
  }
  return parts.join(' ');
}

function render(id, rec, pin, imageRel) {
  const source = pin.sidecar
    ? `Pinterest board '${pin.sidecar.board}' (${pin.sidecar.user || pin.user || 'pinterest'})`
    : 'Design Studio inbox';
  const fm = [
    '---',
    'type: design-ref',
    `id: ${id}`,
    `title: ${JSON.stringify(rec.title)}`,
    `source: ${JSON.stringify(source)}`,
    `kind: ${rec.kind}`,
    `concept: ${rec.concept}`,
    `captured: ${today()}`,
    `image: ${imageRel}`,
    `archetype: ${list(rec.archetype)}`,
    `facets: ${list(rec.facets)}`,
    `imagery_dep: ${rec.imagery_dep}`,
    `rtl: ${rec.rtl}`,
    `cost: ${rec.cost}`,
    `verdict: ${rec.verdict}`,
    `confidence: ${rec.confidence}`,
    'status: unreviewed',
    'sam_reaction:',
    'sam_note:',
    'tags: [design/ref]',
    `modified: ${new Date().toISOString()}`,
    '---',
  ].join('\n');

  const read = rec.read || {};
  const body = [
    `# ${id} — ${rec.title}`,
    '',
    '## Read',
    '',
    String(read.method || '').trim(),
    '',
    ...READ_SECTIONS.flatMap(([k, label]) => [`**${label}.** ${String(read[k] || '—').trim()}`, '']),
    '## Why the verdict',
    '',
    String(rec.why_verdict || '').trim(),
    '',
    '## Notes',
    '',
    [pinNotes(pin), String(rec.notes || '').trim()].filter(Boolean).join(' '),
    '',
    `**Related:** ${(rec.related || []).length ? rec.related.join(' · ') : '—'}`,
    '',
  ].join('\n');
  return `${fm}\n\n${body}`;
}

/**
 * Write the record. In "vault" mode it allocates the next REF ID, writes the .md, moves the
 * image into library/ and deletes the sidecar. In "preview" mode it writes one file to
 * outDir and touches nothing in the vault, so you can compare models safely.
 */
function writeRecord({ lib, vault, pin, rec, mode, outDir, label }) {
  const ext = path.extname(pin.file).toLowerCase() || '.jpg';
  if (mode === 'preview') {
    const id = 'REF-PREVIEW';
    fs.mkdirSync(outDir, { recursive: true });
    const file = path.join(outDir, `${path.basename(pin.file, ext)}.${label}.md`);
    fs.writeFileSync(file, render(id, rec, pin, `(preview) ${path.basename(pin.file)}`));
    return { id, file };
  }
  const refs = path.join(vault, 'references');
  const id = lib.nextId('design-ref', 'REF');
  const file = path.join(refs, `${id}-${slugify(rec.title)}.md`);
  const imageRel = `library/${id}${ext}`;
  fs.mkdirSync(path.join(refs, 'library'), { recursive: true });
  fs.writeFileSync(file, render(id, rec, pin, imageRel));
  fs.renameSync(pin.file, path.join(refs, imageRel));
  if (pin.sidecarFile && fs.existsSync(pin.sidecarFile)) fs.unlinkSync(pin.sidecarFile);
  return { id, file };
}

/** A near-duplicate: note it (with the pin URL, so the sync skips it) on the existing record. */
function noteDuplicate({ lib, vault, pin, refId, reason, mode, outDir, label }) {
  const rec = lib.records('design-ref').find((r) => r.id === refId);
  if (!rec) throw new Error(`no record ${refId}`);
  const recFile = path.join(vault, rec._file); // lib gives paths relative to the vault
  const s = pin.sidecar;
  const what = s ? `Pinterest pin ${s.pin} (board '${s.board}', file \`${path.basename(pin.file)}\`${s.width ? `, ${s.width}×${s.height}` : ''})`
    : `inbox file \`${path.basename(pin.file)}\``;
  const line = `Near-duplicate seen ${today()}: ${what} — ${String(reason).trim()} Not given its own REF.`;
  if (mode === 'preview') {
    fs.mkdirSync(outDir, { recursive: true });
    const file = path.join(outDir, `${path.basename(pin.file, path.extname(pin.file))}.${label}.md`);
    fs.writeFileSync(file, `# Duplicate of ${refId}\n\nWould add to ${rec._file} → ## Notes:\n\n> ${line}\n`);
    return { id: refId, file, line };
  }

  let text = fs.readFileSync(recFile, 'utf8');
  const notes = text.match(/\n## Notes\n\n([\s\S]*?)(\n\n\*\*Related:\*\*|\n## |\s*$)/);
  if (notes) {
    const end = notes.index + 1 + '## Notes\n\n'.length + notes[1].length;
    text = text.slice(0, end) + ' ' + line + text.slice(end);
  } else {
    text = text.trimEnd() + `\n\n## Notes\n\n${line}\n`;
  }
  fs.writeFileSync(recFile, text);
  fs.unlinkSync(pin.file);
  if (pin.sidecarFile && fs.existsSync(pin.sidecarFile)) fs.unlinkSync(pin.sidecarFile);
  return { id: refId, file: recFile, line };
}

module.exports = { writeRecord, noteDuplicate, slugify, READ_SECTIONS };

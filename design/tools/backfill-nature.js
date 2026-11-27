#!/usr/bin/env node
'use strict';
/**
 * Apply tools/nature-backfill.json to the records in this vault.
 *
 *   node tools/backfill-nature.js            # apply
 *   node tools/backfill-nature.js --check    # report what would change, write nothing
 *
 * Safe to run on a vault that has moved on since the file was written:
 *  - concept is replaced (fixing footers and sign-in cards filed as "web" is the point),
 *    EXCEPT on a record Sam has corrected — his correction wins;
 *  - component_type, medium and platform are only filled where empty;
 *  - a `## Nature` section is added only where the record has none;
 *  - status, reactions, notes and every other key are left exactly as they are.
 */

const fs = require('fs');
const path = require('path');
const lib = require('./lib.js');
const { putSection } = require('./analyse.js');

const CHECK = process.argv.includes('--check');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'nature-backfill.json'), 'utf8')).refs;

let changed = 0;
for (const r of lib.records('design-ref')) {
  const row = data[r.id];
  if (!row) continue;
  const [concept, componentType, medium, platform, why] = row;
  const updates = {};
  if (r.status !== 'corrected' && String(r.concept || '') !== concept) updates.concept = concept;
  const effective = updates.concept || r.concept;
  if (!lib.componentTypeOf(r) && componentType && effective === 'component') updates.component_type = componentType;
  if (!r.medium) updates.medium = medium;
  if (!r.platform) updates.platform = platform;
  const hasNature = !!lib.section(r._body, 'Nature');
  if (!Object.keys(updates).length && hasNature) continue;

  changed++;
  const desc = Object.entries(updates).map(([k, v]) => `${k}=${v}`).join(' ');
  process.stdout.write(`${r.id}  ${desc}${hasNature ? '' : ' +## Nature'}${r.status === 'corrected' && String(r.concept) !== concept ? '  (concept kept: corrected by Sam)' : ''}\n`);
  if (CHECK) continue;

  const file = path.join(lib.ROOT, r._file);
  const before = fs.readFileSync(file, 'utf8');
  let text = Object.keys(updates).length ? lib.setFrontmatter(before, updates) : before;
  if (!hasNature) text = putSection(text, 'Nature', `${why}\n\n*Nature backfilled by Hark, 27 Nov 2026, from the image.*`, 'Read');
  fs.writeFileSync(file, text, 'utf8');
  const fm = lib.frontmatter(fs.readFileSync(file, 'utf8'));
  if (!fm || fm.id !== r.id) { fs.writeFileSync(file, before, 'utf8'); throw new Error(`${r.id}: rewrite did not parse back — rolled back`); }
}
process.stdout.write(`\n${changed} record(s) ${CHECK ? 'would change' : 'updated'}.\n`);

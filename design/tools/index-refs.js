#!/usr/bin/env node
'use strict';
/** Regenerate references/index.md from the records. Run after an ingest. */
const lib = require('./lib.js');
const r = lib.writeRefIndex();
if (!r) { process.stderr.write('no references/index.md to update\n'); process.exit(1); }
process.stdout.write(`${r.changed ? 'updated' : 'unchanged'}: ${r.file} (${r.refs} references)\n`);

#!/usr/bin/env node
'use strict';
/**
 * Set a facet term's stance safely. A thin CLI over lib.setStance — all the guards and
 * the verification live there, so the studio, the skill and a human get identical rules.
 *
 *   node set-stance.js <TERM> like|reject|conditional --pref PREF-0014 [--condition "..."]
 *   node set-stance.js <TERM> required  [--note "..."]
 *   node set-stance.js <TERM> unknown   [--note "..."]
 *
 * Refuses: a taste stance with no PREF, a PREF that does not list the term, a polarity
 * that disagrees with the PREF, a conditional with no condition, a term in a table with
 * no Stance column, and any change that would flip an already-recorded stance.
 */
const lib = require('./lib.js');

const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf('--' + name);
  return i === -1 ? undefined : argv[i + 1];
};

const [term, stance] = argv;
if (!term || !stance || term.startsWith('--')) {
  process.stderr.write(
    'usage: set-stance.js <TERM> like|reject|conditional|required|unknown [--pref ID] [--condition "..."] [--note "..."]\n');
  process.exit(2);
}

try {
  const res = lib.setStance(term, {
    stance,
    prefId: flag('pref'),
    condition: flag('condition'),
    note: flag('note'),
  });
  if (res.unchanged) {
    process.stdout.write(`unchanged: ${term} already reads "${res.cell}"\n`);
  } else {
    process.stdout.write(`${term}: "${res.from}"  ->  "${res.to}"\n  ${res.file}:${res.line}\n`);
  }
} catch (e) {
  process.stderr.write(`refused: ${e.message}\n`);
  process.exit(1);
}

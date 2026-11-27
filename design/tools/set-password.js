#!/usr/bin/env node
'use strict';
/**
 * Make a STUDIO_PASSWORD_HASH for the studio login, without the password ever touching a file.
 *
 *   node design/tools/set-password.js            # prompts (input hidden)
 *
 * Put the printed line in the host's environment variables (or a local .env you don't commit).
 */
const { hashPassword } = require('./auth.js');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
rl._writeToOutput = (s) => { if (!rl.muted) rl.output.write(s); };
rl.question('New studio password: ', (pw) => {
  rl.close();
  process.stdout.write('\n');
  if (!pw || pw.length < 8) { console.error('Use at least 8 characters.'); process.exit(1); }
  console.log(`STUDIO_PASSWORD_HASH=${hashPassword(pw)}`);
});
rl.muted = true;

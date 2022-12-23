import * as url from 'node:url';
import * as path from 'node:path';

import { execa } from 'execa';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const fixturesFolder = path.join(__dirname, 'fixtures');
const binPath = path.join(__dirname, '../bin/bottled-ember.js');

/**
  * @typedef {{
  *   cwd: string
  * }} RunOptions;
  */
export function run({ cwd }) {
  return execa('node', [binPath], { cwd });
}

export async function prepareFixture(name) {
  let fixture = path.join(fixturesFolder, name);

  // error if doesn't exist
  // create tmp directory
  // copy to tmp directory
  // return path to tmp directory
}

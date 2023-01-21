import { execa } from 'execa';
import * as path from 'node:path';
import * as url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const fixturesFolder = path.join(__dirname, 'fixtures');
const binPath = path.join(__dirname, '../bin/buttered-ember.js');

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

  console.info({ fixture });
  // error if doesn't exist
  // create tmp directory
  // copy to tmp directory
  // return path to tmp directory
}

import { execa } from 'execa';
import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const fixturesFolder = path.join(__dirname, 'fixtures');
const binPath = path.join(__dirname, '../src/bin.js');

interface DirOrFixture {
  cwd?: string;
  onFixture?: string;
}

export function run({ cwd, onFixture }: DirOrFixture) {
  if (onFixture) {
    return execa('node', [binPath], { cwd: path.join(fixturesFolder, onFixture) });
  }

  if (cwd) {
    return execa('node', [binPath], { cwd });
  }

  return { exitCode: 1 };
}

export async function findFixtures(): Promise<string[]> {
  return (await fs.readdir(fixturesFolder, { withFileTypes: true }))
    .filter((stat) => stat.isDirectory())
    .map((stat) => stat.name);
}

export async function prepareFixture(name) {
  let fixture = path.join(fixturesFolder, name);

  console.info({ fixture });
  // error if doesn't exist
  // create tmp directory
  // copy to tmp directory
  // return path to tmp directory
}

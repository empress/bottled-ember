import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

import { execa } from 'execa';
import yn from 'yn';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const fixturesFolder = path.join(__dirname, 'fixtures');

const binPath = path.join(__dirname, '../src/bin.js');

interface DirOrFixture {
  cwd?: string;
  onFixture?: string;
  cmd?: 'test' | 'serve';
}

const VERBOSE = yn((process.env as any).VERBOSE);

export function run(cmd: 'test' | 'serve', { cwd, onFixture }: DirOrFixture) {
  if (onFixture) {
    if (VERBOSE) {
      console.debug(
        `Running on fixture: \n\n` +
          `\tnode ${binPath} ${cmd}\n\n` +
          `In ${path.join(fixturesFolder, onFixture)}`
      );
    }

    return execa('node', [binPath, cmd], {
      cwd: path.join(fixturesFolder, onFixture),
      stdio: 'inherit',
    });
  }

  if (cwd) {
    if (VERBOSE) {
      console.debug(`Running in directory: \n\n` + `\tnode ${binPath} ${cmd}\n\n` + `In ${cwd}`);
    }

    return execa('node', [binPath, cmd], { cwd, stdio: 'inherit' });
  }

  return { exitCode: 1, stderr: 'no fixture, nor cwd' };
}

export async function findFixtures(): Promise<string[]> {
  return (await fs.readdir(fixturesFolder, { withFileTypes: true }))
    .filter((stat) => stat.isDirectory())
    .map((stat) => stat.name);
}

export async function prepareFixture(name: string) {
  let fixture = path.join(fixturesFolder, name);

  console.info({ fixture, name });
  // error if doesn't exist
  // create tmp directory
  // copy to tmp directory
  // return path to tmp directory
}

export async function clearCache() {
  await fs.rm(path.join(__dirname, '../node_modules/.cache'), { recursive: true, force: true });
}

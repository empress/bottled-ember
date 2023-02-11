import { execa } from 'execa';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

/**
 * @param {Options} options
 * @param {string} cacheDir
 */
export async function generateApp(options, cacheDir) {
  await fs.mkdir(cacheDir, { recursive: true });

  await init(options, cacheDir);
}

/**
 * @param {string} cacheDir
 */
export async function installDependencies(cacheDir) {
  await fs.writeFile(path.join(cacheDir, '.npmrc'), 'auto-install-peers=true');

  await execa('npx', ['pnpm', 'install'], {
    cwd: cacheDir,
  });
}

/**
 * @param {Options} options
 * @param {string} cacheDir
 */
export async function init(options, cacheDir) {
  const initCommand = execa(
    'npx',
    [
      `ember-cli@${options.emberVersion}`,
      'init',
      '--skip-npm',
      '--no-welcome',
      '--name',
      options.name,
    ],
    {
      cwd: cacheDir,
    }
  );

  await initCommand;
}

/**
 * @param {Options} options
 */
export function getCacheDir(options) {
  const pathSafeVersion = options.emberVersion.replace(/\./g, '-');
  const cacheName = `buttered-ember-${pathSafeVersion}-${options.cacheName}`;
  // Local Cache (node_modudles/.cache) does not allow dependency installation
  // const cacheDir = findCacheDir({ name: cacheName });
  const tmpDir = os.tmpdir();
  const cacheDir = path.join(tmpDir, cacheName);

  return cacheDir;
}

import { execa } from 'execa';
import findCacheDir from 'find-cache-dir';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * @param {Options} options
 * @param {string} cacheDir
 */
export async function generateApp(options, cacheDir) {
  console.log('generating your buttered-ember app now 🤖');

  await fs.mkdir(cacheDir, { recursive: true });

  await init(options, cacheDir);

  console.log(`buttered-ember app finished initialising 🤖`);
}

/**
 * @param {string} cacheDir
 */
export async function installDependencies(cacheDir) {
  await fs.writeFile(path.join(cacheDir, '.npmrc'), 'auto-install-peers=true');

  console.log('installing dependencies 🤖');

  await execa('npx', ['pnpm', 'install'], {
    cwd: cacheDir,
  });

  console.log('finished installing dependencies 🤖');
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
  const cacheDir = findCacheDir({ name: cacheName });

  return cacheDir;
}

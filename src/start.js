// @ts-check

/**
 * Local Alias:
 * @typedef {import('./types').Options} Options
 */

import { execa } from 'execa';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';

import { applyLayers } from './customizations.js';
import { generateApp, getCacheDir, installDependencies } from './init.js';
import { resolveOptions } from './options.js';

/**
 * @param {any} args
 */
export async function start(args) {
  const options = await resolveOptions(args);
  const cacheDir = getCacheDir(options);

  if (!existsSync(cacheDir)) {
    await generateApp(options, cacheDir);
    await installDependencies(cacheDir);

    console.log('customising buttered-ember app 🤖');

    rmSync(join(cacheDir, 'app/templates/application.hbs'));

    await applyLayers(options, cacheDir);

    console.log('installing linking your local app 🤖');

    await execa('npx', ['pnpm', 'install', process.cwd()], {
      cwd: cacheDir,
    });

    console.log('buttered-ember app successfully generated 🦾');
  } else {
    console.log('re-using existing buttered-ember app 🤖');
  }

  await installCustomDeps(options, cacheDir);

  const commandArgs = ['ember-cli', 'serve'];

  if (options.outputPath) {
    commandArgs.push('--output-path', join(process.cwd(), options.outputPath));
  } else {
    commandArgs.push('--output-path', join(process.cwd(), 'dist'));
  }

  if (options.port !== null && options.port !== undefined) {
    commandArgs.push(`--port=${options.port}`);
  }

  if (options.environment) {
    commandArgs.push('--environment', options.environment);
  }

  await execa('npx', commandArgs, {
    cwd: cacheDir,
    stdio: 'inherit',
  });
}

/**
 * @param {Options} options
 * @param {string} cacheDir
 */
async function installCustomDeps(options, cacheDir) {
  if (options.deps?.length) {
    let newDeps = [];

    for (let [name, version] of Object.entries(options.deps)) {
      newDeps.push(`${name}@${version}`);
    }

    console.log('installing your personal dependencies 🤖');

    if (newDeps.length) {
      await execa('npx', ['pnpm', 'add', ...newDeps], {
        cwd: cacheDir,
      });
    }

    console.log('finished installing your personal dependencies 🤖');
  }
}

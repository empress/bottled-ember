#!/usr/bin/env node
// @ts-check

import { execa } from 'execa';
/**
 * Local Alias:
 * @typedef {import('./types').Options} Options
 */
import { existsSync, lstatSync, readlinkSync, rmdirSync, rmSync, symlinkSync } from 'fs';
import { readJsonSync } from 'fs-extra/esm';
import minimist from 'minimist';
import { join } from 'path';

import { applyDefaultCustomizations, applyTemplate } from './customizations.js';
import { generateApp, getCacheDir, installDependencies } from './init.js';
import { resolveOptions } from './options.js';

const argv = minimist(process.argv.slice(2));

async function run() {
  const options = await resolveOptions(argv);
  const cacheDir = getCacheDir(options);

  if (!existsSync(cacheDir)) {
    await generateApp(options, cacheDir);
    await installDependencies(cacheDir);

    console.log('customising buttered-ember app 🤖');

    rmSync(join(cacheDir, 'app/templates/application.hbs'));

    if (options.templateOverlay) {
      await applyTemplate(options, cacheDir);
    } else {
      await applyDefaultCustomizations(options, cacheDir);
    }

    console.log('installing linking your local app 🤖');

    await execa('npx', ['pnpm', 'install', process.cwd()], {
      cwd: cacheDir,
    });

    console.log('buttered-ember app successfully generated 🦾');
  } else {
    console.log('re-using existing buttered-ember app 🤖');
  }

  if (options.deps?.length) {
    const deps = options.deps;

    const pkg = readJsonSync(`${cacheDir}/package.json`);

    if (!deps.every((dep) => pkg.dependencies?.[dep])) {
      console.log('installing your personal dependencies 🤖');
      await execa('npx', ['pnpm', 'install', ...deps], {
        cwd: cacheDir,
      });

      console.log('finished installing your personal dependencies 🤖');
    } else {
      console.log('keeping exising deps 🤖');
    }
  }

  if (options.links?.length) {
    const links = options.links;

    links.forEach((link) => {
      let source, destination;

      if (link.includes(':')) {
        let split = link.split(':');

        source = split[0];
        destination = split[1];
      } else {
        source = destination = link;
      }

      const destiantionPath = join(cacheDir, destination);
      const sourcePath = join(process.cwd(), source);

      if (existsSync(destiantionPath)) {
        const stats = lstatSync(destiantionPath);

        if (!stats.isSymbolicLink() || readlinkSync(destiantionPath) !== sourcePath) {
          rmdirSync(destiantionPath, {
            recursive: true,
            force: true,
          });
        }
      }

      if (!existsSync(destiantionPath)) {
        console.log(`linking ${source} -> ${destination} 🤖`);
        symlinkSync(sourcePath, destiantionPath);
      }
    });
  }

  const commandArgs = ['ember', argv._[0] || 'serve'];

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
    stderr: 'inherit',
    stdout: 'inherit',
  });
}

run();

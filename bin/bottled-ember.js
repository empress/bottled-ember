#!/usr/bin/env node
// @ts-check

import * as fsSync from 'node:fs';
import * as path from 'node:path';

import fse from 'fs-extra';
import minimist from 'minimist';
import { execa } from 'execa';

import { resolveOptions } from './options.js';
import { generateApp, getCacheDir, installDependencies } from './init.js';


/**
  * Local Alias:
  * @typedef {import('./types').Options} Options
  */
const {
  existsSync,
  rmSync,
  symlinkSync,
  lstatSync,
  rmdirSync,
  readlinkSync,
} = require('fs');
const { join } = require('path');


const argv = minimist(process.argv.slice(2));

async function run() {
  const options = await resolveOptions(argv);
  const cacheDir = getCacheDir(options);

  if (!existsSync(cacheDir)) {
    await generateApp(options, cacheDir);
    await installDependencies(cacheDir);

    console.log('customising bottled-ember app 🤖');

    rmSync(join(cacheDir, 'app/templates/application.hbs'));

    if (await fse.pathExists(join(process.cwd(), 'config.js'))) {
      fsSync.renameSync(
        path.join(cacheDir, 'config/environment.js'),
        path.join(cacheDir, 'config/old-environment.js')
      );

      fsSync.writeFileSync(
        join(cacheDir, 'config/environment.js'),
        `const oldEnvironment = require('./old-environment');

      module.exports = function(environment) {
        const ENV = oldEnvironment(environment);

        try {
          const newEnvironment = require('${join(process.cwd(), 'config')}');

          const newEnv = newEnvironment(environment);

          return {
            ...ENV,
            ...newEnv,
          }
        } catch {
          return ENV;
        }
      }`
      );
    }

    fsSync.rmSync(path.join(cacheDir, 'ember-cli-build.js'));

    fsSync.writeFileSync(
      path.join(cacheDir, 'ember-cli-build.js'),
      `'use strict';

      const EmberApp = require('ember-cli/lib/broccoli/ember-app');
      const mergeTrees = require('broccoli-merge-trees');
      const { join } = require('path');
      const { existsSync } = require('fs');
      let buildConfig = {}

      try {
        const localConfig = require('${path.join(process.cwd(), 'config')}');

        if (localConfig['ember-cli-build']) {
          buildConfig = localConfig['ember-cli-build'];
        }
      } catch {
        // do nothing
      }

      let trees = {};

      // todo make no-overlay work at runtime so you don't need to clear cache
      if (${options.noOverlay ? false : true} && existsSync(join('${process.cwd()}', 'app'))) {
        trees.app = mergeTrees([join(__dirname, 'app'), join('${process.cwd()}', 'app')], { overwrite: true })
      }

      if (${options.noOverlay ? false : true} && existsSync(join('${process.cwd()}', 'tests'))) {
        trees.tests = mergeTrees([join(__dirname, 'tests'), join('${process.cwd()}', 'tests')], { overwrite: true })
      }

      module.exports = function (defaults) {
        let app = new EmberApp({
          ...defaults,
          trees,
        }, buildConfig);
        return app.toTree();
      };
      `
    );

    console.log('installing linking your local app 🤖');

    await execa('npx', ['pnpm', 'install', process.cwd()], {
      cwd: cacheDir,
    });

    console.log('bottled-ember app successfully generated 🦾');
  } else {
    console.log('re-using existing bottled-ember app 🤖');
  }

  if (options.deps?.length) {
    const deps = options.deps;

    const pkg = require(`${cacheDir}/package.json`);

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

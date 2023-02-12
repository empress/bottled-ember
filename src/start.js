// @ts-check

/**
 * Local Alias:
 * @typedef {import('./types').Options} Options
 */

import { packageJson } from 'ember-apply';
import { execa } from 'execa';
import { existsSync, rmSync } from 'fs';
import { Listr } from 'listr2';
import path, { join } from 'path';

import { addDependenciesFromLocalTemplate, applyLayers, dependenciesForTemplate, modifyDependenciesFromOptions } from './customizations.js';
import { removeDefaults } from './dependencies.js';
import { generateApp, getCacheDir, installDependencies } from './init.js';
import { resolveOptions, verifyOptions } from './options.js';

/**
 * @param {import('./types').Args} args
 */
export async function start(args) {
  const options = await resolveOptions(args);
  const cacheDir = getCacheDir(options);

  let tasks = new Listr(
    [
      {
        title: 'Preparation',
        task: async (_ctx, task) => {
          task.output = `Verifying options...`;
          await verifyOptions(options);

          let local = cacheDir.replace(process.env.HOME, '~');

          task.output = `Buttered app in ${local}`;
        },
        options: {
          persistentOutput: true,
          bottomBar: true,
        },
      },
      {
        title: 'Building App',
        options: {
          persistentOutput: true,
        },
        task: async (ctx, task) => {
          if (args.force) {
            task.output = '--force detected. Clearing cache.';

            rmSync(cacheDir, { recursive: true, force: true });
          } else if (args.reLayer) {
            task.output = '--re-layer detected.';
          }

          // let alreadyGenerated = existsSync(path.join(cacheDir, 'app'));
          // let shouldRelayer = args.reLayer || !alreadyGenerated;
          let hasDependencies = existsSync(path.join(cacheDir, 'node_modudles'));

          return task.newListr(
            [
              {
                title: 'Generating app',
                options: {
                  persistentOutput: true,
                },
                task: async (_ctx, task) => {
                  let alreadyGenerated = existsSync(path.join(cacheDir, 'app'));

                  if (alreadyGenerated) {
                    task.output = 'App already built! 🎉';

                    return;
                  }

                  await generateApp(options, cacheDir);
                },
              },
              {
                title: 'Configuring dependencies',
                skip: () => hasDependencies,
                task: () => removeDefaults(options, cacheDir),
              },
              {
                title: 'Installing dependencies',
                skip: () => hasDependencies,
                task: async () => installDependencies(cacheDir),
              },
              {
                title: 'Applying customizations',
                // skip: () => !shouldRelayer,
                task: async () => {
                  rmSync(join(cacheDir, 'app/templates/application.hbs'), { force: true });

                  await applyLayers(options, cacheDir);
                },
              },
            ],
            { rendererOptions: { collapse: false } }
          );
        },
      },
    ],
    { rendererOptions: { collapse: false } }
  );

  await tasks.run();

  await runEmber(options, cacheDir);
}

/**
 * @param {Options} options
 * @param {string} cacheDir
 */
async function runEmber(options, cacheDir) {

  const commandArgs = ['ember-cli', options.command];

  if (options.outputPath) {
    commandArgs.push('--output-path', join(process.cwd(), options.outputPath));
  } else {
    commandArgs.push('--output-path', join(process.cwd(), 'dist'));
  }

  if (options.port !== null && options.port !== undefined && options.command !== 'test') {
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

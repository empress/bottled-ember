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

import { applyLayers, dependenciesForTemplate } from './customizations.js';
import { generateApp, getCacheDir, installDependencies } from './init.js';
import { resolveOptions } from './options.js';

/**
 * Less stuff to install, the faster install happens.
 * the linting and formatting stuff, in particular, has a lot of on-disk space.
 */
const DEFAULT_DEPS_TO_REMOVE = [
  'eslint',
  'eslint-config-prettier',
  'eslint-plugin-ember',
  'eslint-plugin-n',
  'eslint-plugin-prettier',
  'eslint-plugin-qunit',
  'prettier',
  'concurrently',
  'babel-eslint',
  'ember-fetch',
  'ember-data',
];

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
        task: async (ctx, task) => {
          let alreadyExists = existsSync(cacheDir);

          if (args.force) {
            task.output = '--force detected. Clearing cache.';

            rmSync(cacheDir, { recursive: true });
          } else if (args.reLayer) {
            task.output = '--re-layer detected.';
          } else {
            if (alreadyExists) {
              task.title = 'App already built! 🎉';
              task.skip();

              return;
            }
          }

          return task.newListr(
            [
              {
                title: 'Generating app',
                task: (_ctx, task) => {
                  let alreadyGenerated = existsSync(path.join(cacheDir, 'app'));

                  if (alreadyGenerated && args.reLayer) {
                    task.skip();
                  }

                  return generateApp(options, cacheDir);
                },
              },
              {
                title: 'Configuring dependencies',
                task: () => modifyDependencies(options, cacheDir),
              },
              {
                title: 'Installing dependencies',
                task: () => installDependencies(cacheDir),
              },
              // {
              //   title: 'Linking current folder to the app',
              //   task: () => link(cacheDir),
              // },
              {
                title: 'Applying customizations',
                task: async () => {
                  rmSync(join(cacheDir, 'app/templates/application.hbs'));

                  await applyLayers(options, cacheDir);
                },
              },
            ]
            // { concurrent: false }
          );
        },
      },
    ]
    // { concurrent: false }
  );

  await tasks.run();

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

/**
 * @param {string} cacheDir
 */
// async function link(cacheDir) {
//   await execa('npx', ['pnpm', 'install', process.cwd()], {
//     cwd: cacheDir,
//   });
// }

/**
 * @param {Options} options
 * @param {string} cacheDir
 */
async function modifyDependencies(options, cacheDir) {
  let templateDeps = await dependenciesForTemplate(options);

  await packageJson.modify((pJson) => {
    let newDeps = options.dependencies || {};
    let toRemove = [...DEFAULT_DEPS_TO_REMOVE, ...(options.removeDependencies || [])];

    if (pJson.devDependencies) {
      for (let dep of toRemove) {
        delete pJson.devDependencies[dep];
      }

      for (let dep of Object.keys(newDeps)) {
        delete pJson.devDependencies[dep];
      }
    }

    if (pJson.dependencies) {
      for (let dep of toRemove) {
        delete pJson.devDependencies[dep];
      }
    }

    pJson.dependencies = {
      ...(pJson.dependencies || {}),
      ...templateDeps,
      ...newDeps,
    };
  }, cacheDir);
}
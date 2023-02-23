#!/usr/bin/env node
// @ts-check

import { createRequire } from 'node:module';
import path from 'node:path';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { start } from './start.js';

const DEFAULT_EMBER_VERSION = '4.10.0';
const require = createRequire(import.meta.url);

let yarg = yargs(hideBin(process.argv));

yarg.wrap(yarg.terminalWidth());

let pkg = require(path.join('..', 'package.json'));

yarg
  .version(pkg.version)
  .command(
    ['start [command] [commandOption]', '$0'],
    'bootstrap an ember app without any boilerplate',
    (yargs) => {
      yargs.positional('command', {
        type: 'string',
        description: 'Command to pass through to ember-cli',
        default: 'serve',
      });
      yargs.positional('commandOption', {
        type: 'string',
        description:
          'For some commands, there may be sub-commands. For example, try:one can take a "scenario-name"',
      });
      yargs.option('addon', {
        type: 'boolean',
        alias: 'a',
        description:
          'when present, addon-mode is used, which opts in to ember-try + a different default ember-cli-build.js. In this mode, many other flags are disabled.',
        default: false,
      });
      yargs.option('local-files', {
        type: 'string',
        alias: 'l',
        description: 'The path to the local files to load in to the bootstrapped app.',
        default: './',
      });
      yargs.option('port', {
        type: 'number',
        alias: 'p',
        description: 'The port to run the app on',
        default: '4200',
      });
      yargs.option('name', {
        type: 'string',
        alias: 'n',
        description: 'The name of the app. This is the module that imports will come from.',
        default: 'my-app',
      });
      yargs.option('emberVersion', {
        type: 'string',
        description: 'The version of ember-source and ember-cli to use.',
        default: DEFAULT_EMBER_VERSION,
      });
      yargs.option('cacheName', {
        type: 'string',
        description:
          `When working with multiple buttered ember apps, you may want to customize the cache name. ` +
          `By default, this is chosen for you and is based off the folder path. ` +
          `The folder path will be printed to stdout for debugging / inspecting if needed.`,
      });
      yargs.option('output-path', {
        type: 'string',
        alias: 'o',
        description:
          'The output directory to write the built app to. This may be useful for deploying the app to a CDN, for example.',
      });
      yargs.option('environment', {
        type: 'string',
        alias: ['e', 'env'],
        description:
          'The environment to run the app in. This is passed to ember-cli as the EMBER_ENV environment variable.',
        default: 'development',
      });
      yargs.option('force', {
        type: 'boolean',
        default: false,
        description: 'A debugging flag used to ignore and clear cache before booting.',
      });
      yargs.option('re-layer', {
        type: 'boolean',
        default: false,
        description: 'A debugging flag used to re-apply the layers on top of the base app.',
      });
    },
    (args) => {
      return start(args);
    }
  )
  .strict().argv;

#!/usr/bin/env node
// @ts-check

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { start } from './start.js';

const DEFAULT_EMBER_VERSION = '4.10.0';

yargs(hideBin(process.argv))
  .command(['start', '$0 [local-files]'], 'the default command -- boots the ember app',
    (yargs) => {
      yargs.option('local-files', {
        type: 'string',
        description: 'The path to the local files to load in to the bootstrapped app.',
        default: './',
      });
      yargs.option('port', {
        type: 'number',
        alias: 'p',
        description: 'The port to run the app on',
        default: '4200',
      });
      yargs.option('emberVersion', {
        type: 'string',
        description: 'The version of ember-source and ember-cli to use.',
        default: DEFAULT_EMBER_VERSION,
      });
      yargs.option('cacheName', {
        type: 'string',
        description: `When working with multiple buttered ember apps, you may want to customize the cache name. ` + `By default, this is chosen for you and is based off the folder path. ` + `The folder path will be printed to stdout for debugging / inspecting if needed.`
      });
      yargs.option('output', {
        type: 'string',
        alias: 'o',
        description: 'The output directory to write the built app to. This may be useful for deploying the app to a CDN, for example.'
      });
      yargs.option('environment', {
        type: 'string',
        alias: ['e', 'env'],
        description: 'The environment to run the app in. This is passed to ember-cli as the EMBER_ENV environment variable.',
        default: 'development',
      });
    },
    (args) => {
      return start(args);
    }
  ).help().argv;


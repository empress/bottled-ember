#!/usr/bin/env ts-node
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-console */
/* eslint-disable n/shebang */

import path from 'node:path';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import {
  copyToNewTmp,
  findEmberTry,
  findFixtures,
  fixturesFolder,
  testPackagesFolder,
} from '../tests/utils.js';

// How do you do this?
const isInteractive = process.env['USERNAME'] === 'nvp';

yargs(hideBin(process.argv))
  .command(
    ['list-fixtures'],
    'lists the known fixtures -- for use for splitting C.I.',
    () => {},
    async () => {
      let fixtureNames = await findFixtures();
      let emberTryNames = await findEmberTry();

      if (isInteractive) {
        console.info([...fixtureNames, ...emberTryNames]);

        return;
      }

      let fixtures = [...fixtureNames, ...emberTryNames].map((name) => ({ name }));
      let output = JSON.stringify({ fixtures });

      // STDOUT is used to pipe to C.I. env vars
      console.log(output);
    }
  )
  .command(
    ['output [name]'],
    'outputs a fixture to a tmp directory',
    (yargs) => {
      return yargs.positional('name', {
        description: 'the name of the fixture to copy',
        type: 'string',
        required: true,
      });
    },
    async (args) => {
      let fixtureNames = await findFixtures();
      let emberTryNames = await findEmberTry();

      if (!args.name) {
        throw new Error('Missing fixture name');
      }

      if (fixtureNames.includes(args.name)) {
        let location = await copyToNewTmp(path.join(fixturesFolder, args.name));

        console.info(location);

        return;
      }

      if (emberTryNames.includes(args.name)) {
        let location = await copyToNewTmp(path.join(testPackagesFolder, args.name));

        console.info(location);

        return;
      }

      throw new Error(`Unknown fixture: ${args.name}`);
    }
  )
  .command(
    ['adopt [sourceLocation]'],
    'copies a directory to be a fixture',
    (yargs) => {
      return yargs.positional('sourceLocation', {
        type: 'string',
        description: 'the source location of the fixture to copy. package.json is required',
      });
    },
    async () => {
      // info('Coping fixture to tmp directory');
      // await adoptFixture(`${argv.sourceLocation}`);
      // info('Done! ✨');
    }
  )
  .help()
  .demandCommand().argv;

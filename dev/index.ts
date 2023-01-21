#!/usr/bin/env ts-node
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-console */
/* eslint-disable n/shebang */

// import { execa } from 'execa';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

yargs(hideBin(process.argv))
  .command(
    ['list-fixtures'],
    'lists the known fixtures -- for use for splitting C.I.',
    () => {},
    async () => {
      // let names = await findFixtures();

      // let fixtures = names.map((name) => ({ name }));
      // let output = JSON.stringify({ fixtures });

      // STDOUT is used to pipe to C.I. env vars
      // console.log(output);
    }
  )
  .command(
    ['output [name]'],
    'outputs a fixture to a tmp directory',
    (yargs) => {
      return yargs.positional('name', {
        description: 'the name of the fixture to copy',
      });
    },
    async () => {
      // info('Coping fixture to tmp directory');

      // let project = await addonFrom(`${argv.name}`);

      // console.info(project.rootPath);

      // info('Done! ✨');
    }
  )
  .command(
    ['adopt [sourceLocation]'],
    'copies a directory to be a fixture',
    (yargs) => {
      return yargs.positional('sourceLocation', {
        type: 'string',
        description:
          'the source location of the fixture to copy. package.json is required',
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

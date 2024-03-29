#!/usr/bin/env node
'use strict';

const findCacheDir = require('find-cache-dir');
const { program } = require('commander');

const {
  existsSync,
  writeFileSync,
  symlinkSync,
  lstatSync,
  rmdirSync,
  readlinkSync,
} = require('fs');

const { join } = require('path');

const generateApp = require('../lib/generateApp');
const customiseApp = require('../lib/customiseApp');

program
  .name('Bottled Ember')
  .description('A handy version of Ember that you can take with you whever you go!')
  .version(require(`${__dirname}/../package.json`).version);

program.enablePositionalOptions();

program
  .option('--ember-version <string>', 'The Ember version that you want bottled ember to generate for you. Default: 4.0', '4.0')
  .option('--cache-name <string>', 'A suffix to add to your cached Bottled Ember folder so you can have multiple apps with the same version', 'default')
  .option('--no-overlay', 'Tuns off the default behaviour of overlaying `app` and `tests` folders into your Bottled Ember app')
  .option('--deps <string>', 'A comma seperated list of extra dependencies you would like to install into your Bottled Ember App')
  .option('--links <string>', 'A comma seperated list of folders you want to link into the Bottled Ember App. You can provide these in the format `source:destination` or you can just provide one folder name and it will be used as both source and destination')
  .option('--output-path <string>', 'The dist folder for your Bottled Ember App. You only need to set this when you are running multiple apps at the same time', 'dist')
  .option('-p, --port <number>', 'The port to run you Bottled Ember App on if you are running locally')
  .option('--environment <string>', 'Passes the environment through to the Bottled Ember app e.g. --environment production');

program.argument('[command]', 'The command you want to pass to your Bottled Ember App.', 'serve');

program.parse();
const options = program.opts();

const emberVersion = options.emberVersion;

let cacheDir;

if (process.env.BOTTLED_CACHE_DIR) {
  cacheDir = process.env.BOTTLED_CACHE_DIR;
} else {
  cacheDir = findCacheDir({
    name: `bottled-ember-${emberVersion.replace(/\./g, '-')}-${options.cacheName}`,
  });
}

async function run() {
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const execa = (await import('execa')).execa;

  if (!existsSync(cacheDir)) {
    await generateApp(cacheDir, emberVersion);

    writeFileSync(join(cacheDir, '.npmrc'), 'auto-install-peers=true');

    if (!process.env.BOTTLED_SKIP_DEPENDENCIES) {
      console.log('installing dependencies 🤖');

      await execa('npx', ['pnpm', 'install'], {
        cwd: cacheDir,
      });

      console.log('finished installing dependencies 🤖');
    } else {
      console.log('skipping installing dependencies 🤖');
    }

    customiseApp(cacheDir, options);

    console.log('installing linking your local app 🤖');

    await execa('npx', ['pnpm', 'install', process.cwd()], {
      cwd: cacheDir,
    });

    console.log('bottled-ember app successfully generated 🦾');
  } else {
    console.log('re-using existing bottled-ember app 🤖');
  }

  if (options.deps) {
    const deps = options.deps.split(',');

    const pkg = require(`${cacheDir}/package.json`);

    if (!deps.every(dep => pkg.dependencies?.[dep])) {
      console.log('installing your personal dependencies 🤖');
      await execa('npx', ['pnpm', 'install', ...deps], {
        cwd: cacheDir,
      });

      console.log('finished installing your personal dependencies 🤖');
    } else {
      console.log('keeping exising deps 🤖');
    }
  }

  if (options.links) {
    const links = options.links.split(',');

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

  const commandArgs = ['ember', program.args[0] || 'serve'];

  commandArgs.push('--output-path', join(process.cwd(), options.outputPath));

  if (options.port) {
    commandArgs.push(`--port=${options.port}`);
  }

  if (options.environment) {
    commandArgs.push('--environment', options.environment);
  }

  if (!process.env.BOTTLED_SKIP_COMMAND) {
    await execa(
      'npx',
      commandArgs,
      {
        cwd: cacheDir,
        stderr: 'inherit',
        stdout: 'inherit',
      }
    );
  }

}

run();

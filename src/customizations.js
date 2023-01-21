/**
  * Local Alias:
  * @typedef {import('./types').Options} Options
  */
import fse from 'fs-extra';
import * as fsSync from 'node:fs';
import * as path from 'node:path';

export async function applyDefaultCustomizations(options, cacheDir) {
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
}

/**
  * @param {Options} options
  * @param {string} cacheDir
  */
export async function applyTemplate(options, cacheDir) {
 let target;

 if (options.templateOverlay.startsWith('.')) {
    // relative to options' directory?
 }
}

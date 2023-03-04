'use strict';

      const EmberApp = require('ember-cli/lib/broccoli/ember-app');
      const mergeTrees = require('broccoli-merge-trees');
      const { join } = require('path');
      const { existsSync } = require('fs');
      let buildConfig = {}

      try {
        const localConfig = require('$FILE_PATH$/config');

        if (localConfig['ember-cli-build']) {
          buildConfig = localConfig['ember-cli-build'];
        }
      } catch {
        // do nothing
      }

      let trees = {};

      // todo make no-overlay work at runtime so you don't need to clear cache
      if (false && existsSync(join('$FILE_PATH$', 'app'))) {
        trees.app = mergeTrees([join(__dirname, 'app'), join('$FILE_PATH$', 'app')], { overwrite: true })
      }

      if (false && existsSync(join('$FILE_PATH$', 'tests'))) {
        trees.tests = mergeTrees([join(__dirname, 'tests'), join('$FILE_PATH$', 'tests')], { overwrite: true })
      }

      module.exports = function (defaults) {
        let app = new EmberApp({
          ...defaults,
          trees,
        }, buildConfig);
        return app.toTree();
      };

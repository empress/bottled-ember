const { rmSync, renameSync, writeFileSync, readFileSync, write } = require('fs');
const { join } = require('path');

module.exports = async function customiseApp(cacheDir, options) {
  console.log('customising bottled-ember app 🤖');

  await rmSync(join(cacheDir, 'app/templates/application.hbs'));

  await renameSync(
    join(cacheDir, 'config/environment.js'),
    join(cacheDir, 'config/old-environment.js')
  );

  await writeFileSync(
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

  await rmSync(join(cacheDir, 'ember-cli-build.js'));

  await writeFileSync(
    join(cacheDir, 'ember-cli-build.js'),
    `'use strict';

    const EmberApp = require('ember-cli/lib/broccoli/ember-app');
    const mergeTrees = require('broccoli-merge-trees');
    const { join } = require('path');
    const { existsSync } = require('fs');
    let buildConfig = {}

    try {
      const localConfig = require('${join(process.cwd(), 'config')}');

      if (localConfig['ember-cli-build']) {
        buildConfig = localConfig['ember-cli-build'];
      }
    } catch {
      // do nothing
    }

    let trees = {};

    // todo make no-overlay work at runtime so you don't need to clear cache
    if (${options.overlay ? true : false} && existsSync(join('${process.cwd()}', 'app'))) {
      trees.app = mergeTrees([join(__dirname, 'app'), join('${process.cwd()}', 'app')], { overwrite: true })
    }

    if (${options.overlay ? true : false} && existsSync(join('${process.cwd()}', 'tests'))) {
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

  try {
    const customConfig = require(join(process.cwd(), 'config'));

    // if we have fastbootDependencies then we write them to the package.json
    if(customConfig.fastbootDependencies) {
      const cacheJSON = JSON.parse(readFileSync(join(cacheDir, 'package.json')));

      cacheJSON.fastbootDependencies = customConfig.fastbootDependencies;

      writeFileSync(join(cacheDir, 'package.json'), JSON.stringify(cacheJSON, null, 2));
    }
  } catch {
    // ignore
  }

  console.log('finished customising bottled-ember app 🤖');
}

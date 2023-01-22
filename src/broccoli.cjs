'use strict';

const path = require('path');
const { existsSync } = require('fs');
const mergeTrees = require('broccoli-merge-trees');

function watchTrees() {
  let current = process.cwd();
  let app = path.join(current, 'app');
  let tests = path.join(current, 'tests');

  let trees = {};

  if (existsSync(app)) {
    trees.app = mergeTrees([app], { overwrite: true });
  }

  if (existsSync(tests)) {
    trees.tests = mergeTrees([tests], { overwrite: true });
  }

  return trees;
}

module.exports = { watchTrees };

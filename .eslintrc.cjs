'use strict';

const { configs } = require('@nullvoxpopuli/eslint-configs');

// ESM is default, use configs.nodeCJS for CommonJS
module.exports = configs.node();

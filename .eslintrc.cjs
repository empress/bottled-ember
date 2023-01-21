'use strict';

const { configs } = require('@nullvoxpopuli/eslint-configs');

// The Node config does ESM, CJS, TS, etc
const config = configs.node();

module.exports = {
  ...config,
  overrides: [
    ...config.overrides,
    {
      files: ['**/*.js'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
};

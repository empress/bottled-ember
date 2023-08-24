'use strict';

module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  plugins: ['node'],
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
  ],
  env: {
    browser: false,
    node: true,
  },
  rules: {},
  overrides: [
    // test files
    {
      files: ['test/*.mjs'],
      env: {
        mocha: true,
      },
      rules: {
        'node/no-unpublished-import': 0
      }
    },
  ]

};

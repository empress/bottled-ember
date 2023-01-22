'use strict';

const path = require('path');

module.exports = {
  sources: [
    {
      root: path.resolve(__dirname, './docs'),
      pattern: '**/*.md',
      urlSchema: 'auto',
      urlPrefix: 'docs'
    },
  ],
};

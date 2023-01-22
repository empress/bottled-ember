import { describe, expect, it } from 'vitest';

import { resolveOptions } from '../src/options.js';

import type { Options } from '../src/types.js';

describe('resloveOptions', () => {
  it('with no arguments', async () => {
    const input: Options = {
      emberVersion: '4.10',
      dependencies: {},
      // Output / Running Options
      outputPath: null,
      port: null,
      environment: 'development',
      cacheName: 'test',
      localFiles: './',
      template: null,
    };

    let result = await resolveOptions(input);

    expect(result).toMatchObject(input);
  });
});

import { describe, expect, it } from 'vitest';

import { resolveOptions } from '../src/options.js';

describe('resloveOptions', () => {
  it('with no arguments', async () => {
    let result = await resolveOptions({});

    expect(result).toMatchObject({
      emberVersion: '4.10',
      deps: {},
      // Output / Running Options
      outputPath: null,
      port: null,
      environment: 'development',
    });
  });
});

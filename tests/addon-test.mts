import { describe, expect, it } from 'vitest';

import { findEmberTry, run } from './utils.js';

let fixtures = await findEmberTry();

describe('Addon mode', () => {
  for (let fixture of fixtures) {
    it(fixture, async () => {
      let { exitCode, stderr, stdout } = await run('try:each', { onTestPackage: fixture });

      if (stderr) {
        console.error(stderr);
      }

      expect(exitCode).toBe(0);

      console.log(stdout);
    });
  }
});

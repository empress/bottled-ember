import { describe, expect, it } from 'vitest';

import { findFixtures, run } from './utils.js';

let fixtures = await findFixtures();

describe('Overlaying a whole project', () => {
  for (let fixture of fixtures) {
    it(fixture, async () => {
      let { exitCode, stderr } = await run('test', { onFixture: fixture });

      if (stderr) {
        console.error(stderr);
      }

      expect(exitCode).toBe(0);
    });
  }
});

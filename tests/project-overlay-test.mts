import { describe, expect, it } from 'vitest';

import { findFixtures, run } from './utils.js';

let fixtures = await findFixtures();

describe('Overlaying a whole project', () => {
  for (let fixture of fixtures) {
    it(fixture, async () => {
      let { exitCode } = await run({ onFixture: fixture });

      expect(exitCode).toBe(0);
    });
  }
});

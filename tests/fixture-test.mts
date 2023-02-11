import fse from 'fs-extra';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';

import { clearCache, findFixtures, fixturesFolder, run } from './utils.js';

let fixtures = await findFixtures();

describe('Overlaying a whole project', () => {
  beforeEach(async () => {
    await clearCache();
  });

  for (let fixture of fixtures) {
    it(fixture, async () => {
      let { exitCode, stderr } = await run('test', { onFixture: fixture });

      if (stderr) {
        console.error(stderr);
      }

      const dist = path.join(fixturesFolder, fixture, 'dist');

      expect(exitCode).toBe(0);
      expect(fse.existsSync(dist), 'default output directory was created').toBe(true);
    });
  }
});

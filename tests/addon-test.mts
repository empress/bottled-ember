import { describe, expect, it } from 'vitest';

import { findEmberTry, run } from './utils.js';

let fixtures = await findEmberTry();

describe('Addon mode', () => {
  for (let fixture of fixtures) {
    it(`${fixture} try:each`, async () => {
      let { stderr, stdout } = await run('try:each', {
        onTestPackage: fixture,
        args: ['--addon'],
      });

      if (stderr) {
        console.error(stderr);
      }

      expect(stdout).toContain('Scenario ember-3.28: SUCCESS');
      expect(stdout).toContain('Scenario ember-4.0: SUCCESS');
      expect(stdout).toContain('Scenario ember-4.4: SUCCESS');
      expect(stdout).toContain('Scenario ember-4.8: SUCCESS');
      expect(stdout).toContain('Scenario ember-release: SUCCESS');
      expect(stdout).toContain('Scenario ember-beta: SUCCESS');
      expect(stdout).toContain('Scenario ember-canary: FAIL');
      expect(stdout).toContain('Scenario ember-release + embroider-safe: SUCCESS');
      expect(stdout).toContain('Scenario ember-release + embroider-optimized: SUCCESS');
      expect(stdout).toContain('Scenario ember-lts-4.8 + embroider-optimized: SUCCESS');
    });

    it(`${fixture} try:one`, async () => {
      let { exitCode, stderr, stdout } = await run('try:one', {
        onTestPackage: fixture,
        args: ['ember-4.8', '--addon'],
      });

      if (stderr) {
        console.error(stderr);
      }

      expect(exitCode).toBe(0);
      expect(stdout).toContain('Scenario ember-4.8: SUCCESS');
    });
  }
});

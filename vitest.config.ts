import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: __dirname,
    testTimeout: 380_000,
    hookTimeout: 380_000,
    include: ['tests/**/*.mts', 'tests/*.mts'],
    exclude: ['tests/fixture-test.mts'],
    // ...
  },
});

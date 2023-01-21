import { describe, expect, it } from 'vitest';

import { run } from './utils.js';

describe('Overlaying a whole project', () => {
  it('embroider-with-tests', () => {
    console.info({ run });
    expect(true).toBe(true);
  });
});

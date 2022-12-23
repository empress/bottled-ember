import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tetsts/**/*.mts', 'tests/*.mts']
    // ...
  },
})

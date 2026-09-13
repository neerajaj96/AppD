import { defineConfig } from 'vitest/config';

// Test-only config (kept separate from vite.config.ts so app build settings
// stay untouched). Globals enabled so test files can use describe/it/expect
// without imports.
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});

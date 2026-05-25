import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    globalSetup: ['./src/__tests__/globalSetup.ts'],
    setupFiles: ['./src/__tests__/setup.ts'],
    testTimeout: 15000,
    fileParallelism: false,
  },
});

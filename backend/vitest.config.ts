import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Backend tests run in a Node env and never import CSS. Provide an inline
  // (empty) PostCSS config so Vite does NOT walk up the tree and load the repo
  // root's postcss.config.js — that requires `tailwindcss`, which is not
  // installed in the isolated backend CI job (Cannot find module 'tailwindcss').
  css: { postcss: { plugins: [] } },
  test: {
    globals: true,
    environment: 'node',
    globalSetup: ['./src/__tests__/globalSetup.ts'],
    setupFiles: ['./src/__tests__/setup.ts'],
    testTimeout: 15000,
    fileParallelism: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      // Application code only — exclude tests, the Express entrypoint (just
      // app.listen), Prisma artifacts, and one-off scripts/migrations.
      include: ['src/**/*.ts'],
      exclude: [
        'src/__tests__/**',
        'src/index.ts',
        '**/*.d.ts',
      ],
    },
  },
});

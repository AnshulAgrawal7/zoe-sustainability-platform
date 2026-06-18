import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// Pin everything to THIS directory. Without an explicit `root`, Vitest resolved
// `./src/...` against the repo root (it walks up to the workspace root), so the
// backend run picked up the FRONTEND `src/__tests__/setup.ts` — which imports
// @testing-library/jest-dom (absent in the isolated backend CI install) and uses
// jsdom. Absolute, backend-relative paths make the backend test run fully
// self-contained (Node env + the backend's own setup/globalSetup).
const here = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: here,
  // Inline (empty) PostCSS config so Vite never loads the repo-root
  // postcss.config.js (needs tailwindcss, not installed in the backend job).
  css: { postcss: { plugins: [] } },
  test: {
    root: here,
    globals: true,
    environment: 'node',
    globalSetup: [resolve(here, 'src/__tests__/globalSetup.ts')],
    setupFiles: [resolve(here, 'src/__tests__/setup.ts')],
    testTimeout: 15000,
    fileParallelism: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: resolve(here, 'coverage'),
      // Application code only — exclude tests, the Express entrypoint (just
      // app.listen), Prisma artifacts, and one-off scripts/migrations.
      include: ['src/**/*.ts'],
      exclude: ['src/__tests__/**', 'src/index.ts', '**/*.d.ts'],
    },
  },
});

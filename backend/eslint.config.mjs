import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

// Self-contained backend lint config (Node, TypeScript). Kept separate from the
// root (browser/React) config so the backend CI job — which installs only
// backend/ — has eslint + its plugins locally and resolves THIS config, not the
// root one. Same rule baseline the root used (js + typescript-eslint recommended),
// minus the React plugins, plus Node globals.
export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.ts'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
]);

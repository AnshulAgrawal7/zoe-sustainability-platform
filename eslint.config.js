import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Generated artifacts are never linted. The backend lints itself via its own
  // backend/eslint.config.js (Node config + local eslint), so the root (browser/
  // React) lint excludes backend/** to avoid double-linting with the wrong globals.
  globalIgnores([
    '**/dist',
    '**/dist/**',
    '**/coverage',
    '**/coverage/**',
    'backend/**',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
])

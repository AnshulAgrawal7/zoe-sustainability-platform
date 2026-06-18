import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Generated artifacts (root + backend build/coverage output) are never linted.
  // NOTE: backend/src IS linted by this same config — the backend `lint` script
  // (`eslint src`) resolves to this root config — so do not ignore backend/**.
  globalIgnores(['**/dist', '**/dist/**', '**/coverage', '**/coverage/**']),
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

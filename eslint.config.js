import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Generated artifacts are never linted; the backend has its own ESLint config
  // + lint script (`cd backend && npm run lint`, run as its own CI job), so the
  // root (frontend, browser-globals) lint deliberately excludes backend/**.
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

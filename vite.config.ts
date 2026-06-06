import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { defaultExclude } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    // backend/** has its own vitest config (node env + DB setup); keep it out
    // of the frontend (jsdom) run.
    exclude: [...defaultExclude, 'e2e/**', 'backend/**'],
  },
})

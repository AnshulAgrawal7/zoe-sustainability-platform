import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { defaultExclude } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Split the heaviest eager vendors (React DOM, the router, i18n) into
        // their own long-cached chunks so the entry chunk stays small and a
        // dependency bump doesn't invalidate the whole app bundle. Route code
        // is already split via React.lazy (see app/Router.tsx).
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (/[\\/](react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id))
              return 'react';
            if (id.includes('i18next')) return 'i18n';
          }
          return undefined;
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    // backend/** has its own vitest config (node env + DB setup); keep it out
    // of the frontend (jsdom) run.
    exclude: [...defaultExclude, 'e2e/**', 'backend/**'],
  },
})

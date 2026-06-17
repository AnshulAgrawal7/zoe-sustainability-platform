import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { defaultExclude } from 'vitest/config'

// Explicit Content-Security-Policy for the served app (Future_Work §3.4).
// Injected as a <meta> tag ONLY in the production build so the Vite dev server
// (HMR needs inline scripts / eval / websockets) is never affected. Allowances
// reflect the real third parties the app talks to:
//   - style-src 'unsafe-inline'  → Leaflet sets inline styles on map tiles;
//     fonts.googleapis.com       → the Google Fonts stylesheet (index.html).
//   - font-src fonts.gstatic.com → the Google Font files.
//   - img-src https: data: blob: → OSM/CartoDB map tiles + Supabase storage
//     images + data/blob previews.
//   - connect-src https:         → the API (production domain not known here).
//   - object-src 'none'/base-uri → plugin / base-tag hardening.
// NOTE: `frame-ancestors` (clickjacking) is intentionally omitted — it is ignored
// when delivered via <meta> and must be set as a real HTTP header (or
// X-Frame-Options) at the static host; see docs/deployment/security-notes.md.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' https://fonts.gstatic.com data:",
  "connect-src 'self' https:",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ')

function cspMetaPlugin(): Plugin {
  return {
    name: 'zoe-csp-meta',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        '<head>',
        `<head>\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cspMetaPlugin()],
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

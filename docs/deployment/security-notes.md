# Security & Operations Notes

> Companion to [`handover-szenario-a.md`](handover-szenario-a.md) and
> [`../../Future_Work.md`](../../Future_Work.md). Documents deliberate security
> postures and the operational separation between demo and production data.
> **Not legal advice.**

---

## 1. CSRF posture (Future_Work 3.3)

**Current model:** Write endpoints authenticate with a **Bearer access token**
sent in the `Authorization` header (not via an ambient cookie). The only cookie
is the **refresh** cookie, which is `httpOnly` + `SameSite` and is used *only* by
`POST /api/auth/refresh`.

- Because mutating routes require a header token that a cross-site form/`<img>`
  cannot set, classic CSRF on those routes is **not exploitable**.
- The refresh route is cookie-based, but `SameSite` prevents a cross-site page
  from driving it, and a successful refresh only returns a short-lived access
  token to the *same-origin* caller — it performs no business mutation.
- **Anonymous, cookie-free POSTs** (ideas, submissions, event proposals,
  newsletter) carry no credentials at all, so there is no session to ride; the
  abuse vector there is spam, mitigated by rate-limiting + honeypot (3.2/3.5),
  not CSRF.

**If this changes** (e.g. moving any mutation to cookie auth), add a
double-submit CSRF token or the `Origin`/`Sec-Fetch-Site` check.

## 2. Refresh tokens: revocation & rotation (Future_Work 2.6)

**Implemented:**
- Refresh tokens are **persisted** (`RefreshToken` table) and checked on every
  `/auth/refresh` — i.e. a server-side **revocation list**.
- **Logout** deletes the presented refresh token (server-side invalidation).
- **Suspending** an account deletes *all* its refresh tokens (immediate cut-off).
- Access tokens are short-lived (**15 min**); a stolen access token is valid at
  most until expiry. Refresh cookie lifetime is 7 days (session cookie).

**Known limitation (future enhancement):** refresh tokens are **not rotated** —
the same refresh token stays valid for its 7-day window; a refresh issues only a
new *access* token. To shrink the replay window, rotate the refresh token on
each use (issue a new one, delete the old) and detect reuse of a retired token
as theft. Acceptable for the prototype; recommended before high-stakes use.

## 3. Content-Security-Policy (Future_Work 3.4)

A CSP `<meta>` tag is injected into the **production** `index.html` by a Vite
plugin (`vite.config.ts`); the dev server is deliberately untouched so HMR keeps
working. Verified against the production build (`vite preview` + headless
Chromium): **0 CSP violations**, all map tiles load, fonts render.

Policy (and why each allowance exists):
```
default-src 'self';
script-src 'self';                                   (no inline scripts in the build)
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;  (Leaflet inline styles + Google Fonts CSS)
img-src 'self' data: blob: https:;                   (OSM/CARTO tiles, Supabase images, data/blob previews)
font-src 'self' https://fonts.gstatic.com data:;     (Google Font files)
connect-src 'self' https:;                            (the API on its production https domain)
base-uri 'self'; object-src 'none';
```

**Set at the host (HTTP header), not the meta tag:**
- `frame-ancestors 'none'` (or `X-Frame-Options: DENY`) — ignored inside `<meta>`.
- Tighten `connect-src`/`img-src` to the exact API + Supabase domains once the
  production hostnames are fixed (replace the broad `https:`).
- `Strict-Transport-Security`, `Referrer-Policy`, etc. as host headers.

## 4. Seed vs. production data separation (Future_Work 5.5)

`backend/prisma/seed.ts` and `npm run db:reset` are **destructive** (reset +
re-seed with demo content). To avoid ever wiping real citizen data:

- **One database per environment.** Never point a production `DATABASE_URL` at a
  database you run `db:reset`/`db:seed` against. Use a separate Supabase project
  (EU region) for production.
- **Never run `db:reset` in production.** Production schema changes go through
  `prisma migrate deploy` only (forward-only migrations, no seed).
- **Bootstrap the first real admin** with `npm run create:admin` (see
  `admin-guide.md` §17), **not** the seed. Then delete the demo admin.
- The local **test** database is a throwaway on `localhost:5433` (Docker); its
  URL lives in `TEST_DATABASE_URL` and is only used by the test suites — it is
  never the app's runtime database.

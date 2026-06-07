# Deployment Guide — ZOE (Szenario A)

> Technical reference for taking the prototype online on a neutral domain.
> Companion to the operator checklist [`to-do.md`](../../to-do.md) and the
> rationale in [`handover-szenario-a.md`](handover-szenario-a.md).
> ⚠️ Not legal advice. Status: 2026-06-07.

## Target architecture

```
            ┌─────────────┐      HTTPS (credentials)      ┌──────────────┐
  Visitor → │  Frontend   │  ───────────────────────────▶ │   Backend    │
            │  Vercel     │   VITE_API_BASE_URL=.../api    │   Render     │
            │ (Vite/dist) │                                │ Express/Prisma│
            └─────────────┘                                └──────┬───────┘
                                                                  │ Postgres
                                                           ┌──────▼───────┐
                                                           │  Supabase    │
                                                           │ (EU region)  │
                                                           └──────────────┘
```

Order: **Supabase (DB) → Prisma→Postgres → Backend (Render) → Frontend (Vercel)
→ Domain → legal pages → smoke test.**

---

## DB — switch Prisma from SQLite to Supabase Postgres

The data model is provider-agnostic (only `String`/`Int`/`DateTime`), so the
**schema** ports cleanly. Only the **migration SQL** must be regenerated, because
the committed migration in `backend/prisma/migrations/` is SQLite-specific
(`migration_lock.toml` → `sqlite`). Do this once:

1. **Edit `backend/prisma/schema.prisma`** — datasource block:
   ```prisma
   datasource db {
     provider  = "postgresql"
     url       = env("DATABASE_URL") // Supabase pooled URL (port 6543)
     directUrl = env("DIRECT_URL")   // Supabase direct URL (port 5432)
   }
   ```
2. **Set both URLs** in `backend/.env` (from Supabase → Project Settings →
   Database → Connection string):
   ```
   DATABASE_URL="postgresql://...:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://...:5432/postgres"
   ```
   `directUrl` is used for migrations; the pooled `DATABASE_URL` for the app.
3. **Regenerate migrations for Postgres** (the SQLite migration won't run on PG):
   ```bash
   cd backend
   rm -rf prisma/migrations            # drop the SQLite-only migration
   npx prisma migrate dev --name init  # creates a fresh Postgres migration
   npm run db:seed                     # admin + 8 demo projects + badges
   ```
4. **Commit** the new `prisma/migrations/` (now `provider = "postgresql"`).
5. In production the build runs `npx prisma migrate deploy` (see `render.yaml`).

> Dev vs prod DB: Prisma binds **one** provider per schema. After the switch,
> local dev also uses Postgres — use a second free Supabase project ("dev") or a
> local Docker Postgres. Keep the SQLite setup only if you revert the provider.

---

## Backend — Render

A blueprint is committed at the repo root: [`render.yaml`](../../render.yaml).

1. Render → **New → Blueprint** → pick this repo (or **New → Web Service**,
   Root Directory `backend`).
2. Build: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
   Start: `npm start` · Health check: `/api/health`.
3. **Environment** (Render dashboard — never commit secrets):

   | Variable | Value |
   |---|---|
   | `NODE_ENV` | `production` (enables `Secure; SameSite=None` cookies) |
   | `JWT_SECRET` | strong & unique — `openssl rand -base64 48` (or Render auto-gen) |
   | `DATABASE_URL` / `DIRECT_URL` | from Supabase |
   | `CORS_ORIGIN` | exact frontend origin, e.g. `https://your-domain` |
   | `DEEPL_API_KEY` | optional (`…:fx` = Free tier) |

4. After deploy: `https://<service>.onrender.com/api/health` → `{"success":true,…}`.

---

## Frontend — Vercel

1. Vercel → **Add New → Project** → this repo. Framework **Vite**,
   Build `npm run build`, Output `dist`.
2. **Environment variables:**

   | Variable | Value |
   |---|---|
   | `VITE_API_BASE_URL` | `https://<backend-domain>/api` |
   | `VITE_ANALYTICS_PROVIDER` | optional — `plausible`/`umami` (see `analytics.md`) |
   | `VITE_ANALYTICS_DOMAIN` / `…_WEBSITE_ID` / `…_SRC` | per provider, optional |

3. Deploy and open the preview URL.

---

## Domain + CORS

1. Buy a **neutral** domain (e.g. `zoe-corfu-demo.org`) — nothing implying the
   official municipality.
2. Vercel → Project → **Domains** → add it; set DNS as instructed (TLS is automatic).
3. **Then** set backend `CORS_ORIGIN=https://<your-domain>` and frontend
   `VITE_API_BASE_URL=https://<backend-domain>/api`, and redeploy both.

### Why the cross-site cookie config matters
The refresh token is an `httpOnly` cookie. When frontend and backend are on
**different domains** (Vercel + Render), the browser only sends it on
credentialed cross-site requests if it is `Secure; SameSite=None`. The backend
sets exactly that when `NODE_ENV=production` (see
`backend/src/controllers/authController.ts → refreshCookieOptions`). In dev it
falls back to `SameSite=Lax` without `Secure` so login works over http on
localhost. If you instead host the API on a **subdomain of the same site**
(`api.your-domain`), the cookie is same-site and this is moot.

---

## Smoke test (after go-live)
- Landing page loads, no "Something went wrong".
- Projects load · SDG dashboard · Transparency · Get-Involved.
- Language switch EN/EL/DE (flags) + dark mode.
- Admin login (`admin@zoe-corfu.gr` / `ZoeAdmin2026!`) → create project →
  **DeepL auto-translation** fills the other languages.
- Login → refresh (stay logged in after 15 min) → logout (cookie cleared).
- Mobile 375px.
- (If analytics enabled) live visit + a CTA click show up in the dashboard.

---

## Not in scope here (Szenario B / Future Work)
Object storage wiring for uploaded images, server log retention/backups, uptime
alerting, email dispatch, submission persistence/moderation — see
`feature-evaluation.md` and `handover-szenario-a.md`.

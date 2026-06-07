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

## DB — PostgreSQL (Supabase) ✅ active

The project runs on **PostgreSQL** (Supabase, EU/Frankfurt). `schema.prisma` has
`provider = "postgresql"` with a pooled `DATABASE_URL` (6543) for the app and a
`DIRECT_URL` (5432) for migrations; the committed migration in
`backend/prisma/migrations/` is Postgres (`migration_lock.toml` → `postgresql`).
The data model is provider-agnostic (only `String`/`Int`/`DateTime`).

**To point at a different Postgres** — e.g. the municipality's own Supabase/Postgres
on handover — **no code change is needed**:

1. Set `DATABASE_URL` + `DIRECT_URL` in `backend/.env` (Supabase → Connect → ORMs →
   Prisma gives both strings):
   ```
   DATABASE_URL="postgresql://...:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://...:5432/postgres"
   ```
2. Apply schema + (optionally) seed:
   ```bash
   cd backend
   npx prisma migrate deploy   # applies the committed migrations
   npm run db:seed             # optional: admin + 8 demo projects + badges
   ```
3. In production the build runs `npx prisma migrate deploy` (see `render.yaml`).

> **Tests** use a **separate** local Postgres (never the app DB):
> `backend/docker-compose.yml` → `docker compose up -d`, then set `TEST_DATABASE_URL`
> in `backend/.env`. The test harness refuses to run if `TEST_DATABASE_URL` points
> at Supabase (it does a destructive `--force-reset`).

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

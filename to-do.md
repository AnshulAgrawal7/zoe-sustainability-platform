# TO-DO — ZOE online bringen (Szenario A)

> **Deine** Aufgabenliste, um die Plattform übergabe-bereit online zu schalten (Szenario A: öffentliche Demo, neutrale Domain, als Prototyp gekennzeichnet, keine echten personenbezogenen Daten, **keine Gemeinde nötig**).
> Hintergrund/Begründung: [`docs/deployment/handover-szenario-a.md`](docs/deployment/handover-szenario-a.md) · [`docs/feature-evaluation.md`](docs/feature-evaluation.md).
> Legende: **👤 = du** · **🤖 = mache ich im Repo** (sag „leg los"). ⚠️ keine Rechtsberatung.

---

## 0. Vorab (lokal, jederzeit)
- [ ] 👤 DeepL-Key in `backend/.env` ist gesetzt ✓ (schon erledigt)
- [ ] 👤 Lokal läuft alles: `cd backend && npm run dev` + (Root) `npm run dev` → http://localhost:5173
- [ ] 👤 Entscheiden: Hosts wählen (Empfehlung unten: **Supabase** + **Render** + **Vercel**)

## 1. 👤 Supabase-Projekt anlegen (DB + Storage)
- [ ] Account auf https://supabase.com (kostenlos)
- [ ] **New Project** → **Region: EU (z. B. Frankfurt)** ⚠️ wichtig für DSGVO
- [ ] Datenbank-Passwort sicher speichern
- [ ] Connection-String holen: *Project Settings → Database → Connection string → URI* → das ist deine **`DATABASE_URL`**
  - Hinweis: Supabase gibt einen *pooled* (Port 6543) und *direct* (Port 5432) String. Für Prisma brauchen wir beide (`DATABASE_URL` + `directUrl`) — **das richte ich ein**, du gibst mir nur die Strings (in `backend/.env`, **nicht in den Chat**).
- [ ] *(für Bilder später)* Storage-Bucket anlegen + API-Keys notieren

## 2. 🤖+👤 Datenbank umziehen (SQLite → Supabase Postgres)
- [x] 🤖 Prisma-Umstellung auf Postgres **dokumentiert** (`provider` + `directUrl` + Migrations-Neuerzeugung + Seed) → [`docs/deployment/deploy.md`](docs/deployment/deploy.md) §DB. *Vollzug* sobald dein `DATABASE_URL` steht (Dev/Tests bleiben bis dahin auf SQLite).
- [ ] 👤 Du trägst `DATABASE_URL` (+ direct) in `backend/.env` ein
- [ ] 🤖/👤 `npx prisma migrate deploy` + `npm run db:seed` gegen Supabase → Admin-Login + 8 Projekte vorhanden
- [ ] 👤 Kurz prüfen: lokal gegen Supabase läuft `/api/projects`

## 3. 👤 Backend hosten (Empfehlung: Render)
- [ ] Account auf https://render.com → **New Web Service** → dein GitHub-Repo
- [ ] **Root Directory:** `backend`
- [ ] **Build:** `npm install && npx prisma generate && npm run build`
- [ ] **Start:** `npm start`
- [ ] **Environment Variables** setzen (siehe Secrets-Tabelle unten)
- [ ] Nach Deploy: `https://<dein-backend>.onrender.com/api/health` muss `{"success":true}` liefern
- [x] 🤖 `render.yaml` (Blueprint) + Build/Start-Konfig + Prod-`.env.example` angelegt → [`render.yaml`](render.yaml), [`docs/deployment/deploy.md`](docs/deployment/deploy.md)

## 4. 👤 Frontend hosten (Empfehlung: Vercel)
- [ ] Account auf https://vercel.com → **Add New → Project** → dein Repo
- [ ] **Framework:** Vite · **Build:** `npm run build` · **Output:** `dist`
- [ ] **Environment Variable:** `VITE_API_BASE_URL = https://<dein-backend>.onrender.com/api`
- [ ] Deploy → Test-URL öffnen

## 5. 👤 Domain kaufen + verbinden
- [ ] Neutrale Domain kaufen (z. B. `zoe-corfu-demo.org`) — **kein** Name, der „offizielle Gemeinde" suggeriert
- [ ] Im Frontend-Host (Vercel) Domain hinzufügen → DNS-Einträge laut Vercel setzen (TLS automatisch)
- [ ] *(optional)* Subdomain fürs Backend (z. B. `api.deine-domain`) → bei Render eintragen
- [ ] 👤 **Wichtig danach:** im Backend-Host `CORS_ORIGIN=https://<deine-domain>` setzen + Frontend `VITE_API_BASE_URL` auf die Backend-Domain

## 6. 👤 Rechtliches ausfüllen (Szenario A, minimal)
- [x] 🤖 **Impressum-** (`/imprint`) + **Datenschutz-Ausbau** als Vorlage erstellt (Platzhalter + Prototyp-Hinweis, EN/EL/DE; Supabase/DeepL als Auftragsverarbeiter benannt)
- [ ] 👤 **Impressum** mit *deinen* Daten füllen (du als Betreiber:in — **nicht** die Gemeinde)
- [ ] 👤 **Datenschutzerklärung** vervollständigen: Supabase + DeepL als **Auftragsverarbeiter** nennen
- [ ] 👤 **AVV/DPA** abschließen: Supabase (im Dashboard) + DeepL (Pro/Account) — EU-Region
- [ ] 👤 **Bilder:** nur eigene/lizenzfreie/mit Erlaubnis (keine FB-Bilder ohne Zustimmung)
- [ ] 👤 **Prototyp-Banner sichtbar lassen** (keine Verwechslung mit offizieller Seite)
- [ ] 👤 *(falls echte Accounts)* öffentliche Registrierung deaktivieren **oder** Cookie-Hinweis + vollständigen Datenschutz ergänzen

## 7. 👤 Smoke-Test nach Go-Live
- [ ] Startseite lädt, kein „Something went wrong"
- [ ] Projekte laden · SDG-Dashboard · Transparenz · Get-Involved
- [ ] Sprachwechsel EN/EL/DE (Flaggen) + Dark Mode
- [ ] Admin-Login (`admin@zoe-corfu.gr` / `ZoeAdmin2026!`) → Projekt anlegen → **DeepL-Auto-Übersetzung**
- [ ] Auf dem Handy (375px) testen

---

## 🔐 Secrets-Übersicht (in den Host-Dashboards setzen — NIE ins Repo)
| Variable | Wo | Wert / wie |
|---|---|---|
| `DATABASE_URL` (+ `directUrl`) | Backend-Host | aus Supabase (Schritt 1) |
| `JWT_SECRET` | Backend-Host | neu generieren: `openssl rand -base64 48` |
| `DEEPL_API_KEY` | Backend-Host | dein DeepL-Key (`…:fx` = Free) |
| `NODE_ENV` | Backend-Host | `production` |
| `CORS_ORIGIN` | Backend-Host | `https://<deine-domain>` |
| `VITE_API_BASE_URL` | Frontend-Host | `https://<backend-domain>/api` |
| `VITE_ANALYTICS_*` *(optional)* | Frontend-Host | nur falls Analytics gewünscht — `provider`/`domain` etc., siehe [`analytics.md`](docs/deployment/analytics.md) |

---

## 🤖 Was ich für dich im Repo vorbereite (kein Account nötig) — ✅ erledigt
- [x] Prisma auf Postgres umstellbar (`provider` + `directUrl`) **dokumentiert** → `docs/deployment/deploy.md` (Vollzug = dein `DATABASE_URL`)
- [x] Prod-`.env.example` (alle Variablen) + **sichere Cookies** in Prod (`secure` + `SameSite=None` cross-site)
- [x] `render.yaml` (Blueprint) + Build/Start-Konfig
- [x] **Impressum** + **Datenschutz** Template-Seiten (EN/EL/DE, Platzhalter)
- [x] Abgeschlossene Projekte: `imageUrl`-Feld + Status-Filter (Open/Completed/All) + Platzhalter-Bilder
- [x] **Monitoring/Analytics**: cookielos & datenschutzfreundlich (Plausible/Umami), **default deaktiviert**, + Funnel-Events („Landing → XY") + Doku → `docs/deployment/analytics.md`
- [x] In-Repo-Fortschrittsprotokoll → `docs/deployment/go-live-progress.md` + DEVLOG Iteration 9

## 🚫 Bewusst NICHT (Grenzen von Szenario A)
Facebook-Daten-Import · echte personenbezogene Nutzerdaten · offizielle Repräsentation der Gemeinde · echter Newsletter-Versand. → Future Work / Szenario B (siehe `feature-evaluation.md`).

---

### Reihenfolge in einem Satz
**Supabase (EU) → DB umziehen → Backend (Render) → Frontend (Vercel) → Domain → Impressum/Datenschutz → Smoke-Test.**
Sag **„leg los"**, dann mache ich die 🤖-Punkte; Supabase-Umzug machen wir, sobald dein `DATABASE_URL` in `backend/.env` steht.
</content>

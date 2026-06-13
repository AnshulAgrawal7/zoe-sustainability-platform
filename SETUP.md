# Setup-Anleitung — ZOE Sustainability Platform

Diese Anleitung beschreibt das lokale Aufsetzen des Prototyps auf **macOS**,
**Windows** und **WSL2 (Ubuntu auf Windows)**.

> **Wichtig — Zugangsdaten:** Für die `.env`-Dateien werden Zugangsdaten benötigt
> (Supabase-URL, DeepL-Key etc.), da die Plattform eine **gemeinsame Cloud-
> Datenbank** (Supabase/PostgreSQL) nutzt. Diese Zugangsdaten sowie Hilfe bei
> Fragen/Problemen: **anshul.agrawal@fau.de**.

## Architektur in Kürze
- **Frontend** (Repo-Root): React + Vite → läuft auf **Port 5173**.
- **Backend** (`backend/`): Node + Express + Prisma → läuft auf **Port 3001**.
- Es sind **zwei** `npm install` und **zwei** `.env`-Dateien nötig (Root +
  `backend/`).

## Voraussetzungen (alle Systeme)
- **Node.js ≥ 20** (empfohlen: 22 LTS) und **npm ≥ 10**  
  Prüfen: `node -v` und `npm -v`
- **Git**
- Internetzugang (die App nutzt eine gemeinsame Supabase-Cloud-DB)

---

## A) macOS

```bash
# 1) (falls nötig) Node via Homebrew installieren
brew install node@22        # oder nvm: `nvm install 22 && nvm use 22`

# 2) Repo klonen + in den Ordner wechseln
git clone <REPO-URL> zoe-sustainability-platform
cd zoe-sustainability-platform

# 3) Abhängigkeiten installieren (Frontend + Backend)
npm install
cd backend && npm install && cd ..

# 4) Prisma-Client generieren (im backend/)
cd backend && npx prisma generate && cd ..

# 5) .env-Dateien anlegen (Werte von anshul.agrawal@fau.de eintragen)
cp .env.example .env                 # Frontend
cp backend/.env.example backend/.env # Backend  → echte Keys eintragen

# 6) (optional) DB-Seed — siehe Hinweis unten
cd backend && npm run db:seed && cd ..

# 7) Backend starten (Terminal 1) → http://localhost:3001
cd backend && npm run dev

# 8) Frontend starten (Terminal 2) → http://localhost:5173
npm run dev
```

---

## B) Windows (PowerShell, ohne WSL)

```powershell
# 1) Node installieren: https://nodejs.org (LTS 22) oder `winget install OpenJS.NodeJS.LTS`
#    Git installieren: https://git-scm.com  (oder `winget install Git.Git`)

# 2) Repo klonen
git clone <REPO-URL> zoe-sustainability-platform
cd zoe-sustainability-platform

# 3) Abhängigkeiten installieren (Frontend + Backend)
npm install
cd backend; npm install; cd ..

# 4) Prisma-Client generieren
cd backend; npx prisma generate; cd ..

# 5) .env-Dateien anlegen (Werte von anshul.agrawal@fau.de eintragen)
Copy-Item .env.example .env
Copy-Item backend\.env.example backend\.env   # echte Keys eintragen

# 6) (optional) DB-Seed — siehe Hinweis unten
cd backend; npm run db:seed; cd ..

# 7) Backend starten (PowerShell-Fenster 1) → http://localhost:3001
cd backend; npm run dev

# 8) Frontend starten (PowerShell-Fenster 2) → http://localhost:5173
npm run dev
```

---

## C) WSL2 (Ubuntu unter Windows)

> Repo möglichst **im Linux-Dateisystem** ablegen (z. B. `~/projects/…`), nicht
> unter `/mnt/c/...` — das ist deutlich schneller.

```bash
# 1) In Ubuntu (WSL2) Node via nvm installieren
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# Terminal neu öffnen, dann:
nvm install 22 && nvm use 22

# 2) Repo klonen
git clone <REPO-URL> zoe-sustainability-platform
cd zoe-sustainability-platform

# 3) Abhängigkeiten installieren (Frontend + Backend)
npm install
cd backend && npm install && cd ..

# 4) Prisma-Client generieren
cd backend && npx prisma generate && cd ..

# 5) .env-Dateien anlegen (Werte von anshul.agrawal@fau.de eintragen)
cp .env.example .env
cp backend/.env.example backend/.env   # echte Keys eintragen

# 6) (optional) DB-Seed — siehe Hinweis unten
cd backend && npm run db:seed && cd ..

# 7) Backend starten (Terminal 1) → http://localhost:3001
cd backend && npm run dev

# 8) Frontend starten (Terminal 2) → http://localhost:5173
npm run dev
```

Öffne danach **http://localhost:5173** im Browser. Das Frontend spricht das
Backend unter `http://localhost:3001/api` an (konfiguriert über
`VITE_API_BASE_URL`).

---

## Hinweis zum DB-Seed (`npm run db:seed`)
Die gemeinsame Cloud-DB ist **bereits befüllt** — ein Seed ist im Normalfall
**nicht nötig**. Der Seed verwendet überwiegend idempotente Upserts, setzt aber
einzelne Tabellen zurück. Führe ihn daher nur aus, wenn du ausdrücklich dazu
aufgefordert wirst, und **niemals** gegen eine produktive/geteilte DB ohne
Rücksprache. (Die Backend-Tests nutzen eine **separate** lokale Test-DB über
`backend/docker-compose.yml` + `TEST_DATABASE_URL` — nicht die Cloud-DB.)

## Demo-Logins (Seed-Daten)
| Rolle | E-Mail | Passwort |
|---|---|---|
| Admin | `admin@zoe-corfu.gr` | `ZoeAdmin2026!` |
| Bürger:in | `citizen1@example.com` | `Test1234!` |

## Benötigte Umgebungsvariablen (werden tatsächlich vom Code gelesen)
**Backend (`backend/.env`):** `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`,
`PORT` (3001), `CORS_ORIGIN` (http://localhost:5173), `NODE_ENV`,
`DEEPL_API_KEY` (optional), `SUPABASE_URL`, `SERVICE_ROLE_KEY`,
`TEST_DATABASE_URL` (nur für Backend-Tests).

**Frontend (`.env`):** `VITE_API_BASE_URL` (http://localhost:3001/api);
optional `VITE_IS_PROTOTYPE`, `VITE_ANALYTICS_*` (cookieless Analytics, standardmäßig aus).

> Vollständige, kommentierte Vorlagen: `.env.example` (Root) und
> `backend/.env.example`.

## Troubleshooting
- **Port belegt:** Backend `PORT` bzw. Vite (`npm run dev -- --port 5174`) ändern;
  dann `VITE_API_BASE_URL`/`CORS_ORIGIN` anpassen.
- **Prisma „Client not generated":** `cd backend && npx prisma generate`.
- **CORS-Fehler:** `CORS_ORIGIN` muss exakt der Frontend-Origin sein
  (Standard `http://localhost:5173`).
- Weitere Hilfe: **anshul.agrawal@fau.de**.

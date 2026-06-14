# ZOE Sustainability Platform

**Strategischer Rahmen für Umweltmaßnahmen – ZOE-Programm**
*Strategic Framework for Environmental Actions – ZOE Program*

A full-stack web platform prototype for the **ZOE environmental programme** of the
**Municipality of Northern Corfu, Greece**. It is built as a **Design Science
Research (DSR) artefact** for the Information Systems Projektseminar at
**FAU Erlangen-Nürnberg** (WInf, SoSe 2026, Group 1).

> **Prototype notice:** This is a research prototype with realistic seed data.
> No real citizen data is collected. It is a DSR demonstration artefact, not a
> production system. A `PrototypeBanner` is shown on every page.

---

## What the platform does

It shows how a single digital tool can make a municipal sustainability programme
**transparent**, **participatory** and **multilingual**, aligned with the UN
Sustainable Development Goals (SDGs).

| Area | Highlights |
|---|---|
| **Public** | Landing page, environmental projects with SDG mapping, SDG dashboard, events, a "What's New" news feed, citizen ideas, a learn/knowledge section, transparency KPIs, rewards overview, accessibility & privacy statements |
| **Participation** | Citizens register, submit ideas, vote and comment, propose and join events, and earn points/badges (gamification) |
| **Admin** | Manage projects, events, ideas, submissions, event proposals, the news feed, learn articles, rewards, users and comment moderation |
| **i18n** | English · Ελληνικά · Deutsch (react-i18next); optional DeepL admin auto-translation |
| **Accessibility** | WCAG 2.1 AA pass — keyboard nav, ARIA labels, focus indicators, reduced-motion, dark mode |
| **Auth** | JWT access token (15 min) + httpOnly refresh cookie (7 d), bcrypt password hashing, `USER` / `ADMIN` roles |

---

## Tech stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19 · TypeScript (strict) · Vite 8 · Tailwind CSS 3 · React Router 7 · Zustand · react-i18next · Zod · lucide-react |
| **Backend** | Node.js · Express · TypeScript · Prisma |
| **Database** | PostgreSQL (hosted on **Supabase**) — a shared remote database; no local DB needed to run the app |
| **Storage** | Supabase Storage (uploaded project/event/news images) |
| **Testing** | Vitest · React Testing Library · jest-axe · Playwright |
| **Tooling** | ESLint · Prettier · Husky · lint-staged |

---

## Running the app locally

The app talks to a **shared, hosted Supabase database** — you do **not** need to
install or run a database yourself. You only need the secret `backend/.env` file
(see [Environment files](#environment-files) below).

There is **one script per operating system** that installs everything (Node if
missing, all dependencies) and then starts both servers. Open a terminal,
navigate into the project folder, and run the line for your system.

> First, `cd` into the project folder, e.g. `cd path/to/zoe-sustainability-platform`.

### 🪟 Windows (native)

**Easiest:** open the `setup` folder in Explorer and **double-click `windows.bat`**.
That's it — it handles everything.

**Or from a terminal** in the project folder, use this command (Windows blocks
unsigned `.ps1` scripts by default, so run it via the launcher):

```powershell
.\setup\windows.bat
```

> If you really want to run the `.ps1` directly, you must bypass the execution
> policy for that one run:
> ```powershell
> powershell -ExecutionPolicy Bypass -File .\setup\windows.ps1
> ```
> The error *"running scripts is disabled on this system"* means you ran
> `.\setup\windows.ps1` directly — use `windows.bat` instead.

*(Node is installed via `winget`. If Node was just installed, close the window,
open a new one, and run the launcher again.)*

### 🍎 macOS

```bash
bash setup/macos.sh
```

*(Node is installed via [Homebrew](https://brew.sh) if missing.)*

### 🐧 WSL2 (Ubuntu on Windows)

Open your **WSL2/Ubuntu** terminal (not PowerShell) and run:

```bash
bash setup/wsl.sh
```

*(Node 22 LTS is installed via `nvm` — no `sudo` needed. Keep the project inside
the Linux filesystem, e.g. `~/projects/…`, not under `/mnt/c/…`.)*

---

When the script finishes it opens:

- **Frontend** → http://localhost:5173
- **Backend API** → http://localhost:3001

Stop the servers with **Ctrl+C**. The scripts are non-destructive: they install
dependencies and generate the Prisma client only — they never migrate, seed or
reset the shared database.

> **Requirements handled by the scripts:** Node.js 20.19+ (22 LTS recommended).
> If automatic installation isn't possible, install Node 22 LTS from
> <https://nodejs.org> and re-run the script.

---

## Environment files

| File | Contains | Secret? | How to get it |
|---|---|---|---|
| `.env` (project root) | Frontend config — local API URL, optional analytics | No | Created automatically from `.env.example` by the setup script |
| `backend/.env` | **Database & Supabase credentials**, JWT secret, optional DeepL key | **Yes** | **Request from `anshul.agrawal@fau.de`** — it is not stored in git |

`backend/.env` is required to start the backend. The key variables it holds are
`DATABASE_URL`, `DIRECT_URL` (Supabase Postgres), `JWT_SECRET`, `SUPABASE_URL`,
`SERVICE_ROLE_KEY`, and an optional `DEEPL_API_KEY`. Templates with the exact
format are in `.env.example` and `backend/.env.example`.

> **Questions or problems** with the setup or the environment files?
> Contact **anshul.agrawal@fau.de**.

---

## Demo credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@zoe-corfu.gr` | `ZoeAdmin2026!` |
| Citizen | `citizen1@example.com` | `Test1234!` |
| Citizen | `citizen2@example.com` | `Test1234!` |
| Tourist | `tourist@example.com` | `Test1234!` |

You can also log in with the **username** instead of the email address.

---

## npm scripts

### Frontend (project root)

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server (hot reload) |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run frontend unit/RTL/jest-axe tests (Vitest) |
| `npm run test:e2e` | Run Playwright E2E tests |

### Backend (`cd backend`)

| Command | Description |
|---|---|
| `npm run dev` | Start the API server (hot reload) |
| `npm run build` | Compile TypeScript |
| `npm run test` | Run backend integration tests (Vitest) |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

> **Backend tests** spin up a destructive local Postgres reset and therefore use
> a separate `TEST_DATABASE_URL` (a Docker Postgres on port 5433), never the
> shared Supabase database. See `backend/docker-compose.yml`.

---

## Project structure

```
zoe-sustainability-platform/
├── setup/                        # One-command install+start scripts per OS
│   ├── windows.ps1
│   ├── macos.sh
│   └── wsl.sh
├── src/                          # Frontend (React + TypeScript)
│   ├── app/Router.tsx            # All routes
│   ├── components/{ui,layout,auth}
│   ├── pages/{public,auth,user,admin}
│   ├── hooks/  stores/  services/
│   ├── types/index.ts            # Shared types
│   ├── data/                     # Prototype fallback data
│   └── locales/{en,el,de}/       # i18n translations
├── backend/                      # API (Node + Express + Prisma)
│   ├── src/{routes,controllers,middleware,services}
│   ├── prisma/{schema.prisma,seed.ts}
│   └── docker-compose.yml        # Local Postgres for `npm test` only
├── public/                       # Favicon, logos, SDG icons
├── e2e/                          # Playwright E2E tests
├── docs/                         # Architecture, API, user/admin guides, DSR
├── .env.example                  # Frontend env template
└── README.md
```

---

## Documentation

| Document | Description |
|---|---|
| [`docs/architecture.md`](docs/architecture.md) | Architecture, routing, DB schema, ADRs |
| [`docs/api.md`](docs/api.md) | REST API endpoints |
| [`docs/user-guide.md`](docs/user-guide.md) | Citizen user guide |
| [`docs/admin-guide.md`](docs/admin-guide.md) | Administrator guide |
| [`docs/accessibility-guidelines.md`](docs/accessibility-guidelines.md) | WCAG 2.1 AA guidelines & EU legal basis |
| [`docs/dsr-methodology.md`](docs/dsr-methodology.md) | DSR (Peffers et al., 2007) process mapping |
| [`docs/deployment/`](docs/deployment/) | Deployment & handover notes |

---

## License

See [`LICENSE`](LICENSE).

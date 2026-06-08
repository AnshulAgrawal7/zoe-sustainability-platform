# ZOE Sustainability Platform

**Strategischer Rahmen für Umweltmaßnahmen – ZOE-Programm**  
*Strategic Framework for Environmental Actions – ZOE Program*

---

## Overview

This repository contains the **full-stack platform prototype** of the ZOE Environmental Platform for the Municipality of Northern Corfu. It is developed as a **Design Science Research (DSR) artefact** for a university seminar in Information Systems (FAU, WInf SoSe 2026, Group 1).

The platform demonstrates how a digital tool can increase transparency, enable citizen participation, and communicate environmental sustainability impact aligned with the UN Sustainable Development Goals (SDGs).

> **Important:** This is a prototype with realistic seed data. No real citizen data is collected. The platform is a DSR demonstration artefact — not a production system.

Presentation deadline: **15–17 June 2026**.

---

## University / DSR Context

| Field | Value |
|---|---|
| Project type | Design Science Research (DSR) artefact |
| Programme | ZOE — Municipality of Northern Corfu, Greece |
| Methodology | Peffers et al. (2007) DSR process |
| Artifact type | Full-stack digital platform prototype |
| Seminar | WInf Projektseminar, SoSe 2026, FAU Erlangen-Nürnberg |
| Group | Group 1 |

See [`docs/dsr-methodology.md`](docs/dsr-methodology.md) for full DSR mapping.

---

## What Is Implemented

### Public Pages
| Route | Description |
|---|---|
| `/` | Landing page — ZOE overview, statistics, featured projects, CTAs |
| `/about` | Programme description, DSR context, Northern Corfu background |
| `/projects` | All ZOE projects with category/status/SDG filtering |
| `/projects/:id` | Project detail — problem, impact, SDG alignment, transparency metrics |
| `/sdg-dashboard` | All addressed SDGs with progress bars and linked projects |
| `/participate` | Five participation modes with authenticated form submission |
| `/audiences` | Target audience descriptions (citizens, tourists, municipality) |
| `/events` | Upcoming events with category filtering and capacity indicators |
| `/transparency` | Programme KPIs, project progress table, budget transparency |
| `/roadmap` | Five-phase development roadmap |
| `/rewards` | Public rewards/gamification overview |
| `/accessibility` | EU conformance statement (WCAG 2.1 AA / EN 301 549) |
| `/privacy` | GDPR privacy notice |

### Auth & User Pages
| Route | Description |
|---|---|
| `/login` | JWT login — returns access token + httpOnly refresh cookie |
| `/register` | New citizen registration with Zod-validated form |
| `/dashboard` | Citizen dashboard — points, participations, project feed |
| `/profile` | Edit display name and email |
| `/my-rewards` | Citizen reward history and badge collection |

### Admin Pages (admin role required)
| Route | Description |
|---|---|
| `/admin` | Admin dashboard — platform statistics |
| `/admin/projects` | Manage projects (view, edit, delete) |
| `/admin/projects/new` | Create new environmental project |
| `/admin/projects/:id/edit` | Edit existing project |
| `/admin/users` | Manage citizens (view, promote to admin) |

### Platform Features
- **i18n** — English / Ελληνικά / Deutsch via react-i18next (all public pages `t()`-compliant), flag-based language switcher
- **DeepL auto-translation** — an admin writes a project in one language; title + description are auto-filled in the other two (`POST /api/admin/translate`; requires `DEEPL_API_KEY` in `backend/.env`, Free/Pro auto-detected via the `:fx` suffix)
- **Dark mode** — Tailwind `class` strategy, persisted in localStorage, system-preference default
- **WCAG 2.1 AA** — Full compliance pass: keyboard navigation, aria labels, focus indicators, lang attribute, reduced motion
- **Gamification** — Point system for citizen participation (comment=5, vote=10, attend=20, volunteer=50, submit=100)
- **JWT Auth** — Access token (15 min) + refresh token (7 days, httpOnly cookie)
- **PrototypeBanner** — Visible on all pages (academic requirement)

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + TypeScript (strict) | UI framework with full type safety |
| Vite 8 | Build tool and dev server |
| Tailwind CSS 3 | Utility-first styling, dark mode |
| React Router 7 | Client-side routing, protected routes |
| Zustand | Auth, theme, and language state |
| react-i18next | EN / EL / DE internationalisation |
| Zod | Form and API response validation |
| lucide-react | Icon set |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express + TypeScript | REST API server |
| Prisma + SQLite | ORM + dev database |
| JWT (jsonwebtoken) | Access + refresh token auth |
| bcryptjs | Password hashing (12 rounds) |
| express-validator | Input validation on all routes |

### Testing & Tooling
| Tool | Purpose |
|---|---|
| Vitest + React Testing Library | 37 frontend unit tests |
| jest-axe | 5 axe-core accessibility tests |
| Vitest (backend) | 32 backend integration tests |
| Playwright | E2E browser tests |
| Husky + lint-staged | Pre-commit hooks (lint + test) |
| ESLint + Prettier | Code quality |

---

## Setup Instructions

### Prerequisites
- Node.js 20+
- npm 10+

### Backend

```bash
cd backend
cp .env.example .env        # copy env template
npm install
npx prisma migrate dev      # run migrations
npx prisma db seed          # seed with prototype data
npm run dev                 # → http://localhost:3001
```

### Frontend

```bash
# from project root
npm install
npm run dev                 # → http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Quick start (macOS)

For a fresh machine (e.g. running the prototype off another laptop) two helper
scripts automate the steps above. They are **non-destructive** — they install
dependencies and generate the Prisma client only, and never run migrations,
seeds, or resets, so nothing in the shared database is touched or deleted.

```bash
bash setup-mac.sh     # one-time: checks Node, installs deps, generates Prisma client
bash start-mac.sh     # starts backend (:3001) + frontend (:5173) together; Ctrl+C stops both
```

Requirements: Node.js 20.19+ (22 LTS recommended — `brew install node`).
`backend/.env` is not stored in git; copy it from your main machine into
`backend/.env` before running `start-mac.sh`.

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@zoe-corfu.gr | ZoeAdmin2026! |
| Citizen (320 pts, Greek) | citizen1@example.com | Test1234! |
| Citizen (150 pts, Greek) | citizen2@example.com | Test1234! |
| Tourist (50 pts, German) | tourist@example.com | Test1234! |

---

## Available npm Scripts

### Frontend (project root)
| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format source files with Prettier |
| `npm run type-check` | TypeScript check without emitting |
| `npm run test` | Run all 37 frontend tests (Vitest) |
| `npm run test:coverage` | Run tests with V8 coverage report |
| `npx playwright test` | Run Playwright E2E tests |

### Backend (`cd backend`)
| Command | Description |
|---|---|
| `npm run dev` | Start API server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run test` | Run all 32 backend tests |
| `npx prisma studio` | Open Prisma database GUI |

---

## Project Structure

```
zoe-sustainability-platform/
├── src/                          # Frontend source
│   ├── app/Router.tsx            # All routes registered
│   ├── components/
│   │   ├── ui/                   # Button, Card, Badge, Modal, Input, etc.
│   │   ├── layout/               # Header, Footer, Layout
│   │   └── auth/                 # ProtectedRoute, AdminRoute
│   ├── pages/
│   │   ├── (public)              # LandingPage, AboutPage, ProjectsPage, etc.
│   │   ├── auth/                 # LoginPage, RegisterPage
│   │   ├── user/                 # Dashboard, Profile, UserRewards
│   │   └── admin/                # AdminDashboard, ManageProjects, ManageUsers
│   ├── hooks/                    # useAuth, useProjects, useRewards
│   ├── stores/                   # authStore.ts, themeStore.ts, languageStore.ts
│   ├── services/                 # api.ts, authService.ts, projectService.ts
│   ├── types/index.ts            # All shared TypeScript types
│   ├── data/                     # Prototype fallback data only
│   └── locales/{en,el,de}/       # i18n translation files
├── backend/
│   ├── src/
│   │   ├── routes/               # auth.ts, projects.ts, users.ts, admin.ts
│   │   ├── controllers/          # Business logic per domain
│   │   ├── middleware/           # auth.ts (JWT), adminOnly.ts, validate.ts
│   │   └── index.ts              # Express entry point
│   └── prisma/
│       ├── schema.prisma         # DB schema
│       └── seed.ts               # Prototype seed data
├── e2e/                          # Playwright E2E tests
├── docs/                         # All project documentation
│   ├── dsr-methodology.md        # 6 Peffers phases, fully mapped
│   ├── architecture.md           # Routes, DB schema, Auth flow, ADRs
│   ├── api.md                    # All API endpoints
│   ├── user-guide.md             # Citizen documentation
│   ├── admin-guide.md            # Admin documentation
│   ├── accessibility-guidelines.md
│   └── accessibility-audit.md
├── .claude/agents/               # 8 Claude Code subagent definitions
├── CLAUDE.md                     # Claude Code session instructions
└── playwright.config.ts          # Playwright E2E configuration
```

---

## Documentation

| Document | Description |
|---|---|
| [`docs/dsr-methodology.md`](docs/dsr-methodology.md) | DSR theory, Peffers process mapping, all 6 phases |
| [`docs/architecture.md`](docs/architecture.md) | Full-stack architecture, routing, DB schema, ADRs |
| [`docs/api.md`](docs/api.md) | All REST API endpoints with request/response examples |
| [`docs/user-guide.md`](docs/user-guide.md) | Citizen user guide |
| [`docs/admin-guide.md`](docs/admin-guide.md) | Administrator guide |
| [`docs/accessibility-guidelines.md`](docs/accessibility-guidelines.md) | WCAG 2.1 AA guidelines and EU legal basis |
| [`docs/accessibility-audit.md`](docs/accessibility-audit.md) | Accessibility audit results |

---

## Phase Status

| Phase | Description | Status |
|---|---|---|
| 0 | System audit + context research | ✅ Complete |
| 1 | Architecture definition (ADR-001) | ✅ Complete |
| 2 | CLAUDE.md + development guidelines | ✅ Complete |
| 3 | Claude Code subagents (8 agents) | ✅ Complete |
| 4 | Backend (Node/Express/Prisma/SQLite/JWT) | ✅ Complete |
| 5 | Frontend upgrade (i18n, Zustand, dark mode, auth, admin) | ✅ Complete |
| 6 | Documentation (api.md, user-guide.md, admin-guide.md) | ✅ Complete |
| 7 | Environment & secrets management | ✅ Complete |
| 8 | Testing (37 frontend + 32 backend + Playwright E2E) | ✅ Complete |
| A | WCAG 2.1 AA accessibility pass (EU Directive 2016/2102) | ✅ Complete |

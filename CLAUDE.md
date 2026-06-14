# ZOE Sustainability Platform — CLAUDE.md

DSR-Artefakt (Peffers et al., 2007) — Projektseminar WInf SoSe 2026, FAU, Gruppe 1.  
Gemeinde Nordkorfu, Griechenland. Präsentation: 15.–17. Juni 2026.  
DSR-Mapping: `docs/dsr-methodology.md` | Architektur: `docs/architecture.md`

---

## Stack

| Schicht | Technologien |
|---|---|
| Frontend | React 19 · TypeScript (strict) · Vite 8 · Tailwind CSS 3 · React Router 7 |
| State | Zustand (auth, theme, language) |
| i18n | react-i18next — EN · EL · DE |
| Validation | Zod |
| Icons | lucide-react |
| Backend | Node.js · Express · TypeScript · Prisma · PostgreSQL (Supabase) |
| Auth | JWT (Access 15min + Refresh 7d, httpOnly Cookie) · bcryptjs |
| Testing | Vitest · React Testing Library · Playwright |
| Tooling | ESLint · Prettier · Husky · lint-staged |

## Verzeichnisstruktur

```
src/                          # Frontend (bleibt an Root, kein frontend/ Split)
├── app/Router.tsx            # Alle Routen registriert
├── components/
│   ├── ui/                   # Button, Card, Badge, Modal, Input, etc.
│   ├── layout/               # Header, Footer, Layout
│   └── auth/                 # ProtectedRoute, AdminRoute
├── pages/
│   ├── (public)              # LandingPage, AboutPage, ProjectsPage, etc.
│   ├── auth/                 # LoginPage, RegisterPage
│   ├── user/                 # Dashboard, Profile, Rewards
│   └── admin/                # AdminDashboard, ManageProjects, ManageUsers
├── hooks/                    # useAuth, useProjects, useRewards, useTheme, useLanguage
├── stores/                   # authStore.ts, themeStore.ts, languageStore.ts (Zustand)
├── services/                 # api.ts, authService.ts, projectService.ts, rewardService.ts
├── types/index.ts            # Alle shared types (domain + API)
├── data/                     # PROTOTYPE FALLBACK DATA nur
├── locales/
│   ├── en/translation.json
│   ├── el/translation.json
│   └── de/translation.json
└── utils/                    # formatters, validators, constants
backend/
├── src/
│   ├── routes/               # auth.ts, projects.ts, users.ts, rewards.ts, admin.ts
│   ├── controllers/          # authController.ts, projectController.ts, etc.
│   ├── middleware/           # auth.ts (JWT), adminOnly.ts, validate.ts
│   ├── services/             # authService.ts, projectService.ts, rewardService.ts
│   └── index.ts              # Express entry point
├── prisma/
│   ├── schema.prisma
│   └── seed.ts               # PROTOTYPE SEED DATA
└── .env.example
docs/
├── analysis/existing-system-audit.md
├── research/                 # corfu-context.md, reward-system-research.md, etc.
├── architecture.md           # Routes, DB-Schema, Auth-Flow, ADRs
├── dsr-methodology.md        # 6 Peffers-Phasen, vollständig
├── api.md                    # Alle API-Endpunkte
├── user-guide.md             # Bürger:innen-Doku
└── admin-guide.md            # Admin-Doku
```

---

## Absolute Regeln — niemals brechen

- **Kein `any` Type** — TypeScript strict überall
- **Kein hardcodierter Text im JSX** — ausnahmslos `t('key')` aus react-i18next
- **Keine Inline-Daten in Komponenten** — immer `src/data/` (Fallback) oder API via `services/`
- **`PrototypeBanner` bleibt auf allen Seiten** — akademische Pflicht
- **Jede Datei in `src/data/` beginnt mit `// PROTOTYPE DATA —`**
- **Passwörter/Secrets niemals im Code** — immer `.env` + `.env.example`
- **Kein `console.log` in Commits**
- **Mobile First** — jede Komponente zuerst für 375px
- **Keine direkten `fetch()`-Calls in Komponenten** — immer über `services/`

---

## Accessibility — Pflicht bei jeder Änderung

Rechtliche Grundlage: **EU Directive 2016/2102**, EN 301 549, **WCAG 2.1 Level AA**, EAA (Juni 2025).  
Vollständige Referenz: `docs/accessibility-guidelines.md`

Vor jedem Commit muss für jeden geänderten/neuen Component gelten:

- [ ] Semantisch korrektes HTML-Element (kein `<div onClick>`, kein `role="button"` auf `<button>`)
- [ ] Alle `<img>` haben `alt`-Attribut (dekorativ: `alt=""` + `aria-hidden="true"`)
- [ ] Farbkontrast: 4.5:1 (Normaltext), 3:1 (Großtext/UI-Elemente) — prüfen mit webaim.org/resources/contrastchecker
- [ ] Tastatur-navigierbar: Tab + Enter/Space, Fokus-Indikator via `focus-visible:ring-2`
- [ ] Kein hardcodierter Text — ausnahmslos `t('key')`
- [ ] Icon-Only-Buttons: `aria-label={t('key')}` vorhanden
- [ ] Mobile 375px: Touch-Targets ≥ 44×44px
- [ ] `prefers-reduced-motion`: keine Animationen ohne `motion-safe:` Präfix in Tailwind
- [ ] Dark Mode: Kontraste in beiden Modi eingehalten
- [ ] Neue Formularfelder: `htmlFor`+`id` verknüpft, `aria-required`, `role="alert"` auf Fehler
- [ ] `aria-label` immer via `t('key')` (nicht hardcodiert)

---

## Auth-System

- Rollen: `USER` · `ADMIN`
- JWT: Access Token (15min, `Authorization: Bearer`) + Refresh Token (7d, httpOnly Cookie)
- Protected Routes: `<ProtectedRoute>` für USER, `<AdminRoute>` für ADMIN
- Logout invalidiert Refresh Token serverseitig
- Middleware: `backend/src/middleware/auth.ts` + `adminOnly.ts`

---

## i18n

- Bibliothek: `react-i18next`
- Sprachen: `en` · `el` (Griechisch) · `de` (Deutsch)
- Namespaces: `common`, `navigation`, `projects`, `rewards`, `admin`, `auth`
- Persistenz: `localStorage`
- Fallback-Sprache: Englisch
- Alle Übersetzungen in `src/locales/{en,el,de}/translation.json`

---

## Dark Mode

- Strategie: Tailwind `class`-basiert (`dark:`)
- Toggle via Zustand `themeStore`, persistiert in `localStorage`
- System-Präferenz als initialer Default

---

## Backend-Regeln

- Passwörter: bcrypt, min. 12 rounds
- Input: express-validator Pflicht auf allen Routes
- Response-Format: `{ success: true, data: T }` / `{ success: false, error: string }`
- Admin-Endpunkte: immer `adminOnly`-Middleware
- Seed-Daten: `prisma/seed.ts` beginnt mit `// PROTOTYPE SEED DATA —`

---

## Docs — update wenn

| Änderung | Dokument |
|---|---|
| Route oder Ordnerstruktur | `docs/architecture.md` |
| API-Endpunkt hinzugefügt/geändert | `docs/api.md` |
| User-facing Feature | `docs/user-guide.md` |
| Admin-Feature | `docs/admin-guide.md` |
| DSR-relevante Entscheidung | `docs/dsr-methodology.md` |
| Major Feature oder Setup | `README.md` |

---

## Git Workflow

Branches: `feature/<name>` → `develop` → `main`  
Niemals direkt auf `main` committen.  
Commit-Typen: `feat:` `fix:` `docs:` `refactor:` `style:` `data:` `test:` `chore:`

---

## Subagents (`.claude/agents/`)

| Agent | Zuständigkeit |
|---|---|
| `research-agent` | Wissenschaftliche Recherche, Korfu-Kontext, DSR-Rigor |
| `architect-agent` | API-Design, DB-Schema, Routing, ADR-Dokumentation |
| `frontend-agent` | React-Komponenten, i18n, Dark Mode, Accessibility |
| `backend-agent` | Express-Routes, Prisma, Auth, Business Logic |
| `ux-agent` | Copy (EN/EL/DE), Aria-Labels, UX-Review, Civic Tone |
| `review-agent` | Code Review, Security Check, CLAUDE.md-Compliance |
| `testing-agent` | Vitest Tests, Playwright E2E, Coverage |
| `docs-agent` | Alle .md-Dateien, API-Docs, User/Admin-Guides |

*Auch vorhanden (Altbestand, weiterhin gültig):*  
`dsr-methodology-agent` · `frontend-implementation-agent` · `documentation-agent` · `ux-content-agent`

---

## Phase-Status

| Phase | Status |
|---|---|
| Phase 0: Analyse & Audit | ✅ `docs/analysis/existing-system-audit.md` |
| Phase 1: Architektur | ✅ ADR in `docs/analysis/existing-system-audit.md` §10 |
| Phase 2: CLAUDE.md | ✅ diese Datei |
| Phase 3: Sub-Agents | ✅ 8 Agents in `.claude/agents/` |
| Phase 4: Backend | ✅ Node/Express/Prisma/PostgreSQL (Supabase)/JWT |
| Phase 5: Frontend-Upgrade | ✅ i18n, Zustand, Dark Mode, Auth, Admin |
| Phase 6: Dokumentation | ✅ api.md, user-guide.md, admin-guide.md, architecture.md |
| Phase 7: Env & Secrets | ✅ .env.example, Secrets in .env |
| Phase 8: Tooling | ✅ Vitest 32/32, Husky, lint-staged |

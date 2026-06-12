# Architecture — ZOE Platform

**Version:** 2.0 (Phase 4 — Full-Stack)  
**Last updated:** 2026-05-25  

---

## 1. System Overview

```
Browser (React SPA)
  │
  ├── Auth: JWT Access Token (memory) + Refresh Token (httpOnly cookie)
  │
  └── HTTP/REST → http://localhost:3001/api
                       │
                  Express API Server
                       │
                  Prisma ORM → SQLite (dev) / PostgreSQL (prod)
```

**ADR-001:** Frontend stays at root `src/` (not moved to `frontend/`). Rationale: avoid breaking working build; backend added as `backend/` alongside. See `docs/analysis/existing-system-audit.md` §10.

---

## 2. Frontend Routes

| Path | Component | Auth |
|---|---|---|
| `/` | LandingPage | Public |
| `/about` | AboutPage | Public |
| `/projects` | ProjectsPage | Public |
| `/projects/:id` | ProjectDetailPage | Public |
| `/sdg-dashboard` | SDGDashboardPage | Public |
| `/participate` | ParticipationPage | Public |
| `/audiences` | AudiencesPage | Public |
| `/events` | EventsPage | Public |
| `/transparency` | TransparencyPage | Public |
| `/roadmap` | RoadmapPage | Public |
| `/rewards` | RewardsPage | Public |
| `/school-ranking` | SchoolRankingPage | Public |
| `/news` | NewsPage | Public |
| `/login` | LoginPage | Public |
| `/register` | RegisterPage | Public |
| `/dashboard` | DashboardPage | USER |
| `/profile` | ProfilePage | USER |
| `/my-rewards` | UserRewardsPage | USER |
| `/school` | SchoolDashboardPage | SCHOOL |
| `/admin` | AdminDashboardPage | ADMIN |
| `/admin/projects` | ManageProjectsPage | ADMIN |
| `/admin/projects/new` | NewProjectPage | ADMIN |
| `/admin/projects/:id/edit` | EditProjectPage | ADMIN |
| `/admin/events` | ManageEventsPage | ADMIN |
| `/admin/events/new` | NewEventPage | ADMIN |
| `/admin/events/:id/edit` | EditEventPage | ADMIN |
| `/admin/users` | ManageUsersPage | ADMIN |
| `/admin/schools` | ManageSchoolsPage | ADMIN |
| `/admin/posts` | ManagePostsPage | ADMIN |

---

## 3. API Routes

Full documentation: `docs/api.md`

| Prefix | Description | Auth |
|---|---|---|
| `POST /api/auth/register` | Register | — |
| `POST /api/auth/login` | Login | — |
| `POST /api/auth/refresh` | Refresh token | Cookie |
| `POST /api/auth/logout` | Logout | Bearer |
| `GET /api/projects` | List projects | — |
| `GET /api/projects/:id` | Get project | — |
| `POST /api/projects` | Create project | ADMIN |
| `PUT /api/projects/:id` | Edit project | ADMIN |
| `DELETE /api/projects/:id` | Close project | ADMIN |
| `POST /api/projects/:id/participate` | Join project | USER |
| `DELETE /api/projects/:id/participate` | Withdraw | USER |
| `GET /api/events` | List events (filter category/projectId/upcoming) | — |
| `GET /api/events/:id` | Get event | — |
| `POST /api/events/:id/join` | Join event (earn points) | USER |
| `POST /api/events/:eventId/register` | Open RSVP (guest/user) | optional |
| `GET /api/events/:eventId/count` | Registration count | — |
| `POST /api/admin/events` | Create event | ADMIN |
| `PATCH /api/admin/events/:id` | Edit event | ADMIN |
| `DELETE /api/admin/events/:id` | Delete event | ADMIN |
| `GET /api/users/me` | Own profile | USER |
| `PUT /api/users/me` | Update profile | USER |
| `GET /api/users/me/badges` | Own badges | USER |
| `GET /api/users/leaderboard` | Top 10 | — |
| `GET /api/admin/users` | All users | ADMIN |
| `PUT /api/admin/users/:id/role` | Change role | ADMIN |
| `GET /api/admin/stats` | Dashboard stats | ADMIN |
| `POST /api/admin/translate` | Auto-translate fields via DeepL | ADMIN |
| `POST /api/admin/schools` | Create school (+ coordinator) | ADMIN |
| `PUT /api/admin/schools/:id` | Edit school | ADMIN |
| `DELETE /api/admin/schools/:id` | Delete school | ADMIN |
| `GET /api/schools` | List schools | — |
| `GET /api/schools/leaderboard` | School ranking (avg/member) | — |
| `GET /api/schools/:id` | School detail | — |
| `GET /api/schools/me` | Own school dashboard | SCHOOL |
| `POST /api/schools/join` | Join by code | USER |
| `POST /api/schools/leave` | Leave school | USER |
| `GET /api/posts` | News feed (published) | — |
| `GET /api/posts/:id` | Single post | — |
| `POST /api/posts` | Create post | ADMIN |
| `PUT /api/posts/:id` | Edit post | ADMIN |
| `DELETE /api/posts/:id` | Delete post | ADMIN |

---

## 4. Database Schema (Prisma / PostgreSQL)

```
User
  id, email*, password (bcrypt), name, role (USER|ADMIN|SCHOOL), points, avatarUrl,
  language (EN|EL|DE), profile (RESIDENT|VISITOR|STUDENT|VOLUNTEER), schoolId?
  → school(School?), participations[], userBadges[], refreshTokens[], createdProjects[]

School
  id, name, code* (join code), location?
  → members(User[])   // ranking = avg points of role=USER members, min 3 to rank

Project
  id, titleEn, titleEl, titleDe, descriptionEn, descriptionEl, descriptionDe
  sdgIds (JSON string), category, status, listed (default true), rewardPoints,
  location, maxParticipants, lat?, lng?  (optional WGS84 map coordinates, additive)
  → participations[], createdBy(User), posts[], events[]
  // listed=false → structural/umbrella project: hidden from public lists/counts,
  //   still reachable by direct link (Decision A)

Event   // concrete dated appointment; REQUIRED parent project (1 project → N events)
  id, titleEn/El/De, descriptionEn/El/De, date (DateTime), location?,
  category (project category), status (UPCOMING|COMPLETED), rewardPoints,
  capacity?, projectId
  → project(Project)   // real FK (required, ON DELETE RESTRICT) — Decision A
  // Lifecycle: registering awards NO points. An admin marks the event COMPLETED
  //   (POST /admin/events/:id/complete) → every registered logged-in user is
  //   credited rewardPoints exactly once (idempotent), then threshold badges.

Post   // news/blog; auto-created on project OPEN/COMPLETED or written by admin
  id, type (PROJECT_NEW|PROJECT_COMPLETED|ANNOUNCEMENT)
  titleEn/El/De, bodyEn/El/De, imageUrl?, published, projectId?
  → project(Project?)

Participation
  id, userId, projectId, joinedAt, pointsAwarded
  UNIQUE(userId, projectId)

EventRegistration   // attendance/RSVP
  id, eventId (SOFT ref to Event.id — no FK), userId?, guestName?, guestEmail?,
  pointsAwarded (0 until the event is COMPLETED), createdAt
  UNIQUE(userId, eventId)   // logged-in users; guests (null userId) unconstrained

Submission   // citizen issue report / feedback from /participate (mirrors Idea)
  id, type (REPORT|FEEDBACK), message, submitterName?, submitterEmail?,
  userId? (linked when logged in), createdAt
  // read-only admin overview (/admin/submissions); no workflow yet

Badge
  id, nameEn, nameEl, nameDe, descEn, descEl, descDe, iconName, threshold
  → userBadges[]

UserBadge
  userId, badgeId, earnedAt
  PRIMARY KEY (userId, badgeId)

RefreshToken
  id, token*, userId, expiresAt
```

### ADR — School accounts & ranking

- **Group + login (hybrid).** A `School` is a group entity; students join via a
  `code` (`User.schoolId`). A `SCHOOL`-role login (provisioned by an admin) gives a
  read-only coordinator dashboard. This satisfies both "school accounts exist" and
  "students contribute to the school" without a second auth system.
- **Average per member as the ranking metric**, with a **3-member minimum** to be
  ranked. Avoids the size bias of summing totals and the noise of 1-student schools.
  Total points and member count are still shown for transparency.
- **One school per user** (nullable FK, `ON DELETE SET NULL`) — deliberately simple
  for the prototype; no membership join-table.

### ADR — News feed & auto-posts

- A `Post` is **trilingual** and either **auto-created** from a project's lifecycle
  (publish → `PROJECT_NEW`, complete → `PROJECT_COMPLETED`) or written by an admin.
- Auto-posts are **idempotent** (one per `projectId`+`type`) and built from the
  project's existing EN/EL/DE fields, so **no extra translation call** is needed.
  Manual posts reuse the existing DeepL `/admin/translate` panel.
- Auto-creation is **non-blocking** (failures never break project create/update).

### ADR — Events as an entity with a soft RSVP link

- An **`Event`** is a concrete dated appointment that **belongs to a `Project`**
  (`projectId`, required FK, `ON DELETE RESTRICT`) so one initiative groups many
  dated activities (Decision A; was nullable before). Cross-cutting events with
  no single thematic home attach to the structural **ZOE umbrella project**
  (`proj-zoe-programme`, `listed = false`).
- **`EventRegistration.eventId` stays a soft string reference (no FK).** The RSVP
  table predates the `Event` model; adding a hard FK would have rejected
  historical rows on migration. Existence is validated at the application layer
  (the `join` route 404s on unknown events), and seeded events reuse the legacy
  `evt-*` ids so older RSVPs stay linked — an **additive, loss-free** migration.
- **Two participation paths kept:** `POST /events/:id/join` (logged-in, earns the
  event's `rewardPoints`, mirrors project participation incl. badges) and the
  existing open `POST /events/:eventId/register` (guests: name+email+consent, no
  points). `category` reuses the single `PROJECT_CATEGORIES` source.

### ADR — Decision A: event↔project required, `Project.listed`, join scope

- **Events require a project** (`Event.projectId` `String?` → `String`, FK
  `ON DELETE RESTRICT`). The migration creates a `proj-zoe-programme` umbrella
  project (conditionally, only where existing null-project events need a home)
  and rehomes them before `SET NOT NULL`, so it is correct on both fresh and
  production DBs.
- **`Project.listed` (default `true`)** = public visibility. The umbrella project
  is `listed = false`: **hidden from the public list, count, teasers and filters**
  (`projectController` list/count filter `listed: true`) but **reachable by direct
  link** (`GET /api/projects/:id` is unfiltered), so an event detail can link to
  it. The landing "projects" stat counts `listed = true` projects **dynamically**.
- **Join scope:** only **events** are joinable (`EventRegistration`). **Projects
  are view-only** — the project Join/participate CTA and its points path were
  removed from the UI; card CTA is "View project". A "Follow projects" feature is
  **deferred** (Future Work).
- **`Participation` stays** (model + `/projects/:id/participate` endpoint +
  historical rows) to avoid a lossy migration. Removing/repurposing it as a
  lightweight "follow" is **Future Work** — see
  `docs/limitations-and-future-work.md`.

### ADR — Interactive initiative map

- **Library: Leaflet + react-leaflet** (MIT, **no API key**) with **OpenStreetMap**
  tiles (light) / **CARTO dark_all** (dark) — both free; OSM + CARTO attribution is
  rendered (licence requirement). No Google/Mapbox, no routing, no realtime geodata.
- **Data: additive `Project.lat?/lng?`** (two nullable floats), seeded for the 8
  projects. Three municipality-wide actions share the Acharavi centroid; `led` +
  `education` get a small deterministic **display offset** so all markers stay
  clickable (not precise point locations).
- **`ProjectMap`** (`src/components/map/`) takes a decoupled `points: MapPoint[]`
  prop, so it serves both the API-driven `/projects` (List/Map toggle) and the
  fallback-data `/get-involved`. **Marker icons use coloured `divIcon`s** (HTML, no
  image assets) which sidesteps the known Leaflet/Vite marker-icon path bug; a
  `L.Icon.Default` override is kept as a safety net.

---

## 5. Auth Flow (ASCII Diagram)

```
1. Register / Login
   Client → POST /auth/login → Server
   Server → { accessToken (15min) } + Set-Cookie: refreshToken (7d, httpOnly)

2. Authenticated Request
   Client → GET /api/users/me (Authorization: Bearer <accessToken>)
   Server → 200 or 401

3. Token Refresh (when 401)
   Client → POST /auth/refresh (cookie sent automatically)
   Server → { accessToken (new 15min) }

4. Logout
   Client → POST /auth/logout
   Server → DELETE refreshToken from DB + clearCookie
```

---

## 6. State Management

| Store | Library | Persists |
|---|---|---|
| `authStore` | Zustand | Memory only (token) |
| `themeStore` | Zustand | localStorage |
| `languageStore` | Zustand | localStorage |

---

## 7. i18n Setup

- Library: `react-i18next`
- Languages: `en` (default), `el`, `de`
- Fallback: `en`
- Files: `src/locales/{en,el,de}/translation.json`
- Initialized in: `src/utils/i18n.ts` (imported before App)
- **All public pages** use `t()` (no hardcoded JSX text); switching language updates `document.documentElement.lang`
- **Language switcher:** `components/layout/LanguageSwitcher.tsx` — flag pills (inline SVG GB/GR/DE, OS-independent) in the header
- **Content i18n:** the `Project` model stores `titleEn/El/De` + `descriptionEn/El/De`; public pages render the field for the current UI language
- **DeepL auto-translation:** `backend/src/services/translationService.ts` + `POST /api/admin/translate` (adminOnly). The admin `AutoTranslatePanel` fills the other languages from one input. Key in `DEEPL_API_KEY` (`.env`); Free vs Pro endpoint auto-detected via the `:fx` suffix; graceful `503 translation_not_configured` fallback when unset.

---

## 8. Tech Stack Rationale

| Decision | Rationale |
|---|---|
| SQLite (dev) | Zero-config, file-based, perfect for prototype demo |
| Prisma | Type-safe DB access, migration management, easy PostgreSQL swap |
| Zustand | Lightweight, no Provider wrapper needed, TypeScript-friendly |
| react-i18next | Most mature i18n library for React, used in production civic platforms |
| httpOnly refresh cookie | Prevents XSS token theft; access token in memory not localStorage |
| bcrypt 12 rounds | Prototype: balance between security and seed speed |
| Express (not Fastify) | Team familiarity; sufficient for prototype API |

---

## 9. Dev Setup

```bash
# Backend
cd backend
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev          # → http://localhost:3001

# Frontend (root)
cp .env.example .env
npm install
npm run dev          # → http://localhost:5173
```

---

## 10. Testing

| Layer | Tool | Count | Command |
|---|---|---|---|
| Frontend unit | Vitest + React Testing Library | 37 tests | `npm test` |
| Accessibility | jest-axe (axe-core) | 5 tests | `npm test` |
| Backend integration | Vitest + Supertest | 32 tests | `cd backend && npm test` |
| E2E browser | Playwright (Chromium) | 49 tests | `npm run test:e2e` |

### Running E2E tests (WSL2 note)

On WSL2, Playwright's bundled Chromium needs system libraries. First-time setup:

```bash
./scripts/setup-e2e-deps.sh   # downloads libs without sudo
npm run test:e2e               # LD_LIBRARY_PATH is set automatically
```

On native Linux or with `sudo`: `sudo npx playwright install-deps && npm run test:e2e`

### E2E test coverage

| File | Tests |
|---|---|
| `e2e/public-navigation.spec.ts` | All public routes load, PrototypeBanner visible |
| `e2e/auth.spec.ts` | Login, logout, admin login, register form |
| `e2e/protected-routes.spec.ts` | Unauthenticated redirect to /login, admin access control |
| `e2e/dark-mode-and-language.spec.ts` | Dark mode toggle, language switching (EN/EL/DE) |
| `e2e/accessibility.spec.ts` | Keyboard nav, lang attribute, images alt, footer |
| `e2e/projects.spec.ts` | Projects list, project detail, admin project management |

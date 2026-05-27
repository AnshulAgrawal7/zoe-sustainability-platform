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
| `/login` | LoginPage | Public |
| `/register` | RegisterPage | Public |
| `/dashboard` | DashboardPage | USER |
| `/profile` | ProfilePage | USER |
| `/my-rewards` | UserRewardsPage | USER |
| `/admin` | AdminDashboardPage | ADMIN |
| `/admin/projects` | ManageProjectsPage | ADMIN |
| `/admin/projects/new` | NewProjectPage | ADMIN |
| `/admin/projects/:id/edit` | EditProjectPage | ADMIN |
| `/admin/users` | ManageUsersPage | ADMIN |

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
| `GET /api/users/me` | Own profile | USER |
| `PUT /api/users/me` | Update profile | USER |
| `GET /api/users/me/badges` | Own badges | USER |
| `GET /api/users/leaderboard` | Top 10 | — |
| `GET /api/admin/users` | All users | ADMIN |
| `PUT /api/admin/users/:id/role` | Change role | ADMIN |
| `GET /api/admin/stats` | Dashboard stats | ADMIN |

---

## 4. Database Schema (Prisma / SQLite)

```
User
  id, email*, password (bcrypt), name, role (USER|ADMIN), points, avatarUrl, language (EN|EL|DE)
  → participations[], userBadges[], refreshTokens[], createdProjects[]

Project
  id, titleEn, titleEl, titleDe, descriptionEn, descriptionEl, descriptionDe
  sdgIds (JSON string), category, status, rewardPoints, location, maxParticipants
  → participations[], createdBy(User)

Participation
  id, userId, projectId, joinedAt, pointsAwarded
  UNIQUE(userId, projectId)

Badge
  id, nameEn, nameEl, nameDe, descEn, descEl, descDe, iconName, threshold
  → userBadges[]

UserBadge
  userId, badgeId, earnedAt
  PRIMARY KEY (userId, badgeId)

RefreshToken
  id, token*, userId, expiresAt
```

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

# Nightsession Log — Schulaccounts & Neuigkeiten-Feed

**Branch:** `feature/schools-and-news`
**Spec:** `docs/features/schools-and-news-spec.md`
**Start:** 2026-06-08 (autonomer Nightrun)

Laufendes Protokoll der autonomen Umsetzung. Neueste Einträge unten.

---

## Plan (Phasen)

- [x] P0 — Setup: Branch, Log, Umgebung sichten
- [x] P1 — Quick Win: Emoji aus Registrierungs-Dropdown
- [x] P2 — Prisma: `School`, `User.schoolId`/Rolle `SCHOOL`, `Post` + Migration
- [x] P3 — Backend Schulen: Controller, Routes, `schoolOnly`, Validatoren
- [x] P4 — Backend Posts: Controller, Routes, Auto-Post-Hook
- [x] P5 — Seed-Daten
- [x] P6 — Frontend: Types, Services
- [x] P7 — Frontend Schulen: Ranking, Dashboard, Admin, Join, SchoolRoute
- [x] P8 — Frontend News: Landing-Sektion, /news, Admin
- [x] P9 — i18n EN/EL/DE
- [x] P10 — Tests
- [x] P11 — Docs
- [x] P12 — Commit

---

## Log

### P0 — Setup ✅
- Branch `feature/schools-and-news` erstellt.
- Umgebung: lokale Test-DB (5433) **und** Supabase (6543) erreichbar. Docker-CLI nicht
  nutzbar (Permission), aber Test-Postgres läuft bereits → Tests ok.
- Tests bauen Schema lokal via `prisma db push --force-reset` (globalSetup) → meine
  Schema-Änderungen greifen automatisch in den Tests.
- Supabase-Migration: nicht-destruktiv via `migrate diff` (file-based) + `migrate deploy`
  geplant (kein Reset-Risiko auf geteilter Dev-DB).

### P1 — Emoji raus ✅
- `RegisterPage.tsx` + `ProfilePage.tsx`: Emoji-Präfix aus den Rollen-`<select>` entfernt.
  `PROFILE_EMOJI`-Mapping + dekorative Reward-Focus-Nutzung bleiben.

### P2 — Prisma + Migration ✅
- `schema.prisma`: `School` (name, code @unique, location), `User.schoolId` (nullable FK,
  Relation "SchoolMembers"), Rolle-Kommentar um `SCHOOL` ergänzt; `Post` (type, title/body
  En/El/De, imageUrl?, published, projectId?) + `Project.posts`.
- `prisma format`/`validate` ok, `generate` ok.
- Migration `20260608130000_schools_and_news` (additiv, nullable FKs → ON DELETE SET NULL)
  von Hand geschrieben (file-based diff brauchte Shadow-DB).
- `migrate status`: DB war synchron; `migrate deploy` → Migration **erfolgreich auf
  Supabase angewendet**. Tests bauen lokal ohnehin via `db push` aus dem Schema.

### P3 — Backend Schulen ✅
- `middleware/schoolOnly.ts`, `controllers/schoolController.ts`, `routes/schools.ts`.
- Endpunkte: GET `/schools`, `/schools/leaderboard`, `/schools/:id`, `/schools/me` (SCHOOL),
  POST `/schools/join`, `/schools/leave`; Admin-CRUD in `routes/admin.ts`
  (POST/PUT/DELETE `/admin/schools`). Rollen-Validator um `SCHOOL` ergänzt.
- Ranking: Ø-Punkte/Mitglied (nur role=USER), min. 3 Mitglieder gewertet, Ranked-vor-Unranked.
- auth/user-Controller geben jetzt `schoolId` mit zurück (Login/Register/getMe).

### P4 — Backend Posts ✅
- `services/postService.ts` (`createAutoPost`, idempotent, dreisprachig aus Projektfeldern),
  `controllers/postController.ts`, `routes/posts.ts`.
- Auto-Hook in `projectController`: create→OPEN ⇒ PROJECT_NEW; update DRAFT→OPEN ⇒ PROJECT_NEW;
  →COMPLETED ⇒ PROJECT_COMPLETED. Nie blockierend (try/catch), kein Doppel-Post.
- Router in `app.ts` registriert (`/api/schools`, `/api/posts`).

### P5 — Seed ✅
- 3 Schulen (KERKYRA-7F, LEFKIMMI-A2, ACHARAVI-3B), 9 Schüler (role USER/STUDENT),
  3 SCHOOL-Logins (school1..3@zoe-corfu.gr / School2026!), 5 Posts (manuell + projektbezogen).
- Acharavi bewusst nur 2 Mitglieder → demonstriert die „nicht gewertet"-Regel.

### Backend-Tests (Teil P10) ✅
- `schools.test.ts` (9) + `posts.test.ts` (7). **53/53 Tests grün** (vorher 37).
- Deckt: Ranking-Aggregation (Ø, min-3, Reihenfolge), Join (404/401/case-insensitive),
  Admin-Create+Coordinator, `/schools/me` (200/403), Auto-Post-Hook + Idempotenz.

### P6 — Frontend Types + Services ✅
- `types/index.ts`: `UserRole` um SCHOOL, `AuthUser.schoolId`, neue Typen `School*`, `Post*`.
- `services/schoolService.ts`, `services/postService.ts` (alle über `api`, keine `fetch()`).
- `data/schoolRewards.ts` (5 Schul-Stufen + `schoolTierForPoints`), `data/schools.ts`,
  `data/posts.ts` (Fallbacks, PROTOTYPE-Header). `authStore` um `isSchool`.

### P7 — Frontend Schulen ✅
- `components/auth/SchoolRoute.tsx`, `pages/SchoolRankingPage.tsx` (/school-ranking),
  `pages/school/SchoolDashboardPage.tsx` (/school), `pages/admin/ManageSchoolsPage.tsx`
  (/admin/schools), `components/school/SchoolMembershipCard.tsx` (Profil: beitreten/verlassen),
  RegisterPage: Schul-Code-Feld bei Profil STUDENT (+ Auto-Join). Header/UserMenu: SCHOOL-Link.

### P8 — Frontend News ✅
- `components/news/PostCard.tsx`, `pages/NewsPage.tsx` (/news, Typ-Filter),
  `pages/admin/ManagePostsPage.tsx` (/admin/posts, CRUD + DeepL über generalisiertes
  `AutoTranslatePanel` mit `fields=['title','body']`), Landing-„Neuigkeiten"-Sektion (API).
- Router + AdminDashboard-Kacheln verdrahtet.

### P9 — i18n ✅
- Deep-Merge-Skript (einmalig, danach gelöscht) → alle neuen Keys in EN/EL/DE:
  nav.*, landing.news.*, news.*, schools.* (ranking/dashboard/join/membership),
  schoolRewards.tiers.*, admin.schools.*, admin.posts.*. JSON valide.

### P10 — Tests ✅
- Backend 53 grün. Frontend 25 grün (+ `data/schoolRewards.test.ts`: Tier-Logik + pickLang).
- type-check (tsc -b) ✅, ESLint ✅, `npm run build` ✅.

### Runtime-Smoke-Test (gegen Supabase) ✅
- Supabase via `migrate deploy` + Seed (idempotent) aktualisiert.
- `GET /schools/leaderboard`: Lefkimmi #1 (Ø207), Κέρκυρα #2 (Ø148), Acharavi ungewertet (2).
- `GET /posts`: 5 Posts, alle 3 Typen. `school1`-Login → role SCHOOL + schoolId.
- `GET /schools/me` (SCHOOL) → 200 (Rang 2/3); mit USER-Token → 403.

### P11 — Docs ✅
- `docs/api.md`: Schools- + Posts-Sektionen, Admin-Schul-Routen, Rollen-Body um SCHOOL.
- `docs/architecture.md`: Frontend-/API-Routen-Tabellen, DB-Schema (School/Post/schoolId),
  zwei neue ADRs (Schulmodell+Ranking, News+Auto-Posts).
- `docs/admin-guide.md`: §8 Schulen verwalten, §9 Neuigkeiten verwalten.
- `docs/user-guide.md`: §6 Schule beitreten + Ranking, §7 Neuigkeiten, Übersichtstabelle.

### P12 — Commit ✅
- Finale Verifikation: FE build/lint/test (25) + BE type-check/test (53) alle grün.
- Commit auf `feature/schools-and-news` (kein direkter main-Commit).

---

## Ergebnis

Alle 4 Vorschläge umgesetzt: (1) Name+Dropdown war bereits da (SCHOOL-Link ergänzt),
(2) Schulaccounts + Ranking + Schul-Belohnungen, (3) Neuigkeiten/Blog (Auto + manuell,
Landing + /news), (4) Emoji aus Rollen-Dropdowns. Migration auf Supabase angewendet +
geseedet. **78 Tests grün** (53 BE + 25 FE), Build/Lint/Type-Check sauber.

**Offene Follow-ups (bewusst nicht im Nightrun):** Schul-Selbstverwaltung (Mitglieder
entfernen, Code regenerieren), Schul-Badges, Post-Detailseite `/news/:id`,
E-Mail-Benachrichtigungen. E2E-Playwright-Tests für die neuen Flows könnten folgen.

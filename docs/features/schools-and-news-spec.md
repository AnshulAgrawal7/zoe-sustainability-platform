# Feature-Spezifikation: Schulaccounts & Neuigkeiten-Feed

> Umsetzungs-Spec für den autonomen Nightrun. Diese Datei ist die verbindliche
> Quelle für Scope und Akzeptanzkriterien. Mit dem Nutzer am 2026-06-08
> abgestimmt (DSR-Artefakt, Gruppe 1, Gemeinde Nordkorfu).
>
> **Pflicht:** Alle Regeln aus `CLAUDE.md` gelten — kein `any`, kein
> hardcodierter JSX-Text (immer `t('key')`), `PrototypeBanner` auf allen Seiten,
> `src/data/`-Dateien beginnen mit `// PROTOTYPE DATA —`, Seed mit
> `// PROTOTYPE SEED DATA —`, Response-Format `{ success, data }` /
> `{ success, error }`, `adminOnly`-Middleware auf Admin-Routen, WCAG 2.1 AA,
> Dark Mode, Mobile-First (375px), i18n EN/EL/DE. Tests grün halten (Vitest),
> Docs aktualisieren (`docs/api.md`, `docs/architecture.md`, Guides).

---

## 1. Überblick (vier Vorschläge)

| # | Vorschlag | Status | Aufwand |
|---|-----------|--------|---------|
| 1 | Name + Dropdown oben rechts nach Login | ✅ **fertig** (`UserMenu.tsx`) — nicht anfassen, außer optionales Profil-Badge (s. §6) | — |
| 2 | Schulaccounts + Schulranking + Schul-Belohnungen | **NEU** — Hauptarbeit | groß |
| 3 | Startseiten-Neuigkeiten/Blog (auto + manuell) | **NEU** | mittel |
| 4 | Rollen-Dropdown bei Registrierung ohne Emoji | **NEU**, trivial | klein |

---

## 2. Vorschlag 4 — Emoji aus Registrierungs-Dropdown (Quick Win zuerst)

- `src/pages/auth/RegisterPage.tsx`: Zeile mit `{p.emoji} {t(...)}` → nur noch
  `{t(\`profiles.${p.id}.label\`)}` rendern.
- `src/data/profiles.ts`: `PROFILE_EMOJI` und `ProfileOption.emoji` **bleiben**
  bestehen (evtl. anderweitig genutzt) — nur die Verwendung im Dropdown entfällt.
- Akzeptanz: Dropdown zeigt reinen Text in allen 3 Sprachen, kein Emoji.

---

## 3. Vorschlag 2 — Schulaccounts, Ranking, Belohnungen

### 3.1 Datenmodell (Prisma — `backend/prisma/schema.prisma`)

Neues Model + Erweiterung von `User`. Enums bleiben als `String` (App-Layer-Validierung),
konsistent mit dem bestehenden Schema.

```prisma
// type: Schule als Gruppe + zugehöriger Schul-Login (Rolle "SCHOOL")
model School {
  id         String   @id @default(cuid())
  name       String
  code       String   @unique          // Beitritts-Code für Schüler:innen (z.B. "KERKYRA-7F")
  location   String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  members    User[]   @relation("SchoolMembers")
}

model User {
  // ... bestehende Felder ...
  role      String   @default("USER")  // "USER" | "ADMIN" | "SCHOOL"  ← SCHOOL ergänzen
  schoolId  String?                      // NEU: Mitgliedschaft (eine Schule pro Person)
  school    School?  @relation("SchoolMembers", fields: [schoolId], references: [id])
}
```

- **Eine Person = eine Schule** (nullable FK, kein Join-Table — bewusst schlank).
- Rolle `SCHOOL` = der Schul-Login (Koordinator/Lehrkraft). Ein SCHOOL-User ist
  ebenfalls `member` seiner eigenen Schule (gleiches `schoolId`), zählt aber
  **nicht** in die Schüler-Aggregation hinein (s. 3.3 — Ranking filtert auf
  `role = "USER"`).
- Migration: `npx prisma migrate dev --name schools_and_posts` (gegen `DIRECT_URL`).

### 3.2 Rollen-/Validator-Anpassungen

- `backend/src/middleware/adminOnly.ts`: unverändert (SCHOOL ist **kein** Admin).
- Neue Middleware `schoolOnly.ts`: erlaubt `role === "SCHOOL"` (für Schul-Dashboard-Routen).
- Überall wo `role` validiert wird (`admin.ts` `body('role').isIn([...])`):
  `['USER', 'ADMIN', 'SCHOOL']`.
- `src/types/index.ts`: `UserRole = 'USER' | 'ADMIN' | 'SCHOOL'`; `AuthUser` um
  `schoolId: string | null` ergänzen. Neuer Typ `School` + `SchoolLeaderboardEntry`.

### 3.3 Ranking-Logik (Best Practice: Größen-Bias vermeiden)

- **Primärsortierung: Ø-Punkte pro Mitglied** = `sum(member.points) / memberCount`.
- Mitzählen nur `role === "USER"` mit `schoolId === school.id` (Schüler:innen),
  **nicht** der SCHOOL-Koordinator-Account.
- **Mindestens 3 wertbare Mitglieder**, sonst „noch nicht gewertet" (im UI
  sichtbar, aber außerhalb der Rangfolge).
- Antwort enthält **beide** Metriken: `avgPoints`, `totalPoints`, `memberCount` —
  UI zeigt Rang nach Ø, listet Gesamtpunkte + Mitgliederzahl daneben.

### 3.4 Schul-Belohnungen

- Eigenes Schul-Tier-System, analog zu `src/data/rewards.ts` (das individuelle
  Tier-System **nicht** verändern). Neue Datei `src/data/schoolRewards.ts`
  (Header `// PROTOTYPE DATA —`) mit Schwellen auf Basis der **Schul-Gesamtpunkte**
  (totalPoints), z.B. 4–5 Stufen mit griechischen Namen analog zur bestehenden
  Tier-Benennung. Texte über i18n `schoolRewards.tiers.*`.
- Schul-Badges optional (Phase 2) — im Nightrun reicht die Stufen-Anzeige.

### 3.5 Backend-Endpunkte

Neue Route-Datei `backend/src/routes/schools.ts` + `controllers/schoolController.ts`,
in `index.ts` als `/api/schools` registrieren.

| Methode | Pfad | Auth | Zweck |
|---|---|---|---|
| `GET` | `/api/schools` | öffentlich | Liste aller Schulen (id, name, location, memberCount) |
| `GET` | `/api/schools/leaderboard` | öffentlich | Ranking (avgPoints desc, min 3 Mitglieder gewertet) |
| `GET` | `/api/schools/:id` | öffentlich | Schul-Detail inkl. aggregierter Punkte + Mitgliederzahl |
| `GET` | `/api/schools/me` | `SCHOOL` | Eigenes Schul-Dashboard (Mitglieder lesend, Rang, Stufe) |
| `POST` | `/api/schools/join` | `USER` | Beitritt per `{ code }` → setzt `schoolId` |
| `POST` | `/api/schools/leave` | `USER` | `schoolId = null` |
| `POST` | `/api/admin/schools` | `ADMIN` | Schule anlegen (+ optional SCHOOL-Login erzeugen) |
| `PUT` | `/api/admin/schools/:id` | `ADMIN` | Schule bearbeiten |
| `DELETE`| `/api/admin/schools/:id` | `ADMIN` | Schule löschen (Mitglieder `schoolId = null`) |

- Admin-Schul-Routen können auch in `routes/admin.ts` liegen — konsistent zur
  bestehenden Struktur halten.
- express-validator auf allen Routen (Pflicht). `code` trimmen + uppercasen.
- Beim Anlegen eines SCHOOL-Logins: bcrypt (min. 12 rounds), Passwort kommt aus
  dem Request-Body oder wird generiert und in der Response **einmalig** zurückgegeben.

### 3.6 Schul-Login-Umfang (Nightrun-Scope: schlank)

- SCHOOL-Account sieht **`/school` Dashboard**: Schulname, Beitritts-Code,
  Mitgliederliste (Name + Punkte, **lesend**), Gesamt-/Ø-Punkte, aktueller Rang,
  erreichte Belohnungsstufe + Fortschritt zur nächsten.
- **Kein** Entfernen von Mitgliedern / Code-Regenerierung im Nightrun
  (Follow-up — s. §8). Schulen + Logins legt der Admin an.

### 3.7 Frontend (Schulen)

- **Registrierung** (`RegisterPage.tsx`): wenn Profil = `STUDENT`, optionales Feld
  „Schul-Code" → nach erfolgreicher Registrierung `POST /schools/join`. Validierung
  freundlich (ungültiger Code = Hinweis, blockiert Registrierung nicht).
- **Profil-Seite** (`src/pages/user/ProfilePage.tsx`): Schule beitreten/verlassen.
- **Schulranking-Seite** `src/pages/SchoolRankingPage.tsx`, Route `/school-ranking`,
  öffentlich, in Nav verlinkt (`nav.schoolRanking`). Tabelle: Rang, Schule, Ø-Punkte,
  Gesamtpunkte, Mitglieder, Belohnungsstufe.
- **Schul-Dashboard** `src/pages/school/SchoolDashboardPage.tsx`, Route `/school`,
  geschützt via neue `<SchoolRoute>` (analog `AdminRoute`).
- **Admin** `src/pages/admin/ManageSchoolsPage.tsx`, Route `/admin/schools`,
  CRUD + „SCHOOL-Login erstellen". In `AdminDashboardPage` verlinken.
- Service `src/services/schoolService.ts` (keine `fetch()` in Komponenten!).
- Fallback-Daten `src/data/schools.ts` (Header `// PROTOTYPE DATA —`).
- Header-Dropdown (`UserMenu.tsx`): SCHOOL-Rolle bekommt „School Dashboard"-Link
  (analog zum Admin-Link, sichtbar wenn `user.role === 'SCHOOL'`).

---

## 4. Vorschlag 3 — Neuigkeiten / Blog-Feed

### 4.1 Datenmodell (`schema.prisma`)

```prisma
// type: "PROJECT_NEW" | "PROJECT_COMPLETED" | "ANNOUNCEMENT"
model Post {
  id         String   @id @default(cuid())
  type       String   @default("ANNOUNCEMENT")
  titleEn    String
  titleEl    String
  titleDe    String
  bodyEn     String
  bodyEl     String
  bodyDe     String
  imageUrl   String?
  published  Boolean  @default(true)
  projectId  String?                      // verknüpftes Projekt bei Auto-Posts
  project    Project? @relation(fields: [projectId], references: [id])
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

- `Project`-Model um `posts Post[]` Gegenrelation ergänzen.

### 4.2 Auto-Erzeugung (Hook in der Projekt-Logik)

In `backend/src/controllers/projectController.ts`:

- **`createProject`**: wenn finaler `status === 'OPEN'` → Auto-Post `type: 'PROJECT_NEW'`
  mit `projectId`, Titel/Body aus den Projektfeldern (Vorlage je Sprache, z.B.
  Titel = `"Neues Projekt: <projectTitle>"`, Body = Projektbeschreibung-Auszug).
  Bei `status === 'DRAFT'` **kein** Post (Rauschen vermeiden).
- **`updateProject`**: alten Status vor dem Update lesen; wenn Übergang
  `!= 'COMPLETED'` → `'COMPLETED'` → Auto-Post `type: 'PROJECT_COMPLETED'`.
  Wenn Übergang `'DRAFT'` → `'OPEN'` (Live-Schaltung) und noch kein PROJECT_NEW-Post
  existiert → PROJECT_NEW-Post.
- Idempotenz: pro (projectId, type) max. ein Auto-Post (vor dem Erstellen prüfen).
- Auto-Posts sind normale `Post`-Rows → Admin kann sie hinterher bearbeiten/löschen.
- Erstellung als Helper `createAutoPost(project, type)` in
  `controllers/postController.ts` oder `services/postService.ts`.

### 4.3 Dreisprachigkeit (DeepL)

- Vorhandene Anbindung wiederverwenden: `backend/src/services/translationService.ts`
  + `translationController.ts` (`POST /api/admin/translate`).
- Auto-Posts: Body/Titel in der Quellsprache erzeugen (Projekt hat bereits En/El/De —
  daraus direkt befüllen, **keine** zusätzliche Übersetzung nötig).
- Manuelle Posts: Admin tippt eine Sprache, „Übersetzen"-Button füllt die anderen
  zwei via bestehendem `/admin/translate` (analog zum Projekt-Formular).
- DeepL-Ausfall: graceful — leere Felder zulässig, Fehlermeldung, kein Crash.

### 4.4 Backend-Endpunkte

Neue `routes/posts.ts` + `controllers/postController.ts`, registriert als `/api/posts`.

| Methode | Pfad | Auth | Zweck |
|---|---|---|---|
| `GET` | `/api/posts` | öffentlich | Liste, `?type=`-Filter, `?limit=`, nur `published`, neueste zuerst |
| `GET` | `/api/posts/:id` | öffentlich | Einzel-Post |
| `POST` | `/api/posts` | `ADMIN` | Manueller Post (3-sprachig) |
| `PUT` | `/api/posts/:id` | `ADMIN` | Bearbeiten (auch Auto-Posts) |
| `DELETE`| `/api/posts/:id` | `ADMIN` | Löschen |

### 4.5 Frontend (News)

- **Startseite** (`src/pages/LandingPage.tsx`): neue Sektion „Neuigkeiten"
  (`landing.news.*`), zeigt die letzten 3–4 Posts **aus der API** (`postService`),
  Link „Alle Neuigkeiten" → `/news`. Bei leerem/fehlerhaftem API-Call: Fallback aus
  `src/data/posts.ts` (Header `// PROTOTYPE DATA —`).
- **News-Seite** `src/pages/NewsPage.tsx`, Route `/news`, öffentlich, in Nav
  (`nav.news`). Liste mit Typ-Filter (Alle / Neu / Abgeschlossen / Ankündigung),
  Karten mit Datum, Typ-Badge, Titel, Auszug; Klick → optional Detailansicht oder
  Aufklappen.
- **Admin** `src/pages/admin/ManagePostsPage.tsx`, Route `/admin/posts`, CRUD +
  „Übersetzen"-Button. In `AdminDashboardPage` verlinken.
- Service `src/services/postService.ts`. Typ `Post` in `src/types/index.ts`.

---

## 5. i18n (EN / EL / DE — alle drei `translation.json`)

Neue Top-Level-Abschnitte (Schlüssel in allen drei Dateien, EN als Fallback):

- `nav.news`, `nav.schoolRanking`, `nav.schoolDashboard`
- `news.*` (Seitentitel, Filter-Labels, Typ-Badges, leerer Zustand)
- `landing.news.*` (Sektions-Heading, „Alle Neuigkeiten")
- `schools.*` (Beitritt, Code-Feld, Ranking-Spalten, Dashboard-Labels, leerer Zustand)
- `schoolRewards.tiers.*` (Stufennamen/Beschreibungen)
- `admin.schools.*`, `admin.posts.*` (Formular-Labels, Buttons)
- EL/DE müssen vollständig befüllt sein (keine englischen Platzhalter) — bei Unsicherheit
  DeepL/`ux-agent`-Stil nutzen, Civic-Ton.

---

## 6. Vorschlag 1 — optionale Mini-Erweiterung

`UserMenu.tsx` ist fertig. **Optional** (nur wenn ohne Risiko): Profil-Rolle als
kleines Text-Badge unter dem Namen im Dropdown (`profiles.<id>.label`, ohne Emoji).
SCHOOL-Rolle: zusätzlicher „School Dashboard"-Link (s. 3.7). Kein Muss.

---

## 7. Seed-Daten (`backend/prisma/seed.ts`)

- 2–3 Schulen anlegen (upsert über `code`), z.B. „1ο Γυμνάσιο Κέρκυρας",
  „Lefkimmi High School", „Gymnasium Acharavi".
- Je Schule 3–6 Schüler-User (`role: 'USER'`, `profile: 'STUDENT'`, `schoolId`,
  variierende `points`) — damit Ranking + Ø-Berechnung sichtbar wird.
- Je 1 SCHOOL-Login pro Schule (`role: 'SCHOOL'`, eigenes `schoolId`), z.B.
  `school1@zoe-corfu.gr` / Passwort dokumentieren im Seed-Header.
- 4–6 `Post`-Einträge: je Typ mindestens einer (PROJECT_NEW, PROJECT_COMPLETED,
  ANNOUNCEMENT), `projectId` wo passend, dreisprachig.
- Idempotent (upsert), Header `// PROTOTYPE SEED DATA —` bleibt.

---

## 8. Bewusst NICHT im Nightrun (Follow-ups)

- Schul-Selbstverwaltung (Mitglieder entfernen, Code regenerieren, Schulprofil
  bearbeiten durch SCHOOL-Account).
- Schul-Badges (über reine Stufen-Anzeige hinaus).
- Post-Detailseite mit eigener Route `/news/:id` (falls nur Aufklappen umgesetzt).
- E-Mail-Benachrichtigungen.

---

## 9. Akzeptanzkriterien (Definition of Done)

- [ ] `npx prisma migrate dev` läuft sauber durch; `prisma generate` ok.
- [ ] Seed erzeugt Schulen, Schüler, SCHOOL-Logins, Posts — idempotent.
- [ ] Emoji im Registrierungs-Dropdown entfernt, Text 3-sprachig.
- [ ] Schüler kann per Code beitreten/verlassen (Profil + Registrierung).
- [ ] `/school-ranking` zeigt Ranking nach Ø-Punkten, min-3-Regel greift, Gesamt+Ø+Mitglieder sichtbar.
- [ ] SCHOOL-Login sieht `/school` Dashboard (Mitglieder lesend, Rang, Stufe).
- [ ] Admin kann Schulen CRUD + SCHOOL-Login erzeugen (`/admin/schools`).
- [ ] Projekt veröffentlichen (→OPEN) erzeugt PROJECT_NEW-Post; Abschluss (→COMPLETED) erzeugt PROJECT_COMPLETED-Post; keine Doppel-Posts; kein Post bei DRAFT.
- [ ] Admin kann Posts CRUD + dreisprachig übersetzen (`/admin/posts`).
- [ ] Startseite zeigt Neuigkeiten-Sektion (API); `/news` mit Typ-Filter.
- [ ] Alle neuen Texte EN/EL/DE; kein hardcodierter JSX-Text; `any`-frei.
- [ ] `PrototypeBanner` auf allen neuen Seiten; WCAG (Tastatur, Kontrast, aria-labels, Touch ≥44px); Dark Mode korrekt.
- [ ] Vitest grün; neue Tests für Ranking-Aggregation + Auto-Post-Hook.
- [ ] Docs aktualisiert: `docs/api.md` (neue Endpunkte), `docs/architecture.md`
      (Routen + Schema + ADR Schulmodell), `docs/admin-guide.md`, `docs/user-guide.md`.
- [ ] Branch `feature/schools-and-news` (nicht direkt auf `main`).

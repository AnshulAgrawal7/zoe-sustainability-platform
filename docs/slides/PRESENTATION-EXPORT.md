# ZOE — Präsentations-Export (Phase 3 & 4)

> **Zweck:** Faktentreue Sammlung des **aktuellen** Repo-Stands für die externe
> Folienerstellung (Phase 3 Design / Phase 4 Development + Demonstration).
> Keine Code-Änderung — nur dieses Dokument.
> **Stand:** 2026-06-10 (commit `64c530d` + danach). Gemeinde Nord-Korfu, FAU
> Projektseminar WInf SoSe 2026, Gruppe 1. Präsentation: 15.–17. Juni 2026.
>
> **Quellenhierarchie für dieses Dokument:** Der tatsächliche Stand ergibt sich
> aus dem **Code** (`src/app/Router.tsx`, `src/components/layout/Header.tsx`,
> `backend/src/app.ts`, `backend/prisma/seed.ts`, `src/data/*`). Wo `docs/`
> davon abweicht, ist der Code maßgeblich und die Abweichung ist vermerkt.
> ⚠️ **`docs/architecture.md` ist veraltet** (listet entfernte Routen wie
> `/school-ranking`, `/roadmap`, `/admin/schools`) — siehe §9.

---

## 1. Aktueller Funktions-/Routenstand

### 1.1 Frontend-Routen (Stand jetzt, aus `src/app/Router.tsx`)

**Öffentlich (kein Login):**

| Route | Komponente | Funktion (eine Zeile) |
|---|---|---|
| `/` | `LandingPage` | Startseite: Hero, Impact-Kennzahlen, Einstieg in Projekte/Teilnahme |
| `/about` | `AboutPage` | Was ist ZOE: breite Programm-Definition, Korfu-Kontext, Partner, Disambiguierungs-Hinweis |
| `/projects` | `ProjectsPage` | Projektübersicht als Karten-Grid mit Kategorie-Filter + SDG-Badges (filtert aktuell fix `status: OPEN`) |
| `/projects/:id` | `ProjectDetailPage` | Projekt-Detailseite: Problem, erwartete Wirkung, SDGs, Beteiligungswege, Quelle (`sourceNote`) |
| `/sdg-dashboard` | `SDGDashboardPage` | SDG-Dashboard: offizielle UN-SDG-Icons je Ziel, beitragende Projekte, Fortschritt, Link zur UN-Seite |
| `/participate` | `ParticipationPage` | Niedrigschwellige Beteiligung ohne Account; Ideen-Einreichformular (persistiert), 5 Optionen, Event-Teaser |
| `/get-involved` | `GetInvolvedPage` | „Mitmachen"-Übersicht: Initiative-Tabs, gruppiert Aktionen (auch abgeschlossene) nach ZOE-Initiative |
| `/audiences` | `AudiencesPage` | Zielgruppen-/Multi-Audience-Seite (Einwohner, Touristen, Schüler, Wissenschaft) — nicht in Hauptnav verlinkt |
| `/events` | `EventsPage` | Veranstaltungsliste + Gast-RSVP-Registrierung (persistiert über `EventRegistration`) |
| `/transparency` | `TransparencyPage` | Transparenz-/KPI-Seite: Kennzahl-Grid + Fortschrittstabelle (Prototyp-Werte gekennzeichnet) |
| `/rewards` | `RewardsPage` | Belohnungs-/Gamification-Erklärung: Stufen, Badges, wie man Punkte verdient |
| `/news` | `NewsPage` | News-/Blog-Feed (Posts aus Backend: Announcement / Project-New / Project-Completed) |
| `/accessibility` | `AccessibilityPage` | Barrierefreiheits-Erklärung (WCAG 2.1 AA, EU 2016/2102), bekannte Einschränkungen |
| `/privacy` | `PrivacyPage` | Datenschutzerklärung (Prototyp: keine echten personenbezogenen Daten) |
| `/imprint` | `ImprintPage` | Impressum (akademischer Prototyp; Angaben sind Platzhalter) |
| `/login` | `LoginPage` | Anmeldung |
| `/register` | `RegisterPage` | Registrierung |

**Geschützt — USER (`<ProtectedRoute>`):**

| Route | Komponente | Funktion |
|---|---|---|
| `/dashboard` | `DashboardPage` | Persönliches Dashboard: Punkte, Badges, eigene Teilnahmen |
| `/profile` | `ProfilePage` | Profil bearbeiten (Name, Sprache, Profiltyp) |
| `/my-rewards` | `UserRewardsPage` | Eigene Belohnungen/Badges + Fortschritt zur nächsten Stufe |

**Geschützt — ADMIN (`<AdminRoute>`):**

| Route | Komponente | Funktion |
|---|---|---|
| `/admin` | `AdminDashboardPage` | Admin-Übersicht/Statistiken |
| `/admin/projects` | `ManageProjectsPage` | Projekte verwalten (Liste, Status) |
| `/admin/projects/new` | `NewProjectPage` | Neues Projekt anlegen (inkl. DeepL-Auto-Übersetzung) |
| `/admin/projects/:id/edit` | `EditProjectPage` | Projekt bearbeiten |
| `/admin/users` | `ManageUsersPage` | Nutzer verwalten, Rollen ändern |
| `/admin/ideas` | `ManageIdeasPage` | Eingereichte Bürger-Ideen sichten + Status setzen (NEW→…→ACCEPTED), mailto-Antwortlink |
| `/admin/posts` | `ManagePostsPage` | News-/Blog-Posts verwalten |

> **Hinweis zur Navigation:** `/participate` und `/audiences` existieren als Routen,
> erscheinen aber **nicht** in der Haupt-Navigationsleiste (sie werden aus anderen
> Seiten heraus verlinkt). Es gibt **keine** Routen mehr für Schulen/`/roadmap`/
> `/school-ranking` (entfernt; siehe Memory „Schools & News Feature").

### 1.2 Finale Navigationsstruktur (aus `src/components/layout/Header.tsx`)

Schlanke Leiste mit **2 Dropdowns + 2 Solo-Links**, dazu Logo, Sprach-/Theme-Umschalter und Auth-Bereich.

```
Logo: ΖΩΗ (Leaf-Icon) → /

Dropdown „Discover" (nav.discover)
  ├── Projects        → /projects
  ├── SDGs            → /sdg-dashboard
  ├── Events          → /events
  └── News            → /news

Dropdown „Participate" (nav.participate)
  ├── Overview        → /get-involved
  └── Rewards         → /rewards

Solo-Link  Transparency → /transparency
Solo-Link  About        → /about

Rechts: Sprachumschalter (EN/EL/DE, Flaggen) · Dark-Mode-Toggle ·
        [nicht eingeloggt] Login + Register
        [eingeloggt]       UserMenu (Dashboard, My Rewards, Profile, [Admin], Logout)
```

Die mobile Navigation (< lg) spiegelt dieselbe Struktur (Dropdown-Gruppen als
Abschnitte + Solo-Links + Sprache/Theme + Auth-Block).

### 1.3 Ziel → Feature → Route (Z1–Z6, Stand jetzt)

| Ziel | Konkretes Feature | Route(n) | Status |
|---|---|---|---|
| **Z1 — Zentrale & transparente Information** | Projektübersicht (Filter, Karten), Projekt-Detailseite mit Quelle/`sourceNote`, Transparenz-/KPI-Seite | `/projects`, `/projects/:id`, `/transparency` | **gebaut** (⚠️ `ProjectsPage` filtert fix `OPEN`; abgeschlossene Aktionen nur auf `/get-involved` → **teilweise**) |
| **Z2 — SDG-Beiträge sichtbar machen** | SDG-Dashboard mit **offiziellen UN-SDG-Icons**, SDG-Badges an Projekten, Link zur UN-Zielseite; Programm-SDGs {4,6,11,12,13,14,15,17} | `/sdg-dashboard`, Badges auf `/projects` u. `/projects/:id` | **gebaut** (UN-Icons unter `public/sdg-icons/`; Fortschritts-Werte illustrativ/gekennzeichnet) |
| **Z3 — Bürgerpartizipation & Community** | Ideen-Einreichung **ohne Pflicht-Account** (persistiert), Gast-Event-RSVP (persistiert), Admin-Review der Ideen | `/participate` (IdeaSubmitForm), `/get-involved`, `/events`, Admin: `/admin/ideas` | **gebaut** (Ideen + Event-RSVP backend-persistiert; Rückkopplungsschleife im Admin) |
| **Z4 — Motivation/Gamification** | Punkte/Badges/Stufen als Anerkennung; Belohnungs-Erklärseite; persönliche Belohnungen | `/rewards`, `/my-rewards`, `/dashboard` | **teilweise** (Punkte/Badges für eingeloggte Nutzer vorhanden u. geseedet; Punkte aus *freier* Einreichung werden nicht einem Konto gutgeschrieben — Gast-Pfad bewusst ohne Punkte) |
| **Z5 — Umweltbewusstsein & lokale Identität** | Lokal verortete Inhalte (Antinioti-Lagune, Erimitis, Natura 2000, Nymfes, Agios Panteleimon); Umweltbildungs-/Uni-Projekt | `/projects`, `/projects/:id`, `/about` | **gebaut** (Inhalte); **Schul-/Jugendformat = Future Work** (Schulfeature entfernt) |
| **Z6 — Zielgruppen inklusiv erreichen** | Dreisprachigkeit EN/EL/DE (alle Labels via `t()`), Sprachumschalter, WCAG-2.1-AA-Setup, Dark Mode, Accessibility-Seite | global; `/accessibility` | **gebaut** (i18n durchgängig; ⚠️ einzelne Beteiligungs-Optionstexte noch EN-only, siehe Accessibility-Seite) |

---

## 2. Echte Inhaltsdaten für die Folien

### 2.1 Reale Projekte (aus `backend/prisma/seed.ts` & `src/data/projects.ts`)

Acht Maßnahmen, mind. eine je dokumentierter ZOE-Achse. Titel sind dreisprachig
(DE/EN/EL); Kategorie-Taxonomie (5 Werte): MOBILITY · COMMUNITY · ENVIRONMENT ·
EDUCATION (im Seed) — `src/data` nutzt dieselben `proj-*`-IDs.

| ID | Titel EN | Titel DE | Kategorie | SDGs | Status | `sourceNote` |
|---|---|---|---|---|---|---|
| `proj-greenmove` | GreenMove — Sustainable Mobility | GreenMove — Nachhaltige Mobilität | MOBILITY | 11, 13 | OPEN/Active | Verde.tec 2026 / life-news.gr |
| `proj-circular` | Circular Economy Network | Kreislaufwirtschafts-Netzwerk | COMMUNITY | 12, 11, 4 | OPEN/Active | Attica Green Expo 2026 / kerkyrasimera.gr (Ausschleusung); Verde.tec 2026 (Ströme, Punkte, Reinheit, Bildung) |
| `proj-marine` | Marine Protection & Sea Turtles | Meeresschutz & Meeresschildkröten | ENVIRONMENT | 14, 15 | OPEN/Active | Corfu TV News, 31.07.2025 (ODEK/ARCHELON); Corfu Stories, 15.04.2026 (Schildkröten-Sterben) |
| `proj-antinioti` | Antinioti Lagoon — Natural Monument | Antinioti-Lagune — Naturdenkmal | ENVIRONMENT | 15, 6, 14 | OPEN/Active | Verde.tec 2026 / life-news.gr |
| `proj-natural-monuments` | Natural Monuments & Reforestation | Naturdenkmäler & Aufforstung | ENVIRONMENT | 15, 13 | OPEN/Active | Verde.tec 2026 / life-news.gr |
| `proj-led` | LED Street Lighting Upgrade | Umrüstung der Straßenbeleuchtung auf LED | COMMUNITY | 12, 13 | **COMPLETED** | Verde.tec 2026 / life-news.gr |
| `proj-education` | Environmental Education & University Partnership | Umweltbildung & Universitätspartnerschaft | EDUCATION | 4, 17 | OPEN/Active | Verde.tec 2026 / life-news.gr |
| `proj-water-quality` | Drinking Water Quality Monitoring | Trinkwasserqualitäts-Monitoring | ENVIRONMENT | 6, 11 | OPEN/Active | Verde.tec 2026 / life-news.gr |

Titel EL (für Folien, falls benötigt): GreenMove — Βιώσιμη Κινητικότητα ·
Δίκτυο Κυκλικής Οικονομίας · Προστασία Θάλασσας & Θαλάσσιες Χελώνες ·
Λιμνοθάλασσα Αντινιώτη — Φυσικό Μνημείο · Φυσικά Μνημεία & Αναδάσωση ·
Αναβάθμιση Δημοτικού Φωτισμού σε LED · Περιβαλλοντική Εκπαίδευση &
Πανεπιστημιακή Συνεργασία · Παρακολούθηση Ποιότητας Πόσιμου Νερού.

> **Wichtig (Demonstration ≠ Evaluation):** Alle Fakten/Zahlen sind **kommunale
> Programmangaben**, keine ZOE-Wirkungsmessung (Impact = Phase 5). `progressPercent`
> und `participantCount` in `src/data/projects.ts` sind **illustrative**
> Prototyp-Statusindikatoren, keine gemessenen Werte. SDGs ausschließlich aus dem
> offiziellen Programm-Set {4, 6, 11, 12, 13, 14, 15, 17}.

### 2.2 Events

**Teils echte Entität:** Es gibt **keine** Backend-Tabelle für Event-*Definitionen*;
die Eventliste ist Prototyp-Frontend-Fallback (`src/data/events.ts`, 10 fiktive
Events mit illustrativen Daten 2025). **Persistiert** ist hingegen die
**Registrierung/RSVP**: Backend-Modell `EventRegistration` + Endpoint
`POST /api/events/:eventId/register` (Gast oder eingeloggt) und
`GET /api/events/:eventId/count`. Anmeldungen werden also gespeichert, die
Events selbst sind Prototyp-Daten.

⚠️ Die `projectId`-Verweise in `src/data/events.ts` (z. B. `clean-coastline`,
`korisia-wetlands`, `green-schools`) entsprechen **nicht** den realen `proj-*`-IDs
aus §2.1 — Altbestand/Platzhalter, vor Folien-Nutzung beachten.

→ Für die Folien als **„Events: RSVP-Mechanik gebaut (persistiert); Event-Inhalte =
Prototyp/Future Work"** vermerken.

### 2.3 Belegte Kennzahlen mit Quelle (aus den Projektdaten)

| Kennzahl | Wert | Projekt | Quelle (`sourceNote`) |
|---|---|---|---|
| Restmüll aus Deponierung ausgeschleust (2025) | **2.682,699 t = 15,08 % von 17.787 t** | `proj-circular` | Attica Green Expo 2026 / kerkyrasimera.gr |
| Recycling-Ströme | **20 Ströme** | `proj-circular` | Verde.tec 2026 |
| Sammelpunkte | **210 Punkte** | `proj-circular` | Verde.tec 2026 |
| Sortenreinheit | **bis zu 95 %** (separate Prozessgröße) | `proj-circular` | Verde.tec 2026 |
| Erreichte Schüler:innen | **2.000+** | `proj-circular` | Verde.tec 2026 |
| Forum der Kreislauf-Kommunen | Gastgeber **Feb. 2025** | `proj-circular` | Verde.tec 2026 |
| Auf LED umgerüstete Leuchten | **4.866 Leuchten** | `proj-led` | Verde.tec 2026 / life-news.gr |
| Tote Meeresschildkröten Q1 2026 (Handlungsbedarf) | **17** (parl. Anfrage) | `proj-marine` | Corfu Stories, 15.04.2026 |
| ODEK gegründet | **24.05.2025**; Kooperation ARCHELON | `proj-marine` | Corfu TV News, 31.07.2025 |
| Programm-Umfang | **31 Maßnahmen über 6 Achsen** | (Programm gesamt) | Verde.tec 2026 / life-news.gr |

> ⚠️ **Nicht** mit den fiktiven Landing-/Transparency-Kennzahlen aus
> `src/data/metrics.ts` verwechseln (z. B. „4.963 citizens engaged", „65.5 t waste
> diverted", „870 students" — diese sind **illustrative Prototyp-Werte**, explizit
> als fiktiv gekennzeichnet, **keine** belegten Zahlen).

---

## 3. Tech-Stack (Architektur-Folie)

Tatsächlich verwendet, aus `package.json` (Frontend, Root) und
`backend/package.json`.

### 3.1 Frontend

| Aspekt | Paket / Technologie |
|---|---|
| Framework | React 19 (`react`, `react-dom` ^19.2) |
| Sprache | TypeScript ~6.0 (strict) |
| Build/Dev | Vite ^8.0 (`@vitejs/plugin-react`) |
| Styling | Tailwind CSS ^3.4 (+ `autoprefixer`, `postcss`, `prettier-plugin-tailwindcss`) |
| Routing | React Router DOM ^7.15 |
| State | Zustand ^5.0 (auth, theme, language) |
| i18n | i18next ^26 + react-i18next ^17 (EN/EL/DE) |
| Validierung | Zod ^4.4 |
| Icons | lucide-react ^1.16 |
| Data-Fetching | **Kein React Query** — eigener `fetch`-Wrapper in `src/services/api.ts` (Access-Token in Memory, Refresh-Cookie via `credentials: 'include'`); alle Calls über `services/` |
| Unit-Tests | Vitest ^4.1 + React Testing Library + jest-axe (10 Test-Dateien in `src/__tests__/`) |
| E2E-Tests | Playwright ^1.60 (7 Specs in `e2e/`) |

### 3.2 Backend

| Aspekt | Paket / Technologie |
|---|---|
| Runtime | Node.js (TypeScript ^5.7, `ts-node`/`ts-node-dev`) |
| Framework | Express ^4.21 |
| ORM | Prisma ^5.22 (`@prisma/client`) |
| DB | SQLite (Dev); PostgreSQL für Prod vorgesehen |
| Auth | JWT (`jsonwebtoken` ^9), Access 15 min (Bearer) + Refresh 7 d (httpOnly Cookie via `cookie-parser`), Passwörter `bcryptjs` (12 rounds) |
| Validierung | express-validator ^7.2 |
| Rate-Limiting | express-rate-limit ^7.4 (Auth-, Ideen-, Event-Routen) |
| Security-Header | helmet ^8, CORS ^2.8 |
| Tests | Vitest ^2.1 + supertest (7 Test-Dateien in `backend/src/`) |

### 3.3 Tooling & Querschnitt

| Aspekt | Technologie |
|---|---|
| Lint | ESLint ^10 + typescript-eslint + react-hooks/react-refresh-Plugins |
| Format | Prettier ^3.8 (+ Tailwind-Plugin) |
| Git-Hooks | Husky ^9 + lint-staged ^17 (eslint --fix + prettier on commit) |
| CI | ⚠️ **nicht vorhanden** — kein `.github/workflows/` im Repo |

### 3.4 Prototyp / Future Work (Architektur-Folie)

| Feature | Status |
|---|---|
| **DeepL-Auto-Übersetzung** (Admin: `POST /api/admin/translate`) | **gebaut**, key-getrieben (`DEEPL_API_KEY` nur in `.env`, Free/Pro auto-erkannt). Ohne Key inaktiv. |
| **Analytics** (`src/services/analytics.ts`) | **Standardmäßig deaktiviert** (no-op); cookieless Plausible/Umami nur bei gesetzten Env-Vars → Future/Operator-Konfiguration |
| **Karte / Geo-Visualisierung** | ⚠️ **nicht vorhanden** (kein Map-Paket) → Future Work |
| **E-Mail/SMTP** (Verifizierung, Newsletter-Versand) | **nicht implementiert** → Future Work (Admin-Antwort via `mailto:`-Link) |
| Persistente Gamification aus freier Einreichung | bewusst nicht umgesetzt → Future Work |

### 3.5 Architektur-Beschreibung (für ein Diagramm)

```
┌──────────────────────────────────────────────────────────────┐
│  CLIENT — React 19 SPA (Vite-Build, TypeScript strict)         │
│  Pages → Components(ui/layout/auth) → Hooks → Zustand Stores    │
│  Querschnitt: i18n (EN/EL/DE), Dark Mode, WCAG 2.1 AA           │
│  Daten NUR über services/ (api.ts fetch-Wrapper) ──┐            │
│  Fallback-Prototyp-Daten in src/data/ ─────────────┤           │
└────────────────────────────────────────────────────┼──────────┘
                                                      │ HTTPS / REST
                         Access-Token (Bearer, Memory)│ + Refresh-Cookie (httpOnly)
                                                      ▼
┌──────────────────────────────────────────────────────────────┐
│  API — Express (REST, /api/*)                                  │
│  Middleware: helmet · CORS · rate-limit · auth(JWT) · adminOnly │
│              · express-validator                                │
│  routes → controllers → services                               │
│  Response-Format: { success, data } / { success, error }        │
└───────────────────────────┬──────────────────────────────────┘
                            │ Prisma ORM
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  DB — SQLite (Dev) / PostgreSQL (Prod)                         │
│  User · Project · Post · Participation · EventRegistration ·   │
│  Idea · Badge · UserBadge · RefreshToken                       │
└──────────────────────────────────────────────────────────────┘
   Extern (optional): DeepL-API (Übersetzung) · cookieless Analytics
```

Drei Schichten (FE → REST-API → BE → DB) mit Querschnittsfunktionen
**Auth** (JWT zweistufig), **i18n** (3 Sprachen) und **Tests** (Vitest/Playwright)
über alle Ebenen. Sicherheit: Token im Speicher statt localStorage, Refresh nur
als httpOnly-Cookie, Rate-Limiting auf öffentlich offenen Routen (Auth/Ideen/Events).

---

## 4. Designprinzip-Matrix (Phase 3) — vollständiger Inhalt von `docs/design-principles-Z1-Z6.md`

| Ziel | Problem | Designprinzip(ien) | Beleg (Kernel-Theorie) |
|---|---|---|---|
| **Z1 — Zentrale & transparente Information** | Umweltaktionen der Gemeinde sind verstreut/unsichtbar; geringe institutionelle Sichtbarkeit und Rechenschaft. Ziel: ein zentraler, verständlicher, transparenter Ort für alle ZOE-Aktionen. | **DP1a:** Bündele alle Aktionen in einer zentralen, gefilterten Übersicht mit Detailtiefe (Progressive Disclosure) und sichtbarer Provenienz/Quelle. **DP1b:** Mache Programmstatus & Kennzahlen sichtbar (Transparenz-/KPI-Ansicht). | Lourenço (2023); Grimmelikhuijsen & Welch (2012); Simelió et al. (2021). *„Close the loop"/Accountability (Fung): **Quelle fehlt – bitte ergänzen**.* |
| **Z2 — SDG-Beiträge sichtbar machen** | Lokale Aktionen werden nicht mit globalen Zielen verknüpft; SDGs sind für Laien abstrakt. Ziel: SDG-Beitrag je Aktion sichtbar; offizielle UN-Bildsprache. | **DP2a:** Verknüpfe jede Aktion mit den offiziellen Programm-SDGs {4,6,11,12,13,14,15,17} und visualisiere sie mit den **offiziellen UN-Icons** + Link zur UN-Seite. **DP2b:** SDG-Dashboard, das beitragende Aktionen je Ziel bündelt. | United Nations (2015); Clement et al. (2023); Leite et al. (2026); Jain & Espey (2022). |
| **Z3 — Bürgerpartizipation & Community** | Hohe Beteiligungshürden; Beteiligung hängt an persönlichen Netzwerken; eingereichte Ideen versanden. Ziel: niedrigschwellige Beteiligung (auch ohne Account) mit sichtbarer Bearbeitung. | **DP3a:** Ermögliche Einreichung/Teilnahme **ohne Pflicht-Account**, mit optionaler Identität. **DP3b:** Schließe die Rückkopplungsschleife (Status NEW→…→ACCEPTED, Sichtbarkeit im Admin-Backend). | Saldivar et al. (⚠️ Jahr prüfen); Arana-Catania et al. (2021); Shin et al. (2024); Mariani et al. (2025). |
| **Z4 — Motivation/Gamification** | Reine Belohnung kann intrinsische Motivation verdrängen; kompetitives Ranking unter Nachbarn erzeugt soziale Reibung. Ziel: langfristiges Engagement ohne Untergrabung intrinsischer Motivation. | **DP4a:** Setze Punkte/Badges/Stufen als **Anerkennung** (Kompetenz/Verbundenheit), nicht als reines Belohnungsranking. **DP4b:** Belohnung optional (Gast ohne Punkte) — der Account ist Mehrwert, keine Pflicht. | Ryan & Deci (2000); Sailer et al. (2017); Mekler et al. (2017); Hamari et al. (2014); Krath et al. (2021); Thiel et al. (2016). *Gamification-Definition (Deterding et al. 2011): **Quelle fehlt – bitte ergänzen**.* |
| **Z5 — Umweltbewusstsein & lokale Identität** | Bewusstsein und Bindung an die lokale Natur fehlen; Wissen wird nicht systematisch vermittelt. Ziel: Umweltbewusstsein und lokale Identifikation stärken. | **DP5a:** Lokal verortete Inhalte (Antinioti, Erimitis, Natura 2000) statt abstrakter Botschaften. **DP5b:** Junge Zielgruppen/Schulen über Bildungs-/Beteiligungsformate einbinden. | Vare et al. (2025); Peacock et al. (2018); Laksmi (2026); Vegas Macías et al. (2023). *Sozialkapital/lokale Identität (Putnam): **Quelle fehlt – bitte ergänzen**.* |
| **Z6 — Zielgruppen inklusiv erreichen** | Sprach- und Zugangsbarrieren (EL/EN/DE, Tourismus); Barrierefreiheit ist für öffentliche Stellen gesetzlich verpflichtend. Ziel: alle erreichen — Mehrsprachigkeit DE/EN/EL, WCAG 2.1 AA, niedrige Hürden, kostenfrei. | **DP6a:** Dreisprachigkeit (EN/EL/DE) als First-Class, alle Inhalte/Labels über `t()`. **DP6b:** Barrierearme, WCAG-2.1-konforme, kostenfreie, account-optionale Nutzung. | **DP6a (Mehrsprachigkeit als Inklusion/Partizipation):** Shin et al. (2024); *präziser Beleg fehlt – bitte ergänzen* — WCAG 2.1 / Richtlinie (EU) 2016/2102 belegen **Barrierefreiheit, nicht Mehrsprachigkeit**. **DP6b (Barrierefreiheit):** Csontos et al. (2021, 2025); Pontus (2021, mehrsprachige Barrierefreiheit); Asghari (2023); Chirumavilla et al. (2025); Nielsen & Molich (1990). |

**Offene Belege („Quelle fehlt – bitte ergänzen"):** Fung (Accountability/Loop, Z1),
Deterding et al. 2011 (Gamification-Definition, Z4), Putnam (Sozialkapital, Z5) —
stammen aus der themenorientierten Alt-Matrix, **nicht** im PDF-Korpus; vor finaler
Abgabe beschaffen oder durch Korpus-Quellen ersetzen. **Z6/Mehrsprachigkeit:** DP6a
als Inklusions-/Partizipationsmaßnahme zu belegen (nächstbester Korpus-Beleg: Shin
et al. 2024), **nicht** mit WCAG/Richtlinie. **Z↔TP-Mapping:** Z1→TP1/TP3 · Z2→TP3 ·
Z3→TP2/TP6 · Z4→TP2 (DP2b) · Z5→TP4 · Z6→TP4. **A/B-Klassifikation** (gemessener
Effekt [A] vs. Rahmenwerk [B]) in `literature-review.md`.

---

## 5. Vergleichbare kommunale Lösungen (Phase 3, Rigor-Anker) — aus `docs/MATRIX.md`

Einordnung als **Improvement/Exaptation** etablierter Designs in den Kontext
Nord-Korfu (Gregor & Hevner 2013 [B]). Alle Quellen liegen im Korpus vor.

| Referenz | Was übertragbar ist | Zahlt ein auf (Z1–Z6) | Quelle (Typ) |
|---|---|---|---|
| **Decide Madrid / Consul** (>100 Institutionen, 33 Länder) | Niedrigschwellige Vorschlags-/Beteiligungsformate; Transparenz & Feedback als Erfolgsfaktor; Info-Overload als Barriere | **Z3** (Partizipation), **Z1** (Transparenz/Info) | Arana-Catania 2021 **[A]**, Royo 2020 **[A]**, Royo 2024 **[A]**, Pina 2024 **[A]** |
| **We Asked, You Said, We Did** (Schottland) | „Close the loop": Rückmeldung sichtbar machen | **Z1** (Transparenz), **Z3** (Partizipation) | Royo 2024 **[A]** |
| **Marsaxlokk** (Malta, Fischerdorf) | Besucher:innen/Tourismus + maritime Heritage digital einbinden | **Z6** (Zielgruppen/Touristen), **Z5** (lokale Identität), **Z3** | Vegas Macias 2023 **[A]** |
| **Bali** (60 Destinationen) | Community-Partizipation + Digitalstrategie wirken messbar auf Nachhaltigkeit | **Z3** (Community), **Z2** (SDG/Nachhaltigkeit), **Z5** | Laksmi 2026 **[A]** |
| **Spanische / ungarische / griechische Kommunen** | Verbreitete Defizite (Transparenz, WCAG, UX) belegen Relevanz | **Z1** (Transparenz), **Z6** (Barrierefreiheit/inklusiv) | Simelio 2021 **[A]**, Csontos 2021/2025 **[A]**, Tsatsani 2024 **[A]**, Carayannis 2026 **[A]** |

**Gregor-&-Hevner-2013-Einordnung:** Das Artefakt ist **Improvement/Exaptation** —
bekannte E-Partizipations-/Transparenz-/SDG-Designs (Decide Madrid/Consul,
„We Asked, You Said, We Did", Marsaxlokk, Bali) werden auf den konkreten,
bislang nicht digital abgedeckten Kontext einer kleinen Mittelmeer-Inselgemeinde
(Nord-Korfu, dreisprachig, saisonaler Tourismus) übertragen und kombiniert.

---

## 6. ZOE-Definition (Inhalts-Folie)

**Breite Definition (finaler Wortlaut, AboutPage `about.whatP1`, EN):**

> „ZOE is the Municipality of Northern Corfu's environmental **umbrella programme**.
> It coordinates **31 distinct measures across six axes** — mobility, waste & circular
> economy, marine protection, natural monuments, energy, and education & participation —
> adapted to the ecological and social context of Northern Corfu. (Programme description:
> Verde.tec 2026.)"

**DE (`about.whatP1`):**

> „ZOE ist das **Umwelt-Dachprogramm** der Gemeinde Nord-Korfu. Es koordiniert
> **31 einzelne Maßnahmen über sechs Achsen** — Mobilität, Abfall & Kreislaufwirtschaft,
> Meeresschutz, Naturdenkmäler, Energie sowie Bildung & Partizipation —, zugeschnitten
> auf den ökologischen und sozialen Kontext Nord-Korfus. (Programmbeschreibung:
> Verde.tec 2026.)"

Ergänzend (`whatP2`/`whatP3`): Das Programm fußt auf den **UN-SDGs** und den
Prinzipien des **European Green Deal**; Kern ist die Überzeugung, dass Umweltschutz
ohne echte **Bürgerbeteiligung** und **radikale Transparenz** nicht gelingt — beides
soll diese Plattform ermöglichen.

**Disambiguierungs-Hinweis (finaler Wortlaut, `about.definitionNote`, EN):**

> „A note on the name: of the wider programme, only the marine-life protection strand
> is formally documented in a **municipal council decision (30 July 2025)**. A
> consolidated official definition of ZOE as a whole is **not publicly available**.
> This platform uses the **broad reading** — the umbrella programme described above —
> and exists in part to close exactly that visibility gap."

**DE (`about.definitionNote`):**

> „Hinweis zum Namen: Vom Gesamtprogramm ist nur der Bereich Meeresschutz formal in
> einem **Gemeinderatsbeschluss dokumentiert (30. Juli 2025)**. Eine konsolidierte
> offizielle Gesamtdefinition von ZOE liegt öffentlich **nicht** vor. Diese Plattform
> verwendet die **breite Lesart** — das oben beschriebene Dachprogramm — und existiert
> auch, um genau dieses Sichtbarkeitsdefizit zu schließen."

Untertitel der Seite (`about.subtitle`): **„31 Umweltinitiativen für Nordkorfu"** /
„31 environmental initiatives for Northern Corfu". Die **enge Meeres-Lesart**
(„ZOE — Programm zum Schutz des Meereslebens") ist der **einzige formal
dokumentierte Ratsbeschluss (30.07.2025)**; Meeresschutz ist nur **eine** der sechs
Achsen, nicht das Gesamtprogramm.

---

## 7. Quellenverzeichnis (Beleg-Fußzeilen + Quellen-Folie)

### (a) Methodik / Standards — [Primär] / [Standard]

- Peffers, K., Tuunanen, T., Rothenberger, M. A., & Chatterjee, S. (2007). A design science research methodology for information systems research. *Journal of Management Information Systems, 24*(3), 45–77. **[Primär — DSR-Methodik]**
- Hevner, A. R. (2007). A three cycle view of design science research. *Scandinavian Journal of Information Systems, 19*(2), 87–92. **[Primär — Drei-Zyklen-Modell]**
- Hevner, A. R., March, S. T., Park, J., & Ram, S. (2004). Design science in information systems research. *MIS Quarterly, 28*(1), 75–105. **[Primär — 7 Guidelines]** *(⚠️ als separates Standardwerk zu zitieren; nicht mit Hevner 2007 vermischen.)*
- Gregor, S., & Hevner, A. R. (2013). Positioning and presenting design science research for maximum impact. *MIS Quarterly, 37*(2), 337–355. **[Primär — Improvement/Exaptation]**
- Gregor, S., & Jones, D. (2007). The anatomy of a design theory. *Journal of the Association for Information Systems, 8*(5), 312–335. **[Primär — DP-Form]**
- Cronholm, S., & Göbel, H. (2018). Guidelines supporting the formulation of design principles. *Proceedings of ACIS 2018*, Sydney. **[Primär — DP-Formulierung]**
- Venable, J., Pries-Heje, J., & Baskerville, R. (2016). FEDS: A framework for evaluation in design science research. *European Journal of Information Systems, 25*(1), 77–89. **[Primär — Evaluation]**
- Richtlinie (EU) 2016/2102 des Europäischen Parlaments und des Rates vom 26. Oktober 2016 über den barrierefreien Zugang zu den Websites und mobilen Anwendungen öffentlicher Stellen. *Amtsblatt der EU, L 327*, 1–15. **[Primär/Standard]**
- World Wide Web Consortium. (2018). *Web Content Accessibility Guidelines (WCAG) 2.1* (W3C Recommendation, 5. Juni 2018). https://www.w3.org/TR/WCAG21/ **[Standard]**
- ETSI. *EN 301 549 — Accessibility requirements for ICT products and services* (übernimmt WCAG 2.1 AA für die Richtlinie 2016/2102). **[Standard]** *(⚠️ Version/Jahr vor finaler Verwendung prüfen.)*
- United Nations General Assembly. (2015). *Transforming our world: The 2030 Agenda for Sustainable Development* (A/RES/70/1). **[Primär]**
- United Nations. (o. J.). *The 17 Goals — Sustainable Development Goals*. https://sdgs.un.org/goals *(offizielle Zieltitel/Icons für SDG 4, 6, 11, 12, 13, 14, 15, 17).* **[Primär]**

### (b) Kernel-Theorien je Ziel Z1–Z6 (aus dem Korpus / `literature-index.md`; [A]=gemessen, [B]=Rahmenwerk)

- **Z1 (Transparenz/Sichtbarkeit):** Lourenço (2023) [B]; Grimmelikhuijsen & Welch (2012) [A]; Simelió-Solà et al. (2021) [A]; Tsatsani et al. (2024) [A]. *(Fung/„Close the loop": Quelle fehlt.)*
- **Z2 (SDG-Transparenz):** United Nations (2015, A/RES/70/1) [Primär]; Clement et al. (2023) [A]; Jain & Espey (2022) [A]; Leite et al. (2026) [B]; Simonofski et al. (2022) [A]; Chokki et al. (⚠️ Jahr) [A, Preprint].
- **Z3 (Partizipation/Community):** Shin et al. (2024) [A]; Saldivar et al. (⚠️ Jahr) [A]; Arana-Catania et al. (2021) [A]; Mariani et al. (2025) [B]; Royo et al. (2020, 2024) [A]; Yang & Wu (2025) [A].
- **Z4 (Gamification/Motivation):** Ryan & Deci (2000) [B]; Sailer et al. (2017) [A]; Mekler et al. (2017) [A]; Hamari et al. (2014) [A]; Krath et al. (2021) [B]; Thiel et al. (2016) [B]. *(Deterding et al. 2011: Quelle fehlt.)*
- **Z5 (Umweltbewusstsein/lokale Identität, Schüler:innen):** Vare (2025) [A]; Peacock et al. (2018) [A]; Laksmi et al. (2026) [A]; Vegas Macias et al. (2023) [A]. *(Putnam/Sozialkapital: Quelle fehlt.)*
- **Z6 (Inklusion/Barrierefreiheit/Mehrsprachigkeit):** Csontos & Heckl (2021, 2025) [A]; Pontus & Rodríguez Vázquez (2021) [A]; Asghari et al. (2023) [A]; Chirumavilla (2025) [B]; Nielsen & Molich (1990) [B]; Shin et al. (2024) [A]. *(präziser Beleg „Mehrsprachigkeit als Partizipation" fehlt.)*

### (c) Nord-Korfu-Kontext — [Sekundär] / [PR] *(nur Kontext/Fakten, keine Wirkungsaussagen; URLs ⚠️ zu verifizieren)*

- Life News. (2026, 3. März). *[Nord-Korfu beim Umweltpreis Verde.tec: 31 Maßnahmen über sechs Achsen, SDG-Liste, 4.866 LED-Leuchten]*. life-news.gr. **[Sekundär/PR]**
- kerkyrasimera.gr. (2026). *[Attica Green Expo: 2.682,699 t Restmüll ausgeschleust = 15,08 % von 17.787 t (2025)]*. **[Sekundär]**
- Corfu TV News. (2025, 31. Juli). *[Gründung ODEK (24.05.2025), Walschutz-Rettungsteam; ARCHELON-Kooperation Meeresschildkröten]*. corfutvnews.gr. **[Sekundär]**
- Corfu TV News / CorfuPress. (2025, 30. Juli). *[Ratsbeschluss „ZOE — Programm zum Schutz des Meereslebens"]*. **[Sekundär]**
- Corfu Stories. (2026, 15. April). *[17 tote Meeresschildkröten Q1 2026; parlamentarische Anfrage]*. **[Sekundär]**

---

## 8. Iterations-Skizze (Phase 3)

### 8.1 Drei Stufen (aus `docs/slides/iteration-sketch.md`)

1. **Wireframe-Skizze (Lo-Fi, handgezeichnet):** Grobe Anordnung der Projekt-Übersicht
   (Kopfzeile + Sprachumschalter, Filterleiste, Raster aus Projektkarten,
   SDG-Kachelreihe) — Graustufen/Bleistift, Fokus auf Struktur/IA.
2. **Mid-Fi-Mockup (graustufig + erste grüne Akzente):** Saubere Projektkarten
   (Titel, Kategorie-Badge, Punkte-Indikator), SDG-Kachelzeile, klare Buttons,
   dezente grüne Primärfarbe.
3. **High-Fi (fertige Plattform):** Grünes Theme, echte ZOE-Aktionen,
   Kategorie-Filter, **offizielle UN-SDG-Icons** als anklickbare Kacheln,
   dreisprachige UI (entspricht den Screenshots unter `docs/slides/mockups/` und
   `docs/slides/mobile/`).

### 8.2 Fertiger Bild-Prompt (Volltext)

```
A clean three-panel "evolution of a web app" illustration, left to right,
equal-width panels with thin labels above each ("1 Sketch", "2 Mockup",
"3 Final"):

Panel 1 — low-fidelity hand-drawn wireframe on white paper: pencil-style
boxes for a header bar, a filter row, a 2x3 grid of empty project cards, and
a row of small squares representing goal icons; greyscale, sketchy lines,
squiggle placeholder text, no colour.

Panel 2 — mid-fidelity greyscale mockup with subtle green accents: the same
layout now crisp and aligned; project cards show a title line, a small
category tag and a points dot; one row of plain coloured squares as goal-icon
placeholders; clean buttons; mostly neutral greys with a green primary accent.

Panel 3 — high-fidelity finished product, light green and teal theme:
a sustainability project list for a small Mediterranean island municipality,
with realistic project cards (cover image, title, category label, points),
a category filter bar, and a row of generic colourful rounded square tiles as
sustainability-goal icons; modern, friendly, accessible UI; mobile-first feel.

Style: flat, modern UI illustration, soft shadows, high contrast, no real
brand logos, no copyrighted icons, no text that must be readable. 16:9,
high resolution.
```

> Hinweis: Die „goal icons" im generierten Bild sind bewusst **generische** bunte
> Quadrate (kein Nachbau der offiziellen UN-Icons). Für die echte High-Fi-Stufe
> in der Präsentation eigene Screenshots (`docs/slides/mockups/*`) verwenden — diese
> zeigen die offiziellen UN-Icons lizenzkonform.

### 8.3 Vorhandene Screenshot-/Mockup-Dateien

**`docs/slides/mockups/`** (Desktop/Tablet):
- `phone_landing_el.png`
- `phone_landing_en.png`
- `phone_projects_dark.png`
- `tablet_landing_de.png`
- `tablet_projects_en.png`
- `tablet_sdg_el.png`

**`docs/slides/mobile/`** (375 px):
- `mobile-375_accessibility_de.png`
- `mobile-375_landing_de.png`
- `mobile-375_landing_el.png`
- `mobile-375_landing_en.png`
- `mobile-375_participate_el.png`
- `mobile-375_projects_en.png`
- `mobile-375_projects_en_dark.png`
- `mobile-375_sdg_en.png`

> Zusätzlich im Ordner: `docs/slides/anshul.pptx` / `anshul.md`,
> `docs/slides/marieclaire.pptx` / `marieclaire.md`, `docs/slides/tech-stack-diagram.md`.

---

## 9. Offene Punkte / Platzhalter

**Fehlende Screenshots (für die Demo-Folien noch zu erstellen):**
- Admin-Bereich: `/admin`, `/admin/ideas` (Ideen-Review + mailto-Antwort), `/admin/posts`, `/admin/projects/new` (mit DeepL-Auto-Übersetzung).
- Eingeloggte USER-Sicht: `/dashboard`, `/my-rewards`, `/profile`.
- `/events` mit Gast-RSVP-Flow; `/news`-Feed; `/transparency`-KPI-Seite; `/get-involved` (Initiative-Tabs); Projekt-Detailseite `/projects/:id`.
- Vorhandene Screens decken v. a. Landing, Projects, SDG, Accessibility (mobil/Tablet/Dark) ab — Admin/User-Bereiche fehlen vollständig.

**„Quelle fehlt – bitte ergänzen"-Marker (vor finaler Abgabe schließen):**
- Z1: Fung (Accountability/„Close the loop").
- Z4: Deterding et al. (2011) (Gamification-Definition).
- Z5: Putnam (Sozialkapital/lokale Identität).
- Z6: präziser Beleg „Mehrsprachigkeit als Partizipation/Inklusion" (Notbehelf: Shin et al. 2024).
- Diverse ⚠️-bibliografische Prüfpunkte (Jahr/Band/Seiten) in `literature-index.md` §„Offene ⚠️-Prüfpunkte" (u. a. Chokki, Saldivar, Grimmelikhuijsen & Welch, Pina, Leite, Tsatsani).

**Noch zu generierende Bilder:**
- Iterations-Skizze (Sketch → Mockup → Final) aus dem Prompt in §8.2.
- Architektur-Diagramm aus der Beschreibung in §3.5.

**Footer-/Impressum-Namen:** ⚠️ **unklar/Platzhalter** — `ImprintPage` weist explizit
aus, dass die Angaben Platzhalter sind und vor Veröffentlichung zu ergänzen sind.
Autor:innen laut `docs/MATRIX.md`: **Anshul Agrawal (Phase 4)** · **Marieclaire (Phase 3)**,
FAU Erlangen-Nürnberg, Projektseminar WInf SoSe 2026, Gruppe 1. (Voller Nachname der
Teampartnerin im Repo **nicht vorhanden**.)

**Präsentationsdatum:** **15.–17. Juni 2026** (CLAUDE.md). Genaues Slot-Datum/-Uhrzeit
der Gruppe: nicht vorhanden / unklar.

**Inhaltliche Diskrepanzen, die für die Folien zu beachten sind:**
- ⚠️ `docs/architecture.md` (v2.0, 2026-05-25) ist **veraltet**: listet Routen
  `/roadmap`, `/school-ranking`, `/school`, `/admin/schools`, Rolle `SCHOOL` und
  School-API-Endpunkte, die im aktuellen Code **nicht mehr existieren** (Schulfeature
  entfernt). Maßgeblich ist `src/app/Router.tsx` (§1.1) bzw. `backend/src/app.ts`.
- ⚠️ `docs/MATRIX.md` (TP2) sagt „Einreichung wird **nicht** persistiert" — das ist
  **überholt**: Bürger-Ideen werden inzwischen über `POST /api/ideas` + `Idea`-Modell
  **persistiert** und im Admin (`/admin/ideas`) gesichtet; Event-RSVP ebenso über
  `EventRegistration`. Für die Demo also „Ideen-Einreichung + Event-RSVP persistiert".
- ⚠️ `src/data/events.ts` ist **Prototyp-Frontend-Fallback** (fiktive Events 2025);
  die `projectId`-Verweise passen nicht zu den realen `proj-*`-IDs. Eine echte
  Event-*Definitions*-Tabelle existiert im Backend **nicht** (nur Registrierungen).
- ⚠️ `src/data/metrics.ts`-Kennzahlen (Landing/Transparency) sind **fiktiv**; für
  belegte Zahlen ausschließlich §2.3 verwenden.
- CI/CD: **nicht vorhanden** (kein `.github/workflows/`).
```
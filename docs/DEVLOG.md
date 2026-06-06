# DEVLOG — ZOE Platform Nord-Korfu
> DSR Phase 3 & 4 Entwicklungsprotokoll nach Peffers et al. (2007)
> Autor: Anshul Agrawal | FAU Erlangen-Nürnberg | SoSe 2026
> Verwandt: [`docs/MATRIX.md`](MATRIX.md) · [`docs/dsr-methodology.md`](dsr-methodology.md)

## Wie dieses Dokument zu nutzen ist

Nach **jeder Implementierungssession** einen kurzen Eintrag ergänzen. Pro Eintrag festhalten:
- **welches Teilproblem** (TP1–TP4 aus [`MATRIX.md`](MATRIX.md)) adressiert wurde,
- **was** konkret implementiert/geändert wurde,
- **welche technische Entscheidung** getroffen wurde und **warum** (kurze Begründung — das ist der DSR-relevante Teil),
- der **DSR-Bezug** (welches Lösungsziel aus Phase 2 wird bedient),
- der **Status**.

Ziel: den iterativen Design-Develop-Demonstrate-Zyklus nachvollziehbar dokumentieren. Verworfene Ansätze gehören in den letzten Abschnitt — gerade Fehlschläge sind DSR-relevantes Designwissen.

---

## Iterationsübersicht

| Iteration | Datum | Adressiertes TP | Feature | Status |
|---|---|---|---|---|
| 1 | 2026-05-24 | TP1, TP3 | Frontend-MVP: Projekte, SDG-Dashboard, Transparenz, Beteiligung | ✅ |
| 2 | 2026-05-24 | TP4 | Korfu-Kontext + Zielgruppenseite (Audiences) | 🔨 |
| 3 | 2026-05-25 | TP1, TP2 | Full-Stack: Backend (Express/Prisma/SQLite), Auth, Admin-CRUD | ✅ |
| 4 | 2026-05-25 | TP4 | i18n (EN/EL/DE), Dark Mode, Zustand-State | 🔨 |
| 5 | 2026-05-25 | TP4 | WCAG 2.1 AA Barrierefreiheit + axe-core-Tests | ✅ |
| 6 | 2026-05-27 | übergreifend | Playwright E2E (49 Tests), Test-Setup, Doku-Update | ✅ |
| 7 | 2026-06-06 | TP1, TP4, TP6 | Additive Features: Initiative-Tabs, Tourist:innen-Beitrag, Newsletter-Opt-in (`/get-involved`) | ✅ |
| 8 | 2026-06-06 | TP4 | Durchgängige i18n (alle 7 Altseiten EN/EL/DE) + Flaggen-Sprachwechsler + DeepL-Auto-Übersetzung (Admin) | ✅ |

> Datumsangaben aus der Git-History abgeleitet (Commit-Daten). Eine Iteration kann mehrere Commits umfassen.

---

## Konsolidierung für die Präsentation (7 → 4 narrative Iterationen)

Für **beide Vorträge** (gemeinsame Iterations-Achse) und die Berichte werden die **7 realen Entwicklungs-Iterationen** (oben) zu **4 problemgetriebenen Iterationen** gebündelt — nach der *wissenschaftlichen Logik des Problemraums*, **nicht** streng chronologisch. **Keine Iteration ist erfunden**; dies ist eine rein didaktische Konsolidierung (Nachvollziehbarkeit hier dokumentiert).

| Narrative Iteration (Vortrag/Bericht) | TP | Designprinzip | aus realen Iterationen (oben) |
|---|---|---|---|
| **1 — Sichtbarkeit** | TP1 | DP1 | 1 (MVP-Katalog), 2 (Korfu-Kontext), 3 (datengetrieben) |
| **2 — SDG-Transparenz** | TP3 | DP3a/b | 1 (SDG-Dashboard + Transparenz) |
| **3 — Beteiligung & Zielgruppen** | TP2, TP4 | DP2a/b, DP4 | 1 (Beteiligung), 4 (i18n/Dark Mode), 5 (WCAG) |
| **4 — Tourist:innen & Community** | TP6 | DP6, DP1-Gruppierung | 7 (Get Involved) |
| **Status quo** | alle | — | 6 (E2E/Qualität) + Integration aller Features |

- **Marieclaire (Phase 3):** je Iteration die **Design-Begründung** (welches DP, warum + Beleg).
- **Anshul (Phase 4):** je Iteration die **Demonstration** (dass es funktioniert) + integrierter Status-quo-Walkthrough.

---

## Bereits implementierte Iterationen

### Iteration 1 — Frontend-MVP: Projektübersicht, SDG-Dashboard, Transparenz, Beteiligung
- **Datum:** 2026-05-24 (Commit `bdc57c5` „build ZOE sustainability platform frontend MVP prototype")
- **Adressiertes Teilproblem:** TP1 (Sichtbarkeit), TP3 (SDG-Transparenz), erste Anlage TP2
- **Was wurde implementiert:**
  - Öffentliche Projektübersicht (`src/pages/ProjectsPage.tsx`) mit Karten-Grid und Kategorie-Filter
  - Projekt-Detailseite (`src/pages/ProjectDetailPage.tsx`)
  - SDG-Dashboard (`src/pages/SDGDashboardPage.tsx`) mit Fortschrittsbalken je Ziel
  - Transparenz-/KPI-Seite (`src/pages/TransparencyPage.tsx`)
  - Beteiligungsseite (`src/pages/ParticipationPage.tsx`) mit 5 Optionen
  - UI-Bausteine: `SDGBadge`, `ProgressBar`, `StatusBadge`, `PrototypeBanner`
  - Prototyp-Fallback-Daten in `src/data/` (`projects.ts`, `sdgs.ts`, `metrics.ts`)
- **Technische Entscheidung:** React 19 + TypeScript (strict) + Tailwind, Daten zunächst statisch in `src/data/` ausgelagert (keine Inline-Daten in Komponenten) — ermöglicht spätere Ablösung durch API ohne UI-Umbau.
- **DSR-Bezug:** Lösungsziel TP1 (zentraler Ort für Aktionen) und TP3 (SDG-Beitrag sichtbar machen, Show Importance).
- **Status:** ✅ Implementiert

### Iteration 2 — Korfu-Kontext + Zielgruppenseite
- **Datum:** 2026-05-24 (Commit `7fc8c62` „ground platform in real Corfu context + add target audiences page")
- **Adressiertes Teilproblem:** TP4 (Zielgruppen-Heterogenität)
- **Was wurde implementiert:**
  - Zielgruppenseite (`src/pages/AudiencesPage.tsx`) mit 6 Gruppen, Kanälen, Sensibilisierungsprinzipien
  - Daten in `src/data/audiences.ts`
  - Erdung der Projekt-Fallbackdaten in realen Nord-Korfu-Kontexten (Antinioti-Lagune/Natura 2000, Erimitis, IEF, Temploni-Deponie)
- **Technische Entscheidung:** Reale lokale Bezüge statt generischer Nachhaltigkeitsfloskeln, um DSR-Relevanz (echter Anwendungskontext) zu stärken.
- **DSR-Bezug:** TP4 — Erreichen heterogener Zielgruppen über zielgruppengerechte, lokal verankerte Inhalte.
- **Status:** 🔨 Teilweise — Seite enthält **hartkodierten englischen Text** (kein `t()`), daher i18n-Ziel von TP4 noch nicht erfüllt.

### Iteration 3 — Full-Stack: Backend, Auth, Admin-CRUD
- **Datum:** 2026-05-25 (Commit `f924b4f` „complete all 8 phases — full-stack ZOE platform DSR artefact")
- **Adressiertes Teilproblem:** TP1 (datengetriebene Sichtbarkeit), TP2 (Beteiligungs-/Punktelogik)
- **Was wurde implementiert:**
  - Node/Express/Prisma/SQLite-Backend: `backend/src/routes/`, `controllers/`, `middleware/`
  - Prisma-Schema (`backend/prisma/schema.prisma`): `User`, `Project`, `Participation`, `Badge`, `UserBadge`, `RefreshToken`
  - JWT-Auth (Access 15 min + Refresh 7 d httpOnly Cookie), Rollen `USER`/`ADMIN`
  - Admin-Bereich: Projekt-CRUD + Nutzerverwaltung (`src/pages/admin/*`)
  - Geschützte Routen: `ProtectedRoute`, `AdminRoute`
  - Frontend-Services (`src/services/`) ersetzen statische Projektdaten durch API-Calls
  - Seed-Daten (`backend/prisma/seed.ts`): 8 Projekte, Demo-Nutzer, Badges
- **Technische Entscheidung:** SQLite + Prisma für Dev (enum-frei, im Schema als String validiert); strikte Trennung Frontend ↔ `services/` ↔ API (keine `fetch()` in Komponenten).
- **DSR-Bezug:** TP1 (Projekte aus echter API statt Mock) und TP2 (gamifizierte Beteiligung als Anreizmechanismus).
- **Status:** ✅ Implementiert — **Hinweis:** die freie Bürgerinitiativen-Einreichung (`ParticipationPage`) wird weiterhin **nicht** ans Backend persistiert.

### Iteration 4 — i18n, Dark Mode, State-Management
- **Datum:** 2026-05-25 (Teil von Commit `f924b4f`)
- **Adressiertes Teilproblem:** TP4 (Mehrsprachigkeit)
- **Was wurde implementiert:**
  - react-i18next-Setup (`src/utils/i18n.ts`) mit EN/EL/DE und Fallback EN
  - Übersetzungsdateien `src/locales/{en,el,de}/translation.json`
  - Sprachumschalter in `Header.tsx`, Persistenz via `languageStore`
  - Dark Mode (`themeStore`, Tailwind `class`-Strategie), Auth-State (`authStore`)
- **Technische Entscheidung:** Zustand für leichtgewichtigen globalen State (auth/theme/language) mit `localStorage`-Persistenz; Englisch als Fallback-Sprache.
- **DSR-Bezug:** TP4 — sprachliche Erreichbarkeit diverser Zielgruppen.
- **Status:** 🔨 Teilweise — Infrastruktur vollständig, aber mehrere Seiten (Audiences, SDG-Dashboard, Transparency) nutzen noch hartkodierten Text statt `t()`.

### Iteration 5 — WCAG 2.1 AA Barrierefreiheit
- **Datum:** 2026-05-25 (Commit `d8ff629` „WCAG 2.1 AA accessibility + i18n compliance + axe-core tests")
- **Adressiertes Teilproblem:** TP4 (Barrierefreiheit)
- **Was wurde implementiert:**
  - Accessibility-Erklärungsseite (`src/pages/AccessibilityPage.tsx`)
  - axe-core-Tests (`src/__tests__/accessibility/`)
  - Semantische Korrekturen, `aria-label` via `t()`, Fokus-Indikatoren, Formular-Labels
- **Technische Entscheidung:** Automatisierte Accessibility-Prüfung in CI-fähige Tests integriert (axe-core), um WCAG-Konformität laufend abzusichern; rechtliche Grundlage EU 2016/2102 / EN 301 549.
- **DSR-Bezug:** TP4 — kognitive/körperliche Barrierefreiheit für diverse Zielgruppen.
- **Status:** ✅ Implementiert

### Iteration 6 — E2E-Tests & Test-Infrastruktur
- **Datum:** 2026-05-27 (Commits `22ca91f`, `15d5e28`, `fe9af07`)
- **Adressiertes Teilproblem:** übergreifend (Qualitätssicherung für TP1–TP4)
- **Was wurde implementiert:**
  - Playwright E2E-Suite (`e2e/`): Navigation, Projekte, Auth, geschützte Routen, Dark Mode & Sprache, Accessibility (49 Tests)
  - Vitest-Konfiguration (E2E ausgeschlossen), Husky pre-commit
  - Aktualisierung der DSR-Doku auf Full-Stack-Artefakt
- **Technische Entscheidung:** Trennung Unit/Integration (Vitest) und E2E (Playwright); E2E aus Vitest-Lauf ausgeschlossen, um Test-Runner-Konflikte zu vermeiden.
- **DSR-Bezug:** Sicherung der Artefakt-Qualität als Voraussetzung für die Phase-5-Evaluation.
- **Status:** ✅ Implementiert

### Iteration 7 — Additive Features: Initiative-Tabs, Tourist:innen-Beitrag, Newsletter-Opt-in
- **Datum:** 2026-06-06 (Branch `claude/nightly-run`)
- **Adressiertes Teilproblem:** TP1 (Sichtbarkeit/Gruppierung), TP6 (Touristen als Ressource — bislang gar nicht adressiert), TP4 (Mehrsprachigkeit der neuen Inhalte)
- **Was wurde implementiert (rein additiv, kein bestehender Code entfernt):**
  - `src/pages/GetInvolvedPage.tsx` — neue öffentliche Seite unter `/get-involved`, in `Router.tsx` registriert, Navigationslink in `Header.tsx` (`nav.getInvolved`)
  - `src/components/engagement/InitiativeTabs.tsx` — barrierefreie Tabs (WAI-ARIA-Tabs-Pattern: `tablist`/`tab`/`tabpanel`, Roving-Tabindex, Pfeiltasten/Home/End) gruppieren die ZOE-Aktionen in vier Initiativen (Meer & Küste, Natur & Biodiversität, Kreislauf & Klima, Bildung & Tourismus); zeigt **auch abgeschlossene** Aktionen
  - `src/components/engagement/TouristContribution.tsx` — TP6-Sektion „Wie Besucher:innen beitragen" (4 konkrete Wege), mit Literatur-Beleg-Hinweis
  - `src/components/ui/NewsletterSignup.tsx` — Newsletter-Opt-in mit Zod-E-Mail-Validierung, `role="alert"`/`role="status"`, **expliziter Prototyp-Hinweis** (kein Versand)
  - i18n EN/EL/DE: neuer `getInvolved`-Namespace + `nav.getInvolved` in allen drei `translation.json` (Parität geprüft)
  - Tests: `InitiativeTabs.test.tsx` (Tabs/Panel/Tastatur), `NewsletterSignup.test.tsx` (Validierung/Erfolg/Prototyp-Hinweis), `accessibility/GetInvolvedPage.test.tsx` (axe) → **44/44 grün**, `tsc --noEmit` + `vite build` grün
- **Technische Entscheidung & Begründung:**
  - **Komponenten + eine neue Route, kein Eingriff in bestehende Seiten** — minimiert Regressionsrisiko, hält den Schritt additiv (Regel 3 des Nacht-Laufs).
  - **Kein Backend** für Newsletter/Initiativen-Persistenz — bewusste Designentscheidung (Scope/Datenschutz); realer Versand = Future Work (GDPR-by-Design, Diamantopoulou 2019 [B]).
  - **TP6 erstmals adressiert**, weil die ursprüngliche MATRIX nur TP1–TP4 abdeckte, der Stakeholder-/Phase-1-Input Tourismus aber als zentrales Thema nennt.
- **DSR-Bezug:** Designprinzipien DP1 (zentral/gruppiert), DP6 (Tourist:innen als Ressource) aus [`MATRIX.md`](MATRIX.md); belegt durch Simelio 2021 [A] (DP1), Laksmi 2026 [A] + Vegas Macias 2023 [A] (DP6); Engagement-Design nach Yang & Wu 2025 [A]/Krath 2021 [B].
- **Status:** ✅ Implementiert & getestet (additiv auf `claude/nightly-run`).

---

### Iteration 8 — Durchgängige Mehrsprachigkeit + DeepL-Auto-Übersetzung
- **Datum:** 2026-06-06 (Branch `claude/nightly-run`)
- **Adressiertes Teilproblem:** TP4 (Mehrsprachigkeit/Barrierefreiheit) — schließt die i18n-Lücke
- **Was wurde implementiert (additiv):**
  - **i18n aller 7 zuvor hartkodierten Seiten** auf `t()` (EN/EL/DE): `AboutPage`, `AudiencesPage`, `EventsPage`, `RewardsPage`, `RoadmapPage`, `SDGDashboardPage`, `TransparencyPage` — inkl. Dark-Mode-Klassen, i18next-Plurals und lokalisierten Datumsangaben. Inhaltsdaten aus `src/data/` bleiben (Content-Ebene).
  - **Flaggen-Sprachwechsler** `components/layout/LanguageSwitcher.tsx` (Inline-SVG-Flaggen GB/GR/DE statt Emoji → OS-unabhängig) ersetzt das Dropdown in `Header.tsx`.
  - **DeepL-Auto-Übersetzung** (Admin): `backend/src/services/translationService.ts` (Free/Pro-Endpoint per `:fx`-Suffix, Key nur in `.env`, pluggable, Fallback), Route `POST /api/admin/translate` (adminOnly), Frontend `components/admin/AutoTranslatePanel.tsx` in New/Edit-Project — eine Sprache eingeben, die anderen zwei werden befüllt (editierbar). Das DB-Modell war bereits dreisprachig (`titleEn/El/De`, `descriptionEn/El/De`); die öffentlichen Seiten zeigen Inhalte bereits nach UI-Sprache.
- **Technische Entscheidung & Begründung:**
  - **DeepL als pluggable Service, Key in `.env`** — kein Key im Code; Free→Pro durch Key-Tausch (keine Code-Änderung). Ohne Key sauberer „not configured"-Fallback (App/Tests laufen).
  - **Inline-SVG-Flaggen** statt Emoji-Flaggen, weil letztere auf Windows nicht rendern.
  - **UI-Text via i18n, Inhaltsdaten getrennt** — der Admin-Auto-Übersetzer adressiert die Content-Ebene (neue Projekte), statische `src/data/` bleiben vorerst englisch (Future Work).
  - **Test-Isolation-Fix:** `backend/**` aus dem Frontend-Vitest-Lauf ausgeschlossen (lief vorher versehentlich im jsdom-Run mit).
- **DSR-Bezug:** DP4 (Pontus 2021 [A]: alle Sprachfassungen) ist nun durchgängig erfüllt; Csontos & Heckl [A] (WCAG) bleibt evaluierbar.
- **Status:** ✅ Implementiert & getestet — Backend 37/37, Frontend 15/15, `tsc`/`vite build` grün.

---

## Offene Iterationen (noch zu implementieren)

Abgeleitet aus den Lücken in [`MATRIX.md`](MATRIX.md):

- **TP2 — Persistenz Bürgerinitiativen:** Backend-Endpunkt zur Speicherung der über `ParticipationPage` eingereichten Initiativen (ohne Account) + Admin-Moderationsansicht. *(aktuell nur lokaler State, keine API)* — ❌ Offen
- **TP3 — Offizielle UN-SDG-Icons:** Ersatz der farbigen Text-Badges (`SDGBadge`) durch offizielle SDG-Iconografie. — ❌ Offen
- **TP4 — Durchgängige i18n:** Hartkodierten Text in `AudiencesPage.tsx`, `SDGDashboardPage.tsx`, `TransparencyPage.tsx` auf `t()` umstellen + EL/DE-Keys ergänzen. — ❌ Offen
- **TP4 — Schulprogramm:** Dediziertes zielgruppengerechtes Angebot für Schüler:innen/Kinder (bislang nur erwähnt). — ❌ Offen
- **TP1 — Statusfilter:** Abgeschlossene Projekte in der Übersicht sichtbar machen (aktuell fix `status: 'OPEN'`). — ❌ Offen
- **Phase 5 — Evaluation:** Durchführung gemäß [`docs/evaluation-plan.md`](evaluation-plan.md) (SUS, Aufgaben-Tests, Experten-Walkthroughs). — ❌ Offen

---

## Verworfene Entscheidungen

_(Leer — wird manuell befüllt, sobald ein Designansatz bewusst verworfen wird. Beispielschema: **Was wurde verworfen** · **Warum** · **Alternative** · **Datum**.)_

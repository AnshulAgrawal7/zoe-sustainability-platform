# ZOE Nightrun Log — 2026-06-11 (Nacht)

Branch: `feature/nightrun-z1-z6-enhancements` (von `778fe08`, North-Korfu-Koordinaten-Fix).
Arbeitsweise: pro Block prüfen → ergänzen → Tests grün → committen → dieses Log updaten.
Baseline-Tests: **Backend 68 / FE 22 / E2E 55**. DE/EN/EL für alle neuen Texte. Nur additive Migrationen.

## Übersicht

| Block | Status | Ergebnis (1 Zeile) |
|---|---|---|
| 1 — Z1–Z6 Soll-Ist-Abgleich | ✅ | Alle 6 Ziele bereits implementiert; 1 i18n-Lücke (`Prototype —`) geschlossen |
| 2 — Events unter Projekte | ✅ | Beidseitige Verlinkung + 9 verknüpfte Seed-Events bereits vorhanden; verifiziert, keine toten Links |
| 3 — Startseite: aktive Projekte/Events oben | ✅ | „Jetzt mitmachen"-Sektion direkt nach Hero: kommende Events zuerst, dann OPEN-Projekte, nutzt `EntityImage` |
| 4 — Bild-Infrastruktur | ✅ | Teil 1 `Event.imageUrl` + Teil 2 `EntityImage` (Platzhalter + onError) in Projekt-Karten/-Detail + Event-Liste |
| 5 — Input/Aktivität/Output (Hammer & Champy) | ⏳ | Steht aus |
| 6 — Grüneres Design | ⏳ | Steht aus |

Legende: ✅ fertig · ⚠️ teilweise/mit Einschränkung · ⛔ übersprungen · ⏳ offen

---

## Chronologisches Protokoll

1. **Setup** — Branch `feature/nightrun-z1-z6-enhancements` von `778fe08` erstellt.
   Test-DB: lokales Postgres auf `localhost:5433` läuft (Docker-Daemon via `sudo`
   nicht startbar, aber Port 5433 ist bereits offen → Backend-Tests laufen).
2. **Baseline verifiziert** — `cd backend && npm test` → **68 passed**.
   `npm test` (FE, vitest) → **22 passed**. E2E (55) wird gegen Supabase-Dev-Server
   am Ende gefahren.
3. **Block 2 (Events↔Projekte)** — Code + Seed geprüft: beidseitige Verlinkung und
   9 verknüpfte Seed-Events bereits vorhanden, keine toten Links. Keine Code-Änderung
   nötig (s. Block-Details). Nur Log-Commit. **Build-Reihenfolge:** Block 4
   (Bild-Infra) wird vor Block 3 (Landing) umgesetzt, da die Landing-Kacheln die
   Bild-/Platzhalter-Komponente aus Block 4 wiederverwenden.
4. **Block-1-Audit** — Router, alle Z1–Z6-relevanten Seiten + Backend-Controller
   gelesen (siehe Block-Details). Ergebnis: Z1–Z6 sind im Code vorhanden und
   funktionsfähig. Einzige gefundene Lücke: ein hartkodierter String
   `Prototype — {total} …` in `ProjectsPage.tsx` (Z6-Verstoß „kein Text ohne `t()`").
4. **Z6-Fix** — Key `projects.prototypeCount` in EN/DE/EL ergänzt,
   `ProjectsPage.tsx` auf `t('projects.prototypeCount', { count: total })` umgestellt.
   Locale-Diff minimal (je +1 Zeile). FE-Tests 22/22 grün, Typecheck unverändert.
5. _(Pre-existing)_ `tsc --noEmit` meldet **2 vorbestehende** Fehler in
   `NewEventPage.tsx` / `EditEventPage.tsx` (`EventFormState` ohne Index-Signatur).
   Per `git stash` gegen `778fe08` verifiziert → existierten vor dem Nightrun.
   Fix in Block 4 (dort werden die Event-Formulare ohnehin angefasst).
6. **Commit Block 1** — siehe unten.

---

## Block-Details

### Block 1 — Z1–Z6 Soll-Ist-Abgleich

**Z1 — Zentrale Info (/projects Filter+Detail+sourceNote, /transparency, /get-involved Tabs, /news)**
gebaut. `ProjectsPage` hat Kategorie- **und** Status-Filter, List/Map-Toggle, Pagination.
`ProjectDetailPage` zeigt `sourceNote` („Quelle: …", nur wenn gesetzt). `/transparency`,
`/get-involved` (mit `InitiativeTabs`) und `/news` sind als Routen + Seiten vorhanden.
→ **Lücke: keine.**

**Z2 — SDGs (sdgIds je Projekt, UN-Icons, /sdg-dashboard, Tile-Links zu UN, Attribution)**
gebaut. `SDGDashboardPage` rendert alle 17 offiziellen UN-SDG-Icons als anklickbare
Links auf `sdg.unUrl` (target=_blank, rel=noopener), adressierte Ziele farbig, übrige
ausgegraut; Attribution + Disclaimer vorhanden. Alle 8 Projekte tragen SDGs aus
`{4,6,11,12,13,14,15,17}` (verifiziert im Seed). → **Lücke: keine.**

**Z3 — Ideen (POST /api/ideas anonym+Mail, /participate persistiert, /admin/ideas + mailto, Beitritt/RSVP)**
gebaut. `ideaController.createIdea` ist via `optionalAuth` offen, speichert anonym
(`userId: null`) mit optionalem `submitterName/Email`. `/participate` nutzt
`IdeaSubmitForm`. `/admin/ideas` listet Ideen und bietet einen `mailto:`-Link mit
vorbefülltem Subject. Projekt-Beitritt (`participation`) und Event-RSVP
(`eventRegistration`, inkl. Gast) persistieren. → **Lücke: keine.**

**Z4 — Punkte/Badges (serverseitig bei Beitritt+Event, Badges auto, /my-rewards, /rewards, Leaderboard, Gast 0)**
gebaut. `projectController.participate` und `eventController.joinEvent/registerForEvent`
inkrementieren `user.points` in einer Transaktion und vergeben Schwellen-Badges
(`userBadge.upsert`). Gäste erhalten 0 Punkte. `userController` liefert
`getMyBadges` (earned/all/nextBadge) und `getLeaderboard` (Top 10). FE: `/my-rewards`
(`UserRewardsPage`) zeigt Badges + Leaderboard, `/rewards` ist öffentlich. → **Lücke: keine.**

**Z5 — Karte (8 Projekte mit lokalen Ortsnamen, Marker auf Nord-Korfu, /projects Toggle)**
gebaut + **bereits korrigiert** (Commit `778fe08`, Vorlauf dieses Branches): alle
Koordinaten auf ~39.7–39.8 °N, `center={[39.77, 19.88]}`, `position={[lat, lng]}`,
Zoom 11. `/projects` Map-Toggle vorhanden, `/get-involved` zeigt zusätzlich eine
Karte. → **Lücke: keine** (war Auslöser, jetzt korrekt).

**Z6 — i18n/WCAG (DE/EN/EL durchgängig, Sprachumschalter, /accessibility, Account optional)**
gebaut. `LanguageSwitcher` im Header, 3 Locale-Dateien, `/accessibility`-Seite,
Account optional (Gast-RSVP + anonyme Ideen). **Ergänzt:** ein hartkodierter String
`Prototype —` in `ProjectsPage` → Key `projects.prototypeCount` (EN/DE/EL).
→ **Lücke geschlossen.**

**Übersprungen in Block 1:** nichts.

### Block 2 — Events sauber unter Projekte hängen

**Vorgefunden (alles bereits implementiert):**
- **Projekt → Events:** `ProjectDetailPage` hat einen Abschnitt „Termine zu diesem
  Projekt" (`projects.eventsTitle`), lädt `getEvents({ projectId })` und rendert je
  Event eine `EventRegister`-Teilnahmemöglichkeit.
- **Event → Projekt (Rücklink):** `EventsPage` zeigt bei `event.projectId` einen
  klickbaren Link „→ Teil von: {Projektname}" (`events.relatedProject`, EN/DE/EL
  vorhanden) auf `/projects/:id`. Eigenständige Events (projectId null) werden normal
  gelistet.
- **Seed:** genau **9 Events**, sinnvoll verknüpft — Cleanups → `proj-marine` (2×),
  Biodiversität → `proj-antinioti`, Recycling/Kompost → `proj-circular` (2×),
  Wasser → `proj-water-quality`, Aufforstung → `proj-natural-monuments`, Jugend →
  `proj-education`; 1 eigenständiges SDG-Forum (`projectId: null`).
- **Keine toten Links:** alle referenzierten `proj-*`-Ids existieren im Seed.

**Implementiert:** nichts nötig — Anforderung war bereits erfüllt (Grundsatz
„Erfinde nichts"). Verifiziert per Code-Review + Seed-Integritätsprüfung.

**Bewusste Entscheidung:** Es gibt **keine** eigene Event-Detail-Route. Events werden
vollständig (inkl. Beschreibung, Kapazität, Registrierung, Projekt-Rücklink) in der
`/events`-Liste und im Projekt-Detail dargestellt; ein separater Permalink je Event
ist für den Prototyp nicht erforderlich → nicht hinzugefügt (Scope/Risiko).

**Lücke bleibt:** keine.

---

### Block 3 — Startseite „Jetzt mitmachen"
Neue Sektion in `LandingPage.tsx`, **direkt nach dem Hero** (vor Stats/Pillars/Featured):
- Lädt `getEvents({ upcoming: true })` (API sortiert nach Datum aufsteigend) und
  `getProjects({ status: 'OPEN', limit: 4 })` — beide öffentlich, Fehler → leer.
- **Priorisierung:** kommende Events zuerst, OPEN-Projekte füllen die restlichen
  Plätze auf; insgesamt 3 Kacheln. Sind keine Events da, erscheinen 3 OPEN-Projekte;
  ist alles leer, wird die Sektion ausgeblendet.
- Jede Kachel: `EntityImage`-Vorschau (Block 4), Typ-Badge (Termin/Projekt),
  Kategorie, Titel, bei Events das Datum, plus CTA-Link (Event → `/events`,
  Projekt → `/projects/:id`). „Alle ansehen" → `/events` bzw. `/projects`.
- **i18n:** neue Keys `landing.engage.*` (heading/subheading/viewAll/eventLabel/
  projectLabel/eventCta/projectCta) in EN/DE/EL.
- tsc (FE+BE) sauber, eslint sauber, FE 22 grün.

## Testergebnisse

| Suite | Vorher | Nachher (Block 1) |
|---|---|---|
| Backend (vitest) | 68 | 68 ✅ |
| Frontend (vitest) | 22 | 22 ✅ |
| E2E (Playwright) | 55 | (läuft am Ende) |

**Vorbestehende, nicht durch den Nightrun verursachte Probleme:**
- `tsc --noEmit`: 2 Fehler in `NewEventPage.tsx:92` / `EditEventPage.tsx:138`
  (`EventFormState` braucht Index-Signatur). Verifiziert pre-existing auf `778fe08`.
  → **In Block 4 behoben:** `EventFormState` von `interface` auf `type` umgestellt
  (Object-Typen sind — anders als Interfaces — zu `Record<string, unknown>`
  zuweisbar). `tsc --noEmit` ist jetzt auf FE **und** Backend sauber.

### Block 4 — Bild-Infrastruktur (Teil 1: Event-`imageUrl`)
Nach Netzwerk-Abbruch („socket closed") fortgesetzt; vor dem Weiterarbeiten via
`git status` / `git diff` / `tsc` geprüft, nichts doppelt angewendet.
- **Schema/Migration:** `Event.imageUrl String?` + Migration
  `20260611130000_add_event_image`.
- **Backend:** `eventController` (create/update) und Admin-Validatoren
  (`isURL`, max 2048) kennen `imageUrl`.
- **Admin-Formular:** Feld „Titelbild-URL" in `EventFormFields` (Label
  `admin.formImageUrl` + Hint — in EN/EL/DE bereits vorhanden), New-/Edit-Page
  mappen `imageUrl` in den Payload bzw. laden es aus `event.imageUrl`.
- **Typen:** `ApiEvent.imageUrl` + `EventPayload.imageUrl`.
- **Teil 2 (erledigt):** neue wiederverwendbare Komponente
  `src/components/ui/EntityImage.tsx` — rendert das Bild oder, bei leerer
  `src`/Ladefehler (`onError`), einen kategorie-farbigen Platzhalter mit Icon
  (nie ein kaputtes Bild-Symbol). Reales Bild trägt `alt` = Entitätsname (WCAG);
  Platzhalter ist dekorativ (`aria-hidden`, Titel steht als Text daneben).
  Eingebunden in:
  - **Projekt-Karten** (`ProjectsPage`): immer eine Vorschau (Platzhalter, wenn
    kein Bild) — einheitliches Raster.
  - **Projekt-Detail** (`ProjectDetailPage`): großes Headerbild **nur wenn gesetzt**
    (kein riesiger leerer Platzhalter).
  - **Event-Liste** (`EventsPage`): Vorschau **nur wenn gesetzt** (hält die
    vertikale Zeilenliste scannbar; `onError`-Fallback greift trotzdem).
  - `Project.imageUrl` + Projekt-Admin-Feld existierten bereits (pre-existing).
  - **Bewusste Entscheidung:** Platzhalter-Zwang nur in Rastern (Karten/Kacheln),
    in Zeilen-/Detail-Kontexten konditional — dokumentiert für Konsistenzfrage.

---

## Neue Migrationen

### `20260611130000_add_event_image` (Block 4)
Additiv: `ALTER TABLE "Event" ADD COLUMN "imageUrl" TEXT;` — kein Datenverlust.

**Deploy gegen Supabase (vom User auszuführen):**
```bash
cd backend
npx prisma migrate deploy      # wendet die neue Migration an
npx prisma generate            # Client-Typen aktualisieren
# optional, falls Demo-Daten neu gesetzt werden sollen:
# npm run db:seed
```
Die lokale Test-DB braucht nichts — `globalSetup.ts` macht `prisma db push --force-reset`
und liest das Schema direkt.

---

## TODO — was ich (der User) morgen früh tun muss

> Wird fortlaufend ergänzt. Stand nach Block 4 (Teil 1):

- [ ] **Migration deployen:** `cd backend && npx prisma migrate deploy && npx prisma generate`
      gegen Supabase (neue Spalte `Event.imageUrl`) — siehe „Neue Migrationen".
- [ ] **Visuell prüfen:** Karte auf `/projects` (Map-Toggle) und `/get-involved` —
      sitzen die Marker jetzt auf Nord-Korfu (~39.7 °N) statt im Ionischen Meer?
- [ ] **Bilder ergänzen:** Events haben jetzt ein optionales „Titelbild-URL"-Feld
      im Admin (wie Projekte) — echte Bild-URLs nach Wunsch eintragen.
- [x] ~~Vorbestehende tsc-Fehler in den Event-Admin-Formularen~~ — in Block 4 behoben
      (`EventFormState` ist jetzt ein `type`); `tsc --noEmit` FE+Backend sauber.

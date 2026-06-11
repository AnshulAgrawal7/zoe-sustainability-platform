# ZOE Nightrun Log — 2026-06-11 (Nacht)

Branch: `feature/nightrun-z1-z6-enhancements` (von `778fe08`, North-Korfu-Koordinaten-Fix).
Arbeitsweise: pro Block prüfen → ergänzen → Tests grün → committen → dieses Log updaten.
Baseline-Tests: **Backend 68 / FE 22 / E2E 55**. DE/EN/EL für alle neuen Texte. Nur additive Migrationen.

## Übersicht

| Block | Status | Ergebnis (1 Zeile) |
|---|---|---|
| 1 — Z1–Z6 Soll-Ist-Abgleich | ✅ | Alle 6 Ziele bereits implementiert; 1 i18n-Lücke (`Prototype —`) geschlossen |
| 2 — Events unter Projekte | ⏳ | Steht aus |
| 3 — Startseite: aktive Projekte/Events oben | ⏳ | Steht aus |
| 4 — Bild-Infrastruktur | ⏳ | Steht aus |
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
3. **Block-1-Audit** — Router, alle Z1–Z6-relevanten Seiten + Backend-Controller
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

---

## Testergebnisse

| Suite | Vorher | Nachher (Block 1) |
|---|---|---|
| Backend (vitest) | 68 | 68 ✅ |
| Frontend (vitest) | 22 | 22 ✅ |
| E2E (Playwright) | 55 | (läuft am Ende) |

**Vorbestehende, nicht durch den Nightrun verursachte Probleme:**
- `tsc --noEmit`: 2 Fehler in `NewEventPage.tsx:92` / `EditEventPage.tsx:138`
  (`EventFormState` braucht Index-Signatur). Verifiziert pre-existing auf `778fe08`.
  → Fix geplant in Block 4.

---

## Neue Migrationen

_(noch keine — Block 1 war additiver i18n-Fix ohne Schema-Änderung.)_

---

## TODO — was ich (der User) morgen früh tun muss

> Wird fortlaufend ergänzt. Stand nach Block 1:

- [ ] **Visuell prüfen:** Karte auf `/projects` (Map-Toggle) und `/get-involved` —
      sitzen die Marker jetzt auf Nord-Korfu (~39.7 °N) statt im Ionischen Meer?
- [ ] **Vorbestehende tsc-Fehler** in den Event-Admin-Formularen beachten (werden in
      Block 4 mitgefixt, falls Block 4 läuft).

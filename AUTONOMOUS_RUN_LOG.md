# Autonomous Run Log — Szenario-A-Härtung

> Autonomer Arbeitslauf, gestartet 2026-06-17. Auftrag: alle ohne externe
> Accounts umsetzbaren `Future_Work.md`-Punkte für **Szenario A** implementieren
> und selbst testen; Mail-abhängige Flows nur UI-seitig absichern (voller Flow =
> A→B-Future-Work). Branch: `feature/szenario-a-hardening` (kein Push).
>
> Dieser Log hält **chronologisch** fest, was gemacht, geändert und getestet
> wurde. Jeder Abschnitt entspricht einem Commit.

## Ausgangszustand (Baseline)
- Branch `feature/szenario-a-hardening` von `main` (c049c0b).
- Lokale Test-Postgres (Docker, `zoe-postgres-test`, :5433) gestartet.
- **Backend-Tests: 110/110 grün.**
- **Frontend-Tests: 22/22 grün · Typecheck clean.**

## Geplanter Umfang (🤖, ohne externe Accounts)
P0: 404-Seite + Error-Boundary (FE) · globaler Error-/404-Handler (BE) · toter
„Passwort vergessen"-Link absichern · Consent-Checkbox bei Registrierung.
P1: Rate-Limit/Honeypot auf anonymen Formularen · Admin-Nutzerverwaltung
(Rolle/Sperren/Löschen/Punkte) + Audit-Log · DSGVO Self-Service (Export +
Konto-Löschung) · Newsletter-Admin-Ansicht · SEO-Basics · Karten-A11y.
Docs: A→B-Fahrplan · Abschluss-Testbericht.

Mail-abhängig (bewusst NICHT gebaut, bleibt A→B): Passwort-Reset-Versand,
E-Mail-Verifizierung, Mails an anonyme Einreicher, Newsletter-Versand/Double-Opt-in.

---

## Changelog
<!-- je Feature ein Eintrag: Was / Dateien / Test / Commit -->

### 1 — 404-Seite, Route-Error-Element & globale Error-Boundary (Future_Work 6.1, 6.2)
- **Neu:** `src/pages/NotFoundPage.tsx` (übersetzte 404, in Layout, ein `<h1>`,
  Link zur Startseite), `src/pages/RouteErrorPage.tsx` (Root-`errorElement`:
  geworfene 404 → NotFoundPage, sonstige Fehler → übersetzter Fallback mit
  Reload/Home), `src/components/ErrorBoundary.tsx` (Klassen-Boundary um den
  RouterProvider als letztes Netz gegen White-Screen).
- **Geändert:** `src/app/Router.tsx` (root `errorElement`, Catch-all
  `path: '*'`, ErrorBoundary-Wrapper); i18n-Keys `notFound`/`errorBoundary` in
  `en|de|el/translation.json`.
- **Mail-UI-Sicherheit (FW 2.1):** geprüft — der `auth.forgotPassword`-Key wird
  **nirgends gerendert** (existiert nur in den JSON-Dateien). Es gibt also keinen
  sichtbaren toten Link; kein UI-Eingriff nötig. Voller Reset-Flow bleibt A→B.
- **Test:** neuer `NotFoundPage.test.tsx` (Render + jest-axe). Frontend
  **24/24 grün**, Typecheck clean.
- **Commit:** `feat(routing): 404 page, route error element, global error boundary`

### 2 — Backend: globaler Error-Handler + 404-Middleware (Future_Work 3.1)
- **Neu:** `backend/src/middleware/errorHandler.ts` — `notFoundHandler`
  (unbekannte Route → JSON-404 statt Express-HTML) und `errorHandler`
  (Multer-Fehler → 400 `FILE_TOO_LARGE`/`UPLOAD_ERROR`, ungültiges JSON → 400,
  sonst generischer 500 ohne Leak von Internas).
- **Geändert:** `backend/src/app.ts` — beide nach allen Routern bzw. als letzte
  Middleware gemountet.
- **Test:** neuer `errorHandler.test.ts` (404 + Malformed-JSON). Backend
  **112/112 grün**, Typecheck clean.
- **Commit:** `feat(api): uniform JSON error handler and 404 middleware`

### 3 — Einwilligung bei der Registrierung + Consent-Nachweis (Future_Work 2.3, 9.6)
- **Schema:** `User.acceptedTermsAt DateTime?` (Zeitpunkt der Zustimmung =
  Nachweispflicht). Migration `20260617120000_add_user_consent` erzeugt und gegen
  Schatten-DB validiert (Migrations reproduzieren Schema exakt → leerer Diff).
- **Backend:** `auth.ts`-Validator erzwingt `consent === true`
  (`CONSENT_REQUIRED`); `authController.register` setzt `acceptedTermsAt = now()`.
- **Frontend:** `RegisterPage` — Pflicht-Checkbox mit `<Trans>`-Link zur
  Datenschutzseite (`/privacy`), Client-Validierung (`validation.consent`),
  `consent` im Payload; `RegisterPayload`-Typ um `consent: boolean` erweitert.
- **i18n:** `auth.consent` (mit `<privacy>`-Komponente) in en|de|el.
- **Tests:** Backend +2 (Consent-Zeitstempel gesetzt · fehlender Consent → 400,
  kein User angelegt); 11 bestehende Register-Calls um `consent:true` ergänzt.
  Frontend neuer `RegisterConsent.test.tsx` (+3: Checkbox/Link · Gate blockiert
  ohne Consent · sendet `consent:true`). **BE 114/114 · FE 27/27 · Typecheck clean.**
- **Offen (Doku):** `docs/api.md` Register-Endpoint um `consent` ergänzen (Sammel-
  Doku-Commit am Ende).
- **Commit:** `feat(auth): require and record privacy-policy consent at registration`

### 4 — Rate-Limiting auf anonymen/Schreib-Endpunkten (Future_Work 3.2)
- **Backend:** neuer `writeLimiter` in `app.ts` auf `/api/ideas`,
  `/api/comments`, `/api/newsletter`, `/api/submissions`, `/api/event-proposals`.
  Zählt nur mutierende Requests (`skip` für GET/HEAD → öffentliche Listen/Feed nie
  gedrosselt), prod 30 / dev 500 pro 15 min, im Test-Env deaktiviert (E2E-Suites).
  Antwort im einheitlichen JSON-429-Format.
- **Test:** neuer `rateLimit.test.ts` (GET nie gedrosselt · 3. POST → 429 JSON).
  **Backend 116/116 grün**, Typecheck clean.
- **Commit:** `feat(api): rate-limit public write endpoints (anti-spam)`

### 5 — Admin-Nutzerverwaltung härten + Audit-Log (Future_Work 4.1, 4.2)
- **Schema:** `User.active Boolean @default(true)` + neues Modell `AdminAuditLog`
  (append-only Protokoll privilegierter Aktionen). Migration
  `20260617130000_user_active_audit_log`, gegen Schatten-DB validiert (leerer Diff).
- **Backend (`adminController`):**
  - `updateUserRole` **abgesichert**: keine Änderung der **eigenen** Rolle
    (`CANNOT_CHANGE_OWN_ROLE`), keine Degradierung des **letzten Admins**
    (`LAST_ADMIN`) → kein Lockout mehr. Schreibt Audit.
  - `updateUserActive` (neu, `PATCH /admin/users/:id/active`): Sperren/Entsperren;
    Selbstsperre & letzter aktiver Admin verhindert; beim Sperren werden
    Refresh-Tokens gelöscht (Sofort-Wirkung). Audit.
  - `updateUserPoints` (neu, `PATCH /admin/users/:id/points`): manuelle
    Punktekorrektur (≥0). Audit.
  - `getAuditLog` (neu, `GET /admin/audit`, admin-only, ≤500, neueste zuerst).
  - `getAllUsers` liefert jetzt `active`.
  - Helper `utils/audit.ts` (best-effort, bricht die Aktion nie ab).
- **Backend (`authController.login`):** gesperrte Konten werden am Login geblockt
  (`403 ACCOUNT_DISABLED`) — korrekte Credentials, aber kein Token.
- **Frontend:** `ManageUsersPage` neu — Spalten Status + Aktionen, Sperren/
  Entsperren, Inline-Punkte-Edit mit Speichern, Fehler-Codes → eine lokalisierte
  Toast (`admin.actionForbidden`); 9 neue i18n-Keys × 3 Sprachen.
- **Tests:** neuer `adminUsers.test.ts` (+5: Eigene-Rolle-Block · Promote+Audit ·
  Punkte+Audit · Sperren→Login 403→Entsperren→Login 200 · Audit nur Admin).
  **BE 121/121 · FE 27/27 · beide Typechecks clean.**
- **Offen (klein):** Audit-Log-Frontend-Ansicht (Endpoint + Tests vorhanden);
  Konto-**Löschung** folgt in Feature 6 (gemeinsamer Anonymisierungs-Service).
- **Commit:** `feat(admin): user management guards, suspend, points, audit log`

### 6 — DSGVO Self-Service: Datenexport + Konto-Löschung (Future_Work 9.5, 4.1)
- **Service:** `services/userDeletion.ts` — `buildUserExport` (Art. 15/20: alle
  personenbezogenen Daten als JSON) und `deleteUserCompletely` (Art. 17:
  Transaktion — Community-Inhalte **anonymisieren** [Ideen/Submissions/Proposals:
  userId + submitterName/Email → null], alles Persönliche **löschen**
  [Teilnahmen, RSVPs, Badges, Tokens, eigene Kommentare + Likes, empfangene
  Notifications/Votes via Cascade]; Actor-Notifications entkoppeln; Löschung
  blockiert, falls der User Projekte besitzt → `USER_HAS_PROJECTS`).
- **Backend:** `GET /users/me/export` (JSON-Download), `DELETE /users/me`
  (Self-Service, löscht Refresh-Cookie); `DELETE /admin/users/:id` (Admin,
  Guards: nicht sich selbst `CANNOT_DELETE_SELF`, nicht letzter Admin `LAST_ADMIN`,
  + Audit `ACCOUNT_DELETE`).
- **Frontend:** `ProfilePage` → Sektion „Deine Daten": Export-Download-Button +
  Konto-Löschung mit Pflicht-Bestätigungs-Checkbox (zweistufig); nach Löschung
  Logout + Redirect. Service-Funktionen `downloadMyData`/`deleteMyAccount`;
  9 i18n-Keys × 3 Sprachen.
- **Tests:** `gdpr.test.ts` (+4: Export · Löschung anonymisiert Idee/entfernt
  Kommentar/Login schlägt fehl · Admin-Self-Delete 403 · Admin-Delete + Audit);
  `ProfileDataRights.test.tsx` (+2: Export-Trigger · Löschung erst nach
  Bestätigung). **BE 125/125 · FE 29/29.**
- **Commit:** `feat(gdpr): self-service data export and account deletion`

### 7 — Prod-Build reparieren (BLOCKER, vorbestehend — Future_Work 3.x/Deploy)
- **Befund:** `npm run build` (`tsc -b` + `vite build`) war **bereits im
  Basis-Commit c049c0b kaputt** — Deployment (Szenario A) damit unmöglich. Das
  `type-check`-Skript (`tsc --noEmit`) ist faktisch ein No-op (Root-`tsconfig.json`
  hat `files: []` + nur References), daher fielen die Fehler nie auf. Verifiziert
  durch Build gegen den Basis-Commit.
- **3 Fixes (verhaltenserhaltend bzw. korrigierend):**
  1. `utils/i18n.ts` — i18next v26 entfernte `interpolation.format` aus den Typen;
     Laufzeit unverändert, Formatter jetzt präzise typisiert angehängt (kein `any`).
  2. `pages/ProjectDetailPage.tsx` — veraltete Kategorie-Farb-Map (Alt-Taxonomie
     ENVIRONMENT/…); seit dem 6-Kategorien-Refactor **toter Code → immer grau**.
     Jetzt Single-Source `projectCategoryVisual(...).accent` (Farben wieder korrekt).
  3. `components/engagement/IdeaSubmitForm.tsx` — `category`-Narrowing
     (`'' | ApiProjectCategory` → `ApiProjectCategory`) im Submit-Guard.
- **Ergebnis:** **`npm run build` grün** (dist gebaut). Verbleibende Warnung:
  Bundle > 500 kB → Code-Splitting = Future_Work 6.6 (kein Fehler).
- **Tests:** FE 29/29 · BE 125/125 unverändert grün.
- **Commit:** `fix(build): repair broken production build (tsc -b)`

### 8 — SEO-Basics (Future_Work 6.4)
- **Per-Route-`<title>`:** `Layout` setzt `document.title` aus einer
  Segment→`nav.*`-Map (übersetzt, reagiert auf Sprachwechsel); Detail-/unbekannte
  Routen fallen auf den Site-Titel zurück. `document.documentElement.lang` war
  bereits vorhanden.
- **`public/robots.txt`:** Public erlaubt, private/Admin-Bereiche (`/admin`,
  `/dashboard`, `/profile`, `/my-rewards`, `/login`, `/register`) disallowed;
  Sitemap-Zeile als Betreiber-TODO (Domain unbekannt).
- **`index.html`:** Open-Graph- + Twitter-Card-Meta (og:url/Prod-Bild = Betreiber).
- **Test:** Build + FE-Suite grün (29/29); Logik trivial, kein neuer Unit-Test.
- **Commit:** `feat(seo): per-route titles, robots.txt, social meta tags`

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

## Abschluss (Stand 2026-06-17)

**Endzustand Tests/Build (alle grün):**
- Backend: **125 Tests** (Start 110 → +15: errorHandler, rateLimit, adminUsers, gdpr, consent).
- Frontend: **30 Tests** (Start 22 → +8: NotFound, RegisterConsent, ProfileDataRights, ProjectMap-Liste).
- **Prod-Build `npm run build` grün** (war vorbestehend kaputt → jetzt deploybar).
- Beide Typechecks clean.

**11 Commits** auf `feature/szenario-a-hardening` (nicht gepusht), je Feature einer.

**Bewusst NICHT gebaut (kein externer Account / A→B):** voller Passwort-Reset- &
E-Mail-Verifizierungs-Versand, Mails an anonyme Einreicher, Newsletter-Versand/
Double-Opt-in — alle benötigen einen Mailprovider (👤). Kleinere offene 🤖-Reste
siehe Future_Work-Statusblock (Audit-UI, Newsletter-Admin-Ansicht, Honeypot,
Logging/Pagination, Code-Splitting).

**Lokale Test-DB:** Container `zoe-postgres-test` (Docker, :5433) läuft weiter,
damit `cd backend && npm test` sofort funktioniert (zusätzlich existiert eine
Wegwerf-DB `zoe_shadow` nur für Migrations-Validierung, ignorierbar).

---

## Changelog
<!-- je Feature ein Eintrag: Was / Dateien / Test / Commit -->

### 11 — E-Mail-Format-Prüfung im Ideen-Formular (Konsistenz)
- **Befund:** Alle öffentlichen Formulare prüfen das E-Mail-Format client- UND
  serverseitig — **außer** `IdeaSubmitForm`, das die (optionale) E-Mail im JS
  nicht prüfte (`noValidate` + nur Pflichtfelder). Backend lehnte ungültige
  Adressen zwar ab (`isEmail`), aber die UX zeigte nur einen generischen Fehler.
- **Fix:** `EMAIL_RE`-Prüfung nur bei ausgefülltem Feld + Feld-Fehler
  `validation.email` (Key existiert ×3), ARIA (`aria-invalid`/`describedby`),
  Fehler-Reset bei Eingabe — analog zu RSVP/Report/Event-Vorschlag.
- **Test:** `IdeaSubmitEmail.test.tsx` (+3: ungültig blockiert · leer erlaubt ·
  gültig sendet). **FE 33/33**, Build grün.
- **Commit:** `fix(ideas): validate optional email format in the idea form`

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

### 9 — Karten-Barrierefreiheit (Future_Work 10.2)
- **ProjectMap + EventsMap:** `sr-only`, tastatur-fokussierbare Marker-Liste als
  Textäquivalent der Leaflet-Pins (WCAG 1.1.1) — je ein Link zur Detailseite
  (Projekt: Titel + Kategorie; Event: Titel). Leaflet-Pins sind für AT
  unsichtbar; diese Liste schließt die Lücke. i18n-Key `map.markerListLabel` × 3.
- **Test:** `ProjectMap.test.tsx` erweitert (+1: beschriftete Liste mit Link je
  Punkt). FE **30/30**, Build grün.
- **Commit:** `feat(a11y): accessible text alternative for map markers`

---

# Lauf 2 — Szenario-A-Härtung (Fortsetzung), 2026-06-17

> Branch `feature/szenario-a-hardening-2` (von `main` nach Merge von Lauf 1).
> Auftrag: alle ohne externe Accounts umsetzbaren Future_Work-Reste (Tier 1–3)
> implementieren, je Feature ein Commit mit Tests/Build/Typecheck als Gate; die
> Production-CSP zusätzlich per Headless-Browser-Screenshot verifizieren.
> **Auto-Merge auf `main` + Push** am Ende, sofern alle Gates grün.

## Abschluss (Stand 2026-06-17)

**Endzustand (alle Gates grün):**
- Backend: **140 Tests** (Start 127 → +13: readiness, honeypot, newsletterAdmin,
  loginLockout, pagination, requestId).
- Frontend: **48 Tests** (Start 33 → +15: Honeypot, AuditLogPage, ManageNewsletter,
  LoadError, ManageUsersFilter).
- **Prod-Build grün**, Bundle-Warnung beseitigt: Entry-Chunk **1.308 kB → 433 kB**
  (gzip 358 → 134 kB) durch Route-Code-Splitting + Vendor-Chunking.
- Beide Typechecks clean, Backend-Lint clean.
- **CSP per Screenshot verifiziert** (Prod-Build, Headless-Chromium): 0 Verstöße,
  12/12 Map-Tiles geladen, Fonts/Styles intakt.

**14 Commits** (je Feature einer). Auto-Merge auf `main` + Push am Ende.

## Changelog

1. `feat(api): database readiness probe (/api/ready)` — 3.8. Pingt die DB
   (`SELECT 1`), 503 wenn down; `/api/health` bleibt reine Liveness. +2 BE-Tests.
2. `feat(security): honeypot anti-spam on public forms` — 3.5. Versteckte
   `website`-Falle auf Ideen/Submissions/Vorschlägen/Newsletter; Bot-Posts werden
   still (200, kein DB-Row) verworfen. Reusable `HoneypotField`. +3 BE, +2 FE.
3. `feat(admin): audit-log view for privileged actions` — 4.2. Frontend
   (`/admin/audit`) für den bestehenden Endpoint; i18n ×3, jest-axe. +3 FE.
4. `feat(admin): newsletter signup management` — 4.4. BE: Liste/CSV-Export/Löschen;
   FE-Seite mit zweistufigem Löschen. +2 BE, +4 FE.
5. `feat(ux): consistent load-error state with retry` — 6.7. Reusable `LoadError`
   (Retry) statt stillem Leeren bei Backend-down (Events/News). +4 FE.
6. `feat(admin): create-admin bootstrap script + onboarding doc` — 4.3. CLI
   `npm run create:admin` (anlegen/befördern, Passwort-Policy); gegen Test-DB
   verifiziert. Admin-Guide §17.
7. `docs: security notes + privacy & a11y statement templates` — 5.5/3.3/2.6/9.2/9.7.
8. `perf(build): code-split routes (React.lazy) + vendor chunking` — 6.6.
9. `feat(auth): per-account login lockout` — 2.4. 5 Fehlversuche → 15 min Sperre
   (429 `ACCOUNT_LOCKED`), Reset bei Erfolg. Migration. +2 BE.
10. `feat(admin): search and role/status filters on the user list` — 4.5. +2 FE.
11. `feat(api): opt-in pagination on the feed and public idea board` — 3.7.
    `?page/?limit` (1–100); ohne Params unverändert (rückwärtskompatibel). +4 BE.
12. `feat(api): structured JSON logging + request-id correlation` — 3.6. Minimaler
    JSON-Logger (kein Dep), `X-Request-Id`; alle `console.*` ersetzt. +2 BE.
13. `feat(security): production Content-Security-Policy` — 3.4. Vite-Plugin
    injiziert CSP-Meta nur im Prod-Build (Dev/HMR unberührt). Headless-verifiziert.
14. `chore(deps): npm audit fix` — 11.3. Frontend 0 Vulns (vite 8.0.16); Backend
    `form-data` gepatcht. Rest = Dev-only Vitest-Kette (dokumentiert, kein `--force`).

---

# Lauf 3 — Batches A–F, 2026-06-18

> Branch `feature/autonomous-run-3` (von `main` @ `a48467d`). Auftrag: **alle**
> autonomen Batches A–F aus `handoff.md` in einem Lauf umsetzen — je Feature ein
> Commit, Quality Gates pro Commit (FE `npm run build` + `vitest run`, Backend
> `npm test` + `type-check` + `lint`). Repo wurde vorab auf **public** gestellt,
> daher CI/CD live. **FF-Merge auf `main` + Push** am Ende.

## Abschluss (Stand 2026-06-18)

**Endzustand (alle Gates grün):**
- Backend: **177 Tests** (Start 140 → +37: mailService, passwordReset,
  emailVerification, submitterEmail, rsvpEmail, refreshLogout, submissions,
  profanity, maintenance, twoFactor).
- Frontend: **77 Tests** (Start 48 → +29: PasswordResetPages, EmailVerification,
  PublicPages-a11y ×14, i18n-parity, TwoFactor).
- **Prod-Build grün**, beide Typechecks clean, **`eslint .` clean** (Root-Lint
  zog vorbestehende Artefakt-/Source-Fehler — bereinigt, s. u.), Backend-Lint clean.
- **16 Commits**, je Feature einer. Auto-Merge auf `main` + Push am Ende.

## Changelog

### A — E-Mail-Flows mit Stub-Transport (5 Commits)
1. `feat(email): mail service abstraction…` — §7.1. Transport-Seam (console/noop/
   memory); `MAIL_TRANSPORT`/`APP_BASE_URL` dokumentiert. +5 BE.
2. `feat(auth): password reset flow…` — §2.1. `UserToken` (SHA-256, single-use),
   `/auth/forgot-password` (immer 200, keine Enumeration) + `/reset-password`
   (revoke Refresh-Tokens). Forgot/Reset-Seiten, toter Link entschärft. +4 BE/+4 FE.
3. `feat(auth): email verification flow` — §2.2. `emailVerifiedAt`, Token bei
   Registrierung, `/verify-email` + `/resend-verification`; Banner + Verify-Seite. +4/+4.
4. `feat(email): notify anonymous submitters…` — §7.2. Mail an anonyme Einreicher
   bei Statuswechsel (Idee/Report/Vorschlag). +2 BE.
5. `feat(email): RSVP confirmation email` — §7.3. Bestätigung für Mitglieder + Gäste. +2 BE.

### B — CI/CD + E2E (3 Commits)
6. `ci: lint, type-check, test, build and migration pipeline` — §8.5. Frontend- +
   Backend-Job (Postgres-Service, `migrate deploy` + Drift-Check).
7. `ci: run Playwright end-to-end tests on pull requests` — §11.2. PR-only, geseedete DB.
8. `ci: informational Lighthouse budget on PRs` — §11.4. PR-only, Warn-Schwellen.

### C — Test-Härtung & Coverage (2 Commits)
9. `test(a11y): jest-axe across all public pages…` — §11.1. 14 Seiten; **2 echte
   WCAG-Bugs gefixt** (PointsBadge role=img, Progressbar aria-label).
10. `test(backend): cover auth refresh/logout + submission flow; add coverage` —
    §11.1. Refresh→Logout-Zyklus + anonymer Submission-Flow; `@vitest/coverage-v8`
    + `test:coverage`.

### D — i18n-Vollständigkeit (1 Commit)
11. `feat(i18n): completeness tooling…` — §6.3. `scripts/check-i18n.mjs`
    (Key-Parität, CI-hart + Vitest-Test; advisory Hardcoded-Scan). 1 echte Lücke
    geschlossen (Login-Demo-Hinweis → `t('auth.demoHint')`).

### E — Moderation & Betrieb (3 Commits)
12. `feat(moderation): profanity filter on anonymous content` — §3.5. EN/DE/EL,
    Wortgrenzen (kein Scunthorpe), 400 `PROFANITY`. +6 BE.
13. `feat(ops): scheduled maintenance job…` — §5.6. `runMaintenance()` +
    `npm run cleanup:maintenance`. +1 BE.
14. `perf(images): async decoding everywhere + high-priority hero crest` — §6.6.
    `decoding=async`, LCP-Crest `fetchPriority=high`. (responsive `srcset` = offen,
    braucht Bild-Transform-Pipeline).

### F — 2FA für Admin-Konten (2 Commits)
15. `feat(auth): TOTP two-factor authentication with backup codes` — §2.5.
    Dependency-freies RFC-6238-TOTP + 10 single-use Backup-Codes (bcrypt).
    `/auth/2fa/setup|enable|disable`; Login-Challenge (`TWO_FACTOR_REQUIRED`/
    `INVALID_2FA`). Frontend: QR-Setup im Profil + 2FA-Schritt im Login. +6/+3.
16. `ci(lint): ignore build/coverage artifacts + fix pre-existing lint errors` —
    Root-`eslint .` grün: Artefakte (`**/dist`, `**/coverage`, `backend/**`)
    ignoriert; EventsPage-Effekt + TwoFactorSettings ohne synchrones setState;
    Honeypot-Ausnahme dokumentiert.

## Offene Caveats / 👤
- **Migrationen auf Prod/Dev-DB anwenden:** Die 4 neuen Migrationen (UserToken,
  emailVerifiedAt, twoFactor) sind in CI gegen frisches Postgres validiert, aber
  noch **nicht** auf der Supabase-Dev/Prod-DB ausgerollt (`npx prisma migrate deploy`).
- **Mailprovider** (👤): produktiver Versand braucht nur einen Provider-Transport
  in `mailService.ts` + Account/DKIM/SPF. Bis dahin loggt der Stub die Links.
- **Lighthouse-Schwellen** sind bewusst Warnungen → nach erstem CI-Baseline auf
  `error` ziehen. **responsive `srcset`** (§6.6-Rest) braucht eine Bild-Transform-
  Pipeline (Supabase render / CDN) — bewusst zurückgestellt.
- Backend-Dev-Vulns (Vitest/coverage-v8-Kette) unverändert bewusst offen.

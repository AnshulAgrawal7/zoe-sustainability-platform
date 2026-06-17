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

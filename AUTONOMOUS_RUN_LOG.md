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

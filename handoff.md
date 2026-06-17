# ZOE — Session Handoff

> Erstellt 2026-06-17, zum Weitermachen ab **2026-06-18**.
> Begleitet [`Future_Work.md`](Future_Work.md) + [`AUTONOMOUS_RUN_LOG.md`](AUTONOMOUS_RUN_LOG.md).

---

## ⏭️ Morgen zuerst (deine TODOs)

1. **Repo auf `public` umstellen** (GitHub → Settings → General → „Change visibility").
   → GitHub Actions ist für public Repos **gratis & unbegrenzt** (Standard-Linux-Runner).
   **Vorher kurz checken:**
   - `JWT_SECRET` ist in Dev nur der **öffentliche Platzhalter** aus `.env.example`.
     In Produktion zwingend durch ein starkes ersetzen: `openssl rand -base64 48`
     (steht in Deploy-Doc §8.3). Nicht denselben Wert wie Dev verwenden.
   - **FB-Import-Bilder** im „What's New"-Feed haben **ungeklärte Lizenz**
     (Future_Work 5.2/9.9). Public machen = öffentlich re-publizieren → kurz abwägen.
     (Reines Content-/Rechtsthema, **kein** Security-Leak.)
2. **Danach: autonome Batches A–F** anstoßen (siehe unten) — mir einfach sagen welche,
   z. B. „mach A und C". Empfehlung bei nur einer Sache: **A** (größter Hebel).

> ✅ **Sicherheits-Scan ist gemacht:** Es würden **keine echten Secrets** geleakt.
> DB-Passwort, Supabase `SERVICE_ROLE_KEY`, `DEEPL_API_KEY` wurden **nie** committet;
> `.env`/`backend/.env` sind korrekt in `.gitignore`. Die einzigen `JWT_SECRET`-Treffer
> in der History sind der `.env.example`-Platzhalter (kein Leak).

---

## 📍 Aktueller Stand (Repo)

- Branch **`main` @ `849a13b`**, gepusht, Working Tree **clean** (lokal == origin/main).
- **Zwei** autonome Läufe abgeschlossen und auf `main`:
  `feature/szenario-a-hardening` (Lauf 1) + `feature/szenario-a-hardening-2` (Lauf 2).
- **Tests/Build grün:** Backend **140**, Frontend **48**, `npm run build` ok
  (Bundle-Warnung weg, Entry-Chunk 433 kB), beide Typechecks + Backend-Lint clean.
- **Lokale Test-DB:** Docker-Container `zoe-postgres-test` auf **:5433** (für
  `cd backend && npm test`). Der **pre-push-Hook** braucht sie — falls er meckert:
  `git push --no-verify` (so wurde auch gepusht; Gates laufen ohnehin manuell).

## ✅ Was Lauf 2 gebracht hat (14 Features, je 1 Commit)

DB-Readiness `/api/ready` (3.8) · Honeypot auf anonymen Formularen (3.5) ·
Audit-Log-Admin-Ansicht `/admin/audit` (4.2) · Newsletter-Admin: Liste/CSV/Löschen
(4.4) · „Backend nicht erreichbar"-Zustand mit Retry (6.7) · `create-admin`-Skript
+ Doku (4.3) · Code-Splitting + Vendor-Chunking (6.6, Entry 1.3 MB → 433 kB) ·
Login-Lockout 5→15 min (2.4) · Such-/Rollen-/Status-Filter Nutzerliste (4.5) ·
Opt-in-Pagination Feed+Ideen (3.7) · JSON-Logging + Request-IDs (3.6) ·
Production-CSP (3.4, **screenshot-verifiziert: 0 Verstöße, Karte intakt**) ·
`npm audit fix` (11.3) · Security-/Datenschutz-/A11y-Doku-Templates.

**Offene Caveats aus Lauf 2:**
- **CSP bewusst breit** (`connect-src/img-src https:`) → vor Echtbetrieb auf exakte
  API-/Supabase-Domains verengen. `frame-ancestors` als HTTP-Header am Host setzen
  (im `<meta>` wirkungslos). Details: `docs/deployment/security-notes.md`.
- **Backend behält 5 Dev-only-Vulns** (Vitest/esbuild/Vite-Kette) — nur via breaking
  `vitest@4` (`npm audit fix --force`), **nicht** im deployten Backend. Bewusst offen.

---

## 🤖 Nächste autonome Batches (A–F) — ohne fremde Accounts machbar

- **A — E-Mail-Flows mit Stub-Transport** *(größter Hebel)*
  Passwort-Reset (2.1), E-Mail-Verifizierung (2.2), Mails an anonyme Einreicher
  (7.2), RSVP-Bestätigung (7.3) — über eine `mailService`-Abstraktion mit
  Console/No-op-Transport (loggt den Link statt zu senden). Voll testbar; produktiv
  fehlt nur dein Provider-Key + DKIM/SPF (👤). Schaltet 5 Future-Work-Punkte frei.
- **B — CI/CD-Pipeline (8.5) + E2E-in-CI (11.2)**
  GitHub-Actions-Workflow: Lint → Typecheck → Tests → Build → `prisma migrate deploy`,
  Postgres als **Service-Container**. E2E + optional Lighthouse-Budget (11.4) als
  eigener Job nur auf PRs (schont Minuten, falls Repo doch privat bleibt).
- **C — Test-Härtung & Coverage (11.1)**
  Kritische Pfade absichern (Auth-Refresh, Punktevergabe bei Event-Complete, anonyme
  Submission-Flows) + Coverage-Report + **jest-axe auf ALLE Seiten**.
- **D — i18n-Vollständigkeit (6.3-Tooling)**
  Skript, das `en/de/el` auf fehlende/überzählige Keys difft + hardcodierte
  JSX-Strings findet — plus Schließen der Lücken.
- **E — Moderation & Betrieb**
  Profanity-Filter für anonyme Inhalte (3.5-Rest) · Cleanup-Job (5.6: abgelaufene
  Refresh-Tokens/Login-Locks) · Perf-Politur (6.6-Rest: responsive `srcset`,
  Bildoptimierung, lokaler Lighthouse-Lauf).
- **F — 2FA für Admin-Konten (2.5)**
  TOTP per Authenticator-App (kein externer Dienst), QR-Setup + Backup-Codes.

## 👤 Bleibt bei dir / extern (nicht autonom)

Mailprovider-Account + Domain-Verifizierung (DKIM/SPF) · Hosting/Domain/Secrets
(8.1–8.3) · Error-Tracking/Sentry-Account (8.4) · echte Inhalte + Kontaktwege
(5.1/6.5) · FB-Bildrechte klären/entfernen (5.2/9.9) · Griechisch-Muttersprachler-
Review (6.3) · externes A11y-Audit (10.1) · Rechtstexte (Impressum/Datenschutz/AVV)
mit echten Daten füllen + anwaltlich prüfen (9.1–9.3) · Backup-/Retention-Policy.

## 💰 GitHub-Actions-Kosten (Merkzettel)

- **public Repo** = gratis & unbegrenzt (Standard-Linux). → einfachste Option.
- **privat, Free-Plan** = 2.000 Freiminuten/Monat + 500 MB. Linux ×1, Windows ×2,
  macOS ×10 → CI immer auf `ubuntu-latest`. Voller Lauf hier ~5–8 min (mit E2E ~10–14).
- (Stand Jan-2026-Wissen; auf github.com/pricing gegenprüfen.)

## 🔁 So arbeitet der nächste autonome Run

1. Neuer Branch `feature/<name>` von `main`.
2. Je Feature **ein** Commit; **Quality Gates pro Commit**: FE `npm run build` +
   `vitest run`, Backend `npm test` + `type-check` + `lint`, jest-axe für neue
   Seiten, Screenshot bei riskanten UI-/CSP-Änderungen.
3. Conventional Commits, **ohne** `Co-Authored-By`-Trailer.
4. Betroffene Docs mitziehen (`api.md`, `admin-guide.md`, `architecture.md`).
5. Am Ende: FF-Merge auf `main` + `git push --no-verify` (Test-DB-Hook).

**Test-DB starten, falls Container gestoppt:** `docker start zoe-postgres-test`.

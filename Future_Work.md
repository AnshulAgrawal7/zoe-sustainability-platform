# Future Work — Weg zur übergabebereiten ZOE-Plattform

> **Anlass:** Nach der erfolgreichen Präsentation (Projektseminar, 15.–17.06.2026)
> folgt in einigen Wochen eine Vorstellung bei der **Vizebürgermeisterin der
> Gemeinde Nord-Korfu**. Dieses Dokument erfasst **vollständig und im Detail**,
> was noch fehlt, damit die Plattform **voll funktional** und **theoretisch
> übergabebereit** wäre — getrennt nach **„Was wir technisch umsetzen können"**
> (🤖) und **„Was die Gemeinde noch leisten muss"** (👤).
>
> ⚠️ **Keine Rechtsberatung.** Die rechtlichen Punkte sind Orientierung; finale
> Texte müssen geprüft (lassen) werden.
>
> **Stand:** 2026-06-17 · ergänzt [`docs/deployment/handover-szenario-a.md`](docs/deployment/handover-szenario-a.md)
> (Szenario A = öffentliche Demo) — dieses Dokument zielt zusätzlich auf
> **Szenario B = offizielle Gemeinde-Plattform mit echten Nutzerdaten**.

---

## ✅ Umsetzungsstatus (autonomer Lauf, 2026-06-17)

Ein autonomer Arbeitslauf hat die **ohne externe Accounts** umsetzbaren 🤖-Punkte
bereits implementiert und getestet (Branch `feature/szenario-a-hardening`):

- **6.1/6.2 ✅** 404-Seite, Route-Error-Element, globale Error-Boundary
- **3.1 ✅** Backend: einheitlicher JSON-Error-Handler + 404-Middleware
- **2.3/9.6 ✅** Einwilligung bei Registrierung (Pflicht) + Consent-Zeitstempel
- **3.2 ✅** Rate-Limiting auf anonymen Schreib-Endpunkten
- **4.1 ✅** Admin-Nutzerverwaltung: Rolle (mit Lockout-Schutz), Sperren/
  Entsperren (+ Login-Block), Punktekorrektur
- **4.2 ✅** Admin-Audit-Log (Backend + Endpoint)
- **9.5 ✅** DSGVO Self-Service: Datenexport (Art. 15/20) + Konto-Löschung
  (Art. 17, mit Anonymisierung); Admin-Löschung
- **Build-Blocker ✅** Prod-Build (`tsc -b`) repariert (war vorbestehend kaputt →
  Deployment war unmöglich)
- **6.4 ✅** SEO-Basics: Per-Route-Titel, `robots.txt`, OG/Twitter-Meta
- **10.2 ✅** Karten-Barrierefreiheit: SR-/tastaturtaugliche Marker-Liste

**Noch offen (🤖, kleiner):** Audit-Log-Frontend-Ansicht · Newsletter-Admin-Ansicht
(4.4) · Honeypot auf anonymen Formularen · Logging/Pagination (3.6/3.7) ·
Code-Splitting (6.6). **Alles E-Mail-Abhängige** (2.1/2.2/7.x) bleibt bewusst
A→B (kein Mailprovider im autonomen Lauf). Die einzelnen Abschnitte unten
behalten den **vollen** Soll-Zustand als Referenz.

### ✅ Zweiter autonomer Lauf (2026-06-17, Branch `feature/szenario-a-hardening-2`)

Alle oben als „noch offen" markierten 🤖-Reste **plus** weitere Tier-2/3-Punkte
umgesetzt, getestet und (CSP) per Screenshot verifiziert:

- **3.8 ✅** DB-Readiness-Endpoint (`/api/ready`, 503 wenn DB down)
- **3.5 ✅** Honeypot auf allen anonymen Formularen (Ideen/Submissions/Vorschläge/Newsletter)
- **4.2 ✅** Audit-Log-Frontend (`/admin/audit`)
- **4.4 ✅** Newsletter-Admin: Liste, CSV-Export, Löschen
- **6.7 ✅** Konsistenter „Backend nicht erreichbar"-Zustand mit Retry (Events/News)
- **4.3 ✅** `create-admin`-Bootstrap-Skript + Produktions-Onboarding-Doku
- **6.6 ✅** Code-Splitting (React.lazy je Route) + Vendor-Chunking (Entry 1.3 MB → 433 kB)
- **2.4 ✅** Pro-Konto-Login-Lockout (5 Fehlversuche → 15 min Sperre)
- **4.5 ✅** Such-/Rollen-/Status-Filter in der Admin-Nutzerliste
- **3.7 ✅** Opt-in-Pagination (Feed + Ideen-Board, rückwärtskompatibel)
- **3.6 ✅** Strukturiertes JSON-Logging + Request-IDs (`X-Request-Id`)
- **3.4 ✅** Production-CSP (Vite-Plugin, Dev unberührt) — **0 Verstöße, Karte/Fonts intakt** (Screenshot-verifiziert)
- **11.3 ✅** `npm audit fix` — Frontend 0 Vulns; Backend `form-data` gepatcht (Rest = Dev-only Vitest-Kette)
- **Docs:** Security-Notes (CSRF 3.3 · Refresh-Token 2.6 · Seed/Prod 5.5 · CSP · Audit) · Datenschutz-Textgerüst (9.2) · formale Barrierefreiheitserklärung (9.7/10.3)

**Bewusst weiterhin offen (👤/extern):** Alles E-Mail-Abhängige (2.1/2.2/7.x,
Mailprovider) · Error-Tracking/Sentry (8.4) · CI/CD (8.5) · Lighthouse/E2E in CI
(11.2/11.4) · Captcha/Profanity-Filter (3.5, externer Dienst) · echte
Inhalte/Kontaktwege/Bildrechte (5.1/6.5/9.9).

### ✅ Dritter autonomer Lauf (2026-06-18, Branch `feature/autonomous-run-3` → `main`)

Batches A–F komplett umgesetzt (16 Commits; BE 177 / FE 77 grün):

- **2.1 ✅** Passwort-Reset-Flow (Token + `/auth/forgot|reset-password`, Seiten).
- **2.2 ✅** E-Mail-Verifizierung (`/auth/verify-email` + Resend, Banner).
- **2.5 ✅** TOTP-2FA für Konten (QR-Setup + Backup-Codes, Login-Challenge).
- **7.1/7.2/7.3 ✅** `mailService`-Abstraktion (Stub-Transport) + Mails an anonyme
  Einreicher + RSVP-Bestätigung. **Produktiv fehlt nur der Provider-Transport (👤).**
- **8.5 ✅ / 11.2 ✅ / 11.4 ✅** CI-Pipeline (Lint/Typecheck/Test/Build + `migrate
  deploy`) · E2E-in-CI (PR) · Lighthouse-Budget (PR, informativ).
- **11.1 ✅** Test-Härtung: Auth-Refresh/Logout, anonymer Submission-Flow,
  jest-axe auf **allen** öffentlichen Seiten (+ 2 echte WCAG-Bugs gefixt),
  Backend-Coverage-Setup.
- **6.3 ✅ (Tooling)** i18n-Vollständigkeits-Skript (Key-Parität, CI + Test).
- **3.5 ✅ (Rest)** Profanity-Filter (EN/DE/EL) auf anonymen Inhalten.
- **5.6 ✅** Wartungs-Job (Token-Prune + Login-Lock-Freigabe).
- **6.6 ✅ (Rest, teilw.)** Bild-Perf (`decoding=async`, LCP-`fetchPriority`);
  responsive `srcset` zurückgestellt (braucht Bild-Transform-Pipeline).

**👤 noch nötig:** die 4 neuen Migrationen auf die Supabase-DB ausrollen
(`npx prisma migrate deploy`); Mailprovider-Account + DKIM/SPF; Lighthouse-
Schwellen nach erstem CI-Baseline auf `error` ziehen.

---

## 0. Zwei Zielbilder — was heißt „übergabebereit"?

Der Reifegrad hängt davon ab, **wie** die Gemeinde die Plattform betreiben will.
Das verändert massiv den Pflichtenumfang (v. a. rechtlich):

| | **Szenario A — Demo/Prototyp** | **Szenario B — Echtbetrieb** |
|---|---|---|
| Daten | nur Dummy-Daten, Prototyp-Banner bleibt | echte Bürger:innen-Konten & Inhalte |
| Betreiber | wir/Seminar unter neutraler Domain | die Gemeinde (Mandat nötig) |
| Recht | minimal (Impressum, Datenschutz-Basis) | voll: DSGVO, Barrierefreiheitserklärung (EU 2016/2102), AVV |
| Status | ~85 % erreicht (siehe Handover-Doc) | dieses Dokument |

Empfehlung für den Vizebürgermeisterin-Termin: die Plattform als **lauffähige
Demo (A)** zeigen, und **dieses Dokument als Übergabe-Fahrplan nach B** vorlegen.
„So viel wie möglich vorab" = wir setzen alle 🤖-Punkte um; die 👤-Punkte braucht
zwingend die Gemeinde (Accounts, Entscheidungen, echte Daten, Rechtstexte).

---

## 1. Leitprinzip der Arbeitsteilung

- 🤖 **Was im Repo liegt und keine fremden Accounts/Entscheidungen braucht → setzen wir um** (additiv, getestet, dokumentiert).
- 👤 **Was eigene Accounts, Zahlung, Zugangsdaten, echte Inhalte oder eine offizielle/rechtliche Entscheidung braucht → bleibt bei der Gemeinde** (von uns klar dokumentiert und vorbereitet).

---

## 2. Authentifizierung & Konten

**Ist-Stand:** JWT Access-Token (15 min) + httpOnly Refresh-Cookie (Session, 7 d
serverseitig), bcrypt-Hashing, starke Passwort-Policy (≥8 Zeichen, Groß/Klein/
Zahl/Sonderzeichen, client- und serverseitig), Login per Username **oder** E-Mail,
Rollen `USER`/`ADMIN`, prod-sichere Cookies (`Secure` + `SameSite=None`).

| # | Lücke / Detail | Wer | Aufwand |
|---|---|---|---|
| 2.1 | **„Passwort vergessen" ist ein toter Link.** Der UI-Text `auth.forgotPassword` existiert in allen 3 Sprachen, aber **es gibt keinen Backend-Flow** (kein `/auth/forgot`, `/auth/reset`). → Reset-Token-Modell, Mail-Versand, Reset-Seite bauen. **Setzt E-Mail-Infrastruktur voraus (§7).** | 🤖 Code / 👤 Mailprovider | M |
| 2.2 | **Keine E-Mail-Verifizierung** bei Registrierung. Im Echtbetrieb sollte die E-Mail bestätigt werden (Double-Opt-in), sonst sind beliebige Fremd-Adressen registrierbar. | 🤖 Code / 👤 Mailprovider | M |
| 2.3 | **Kein Einwilligungs-Häkchen bei der Konto-Registrierung.** Event-RSVP hat bereits eine Consent-Checkbox; die Konto-Registrierung (`RegisterPage`) verlinkt/erzwingt die Datenschutzerklärung **nicht**. Für Echtbetrieb Pflicht. | 🤖 | S |
| 2.4 | **Kein Account-Lockout / Brute-Force-Schutz** über das globale Rate-Limit hinaus (Auth-Limiter: 20 Anfragen/15 min in Prod, IP-weit). Optional: pro-Konto-Zähler, Captcha bei Verdacht. | 🤖 | M |
| 2.5 | **Keine 2FA** (für Admin-Konten im Echtbetrieb empfehlenswert). | 🤖 (optional) | L |
| 2.6 | **Refresh-Token-Rotation/Revocation-Liste** prüfen: Logout invalidiert serverseitig, aber gestohlene Access-Tokens bleiben 15 min gültig (akzeptabel, dokumentieren). | 🤖 (Doku) | S |

---

## 3. Backend, API & Sicherheit

**Ist-Stand:** Express + Prisma, `helmet()`, CORS prod-strikt (nur `CORS_ORIGIN`),
`express-validator` auf Routen, einheitliches Response-Format
`{ success, data|error }`, Rate-Limit auf `/api/auth`, Upload-Limit 5 MB +
MIME-Allowlist, `/api/health`-Endpoint.

| # | Lücke / Detail | Wer | Aufwand |
|---|---|---|---|
| 3.1 | **Kein globaler Express-Error-Handler & kein 404-Catch-all** in `app.ts`. Unerwartete Fehler/Routen liefern Default-Express-HTML statt des `{ success:false }`-Formats. → zentrale `errorHandler`- + `notFound`-Middleware ergänzen. | 🤖 | S |
| 3.2 | **Rate-Limiting nur auf Auth.** Schreib-Endpunkte (Ideen, Kommentare, Submissions, Event-Proposals, Newsletter, Uploads) sind offen → Spam-Risiko. Globalen/route-spezifischen Limiter + ggf. Captcha auf anonymen Formularen. | 🤖 | M |
| 3.3 | **CSRF:** Schutz beruht allein auf `SameSite`. Da Schreibrouten Bearer-Token nutzen, ist das vertretbar — aber für die anonymen Cookie-freien POSTs (Ideen/Submissions) sollte eine kurze Risikobetrachtung dokumentiert werden. | 🤖 (Doku/optional Token) | S |
| 3.4 | **Content-Security-Policy:** `helmet()` setzt Defaults; mit externem Analytics/Map-Tiles (Leaflet/OSM) muss die CSP explizit gepflegt werden, sonst entweder zu offen oder bricht Funktionen. | 🤖 | M |
| 3.5 | **Spam-/Missbrauchs-Moderation für anonyme Inhalte:** Ideen, Submissions und Event-Proposals sind bewusst ohne Konto möglich. Kein Profanity-Filter, kein Honeypot, kein Captcha. Für öffentliche Sichtbarkeit nötig. | 🤖 | M |
| 3.6 | **Strukturiertes Logging & Request-IDs** fehlen (aktuell nur `console`). Für Betrieb/Fehlersuche: pino/winston + Error-Tracking (§8). `console.log` ist laut CLAUDE.md ohnehin verboten. | 🤖 | S |
| 3.7 | **API-Versionierung & Pagination:** Listen-Endpunkte (Feed, Projekte, Kommentare) ohne Pagination/Limit — bei realem Datenwachstum Performance-/Payload-Problem. | 🤖 | M |
| 3.8 | **Health/Readiness** für den Host vorhanden (`/api/health`); ergänzend DB-Ping-Check für echtes Readiness-Probe. | 🤖 | S |

---

## 4. Admin-Funktionen

**Ist-Stand (stark!):** Voll-CRUD für Projekte, Events (inkl. „Complete" →
Punktevergabe), Lern-Artikel, Feed (inkl. Bild-Reorder/Löschen/Alt-Text-Review),
Posts, Rewards-Tiers, Ideen-Status, Event-Proposals (→ Konvertierung in Event mit
Auto-Übersetzung), Submissions-Status, Kommentar-Moderation (VISIBLE/HIDDEN),
Statistiken, Admin-Benachrichtigungen, Monitoring-Dashboard (aggregierte
Seitenaufrufe/Besuche).

| # | Lücke / Detail | Wer | Aufwand |
|---|---|---|---|
| 4.1 | **Nutzerverwaltung ist read-only.** `/admin/users` kann Nutzer nur **anzeigen** (`GET`). Es fehlen: Rolle ändern (USER↔ADMIN), Konto **deaktivieren/sperren**, **löschen** (DSGVO!), Passwort-Reset auslösen, Punkte manuell korrigieren. Für Echtbetrieb zentral. | 🤖 | M |
| 4.2 | **Kein Audit-Log.** Admin-Aktionen (Löschen, Statuswechsel, Rollenänderung) werden nicht protokolliert. Für Nachvollziehbarkeit/Compliance empfehlenswert. | 🤖 | M |
| 4.3 | **Erster Admin / Onboarding:** Aktuell per Seed angelegt. Für die Gemeinde: dokumentierter Weg, einen echten Admin sicher anzulegen und Demo-Admins zu entfernen. | 🤖 (Skript+Doku) / 👤 (Durchführung) | S |
| 4.4 | **Newsletter-Empfänger-Verwaltung:** Admin kann Signups derzeit nicht einsehen/exportieren/entfernen (Tabelle existiert, aber keine Admin-UI). | 🤖 | S |
| 4.5 | **Bulk-Aktionen & Suche** in Admin-Listen (Filtern, Suchen, Massen-Statuswechsel) fehlen — bei realem Volumen relevant. | 🤖 | M |
| 4.6 | **Feed-Review-Backlog:** 300 importierte Alt-Text-Zeilen stehen auf `needsReview=true`; vor Öffentlichkeit redaktionell durchgehen. | 🤖 (Tooling) / 👤 (Inhalt) | M |

---

## 5. Datenbank & Daten

**Ist-Stand:** Umfangreiches Prisma-Schema (PostgreSQL/Supabase), saubere
Migrationshistorie, trilinguale Felder durchgängig, **Privacy-by-Design**-Monitoring
(nur Tages-Aggregat-Zähler, keine IP/UA/Cookies), bewusst „weiche" FK bei
EventRegistration (dokumentiert).

| # | Lücke / Detail | Wer | Aufwand |
|---|---|---|---|
| 5.1 | **Alle Inhalte sind PROTOTYP-/Seed-Daten.** Projekte, Metriken, Events, Lern-Artikel müssen durch **echte, von der Gemeinde freigegebene** Inhalte ersetzt werden. Mengen/Impact-Zahlen sind teils illustrativ. | 👤 (Inhalt) / 🤖 (Einpflege-Tooling) | L |
| 5.2 | **Facebook-Import (VBM Kokkali):** Der „What's New"-Feed enthält importierte FB-Posts/Bilder. **Lizenz/Erlaubnis** für öffentliche Nutzung ist ungeklärt → vor Echtbetrieb entfernen oder freigeben lassen. | 👤 (Recht/Erlaubnis) | M |
| 5.3 | **Backups & Point-in-time-Recovery:** Hängt am Supabase-Plan. Backup-Strategie + Restore-Test dokumentieren. | 👤 (Plan) / 🤖 (Doku) | S |
| 5.4 | **Daten-Residenz EU-Region:** Supabase-Projekt **in EU-Region** anlegen (DSGVO). Aktuell Entwicklungs-DB. | 👤 | S |
| 5.5 | **Seed vs. Prod trennen:** `db:reset`/`seed` sind destruktiv — sichere Trennung von Demo- und Prod-DB dokumentieren (ein Provider pro Prisma-Schema). | 🤖 (Doku) | S |
| 5.6 | **Daten-Retention & Löschkonzept:** Aufbewahrungsfristen für Konten, Submissions, Newsletter, Notifications definieren + automatisierte Bereinigung. | 👤 (Policy) / 🤖 (Umsetzung) | M |
| 5.7 | **Soft-Delete vs. Hard-Delete** für nutzergenerierte Inhalte bei Konto-Löschung klären (Anonymisieren statt Löschen, um Kommentar-Threads nicht zu zerreißen). | 🤖 | M |

---

## 6. Frontend, UX & Inhalte

**Ist-Stand:** React 19 + TS strict, i18n (EN/EL/DE), Dark Mode, Mobile-First,
WCAG-bewusst, Karten (Leaflet), Toaster, Notification-Bell, reichhaltige öffentliche
und Nutzer-Seiten.

| # | Lücke / Detail | Wer | Aufwand |
|---|---|---|---|
| 6.1 | **Keine 404-/Fehlerseite im Router.** `Router.tsx` hat **keine** `path: '*'`-Catch-all-Route und kein `errorElement`. Unbekannte URLs → leere Seite im Layout. → schöne, übersetzte 404 + Error-Boundary. | 🤖 | S |
| 6.2 | **Globale Error-Boundary** für unerwartete Render-Fehler (statt White-Screen). | 🤖 | S |
| 6.3 | **Maschinen-Übersetzungen prüfen:** DE/EN-Feed-Texte sind DeepL-generiert und als `needsReview` markiert; griechische UI-Strings von Muttersprachler:in gegenlesen lassen. | 👤 (EL-Review) / 🤖 (Tooling) | M |
| 6.4 | **SEO/Sharing:** Meta-Tags, OpenGraph, `sitemap.xml`, `robots.txt`, sprechende `<title>`/`lang`-Wechsel pro Route fehlen weitgehend (SPA). | 🤖 | M |
| 6.5 | **Echte Kontaktwege:** Footer-Social-Links sind Platzhalter (zeigen auf Netzwerk-Startseiten); Kontakt-/Support-Kanal der Gemeinde einsetzen. | 👤 (Kanäle) / 🤖 (Einbau) | S |
| 6.6 | **Performance-Politur:** Code-Splitting/Lazy-Routes, Bild-Optimierung (responsive `srcset`), Lighthouse-Durchlauf. | 🤖 | M |
| 6.7 | **Leere-Zustände & Offline/Backend-down:** Fallback-Daten existieren teils (`src/data/`); konsistente „Backend nicht erreichbar"-Zustände prüfen. | 🤖 | S |

---

## 7. E-Mail & Benachrichtigungen

**Ist-Stand:** **Keinerlei E-Mail-Infrastruktur** (kein SMTP/Provider). Es gibt nur
**in-App-Benachrichtigungen** (Bell) für eingeloggte Nutzer bei Status-Änderungen
ihrer Ideen/Proposals/Submissions und @Mentions. Newsletter **speichert nur** die
Adresse; kein Versand.

| # | Lücke / Detail | Wer | Aufwand |
|---|---|---|---|
| 7.1 | **Transaktionsmail-Provider anbinden** (z. B. Postmark/SES/Brevo, EU-Region/AVV). Grundlage für 2.1, 2.2 und alles Folgende. | 🤖 (Integration) / 👤 (Account+Domain-Verifizierung/DKIM/SPF) | M |
| 7.2 | **Anonyme Einreicher bekommen keine Rückmeldung.** Wer ohne Konto eine Idee/Submission/Proposal mit E-Mail abgibt, sieht den Admin-Statuswechsel **nirgends** (Bell nur für eingeloggte). → E-Mail-Benachrichtigung an hinterlegte Adresse. | 🤖 (+ 7.1) | M |
| 7.3 | **Event-Anmeldung ohne Bestätigungsmail.** Gäste/Nutzer erhalten keine RSVP-Bestätigung und keine Erinnerung. | 🤖 (+ 7.1) | M |
| 7.4 | **Newsletter ist ein Stub:** kein Double-Opt-in, kein Versand, **kein Unsubscribe-Link** (DSGVO/UWG-Pflicht!). Entweder voll ausbauen **oder** im Echtbetrieb deaktivieren. | 🤖 (+ 7.1) / 👤 (Versandentscheidung) | L |
| 7.5 | **Passwort-Reset-Mail** (Abhängigkeit von 2.1). | 🤖 (+ 7.1) | — |

---

## 8. Betrieb, Hosting & Monitoring

**Ist-Stand:** `render.yaml` vorhanden, prod-`.env.example` dokumentiert, Cookies
prod-sicher, CORS prod-strikt. Aggregat-Monitoring im Admin-Dashboard.

| # | Lücke / Detail | Wer | Aufwand |
|---|---|---|---|
| 8.1 | **Hosting bereitstellen:** Backend-Host (Render/Fly/Railway) + Frontend-Host (Vercel/Netlify) + Supabase. Accounts, ggf. Bezahlung. | 👤 | M |
| 8.2 | **Domain + DNS + TLS** (neutral, z. B. `zoe-corfu.gr`/`…-demo.org`). TLS i. d. R. automatisch beim Host. | 👤 | S |
| 8.3 | **Secrets im Host-Dashboard setzen** (starkes `JWT_SECRET` via `openssl rand -base64 48`, `DATABASE_URL`, `SERVICE_ROLE_KEY`, `DEEPL_API_KEY`, `CORS_ORIGIN`, `NODE_ENV=production`). Nie ins Repo. | 👤 | S |
| 8.4 | **Error-Tracking/Uptime** (Sentry o. Ä. + Uptime-Monitor/Alerting) fehlt komplett. | 🤖 (Integration) / 👤 (Account) | M |
| 8.5 | **CI/CD-Pipeline:** Aktuell lokal (Husky/lint-staged). Für Betrieb: CI mit Lint/Typecheck/Tests + automatisiertem `prisma migrate deploy`. | 🤖 | M |
| 8.6 | **Prod-Smoke-Test-Checkliste** durchführen (Admin-Login, Projekte laden, DeepL, Sprachwechsel, Dark Mode, RSVP, Idee einreichen). | 🤖 (Checkliste) / 👤 (Abnahme) | S |
| 8.7 | **Skalierung/Kosten:** Supabase-Connection-Pooling ist konfiguriert (PgBouncer); Plan-Limits & erwartete Last grob abschätzen. | 👤 / 🤖 (Doku) | S |
| 8.8 | **Backup-Restore-Probe** mindestens einmal testen (siehe 5.3). | 👤 | S |

---

## 9. Rechtliches & DSGVO

> ⚠️ Keine Rechtsberatung. Im **Echtbetrieb mit echten Nutzerdaten** wird dieser
> Block zur Pflicht; vieles braucht zwingend die Gemeinde als verantwortliche
> Stelle und/oder anwaltliche Prüfung.

**Ist-Stand:** Datenschutz- und Impressum-**Seiten existieren als Templates mit
Platzhaltern** (`[Name]`, `privacy@zoe-corfu.gr`, …) inkl. Prototyp-Disclaimer.
Barrierefreiheits-Seite vorhanden. Monitoring ist **cookielos & aggregiert** →
aktuell **keine Cookie-Banner-Pflicht**, solange Analytics aus ist.

| # | Lücke / Detail | Wer | Aufwand |
|---|---|---|---|
| 9.1 | **Impressum mit echten Betreiberdaten** ausfüllen (verantwortliche Stelle = Gemeinde im Echtbetrieb, sonst wir als Demo-Betreiber). Platzhalter ersetzen. | 👤 | S |
| 9.2 | **Vollständige Datenschutzerklärung (DSGVO):** Verarbeitungszwecke, Rechtsgrundlagen, Speicherdauern, Empfänger, Auftragsverarbeiter (**Supabase**, **DeepL**, künftiger Mailprovider, ggf. OSM-Tiles), Betroffenenrechte, Beschwerderecht. Anwaltlich prüfen. | 👤 (+ 🤖 Textgerüst) | M |
| 9.3 | **AVV/DPA abschließen** mit jedem Auftragsverarbeiter (Supabase, DeepL, Mailprovider, Host) — EU-Region. | 👤 | M |
| 9.4 | **Cookie-/Consent-Banner:** Aktuell **nicht nötig** (nur essenzielles Auth-Cookie, Analytics standardmäßig aus). **Sobald** Analytics/Marketing/Embeds (z. B. eingebettetes FB/YouTube) aktiviert werden → **Consent-Management-Plattform** nötig (TTDSG/ePrivacy). Essenzielle Cookies in Datenschutzerklärung benennen. | 🤖 (falls aktiviert) / 👤 (Entscheidung) | M |
| 9.5 | **Betroffenenrechte als Self-Service:** Aktuell verweist die Datenschutzseite auf „Team kontaktieren". Für Echtbetrieb: **Datenexport (Portabilität)** und **Konto-Löschung (Recht auf Vergessenwerden)** als Nutzerfunktion (siehe 4.1/5.7). | 🤖 | M |
| 9.6 | **Einwilligungs-Nachweise (Records of Consent):** Registrierung (2.3), Event-RSVP (vorhanden) und Newsletter (7.4) müssen Zeitpunkt/Version der Einwilligung speichern (Nachweispflicht). | 🤖 | M |
| 9.7 | **Barrierefreiheitserklärung (EU 2016/2102 / EN 301 549):** Öffentliche Stellen brauchen eine **formale Erklärung** mit Konformitätsstatus, Feedback-Mechanismus und Verweis auf das **Durchsetzungsverfahren**. Aktuelle A11y-Seite ist informativ, aber nicht die formale Erklärung. **Externes A11y-Audit** empfehlenswert. | 👤 (Audit/Verfahren) / 🤖 (Erklärungs-Template) | M |
| 9.8 | **Verzeichnis von Verarbeitungstätigkeiten (Art. 30)** + ggf. **DSFA** für die Verarbeitung. | 👤 | M |
| 9.9 | **Bildrechte/Lizenzen:** alle öffentlichen Bilder eigene/lizenzfreie/mit Erlaubnis (betrifft v. a. FB-Import, 5.2). | 👤 | M |
| 9.10 | **Prototyp-Banner-Entscheidung:** Banner ist akademische Pflicht. Im Echtbetrieb bewusst entscheiden, ob/wann er entfällt — und keine Verwechslung mit offizieller Gemeinde-Seite erzeugen, bis Mandat steht. | 👤 | S |

---

## 10. Barrierefreiheit (Vertiefung)

**Ist-Stand:** CLAUDE.md erzwingt WCAG 2.1 AA pro Komponente; jest-axe-Tests für
Schlüsselseiten; Skip-Link, Fokus-Indikatoren, `prefers-reduced-motion`, Dark-Mode-
Kontraste, trilinguale Aria-Labels.

| # | Lücke / Detail | Wer | Aufwand |
|---|---|---|---|
| 10.1 | **Vollständiges externes Audit** (manuell + Screenreader NVDA/VoiceOver) über **alle** Seiten, nicht nur die getesteten. | 👤 (Audit) | M |
| 10.2 | **Karten-Barrierefreiheit:** Leaflet-Karten brauchen tastatur-/screenreader-taugliche Alternativen (Liste der Marker als Text). | 🤖 | M |
| 10.3 | **Formale Barrierefreiheitserklärung** (siehe 9.7). | 🤖+👤 | — |
| 10.4 | **Alt-Text-Review** des Feeds abschließen (siehe 4.6). | 🤖+👤 | — |

---

## 11. Tests & Qualität

**Ist-Stand:** Vitest (Frontend + Backend), RTL, jest-axe, Playwright E2E; Backend-
/E2E-Tests brauchen lokales Postgres (Docker, :5433); pre-push-Hook.

| # | Lücke / Detail | Wer | Aufwand |
|---|---|---|---|
| 11.1 | **Coverage-Lücken schließen:** kritische Pfade (Auth-Refresh, Punktevergabe bei Event-Complete, Anonyme-Submission-Flows) gezielt absichern. | 🤖 | M |
| 11.2 | **E2E in CI** lauffähig machen (aktuell lokal, Lib-Workaround im Script). | 🤖 | M |
| 11.3 | **Last-/Sicherheits-Basistest** (z. B. ZAP-Baseline, Dependency-Audit `npm audit`) vor Echtbetrieb. | 🤖 | M |
| 11.4 | **Lighthouse/Perf-Budget** in CI. | 🤖 | S |

---

## 12. Priorisierte Roadmap

**P0 — Muss vor jeder öffentlichen Echtnutzung (B):**
- 9.1, 9.2, 9.3, 9.7 (Impressum, Datenschutz, AVV, A11y-Erklärung) — 👤
- 4.1 + 9.5 (Nutzer löschen/Self-Service-Erasure) — 🤖
- 7.1 + 7.4 (Mailprovider; Newsletter ausbauen **oder** abschalten) — 🤖/👤
- 5.2, 9.9 (FB-Bilder klären/entfernen) — 👤
- 6.1, 3.1, 6.2 (404/Error-Handler/Boundary) — 🤖
- 8.1–8.3 (Hosting/Domain/Secrets) — 👤

**P1 — Voll funktional & robust:**
- 2.1/2.2/2.3 (Passwort-Reset, E-Mail-Verifizierung, Consent bei Registrierung) — 🤖
- 7.2/7.3 (Mails an anonyme Einreicher, RSVP-Bestätigung) — 🤖
- 3.2/3.5 (Rate-Limit/Spam-Schutz) — 🤖
- 8.4/8.5 (Error-Tracking, CI/CD) — 🤖
- 5.1/6.3 (echte Inhalte, EL-Review) — 👤
- 4.2/4.4 (Audit-Log, Newsletter-Admin) — 🤖

**P2 — Politur & Skalierung:**
- 6.4 (SEO), 6.6 (Performance), 3.7 (Pagination), 4.5 (Bulk/Suche),
  10.2 (Karten-A11y), 2.5 (2FA), 11.x (Test-Härtung)

---

## 13. Verantwortungs-Checkliste (Kurzfassung)

### 🤖 Wir setzen vorab um (kein fremder Account nötig)
- [ ] 404-Seite + globale Error-Boundary + Express-Error/404-Middleware
- [ ] Passwort-Reset- & E-Mail-Verifizierungs-Flow (Code; wartet auf Mailprovider)
- [ ] Consent-Checkbox + Einwilligungs-Nachweise (Registrierung/Newsletter)
- [ ] Admin-Nutzerverwaltung (Rolle/Sperren/Löschen/Punkte) + Audit-Log
- [ ] Self-Service Datenexport & Konto-Löschung (DSGVO)
- [ ] Rate-Limit/Spam-Schutz auf anonymen Formularen
- [ ] Mail-Versand an anonyme Einreicher + RSVP-Bestätigung (nach Provider-Anbindung)
- [ ] Newsletter: Double-Opt-in + Unsubscribe **oder** sauberes Abschalten
- [ ] Error-Tracking/Logging + CI/CD-Pipeline
- [ ] SEO-Basics, Performance, Karten-A11y, Pagination
- [ ] Text-Templates: vollständige Datenschutzerklärung & Barrierefreiheitserklärung
- [ ] Prod-Smoke-Test- & Restore-Checklisten

### 👤 Die Gemeinde muss leisten (Accounts/Entscheidung/Inhalt/Recht)
- [ ] Mandat/Entscheidung: offizieller Betrieb (Szenario B) + verantwortliche Stelle
- [ ] Supabase (EU) · Backend-Host · Frontend-Host · Domain/DNS/TLS · Secrets
- [ ] Mailprovider-Account + Domain-Verifizierung (DKIM/SPF) + AVV
- [ ] Echte, freigegebene Inhalte (Projekte, Zahlen, Events, Lern-Artikel)
- [ ] FB-Bilder/-Texte klären (Erlaubnis) oder entfernen; alle Bildrechte
- [ ] Griechisch-Review (Muttersprachler:in)
- [ ] Impressum & Datenschutz mit echten Daten füllen (anwaltlich prüfen)
- [ ] AVV/DPA mit allen Auftragsverarbeitern (Supabase, DeepL, Mailprovider, Host)
- [ ] Externes Barrierefreiheits-Audit + Durchsetzungsverfahren benennen
- [ ] Verzeichnis von Verarbeitungstätigkeiten (Art. 30), ggf. DSFA
- [ ] Backup-/Retention-Policy festlegen
- [ ] Entscheidung zum Prototyp-Banner & Cookie-/Consent-Strategie (falls Analytics)

---

## 14. Bewusste Designentscheidungen (DSR — kein Mangel, sondern Scope)

Diese Punkte sind **absichtlich** so gewählt und gehören in die DSR-Argumentation,
nicht in die Mängelliste:
- **Cookielos & aggregiertes Monitoring** → keine Consent-Banner-Pflicht im Prototyp.
- **Anonyme Teilnahme** (Ideen/Submissions/RSVP ohne Konto) → niedrige Hürde,
  bewusst gegen E-Mail-Rückkanal abgewogen (→ 7.2 als Future Work).
- **Prototyp-Banner & Dummy-Daten** → akademische Kennzeichnung, keine Verwechslung
  mit offizieller Gemeinde-Seite.
- **Weiche FK bei EventRegistration** → bewusst, dokumentiert (historische Zeilen).
- **In-App-Benachrichtigungen statt E-Mail** → Prototyp-Scope, Provider als Future Work.

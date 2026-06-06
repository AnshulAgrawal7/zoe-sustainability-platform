# Feature-Evaluation — Machbarkeit & Empfehlungen

> ZOE-Plattform Nord-Korfu · laufendes Bewertungsdokument für neue Feature-Wünsche.
> Bewertet **was machbar ist und was nicht**, mit Aufwand, Risiken, Empfehlung und DSR-Bezug.
> Stand: 2026-06-06 · Branch `claude/nightly-run`. *Noch nicht implementiert — reine Einschätzung.*

Legende Machbarkeit: ✅ machbar/empfohlen · 🟡 machbar mit Einschränkungen · ⚠️ heikel (rechtlich/technisch) · ❌ nicht sinnvoll/nicht zulässig.

## Überblick

| # | Wunsch | Machbar? | Aufwand | Kurzempfehlung |
|---|---|---|---|---|
| 1 | Datenbank (Supabase) anbinden | ✅ | S–M | **Ja** — als gehostetes Postgres via Prisma; eigene Auth behalten; Supabase Storage für Bilder |
| 2a | Bilder/Texte automatisch von Frau Kokkalis FB-Seite extrahieren | ❌ / ⚠️ | — | **Nicht automatisiert** (FB-ToS/API-Hürden). Stattdessen: manuell mit Erlaubnis sammeln + per Admin (mit DeepL) eintragen |
| 2b | Abgeschlossene Projekte auf der Website zeigen | ✅ | S–M | **Ja** — DB unterstützt das bereits (`status: COMPLETED`); Bildfeld ergänzen, OPEN-Filter erweitern |
| 3 | Komplett online auf eigener Domain schalten | 🟡 | M–L | **Technisch machbar** (Supabase + Hosting + Domain); **rechtlich** Betreiber/DSGVO/Impressum/Bildrechte/Barrierefreiheit klären |

---

## 1. Datenbank anbinden (Supabase) — ✅ machbar & sinnvoll

### Ausgangslage (wichtig)
Ihr habt **bereits eine Datenbank**: Backend mit **Prisma + SQLite**, vollständiges Schema (`User`, `Project`, `Participation`, `Badge`, `RefreshToken`), JWT-Auth und Admin-CRUD. Es geht also **nicht** um „anbinden von null", sondern um **Umstieg von lokaler SQLite-Datei auf eine gehostete Datenbank**.

### Warum Supabase sinnvoll ist
- **Persistenz & Team-Sharing:** Eine gehostete DB bedeutet, dass eingegebene Projekte/Bilder erhalten bleiben und für alle im Team sichtbar sind (nicht nur in einer lokalen `dev.db`).
- **Postgres + Prisma:** Supabase ist gehostetes **Postgres**. Prisma unterstützt Postgres nativ → Umstieg = v. a. `provider` + `DATABASE_URL` ändern und Migrationen neu laufen lassen. **Kleiner Eingriff.**
- **Supabase Storage:** integrierter Datei-Speicher — **ideal für die Projektbilder** (siehe #2), statt Bilder ins Git-Repo zu legen.
- **DSR-Bezug:** entspricht genau **Phase 4 „Backend-Konzept & Pilot"** eurer Roadmap (`docs/roadmap` / RoadmapPage). Aus „konzipiert" wird „gebaut".

### Bewusste Empfehlung zur Auth
**Eigene JWT-Auth behalten**, Supabase nur als **Postgres (+ Storage)** nutzen. Ein Wechsel auf *Supabase Auth* würde euren funktionierenden Auth-Stack (Login/Refresh/Rollen) ersetzen = größerer, unnötiger Umbau. → Supabase „nur als DB" ist der pragmatische, risikoarme Weg.

### Aufwand (grobe Schätzung)
| Schritt | Aufwand |
|---|---|
| Supabase-Projekt anlegen, Connection-String holen | ~15 Min |
| Prisma `provider` `sqlite → postgresql`, `DATABASE_URL` in `.env`, `prisma migrate` + `seed` | ~1–2 h |
| Test (alle Endpunkte gegen Supabase) | ~30 Min |
| *(optional)* Supabase Storage für Bild-Uploads (Admin) | ~0,5 Tag |
| *(optional)* Backend hosten (Render/Fly/Railway), damit ein öffentlicher Demo-Link eine echte DB nutzt | ~0,5 Tag |

### Risiken / Hinweise
- **Connection-String ist ein Secret** → nur in `backend/.env` (gitignored), nie committen.
- **SQLite-Spezifika:** euer Schema speichert `sdgIds` als JSON-String — unter Postgres unverändert lauffähig (kann später optional zu `int[]`/`jsonb` werden).
- **Für die reine Präsentation am 15.–17. Juni** ist SQLite völlig ausreichend (null Infrastruktur). Supabase lohnt sich für **„darüber hinaus"** (Pilot, Persistenz, geteilte Daten, Bild-Hosting) — was ihr ja signalisiert habt.

### Empfohlene Reihenfolge
1. Supabase-Projekt + `DATABASE_URL`. 2. Prisma auf Postgres umstellen + migrieren + seeden. 3. Lokal testen. 4. (dann) Storage für Bilder. 5. (optional) Backend deployen.

---

## 2. Inhalte von der Facebook-Seite + abgeschlossene Projekte

### 2a. Automatisch Bilder/Texte aus Frau Kokkalis FB-Seite extrahieren — ❌ nicht automatisiert

**Ehrliche Einschätzung — das geht nicht zuverlässig/zulässig automatisch:**
- **FB Graph API:** Zugriff auf Beiträge/Bilder einer Seite erfordert eine **Facebook-App**, ein **Page Access Token** und i. d. R. **App Review + Zustimmung der Seiten-Administratorin** (Frau Kokkali). Für ein privates Profil (nicht offizielle „Page") ist das praktisch **nicht** über die API möglich.
- **HTML-Scraping:** verstößt gegen die **FB-Nutzungsbedingungen**, ist durch Login-Wall/Rate-Limits **fragil** und rechtlich heikel.
- **Bild-Rechte / Datenschutz:** FB-Bilder sind oft **urheberrechtlich** geschützt (Fotograf:in) und können **erkennbare Personen** zeigen → **DSGVO**. Übernahme auf die Website braucht **ausdrückliche Erlaubnis**.

**Realistischer, zulässiger Weg (✅ machbar):**
- **Inhalte mit Erlaubnis manuell sammeln:** Frau Kokkali / die Gemeinde gibt die Texte + Bilder direkt heraus (oder ihr kopiert sie mit ihrer Zustimmung).
- **Per Admin eintragen** — und hier zahlt sich euer neues Feature aus: **DeepL-Auto-Übersetzung** macht das Eintippen in EN/EL/DE schnell (eine Sprache eingeben → andere zwei automatisch).
- *(Optional, später)* Ein **Import-Helfer** (CSV/JSON → DB-Seed), falls es viele Projekte sind. Das ist ein eigenes kleines Tool, kein FB-Scraper.

→ **Fazit 2a:** Automatischer FB-Abzug = **nein** (ToS/API/Recht). Manuelles Übernehmen mit Erlaubnis + Admin/DeepL = **ja**.

### 2b. Abgeschlossene Projekte auf der Website zeigen — ✅ machbar (DB hilft, ist aber schon da)

- **DB ist dafür genau richtig** — und ihr habt sie schon: das `Project`-Modell hat `status` inkl. **`COMPLETED`**. Abgeschlossene Projekte sind persistenter Content, den der Admin einmal einträgt.
- **Was konkret nötig ist:**
  1. **OPEN-Filter erweitern:** `ProjectsPage` filtert aktuell fix `status: 'OPEN'`. → Status-Filter (z. B. Tabs „Laufend / Abgeschlossen / Alle") ergänzen. *(klein)*
  2. **Bildfeld ergänzen:** das `Project`-Modell hat bisher nur `thumbnailColor` (kein Bild). → Feld `imageUrl` (oder `images[]`) in Prisma-Schema + Admin-Formular + Anzeige. *(klein–mittel)*
  3. **Bilder speichern:** in **Supabase Storage** (empfohlen, daher Synergie mit #1) oder vorerst `public/`. Upload-Endpoint im Admin. *(mittel)*
- **Aufwand gesamt:** ohne Bilder ~0,5 Tag; mit Bild-Upload + Storage ~1–1,5 Tage.
- **DSR-Bezug:** adressiert **TP1 „Show Importance"** (Wirkung *vergangener* Projekte zeigen) direkt — ein in Phase 1/2 genanntes Kernziel.

---

## Zusammengefasste Empfehlung & Reihenfolge

1. **Erst Supabase** (als Postgres via Prisma, eigene Auth behalten) — schafft die Grundlage (Persistenz + Storage).
2. **Dann Bildfeld + Status-Filter** für abgeschlossene Projekte (TP1 „Show Importance").
3. **Inhalte manuell mit Erlaubnis** von Frau Kokkali übernehmen, per Admin + DeepL eintragen (kein FB-Scraper).
4. *(optional, für öffentlichen Demo-Link)* Frontend + Backend deployen.

**Bewusst NICHT bauen:** automatischer Facebook-Scraper/-Abzug (ToS/API/Recht) → in DSR-Sprache eine **bewusste Designentscheidung** + Future Work „offizielle Datenübergabe durch die Gemeinde".

## Offene Fragen an euch
- Gibt es eine **offizielle FB-*Page*** der Gemeinde (nicht privates Profil) und Admin-Zugriff? (entscheidet, ob API überhaupt theoretisch ginge)
- Habt ihr / bekommt ihr **schriftliche Erlaubnis** für Bilder + Texte (Urheber + abgebildete Personen)?
- Ziel: **nur Präsentation** (dann reicht SQLite lokal) oder **echter Pilot/öffentlicher Link** (dann Supabase + Hosting)?

> Wenn ihr grünes Licht gebt, setze ich Schritt 1 (Supabase) und 2 (abgeschlossene Projekte + Bildfeld) additiv um — Schritt für Schritt, getestet, mit Docs.

---

## 3. Komplett online auf eigener Domain schalten — was geht, was fehlt (technisch + rechtlich)

> ⚠️ **Keine Rechtsberatung** — Orientierung. Für eine echte öffentliche Schaltung (v. a. im Namen der Gemeinde) juristische Prüfung einholen.

**Kurzantwort:** Die Architektur ist „deploy-fähig". Mit **Supabase** (DB + Storage) + einem **Host fürs Backend** + **Vercel/Netlify fürs Frontend** + **Domain** bekommt ihr es online. Aber „nur noch die Domain schalten" stimmt nur *fast* — davor liegt eine überschaubare **Production-Readiness-Phase**. **Rechtlich** ist mehr nötig — das ist der größere Brocken.

### Zwei Szenarien (bestimmen Aufwand & Recht)
- **A) Akademische Demo** unter neutraler Domain (z. B. `zoe-corfu-demo.org`), klar als Studienprojekt/Prototyp gekennzeichnet, **ohne echte personenbezogene Daten** → rechtlich leicht, technisch schnell.
- **B) Echte offizielle Plattform der Gemeinde** → braucht **Autorisierung der Gemeinde** + volle DSGVO-/Impressum-/Barrierefreiheits-Compliance. Deutlich mehr.

### Technische Go-Live-Checkliste (✅ vorhanden · 🟡 teils · ❌ fehlt)
- ✅ Frontend (SPA) deploybar (Vercel/Netlify/Cloudflare Pages)
- ✅ Backend (Express/Prisma) lauffähig → **Host nötig** (Render/Fly/Railway; Vercel-Serverless eher nicht, da Monolith-Server)
- 🟡 DB → Supabase (siehe #1) · 🟡 Bild-Storage → Supabase Storage (siehe #2)
- ❌ **Prod-Secrets** in Host-Env (nicht im Repo): starkes `JWT_SECRET`, `DEEPL_API_KEY`, `DATABASE_URL`, `CORS_ORIGIN=<echte Domain>` *(unser CORS bleibt in Prod strikt ✓)*
- ❌ **Cookie-Härtung:** Refresh-Token-Cookie `secure: true` + korrektes `SameSite` (Frontend-Domain ↔ API-Domain)
- ❌ **Prototype-Banner entfernen** + Dummy-Daten durch **echte, verifizierte Inhalte** ersetzen (die ganze Seite ist aktuell als „Prototyp/fiktiv" gekennzeichnet)
- ❌ **Persistenz + Moderation** der Bürger-Einreichungen (aktuell nicht gespeichert)
- ❌ **Newsletter-Versand** real (Double-Opt-in, E-Mail-Provider) — aktuell nur Konzept
- ❌ **Passwort-Reset / E-Mail-Verifikation** für echte Nutzer
- 🟡 **Monitoring/Backups** (z. B. Sentry, DB-Backups), Uptime · 🟡 **WCAG/Lighthouse-Audit** (Phase 5) durchführen
→ Aufwand Szenario B: realistisch **mehrere Tage** über Supabase hinaus.

### Rechtliche Checkliste (DE/EU/GR)
- ❌ **Betreiber/Verantwortlicher klären:** Wer betreibt die Seite rechtlich? Studierende ≠ Gemeinde. Ohne Mandat **nicht** als „offizielle Seite der Gemeinde" auftreten.
- ❌ **Impressum** (Anbieterkennzeichnung) — Pflicht für geschäftsmäßige/öffentliche Websites.
- ❌ **Datenschutzerklärung (DSGVO):** Rechtsgrundlagen, Zwecke, Speicherdauer; **Auftragsverarbeitungsverträge (AVV/DPA)** mit **Supabase** und **DeepL** (beide = Auftragsverarbeiter; EU-Region wählen).
- ⚠️ **DeepL & personenbezogene Daten:** Projekttexte i. d. R. unkritisch; sobald **personenbezogene** Texte übersetzt werden → DPA / DeepL Pro.
- 🟡 **Cookies:** httpOnly-Refresh-Cookie = „technisch notwendig" (kein Consent); **Tracking/Analytics** → Cookie-Consent-Banner.
- ❌ **Bild-/Inhaltsrechte** (Urheber + abgebildete Personen, „Recht am eigenen Bild") — Erlaubnis nötig (siehe #2).
- ❌ **Barrierefreiheit rechtlich:** als öffentliche/öffentlich-nahe Seite greifen **EU 2016/2102 + EN 301 549 (WCAG 2.1 AA)**, EAA/BFSG (Juni 2025) → **Barrierefreiheitserklärung** + Feedback-Mechanismus (Seite vorhanden, formaler Audit nötig).
- ⚠️ **Domain:** neutraler Name frei wählbar; ein Name, der **amtlichen Status suggeriert**, nur mit Autorisierung.

### Empfehlung
- **Für jetzt / Präsentation → Szenario A:** Ihr könnt **technisch alles verknüpfen** (Supabase + Hosting + neutrale Domain) und einen **echten Demo-Link** zeigen, ohne die volle Rechts-Last. Prototype-Banner bleibt, keine echten personenbezogenen Daten, Bilder nur mit Erlaubnis.
- **Für „echt offiziell" → Szenario B:** zusätzlich Gemeinde-Mandat + Impressum + Datenschutz + AVV + Bildrechte + Barrierefreiheitserklärung. Eigene **Phase 6/Beyond**, juristisch begleiten.

> **Fazit:** „Alles so verknüpfen, dass nur noch die Domain fehlt" ist **technisch realistisch** (mit überschaubarer Hardening-Arbeit). **Rechtlich** fehlt für eine *echte* öffentliche/kommunale Schaltung noch einiges — v. a. Betreiber-Klärung, DSGVO-Doku (Impressum/Datenschutz/AVV), Bildrechte und Barrierefreiheitserklärung.
</content>

# ZOE Platform — Admin-Handbuch

Für Mitarbeiter:innen der Gemeinde Nordkorfu mit Admin-Rolle.

**Admin-Login:** `admin@zoe-corfu.gr` / `ZoeAdmin2026!`

---

## 1. Admin-Login

1. Öffnen Sie `/login`
2. Geben Sie die Admin-Zugangsdaten ein
3. Nach Login erscheint ein **Schild-Symbol** (Admin) in der Navigation
4. Klicken Sie darauf, um zum Admin-Dashboard zu gelangen (`/admin`)

---

## 2. Admin-Dashboard (`/admin`)

Das Admin-Dashboard zeigt:
- **Gesamtbenutzer:** Anzahl registrierter Konten
- **Gesamtprojekte:** Alle Projekte (inkl. Draft, Closed)
- **Gesamtteilnahmen:** Alle Projektteilnahmen
- **Offene Projekte:** Aktuell aktive Projekte

Von hier aus navigieren Sie zu:
- Projektverwaltung → `/admin/projects`
- Nutzerverwaltung → `/admin/users`

---

## 3. Neues Projekt anlegen (`/admin/projects/new`)

1. Klicken Sie in `/admin/projects` auf **Neues Projekt**
2. Füllen Sie alle Pflichtfelder aus:

| Feld | Beschreibung | Pflicht |
|---|---|---|
| Titel (EN/EL/DE) | Projekttitel in allen drei Sprachen | ✓ |
| Beschreibung (EN/EL/DE) | Ausführliche Projektbeschreibung | ✓ |
| Kategorie | MOBILITY, WASTE_CIRCULAR, MARINE_PROTECTION, NATURAL_MONUMENTS, ENERGY, EDUCATION_PARTICIPATION | ✓ |
| SDG-IDs | JSON-Array der betroffenen SDGs, z.B. `[13, 14, 15]` | ✓ |
| Belohnungspunkte | Punkte bei Teilnahme (Standard: 50) | — |
| Standort | Geografische Bezeichnung | — |
| Max. Teilnehmer | Maximale Teilnehmerzahl (leer = unbegrenzt) | — |

3. Klicken Sie **Speichern**

---

## 4. Projekt bearbeiten / Status ändern (`/admin/projects/:id/edit`)

1. Klicken Sie in `/admin/projects` auf das Stift-Symbol neben dem Projekt
2. Bearbeitbare Felder: alle Titel, Beschreibungen, Kategorie, Status, Punkte
3. **Status-Optionen:**
   - `DRAFT` — Entwurf, nicht öffentlich sichtbar
   - `OPEN` — Aktiv, Bürger:innen können teilnehmen
   - `CLOSED` — Abgeschlossen, keine Teilnahme mehr möglich
   - `COMPLETED` — Erfolgreich abgeschlossen

---

## 5. Nutzer verwalten (`/admin/users`)

Die Nutzerliste zeigt: Name, E-Mail, Rolle, **Status (Aktiv/Gesperrt)**, Punkte
und Aktionen.

### Rolle ändern
- Klicken Sie in der Spalte "Aktionen" auf **→ ADMIN** oder **→ USER**
- Die Änderung wird sofort gespeichert
- Admin-Nutzer haben Zugriff auf alle `/admin/...`-Seiten
- **Schutz:** Sie können Ihre **eigene** Rolle nicht ändern und den **letzten**
  Admin nicht degradieren (verhindert Aussperren).

### Konto sperren / entsperren
- **Sperren** blockiert die Anmeldung sofort (bestehende Sitzungen werden
  beendet), löscht aber **keine** Daten; **Entsperren** macht es rückgängig.
- Eigenes Konto und der letzte aktive Admin können nicht gesperrt werden.

### Punkte korrigieren
- Punktewert im Feld anpassen und **Speichern** klicken.

### Konto löschen (DSGVO)
- Über die API `DELETE /admin/users/:id`: Beiträge auf öffentlichen Boards
  (Ideen/Meldungen) werden **anonymisiert**, alles Persönliche entfernt.

> Alle diese Aktionen werden im **Audit-Log** protokolliert
> (`GET /admin/audit`).

---

## 6. API-Zugriff (für Entwickler)

Admin-Endpunkte erfordern ein Access Token mit `role: ADMIN`.

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@zoe-corfu.gr","password":"ZoeAdmin2026!"}'

# Stats abrufen
curl http://localhost:3001/api/admin/stats \
  -H "Authorization: Bearer <accessToken>"
```

Vollständige API-Dokumentation: `docs/api.md`

---

## 7. Backend starten

```bash
cd backend
npm run dev    # Entwicklungsserver (Port 3001)
npm run db:seed   # Datenbank zurücksetzen + neu befüllen
npm run db:studio # Prisma Studio (Datenbankbrowser)
```

Frontend:
```bash
npm run dev   # Vite Dev Server (Port 5173)
```

---

## 8. Schulen verwalten (`/admin/schools`)

Schulen sind Gruppen: Schüler:innen treten per **Beitritts-Code** bei, ihre Punkte
fließen in das **Schulranking** ein (Sortierung nach Ø-Punkten pro Mitglied, mind.
3 Mitglieder zur Wertung).

**Schule anlegen:**
1. Name und einen eindeutigen **Code** (z. B. `KERKYRA-7F`) eingeben, optional Ort.
2. Optional einen **Schul-Login** (Rolle `SCHOOL`) erzeugen: Koordinator-E-Mail
   (+ optional Name/Passwort). Bleibt das Passwort leer, wird eins generiert.
3. Nach dem Anlegen werden die Zugangsdaten **einmalig** angezeigt — sofort kopieren.

**Bearbeiten / Löschen:** über die Stift-/Papierkorb-Symbole in der Liste. Beim
Löschen behalten Mitglieder ihr Konto, verlieren aber die Schul-Zuordnung.

Der Schul-Login sieht unter `/school` ein **schreibgeschütztes** Dashboard
(Mitglieder, Punkte, Rang, Belohnungsstufe + Beitritts-Code zum Teilen).
Seed-Logins: `school1..3@zoe-corfu.gr` / `School2026!`.

---

## 9. Neuigkeiten / Blog verwalten (`/admin/posts`)

Der Neuigkeiten-Feed (`/news` + Startseite) speist sich aus Beiträgen.

- **Automatisch:** Beim Veröffentlichen eines Projekts (Status → `OPEN`) entsteht ein
  `PROJECT_NEW`-Beitrag, beim Abschließen (→ `COMPLETED`) ein `PROJECT_COMPLETED`-Beitrag
  — dreisprachig aus den Projektfeldern, ohne Doppelte.
- **Manuell:** Beitrag mit Titel + Text in EN/EL/DE anlegen. Der **Übersetzen-Button**
  (DeepL) füllt aus einer Sprache die anderen beiden. Typ wählen
  (`Ankündigung` / `Neues Projekt` / `Abgeschlossen`), optional Bild-URL.
- **Veröffentlicht**-Häkchen steuert die Sichtbarkeit. Auto-Beiträge sind ganz normal
  **bearbeitbar/löschbar**.

## 10. Termine verwalten (`/admin/events`)

Termine (Events) sind konkrete, datierte Aktivitäten, die **optional zu einem
Projekt** gehören (ein Projekt → mehrere Termine) oder eigenständig sind.

- **Anlegen** (`/admin/events/new`): Titel + Beschreibung in EN/EL/DE (der
  **Übersetzen-Button** mit DeepL füllt aus einer Sprache die anderen beiden),
  **Datum & Uhrzeit**, **Kategorie** (gleiche Liste wie Projekte/Ideen),
  Punkte, optional **Kapazität** und **verknüpftes Projekt** (Auswahl; leer =
  eigenständig).
- **Bearbeiten/Löschen** (`/admin/events/:id/edit`): Felder ändern oder den Termin
  löschen. Bestehende Anmeldungen behalten ihren Bezug (kein harter Fremdschlüssel).
- Verknüpfte Termine erscheinen automatisch auf der **Projekt-Detailseite**
  („Termine zu diesem Projekt") und auf der öffentlichen **Termine-Seite**
  (`/events`).
- **Teilnehmer einsehen:** Jede Zeile der Terminliste hat einen
  **„Teilnehmer (N)"**-Button → `/admin/events/:id/registrations` zeigt alle
  Anmeldungen (Mitglieder mit Name/E-Mail und Punktestatus „ausstehend"/
  gutgeschrieben; Gäste entsprechend markiert). Auf den öffentlichen
  Event-Karten sehen Admins statt des Anmelde-Buttons den Link
  **„Anmeldungen verwalten"** — Admins nehmen selbst nicht an Terminen teil.
- **Lebenszyklus & Punkte:** Anmeldungen vergeben **keine** Sofort-Punkte. In der
  Terminliste zeigt **Abschließen** (mit Bestätigungsabfrage) den Termin als
  `COMPLETED` an und schreibt allen angemeldeten Mitgliedern die Punkte des
  Termins **einmalig** gut (idempotent — erneutes Abschließen vergibt nichts
  doppelt). Abgeschlossene Termine nehmen keine neuen Anmeldungen mehr an;
  Abmeldungen sind dann ebenfalls gesperrt.
- Gäste melden sich mit Name/E-Mail/Einwilligung an (ohne Punkte).

---

## 11. Monitoring (`/admin/monitoring`)

Anonyme Nutzungs- und Aktivitätsstatistiken, umschaltbar für 7/30/90 Tage:

- **KPI-Karten:** Seitenaufrufe, Besuche (≈ Browser-Sitzungen), Logins,
  neue Konten im Zeitraum.
- **Seitenaufrufe pro Tag** als Balkendiagramm und die **meistbesuchten
  Seiten** (Top 10).
- **Plattform-Aktivität:** Logins, neue Konten, Event-Anmeldungen, Ideen,
  Meldungen & Feedback, Newsletter-Anmeldungen — abgeleitet aus den ohnehin
  vorhandenen Zeitstempeln in der Datenbank.
- **Datenschutz by design:** Seitenaufrufe werden nur als Tageszähler pro
  Seite gespeichert (keine IP-Adressen, Geräte, Cookies oder Besucherprofile);
  `/admin`-Seiten und die Navigation eingeloggter Admins werden nicht gezählt.
  Es ist daher kein Cookie-Banner erforderlich.

---

## 12. Belohnungen verwalten (`/admin/rewards`)

Die fünf **ZOE-Stufen** (Σπόρος … Θεματοφύλακας) sind hier vollständig
bearbeitbar — Änderungen sind sofort live auf `/rewards` und im Nutzer-Dashboard:

- **Pro Stufe:** griechischer Name, Icon (Emoji) und **Punktebereich** („Punkte
  ab"/„Punkte bis"; das Bis-Feld leer lassen = höchste, offene Stufe). Achten
  Sie darauf, dass die fünf Bereiche lückenlos aneinander anschließen.
- **Pro Rolle** (Einwohner:in, Besucher:in, Student:in, Freiwillige:r) und in
  **allen drei Sprachen**: Stufenname, Beschreibung und die **Belohnungsliste**
  (eine Belohnung pro Zeile).
- **Speichern** wirkt pro Stufe; die Eingaben werden serverseitig geprüft
  (Punktebereich plausibel, gültige Rollen).

---

## 13. Meldungen & Feedback (`/admin/submissions`)

Über die Mitmach-Seite (`/participate`) eingereichte **Umweltmeldungen**
(`REPORT`) und **Feedback** (`FEEDBACK`) landen hier — neueste zuerst, nach Typ
filterbar. Eingeloggte Einsender:innen sind mit Name/E-Mail verknüpft; Gäste
erscheinen mit ihren optionalen Angaben oder als „Anonym". Vorerst reine
Durchsicht (kein Workflow — Future Work).

---

## 14. Benachrichtigungsglocke

Im Kopfbereich (Header) erscheint für Admins eine **Glocke** 🔔. Sie bündelt
alles, was eine Durchsicht braucht:

- **Neue Ideen** (Status `NEU`), die noch nicht bearbeitet wurden, sowie
- **Umweltmeldungen** und **Feedback** von der Mitmach-Seite.

An der Glocke zeigt ein **roter Zähler** die Anzahl neuer Einträge seit dem
letzten Öffnen (z. B. „3"; ab 10 → „9+"). Ein Klick öffnet eine Liste mit
Einträgen wie „**Maria K. hat eine neue Idee eingereicht**" bzw. „… hat ein
**Umweltproblem gemeldet**". Anonyme Einsendungen erscheinen als „Jemand".

Ein Klick auf einen Eintrag führt direkt zur passenden Verwaltungsseite, wo der
Eintrag bearbeitet/freigegeben werden kann:

- Ideen → **Bürger-Ideen** (`/admin/ideas`) — dort Status auf
  `Angenommen`/`Abgelehnt` setzen.
- Meldungen/Feedback → **Meldungen & Feedback** (`/admin/submissions`).
- Event-Vorschläge → **Event-Vorschläge** (`/admin/event-proposals`).

Sobald die Glocke geöffnet wird, gilt alles als „gesehen" und der Zähler
verschwindet — die Einträge bleiben aber in der Liste, bis sie bearbeitet sind.
Der „gesehen"-Stand wird pro Gerät/Browser gespeichert.

---

## 15. Event-Vorschläge von Bürger:innen (`/admin/event-proposals`)

Bürger:innen können über die Mitmach-Seite (`/participate` → „Submit an Idea" →
Umschalter **Event**) ein **Event** vorschlagen — in **einer** Sprache, mit
Titel, Beschreibung, Wunschdatum, Ort (Adresssuche → Karte), optional Kapazität,
Projektbezug und Titelbild. Vorschläge erscheinen **nicht** auf der öffentlichen
Ideen-Pinnwand, sondern nur hier (und in der Admin-Glocke).

**Workflow:**

1. In der Liste (`/admin/event-proposals`, nach Status filterbar) den Vorschlag
   prüfen. „Ablehnen" setzt ihn auf **Abgelehnt**.
2. **„Prüfen & Event erstellen"** öffnet das normale Event-Formular, **vorausgefüllt**
   mit den Vorschlagsdaten. Die eine Sprache wird per **DeepL automatisch** in
   die anderen beiden übersetzt — **bitte alle Felder prüfen** und ein Projekt
   zuordnen (Pflicht).
3. **Speichern** erstellt das echte Event (erscheint ab sofort unter `/events`
   und auf der Karte, wenn Koordinaten gesetzt sind) und markiert den Vorschlag
   als **Veröffentlicht** (mit Link zum erzeugten Event).

**Bilder & Orte:** Beim Erstellen/Bearbeiten von Events und Projekten kann jetzt
ein Bild **direkt vom Gerät hochgeladen** werden (oder per URL); es wird in
Supabase Storage abgelegt und die öffentliche URL in der DB gespeichert. Orte
werden über eine **Adresssuche** (OpenStreetMap) eingegeben — die Auswahl setzt
Koordinaten, die das Event auf der Karte anzeigen.

**Usernames:** In allen Community-Ansichten (Kommentare, Bestenliste,
Erwähnungen, Vorschlags-Einsender) wird der **pseudonyme Username** angezeigt,
nie echter Name oder E-Mail.

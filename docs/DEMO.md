# ZOE-Plattform — Demo-Checkliste (Live-Präsentation)

> **Zum Ausdrucken neben den Laptop legen.** Reihenfolge strikt von oben nach unten.
> Demo läuft auf **Deutsch**. Zugangsdaten **nie sichtbar auf dem Beamer eintippen**
> (vorher in den Browser-Fenstern einloggen).

**Zugangsdaten (geheim halten):**
- Admin: `admin@zoe-corfu.gr` / `ZoeAdmin2026!`
- Bürger:in: `citizen1@example.com` / `Test1234!`

**Ports:** Backend `http://localhost:3001` · Frontend `http://localhost:5173`

---

## 1. VORBEREITUNG (Abend vorher)

- [ ] **Repo aktuell:** `git pull`, dann `npm install` (Root) und `cd backend && npm install`.
- [ ] **Karte braucht Internet:** Die Kartenkacheln kommen live von OpenStreetMap/CARTO.
      Am Präsentationsort **WLAN/Hotspot testen**. Ohne Netz → Fallback-Screenshot nutzen.
- [ ] **Postgres-Test-Container** (lokale DB, **nicht** Supabase) ist vorhanden/läuft.
      Exakter Startbefehl (aus `docs/` · `test-setup`):
      ```bash
      sudo docker run -d --name zoe-postgres-test \
        -e POSTGRES_USER=zoe -e POSTGRES_PASSWORD=zoe -e POSTGRES_DB=zoe_test \
        -p 5433:5432 postgres:16
      ```
      (Compose-Plugin fehlt evtl. → `docker compose` vermeiden, obigen `docker run` nutzen.
      Falls Name belegt: vorher `sudo docker rm -f zoe-postgres-test`.)
- [ ] **`DATABASE_URL` zeigt auf die LOKALE DB, nicht Supabase.** Das ist DER Stolperstein:
      `backend/.env` zeigt standardmäßig auf Supabase (dort fehlen die Demo-Daten/Spalten).
      Für die Demo die lokale DB **per Umgebungsvariable überschreiben** (sauberer als `.env` ändern):
      ```bash
      export DATABASE_URL="postgresql://zoe:zoe@localhost:5433/zoe_test"
      export DIRECT_URL="postgresql://zoe:zoe@localhost:5433/zoe_test"
      ```
      Diese zwei Zeilen **in beiden Terminals** setzen, bevor Backend/Tools starten.
- [ ] **DB frisch seeden** (frische Demo-Daten inkl. Projekt-Koordinaten):
      ```bash
      cd backend
      npx prisma db push --skip-generate     # legt Schema an (inkl. lat/lng)
      npx ts-node prisma/seed.ts             # Projekte, Events, Ideen, Nutzer, Koordinaten
      ```
- [ ] **Browser-Fenster vorbereiten (zwei Stück):**
  - **Fenster „Gast"** (links): privates/Inkognito-Fenster, **nicht eingeloggt**, auf `/projects`.
  - **Fenster „Admin"** (rechts): normales Fenster, **bereits eingeloggt** als `admin@zoe-corfu.gr`,
    auf `/admin/ideas`. So muss kein Passwort live getippt werden.
- [ ] **Sprache** in beiden Fenstern auf **DE** stellen (Flaggen-Umschalter oben rechts).
- [ ] **Fallback-Screenshots** als Bilder bereithalten (für den Fall, dass die Live-Demo hakt):
  - `/projects` mit **Karten-Ansicht** (Marker sichtbar)
  - `/participate` mit ausgefülltem **Ideen-Formular**
  - `/admin/ideas` mit einer **eingegangenen Idee**
  - `/sdg-dashboard`
- [ ] **Slide-Datum prüfen:** Datum im Slide-Footer kontrollieren. *(Hinweis: eine Datei
      `fau.js` ist im Repo aktuell nicht vorhanden — prüfe die tatsächliche Slide-Quelle.)*

---

## 2. STARTSEQUENZ (ca. 10 Min vorher)

In **dieser Reihenfolge** (zwei Terminals):

1. **Container** (Terminal 1, falls noch nicht laufend):
   ```bash
   sudo docker start zoe-postgres-test   # oder der docker run-Befehl aus Schritt 1
   nc -z localhost 5433 && echo "DB up"  # muss "DB up" zeigen
   ```
2. **Backend** (Terminal 1):
   ```bash
   export DATABASE_URL="postgresql://zoe:zoe@localhost:5433/zoe_test"
   export DIRECT_URL="postgresql://zoe:zoe@localhost:5433/zoe_test"
   cd backend && npm run dev
   ```
   **Verifizieren:** `curl -s http://localhost:3001/api/health` → `{"success":true,...}`
   und `curl -s http://localhost:3001/api/projects` → Status **200** mit Projektliste.
3. **Frontend** (Terminal 2):
   ```bash
   npm run dev
   ```
   **Verifizieren:** `http://localhost:5173` lädt, kein weißer Bildschirm.
4. **Sprache** auf **DE**, **Browser-Fenster positionieren**: Gast links, Admin rechts.
5. **Kurzer Smoke-Test** im Gast-Fenster: `/projects` → Toggle **„Karte"** → Marker erscheinen.

---

## 3. DEMO-ABLAUF (ca. 10 Min)

### Persona **Eleni** (Gast, kein Account) — Fenster links

1. **`/projects`** — Projektliste zeigen → **Z1** (zentrale, transparente Information).
2. Toggle **„Liste / Karte"** → **Karte** der Initiativen, Marker pro Projekt anklicken,
   Popup mit Name/Kategorie/SDG/Link → **Z1 + Z5** (Verortung, lokale Identität).
   *(Partnerwunsch Kokkali 2026.)*
3. Auf einem Projekt ein **SDG-Badge** zeigen → auf **`/sdg-dashboard`** wechseln → **Z2**.
4. **Sprachumschalter DE → EL** demonstrieren (Inhalte wechseln) → **Z6**.
5. **`/participate`** → **Idee einreichen**: Titel + Kategorie + Beschreibung,
   **E-Mail-Feld LEER lassen** (anonyme Einreichung) → absenden → **Z3**.

### Persona **Nikos** (eingeloggt) — Wechsel zum Admin-Fenster rechts

6. **`/admin/ideas`** → **die gerade eingereichte Idee ist da** → **Z3-Beweis**.
   > ⭐ **LIVE-HIGHLIGHT:** Gast reicht Idee ein → erscheint sofort beim Admin. **Das ist der Moment.**
   (Seite ggf. **einmal neu laden** — kein Auto-Refresh.)
7. Zurück zum Nutzer-Fenster: **Projekt beitreten** → **Punkte** werden gutgeschrieben → **Z4**.
8. **Projekt-Detailseite** mit lokalen Inhalten/Quelle zeigen → **Z5**.

---

## 4. HÄUFIGE FEHLERQUELLEN & SOFORT-FIXES

| Symptom | Sofort-Fix |
|---|---|
| **Weißer Bildschirm** | Frontend neu laden (Ctrl+R). Hilft nicht? Vite-Dev-Server stoppen (Ctrl+C) und `npm run dev` neu starten. |
| **`/api/events` oder `/api/projects` → 500** | Backend zeigt noch auf **Supabase**. `DATABASE_URL`/`DIRECT_URL` (lokale DB) prüfen, **Backend neu starten** (Schritt 2). |
| **Karte leer / Marker fehlen** | Meist Leaflet-Icon-/Asset-Auflösung → **Hard-Reload (Ctrl+Shift+R)**. Oder: Karten **brauchen Internet** (OSM/CARTO-Kacheln) → Netz prüfen, sonst Fallback-Screenshot. |
| **Karte grau, keine Kacheln** | Kein Internet am Ort → Fallback-Screenshot zeigen. |
| **Login funktioniert nicht** | Cookies des Fensters löschen, neu einloggen (Refresh-Cookie kann abgelaufen sein). |
| **Idee erscheint nicht im Admin** | **Seite neu laden** — es gibt keinen Auto-Refresh. |
| **Admin-Seite springt zur Login-Seite** | Auth liegt nur im Speicher: nach **hartem Reload** ist man ausgeloggt. Einfach neu einloggen bzw. **im selben Tab per Klick** navigieren (nicht URL hart neu laden). |
| **Falsches Datum im Slide-Footer** | Vor der Präsentation in der Slide-Quelle korrigieren. |

---

## 4b. TESTDATEN BEREINIGEN (vor der Demo, falls nötig)

E2E-Tests laufen gegen die echte Supabase-DB und hinterlassen Test-Ideen/-Kommentare
(z. B. „E2E board 1781…", Beschreibung „Automated end-to-end idea submission"), die
sonst auf `/ideas` und in der Landing-Sektion „Aus der Community" auftauchen.

**Bereinigen (löscht NUR Test-Artefakte, lässt die 4 geseedeten Demo-Ideen unangetastet):**
```bash
cd backend && npx ts-node prisma/cleanup-test-data.ts
```
Ausgabe z. B.: `Cleanup: removed 28 test ideas, 6 test comments, … · Seeded demo ideas present: 4/4 OK`.

- Erkennt Test-Ideen an: Titel beginnt mit `E2E`, Beschreibung enthält
  `Automated end-to-end`, oder `submitterEmail` `reply-*@example.com`; dazu
  Test-Kommentare (`E2E comment …`).
- Meldet, falls < 4 Demo-Ideen übrig sind → dann `npm run db:seed` (idempotent)
  stellt `idea-demo-*` wieder her.
- **Automatisch:** Das Skript läuft auch als Playwright-`globalTeardown` nach jeder
  E2E-Suite (`e2e/global-teardown.ts`), sodass frische Testdaten gleich wieder
  entfernt werden.

---

## 5. NACH DER PRÄSENTATION

- [ ] **Dev-Server stoppen:** in beiden Terminals **Ctrl+C**.
- [ ] **Container stoppen/entfernen:**
      ```bash
      sudo docker rm -f zoe-postgres-test
      ```

---

### Nicht Teil der Demo (bewusst weggelassen)
Kein Google Maps / Mapbox, keine Echtzeit-Geodaten, kein Routing, kein SMTP/E-Mail-Versand,
kein Score-/Bewertungs-Feature. Die Karte ist **Open Source** (Leaflet + OpenStreetMap/CARTO,
kein API-Key).

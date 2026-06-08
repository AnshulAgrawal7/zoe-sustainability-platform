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
| Kategorie | ENVIRONMENT, MOBILITY, COMMUNITY, EDUCATION, CULTURE | ✓ |
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

Die Nutzerliste zeigt: Name, E-Mail, Rolle, Punkte, Sprache.

### Rolle ändern
- Klicken Sie in der Spalte "Rolle ändern" auf **→ ADMIN** oder **→ USER**
- Die Änderung wird sofort gespeichert
- Admin-Nutzer haben Zugriff auf alle `/admin/...`-Seiten

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

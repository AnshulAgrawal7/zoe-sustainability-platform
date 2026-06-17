# ZOE Platform — Nutzerhandbuch für Bürger:innen

**Prototyp-Hinweis:** Diese Dokumentation beschreibt den funktionalen Forschungsprototyp (DSR, FAU SoSe 2026). Alle Daten sind Beispieldaten.

---

## 1. Registrierung & Login

### Neues Konto erstellen
1. Klicken Sie auf **Registrieren** in der Navigation (oben rechts)
2. Geben Sie Ihren Namen, Ihre E-Mail-Adresse und ein Passwort (min. 8 Zeichen) ein
3. Wählen Sie Ihre bevorzugte Sprache (Englisch, Griechisch, Deutsch)
4. Klicken Sie auf **Konto erstellen**
5. Sie werden automatisch eingeloggt und zur Dashboard-Seite weitergeleitet

### Anmelden
1. Klicken Sie auf **Anmelden** in der Navigation
2. Geben Sie E-Mail und Passwort ein
3. Klicken Sie auf **Einloggen**

**Demo-Zugangsdaten (Prototype):**
- Bürger: `citizen1@example.com` / `Test1234!`
- Admin: `admin@zoe-corfu.gr` / `ZoeAdmin2026!`

### Abmelden
Klicken Sie auf das Abmelden-Symbol (Pfeil nach rechts) in der Navigation.

---

## 2. Projekte entdecken und filtern

### Projektliste aufrufen
- Klicken Sie in der Navigation auf **Projekte**
- Alle offenen ZOE-Projekte werden angezeigt

### Nach Kategorie filtern
Verwenden Sie das **Filter**-Dropdown, um nach Kategorien zu filtern:
- **Umwelt** — Naturschutz, Artenschutz, Gewässerschutz
- **Mobilität** — Fahrradwege, Fußwege, nachhaltiger Verkehr
- **Gemeinschaft** — Abfallmanagement, Olivenhaine, lokale Initiativen
- **Bildung** — Schulprojekte, Energiebildung
- **Kultur** — Kulturlandschaft, Tourismus

### Projektdetails ansehen
Klicken Sie auf ein Projekt, um die Detailseite aufzurufen:
- Beschreibung und Hintergründe
- Betroffene SDGs (Nachhaltigkeitsziele der UN)
- Belohnungspunkte bei Teilnahme
- Aktueller Teilnehmerzahl

---

## 3. An einem Projekt teilnehmen

**Voraussetzung:** Sie müssen eingeloggt sein.

1. Öffnen Sie die Projektdetailseite
2. Klicken Sie auf **Am Projekt teilnehmen**
3. Sie erhalten sofort die Belohnungspunkte gutgeschrieben
4. Das Projekt erscheint in Ihrem Dashboard unter "Ihre Projekte"

### Teilnahme zurückziehen
1. Öffnen Sie die Projektdetailseite
2. Klicken Sie auf **Teilnahme beenden**
3. Die Punkte werden von Ihrem Konto abgezogen

---

## 4. Punkte und Badges verstehen

### Punkte sammeln
- Jedes Projekt hat einen **Punktewert** (35–75 Punkte im Prototype)
- Punkte werden bei Projektteilnahme sofort gutgeschrieben
- Die Gesamtpunktzahl sehen Sie im Header (nach Login) und in Ihrem Dashboard

### Badges freischalten
Badges werden automatisch freigeschaltet, wenn Sie die Punkteschwelle erreichen:

| Badge | Punkte | Bedeutung |
|---|---|---|
| Newcomer (Νεοφερμένος) | 0 pts | Automatisch bei Registrierung |
| Activist (Ακτιβιστής) | 100 pts | Aktive Beteiligung |
| Eco Hero (Οικολογικός Ήρωας) | 300 pts | Herausragendes Engagement |
| Ambassador (Πρεσβευτής) | 500 pts | Community-Botschafter |
| Legend (Θρύλος) | 1000 pts | Legendäre Nachhaltigkeitsbeiträge |

### Belohnungen und Rangliste ansehen
- Klicken Sie auf **Belohnungen** in der Navigation (oder unter `/my-rewards` nach Login)
- Fortschrittsbalken zum nächsten Badge
- Rangliste der Top-10-Bürger:innen (öffentlich)

---

## 5. Profil und Sprache einstellen

### Profil bearbeiten
1. Klicken Sie auf das Dashboard-Symbol in der Navigation
2. Öffnen Sie **Profil**
3. Ändern Sie Ihren Namen und/oder die bevorzugte Sprache
4. Klicken Sie auf **Speichern**

### Sprache wechseln
- Klicken Sie auf das Globus-Symbol in der Navigation
- Wählen Sie: **EN** (Englisch), **EL** (Ελληνικά), **DE** (Deutsch)
- Die Spracheinstellung wird gespeichert und beim nächsten Besuch wiederhergestellt

### Dark Mode
- Klicken Sie auf das Mond/Sonne-Symbol in der Navigation
- Die Einstellung wird im Browser gespeichert

### Deine Daten (DSGVO)
Unter **Profil → Deine Daten** können Sie Ihre Datenschutzrechte selbst wahrnehmen:
- **Daten herunterladen:** lädt alle zu Ihrem Konto gespeicherten Daten als
  JSON-Datei herunter (Auskunft/Datenübertragbarkeit).
- **Konto löschen:** löscht Ihr Konto dauerhaft. Beiträge auf öffentlichen Boards
  (Ideen, Meldungen) bleiben **anonymisiert** erhalten; alles Übrige wird
  entfernt. Erfordert eine ausdrückliche Bestätigung und ist endgültig.

---

## 6. Schule beitreten & Schulranking

Schüler:innen können ihre Schule unterstützen: Eure gesammelten Punkte zählen zum
**Schulranking** (`/school-ranking`).

### Einer Schule beitreten
- **Bei der Registrierung:** Wählen Sie als Profil **Schüler:in** und geben Sie den
  **Schul-Code** ein (von Ihrer Schule/Lehrkraft, z. B. `KERKYRA-7F`).
- **Später im Profil:** Unter **Profil → Deine Schule** den Code eingeben und auf
  **Beitreten** klicken. Mit **Verlassen** treten Sie wieder aus.

### Schulranking
- Unter `/school-ranking` sehen Sie die Rangfolge. Sortiert wird nach **Ø-Punkten pro
  Mitglied** (damit kleine und große Schulen fair sind); Gesamtpunkte und Mitgliederzahl
  werden ebenfalls angezeigt.
- Eine Schule wird erst ab **3 Mitgliedern** gewertet.

---

## 7. Neuigkeiten verfolgen

Unter **Neuigkeiten** (`/news`) und auf der Startseite sehen Sie, was neu ist: neu
gestartete und abgeschlossene Projekte sowie Ankündigungen. Mit den Filtern oben
können Sie nach Typ filtern (Neu / Abgeschlossen / Ankündigung).

---

## 8. An Terminen teilnehmen

Unter **Termine** (`/events`) finden Sie konkrete Veranstaltungen — Reinigungstage,
Workshops, Foren. Nach Kategorie filterbar; bei vielen Terminen ist das zugehörige
**Projekt** verlinkt (Termine erscheinen auch auf der jeweiligen Projekt-Detailseite).

- **Eingeloggt:** Ein Klick auf **Anmelden** öffnet eine Bestätigungsabfrage;
  danach sind Sie eingetragen. Die **Punkte des Termins sind zunächst
  „ausstehend"** und werden gutgeschrieben, sobald die Gemeinde den Termin als
  **abgeschlossen** markiert.
- **Abmelden:** Solange der Termin nicht abgeschlossen ist, können Sie Ihre
  Anmeldung jederzeit absagen — direkt am Termin oder im **Dashboard** unter
  „Meine Veranstaltungen".
- **Als Gast:** ohne Konto mit Name, E-Mail und Einwilligung anmelden (ohne Punkte —
  ein Konto lohnt sich für die Punkte).
- Ihr Anmeldestatus wird gespeichert und beim nächsten Besuch angezeigt;
  doppelte Anmeldungen sind nicht möglich.
- Im **Dashboard** sehen Sie neben Ihren Punkten auch Ihre aktuelle
  ZOE-Stufe und alle Termine, an denen Sie teilnehmen (inkl. ausstehender bzw.
  gutgeschriebener Punkte).

---

## 9. Dein Username

Bei der Registrierung wählst du einen **Username** (3–20 Zeichen: Kleinbuchstaben,
Ziffern, Unterstrich). Er wird **öffentlich** angezeigt — bei Kommentaren, in der
Bestenliste und bei Erwähnungen — **anstelle** deines echten Namens oder deiner
E-Mail. Du kannst ihn jederzeit unter `/profile` ändern (muss eindeutig sein).

## 10. Bestenliste

Die **Bestenliste** ist Teil der **Belohnungs-Seite** (`/rewards`, unten) und
nur für eingeloggte Mitglieder sichtbar. Sie zeigt die Mitglieder mit den meisten
Punkten — ausschließlich mit **Username**, nie mit echtem Namen. Dein eigener
Eintrag ist hervorgehoben.

## 11. Mitdiskutieren: Event-Kommentare & Erwähnungen

Auf jeder Event-Seite gibt es eine **Diskussion**. **Lesen** können alle; zum
**Schreiben** brauchst du ein Konto (ein Hinweis steht über jeder Kommentar-Box).
Mit **`@username`** erwähnst du andere — beim Tippen von `@` erscheinen Vorschläge.
Erwähnte erhalten eine **Benachrichtigung** über die **Glocke** oben rechts (mit
Zähler für Ungelesenes): „@du wurde in einem Kommentar erwähnt".

## 12. Eigenes Event vorschlagen

Über `/participate` → „Submit an Idea" → Umschalter **Event** kannst du ein
**eigenes Event** vorschlagen (Titel, Beschreibung, Wunschdatum, Ort per
Adresssuche, optional Bild). Ein Admin prüft den Vorschlag; nach Freigabe wird er
als echtes Event veröffentlicht und erscheint unter `/events` (und auf der Karte).

## 13. Ideen verfolgen & für Ideen abstimmen

**Status deiner Ideen:** In deinem **Dashboard** (`/dashboard`) siehst du unter
„Deine Ideen" alle von dir eingereichten Ideen mit ihrem Status:
**Neu / In Prüfung** (das Team schaut sie an), **Angenommen** (freigegeben und
öffentlich auf der Ideen-Pinnwand) oder **Abgelehnt**.

**Abstimmen (Bürgerhaushalt-light):** Auf der Ideen-Pinnwand (`/ideas`) und der
Detailseite kannst du **freigegebene Ideen unterstützen** (👍). Die Pinnwand
sortiert nach Zustimmung — so sieht die Gemeinde, welche Ideen den Bürger:innen
am wichtigsten sind, und kann danach priorisieren. Abstimmen erfordert ein Konto
(eine Stimme pro Person und Idee, jederzeit zurücknehmbar).

## 14. Plattform-Übersicht

| Seite | Beschreibung |
|---|---|
| `/` | Startseite — Überblick + Neuigkeiten |
| `/rewards` | Belohnungen, Stufen + Bestenliste (Login) |
| `/projects` | Alle offenen Projekte |
| `/projects/:id` | Projektdetails + Teilnahme-Button |
| `/sdg-dashboard` | SDG-Fortschritte im Überblick |
| `/events` | Veranstaltungen und Workshops |
| `/news` | Neuigkeiten: neue/abgeschlossene Projekte, Ankündigungen |
| `/transparency` | Messdaten und Wirkungsmetriken |
| `/roadmap` | Zeitplan der 31 ZOE-Maßnahmen |
| `/rewards` | Öffentliche Rangliste + Badge-Info |
| `/school-ranking` | Schulranking (Ø-Punkte pro Mitglied) |
| `/my-rewards` | Persönliche Punkte und Badges (Login) |
| `/dashboard` | Persönliches Dashboard (Login) |
| `/profile` | Profil bearbeiten + Schule beitreten (Login) |

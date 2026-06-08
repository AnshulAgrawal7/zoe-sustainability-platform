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

## 8. Plattform-Übersicht

| Seite | Beschreibung |
|---|---|
| `/` | Startseite — Überblick + Neuigkeiten |
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

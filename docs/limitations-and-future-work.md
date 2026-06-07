# Limitations & Future Work — ZOE Plattform Nord-Korfu

> DSR-Artefakt nach Peffers et al. (2007) · Projektseminar WInf SoSe 2026, FAU, Gruppe 1
> Zweck: **transparent** festhalten, was **bewusst** noch nicht (vollständig) umgesetzt ist — getrennt nach
> „gebaut / teilweise / konzipiert". Dies ist Teil der DSR-Ehrlichkeit (built vs. conceived) und der
> **Szenario-Abgrenzung A/B** (siehe [`DEVLOG.md`](DEVLOG.md), [`MATRIX.md`](MATRIX.md)).
> Stand: 2026-06-08.

**Szenario A** (aktueller Demo-/Übergabe-Stand): öffentlich zeigbarer Prototyp, klar gekennzeichnet,
datensparsam, keine sensiblen Echtdaten. **Szenario B** (Future Work): produktiver Live-Betrieb als
offizieller Gemeinde-Kanal — erfordert die unten genannten Schritte.

---

## Übersicht

| Thema | Status | Bewusst offen? | Für Live-Betrieb (Szenario B) nötig |
|---|---|---|---|
| Passwort-Hashing (bcrypt, 12 Runden) | ✅ gebaut | — | — (erfüllt) |
| Impressum / Datenschutz | 🔨 Templates, Platzhalter | ja | ausfüllen + AVVs |
| E-Mail-Verifizierung (Double-Opt-in) | ❌ keine | ja | Mail-Dienst + Token-Flow |
| Beteiligung ohne Account: Persistenz | ❌ nicht gespeichert | ja | Endpoint + Moderation + GDPR-by-Design |
| Newsletter | 🔨 Konzept, kein Versand | ja | Double-Opt-in + Mail-Dienst |
| Offizielle UN-SDG-Icons | 🔨 farbige Text-Badges | ja | offizielle Iconografie |
| Schulprogramm (Zielgruppe Schüler:innen) | ❌ konzipiert | ja | zielgruppengerechtes Format |
| Rewards: profil-/interessenbasiert | ✅ gebaut (Iteration 12) | — | — |
| Rewards: altersbasiert | ❌ bewusst nicht gebaut | ja | Altersabfrage + Eltern-Einwilligung (<16) |
| Produktiv-Deployment (öffentlich) | ❌ offen | ja | Recht + AVVs + Kennzeichnung |

Legende: ✅ gebaut · 🔨 teilweise/konzipiert · ❌ nicht umgesetzt

---

## 1. Rechtliches: Impressum & Datenschutz
- **Stand:** `ImprintPage` + `PrivacyPage` existieren als **Templates mit Platzhaltern** (Iteration 9); PrototypeBanner durchgängig.
- **Bewusst:** Im Prototyp nicht final ausgefüllt — der **Betreiber** (nicht die Gemeinde) füllt aus.
- **Für Szenario B:** reale verantwortliche Person + Kontakt (Impressum, § 5 DDG), vollständige Datenschutzerklärung (Art. 13 DSGVO), **AVVs** mit Supabase + DeepL (+ ggf. Hostern), klare Prototyp-Kennzeichnung, ggf. Gemeinde-Freigabe für Inhalte/Namen.

## 2. Registrierung & Authentifizierung
- **Gebaut ✅:** Passwörter werden mit **bcrypt (12 Runden, mit Salt)** gehasht gespeichert (`authController.ts`); Klartext-Passwort wird nie gespeichert/geloggt; API gibt das Passwort-Feld nie zurück. JWT (Access 15 min + Refresh 7 d, httpOnly Cookie).
- **Offen ❌ — E-Mail-Verifizierung:** Es gibt **keinen** Double-Opt-in und **keine** Mail-Bibliothek. Konten sind nach der Registrierung **sofort aktiv**, die E-Mail ist **unverifiziert** (jemand könnte eine fremde Adresse angeben).
- **Bewusst:** datensparsam, kein Mailversand im Prototyp → eine Demo-Registrierung **spammt niemanden**.
- **Für Szenario B:** Transactional-Mail-Dienst (z. B. Resend/Postmark/SES) = weiterer Auftragsverarbeiter (AVV), Verifizierungs-Token-Flow, „unverified"-Status, Zustellbarkeit (SPF/DKIM, eigene Domain).

## 3. Beteiligung ohne Account
- **Stand:** Die `ParticipationPage` erlaubt Einreichungen **ohne Login** (DP2a), aber die Eingaben werden **nicht persistiert** (kein API-Call, keine Speicherung).
- **Bewusst:** kein produktives Backend für personenbezogene Beiträge in der Beta (Datenschutz).
- **Für Szenario B:** persistenter Endpoint + **Admin-Moderation** + GDPR-by-Design (Diamantopoulou et al. 2019; Paguay-Chimarro et al. 2025).

## 4. Newsletter
- **Stand:** Anmeldefeld als **Konzept**, **kein echter Versand** (Iteration 7/9).
- **Für Szenario B:** Double-Opt-in + Mail-Dienst + Abmeldelink.

## 5. SDG-Darstellung
- **Stand:** SDG-Beitrag über **farbige Text-Badges**; **keine offiziellen UN-SDG-Icons**.
- **Für Szenario B:** offizielle SDG-Iconografie (Lizenzbedingungen der UN beachten).

## 6. Zielgruppe Schüler:innen / Schulprogramm
- **Stand:** als zielgruppengerechtes Angebot **nur konzipiert** (Beleg: Peacock et al. 2018 [A], Vare 2025 [A]).
- **Für Szenario B:** dediziertes Format (z. B. Beach-Cleanups mit Schulen), ohne individuelle Minderjährigen-Daten.

## 7. Gamification / Rewards

### 7a. Aktueller Stand (gebaut)
- **Punkte** liegen in der DB (`User.points`). Vergabe **bei Teilnahme** an einem Projekt (`participate`: `points += project.rewardPoints`; Rücknahme dekrementiert). **Badge-Stufen** (Newcomer → Activist → Eco Hero → Ambassador → Legend) werden automatisch bei Erreichen eines Punkte-Schwellenwerts vergeben.
- **Designhaltung (DP2b):** bewusst **nicht rein belohnungsbasiert** — fundiert über **Self-Determination Theory** (Ryan & Deci 2000), Experimente (Sailer 2017, Mekler 2017) und die Warnung von Thiel et al. (2016). Punkte = Kompetenz-Feedback, nicht Selbstzweck.

### 7b. Gewähltes Design (konzipiert): profil-/interessenbasierte Rewards
- **Idee:** Statt Alter differenziert die Plattform **optional** nach **Zielgruppe/Interesse** (z. B. Einwohner:in · Tourist:in · Schüler:in · Volontär:in) — anknüpfend an die bestehende `AudiencesPage` und **DP4** (Zielgruppen-Heterogenität).
- **Wirkung:** zielgruppengerechte Inhalte/Anreize (welche Aktionen hervorgehoben werden, passende Beitragswege), ohne neue sensible Daten.
- **Privacy-by-Design:** **freiwillig**, keine personenbezogene Pflichtangabe, jederzeit änderbar; bleibt in **Szenario A** (datensparsam).
- **DSR/Beleg:** zielgruppenspezifische **Formate** statt Alters-Gating sind durch die Literatur gestützt (Peacock 2018, Vare 2025); konsistent mit DP4. **Evaluierbarkeit (FEDS):** wahrgenommene Relevanz/Passung je Profil.
- **Status:** ✅ **implementiert** (Iteration 12): Profil-Auswahl bei der Registrierung + editierbar im Profil; Reward-Fokus-Karte; `User.profile` in der DB (RESIDENT/VISITOR/STUDENT/VOLUNTEER); EN/EL/DE. Optional & ohne sensible Daten.

### 7c. Future Work mit Limitation: altersbasierte Rewards
- **Bewusst NICHT umgesetzt.** Begründung:
  - **Alter/Geburtsdatum = personenbezogene Daten.** Die Zielgruppe umfasst **Minderjährige (unter 18)**, deren Daten besonders geschützt sind.
  - Für die **DSGVO-Einwilligung** bei Online-Diensten gilt in Deutschland die Schwelle von **16 Jahren** (Art. 8 DSGVO): **unter 16** ist die **Einwilligung der Eltern/Sorgeberechtigten** erforderlich — praktisch aufwändig und im Prototyp unverhältnismäßig.
  - Widerspricht der bewussten **Datensparsamkeit** (Szenario A) und würde DP2b stärker ins rein Extrinsische verschieben.
- **Voraussetzungen, falls später (Szenario B):** optionale **Altersabfrage** bei der Registrierung, klare Rechtsgrundlage + Zweck, **Eltern-Einwilligungs-Flow** für Minderjährige, saubere Definition der Altersklassen, Datenschutzerklärung erweitern.
- **Bis dahin:** die **profil-/interessenbasierte Variante (7b)** wird bevorzugt — sie erreicht „passende Rewards pro Gruppe" ohne Minderjährigen-Daten.

## 8. Betrieb / Deployment
- **Stand:** läuft lokal gegen **Supabase (Postgres, EU/Frankfurt)**; DB austauschbar (nur Connection-String). Frontend/Backend-Deploy (Vercel/Render) als Blueprint vorbereitet (`deploy.md`).
- **Für ein öffentliches Deployment:** Impressum/Datenschutz **ausgefüllt** + AVVs + Prototyp-Kennzeichnung. **Zwischenoption** für die Präsentation: **passwortgeschütztes** Demo-Deploy (nicht „an die Allgemeinheit gerichtet").

---

## Bezug zur DSR
Diese Liste macht die Grenze zwischen **gebaut**, **teilweise** und **konzipiert** explizit (Gregor & Hevner 2013;
Ehrlichkeit der Demonstration, Phase 4) und ordnet jeden offenen Punkt **Szenario A vs. B** zu. Bewusste
Scope-Entscheidungen (Datensparsamkeit, kein produktives Backend, profil- statt altersbasiert) sind selbst
**Designwissen** und werden in der Präsentation als solche benannt.

Verwandt: [`MATRIX.md`](MATRIX.md) · [`DEVLOG.md`](DEVLOG.md) · [`deployment/deploy.md`](deployment/deploy.md) · [`literature-review.md`](literature-review.md)

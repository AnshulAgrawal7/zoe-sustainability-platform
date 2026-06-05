# Foliensatz — Anshul (Phase 4: Demonstration)

> ZOE-Plattform Nord-Korfu · DSR nach Peffers et al. (2007) · FAU SoSe 2026, Gruppe 1
> Vortrag: ~10 Min (Deutsch) + 5 Min Diskussion · Design-Grundlage: FAU-Template (`PP-Master-FAU_WiSo_16zu9_v2.pptx`)
> Backup-Outline zur `.pptx` — maßgebliche Quelle, falls die Folien-Generierung typografisch hakt.

---

## Folie 1 — Titel & DSR-Einordnung

**ZOE Nord-Korfu — Phase 4: Demonstration**
Anshul Agrawal · Projektseminar Wirtschaftsinformatik · FAU Erlangen-Nürnberg

- DSR nach Peffers et al. (2007): 6 Phasen — **hier Phase 4**
- *Platzhalter: Screenshot Peffers-Prozessdiagramm, Phase 4 markieren*

**Speaker Notes (DE):** Vielen Dank, Marieclaire. Ich übernehme Phase 4 — die Demonstration. Marieclaire hat die Designprinzipien hergeleitet und in einem Artefakt instanziiert; meine Aufgabe ist es zu zeigen, dass dieses Artefakt die identifizierten Teilprobleme in realistischen Situationen tatsächlich adressiert. Auf dem Peffers-Diagramm ist meine Phase markiert: Demonstration, zwischen Entwicklung und Evaluation.

---

## Folie 2 — Was ist Demonstration? (Abgrenzung zur Evaluation)

- **Demonstration:** zeigt, **dass** das Artefakt das Problem lösen *kann* (Instanziierung in Szenarien)
- **Evaluation (Phase 5):** misst, **wie gut** es löst (mit echten Nutzer:innen)
- methodisch: *expository instantiation* (Gregor & Jones, 2007)

**Speaker Notes (DE):** Zunächst eine wichtige Abgrenzung. Demonstration und Evaluation sind nicht dasselbe. Demonstration zeigt, *dass* das Artefakt das Problem grundsätzlich lösen kann — anhand konkreter, repräsentativer Szenarien. Evaluation, also Phase 5, misst dann, *wie gut* es das tut, mit echten Nutzer:innen und Kennzahlen. Methodisch entspricht meine Phase der *expository instantiation* bei Gregor und Jones (2007): das lauffähige Beispiel, an dem ein abstraktes Designprinzip beobachtbar wird.

---

## Folie 3 — Artefakt-Überblick

- Full-Stack: React/TypeScript-Frontend, Express/Prisma-Backend, JWT-Admin
- mehrsprachig (EN/EL/DE), WCAG-2.1-AA-Setup, 44 Unit-/Integration- + 49 E2E-Tests
- **gebaut vs. konzipiert** sauber getrennt
- *Platzhalter: Screenshot Startseite (Desktop + 375px Mobile)*

**Speaker Notes (DE):** Ein kurzer Überblick über das, was demonstriert wird. ZOE ist eine Full-Stack-Anwendung: ein React-Frontend, ein Express/Prisma-Backend mit einem Admin-Bereich für die Gemeinde, durchgängig dreisprachig angelegt, mit WCAG-2.1-AA-Setup und automatisierten Tests. Ich betone bei jedem Schritt, was tatsächlich gebaut ist und was nur konzipiert — das ist akademische Pflicht und schützt vor Überverkaufen.

---

## Folie 4 — Demo-Szenario A: Aktionen finden & als Gast beitragen (TP1, TP6)

- **Persona:** Tourist:in bei Acharavi, eine Woche da
- Weg: Aktionsübersicht → „Get Involved" → Initiative-Tab *Meer & Küste* → „Wie Besucher:innen beitragen"
- **DP1** (zentral/gruppiert) · **DP6** (Tourist:innen als Ressource)
- Belege: Simelio-Solà et al. 2021 **[A]**; Vegas Macias et al. 2023 **[A]**, Laksmi et al. 2026 **[A]**
- *Hier Live-Demo / Screenshot einfügen: Initiative-Tabs + Tourist:innen-Sektion*

**Speaker Notes (DE):** Erstes Szenario, gekoppelt an Teilproblem 1 und 6. Stellen Sie sich eine Touristin vor, die eine Woche bei Acharavi ist und helfen möchte. Sie startet auf der Aktionsübersicht, geht zur neuen „Get Involved"-Seite, wählt den Initiative-Tab „Meer & Küste" und öffnet die Sektion „Wie Besucher:innen beitragen". Das demonstriert zwei Prinzipien: DP1 — ein zentraler, gruppierter Ort — und DP6 — Tourist:innen als Ressource statt nur als Müllquelle. Belegt durch Typ-A-Quellen: Simelio-Solà et al. für die Sichtbarkeit, und für die Tourismus-Einbindung die stark analogen Mittelmeer-Studien von Vegas Macias et al. (Malta) und Laksmi et al. (Bali). *Hier zeige ich die Live-Demo.*

---

## Folie 5 — Demo-Szenario B: Idee einreichen ohne Account (TP2)

- **Persona:** Anwohner:in aus Kassiopi mit Idee für regelmäßige Säuberung
- Weg: Beteiligungsseite → „Idee einreichen" → Formular **ohne Registrierung** → Bestätigung
- **DP2a** (Hürde senken) — Saldivar et al. **[A]**, Arana-Catania et al. 2021 **[A]**
- **Ehrliche Grenze:** Einreichung wird (noch) nicht persistiert → bewusster Scope
- Punkte-Anreiz mit Evaluations-Vorbehalt (Thiel et al. 2016 **[B]**: reward-based ≠ langfristig)
- *Hier Live-Demo / Screenshot: Formular ohne Account + Bestätigung*

**Speaker Notes (DE):** Zweites Szenario, Teilproblem 2. Eine Anwohnerin aus Kassiopi hat eine Idee. Sie öffnet die Beteiligungsseite, wählt „Idee einreichen", füllt das Formular *ohne Registrierung* aus und erhält eine Bestätigung. Das demonstriert DP2a — Hürde senken — belegt durch Saldivar et al. und Arana-Catania et al. Ich bin hier bewusst ehrlich: Die Einreichung wird im Prototyp nicht gespeichert — das ist eine Scope-Entscheidung, kein Versehen. Und die Punkte-Belohnung zeige ich mit Vorbehalt: Thiel et al. (2016) warnen, dass rein belohnungsbasierte Gamification nur kurzfristig wirken kann. Ob sie hier hilft oder schadet, ist eine Frage für Phase 5.

---

## Folie 6 — Demo-Szenario C: SDG-Beitrag & Wirkung verstehen (TP3)

- **Persona:** Lehrer:in bereitet Unterricht vor
- Weg: SDG-Badges am Projekt → SDG-Dashboard → Transparenz-KPIs
- **DP3a/b** — Chokki et al. **[A, Preprint]**, Simonofski et al. 2022 **[A]**, Grimmelikhuijsen & Welch 2012 **[A]**
- alle Zahlen klar als **fiktive Prototyp-Daten** gekennzeichnet
- *Hier Live-Demo / Screenshot: SDG-Dashboard + Transparenz*

**Speaker Notes (DE):** Drittes Szenario, Teilproblem 3. Ein Lehrer möchte wissen, welche SDGs die lokalen Aktionen bedienen und was sie erreicht haben. Er geht von den SDG-Badges eines Projekts zum SDG-Dashboard und zur Transparenzseite mit Wirkungs-Kennzahlen. Das demonstriert DP3a und DP3b — belegt durch Chokki et al. (Dashboards erhöhen Engagement, allerdings Preprint), Simonofski et al. (Laien erwarten vereinfachte, visualisierte Daten) und Grimmelikhuijsen und Welch zur Outcome-Transparenz. Wichtig: Alle Zahlen sind klar als fiktive Prototyp-Daten gekennzeichnet.

---

## Folie 7 — Demo-Szenario D: Heterogene Zielgruppen erreichen (TP4)

- **Persona:** griechischsprachige ältere Anwohnerin & deutschsprachiger Gast mit Screenreader
- Weg: Sprachumschaltung EN/EL/DE → reine Tastaturnavigation → Fokus-Indikatoren → Accessibility-Erklärung
- **DP4** — Csontos & Heckl 2021/2025 **[A]**, Pontus & Rodríguez Vázquez 2021 **[A]**, Asghari et al. 2023 **[A]**
- **Ehrliche Grenze:** ältere Seiten noch nicht durchgängig i18n; `/get-involved` schon
- *Hier Live-Demo / Screenshot: Sprachumschaltung + Tastatur-Fokus*

**Speaker Notes (DE):** Viertes Szenario, Teilproblem 4. Zwei Kontraste: eine griechischsprachige ältere Anwohnerin und ein deutschsprachiger Gast mit Screenreader. Ich schalte die Sprache zwischen Englisch, Griechisch und Deutsch um, navigiere nur per Tastatur, zeige sichtbare Fokus-Indikatoren und die Accessibility-Erklärung. Das demonstriert DP4 — belegt durch Csontos und Heckl, Pontus und Rodríguez Vázquez und Asghari et al. Auch hier ehrlich: Einige ältere Seiten sind noch nicht vollständig mehrsprachig — die neue „Get Involved"-Seite hingegen schon.

---

## Folie 8 — Brücke zur Evaluation (Phase 5)

- **Jetzt machbar (ex-ante / artificial):** WCAG-Audit (axe + manuell, Methodik Csontos & Heckl), Lighthouse (wie Tsatsani et al. 2024), heuristischer Walkthrough
- **Konzipiert (ex-post / naturalistic):** Task-Tests, SUS, Verständnis-/Transparenz-Maße
- **Rahmen:** FEDS (Venable et al., 2016) — Strategie *Human Risk & Effectiveness*
- Übergabe an Phase 5 (Evaluation) → Phase 6 (Kommunikation)

**Speaker Notes (DE):** Zum Abschluss die Brücke zur Evaluation. Demonstration ist nicht Evaluation — aber sie zeigt, dass das Artefakt evaluierbar ist. Artificial, also ex-ante, ist jetzt schon machbar: ein WCAG-Audit mit axe und manuell nach der Methodik von Csontos und Heckl, ein Lighthouse-Audit genau wie bei Tsatsani et al. für griechische Kommunen, und ein heuristischer Walkthrough. Naturalistic, also ex-post mit echten Nutzer:innen, ist konzipiert: Aufgaben-Tests, die System Usability Scale, Verständnis- und Transparenzmaße. Strukturiert ist das nach dem FEDS-Rahmen von Venable et al. (2016), Strategie „Human Risk and Effectiveness". Damit übergebe ich an Phase 5. Vielen Dank — gerne Ihre Fragen.

---

## Folie 9 — Quellen (Auswahl, APA7)

- Peffers, K., et al. (2007). A design science research methodology. *JMIS, 24*(3), 45–77.
- Gregor, S., & Jones, D. (2007). The anatomy of a design theory. *JAIS, 8*(5), 312–335.
- Venable, J., Pries-Heje, J., & Baskerville, R. (2016). FEDS. *EJIS, 25*(1), 77–89.
- Tsatsani, O., et al. (2024). … user experience: Greek municipalities. *JSIS, 19*(3).
- Vegas Macias, J., et al. (2023). Connecting fishing and tourism … Marsaxlokk, Malta. *Maritime Studies, 22*, 24.
- Laksmi, P. A. S., et al. (2026). Sustainable tourism … community participation. *EJOSDR, 10*(2), em0373.
- Arana-Catania, M., et al. (2021). Citizen participation and machine learning … *DGOV, 2*(3).
- Thiel, S.-K., et al. (2016). Playing (with) democracy. *JeDEM, 8*(3), 32–60.

> Vollständige Liste + A/B-Klassifikation: `docs/literature-review.md`.
</content>

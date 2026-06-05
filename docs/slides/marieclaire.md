# Foliensatz — Marieclaire (Phase 3: Design & Development)

> ZOE-Plattform Nord-Korfu · DSR nach Peffers et al. (2007) · FAU SoSe 2026, Gruppe 1
> Vortrag: ~10 Min (Deutsch) + 5 Min Diskussion · Design-Grundlage: FAU-Template (`PP-Master-FAU_WiSo_16zu9_v2.pptx`)
> Backup-Outline zur `.pptx` — falls die Folien-Generierung typografisch hakt, ist dies die maßgebliche Quelle.

---

## Folie 1 — Titel & DSR-Einordnung

**ZOE Nord-Korfu — Phase 3: Design & Entwicklung**
Marieclaire · Projektseminar Wirtschaftsinformatik · FAU Erlangen-Nürnberg

- DSR nach Peffers et al. (2007): 6 Phasen — **hier Phase 3**
- *Platzhalter: Screenshot Peffers-Prozessdiagramm, Phase 3 markieren*

**Speaker Notes (DE):** Guten Tag. Mein Teil ist Phase 3 des Design-Science-Research-Prozesses nach Peffers et al. (2007) — also *Design & Development*. Auf dem Diagramm sehen Sie die sechs Phasen; ich bin für die markierte zuständig: die Übersetzung der in Phase 1 und 2 vom Team erarbeiteten Probleme und Ziele in begründete Designprinzipien und ein lauffähiges Artefakt. Anshul übernimmt danach Phase 4, die Demonstration.

---

## Folie 2 — Was ist das Artefakt? (zweistufig)

- **Stufe 1 — die Website:** zentrale Plattform für die ZOE-Umweltaktionen (React/TypeScript, mehrsprachig EN/EL/DE, barrierefrei)
- **Stufe 2 — die Designprinzipien:** das eigentliche, übertragbare *Designwissen* hinter der Website
- Beitragstyp: **Improvement / Exaptation** (Gregor & Hevner, 2013)

**Speaker Notes (DE):** Wichtig für DSR: Das Artefakt ist nicht nur die Website. Es hat zwei Stufen. Stufe 1 ist die sichtbare, lauffähige Plattform. Stufe 2 — und das ist der wissenschaftliche Kern — sind die Designprinzipien: präskriptive Aussagen, die auch über Korfu hinaus gelten. Nach Gregor und Hevner (2013) ist unser Beitrag ein *Improvement* bzw. eine *Exaptation*: Wir übertragen bewährte Lösungen aus der E-Partizipation und Transparenzforschung in einen bislang unterversorgten Kontext — eine kleine Mittelmeer-Inselgemeinde.

---

## Folie 3 — Von Problem zu Designprinzip (Beispiel TP2)

Kette: **Problem → Ziel → Designprinzip → Beleg**

- **Problem (TP2):** keine niedrigschwellige Anlaufstelle; Beteiligung hängt an persönlichen Netzwerken
- **Ziel (Phase 2):** Einreichung *ohne Pflicht-Account*
- **DP2a:** „Senke Beteiligungshürden — Beiträge ohne Account, Inhalte gegen Informationsüberflutung kuratieren"
- **Beleg:** Saldivar et al. **[A]**, Arana-Catania et al. 2021 **[A]**
- *Platzhalter: Diagramm der Ableitungskette*

**Speaker Notes (DE):** So leiten wir jedes Feature ab — getreu dem Leitsatz unseres Betreuers: erst das Problem, dann das Feature. Beispiel Partizipationsbarriere: Das Problem ist, dass es keine niedrigschwellige Anlaufstelle gibt. Das Phase-2-Ziel ist Einreichung ohne Pflicht-Account. Daraus folgt Designprinzip 2a. Belegt ist es durch zwei Typ-A-Quellen — also gemessene Effekte: Saldivar et al. zeigen, dass Registrierungszwang eine messbare Hürde ist, und Arana-Catania et al. (2021) zeigen am Beispiel Decide Madrid, dass Informationsüberflutung Beteiligung behindert.

---

## Folie 4 — Die Matrix (zentrales Instrument)

Spalten: Teilproblem · Lösungsziel · **Designprinzip** · **Quelle (A/B)** · Umsetzung Design · Umsetzung Implementierung · Evaluierbarkeit · Urheber:in

- macht das Designrationale in **beide Richtungen nachvollziehbar**
- erzwingt Ehrlichkeit: **gebaut / teilweise / konzipiert** + **A/B**-Regel
- *Platzhalter: Auszug aus `docs/MATRIX.md`*

**Speaker Notes (DE):** Das zentrale Instrument meiner Phase ist diese Matrix. Jede Zeile ist ein Teilproblem, jede Spalte ein Schritt der Begründung. Sie ist in beide Richtungen lesbar: Zu jedem Feature finde ich das Prinzip und die Quelle, und zu jedem Prinzip sehe ich, ob und wie es umgesetzt wurde. Die Matrix erzwingt zwei Ehrlichkeitsregeln: Die Implementierungsspalte trennt gebaut, teilweise und nur konzipiert; und die Quellenspalte unterscheidet Typ A — gemessener Effekt — von Typ B — Rahmenwerk. Eine Typ-B-Quelle dürfen wir nie als gemessenen Effekt verkaufen.

---

## Folie 5 — Designprinzipien im Detail (Auswahl)

- **DP1 (Sichtbarkeit):** zentraler, strukturierter, gruppierbarer Ort — Simelio-Solà et al. 2021 **[A]**, Tsatsani et al. 2024 **[A]**
- **DP3a (SDG-Transparenz):** verständliches Dashboard mit aussagekräftigen Metriken — Chokki et al. **[A, Preprint]**, Simonofski et al. 2022 **[A]**
- **DP4 (Zielgruppen):** Mehrsprachigkeit **und** WCAG 2.1 AA in **jeder** Sprachfassung — Csontos & Heckl 2021/2025 **[A]**, Pontus & Rodríguez Vázquez 2021 **[A]**

**Speaker Notes (DE):** Drei weitere Prinzipien exemplarisch. DP1: ein zentraler, strukturierter Ort — belegt dadurch, dass unstrukturierte kommunale Information nachweislich fundierte Entscheidungen verhindert (Simelio-Solà et al. 2021 über 605 Kommunen; Tsatsani et al. 2024 für griechische Kommunen). DP3a: ein laienverständliches Dashboard — Chokki et al. zeigen experimentell, dass gut gestaltete Dashboards das Engagement erhöhen; das ist allerdings ein Preprint, also mit Vorsicht. DP4 ist besonders wichtig: Mehrsprachigkeit allein reicht nicht — Pontus und Rodríguez Vázquez zeigen, dass lokalisierte Sprachfassungen oft *weniger* barrierefrei sind. Deshalb muss WCAG 2.1 AA in jeder Sprache gelten.

---

## Folie 6 — Architektur & Tech-Entscheidungen

- Frontend React 19 / TypeScript / Tailwind · `react-i18next` (EN/EL/DE) · Zustand
- Backend Node/Express/Prisma/SQLite · JWT (Admin = Gemeinde)
- **Bewusste Designentscheidung:** *kein* produktives Backend für freie Einreichungen in der Beta
- Trennung UI ↔ Service-Layer → API später austauschbar

**Speaker Notes (DE):** Zur Architektur: ein Full-Stack-Web-Artefakt. Diese Wahl ist eine bewusste Designentscheidung — pragmatisch, ohne Wirkungsbehauptung, deshalb ohne Literaturbeleg. Zwei Punkte sind aber designrelevant. Erstens die strikte Trennung von Oberfläche und Datenzugriff: Komponenten rufen nie direkt das Netzwerk, sondern gehen über eine Service-Schicht — das erlaubte den Wechsel von statischen Daten zur echten API ohne UI-Umbau. Zweitens: Wir betreiben in der Beta *bewusst kein* produktives Backend für die freie Einreichung von Bürgerinitiativen. Das ist keine Lücke, sondern eine Entscheidung — denn personenbezogene Daten erfordern Privacy-by-Design (Diamantopoulou et al. 2019; Spannungsfeld bei Paguay-Chimarro et al. 2025). Das ist Future Work.

---

## Folie 7 — Iterationen (Design Cycle)

Aus `docs/DEVLOG.md` — 7 Iterationen:

1. Frontend-MVP → 2. Korfu-Kontext + Zielgruppen → 3. Full-Stack + Auth → 4. i18n/Dark Mode → 5. WCAG 2.1 AA + axe → 6. E2E-Tests → **7. „Get Involved" (Initiative-Tabs, Tourist:innen, Newsletter)**

- jede Iteration: TP · Entscheidung · Begründung · Status (inkl. *ehrlicher Grenzen*)
- *Platzhalter: Zeitstrahl der Iterationen*

**Speaker Notes (DE):** Der Design-Cycle nach Hevner ist die enge Schleife aus Konstruieren und Bewerten. Unser Entwicklungsprotokoll dokumentiert sieben Iterationen — vom Frontend-MVP über den Full-Stack-Schritt und die Barrierefreiheit bis zur jüngsten, additiven „Get Involved"-Iteration mit Initiative-Tabs, der Tourist:innen-Sektion und dem Newsletter-Konzept. Wichtig: Wir protokollieren auch ehrliche Grenzen — etwa, dass mehrere ältere Seiten noch hartkodierten Text enthalten. Solche Befunde sind selbst Designwissen für den nächsten Zyklus.

---

## Folie 8 — Übergang zu Phase 4 (Anshul)

- Designprinzipien sind **abgeleitet, begründet, instanziiert** — aber noch nicht *evaluiert*
- Phase 4 (Anshul): **Demonstration** der Prinzipien in Szenarien
- Phase 5: Evaluation nach FEDS (Venable et al., 2016) → Übergabe

**Speaker Notes (DE):** Damit ist meine Phase abgeschlossen: Die Designprinzipien sind abgeleitet, literaturbasiert begründet und in einem lauffähigen Artefakt instanziiert. Was sie noch nicht sind: evaluiert mit echten Nutzer:innen. Genau dort setzt Anshul mit Phase 4 an — der Demonstration der Prinzipien in konkreten Szenarien — und bereitet die Evaluation nach dem FEDS-Rahmen vor. Ich übergebe an Anshul. Vielen Dank.

---

## Folie 9 — Quellen (Auswahl, APA7)

- Gregor, S., & Jones, D. (2007). The anatomy of a design theory. *JAIS, 8*(5), 312–335.
- Gregor, S., & Hevner, A. R. (2013). Positioning and presenting DSR for maximum impact. *MIS Quarterly, 37*(2), 337–355.
- Peffers, K., et al. (2007). A design science research methodology. *JMIS, 24*(3), 45–77.
- Simelio-Solà, N., et al. (2021). Transparent information and access to citizen participation on municipal websites. *El Profesional de la Información, 30*(2).
- Simonofski, A., et al. (2022). Tailoring open government data portals for lay citizens. *IJIM, 65*, 102511.
- Csontos, B., & Heckl, I. (2021/2025). Accessibility … Hungarian government websites. *UAIS.*
- Pontus, V., & Rodríguez Vázquez, S. (2021). Language-related criteria … multilingual websites. *BfC 2020.*
- Diamantopoulou, V., et al. (2019). Preserving digital privacy in e-participation … GDPR.

> Vollständige Liste + A/B-Klassifikation: `docs/literature-review.md`. **Hinweis:** Cronholm & Göbel (2018) war im Briefing genannt, ist aber nicht im Korpus → nur Gregor & Jones (2007) verwendet.
</content>

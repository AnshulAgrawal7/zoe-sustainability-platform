# Literature Review — ZOE Plattform Nord-Korfu

> DSR-Artefakt nach Peffers et al. (2007) · Projektseminar WInf SoSe 2026, FAU, Gruppe 1
> Verwandt: [`literature-index.md`](literature-index.md) · [`MATRIX.md`](MATRIX.md) · [`phase1-2-bridge.md`](phase1-2-bridge.md)

Pro Quelle: **APA7-Vollzitat**, **Kernaussage** (ausschließlich aus dem PDF extrahiert), **Typ A/B**, gestützte(s) **Teilproblem(e)/Designprinzip(ien)**, **Fundstelle** und **Status**.

### A/B-Klassifikation (verbindliche Formulierungsregel)

- **Typ A — Evidenz:** Quelle berichtet einen **gemessenen Effekt** (Experiment, Survey, Fallstudien-Evaluation, Regression). → erlaubte Formulierung: „Studie X zeigt, dass … messbar …".
- **Typ B — Framework:** Quelle **empfiehlt/bietet ein Rahmenwerk, Modell oder Review-Synthese**. → erlaubte Formulierung: „Das Rahmenwerk von X empfiehlt …".

> **Anti-Halluzinations-Hinweis:** Eine Typ-B-Quelle wird **niemals** als gemessener Effekt verkauft. Fundstellen sind als verifizierbare Abschnitte (Abstract, Findings, Conclusion) angegeben; exakte Seiten sind im Volltext nachzuprüfen. **⚠️** = unsichere Angabe / Preprint / nur vorsichtig verwenden.

---

## A. Wissensbasis — DSR-Methodik (Rigor-Zyklus)

> Diese fünf Quellen begründen **Methode und Wissensbeitrag**, nicht Wirkungsaussagen über Features. Sie sind durchweg **Typ B** (methodische Rahmenwerke).

### [1] Peffers et al. (2007) — DSRM
- **Zitat:** Peffers, K., Tuunanen, T., Rothenberger, M. A., & Chatterjee, S. (2007). A design science research methodology for information systems research. *Journal of Management Information Systems, 24*(3), 45–77.
- **Kernaussage:** Definiert ein nominales Prozessmodell der DSR mit sechs Aktivitäten: (1) Problemidentifikation & Motivation, (2) Zieldefinition einer Lösung, (3) Design & Entwicklung, (4) Demonstration, (5) Evaluation, (6) Kommunikation; mit vier möglichen Einstiegspunkten (problem-, ziel-, design- bzw. klientenzentriert).
- **Typ:** **B** (Methodik/Prozessmodell).
- **Stützt:** Gesamtarchitektur des Artefakts; die Phasenlogik beider Berichte; Trennung Phase 3 (Design & Development) / Phase 4 (Demonstration).
- **Fundstelle:** Abstract; Prozessmodell-Abschnitt. — **VT**

### [2] Hevner (2007) — Three Cycle View
- **Zitat:** Hevner, A. R. (2007). A three cycle view of design science research. *Scandinavian Journal of Information Systems, 19*(2), 87–92.
- **Kernaussage:** DSR besteht aus drei verschränkten Zyklen — **Relevance Cycle** (Anforderungen/Feldtest aus dem Anwendungskontext), **Rigor Cycle** (Grundlagentheorien & Methoden aus der Wissensbasis, Rückspeisung neuen Wissens) und **Design Cycle** (iteratives Konstruieren & Evaluieren).
- **Typ:** **B** (konzeptionelles Rahmenwerk).
- **Stützt:** Argumentation, dass Korfu-Kontext (Relevance), Literaturkorpus (Rigor) und MATRIX/DEVLOG-Iterationen (Design) korrekt verschränkt sind.
- **Fundstelle:** Abstract; „Design Science Research Cycles". — **VT**

### [3] Gregor & Hevner (2013) — Positioning DSR
- **Zitat:** Gregor, S., & Hevner, A. R. (2013). Positioning and presenting design science research for maximum impact. *MIS Quarterly, 37*(2), 337–355.
- **Kernaussage:** Liefert eine Wissensbeitrags-Typologie (u. a. *Improvement*: neue Lösung für bekanntes Problem; *Exaptation*: bekannte Lösung in neue Domäne) und Leitlinien zur Präsentation von DSR.
- **Typ:** **B** (Klassifikations-/Präsentationsrahmen).
- **Stützt:** Einordnung der ZOE-Plattform als *Improvement/Exaptation* (Übertragung etablierter E-Partizipations-/Transparenz-Designs auf den Kontext Nord-Korfu).
- **Fundstelle:** Knowledge-Contribution-Framework-Abschnitt. — **VT**

### [4] Gregor & Jones (2007) — Anatomy of a Design Theory
- **Zitat:** Gregor, S., & Jones, D. (2007). The anatomy of a design theory. *Journal of the Association for Information Systems, 8*(5), 312–335.
- **Kernaussage:** Identifiziert acht Komponenten einer Designtheorie, darunter **(3) principles of form and function** und **(7) principles of implementation** — die formale Grundlage, um **Designprinzipien** explizit zu spezifizieren.
- **Typ:** **B** (Theorie-Spezifikationsrahmen).
- **Stützt:** **Form jeder Designprinzip-Formulierung** in [`MATRIX.md`](MATRIX.md) (Marieclaires Hauptinstrument).
- **Fundstelle:** Abstract; „eight components" (Komponentenliste). — **VT**

### [4b] Cronholm & Göbel (2018) — Guidelines for Formulating Design Principles
- **Zitat:** Cronholm, S., & Göbel, H. (2018). Guidelines supporting the formulation of design principles. In *Proceedings of the 29th Australasian Conference on Information Systems (ACIS 2018)*. Sydney, Australia.
- **Kernaussage:** Bestehende Designprinzipien variieren stark in **Struktur, Inhalt und Abstraktionsgrad**, was ihre **Wiederverwendbarkeit** behindert. Die Autoren schlagen **drei Guidelines** vor, um generalisierbare, verständliche und wiederverwendbare Designprinzipien zu formulieren (abgeleitet aus der Analyse theoretischer Aussagen, bestehender Guidelines und bestehender Designprinzipien).
- **Typ:** **B** (methodisches Rahmenwerk / Guidelines).
- **Stützt:** **Form der Designprinzip-Formulierung** in [`MATRIX.md`](MATRIX.md) — ergänzend zu Gregor & Jones (2007); zentrale Methodengrundlage für Marieclaires Phase 3.
- **Fundstelle:** Abstract; „three guidelines"-Abschnitt. — **VT**

### [5] Venable et al. (2016) — FEDS
- **Zitat:** Venable, J., Pries-Heje, J., & Baskerville, R. (2016). FEDS: A framework for evaluation in design science research. *European Journal of Information Systems, 25*(1), 77–89.
- **Kernaussage:** FEDS charakterisiert Evaluation entlang zweier Dimensionen — Zweck (**formativ/summativ**) und Paradigma (**artificial/naturalistic**) — und gibt einen 4-Schritte-Prozess („why, when, how, what to evaluate"); benennt Strategien wie *Human Risk & Effectiveness* und *Technical Risk & Efficacy*.
- **Typ:** **B** (Evaluations-Rahmenwerk).
- **Stützt:** **Phase-5-Brücke** (Anshul): ex-ante/artificial (WCAG/Lighthouse) jetzt machbar; ex-post/naturalistic als Konzept.
- **Fundstelle:** Abstract; 2×2-Charakterisierung. — **VT**

---

## B. Vergleichbare kommunale E-Partizipation (Best Practice / EU-Vergleich)

### [15] Arana-Catania et al. (2021) — Decide Madrid + ML
- **Zitat:** Arana-Catania, M., van Lier, F.-A., Procter, R., Tkachenko, N., He, Y., Zubiaga, A., & Liakata, M. (2021). Citizen participation and machine learning for a better democracy. *Digital Government: Research and Practice, 2*(3), Article 27.
- **Kernaussage:** Am Fallbeispiel der **Decide-Madrid/Consul-Plattform** wird **Informationsüberflutung** als zentrale Barriere direkter Bürgerbeteiligung identifiziert; NLP/ML-Verfahren (Vorschlags-Empfehlung, Gruppierung nach Interessen, Kommentar-Zusammenfassung) adressieren diese Barriere; die Evaluation bestätigt deren Nutzen.
- **Typ:** **A** (Fallstudien-Evaluation; demonstrierter Nutzen).
- **Stützt:** **TP2** (Partizipationsbarriere; Informationsüberflutung), DP „niedrigschwellige, kuratierte Beteiligung"; Vergleichskommune.
- **Fundstelle:** Abstract; Evaluation. — **VT**

### [16] Royo et al. (2020) — Decide Madrid: Critical Analysis
- **Zitat:** Royo, S., Pina, V., & Garcia-Rayado, J. (2020). Decide Madrid: A critical analysis of an award-winning e-participation initiative. *Sustainability, 12*(4), 1674.
- **Kernaussage:** Explorative Fallstudie (Desk Research + semi-strukturierte Interviews). Die **hohen Erwartungen der Bürger:innen** erklären die anfänglich hohe Beteiligung; jedoch **beeinträchtigen mangelnde Transparenz und schlecht funktionierende Beteiligungsformate die Performance** negativ. Die Software *Consul* wurde in >100 Institutionen in 33 Ländern übernommen.
- **Typ:** **A** (Fallstudie; identifizierte Erfolgs-/Misserfolgsfaktoren).
- **Stützt:** **TP2**, **TP3** (Transparenz als Beteiligungs-Erfolgsfaktor); DP „Transparenz über Wirkung schafft Vertrauen"; Vergleichskommune.
- **Fundstelle:** Abstract; Ergebnisse. — **VT**

### [17] Royo et al. (2024) — Success of E-Participation (Madrid + Schottland)
- **Zitat:** Royo, S., Bellò, B., Torres, L., & Downe, J. (2024). The success of e-participation: Learning lessons from Decide Madrid and We Asked, You Said, We Did in Scotland. *Policy & Internet, 16*(1), 65–82.
- **Kernaussage:** Vergleichende Analyse zweier weit verbreiteter E-Partizipations-Lösungen; identifiziert **Best Practices und Verbesserungsbereiche** als Orientierung für Folge-Adoptierende; betont das Schließen der Feedback-Schleife („closing the loop").
- **Typ:** **A** (vergleichende Fallstudien-Analyse).
- **Stützt:** **TP2**; DP „Rückmeldung sichtbar machen (You said → We did)"; EU-Vergleich.
- **Fundstelle:** Abstract. — **VT**

### [18] Pina et al. (2024) — Decide Madrid Best Practice (Kapitel)
- **Zitat:** Pina, V., Torres, L., Royo, S., & Garcia-Rayado, J. (2024 ⚠️). Decide Madrid: A Spanish best practice on e-participation. In *[Hrsg.-Band, Kap. 11]*. Edward Elgar.
- **Kernaussage:** Benennt Barrieren effektiver Beteiligung (mangelnde Information, Misstrauen, geringe Adoption, fehlender Einfluss auf Entscheidungen) und beschreibt Decide Madrid als internationalen Referenzpunkt (>400 000 registrierte Nutzer:innen 2018; UN Public Service Award 2018).
- **Typ:** **A** (beschreibende Best-Practice-Fallstudie).
- **Stützt:** **TP2**; Barrieren-Katalog; Vergleichskommune.
- **Fundstelle:** Einleitung. — **VT**, ⚠️ Hrsg./Jahr prüfen.

### [8] Shin et al. (2024) — Systematic Analysis of Digital Tools
- **Zitat:** Shin, B., Floch, J., Rask, M., Bæck, P., Edgar, C., Berditchevskaia, A., Mesure, P., & Branlat, M. (2024). A systematic analysis of digital tools for citizen participation. *Government Information Quarterly, 41*(2), 101954.
- **Kernaussage:** Analyse von **116 digitalen Beteiligungswerkzeugen** (Cluster-Analyse). Werkzeuge erleichtern v. a. den Informationsfluss **von** Bürger:innen **zu** Regierungen; ein **deutliches Defizit besteht beim Zurückspielen von Accountability-Informationen** (wie Entscheidungen getroffen/umgesetzt/bewertet werden).
- **Typ:** **A** (empirische Bestandsanalyse; identifiziertes Defizit).
- **Stützt:** **TP2/TP3**; DP „Wirkung & Entscheidungsweg zurückspielen" (schließt die Lücke, die Shin benennt).
- **Fundstelle:** Abstract; Findings. — **VT**

### [12] Saldivar et al. (⚠️) — Idea Management + Social Network
- **Zitat:** Saldivar, J., Daniel, F., Cernuzzi, L., & Casati, F. (⚠️ Jahr). Online idea management for civic engagement: A study on the benefits of integration with social networking. *Computer Supported Cooperative Work (CSCW)*.
- **Kernaussage:** Idea-Management-Systeme verlangen i. d. R. **separate Registrierung** und das Erlernen eines neuen Werkzeugs — eine Beteiligungshürde. Eine Integration in **bereits genutzte soziale Netzwerke** senkt diese Hürde; eine reale Fallstudie (qual.+quant.) zeigt das als vielversprechenden Ansatz zur **Reduktion der Beteiligungsbarrieren**.
- **Typ:** **A** (Fallstudie; demonstrierte Barrierereduktion).
- **Stützt:** **TP2**; DP „Beteiligung ohne Pflicht-Account / dort abholen, wo Bürger:innen sind".
- **Fundstelle:** Abstract. — **VT**, ⚠️ Jahr/Band prüfen.

### [13] Aichholzer & Rose (2020) — Experience with Digital Tools
- **Zitat:** Aichholzer, G., & Rose, G. (2020). Experience with digital tools in different types of e-participation. In L. Hennen et al. (Eds.), *European e-democracy in practice*. Springer.
- **Kernaussage:** Literaturbasierter Überblick entlang dreier Funktionen (Monitoring, Agenda-Setting, Input zu Entscheidungen). Digitale Werkzeuge stärken partizipative Demokratie in vielerlei Hinsicht; **überzogene Erwartungen bleiben jedoch unerfüllt** — rein deliberative Designs ohne Entscheidungsanbindung haben **kaum Wirkung** auf Entscheidungen.
- **Typ:** **B** (Literatur-Review/Synthese).
- **Stützt:** **TP2**; Begründung, Beteiligung an **konkrete Aktionen/Wirkung** zu koppeln statt rein symbolisch.
- **Fundstelle:** Abstract; §4.1. — **VT**

### [14] Mariani et al. (2025) — Design Thinking & E-Participation
- **Zitat:** Mariani, I., Mortati, M., Rizzo, F., & Deserti, A. (2025). *Design thinking as a strategic approach to e-participation: From current barriers to opportunities*. Springer.
- **Kernaussage:** Rahmt **Barrieren** der E-Partizipation und schlägt **Design Thinking** als strategischen Ansatz vor, um von Barrieren zu Gelegenheiten zu gelangen (nutzerzentriert, iterativ).
- **Typ:** **B** (strategisches Rahmenwerk/Buch).
- **Stützt:** Methodische Begründung des nutzerzentrierten, iterativen Designvorgehens (DEVLOG-Iterationen).
- **Fundstelle:** Titel/Klappentext; Kapitelstruktur. — **VT** (Open Access).

### [19] Atzmanstorfer et al. (2025) — Geospatial Participatory Platforms
- **Zitat:** Atzmanstorfer, K., Bartling, M., Haltofová, B., Zurita-Arthos, L., Grubinger-Preiner, J., & Eitzinger, A. (2025). Critical success factors of participatory community planning with geospatial digital participatory platforms. *ISPRS International Journal of Geo-Information, 14*(4), 153.
- **Kernaussage:** Identifiziert **kritische Erfolgsfaktoren** für partizipative Gemeindeplanung mit **kartenbasierten (geospatialen) Beteiligungsplattformen** — verortete, raumbezogene Beteiligung als Wirkmechanismus.
- **Typ:** **A** (empirische CSF-Studie).
- **Stützt:** Stakeholder-Anforderung **„Map"**; **TP1/TP2**; DP „Aktionen räumlich verorten (Karte)".
- **Fundstelle:** Abstract; CSF-Ergebnisse. — **VT**

---

## C. Gamification & Engagement-Design (Anreiz, Nudging)

### [6] Simonofski et al. (2022) — OGD-Portale + Gamification (DSR)
- **Zitat:** Simonofski, A., Zuiderwijk, A., Clarinval, A., & Hammedi, W. (2022). Tailoring open government data portals for lay citizens: A gamification theory approach. *International Journal of Information Management, 65*, 102511.
- **Kernaussage:** DSR-Studie: 20 Interviews ergeben, dass **Laien-Bürger:innen** ein Portal mit **spielerischer Oberfläche, vereinfachten Inhalten, angepassten Visualisierungen und transparenzbezogenen, menschenlesbaren Daten** erwarten; 15 Designvorschläge (Gamification) wurden mit 10 Laien evaluiert — **Badges** als am nützlichsten bewertet, um Portal-Relevanz hervorzuheben.
- **Typ:** **A** (DSR mit Evaluation; *perceived usefulness* gemessen). ⚠️ kleine, qualitative Evaluationsstichprobe (n=10).
- **Stützt:** **TP1/TP3** (laienverständliche, visualisierte Daten), **TP2** (Gamification-Anreiz); DP „für Laien zuschneiden, Relevanz sichtbar machen".
- **Fundstelle:** Abstract; Evaluation. — **VT**

### [7] Chokki et al. (⚠️) — OGD-Dashboards vs. Einzelvisualisierungen
- **Zitat:** Chokki, A. P., Simonofski, A., Frénay, B., & Vanderose, B. (⚠️ Jahr). Engaging citizens with open government data: The value of dashboards compared to individual visualizations. *Digital Government: Research and Practice* (Preprint).
- **Kernaussage:** Aus einem Literatur-Review werden **16 Dashboard-Designprinzipien** für OGD abgeleitet und im **Namur Budget Dashboard (NBDash)** instanziiert. Eine **experimentelle Studie (108 Teilnehmende)** legt nahe, dass **gut gestaltete Dashboards das Bürger-Engagement mit OGD erhöhen** können; **aussagekräftige Metriken, passende Visualisierungen und klare Präsentation** sind die Haupterfolgsfaktoren.
- **Typ:** **A** (Experiment, n=108). ⚠️ **Preprint** + bildbasiertes PDF — vorsichtig zitieren.
- **Stützt:** **TP3** (SDG-Dashboard/Wirkungs-Visualisierung); DP „Wirkung als Dashboard mit aussagekräftigen Metriken".
- **Fundstelle:** Abstract; §1. — **PP ⚠️**

### [9] Krath et al. (2021) — Theoretical Basis of Gamification
- **Zitat:** Krath, J., Schürmann, L., & von Korflesch, H. F. O. (2021). Revealing the theoretical basis of gamification: A systematic review and analysis of theory in research on gamification, serious games and game-based learning. *Computers in Human Behavior, 125*, 106963.
- **Kernaussage:** Systematisches Review (118 Theorien). Abgeleitete **Grundprinzipien**, wie Gamification wirkt: Ziele und deren Relevanz **illustrieren**, Nutzer:innen über **geführte Pfade nudgen**, **unmittelbares Feedback** geben, gute Leistung **verstärken**, Inhalte in **bewältigbare Aufgaben vereinfachen**, individuelle Ziele/Fortschrittspfade ermöglichen, **sozialen Vergleich** ermöglichen.
- **Typ:** **B** (Review, das Prinzipien synthetisiert).
- **Stützt:** **TP2/TP4**; DP „Engagement-Mechaniken: Feedback, Fortschritt, Relevanz illustrieren".
- **Fundstelle:** Abstract; abgeleitete Prinzipien. — **VT**

### [10] Thiel et al. (2016) — Playing (with) Democracy
- **Zitat:** Thiel, S.-K., Reisinger, M., Röderer, K., & Fröhlich, P. (2016). Playing (with) democracy: A review of gamified participation approaches. *JeDEM, 8*(3), 32–60.
- **Kernaussage:** Review gamifizierter Beteiligung. Befund der Bestandsaufnahme: nur ein kleiner Teil der Projekte nutzt Gamification, und **wenn, dann überwiegend rein belohnungsbasiert** — eine Strategie, die laut den Autor:innen nur **kurzfristige Effekte** erzeugen und die **Qualität** der Beteiligung senken **könnte**.
- **Typ:** **B** (Review/Bestandsaufnahme; die Kurzfrist-Warnung ist eine **Schlussfolgerung der Autor:innen, kein eigener Messwert**).
- **Stützt:** **TP2**; **kritische Designwarnung**: Punktesystem der ZOE-`ParticipationPage` nicht als Selbstzweck — als bewusste, zu evaluierende Designentscheidung markieren.
- **Fundstelle:** Abstract; Conclusion. — **VT**

### [11] Yang & Wu (2025) — Digital Platforms Nudge Engagement
- **Zitat:** Yang, W., & Wu, J. (2025). Engaging the public through design: How digital platforms nudge public engagement. *Governance* (advance online publication).
- **Kernaussage:** **Conjoint-Experiment** (China): Designelemente — **Gamification, visuelles Feedback, Belohnungen, häufige Informations-Offenlegung, sozialer Vergleich und Barrierefreiheit** — **erhöhen signifikant** die Bereitschaft zu klimafreundlichem Verhalten und die Präferenz für die Plattform; wahrgenommene Bedienbarkeit und erwartete Zielerreichung sind zentrale Mechanismen.
- **Typ:** **A** (Experiment; **gemessener Effekt** von Designmerkmalen). **Starke Typ-A-Quelle.**
- **Stützt:** **TP2/TP3/TP4**; DP „Designmerkmale (Feedback, Offenlegung, Vergleich, Barrierefreiheit) erhöhen Engagement messbar".
- **Fundstelle:** Abstract; Ergebnisse. — **VT**

---

## D. SDG-Transparenz, -Lokalisierung & kommunale Wirkungsmessung

### [20] Clement et al. (2023) — Smart City Strategies & SDG Localization
- **Zitat:** Clement, J., Ruysschaert, B., & Crutzen, N. (2023). Smart city strategies — A driver for the localization of the sustainable development goals? *Ecological Economics, 213*, 107941.
- **Kernaussage:** Analyse von **57 Smart-City-Strategien aus 29 Ländern** mit dem SDG-Rahmen. Strategien stützen **stark** die Lokalisierung von **SDGs 7, 8, 9, 11**; häufig untervertreten sind **SDGs 2, 5, 15** — gezielte Aufmerksamkeit nötig.
- **Typ:** **A** (empirische Inhaltsanalyse).
- **Stützt:** **TP3**; DP „SDG-Beitrag pro Aktion explizit ausweisen", und Warnung vor blinden Flecken.
- **Fundstelle:** Abstract; Ergebnisse. — **VT**

### [21] Jain & Espey (2022) — Data to Drive Local Sustainable Development
- **Zitat:** Jain, G., & Espey, J. (2022). Lessons from nine urban areas using data to drive local sustainable development. *npj Urban Sustainability, 2*, 7.
- **Kernaussage:** Neun Stadt-/subnationale Pilotprojekte (2015–2019). **Daten sind ein nützlicher Einstiegspunkt** für lokale Nachhaltigkeitsdebatten und werden begrüßt; **jedoch fokussieren wenige Kommunen Daten tatsächlich zur Verbesserung** von Nachhaltigkeitsergebnissen, u. a. wegen Kapazitäts-, Eigentums- und Datenschutzproblemen.
- **Typ:** **A** (Multi-Fall-Empirie).
- **Stützt:** **TP3**; DP „niedrigschwellige, gepflegte Wirkungsdaten als Gesprächs-/Transparenz-Einstieg".
- **Fundstelle:** Abstract; Introduction. — **VT**

### [22] Busch et al. (2025) — Participatory SDG Monitoring (Stuttgart-Münster)
- **Zitat:** Busch, S., Franck, M., & Ley, A. (2025). Integrating the SDGs into urban renewal practices: Recommendations from participatory SDG monitoring in Stuttgart-Münster. *Urban Planning, 10*, Article 9973.
- **Kernaussage:** Programme zur Revitalisierung vulnerabler Quartiere bieten Gelegenheit für kollektives SDG-Handeln; aus **partizipativem SDG-Monitoring** in einem Stuttgarter Quartier werden **Empfehlungen** zur Integration der SDGs in die Stadterneuerung abgeleitet.
- **Typ:** **A** (Fallstudie) → mündet in **Empfehlungen (B-Charakter)**.
- **Stützt:** **TP3**; DP „SDGs lokal & partizipativ verständlich machen".
- **Fundstelle:** Abstract. — **VT**

### [23] Leite et al. (2026) — SMART Indicator Framework (SDG + ISO 37120)
- **Zitat:** Leite, G., Carneiro, F., Santos, J., Conceição, L., & Carvalho, A. M. (2026). Designing an integrated SMART indicator framework for urban green transitions: Aligning SDGs and ISO 37120 at city level. *Sustainability* ⚠️.
- **Kernaussage:** Kommunales Nachhaltigkeits-Monitoring ist **fragmentiert und schwer operationalisierbar**. Vorgeschlagen wird ein **integriertes, target-genaues Indikator-Rahmenwerk** nach **SMART**-Prinzipien, das globale SDG-Ziele in messbare, lokal sensible Metriken übersetzt.
- **Typ:** **B** (Framework-Design).
- **Stützt:** **TP3**; DP „Wirkungs-KPIs SMART & vergleichbar gestalten" (TransparencyPage).
- **Fundstelle:** Abstract. — **VT**, ⚠️ Journal/Band prüfen.

### [24] Çetintürk et al. (2026) — Local Government Pathways to the SDGs (PREPRINT)
- **Zitat:** Çetintürk, V. E., Arinci, Y., Majdi, H. Sh., Akca, M., Akbulut, L., Çoşgun, A., & Atilgan, A. (2026). Mapping local government pathways to the SDGs: A bibliometric and content analysis for sustainable urban development (2018–2025) [Preprint]. *Preprints.org*.
- **Kernaussage:** Bibliometrische/Inhaltsanalyse zu **Voluntary Local Reviews (VLRs)** und SDG-Lokalisierung in Kommunen (2018–2025).
- **Typ:** **B** (bibliometrisches Review). ⚠️ **NICHT peer-reviewed (Preprint)** — nur als Hintergrund, nicht für Wirkungsaussagen.
- **Stützt:** **TP3** (Kontext SDG-Lokalisierung), Hintergrund.
- **Fundstelle:** Abstract/Keywords. — **PP ⚠️**

### [36] Lourenço (2023) — Framework for Public eServices Transparency
- **Zitat:** Lourenço, R. P. (2023). A framework for public eServices transparency. *International Journal of Electronic Government Research, 19*(1).
- **Kernaussage:** Aus systematischem Review abgeleitetes **Rahmenwerk** für „public eServices transparency" aus **Nutzersicht**; charakterisiert, welche Information je Nutzerprofil verfügbar sein sollte.
- **Typ:** **B** (Rahmenwerk).
- **Stützt:** **TP1/TP3**; DP „nutzerprofil-gerechte Transparenzinformationen bereitstellen".
- **Fundstelle:** Abstract; Introduction. — **VT**

### [37] Grimmelikhuijsen & Welch (2012) — Computer-Mediated Transparency
- **Zitat:** Grimmelikhuijsen, S. G., & Welch, E. W. (2012). Developing and testing a theoretical framework for computer-mediated transparency of local governments. *Public Administration Review*. ⚠️
- **Kernaussage:** Entwickelt **und empirisch getestet** ein Rahmenwerk mit drei Transparenz-Dimensionen — **decision-making, policy information, policy outcome** — und zeigt, dass diese mit **unterschiedlichen** institutionellen Faktoren assoziiert sind (z. B. Outcome-Transparenz mit externem Gruppendruck und organisationaler Kapazität).
- **Typ:** **A** (Rahmenwerk entwickelt **und gemessen/getestet**).
- **Stützt:** **TP3**; Differenzierung von Transparenzarten (ZOE adressiert v. a. **policy-outcome-Transparenz** = Wirkung vergangener Aktionen).
- **Fundstelle:** Abstract. — **VT**, ⚠️ Band/Jahr prüfen.

### [38] Simelio-Solà et al. (2021) — Participation Access on Municipal Websites
- **Zitat:** Simelio-Solà, N., Ferré-Pavia, C., & Herrero-Gutiérrez, F.-J. (2021). Transparent information and access to citizen participation on municipal websites. *Profesional de la Información, 30*(2), e300211.
- **Kernaussage:** Anwendung von **14 Indikatoren** auf **605 spanische Kommunen** (>10 000 Einw.). Befund: institutionelle Websites bieten **sehr wenig** belastbare Information für Bürgerentscheidungen — Accountability-Kriterien werden nicht erfüllt.
- **Typ:** **A** (empirische Indikatoren-Analyse, große Stichprobe).
- **Stützt:** **TP1/TP3**; belegt, dass schwache kommunale Transparenz ein **verbreitetes** Problem ist (Relevance), das ZOE adressiert.
- **Fundstelle:** Abstract. — **VT**

### [38b] Navarro Galera et al. (⚠️) — Motivation for Sustainability Transparency
- **Zitat:** Navarro Galera, A., de los Ríos Berjillos, A., Ruiz Lozano, M., & Tirado Valencia, P. (⚠️ Jahr). Identifying motivation of the local governments to improve the sustainability transparency. *Transylvanian Review of Administrative Sciences*.
- **Kernaussage:** Regressionsanalyse (nordische Kommunen): **finanzielle Prioritäten** beeinflussen den Nachhaltigkeitsgehalt kommunaler Websites **stärker** als die Bedürfnisse der Bevölkerung; größeres Stakeholder-Bewusstsein kann Umwelt-Transparenz fördern.
- **Typ:** **A** (Regression).
- **Stützt:** **TP3**; Begründung, warum Nachhaltigkeits-Transparenz aktiv gestaltet werden muss (kommt sonst zu kurz).
- **Fundstelle:** Abstract. — **VT**, ⚠️ Jahr/Heft prüfen.

---

## E. Accessibility & Mehrsprachigkeit (TP4)

### [29] Csontos & Heckl (2021) — Hungarian Gov Websites
- **Zitat:** Csontos, B., & Heckl, I. (2021). Accessibility, usability, and security evaluation of Hungarian government websites. *Universal Access in the Information Society, 20*, 139–156.
- **Kernaussage:** Bewertung von **25 ungarischen Behörden-Websites**: **keine** erfüllte die WCAG-2.1-AA-Empfehlungen vollständig; die Hälfte erreichte in Usability-Tests nur das niedrigste Niveau. Rechtsrahmen: EU-Richtlinie 2016/2102 (alle öffentl. Sites bis 23.09.2021 barrierefrei, WCAG-2.1-AA).
- **Typ:** **A** (empirische Evaluation).
- **Stützt:** **TP4**; belegt verbreitete Nichtkonformität → ZOEs WCAG-2.1-AA-Ziel ist relevant & evaluierbar.
- **Fundstelle:** Abstract. — **VT**

### [30] Csontos & Heckl (2025) — Five Years of Changes
- **Zitat:** Csontos, B., & Heckl, I. (2025). Five years of changes in the accessibility, usability, and security of Hungarian government websites. *Universal Access in the Information Society, 24*, 2757–2781.
- **Kernaussage:** Re-Evaluation derselben 25 Websites nach fünf Jahren mit verbesserter Methode; ermöglicht **Längsschnittvergleich** der WCAG-Konformität; weiterhin Verbesserungsempfehlungen.
- **Typ:** **A** (empirische Längsschnitt-Evaluation).
- **Stützt:** **TP4**; **Methodenvorlage** für eine wiederholbare WCAG-Evaluation der ZOE-Plattform (Phase 5).
- **Fundstelle:** Abstract. — **VT**

### [31] Pontus & Rodríguez Vázquez (2021) — Localised Multilingual Websites
- **Zitat:** Pontus, V., & Rodríguez Vázquez, S. (2021). Language-related criteria for evaluating the accessibility of localised multilingual websites. In *Proc. 3rd Swiss Conference on Barrier-free Communication (BfC 2020)* (pp. 162–169). ZHAW.
- **Kernaussage:** Bei dreisprachigen Websites (EN/FR/DE) war die **Barrierefreiheit der englischen Version meist höher** als die der lokalisierten Fassungen; mehrere **sprachbezogene Accessibility-Probleme** werden von Routine-Checks übersehen.
- **Typ:** **A** (empirische Accessibility-Studie).
- **Stützt:** **TP4**; **kritische Warnung** für ZOE: i18n (EN/EL/DE) muss in **allen** Sprachen barrierefrei sein (nicht nur EN) → adressiert direkt die bekannte i18n-Lücke (hartkodierter Text).
- **Fundstelle:** Abstract. — **VT**

### [32] Asghari et al. (2023) — Leichte Sprache on the German Web
- **Zitat:** Asghari, H., Hewett, F., & Züger, T. (2023). On the prevalence of Leichte Sprache on the German web. In *WebSci '23*. ACM.
- **Kernaussage:** Web-Messung + qualitative Methoden: trotz vorhandener Voraussetzungen ist die **große Mehrheit** öffentlicher Websites **nicht in Leichter Sprache** zugänglich („understandable"-Prinzip der WCAG); vier technische/politische Empfehlungen.
- **Typ:** **A** (Web-Messung).
- **Stützt:** **TP4**; DP „verständliche Sprache / kognitive Barrierefreiheit" (über reine WCAG-Technik hinaus).
- **Fundstelle:** Abstract; §1. — **VT**

### [33] Chirumavilla (2025) — Digital Citizenship for All
- **Zitat:** Chirumavilla, V. (2025). Digital citizenship for all: Accessibility requirements in public domain websites. *Journal of Computer Science and Technology Studies, 7*(4).
- **Kernaussage:** Überblicksartikel: technische Bausteine barrierefreier Behörden-Websites (**semantisches HTML, Alt-Text, Tastatur-Navigation, Farbkontrast, barrierefreie Formulare, Mobile Accessibility**); Nutzen über Compliance hinaus (Usability für alle, Vertrauen, Teilhabe).
- **Typ:** **B** (konzeptioneller Überblick).
- **Stützt:** **TP4**; Checkliste deckt sich mit `docs/accessibility-guidelines.md`.
- **Fundstelle:** Abstract; §1. — **VT**, ⚠️ Journal-Qualität prüfen (vorsichtig zitieren).

---

## F. Zielgruppe Schüler:innen / Kinder (TP4)

### [40] Peacock et al. (2018) — Streets for People (Children & Placemaking)
- **Zitat:** Peacock, S., Anderson, R., & Crivellaro, C. (2018). Streets for people: Engaging children in placemaking through a socio-technical process. In *CHI '18*. ACM. *(Best Paper Award)*
- **Kernaussage:** Soziotechnischer Prozess in drei Stufen (digital gestützte Nachbarschafts-Walks; Issue-Mapping auf Online-Plattform; „Town-Hall"-Dialog), der **Kinder** in ein reales Stadtgestaltungsprojekt einbindet; ermöglichte Advocacy und Kompetenzaufbau, legte aber Spannungen um die Handlungsmacht von Kindern offen.
- **Typ:** **A** (qualitative Fallstudie).
- **Stützt:** **TP4**; DP „zielgruppenspezifische, niedrigschwellige Beteiligung für Schüler:innen/Kinder" (ZOE-Schulprogramm — konzipiert).
- **Fundstelle:** Abstract; Prozessbeschreibung. — **VT**

### [41] Vare (2025) — Student-Led Sustainability Projects
- **Zitat:** Vare, P. (2025). Exploring the impacts of student-led sustainability projects with secondary school students and teachers. *Proceedings Series on Social Sciences & Humanities, 21*.
- **Kernaussage:** **Schülergeleitete Nachhaltigkeitsprojekte** fördern praktische Kompetenzen und eine **langfristige Kultur der Umweltverantwortung** in Schule und Gemeinde; qualitative Analyse (Fokusgruppen, Lehrkräfte).
- **Typ:** **A** (qualitative Studie). ⚠️ kurzer Konferenzbeitrag (3 S.).
- **Stützt:** **TP4**; belegt Nutzen eines **Schulprogramms** (ZOE Beach-Cleanups-mit-Schulen).
- **Fundstelle:** Abstract. — **VT (kurz)**

---

## G. Tourismus als ungenutzte Ressource (TP6)

### [27] Vegas Macias et al. (2023) — Fishing + Tourism, Marsaxlokk (Malta)
- **Zitat:** Vegas Macias, J., Lamers, M., & Toonen, H. (2023). Connecting fishing and tourism practices using digital tools: A case study of Marsaxlokk, Malta. *Maritime Studies, 22*, 24.
- **Kernaussage:** Action-Research im **mediterranen Fischerdorf Marsaxlokk**: die Storytelling-Plattform **izi.TRAVEL** lässt die Fischergemeinde **Heritage-Tourismus-Erlebnisse mitgestalten**. Digitale Werkzeuge bieten Chancen, **Bewusstsein für inklusiven, nachhaltigen Tourismus** zu schaffen — bei Herausforderungen in Management und digitalen Kompetenzen.
- **Typ:** **A** (Action-Research-Fallstudie).
- **Stützt:** **TP6** (Tourist:innen/Besucher:innen einbinden) + maritimer Bezug; **stark analog zu Nord-Korfu** (Mittelmeer-Küstengemeinde, Fischerei, Tourismus).
- **Fundstelle:** Abstract. — **VT**

### [28] Laksmi et al. (2026) — Sustainable Tourism + Community Participation (Bali)
- **Zitat:** Laksmi, P. A. S., Suriani, N. N., Arjawa, I. G. W., & Saputra, K. A. K. (2026). Sustainable tourism development in the digital era: Assessing the impact of competitive strategies and community participation. *European Journal of Sustainable Development Research, 10*(2), em0373.
- **Kernaussage:** **Quasi-Experiment** mit **60 Tourismusdestinationen auf Bali** (Experimental/Kontrolle). Die Intervention (Community-Einbindung, Multi-Stakeholder-Foren, digitale Transformation) **verbessert die Nachhaltigkeits-Performance signifikant (p < 0,001)**; **Community-Partizipation (β = 0,42)** und **digitale Strategie (β = 0,38)** sind zentrale Faktoren, mit synergetischer Interaktion (β = 0,21).
- **Typ:** **A** (Quasi-Experiment; **gemessener Effekt**). **Starke Typ-A-Quelle.**
- **Stützt:** **TP6**; DP „Community-Partizipation + digitale Strategie zusammen wirken auf nachhaltige Tourismus-Performance".
- **Fundstelle:** Abstract; Ergebnisse. — **VT**

---

## H. Griechischer Kontext & Privacy-Spannung (Relevance / Future Work)

### [25] Carayannis et al. (2026) — Greek Smart City Transition
- **Zitat:** Carayannis, E. G., Chatzichristofis, S., Kyrpianou, G., Psychalis, M., & Sklias, G. (2026). The Greek smart city transition: Perceptions, barriers, and opportunities for sustainable urban growth. *Journal of the Knowledge Economy, 17*, 6474–6501.
- **Kernaussage:** Survey zur Smart-City-Transition in **Griechenland**: **hohe öffentliche Awareness (82,8 %)**; **finanzieller Widerstand** (52,1 % nicht bereit, höhere Steuern zu zahlen) trotz **Unzufriedenheit mit bestehender Infrastruktur (64,8 %)**; Priorität auf Energie, umweltfreundliche Infrastruktur, KI. Empfehlung: **partizipative, transparente, inklusive Governance** und **wirksame Kommunikation** des Nutzens.
- **Typ:** **A** (Survey; gemessene Anteile).
- **Stützt:** **Relevance** (griech. Kontext); **TP1/TP3** (Kommunikation des Nutzens, Transparenz, partizipative Governance) — Nord-Korfu als Mikro-Kontext dieser nationalen Befunde.
- **Fundstelle:** Abstract. — **VT**

### [26] Tsatsani et al. (2024) — E-Government in Greek Municipalities
- **Zitat:** Tsatsani, O., Patergiannaki, Z., & Pollalis, Y. (2024). Unraveling the dynamics of e-government digitization, penetration and user experience: A case study of Greek municipalities. *Journal of Strategic Innovation and Sustainability, 19*(3).
- **Kernaussage:** Erste tiefergehende UX-Analyse **griechischer kommunaler Websites** (Lighthouse + Adapted UX Audit). Befund: **breite Defizite — keine Kommune über 55 %**; kritische Schwächen bei technischer Performance und fehlenden Features (< 50 %). Bedarf an **Feedback-Mechanismen, Mehrsprachigkeit und barrierefreien Hilfe-Bereichen** für diverse Bevölkerungsgruppen.
- **Typ:** **A** (empirische UX-Evaluation).
- **Stützt:** **TP1/TP4** (direkt: griechische Kommunen, Mehrsprachigkeit, Feedback-Kanal); **stärkster Relevance-Beleg** für Nord-Korfu.
- **Fundstelle:** Abstract; Introduction. — **VT**

### [34] Diamantopoulou et al. (2019) — Privacy in E-Participation (GDPR)
- **Zitat:** Diamantopoulou, V., Androutsopoulou, A., Gritzalis, S., & Charalabidis, Y. (2019). Preserving digital privacy in e-participation environments: Towards GDPR compliance. ⚠️
- **Kernaussage:** Adressiert **Datenschutz/GDPR-Konformität** in E-Partizipations-Umgebungen (griechische Autor:innen, Univ. Aegean/Piräus).
- **Typ:** **B** (Rahmenwerk/Guidance).
- **Stützt:** **Future Work** (Backend/Accounts): wenn ZOE persistente Beteiligung/Accounts einführt, ist GDPR-by-Design nötig.
- **Fundstelle:** Titel/Abstract. — **VT**, ⚠️ Venue/Jahr prüfen.

### [35] Paguay-Chimarro et al. (2025) — Transparency Unleashed (Privacy Risks)
- **Zitat:** Paguay-Chimarro, C., Cevallos-Salas, D., Rodríguez-Hoyos, A., & Estrada-Jiménez, J. (2025). Transparency unleashed: Privacy risks in the age of e-government. *Informatics, 12*(2), 39.
- **Kernaussage:** Analyse von **21 öffentlichen Institutionen in Ecuador**: Transparenz-Initiativen legen **personenbezogene Daten** (inkl. von Kindern/Jugendlichen) ungeschützt offen — **Transparenz-Privacy-Spannung**.
- **Typ:** **A** (empirische Taxonomie-Analyse).
- **Stützt:** **Future Work / Designspannung**: Transparenz (TP3) ist gegen Datenschutz abzuwägen — relevant, sobald ZOE personenbezogene Beteiligungsdaten verarbeitet.
- **Fundstelle:** Abstract. — **VT**

---

## I. Ausgeschlossen

### [42] Raliphaswa et al. (2025) — Procedural Justice & Workplace Deviance
- **Zitat:** Raliphaswa, F., Dzansi, D. Y., & Dzansi, W. L. (2025). Reassessing procedural justice and workplace deviance: The unexpected role of gender and tenure. *International Journal of Applied Research in Business and Management, 6*(1).
- **Begründung Ausschluss:** Thema (Workplace Deviance im südafrikanischen öffentlichen Sektor) hat **keinen Bezug** zu TP1–TP6; zudem Verdacht auf Predatory-Publisher. **Nicht in der Argumentation verwenden.**

---

## Zusammenfassung: A/B-Verteilung & TP-Abdeckung

| Quelle | Typ | Primäres TP | Stärke |
|---|---|---|---|
| Yang & Wu 2025 [11] | **A** | TP2/3/4 | Experiment — Designmerkmale → Engagement |
| Laksmi 2026 [28] | **A** | TP6 | Quasi-Experiment — Partizipation+Digital → Nachhaltigkeit |
| Chokki ⚠️ [7] | **A** (PP) | TP3 | Experiment n=108 — Dashboards → Engagement |
| Simonofski 2022 [6] | **A** | TP1/3 | DSR-Eval — Laien-Anforderungen, Badges |
| Tsatsani 2024 [26] | **A** | TP1/4 | Griech. Kommunen, UX < 55 % |
| Carayannis 2026 [25] | **A** | TP1/3 | Griech. Survey, Awareness/Barrieren |
| Arana-Catania 2021 [15] | **A** | TP2 | Decide Madrid, Info-Overload |
| Royo 2020/2024 [16][17] | **A** | TP2/3 | Decide Madrid CSF + Vergleich |
| Saldivar ⚠️ [12] | **A** | TP2 | Account-Hürde senken |
| Shin 2024 [8] | **A** | TP2/3 | Accountability-Defizit (116 Tools) |
| Atzmanstorfer 2025 [19] | **A** | TP1/2 | Geospatial/Map CSF |
| Clement 2023 [20] | **A** | TP3 | 57 Strategien, SDG-Lokalisierung |
| Jain & Espey 2022 [21] | **A** | TP3 | 9 Städte, Daten→Nachhaltigkeit |
| Grimmelikhuijsen & Welch 2012 [37] | **A** | TP3 | Transparenz-Dimensionen getestet |
| Simelio 2021 [38] | **A** | TP1/3 | 605 Kommunen, schwache Info |
| Navarro Galera ⚠️ [38b] | **A** | TP3 | Nachhaltigkeits-Transparenz-Treiber |
| Csontos 2021/2025 [29][30] | **A** | TP4 | WCAG-Nichtkonformität (HU) |
| Pontus 2021 [31] | **A** | TP4 | Mehrsprachige Accessibility-Lücke |
| Asghari 2023 [32] | **A** | TP4 | Leichte Sprache selten |
| Peacock 2018 [40] | **A** | TP4 | Kinder/Placemaking |
| Vare 2025 [41] | **A** | TP4 | Schülerprojekte |
| Vegas Macias 2023 [27] | **A** | TP6 | Malta — Fischerei+Tourismus |
| Paguay-Chimarro 2025 [35] | **A** | Future | Transparenz-Privacy-Risiko |
| Peffers 2007 [1] | **B** | Methode | DSRM 6 Phasen |
| Hevner 2007 [2] | **B** | Methode | 3 Zyklen |
| Gregor & Hevner 2013 [3] | **B** | Methode | Wissensbeitragstypen |
| Gregor & Jones 2007 [4] | **B** | Methode | Designtheorie-Anatomie |
| Cronholm & Göbel 2018 [4b] | **B** | Methode | DP-Formulierungs-Guidelines |
| Venable 2016 [5] | **B** | Methode | FEDS-Evaluation |
| Krath 2021 [9] | **B** | TP2/4 | Gamification-Prinzipien |
| Thiel 2016 [10] | **B** | TP2 | Warnung: reward-based |
| Aichholzer 2020 [13] | **B** | TP2 | Wirkung an Entscheidung koppeln |
| Mariani 2025 [14] | **B** | Methode/TP2 | Design Thinking |
| Lourenço 2023 [36] | **B** | TP1/3 | eServices-Transparenz-Rahmen |
| Leite 2026 ⚠️ [23] | **B** | TP3 | SMART-Indikatoren |
| Busch 2025 [22] | **A→B** | TP3 | partizip. SDG-Monitoring |
| Çetintürk ⚠️ [24] | **B** (PP) | TP3 | VLR-Bibliometrie |
| Chirumavilla 2025 [33] | **B** | TP4 | Accessibility-Checkliste |
| Diamantopoulou 2019 ⚠️ [34] | **B** | Future | GDPR e-participation |
| Pina 2024 ⚠️ [18] | **A** | TP2 | Decide-Madrid-Barrieren |

**Bilanz:** ~24 Typ-A- und ~15 Typ-B-Quellen (eine ausgeschlossen). Jedes TP (TP1–TP4, TP6) wird durch **mindestens eine Typ-A-Quelle** gestützt; die DSR-Methodik ist vollständig durch Typ-B-Methodenquellen abgedeckt.
</content>
</invoke>

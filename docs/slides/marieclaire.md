# Foliensatz — Marieclaire (Phase 3: Design & Development)

> ZOE-Plattform Nord-Korfu · DSR nach Peffers et al. (2007) · FAU SoSe 2026, Gruppe 1
> Vortrag: ~10 Min (Deutsch) + 5 Min Diskussion · Design-Grundlage: FAU-Template (`PP-Master-FAU_WiSo_16zu9_v2.pptx`)
> Backup-Outline zur `.pptx` — maßgebliche Quelle, falls die Folien-Generierung typografisch hakt.
> **Struktur:** gemeinsame 4-Iterations-Achse mit Anshul; ich = **Design-Perspektive**, Anshul = **Demonstrations-Perspektive**.

---

## Folie 1 — Titel & DSR-Einordnung

**ZOE Nord-Korfu — Phase 3: Design & Entwicklung**
Marieclaire · Projektseminar Wirtschaftsinformatik · FAU Erlangen-Nürnberg

- DSR nach Peffers et al. (2007): 6 Phasen — **hier Phase 3**
- *Platzhalter: Screenshot Peffers-Prozessdiagramm, Phase 3 markieren*

**Speaker Notes (DE):** Guten Tag. Mein Teil ist Phase 3 des DSR-Prozesses nach Peffers et al. (2007) — *Design & Development*. Ich übersetze die in Phase 1/2 erarbeiteten Probleme in begründete Designprinzipien und ein lauffähiges Artefakt — präsentiert als vier problemgetriebene Design-Iterationen. Anshul zeigt danach dieselben vier Iterationen aus der Demonstrations-Sicht.

---

## Folie 2 — Mein DSR-Beitrag (Phase 3)

**Mein Beitrag = das Designwissen**

- Beitrag = begründete, übertragbare **Designprinzipien** (DP1–DP6)
- **Ebene 2** nach Gregor & Hevner (2013): „nascent design theory" — präskriptiv
- Form nach Gregor & Jones (2007); **Matrix** als Ableitungsinstrument
- Gemeinsames Dach: **Improvement / Exaptation** → Kontext Nord-Korfu
- Abgrenzung: Anshuls Beitrag = Instanziierung + Demonstration (Phase 4)

**Speaker Notes (DE):** Mein individueller DSR-Beitrag ist das Designwissen. Nach Gregor und Hevner (2013) ein Ebene-2-Beitrag — präskriptive Designprinzipien DP1 bis DP6 in der Form nach Gregor und Jones (2007), abgeleitet in der Matrix. Gemeinsames Dach mit Anshul: Improvement bzw. Exaptation in den Kontext Nord-Korfu.

---

## Folie 3 — Das Artefakt & die Matrix (zentrales Instrument)

- **Stufe 1:** die Website (mehrsprachig, barrierefrei) · **Stufe 2:** die Designprinzipien
- **Matrix:** Problem → Ziel → Designprinzip → Quelle (A/B) → Umsetzung → Evaluierbarkeit
- in **beide Richtungen** nachvollziehbar; erzwingt „gebaut/teilweise/konzipiert" + **A/B-Regel**
- *Platzhalter: Auszug aus `docs/MATRIX.md`*

**Speaker Notes (DE):** Das Artefakt ist zweistufig: die Website (Stufe 1) und die Designprinzipien (Stufe 2 — der wissenschaftliche Kern). Mein zentrales Instrument ist die Matrix: Sie verbindet Problem, Ziel, Designprinzip, Quelle mit A/B-Typ, Umsetzung und Evaluierbarkeit, ist in beide Richtungen lesbar und erzwingt Ehrlichkeit (gebaut vs. konzipiert; Typ A nie als Typ B verkaufen).

---

## Folie 4 — Von Problem zu Designprinzip — und in 4 Iterationen

- Kette: **Problem → Ziel → Designprinzip → Beleg** (Form n. Gregor & Jones 2007 / Cronholm & Göbel 2018)
- Beispiel **TP2:** keine Anlaufstelle → Einreichung ohne Account → **DP2a** → Saldivar **[A]**, Arana-Catania 2021 **[A]**
- Das Design entstand in **4 problemgetriebenen Iterationen** (Hevner *Design Cycle*)
- Iter 1 Sichtbarkeit · 2 SDG-Transparenz · 3 Beteiligung & Zielgruppen · 4 Tourist:innen & Community

**Speaker Notes (DE):** So leiten wir jedes Feature ab — erst Problem, dann Feature, in der Form nach Gregor und Jones (2007). Beispiel TP2. Methodisch entstand das Design im Design Cycle (Hevner) in vier problemgetriebenen Iterationen, die ich jetzt durchgehe. **Wichtiger Hinweis:** Das ist die *didaktische Konsolidierung* unserer real sieben Entwicklungsiterationen (Mapping im `DEVLOG.md`) — die Reihenfolge ist nach wissenschaftlicher Logik gewählt, nicht streng chronologisch.

---

## Folie 5 — Iteration 1 (Design): Sichtbarkeit → DP1

- **Problem TP1:** verstreute Kommunikation (v. a. FB-Profil der Vize-Bürgermeisterin)
- **DP1:** zentraler, strukturierter, gruppierbarer, durchsuchbarer Ort
- **Beleg:** Simelio-Solà 2021 **[A]** (605 Kommunen), Tsatsani 2024 **[A]** (griech. Kommunen < 55 %)
- **Designentscheidung:** Daten ausgelagert → API später austauschbar

**Speaker Notes (DE):** Iteration 1 adressiert die Sichtbarkeit. Problem TP1: die Aktionen sind nicht zentral auffindbar. Daraus DP1 — ein zentraler, strukturierter, gruppierbarer Ort. Belegt durch Simelio-Solà (2021), die über 605 Kommunen zeigen, dass unstrukturierte Information fundierte Entscheidungen verhindert, und Tsatsani (2024) für griechische Kommunen. Designentscheidung: Daten in eine Fallback-Schicht ausgelagert, damit später eine API ohne UI-Umbau anschließt.

---

## Folie 6 — Iteration 2 (Design): SDG-Transparenz → DP3

- **Problem TP3:** SDG-Beitrag und Wirkung vergangener Aktionen unsichtbar
- **DP3a:** verständliches Dashboard mit aussagekräftigen Metriken · **DP3b:** SMART-KPIs, Wirkung zurückspielen
- **Beleg:** Chokki **[A, Preprint]**, Simonofski 2022 **[A]**, Grimmelikhuijsen & Welch 2012 **[A]** (Outcome-Transparenz)

**Speaker Notes (DE):** Iteration 2: SDG-Transparenz. Problem TP3 — der SDG-Beitrag und die Wirkung sind nicht sichtbar. Daraus DP3a (verständliches Dashboard) und DP3b (SMART-KPIs, Wirkung an Bürger:innen zurückspielen). Belegt durch Chokki et al. (Dashboards erhöhen Engagement, allerdings Preprint), Simonofski (2022) und Grimmelikhuijsen und Welch (2012), die Outcome-Transparenz als eigene Dimension etablieren.

---

## Folie 7 — Iteration 3 (Design): Beteiligung & Zielgruppen → DP2/DP4

- **Problem TP2** (Hürde) **+ TP4** (heterogene Gruppen)
- **DP2a:** ohne Account · **DP2b:** Engagement — aber **NICHT** rein belohnungsbasiert (Vorbehalt)
- **DP4:** Mehrsprachigkeit **UND** WCAG 2.1 AA in jeder Sprachfassung
- **Beleg:** Saldivar **[A]**, Yang & Wu 2025 **[A]**, Thiel 2016 **[B]**; Csontos & Heckl **[A]**, Pontus 2021 **[A]**

**Speaker Notes (DE):** Iteration 3: Beteiligung und Zielgruppen. Probleme TP2 und TP4. DP2a (ohne Account) und DP2b (Engagement-Mechaniken — aber nicht rein belohnungsbasiert; Thiel 2016 warnt vor Kurzfrist-Effekten). DP4: Mehrsprachigkeit und WCAG 2.1 AA in jeder Sprachfassung — Pontus (2021) zeigt, dass lokalisierte Fassungen oft weniger barrierefrei sind. Belege: Saldivar, Yang und Wu (2025), Csontos und Heckl.

---

## Folie 8 — Iteration 4 (Design): Tourist:innen & Community → DP6

- **Problem TP6:** Tourismus bislang nur als Belastung gesehen
- **DP6:** Besucher:innen als Ressource (niedrigschwellig, Storytelling) + DP1-Gruppierung (Initiative-Tabs)
- **Beleg:** Laksmi 2026 **[A]** (Community β=0,42 + Digital β=0,38, p<0,001), Vegas Macias 2023 **[A]** (Malta)

**Speaker Notes (DE):** Iteration 4: Tourist:innen und Community. Problem TP6 — Tourismus wird nur als Belastung gesehen. DP6 verwandelt Besucher:innen in eine Ressource (niedrigschwellige Beiträge, Storytelling), kombiniert mit der Initiative-Gruppierung aus DP1. Belegt durch Laksmi (2026) — Community-Partizipation und digitale Strategie verbessern die Nachhaltigkeit messbar — und Vegas Macias (2023) aus dem analogen Fischerdorf Marsaxlokk.

---

## Folie 9 — Architektur, Status quo & Übergang zu Anshul

- **Bewusste Designentscheidungen:** Tech-Stack, grünes Design, kein Beta-Backend für Einreichungen
- **Status quo:** Designprinzipien als kohärentes Set instanziiert
- Grenzen (z. B. i18n-Altseiten) = **Designwissen** für den nächsten Zyklus
- **Übergang:** Anshul demonstriert, **DASS** die Prinzipien funktionieren (Phase 4)

**Speaker Notes (DE):** Zum Abschluss die Architektur: bewusste Designentscheidungen ohne Wirkungsbeleg — Tech-Stack, grünes Design, und bewusst kein produktives Backend für freie Einreichungen in der Beta (Datenschutz; Future Work). Der Status quo: die Designprinzipien sind als kohärentes Set instanziiert; offene Grenzen wie die i18n-Altseiten sind selbst Designwissen. Damit übergebe ich an Anshul, der dieselben vier Iterationen aus der Demonstrations-Perspektive zeigt.

---

## Folie 10 — Quellen (Auswahl, APA7)

- DSR-Methodik: Gregor & Jones (2007); Cronholm & Göbel (2018); Gregor & Hevner (2013); Peffers et al. (2007); Hevner (2007)
- Simelio-Solà 2021; Simonofski 2022; Grimmelikhuijsen & Welch 2012; Csontos & Heckl 2021/2025; Pontus 2021
- Saldivar; Yang & Wu 2025; Thiel 2016; Laksmi 2026; Vegas Macias 2023

> Vollständig + A/B-Klassifikation: `docs/literature-review.md`. **DP-Form:** Gregor & Jones (2007) + Cronholm & Göbel (2018) — beide im Korpus.
</content>

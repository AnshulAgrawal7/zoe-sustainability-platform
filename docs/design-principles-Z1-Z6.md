# Designprinzip-Matrix — Ziele Z1–Z6 — ZOE Platform

> DSR-Artefakt (Peffers et al., 2007), Projektseminar WInf SoSe 2026, FAU, Gruppe 1.
> Verknüpft je **Phase-2-Ziel** (Z1–Z6, verbindliche Namen/Reihenfolge):
> **Problem → Zielsetzung → Designprinzip(ien) → Beleg (Kernel-Theorie)**.
>
> **Konsistenz:** Diese Datei ist die zielorientierte Sicht (Z1–Z6). Die
> teilproblem-orientierte Sicht (TP1–TP8) inkl. Vergleichstabelle bleibt die
> führende Quelle: [`MATRIX.md`](MATRIX.md). Die alte themen­orientierte
> [`design-rationale-matrix.md`](design-rationale-matrix.md) ist **veraltet**
> (referenziert entfernte Features) und wird **nicht** weiterverwendet.
>
> **Zitierregel:** Belege ausschließlich aus dem Korpus
> [`literature-index.md`](literature-index.md) („Autor Jahr"). Wo für ein
> Prinzip im PDF-Bestand keine passende Kernel-Theorie vorliegt, ist dies als
> **„Quelle fehlt – bitte ergänzen"** markiert (nichts erfunden).
> Z↔TP-Mapping: Z1→TP1/TP3 · Z2→TP3 · Z3→TP2/TP6 · Z4→TP2 (DP2b) · Z5→TP4 · Z6→TP4.

---

| Ziel | Problem | Zielsetzung | Designprinzip(ien) | Beleg (Kernel-Theorie) |
|---|---|---|---|---|
| **Z1 — Zentrale & transparente Information** | Umweltaktionen der Gemeinde sind verstreut/unsichtbar; geringe institutionelle Sichtbarkeit und Rechenschaft. | Ein zentraler, verständlicher, transparenter Ort für alle ZOE-Aktionen. | **DP1a:** Bündele alle Aktionen in einer zentralen, gefilterten Übersicht mit Detailtiefe (Progressive Disclosure) und sichtbarer Provenienz/Quelle. **DP1b:** Mache Programmstatus & Kennzahlen sichtbar (Transparenz-/KPI-Ansicht). | Lourenço (2023); Grimmelikhuijsen & Welch (2012); Simelió et al. (2021). *„Close the loop"/Accountability (Fung): **Quelle fehlt – bitte ergänzen**.* |
| **Z2 — SDG-Beiträge sichtbar machen** | Lokale Aktionen werden nicht mit globalen Zielen verknüpft; SDGs sind für Laien abstrakt. | SDG-Beitrag je Aktion sichtbar machen; offizielle UN-Bildsprache nutzen. | **DP2a:** Verknüpfe jede Aktion mit den offiziellen Programm-SDGs {4,6,11,12,13,14,15,17} und visualisiere sie mit den **offiziellen UN-Icons** + Link zur UN-Seite. **DP2b:** SDG-Dashboard, das beitragende Aktionen je Ziel bündelt. | United Nations (2015); Clement et al. (2023); Leite et al. (2026); Jain & Espey (2022). |
| **Z3 — Bürgerpartizipation & Community** | Hohe Beteiligungshürden; Beteiligung hängt an persönlichen Netzwerken; eingereichte Ideen versanden. | Niedrigschwellige Beteiligung (auch ohne Account) mit sichtbarer Bearbeitung. | **DP3a:** Ermögliche Einreichung/Teilnahme **ohne Pflicht-Account**, mit optionaler Identität. **DP3b:** Schließe die Rückkopplungsschleife (Status NEW→…→ACCEPTED, Sichtbarkeit im Admin-Backend). | Saldivar et al. (⚠️ Jahr prüfen); Arana-Catania et al. (2021); Shin et al. (2024); Mariani et al. (2025). |
| **Z4 — Motivation/Gamification** | Reine Belohnung kann intrinsische Motivation verdrängen; kompetitives Ranking unter Nachbarn erzeugt soziale Reibung. | Langfristiges Engagement fördern, ohne intrinsische Motivation zu untergraben. | **DP4a:** Setze Punkte/Badges/Stufen als **Anerkennung** (Kompetenz/Verbundenheit), nicht als reines Belohnungsranking. **DP4b:** Belohnung optional (Gast ohne Punkte) — der Account ist Mehrwert, keine Pflicht. | Ryan & Deci (2000); Sailer et al. (2017); Mekler et al. (2017); Hamari et al. (2014); Krath et al. (2021); Thiel et al. (2016). *Gamification-Definition (Deterding et al. 2011): **Quelle fehlt – bitte ergänzen**.* |
| **Z5 — Umweltbewusstsein & lokale Identität** | Bewusstsein und Bindung an die lokale Natur fehlen; Wissen wird nicht systematisch vermittelt. | Umweltbewusstsein und lokale Identifikation stärken. | **DP5a:** Lokal verortete Inhalte (Antinioti, Erimitis, Natura 2000) statt abstrakter Botschaften. **DP5b:** Junge Zielgruppen/Schulen über Bildungs-/Beteiligungsformate einbinden. | Vare et al. (2025); Peacock et al. (2018); Laksmi (2026); Vegas Macías et al. (2023). *Sozialkapital/lokale Identität (Putnam): **Quelle fehlt – bitte ergänzen**.* |
| **Z6 — Zielgruppen inklusiv erreichen** | Sprach- und Zugangsbarrieren (EL/EN/DE, Tourismus); Barrierefreiheit ist für öffentliche Stellen gesetzlich verpflichtend. | Alle erreichen: Mehrsprachigkeit DE/EN/EL, WCAG 2.1 AA, niedrige Hürden, kostenfrei. | **DP6a:** Dreisprachigkeit (EN/EL/DE) als First-Class, alle Inhalte/Labels über `t()`. **DP6b:** Barrierearme, WCAG-2.1-konforme, kostenfreie, account-optionale Nutzung. | Pontus (2021); Asghari (2023); Chirumavilla et al. (2025); Csontos et al. (2021, 2025); Nielsen & Molich (1990). |

---

## Hinweise

- **Demonstration (Phase 4), nicht Evaluation:** Die Tabelle zeigt, *dass* das
  Artefakt die Ziele adressiert (Designentscheidung + Beleg), nicht *wie wirksam*
  es ist — Wirkungsmessung ist Phase 5 (siehe FEDS-Spalte in [`MATRIX.md`](MATRIX.md)).
- **A/B-Klassifikation** der Quellen (gemessener Effekt **[A]** vs. Rahmenwerk
  **[B]**) ist in [`literature-review.md`](literature-review.md) hinterlegt.
- **Offene Belege** („Quelle fehlt – bitte ergänzen"): Fung (Accountability/Loop,
  Z1), Deterding et al. 2011 (Gamification-Definition, Z4), Putnam (Sozialkapital,
  Z5) — diese stammen aus der themenorientierten Alt-Matrix und sind **nicht** im
  PDF-Korpus; vor finaler Abgabe entweder beschaffen oder durch vorhandene
  Korpus-Quellen ersetzen.

# STATUS — Anshul (Phase 4: Demonstration)

> ZOE-Plattform Nord-Korfu · FAU SoSe 2026, Gruppe 1 · Stand: 2026-06-06 (Branch `claude/nightly-run`)
> Verwandt: [`anshul.tex`](anshul.tex) · [`../slides/anshul.md`](../slides/anshul.md) · [`../MATRIX.md`](../MATRIX.md) · [`../handover/phase5-6-handover.md`](../handover/phase5-6-handover.md)

## 1. Stand des eigenen Deliverables

| Deliverable | Stand | Ort |
|---|---|---|
| Bericht (EN, APA7) | ✅ kompiliert (9 S.) — **⚠️ auf ~15 S. auszubauen** | `docs/reports/anshul.tex` (+ `.pdf`) |
| Folien (DE, ~10 Min) | ✅ 9 Folien + Speaker Notes + `.pptx` | `docs/slides/anshul.{md,pptx}` |
| Demonstration (Artefakt) | ✅ lauffähig; 44 Unit + 49 E2E grün | Repo |
| Additive Features (Iteration 7) | ✅ Initiative-Tabs, Tourist:innen, Newsletter | `src/components/engagement/`, `src/components/ui/NewsletterSignup.tsx` |

## 2. Verwendete Quellen — und **wo** sie verwendet werden

| Quelle (Typ) | Verwendet in Phase-4-Argument |
|---|---|
| Peffers et al. 2007 **[B]** | DSR-Phasenmodell; Definition „Demonstration" (Bericht §2, Folie 1–2) |
| Gregor & Jones 2007 **[B]** | „expository instantiation" = methodische Grundlage der Demonstration (§2, Folie 2) |
| Gregor & Hevner 2013 **[B]** | Beitrag als Improvement/Exaptation (§2–3) |
| Venable et al. 2016 **[B]** (FEDS) | Evaluierbarkeit, Strategie *Human Risk & Effectiveness* (§5, Folie 8) |
| Tsatsani et al. 2024 **[A]** | Relevance (griech. Kommunen < 55 %); Lighthouse-Methode (§1, §5, Folie 8) |
| Carayannis et al. 2026 **[A]** | Relevance (griech. Awareness/Barrieren) (§1) |
| Simelio-Solà 2021 **[A]** | Szenario A / DP1 (§4.2, Folie 4) |
| Vegas Macias 2023 **[A]**, Laksmi 2026 **[A]** | Szenario A / DP6 (§3–4, Folie 4) |
| Saldivar **[A]**, Arana-Catania 2021 **[A]** | Szenario B / DP2a (§4.3, Folie 5) |
| Thiel et al. 2016 **[B]** | Vorbehalt zur Punkte-Mechanik (§4.3, Folie 5) |
| Chokki **[A,PP]**, Simonofski 2022 **[A]**, Grimmelikhuijsen & Welch 2012 **[A]** | Szenario C / DP3 (§4.4, Folie 6) |
| Csontos & Heckl 2021/2025 **[A]**, Pontus 2021 **[A]**, Asghari 2023 **[A]** | Szenario D / DP4 + WCAG-Audit-Methode (§4.5, §5, Folie 7–8) |
| Diamantopoulou 2019 **[B]**, Paguay-Chimarro 2025 **[A]** | Future Work / Datenschutz (§6) |
| Royo 2020/2024 **[A]** | Related Work (Decide Madrid) (§3) |

## 3. Implementiert vs. konzipiert (Demonstrationsbasis)

- **Implementiert & demonstrierbar:** Aktionsübersicht + Detailseite (TP1), Initiative-Tabs + Tourist:innen-Sektion + Newsletter-Konzept (TP1/TP6, NEU), Beteiligungsformular ohne Account (TP2, ohne Persistenz), SDG-Dashboard/Badges + Transparenz-KPIs (TP3), i18n EN/EL/DE + WCAG-Setup (TP4), Admin-CRUD.
- **Konzipiert (in der Demo als Future Work benennen):** Persistenz der Einreichungen, offizielle SDG-Icons, durchgängige i18n der Altseiten, Schulprogramm, interaktive Karte, persistente Gamification, Newsletter-Versand.

## 4. Wo noch Verbesserungs-/Recherchebedarf besteht

1. **⚠️ Bericht auf ~15 Seiten ausbauen.** Aktuell 9 S. Konkrete Hebel: Related Work (§3) je Vergleichskommune ausführen; jedes Szenario (§4.2–4.5) um Vorbedingungen/erwartetes Ergebnis erweitern; §5 Evaluierbarkeit je Feature tabellarisch; echte Screenshots an die `figplaceholder`-Stellen.
2. **Screenshots/Live-Demo** für alle vier Szenarien + Peffers-Diagramm (Phase 4 markiert) erstellen.
3. **Lighthouse-/axe-Lauf** tatsächlich durchführen und Zahlen in §5 eintragen (derzeit nur Methode beschrieben).
4. **⚠️ Heuristische Evaluation:** Nielsen-Heuristiken sind **nicht im Korpus** — entweder Quelle beschaffen oder Methode quellenneutral beschreiben.
5. **TP2-Persistenz**-Demo: aktuell nur lokaler State; in der Demo klar als Prototyp-Grenze ansagen.
6. **i18n-Lücke** der Altseiten vor der Live-Demo möglichst schließen, sonst in Szenario D offen ansprechen (ist im Bericht bereits ehrlich vermerkt).

## 5. ⚠️ Offene TODOs (Quellen)

- Chokki (Jahr/Band), Saldivar (Jahr), Tsatsani (Endseite), Diamantopoulou (Venue) — siehe [`../literature-index.md`](../literature-index.md).
- Preprint Chokki nur vorsichtig (Typ B Wirkungsaussagen vermeiden).
</content>

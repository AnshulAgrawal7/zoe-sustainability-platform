# STATUS — Marieclaire (Phase 3: Design & Development)

> ZOE-Plattform Nord-Korfu · FAU SoSe 2026, Gruppe 1 · Stand: 2026-06-06 (Branch `claude/nightly-run`)
> Verwandt: [`marieclaire.tex`](marieclaire.tex) · [`../slides/marieclaire.md`](../slides/marieclaire.md) · [`../MATRIX.md`](../MATRIX.md) · [`../phase1-2-bridge.md`](../phase1-2-bridge.md)

## 1. Stand des eigenen Deliverables

| Deliverable | Stand | Ort |
|---|---|---|
| Bericht (EN, APA7) | ✅ kompiliert (8 S.) — **⚠️ auf ~15 S. auszubauen** | `docs/reports/marieclaire.tex` (+ `.pdf`) |
| Folien (DE, ~10 Min) | ✅ 9 Folien + Speaker Notes + `.pptx` | `docs/slides/marieclaire.{md,pptx}` |
| Designprinzipien | ✅ DP1, DP2a/b, DP3a/b, DP4, DP6 (Form n. Gregor & Jones 2007) | `docs/MATRIX.md` |
| Matrix (zentrales Instrument) | ✅ vollständig befüllt (inkl. A/B) | `docs/MATRIX.md` |
| Phase-1→2-Brücke | ✅ Problem→Ziel→DP→Feature→Beleg | `docs/phase1-2-bridge.md` |

## 2. Verwendete Quellen — und **wo** sie verwendet werden

| Quelle (Typ) | Verwendet in Phase-3-Argument |
|---|---|
| Gregor & Jones 2007 **[B]** | **Form jeder Designprinzip-Formulierung** (§2, §4.1, Folie 3) |
| Cronholm & Göbel 2018 **[B]** | **DP-Formulierungs-Guidelines** (ergänzend zur DP-Form) (§2, §3) |
| Peffers 2007 **[B]**, Hevner 2007 **[B]** | DSR-Prozess + drei Zyklen (Design Cycle = Phase 3) (§2, Folie 7) |
| Gregor & Hevner 2013 **[B]** | Beitragstyp Improvement/Exaptation (§2, Folie 2) |
| Saldivar **[A]**, Arana-Catania 2021 **[A]** | DP2a Herleitung (§4.1, Folie 3) |
| Yang & Wu 2025 **[A]**, Krath 2021 **[B]**, Thiel 2016 **[B]** | DP2b (Engagement + Warnung) (§3–4, Folie 5) |
| Simelio-Solà 2021 **[A]**, Tsatsani 2024 **[A]** | DP1 (§4.1, Folie 5) |
| Chokki **[A,PP]**, Simonofski 2022 **[A]**, Grimmelikhuijsen & Welch 2012 **[A]** | DP3a (§4.1, Folie 5) |
| Shin 2024 **[A]**, Leite 2026 **[B]**, Clement 2023 **[A]** | DP3b (§3–4) |
| Csontos & Heckl 2021/2025 **[A]**, Pontus 2021 **[A]**, Asghari 2023 **[A]** | DP4 (§4.1, Folie 5) |
| Peacock 2018 **[A]**, Vare 2025 **[A]** | DP4 Schulprogramm-Begründung (§4.1) |
| Vegas Macias 2023 **[A]**, Laksmi 2026 **[A]** | DP6 (§4.1) |
| Royo 2020/2024 **[A]**, Pina 2024 **[A]** | Related Work (Decide Madrid) (§3) |
| Diamantopoulou 2019 **[B]**, Paguay-Chimarro 2025 **[A]** | Architektur „kein Backend = bewusst" / Future Work (§4.3) |
| Mariani 2025 **[B]** | Design-Thinking-Begründung des iterativen Vorgehens (§3) |
| Venable 2016 **[B]** (FEDS) | Evaluierbarkeit der DPs (§5) |

## 3. Implementiert vs. konzipiert (aus Designsicht)

- **Designprinzipien vollständig hergeleitet** (DP1–DP6) und in der Matrix mit Beleg + A/B versehen.
- **Instanziiert** (über Iterationen 1–7): siehe Implementierungsspalte der Matrix.
- **Bewusste Designentscheidungen** (ohne Wirkungsbeleg) explizit markiert: Tech-Stack, grünes Design, kein Beta-Backend für freie Einreichungen, Newsletter ohne Versand (§4.3, Brücke §3).
- **Teilweise/konzipiert:** offizielle SDG-Icons, Schulprogramm, interaktive Karte. *(durchgängige i18n jetzt erledigt ✓ — alle Seiten EN/EL/DE + DeepL-Auto-Übersetzung)*

## 4. Wo noch Verbesserungs-/Recherchebedarf besteht

1. **⚠️ Bericht auf ~15 Seiten ausbauen.** Aktuell 8 S. Konkrete Hebel: Hauptteil §4.1 jede DP als eigener Unterabschnitt mit voller Herleitung; §3 Related Work je Feld vertiefen; Matrix-Auszug + Ableitungsdiagramm als Abbildungen.
2. ✅ **Cronholm & Göbel (2018)** beschafft (`GuidelinesSupporting…pdf`, Index #4b) und als DP-Form-Quelle (Typ B) **eingebaut** — neben Gregor & Jones (2007). *(erledigt)*
3. **DP-Formalisierung** schärfen: optional jede DP strikt im Muster „To achieve X for users U in context C, provide M, because J" ausformulieren.
4. **Screenshots:** Matrix-Auszug, Ableitungsketten-Diagramm (TP2), Iterations-Zeitstrahl, Peffers-Diagramm (Phase 3 markiert).
5. **Iterations-Doku** (DEVLOG) als Quelle für den Design-Cycle weiter ausschmücken (verworfene Ansätze ergänzen — Abschnitt „Verworfene Entscheidungen" ist noch leer).

## 5. ⚠️ Offene TODOs (Quellen)

- Leite (Journal/Band), Pina (Hrsg./Jahr), Navarro Galera (Jahr/Heft), Grimmelikhuijsen & Welch (Band/Jahr) — siehe [`../literature-index.md`](../literature-index.md).
- Preprints Chokki/Çetintürk nur vorsichtig (Typ B).
- Yang & Wu 2025 DOI/Band verifizieren.
</content>

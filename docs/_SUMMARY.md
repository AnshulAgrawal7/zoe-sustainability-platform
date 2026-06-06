# _SUMMARY — Autonomer Nacht-Lauf (Phase 3 & 4)

> ZOE-Plattform Nord-Korfu · DSR nach Peffers et al. (2007) · FAU SoSe 2026, Gruppe 1
> Branch: `claude/nightly-run` (additiv, `main` unangetastet) · Stand: 2026-06-06

## 1. Erzeugte/aktualisierte Dateien

### Literatur & DSR-Dokumentation
- `docs/literature-index.md` — Katalog **aller 42 eindeutigen Quellen** (von 45 Dateien; 3 Duplikate), APA7, DOI, Volltext/Preprint-Status, sprechende Symlinks in `Projektseminar_Literatur/renamed/`.
- `docs/literature-review.md` — Kernaussage je Quelle (nur aus PDF), **A/B-Klassifikation** (~24×A, ~14×B), TP-Zuordnung, Fundstellen.
- `docs/MATRIX.md` — Problem→Ziel→**Designprinzip**→**Quelle(A/B)**→Umsetzung→Evaluierbarkeit; **neu: TP6** + Vergleichskommunen.
- `docs/phase1-2-bridge.md` — Brücke Phase-1/2-Listen + Stakeholder-Anforderungen → Feature → Prinzip → Beleg.
- `docs/DEVLOG.md` — 7 Iterationen (Iteration 7 neu).

### Code (additiv, getestet)
- `src/pages/GetInvolvedPage.tsx` (Route `/get-involved`, Nav-Link).
- `src/components/engagement/InitiativeTabs.tsx` (WAI-ARIA-Tabs, TP1).
- `src/components/engagement/TouristContribution.tsx` (TP6).
- `src/components/ui/NewsletterSignup.tsx` (Zod, Konzept).
- i18n EN/EL/DE (`getInvolved`-Namespace) · Tests: `__tests__/components/*`, `__tests__/accessibility/GetInvolvedPage.test.tsx`.
- **Qualität:** `vitest` 44/44 · `tsc --noEmit` ok · `vite build` ok.

### Präsentation & Berichte
- `docs/slides/anshul.{md,pptx}` · `docs/slides/marieclaire.{md,pptx}` — DE, ~10 Min, Speaker Notes, FAU-Template-Theme.
- `docs/reports/anshul.tex` (+PDF, 10 S.) — Phase 4 (Demonstration).
- `docs/reports/marieclaire.tex` (+PDF, 9 S.) — Phase 3 (Design).
- `docs/reports/STATUS_anshul.md` · `STATUS_marieclaire.md`.
- `docs/handover/phase5-6-handover.md`.
- `docs/QUALITY_GATE.md` — Kokkali-Koustas-Abnahme (🟡 abgenommen).

## 2. Offene ⚠️-TODOs (zuerst verifizieren)

1. **Bibliografische Details** prüfen: Chokki (Jahr/Band, bildbasiertes PDF), Saldivar (Jahr), Navarro Galera (Jahr/Heft), Grimmelikhuijsen & Welch (Band/Jahr 2012 vs. 78), Pina, Leite, Tsatsani, Diamantopoulou — siehe `literature-index.md`.
2. ✅ **Cronholm & Göbel (2018)** beschafft und als DP-Form-Quelle (Typ B) eingebaut (Index #4b) — *erledigt*.
3. **Preprints** (Chokki, Çetintürk) nur vorsichtig (Typ B), keine harten Wirkungsaussagen.
4. **Raliphaswa (2025)** thematisch ausgeschlossen (Workplace Deviance) — nicht verwenden.
5. **Reports auf ~15 S.** ausbauen (Eigenleistung) + echte Screenshots an die Bildplatzhalter; **kein KI-Padding**.
6. ✅ **i18n-Altseiten erledigt** — alle 7 Seiten auf `t()` (EN/EL/DE); plus DeepL-Auto-Übersetzung (Admin) + Flaggen-Sprachwechsler.

## 3. Drei wichtigste nächste Schritte je Person

**Anshul (Phase 4 — Demonstration):**
1. Vier Demo-Szenarien als **Screenshots/Live-Demo** aufbereiten + Peffers-Diagramm (Phase 4) einsetzen.
2. **axe + Lighthouse tatsächlich laufen lassen** und Zahlen in `anshul.tex` §5 eintragen (derzeit nur Methode).
3. Bericht auf ~15 S. vertiefen (Related Work je Vergleichskommune; Szenarien um Vorbedingung/Erwartung).

**Marieclaire (Phase 3 — Design):**
1. Jede **Designprinzip** als eigener Unterabschnitt im Muster „To achieve X for U in C, provide M, because J" ausformulieren.
2. DP-Form ist jetzt durch Gregor & Jones (2007) + Cronholm & Göbel (2018) belegt — optional jede DP strikt im Muster „To achieve X for U in C, provide M, because J" ausformulieren.
3. **Abbildungen** ergänzen (Matrix-Auszug, Ableitungs-Diagramm, Iterations-Zeitstrahl) + „Verworfene Entscheidungen" im DEVLOG füllen.

**Gemeinsam:**
- i18n-Lücke schließen, offizielle SDG-Icons, Persistenz/Backend (TP5/7/8) als Phase-6-Future-Work (mit GDPR-by-Design).

---

*Hinweis Reproduzierbarkeit:* `main` blieb unangetastet (`fe9af07`). Alle Änderungen liegen additiv auf `claude/nightly-run`. Copyright-geschützte PDFs sind `.gitignore`-t (lokal, nicht gepusht).
</content>

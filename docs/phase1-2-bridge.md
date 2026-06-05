# Phase-1→2-Brücke — von Problem zu Lösungsziel zu Feature

> DSR-Artefakt nach Peffers et al. (2007), Phasen 1–2 → 3/4 · Projektseminar WInf SoSe 2026, FAU, Gruppe 1
> Verwandt: [`MATRIX.md`](MATRIX.md) · [`literature-review.md`](literature-review.md) · [`dsr-methodology.md`](dsr-methodology.md) · [`DEVLOG.md`](DEVLOG.md)

Dieses Dokument macht die Kette **Phase-1-Problem → Phase-2-Lösungsziel → Designprinzip → konkretes Feature → Beleg** explizit nachvollziehbar. Es bedient das Leitprinzip des Betreuers Koustas:

> „Start with what you want to do, before asking how. Look into literature first, define goals, then features. First make sure which problem you want to solve — this will lead to everything."

Phasen 1 & 2 wurden vom **Gesamtteam** erarbeitet (Originallisten unten). Phasen 3 & 4 (dieses Artefakt) setzen darauf auf. **A/B**-Klassifikation der Belege: siehe [`literature-review.md`](literature-review.md).

---

## 1. Brücke: Phase-1-Problem → Phase-2-Ziel → Feature → Beleg

| # | Phase-1-Problem (Original Team) | Phase-2-Lösungsziel (Original Team) | Adressiert in der Plattform (Feature) | Designprinzip | Beleg (Typ) |
|---|---|---|---|---|---|
| P1 | Nachhaltigkeit als Großproblem (maritim, Müll aus Tourismus) | Nachhaltigkeitsaktionen bündeln & sichtbar machen | Zentrale Aktionsübersicht (`ProjectsPage`) + Initiative-Tabs (Meeresschutz, Naturmonumente) | DP1 | Simelio 2021 **[A]**, Tsatsani 2024 **[A]** |
| P2 | Zentrale Kommunikation fehlt (nur FB-Profil Fr. Kokkali, erreicht nicht alle) | Ein zentraler Kommunikationsort für abgeschlossene + anstehende Projekte | `ProjectsPage` + `ProjectDetailPage` + persistente Navigation; `/get-involved` zeigt auch abgeschlossene Aktionen (ProjectsPage-Statusfilter = Future Work) | DP1 | Simelio 2021 **[A]**, Lourenço 2023 **[B]** |
| P3 | Wirkung vergangener Bürgerbeteiligung unsichtbar (Show Importance) | Wirkung vergangener Projekte zeigen | `TransparencyPage` (KPI/Fortschritt), Wirkungs-Badges | DP3a/b | Grimmelikhuijsen & Welch 2012 **[A]**, Shin 2024 **[A]**, Chokki **[A,PP]** |
| P4 | SDG-Beitrag nicht verständlich dargestellt | SDG-Beitrag pro Aktion visualisieren | `SDGDashboardPage`, `SDGBadge` pro Projekt | DP3a | Simonofski 2022 **[A]**, Clement 2023 **[A]**, Leite 2026 **[B]** |
| P5 | „Digital leaders erreichen SDGs besser" | Digitale Plattform als SDG-Treiber | Gesamtartefakt (digitale Bündelung) | DP1/DP3 | Clement 2023 **[A]** (Smart-City-Strategien → SDG-Lokalisierung), Jain & Espey 2022 **[A]** |
| P6 | Eigeninitiativen ohne zentrale Anlaufstelle | Eigeninitiativen ermöglichen | `ParticipationPage` (Idee einreichen ohne Account) | DP2a | Saldivar **[A]**, Arana-Catania 2021 **[A]** |
| P7 | Zielgruppen-Heterogenität | Zielgruppen ansprechen (Schüler:innen, Unis, Mehrsprachigkeit, Barrierefreiheit) | i18n EN/EL/DE, `AudiencesPage`, WCAG-Setup, `AccessibilityPage` | DP4 | Csontos 2021/2025 **[A]**, Pontus 2021 **[A]**, Asghari 2023 **[A]** |
| P8 | Community fehlt | Community aufbauen | Beteiligungsoptionen + (konzipiert) Newsletter-Opt-in | DP2a/b | Yang & Wu 2025 **[A]**, Krath 2021 **[B]** |
| P9 | Müll aus Tourismus / Tourismus als Belastung | (implizit) Tourismus konstruktiv wenden | **NEU** Tourist:innen-Beitragssektion (TP6) | DP6 | Laksmi 2026 **[A]**, Vegas Macias 2023 **[A]** |

**Phase-1-Liste (Originaltext Team, als Input):** Nachhaltigkeit als Großproblem; maritime Probleme; Müll (aus Tourismus); zentrale Kommunikation der Aktionen an Bürger (aktuell nur FB-Profil von Frau Kokkali, nicht alle erreicht); Wirkung der Bürgerpartizipation an vergangenen Projekten zeigen (Show Importance); SDG-Transparenz verständlich darstellen; „digital leaders erreichen SDGs besser"; Eigeninitiativen ohne zentrale Anlaufstelle; Zielgruppen-Heterogenität.

**Phase-2-Liste (Originaltext Team):** alle Phase-1-Probleme lösen; zentraler Kommunikationsort für abgeschlossene + anstehende Projekte; SDG-Beitrag pro Aktion visualisieren; Eigeninitiativen ermöglichen; Zielgruppen ansprechen (Schüler:innen/Kinder via Schulprogramme, Universitätsprogramme, Mehrsprachigkeit/Barrierefreiheit); Community aufbauen; Transparenz.

---

## 2. Brücke: Stakeholder-Anforderungen (Kokkali & Koustas) → Umsetzung

Aus dem Meeting mit Vize-Bürgermeisterin **Kokkali** und Betreuer **Koustas** — als **harte Anforderungen** behandelt.

| Anforderung | Status | Umsetzung / Konzept | Designprinzip + Beleg |
|---|---|---|---|
| **User-friendly Site** | ✅ gebaut | mobile-first, Tailwind, klare Navigation, WCAG-Setup | DP4 · Csontos 2021 **[A]**, Tsatsani 2024 **[A]** |
| **Tabs für versch. Initiativen** (Meeresschutz, Naturmonumente) | 🔨 gebaut (NEU) | `InitiativeTabs` gruppiert Aktionen thematisch | DP1 · Simelio 2021 **[A]** |
| **Map** | 🔨 konzipiert→teilw. | ortsbezogene Darstellung der Aktionen (Projekt-`location`); geospatiale Beteiligung als CSF | DP1 · Atzmanstorfer 2025 **[A]** |
| **Freundlicher Kommunikationskanal Bürger↔Gemeinde** | 🔨 gebaut | `ParticipationPage` (Feedback/Idee/Problem melden), freundlicher Ton (UX-Copy) | DP2a · Saldivar **[A]** |
| **Optisch „grüner als mncnorthcorfu.gr"** | ✅ gebaut | grünes Design-System (Tailwind-Theme), Dark Mode | bewusste Designentscheidung (kein Wirkungsbeleg nötig) |
| **Initiativen mit SDG-Zielen matchen** (z. B. Meeresschutz → SDG 13/14) | 🔨 gebaut | `SDGBadge` je Projekt, `SDGDashboardPage` | DP3a · Simonofski 2022 **[A]**, Clement 2023 **[A]** |
| **Score / Wirkungsanzeige** | 🔨 gebaut | `TransparencyPage` KPIs, `ProgressBar`, Wirkungs-Score (fiktive Daten, gekennzeichnet) | DP3a/b · Grimmelikhuijsen & Welch 2012 **[A]**, Leite 2026 **[B]** |
| **Möglichst ALLE Zielgruppen** (versch. Werte je Gruppe; eher jüngere) | 🔨 gebaut/konzipiert | i18n EN/EL/DE, `AudiencesPage` (6 Gruppen), Schul-/Tourist:innen-Angebot konzipiert/teilw. | DP4/DP6 · Pontus 2021 **[A]**, Peacock 2018 **[A]**, Laksmi 2026 **[A]** |
| **Admin = Gemeinde** (Projekte hochladen/bearbeiten) | ✅ gebaut | Admin-Bereich `pages/admin/*`, Projekt-CRUD, `AdminRoute` (JWT) | bewusste Designentscheidung (Tech) |
| **Andere reichen Ideen ein** | 🔨 gebaut | `ParticipationPage` (ohne Account); Persistenz = Future Work | DP2a · Saldivar **[A]** |
| **„Edit Project" + Newsletter-Option** | 🔨 gebaut / konzipiert | Edit-Project ✅; **Newsletter-Opt-in** als Andeutung (NEU, kein Versand-Backend) | bewusste Designentscheidung; Versand = Future Work |
| **„Problem vor Feature"** (Koustas) | ✅ erfüllt | jedes Feature über TP → DP → Beleg zurückgeführt (diese Brücke + MATRIX) | Peffers 2007 **[B]**, Gregor & Jones 2007 **[B]** |
| **Vergleich mit anderen Kommunen/EU** | ✅ erfüllt | [`MATRIX.md`](MATRIX.md) §„Vergleichbare kommunale Lösungen" (Decide Madrid, Malta, …) | Royo 2020/2024 **[A]**, Vegas Macias 2023 **[A]** |
| **Accessibility-Guideline** | ✅ gebaut | `docs/accessibility-guidelines.md`, axe-core + E2E, WCAG 2.1 AA | DP4 · Csontos 2025 **[A]**, Chirumavilla 2025 **[B]** |

---

## 3. Bewusste Designentscheidungen ohne Wirkungsbeleg

Gemäß DSR-Rigor (Regel: keine Literatur für reine Technik-/Pragmatik-Entscheidungen) werden folgende Punkte **explizit als bewusste Designentscheidung** geführt, **nicht** mit einer Quelle hinterlegt:

- **Kein produktives Backend für die freie Initiativen-Einreichung in der Beta** (Komplexität/Risiko, Datenschutz) → Future Work.
- **Tech-Stack** (React/TS/Vite/Tailwind/Express/Prisma/SQLite) — Pragmatik, keine Wirkungsbehauptung.
- **Grünes Farbschema** („grüner als mncnorthcorfu.gr") — ästhetische Stakeholder-Vorgabe.
- **Newsletter als UI-Andeutung ohne Versand** — Scope-Entscheidung; realer Versand = Future Work (mit GDPR-by-Design, Diamantopoulou 2019 [B]).

---

## 4. „Gebaut" vs. „Konzipiert" (Kurzüberblick)

- **Gebaut & getestet:** zentrale Aktionsübersicht, Detailseite, SDG-Dashboard/-Badges, Transparenz-KPIs, Beteiligungsformular (ohne Account, ohne Persistenz), i18n-Infrastruktur EN/EL/DE, WCAG-Setup + Tests, Admin-CRUD (JWT), Dark Mode, Initiative-Tabs (NEU), Tourist:innen-Sektion (NEU).
- **Konzipiert (Future Work):** offizielle UN-SDG-Icons, Persistenz/Moderation der Bürgereinreichungen, realer Newsletter-Versand, dediziertes Schulprogramm, interaktive Karte (über Verortung hinaus), Storytelling-Audioguide für Tourist:innen, persistente Gamification (TP5/TP7/TP8).

→ Übergabe Phase 5/6: [`handover/phase5-6-handover.md`](handover/phase5-6-handover.md).
</content>
</invoke>

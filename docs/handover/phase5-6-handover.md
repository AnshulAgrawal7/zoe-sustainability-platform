# Handover — Phase 5 (Evaluation) & Phase 6 (Communication)

> ZOE-Plattform Nord-Korfu · DSR nach Peffers et al. (2007) · FAU SoSe 2026, Gruppe 1
> Verwandt: [`MATRIX.md`](../MATRIX.md) · [`literature-review.md`](../literature-review.md) · [`evaluation-plan.md`](../evaluation-plan.md) · [`DEVLOG.md`](../DEVLOG.md)

Dieses Dokument übergibt den Stand nach Phase 3/4 an die Evaluation (Phase 5) und die Kommunikation (Phase 6). Es benennt, **was gebaut** und **was konzipiert** ist, die **Evaluierbarkeit je Feature** (Matrix-Spalte 7), und konkrete nächste Schritte.

---

## 1. Gebaut vs. konzipiert (Übersicht)

| Feature | TP | Status | Datei(en) |
|---|---|---|---|
| Zentrale Aktionsübersicht + Filter | TP1 | ✅ gebaut | `ProjectsPage.tsx`, `projectService.ts`, Backend `projects.ts` |
| Projekt-Detailseite | TP1 | ✅ gebaut | `ProjectDetailPage.tsx` |
| Initiative-Tabs (Gruppierung) | TP1 | ✅ gebaut (NEU) | `components/engagement/InitiativeTabs.tsx` |
| Beteiligung ohne Account | TP2 | 🔨 gebaut (ohne Persistenz) | `ParticipationPage.tsx` |
| SDG-Dashboard + Badges | TP3 | 🔨 gebaut (keine offiziellen Icons) | `SDGDashboardPage.tsx`, `SDGBadge.tsx` |
| Transparenz-/KPI-Seite | TP3 | ✅ gebaut (fiktive Daten) | `TransparencyPage.tsx`, `ProgressBar.tsx` |
| i18n EN/EL/DE | TP4 | ✅ gebaut (durchgängig, alle Seiten) | `utils/i18n.ts`, `locales/`, `LanguageSwitcher.tsx` |
| DeepL-Auto-Übersetzung (Admin) | TP4 | ✅ gebaut | `backend/.../translationService.ts`, `AutoTranslatePanel.tsx` |
| WCAG 2.1 AA Setup + axe-Tests | TP4 | ✅ gebaut | `AccessibilityPage.tsx`, `__tests__/accessibility/` |
| Dark Mode | TP4 | ✅ gebaut | `themeStore.ts` |
| Tourist:innen-Beitrag | TP6 | 🔨 gebaut (NEU) | `components/engagement/TouristContribution.tsx` |
| Newsletter-Opt-in | (Stakeholder) | 🔨 gebaut (Konzept, kein Versand) | `components/ui/NewsletterSignup.tsx` |
| Admin-CRUD (Gemeinde) | TP1 | ✅ gebaut | `pages/admin/*`, JWT |
| **Persistenz freie Einreichungen** | TP2 | ❌ konzipiert | Future Work |
| **Offizielle UN-SDG-Icons** | TP3 | ❌ konzipiert | Future Work |
| ~~Durchgängige i18n (Altseiten)~~ | TP4 | ✅ **erledigt** | alle 7 Seiten auf `t()` (EN/EL/DE) |
| **Schulprogramm** | TP4 | ❌ konzipiert | Future Work |
| **Interaktive Karte** | TP1/TP2 | ❌ konzipiert | Future Work (vgl. Atzmanstorfer 2025 [A]) |
| **Persistente Gamification** | TP5 | ❌ konzipiert | Future Work |
| **Newsletter-Versand** | (TP7) | ❌ konzipiert | Future Work (GDPR-by-Design) |

---

## 2. Evaluierbarkeit je Feature (für Phase 5)

| Feature/DP | Ex-ante / artificial (jetzt machbar) | Ex-post / naturalistic (konzipiert) | FEDS-Strategie |
|---|---|---|---|
| **DP1 Sichtbarkeit** | Lighthouse, heuristischer Walkthrough | Aufgabentest „Finde Projekt X + Fortschritt" (Completion-Rate, Time-on-Task), SUS; Vergleich vs. Facebook-Baseline | Human Risk & Effectiveness |
| **DP2 Partizipation** | heuristische Prüfung des Formularflusses | Erfolgsquote „Idee ohne Account einreichen", wahrgenommene Hürde (Likert), Abbruchquote; **A/B-Test der Punkte-Mechanik** (testet Thiel-2016-Warnung) | Human Risk & Effectiveness |
| **DP3 SDG-Transparenz** | Heuristik, Lesbarkeits-/Kontrastprüfung | Verständnistest „Welche SDGs adressiert Projekt X?", wahrgenommene Transparenz/Glaubwürdigkeit (Likert) | Human Risk & Effectiveness |
| **DP4 Zielgruppen/Accessibility** | **axe-core (vorhanden)**, manuelles WCAG-2.1-AA-Audit (Methodik Csontos & Heckl 2021/2025), Sprachvollständigkeits-Check (alle 3 Sprachen, Pontus 2021), Screenreader-Walkthrough | Verständlichkeitstests je Zielgruppe | Technical Risk & Efficacy + Human Risk |
| **DP6 Tourist:innen** | Heuristik | Aufgabentest mit Tourist:innen-Persona „Wie kann ich als Gast helfen?", wahrgenommene Relevanz/Bereitschaft | Human Risk & Effectiveness |

---

## 3. Konkrete Phase-5-Schritte (Evaluation)

**Ex-ante / artificial (sofort, ohne Nutzer:innen):**
1. **WCAG 2.1 AA Audit** — axe-core (bereits in der Testsuite) + manuelle Prüfung der 50 Kriterien; Tastatur- und Screenreader-Walkthrough (NVDA/VoiceOver). Methodische Vorlage: Csontos & Heckl (2021, 2025) **[A]**.
2. **Kontrast-Check** — alle Text/Hintergrund-Kombinationen in Light + Dark Mode (4.5:1 / 3:1).
3. **Lighthouse** — Performance, Accessibility, Best Practices, SEO; Vergleich zur Baseline griechischer Kommunen (Tsatsani et al. 2024 **[A]** berichten < 55 %).
4. **Sprachvollständigkeit** — automatischer Abgleich fehlender i18n-Keys über EN/EL/DE (kritisch lt. Pontus 2021 **[A]**).
5. **Heuristische Evaluation** — strukturierter Experten-Walkthrough (allgemeine Usability-Heuristiken; *Hinweis: ein Nielsen-Primärbeleg ist nicht Teil des Korpus — Methode generisch anwenden, Quelle ggf. ergänzen ⚠️*).

**Ex-post / naturalistic (konzipiert, mit Nutzer:innen) — Rahmen FEDS (Venable et al., 2016) [B]:**
- Aufgaben-Tests je Persona/Zielgruppe (Einwohner:in, Tourist:in, Schüler:in, Lehrer:in), Strategie *Human Risk & Effectiveness*.
- System Usability Scale (SUS) + aufgabenbezogene Erfolgs-/Zeitmetriken.
- Verständnis- und Transparenzmaße (Likert) für TP3.
- Kontrolliertes A/B der Punkte-Mechanik (TP2) zur Prüfung der Thiel-2016-**[B]**-Warnung (kurzfristige/qualitätsmindernde Effekte rein belohnungsbasierter Gamification).

---

## 4. Konkrete Phase-6-Schritte (Kommunikation)

- **Berichte** finalisieren ([`reports/anshul.tex`](../reports/anshul.tex), [`reports/marieclaire.tex`](../reports/marieclaire.tex)) — Screenshots an den Bildplatzhaltern einsetzen, auf ~15 S. ausbauen (siehe STATUS-Reports).
- **Folien** mit Screenshots/Peffers-Diagramm bestücken ([`slides/`](../slides/)).
- **KI-Reflexion** (Pflichtbestandteil) — Nutzung generativer KI bei Recherche-Triage, Entwurf und Code-Gerüst; alle Zitate gegen die PDFs verifiziert; ⚠️-TODOs offengelegt (siehe [`literature-index.md`](../literature-index.md)).
- **Stakeholder-Kommunikation** an die Gemeinde Nord-Korfu (Kokkali) — nutzenorientiert (Carayannis 2026 **[A]**: Nutzen klar kommunizieren).

---

## 5. Future Work (Backend & Persistenz)

Für TP5/TP7/TP8 und persistente Funktionen ist ein produktives Backend nötig:
- **Persistente Bürgerinitiativen** (TP2) + Moderationsansicht für die Gemeinde.
- **Persistente Gamification** (TP5) — Punkte/Badges serverseitig, Leaderboard.
- **Newsletter-Versand** (TP7) — mit Double-Opt-in.
- **GDPR-by-Design** durchgängig — Diamantopoulou et al. (2019) **[B]**; das Transparenz-Privacy-Spannungsfeld (Paguay-Chimarro et al. 2025 **[A]**) ist besonders bei Daten von Kindern/Jugendlichen (Schulprogramm) zu beachten.
- **Offizielle UN-SDG-Icons**, **interaktive Karte** (Atzmanstorfer 2025 **[A]**), **Schulprogramm** (Peacock 2018 **[A]**, Vare 2025 **[A]**).

---

## 6. Offene ⚠️-Punkte (an das Team)

- Bibliografische Details prüfen: Chokki (Jahr/Band), Saldivar (Jahr), Navarro Galera (Jahr/Heft), Grimmelikhuijsen & Welch (Band/Jahr), Pina, Leite, Tsatsani, Diamantopoulou — siehe [`literature-index.md`](../literature-index.md).
- ✅ **Cronholm & Göbel (2018)** beschafft und als DP-Form-Quelle (Typ B) eingebaut (neben Gregor & Jones 2007) — *erledigt*.
- Preprints (Chokki, Çetintürk) nur vorsichtig (Typ B) verwenden.
- Reports auf ~15 Seiten ausbauen; Bildplatzhalter mit echten Screenshots ersetzen.
</content>

# Design-Rationale-Matrix — ZOE Platform

> ⚠️ **VERALTET — nicht weiterverwenden.** Diese themenorientierte Matrix (A–E)
> ist überholt: Sie referenziert **entfernte Features** (Schulranking/`SCHOOL`-Rolle,
> kein Einzel-Leaderboard) und beschreibt SDG-**Farbkacheln** statt der inzwischen
> eingebundenen **offiziellen UN-SDG-Icons**. Maßgeblich sind stattdessen:
> die zielorientierte [`design-principles-Z1-Z6.md`](design-principles-Z1-Z6.md)
> (Z1–Z6) und die führende [`MATRIX.md`](MATRIX.md) (TP1–TP8 + Vergleichstabelle).
> Dieses Dokument bleibt nur als Historie erhalten.

> DSR-Artefakt (Peffers et al., 2007), Projektseminar WInf SoSe 2026, FAU, Gruppe 1.
> Verknüpft **Problem/Anforderung → Designentscheidung (Umsetzung) → Begründung → Quelle(n)**.
>
> Quellen ohne Marker stammen aus den projekteigenen Research-Docs (`docs/research/*`,
> `docs/accessibility-guidelines.md`, `docs/dsr-methodology.md`) und sind dort bereits belegt.
> Mit **†** markierte Quellen wurden für diese Matrix ergänzt (kanonische HCI-/Motivations­literatur)
> und sollten vor der finalen Abgabe noch einmal gegengeprüft werden.

---

## A. Visuelle Gestaltung & Informationsarchitektur

| # | Problem / Anforderung | Designentscheidung & Umsetzung | Begründung | Quelle(n) |
|---|---|---|---|---|
| A1 | Plattform muss sofort als Umwelt-/Nachhaltigkeitskontext lesbar sein | **Grün-/Teal-Farbpalette** (Tailwind `green`/`teal`) als Primärfarbe; Hero-Verlauf grün→teal | Grün ist kulturübergreifend mit Natur/Umwelt assoziiert → schnelle, vorbewusste Domänen-Zuordnung | Elliot & Maier (2014) † |
| A2 | Lokale Projekte global verorten (SDG-Bezug sichtbar) | **Offizielle UN-SDG-Farben** als Hex in `src/data/sdgs.ts`, via `style={{backgroundColor}}` (einziger erlaubter Inline-Style) | Wiedererkennbarkeit & Legitimität durch konsistente Nutzung der offiziellen UN-Bildsprache | UN (2015); Le Blanc (2015) |
| A3 | SDG-Aussagen sind für Laien zu abstrakt; Überladung vermeiden | **Progressive Disclosure:** SDG-Icon+Farbe auf Karten, volle Erklärung erst im Detail; Klartext-Beschreibungen | Reduziert kognitive Last, erhält Tiefe für motivierte Nutzer | Shneiderman (1997); Ramboll (2021) |
| A4 | Viele Inhalte (Projekte, Neuigkeiten) navigierbar halten | **Tabs/Filter:** Typ-Filter auf `/news` (Alle/Neu/Abgeschlossen/Ankündigung), Kategorie-Filter auf Projekten | „Recognition rather than recall" + Nutzerkontrolle; gefilterte Sichten statt Scrollen | Nielsen (1994) †; Shneiderman (1997) |
| A5 | Schneller Überblick über heterogene Inhalte | **Karten-Layout** (`PostCard`, Projektkarten) mit Typ-Badge, Datum, Bild, Auszug | Karten fördern Scanbarkeit und gleichwertige, modulare Darstellung | Nielsen (1994) † |
| A6 | Eingeloggte Nutzer erwarten Konto-Zugriff an gewohnter Stelle | **Account-Dropdown oben rechts** (Name + Initialen + Menü) `UserMenu.tsx` | Konsistenz mit etablierten Web-Konventionen senkt Suchaufwand | Nielsen (1994) † |
| A7 | Längere Texte dürfen das Layout nicht brechen (EL/DE) | Flexible Button-/Karten-Breiten, `truncate`/`line-clamp`, kein Fixed-Width-Text | Griechisch/Deutsch sind ~20–30 % länger als Englisch | Savourel (2001) |

## B. Gamification & Belohnungssystem

| # | Problem / Anforderung | Designentscheidung & Umsetzung | Begründung | Quelle(n) |
|---|---|---|---|---|
| B1 | Bürger:innen zu nachhaltiger Teilnahme motivieren, ohne intrinsische Motivation zu verdrängen | **Punkte + Badges + 5 Tier-Stufen** statt reinem Wettbewerb; Belohnung als Anerkennung gerahmt | Intrinsisch/extrinsisch balanciert; Punkte sind nicht-nullsummig (jede:r kann sich verbessern) | Deterding et al. (2011); Hamari et al. (2014) |
| B2 | Belohnungen müssen im lokalen Kontext bedeutsam sein | **Griechische Tier-Namen** (Σπόρος → Θεματοφύλακας), ortsbezogene Realbelohnungen | Kulturelle Bedeutsamkeit erhöht Wirksamkeit der Gamification | Deterding et al. (2011); Putnam (1993) |
| B3 | Individuelles Ranking erzeugt in kleiner Inselgemeinschaft soziale Reibung | **Bewusst KEIN individuelles Bürger-Leaderboard;** stattdessen **Community-Milestones** (kollektives Ziel) | Bonding Social Capital widersteht kompetitivem Ranking unter Nachbarn | Putnam (1993); Hamari et al. (2014) |
| B4 | Schulen als Zielgruppe einbinden, ohne B3 zu verletzen | **Schulranking (NEU):** Wettbewerb auf **Team-/Institutions-Ebene**, Sortierung nach **Ø-Punkten pro Mitglied**, mind. 3 Mitglieder zur Wertung; Gesamt + Ø transparent | Gruppen- statt Nachbar-Wettbewerb nutzt soziale Identität; Ø+Mindestgröße dämpfen die Demotivation, vor der B3 warnt | Tajfel & Turner (1979) †; Landers et al. (2017) †; Abgrenzung zu Putnam (1993)/Hamari et al. (2014) |
| B5 | Junge Menschen / Schulen für Nachhaltigkeit aktivieren | **Schulprogramme & Schulaccounts (NEU):** `School`-Entität, Rolle `SCHOOL`, eigenes Dashboard, Schul-Belohnungsstufen | Bildung für nachhaltige Entwicklung adressiert Zielgruppen-Heterogenität (DSR-Ziel) | UNESCO (2017) †; Falco & Kleinhans (2018) |
| B6 | Onboarding für Schüler:innen niedrigschwellig halten | **Beitritt per Schul-Code** (bei Registrierung *oder* später im Profil), kein Pflicht-Login für Basiszugang | Barrieren senken erhöht Beteiligung | Verdegem & Verleye (2009); Nielsen (1994) † |

## C. Transparenz & Neuigkeiten

| # | Problem / Anforderung | Designentscheidung & Umsetzung | Begründung | Quelle(n) |
|---|---|---|---|---|
| C1 | Bürger:innen sehen nicht, was passiert / „im Loop" bleiben | **Neuigkeiten-Feed (NEU):** Auto-Beitrag bei Projekt-Veröffentlichung (`PROJECT_NEW`) und -Abschluss (`PROJECT_COMPLETED`), Startseiten-Sektion + `/news` | „Closing the loop" erhöht Wiederbeteiligung; sichtbare Aktivität schafft Rechenschaft | MySociety (2019); Fung (2006) |
| C2 | Geringe institutionelle Vertrauensdistanz erfordert sichtbare Rechenschaft | Transparenz-Seite + SDG-Dashboard + KPI-Metriken; Auto-Posts dreisprachig aus Projektdaten | Sichtbare Accountability adressiert niedriges Institutionsvertrauen | Fung (2006); Falco & Kleinhans (2018) |
| C3 | Redaktionelle Kontrolle nötig (nicht nur Automatik) | **Manuelle Admin-Posts (NEU)** mit DeepL-Übersetzung; Auto-Posts editier-/löschbar | Mensch-in-der-Schleife sichert Qualität/Tonalität | (Designentscheidung; vgl. Hevner et al., 2004) |

## D. Mehrsprachigkeit (i18n)

| # | Problem / Anforderung | Designentscheidung & Umsetzung | Begründung | Quelle(n) |
|---|---|---|---|---|
| D1 | Gemeinde + Tourismus: EL-, EN- und DE-Sprechende gleichzeitig | **Dreisprachig EN/EL/DE als First-Class** (react-i18next); alle neuen Texte über `t('key')`, dreisprachige Inhaltsfelder | Sprachbarrieren sind starke Prädiktoren für Nicht-Beteiligung an E-Gov | Verdegem & Verleye (2009); GNTO (2023) |
| D2 | Sprachwahl soll Sitzungen überdauern | **Persistenz** in `localStorage('zoe-language')`, vor erstem Render gelesen | Nutzer erwarten persistente Sprachpräferenz; Re-Auswahl erzeugt Reibung | Schade / NN/g (2012) |
| D3 | Zahlen/Datumsformate locale-korrekt | `Intl.NumberFormat` / `Intl.DateTimeFormat` an Locale gebunden | Formatunterschiede (1.250 vs 1,250) verwirren sonst | Savourel (2001) |

## E. Barrierefreiheit & Mobile

| # | Problem / Anforderung | Designentscheidung & Umsetzung | Begründung | Quelle(n) |
|---|---|---|---|---|
| E1 | Rechtliche Pflicht zur Barrierefreiheit (öffentliche Stelle) | **WCAG 2.1 AA:** semantisches HTML, `focus-visible:ring`, `aria-label` via `t()`, `role="alert"`, Kontraste in Light/Dark | EU-Recht verpflichtet öffentliche Stellen auf WCAG 2.1 AA | EU Directive 2016/2102; EN 301 549; W3C WCAG 2.1 (2018); EAA 2019/882 |
| E2 | Nutzung überwiegend mobil (Inselkontext) | **Mobile-First (375px)**, Touch-Targets ≥ 44×44px, responsive Grids | Hohe mobile Durchdringung; Fingerbedienbarkeit | WCAG 2.5.5; GSMA Intelligence (2023) |
| E3 | Rollen-Dropdown war mit Emojis bestückt (Screenreader/Klarheit) | **Emoji aus Rollen-Dropdown entfernt (NEU)** (Registrierung + Profil), Klartext via `t()` | Emojis in `<option>` werden von AT uneinheitlich vorgelesen; klarere, sachliche Darstellung | W3C WCAG 2.1 (2018) (Verständlichkeit) |
| E4 | Nutzerkomfort / Systempräferenz respektieren | **Dark Mode** (Tailwind `class`-Strategie, Systempräferenz als Default, persistiert) | Respektiert Nutzer-/Systempräferenz; Kontrast in beiden Modi gewahrt | W3C Media Queries L5 (`prefers-color-scheme`) † |

## F. Methodik & Forschungsethik

| # | Problem / Anforderung | Designentscheidung & Umsetzung | Begründung | Quelle(n) |
|---|---|---|---|---|
| F1 | Prototyp darf nicht als Echtsystem missverstanden werden | **`PrototypeBanner`** global im `Layout`; ehrliche Datenkennzeichnung (`// PROTOTYPE DATA —`) | Forschungsethische Transparenz über Reifegrad und Datenqualität | Peffers et al. (2007); Hevner et al. (2004) |
| F2 | Designentscheidungen müssen nachvollziehbar/rigoros sein | Diese Matrix + ADRs (`docs/architecture.md`) verknüpfen Problem→Lösung→Quelle | DSR verlangt Verankerung im Knowledge Base (Rigor Cycle) | Hevner et al. (2004); Peffers et al. (2007) |
| F3 | Akzeptanz künftiger Nutzer einschätzen | Geplante Evaluation (SUS, Interviews); Designziele an Nutzbarkeit/Teilnahmeabsicht ausgerichtet | Technologieakzeptanz (Nützlichkeit/Benutzbarkeit) als Erfolgsfaktor | Venkatesh et al. (2003) |

---

## Quellenverzeichnis

**Bereits in den Projekt-Research-Docs belegt:**

- Barandiaran, X., Calleja-López, A., Monterde, A., Pereira, I., & Subirats, J. (2018). *Decidim: Political and technopolitical networks for participatory democracy*. Ajuntament de Barcelona.
- Deterding, S., Dixon, D., Khaled, R., & Nacke, L. (2011). From game design elements to gamefulness: Defining "gamification." *Proc. 15th MindTrek*, 9–15. https://doi.org/10.1145/2181037.2181040
- EU Directive 2016/2102 (Web Accessibility Directive); EN 301 549; European Accessibility Act (Directive 2019/882).
- Falco, E., & Kleinhans, R. (2018). Beyond technology: Identifying local government challenges for using digital platforms for citizen engagement. *Int. J. of Information Management*, 40, 17–20.
- Fung, A. (2006). Varieties of participation in complex governance. *Public Administration Review*, 66(s1), 66–75. https://doi.org/10.1111/j.1540-6210.2006.00667.x
- GNTO — Greek National Tourism Organisation (2023). Tourism statistics.
- GSMA Intelligence (2023). *The mobile economy Europe 2023*.
- Hamari, J., Koivisto, J., & Sarsa, H. (2014). Does gamification work? A literature review of empirical studies on gamification. *Proc. 47th HICSS*, 3025–3034. https://doi.org/10.1109/HICSS.2014.377
- Hevner, A. R., March, S. T., Park, J., & Ram, S. (2004). Design science in information systems research. *MIS Quarterly*, 28(1), 75–105.
- Le Blanc, D. (2015). Towards integration at last? The SDGs as a network of targets. *Sustainable Development*, 23(3), 176–187.
- MySociety (2019). *FixMyStreet impact report 2019*.
- Peffers, K., Tuunanen, T., Rothenberger, M. A., & Chatterjee, S. (2007). A design science research methodology for information systems research. *JMIS*, 24(3), 45–77. https://doi.org/10.2753/MIS0742-1222240302
- Putnam, R. D. (1993). *Making democracy work: Civic traditions in modern Italy*. Princeton University Press.
- Ramboll (2021). EU citizen engagement / comprehension study.
- Savourel, Y. (2001). *XML internationalization and localization*. Sams.
- Schade, A. (2012). *Multilingual users & language preferences*. Nielsen Norman Group.
- Shneiderman, B. (1997). *Designing the user interface*. Addison-Wesley (progressive disclosure).
- UN (2015). *Transforming our world: the 2030 Agenda for Sustainable Development* (official SDG visual identity/colours).
- Venkatesh, V., Morris, M. G., Davis, G. B., & Davis, F. D. (2003). User acceptance of information technology: Toward a unified view (UTAUT). *MIS Quarterly*, 27(3), 425–478.
- Verdegem, P., & Verleye, G. (2009). User-centered e-government in practice. *Government Information Quarterly*, 26(3), 487–497.
- W3C (2018). *Web Content Accessibility Guidelines (WCAG) 2.1*.

**† Für diese Matrix ergänzt (kanonische Literatur — vor Abgabe gegenprüfen):**

- Elliot, A. J., & Maier, M. A. (2014). Color psychology: Effects of perceiving color on psychological functioning in humans. *Annual Review of Psychology*, 65, 95–120.
- Landers, R. N., Bauer, K. N., & Callan, R. C. (2017). Gamification of task performance with leaderboards: A goal-setting experiment. *Computers in Human Behavior*, 71, 508–515.
- Nielsen, J. (1994/2020). *10 usability heuristics for user interface design*. Nielsen Norman Group.
- Tajfel, H., & Turner, J. C. (1979). An integrative theory of intergroup conflict. In *The social psychology of intergroup relations*.
- UNESCO (2017). *Education for Sustainable Development Goals: Learning objectives*. UNESCO.
- W3C. *Media Queries Level 5* (`prefers-color-scheme`).

---

### Hinweis zur Schulranking-Entscheidung (B4)

Das Reward-Research-Dokument (`docs/research/reward-system-research.md`, §5.1) begründet **bewusst den Verzicht
auf ein individuelles Bürger-Leaderboard** (Reibung unter Nachbarn, Putnam 1993; Demotivation der Mehrheit,
Hamari et al. 2014). Das neue **Schulranking widerspricht dem nicht**, weil es auf **Gruppen-/Institutions­ebene**
stattfindet: Verglichen werden Schulen, nicht Einzelpersonen — das nutzt positive In-Group-Identität
(Tajfel & Turner, 1979) statt interpersonellen Vergleich. Zusätzlich mildern **Ø-Punkte pro Mitglied** (statt
Summe) und die **Mindestgröße von 3 Mitgliedern** die von Hamari et al. (2014) beschriebenen Demotivations­effekte.
Diese Abgrenzung sollte im Bericht explizit als bewusste, belegte Designentscheidung dargestellt werden.

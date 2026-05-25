# Accessibility Audit — ZOE Platform

**Datum:** 25. Mai 2026
**Standard:** WCAG 2.1 Level AA (EU Directive 2016/2102, EN 301 549)
**Geprüft von:** ZOE Docs Agent
**Scope:** Statische Code-Analyse der primären UI-Komponenten und Seiten

---

## Zusammenfassung

Die Plattform erreicht für einen akademischen MVP-Prototyp eine solide Accessibility-Basis. Die Kernmuster (label+id, role="alert", aria-label auf Icon-Buttons, Skip-Link, semantisches Layout mit `<main id="main-content">`) sind korrekt implementiert. Drei strukturelle Probleme wurden identifiziert, die vor der Präsentation behoben werden sollten: (1) Das `lang`-Attribut im HTML-Dokument wird bei Sprachenwechsel nicht dynamisch aktualisiert, (2) der PrototypeBanner enthält hardcodierten Text statt i18n-Keys und fehlende ARIA-Rolle, (3) mehrere Formularfelder in `NewProjectPage` haben kein `htmlFor`/`id`-Paar, was die Screen-Reader-Zuordnung bricht.

---

## Geprüfte Komponenten

| Komponente | Tastatur | Kontrast | ARIA | Lang | Mobile | i18n | Status |
|---|---|---|---|---|---|---|---|
| Header | OK — alle Buttons/Links erreichbar; `aria-expanded` auf Hamburger korrekt | Grau auf Weiß (text-gray-600 / bg-white) besteht 4.5:1; Grün auf Weiß (text-green-700) knapp bestanden | `aria-label` auf Icon-Buttons vorhanden; `aria-hidden` auf alle Dekor-Icons; `aria-label` für Sprach-Dropdown und Logout korrekt | FAIL — Hamburger "Open menu"-Label ist hardcodiert EN; `lang`-Attribut im `<html>`-Tag ändert sich nicht dynamisch | Hamburger-Menü vorhanden; Mobile-nav korrekt hinter `lg:hidden`; Touch-Targets ≥ 44px (p-2 + Icon 22px = ~42px, grenzwertig) | Teilweise — nav-Labels via `t()`; Hamburger-Open-Label hardcodiert | FIXED/TODO |
| Footer | OK — alle Links per Tab erreichbar | Grau auf Dunkel (text-gray-300 / bg-gray-900) besteht 7:1+ | Kein `role` auf `<footer>` nötig (semantisch); `aria-label` auf GitHub-Link korrekt | FAIL — alle Texte hardcodiert EN, kein i18n | Grid kollabiert auf 1 Spalte auf Mobile korrekt | FAIL — alle sichtbaren Texte hardcodiert EN; kein `t()` | TODO |
| Layout | OK — Skip-Link in index.html vorhanden; `<main id="main-content">` korrekt | n/a | `id="main-content"` als Sprungziel des Skip-Links korrekt | n/a | `flex min-h-screen flex-col` korrekt | n/a | OK |
| LoginPage | OK — Tab-Reihenfolge: E-Mail → Passwort → Submit → Link; Submit hat `focus:ring-2` | Weißer Button-Text auf bg-green-600 besteht 4.5:1; grauer Hilfetext (text-gray-400) auf Weiß: ~3.7:1, knapp unter AA | `role="alert"` auf Fehlermeldung korrekt; `label + htmlFor + id` korrekt verknüpft (`#email`, `#password`) | n/a | Vollbild-Formular auf 375px korrekt; Submit-Button volle Breite | Alle Labels und Fehlermeldungen via `t()` | OK (1 Kontrast-TODO) |
| RegisterPage | OK — Tab-Reihenfolge: Name → E-Mail → Passwort → Sprache → Submit | Gleiche Kontrast-Situation wie LoginPage | `role="alert"` korrekt; Labels korrekt via `#name`, `#reg-email`, `#reg-password`, `#language` | n/a | Vollbild-Formular korrekt | Alle Labels via `t()`; Select-Optionen (EN/EL/DE-Sprachnamen) hardcodiert — akzeptabel da Eigenname | OK |
| ParticipationPage | PARTIAL — Participation-Option-Buttons haben `aria-pressed`; Close-Button hat `aria-label`; Submit- und Clear-Buttons fehlt `focus:ring` | Grün auf Weiß bei aktiven Cards korrekt; Amber-Badge (text-amber-800 / bg-amber-100): ~4.8:1, besteht | `aria-pressed` auf Toggle-Cards korrekt; Formular-Felder (`#part-name`, `#part-email`, `#part-message`) korrekt | n/a | Grid 1→2→3 Spalten korrekt; Cards haben Text-Inhalt, daher keine reinen 44px-Target-Probleme | Alle Labels, Buttons via `t()`; option.title und option.description kommen aus data/metrics — hardcodierte EN-Strings | TODO (focus-ring, i18n der data-Strings) |
| NewProjectPage | FAIL — Alle `<label>`-Elemente in den dynamisch generierten Abschnitten (Titles, Descriptions, Meta) fehlen `htmlFor`; zugehörige `<input>`/`<select>`/`<textarea>` fehlen `id`-Attribute; Screen Reader kann Labels nicht zuordnen | Kontrast-Verhältnisse korrekt; SDG-Buttons: weiße Zahlen auf bg-green-600 besteht 4.5:1 | SDG-Buttons haben `aria-pressed` und `aria-label="SDG N"` korrekt; `role="alert"` auf Fehlermeldung korrekt; Submit hat kein `focus:ring` | n/a | Max-width 3xl, auf Mobile korrekt; SDG-Button-Grid mit `flex-wrap` korrekt; 40×40px SDG-Buttons leicht unter 44px | Labels (EN/EL/DE) in section-headings hardcodiert; via `t()` wäre besser | FAIL (label/id fehlt) |
| index.html | OK — Skip-Link (`<a href="#main-content" class="sr-only focus:not-sr-only">`) korrekt implementiert; `<meta name="description">` vorhanden; Viewport-Meta korrekt | n/a | n/a | PARTIAL — `lang="en"` statisch hartcodiert; ändert sich nicht wenn User zu EL/DE wechselt | `width=device-width, initial-scale=1.0` korrekt | n/a | TODO (dynamisches lang) |

---

## Gefundene Probleme (priorisiert)

### Kritisch (WCAG Fail)

**1. `NewProjectPage`: Labels ohne `htmlFor`/`id`-Verknüpfung**

In den Abschnitten "Titles", "Descriptions" und "Meta" werden Labels und Inputs über eine `.map()`-Schleife gerendert. Keines der `<label>`-Elemente hat ein `htmlFor`-Attribut und keines der zugehörigen Inputs hat ein `id`. Das verletzt WCAG 1.3.1 (Info and Relationships) und 4.1.2 (Name, Role, Value). Screen Reader-Nutzer können nicht erkennen, welches Label zu welchem Feld gehört.

Betroffen: `titleEn`, `titleEl`, `titleDe`, `descriptionEn`, `descriptionEl`, `descriptionDe`, `category`, `status`, `rewardPoints`, `maxParticipants`, `location`.

**2. `<html lang="en">` ist statisch — ändert sich nicht bei Sprachwechsel**

Die `languageStore.setLanguage()`-Funktion ruft `i18n.changeLanguage()` auf und speichert in `localStorage`, aktualisiert aber nicht `document.documentElement.lang`. Das verletzt WCAG 3.1.1 (Language of Page). Assistive Technologies lesen die gesamte Seite weiter in Englisch vor, auch wenn der User Griechisch oder Deutsch gewählt hat.

### Mittel (Best Practice Verletzung)

**3. `PrototypeBanner`: Hardcodierter Text und fehlende ARIA-Rolle**

Der PrototypeBanner enthält vollständig hardcodierten englischen Text (`"Prototype Notice: This is a frontend MVP..."`) und nutzt kein `t()`. Für griechische oder deutsche Nutzer erscheint das Banner immer auf Englisch. Zusätzlich fehlt `role="banner"` ist zwar über das semantische `<header>`-Element gedeckt, aber der PrototypeBanner selbst hat kein `role="status"` oder `aria-live`, sodass er für Screen-Reader-Nutzer still hinzugefügt werden kann ohne Ankündigung.

**4. Mobile Touch-Targets im Header grenzwertig**

Icon-Buttons im Header (`p-2` + Icon `18px` oder `22px`) ergeben ~42×42px. WCAG 2.5.5 (Level AAA) fordert 44×44px; WCAG 2.5.8 (Level AA in 2.2) fordert mindestens 24×24px. Die aktuellen Werte bestehen 2.5.8 aber verfehlen knapp 2.5.5. SDG-Buttons in `NewProjectPage` (`h-10 w-10` = 40×40px) verfehlen ebenfalls.

**5. Submit-Button in `ParticipationPage` fehlt `focus:ring`**

Der Submit-Button (`bg-green-600 ... hover:bg-green-700`) hat keine `focus:outline-none focus:ring-2`-Klassen. Der Browser-Standard-Fokusring wird sichtbar, aber uneinheitlich (abhängig von Browser/OS). Verletzt das interne Konsistenzgebot.

**6. Grauer Hilfe-/Demo-Text auf Weißem Hintergrund (LoginPage)**

Die Demo-Credentials-Zeile (`text-gray-400` auf `bg-white`) hat ein Kontrast-Verhältnis von ~3.7:1 — unter dem WCAG AA-Mindest von 4.5:1 für normalen Text. Ebenfalls: die Fußzeile im Footer (`text-gray-500` auf `bg-gray-900`) besteht, aber `text-gray-400` auf `bg-white` in einigen Formular-Beschreibungen nicht.

**7. `ParticipationPage`: `participationOptions`-Texte aus Datendatei sind nicht i18n-fähig**

`option.title`, `option.description` und `option.actionLabel` kommen aus `src/data/metrics.ts` und sind hartcodierte EN-Strings. Bei EL- oder DE-Sprachauswahl werden diese trotzdem auf Englisch angezeigt.

### Niedrig / Nice-to-have

**8. Footer vollständig ohne i18n**

Alle Footer-Texte (Sektions-Überschriften, Link-Labels, Copyright-Zeile, Research-Context-Text) sind hartcodiert auf Englisch. Dies verletzt das CLAUDE.md-Gebot "Kein hardcodierter Text im JSX — ausnahmslos `t('key')`". Für eine Behörden-Plattform die griechische Bürger adressiert, ist dies besonders problematisch.

**9. Skip-Link-Styling über CSS-Klasse `sr-only focus:not-sr-only`**

Der Skip-Link in `index.html` ist korrekt implementiert, hat aber kein sichtbares Styling wenn er bei Focus erscheint (kein `bg-white`, kein `padding`, kein `border`). Er ist technisch nicht `sr-only` mehr bei Focus, aber ohne visuelle Gestaltung möglicherweise unsichtbar auf dem Hintergrund.

**10. Kein `aria-live` auf Gamification-Punkte-Anzeige**

Die Punkte-Anzeige im Header (`{user.points}`) aktualisiert sich nach Aktionen ohne `aria-live="polite"`. Screen-Reader-Nutzer erfahren keine Ankündigung wenn Punkte hinzukommen.

**11. `<h2>` in `ParticipationPage`-Cards (Participation Options) und im Formular-Panel**

Die Options-Cards nutzen `<h2>` für den Card-Titel. Die Seite hat ein `<h1>` (korrekt), aber die `<h2>`-Elemente im Formular-Panel sind inkonsistent: manchmal sind es `<h2>`, die strukturell keine echten Abschnittsüberschriften sind, sondern eher Label-Gruppen.

---

## Implementierte Fixes

Keine Fixes wurden in dieser Audit-Session vorgenommen. Dies ist ein reiner Audit-Report. Alle identifizierten Probleme sind als TODO-Items dokumentiert.

Bereits korrekt implementiert (kein Fix nötig):

- Skip-Link in `index.html` vorhanden und funktional
- `<main id="main-content">` als Sprungziel korrekt
- `aria-label` auf alle Icon-Only-Buttons im Header
- `aria-hidden="true"` auf alle dekorativen Lucide-Icons
- `role="alert"` auf alle dynamischen Fehlermeldungen (Login, Register, NewProject)
- `label + htmlFor + id` korrekt in LoginPage, RegisterPage, ParticipationPage
- `aria-expanded` + `aria-controls="mobile-menu"` auf Hamburger-Button
- `aria-pressed` auf Toggle-Buttons (ParticipationPage Cards, SDG-Buttons)
- `aria-label="SDG N"` auf SDG-Toggle-Buttons
- `focus:ring-2 focus:ring-green-500` auf primäre Submit-Buttons (Login, Register)
- Dark-Mode-Kontraste in allen geprüften Komponenten eingehalten
- `noValidate` auf Forms mit eigener Validierung korrekt
- `autoComplete`-Attribute auf allen Auth-Feldern korrekt

---

## Verbleibende Aufgaben

**Priorität Hoch (vor Präsentation beheben):**

1. `NewProjectPage`: `htmlFor` + `id` auf alle dynamisch generierten Label/Input-Paare hinzufügen. Vorgeschlagenes ID-Schema: `title-en`, `title-el`, `title-de`, `desc-en`, `desc-el`, `desc-de`, `field-category`, `field-status`, `field-reward-points`, `field-max-participants`, `field-location`.

2. `languageStore.setLanguage()`: `document.documentElement.lang = lang;` nach `i18n.changeLanguage(lang)` hinzufügen, damit das HTML-lang-Attribut dynamisch aktualisiert wird.

3. `PrototypeBanner`: i18n-Keys hinzufügen (`common.prototypeBanner` o.ä.) und `role="status"` ergänzen.

**Priorität Mittel:**

4. `ParticipationPage` Submit-Button: `focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2` hinzufügen.

5. `LoginPage` Demo-Credentials: Textfarbe auf `text-gray-500` anheben oder als `aria-hidden="true"` markieren (kein funktionaler Inhalt).

6. `ParticipationPage` `participationOptions`: Mehrsprachige Felder in `src/data/metrics.ts` oder Übersetzungen in `locales/*/translation.json` einführen.

**Priorität Niedrig:**

7. Footer vollständig auf i18n umstellen.

8. Skip-Link in `index.html`: Sichtbares Styling bei Focus hinzufügen (`class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-green-700 focus:shadow-lg focus:ring-2 focus:ring-green-500"`).

9. Header Touch-Targets: `p-2` auf `p-2.5` erhöhen wo möglich (Hamburger, Icon-Buttons).

10. SDG-Buttons: `h-10 w-10` auf `h-11 w-11` anheben.

11. Punkte-Anzeige im Header: `aria-live="polite"` und `aria-label` hinzufügen.

---

## Manuelle Test-Checkliste

- [ ] Gesamte Plattform nur mit Tastatur navigierbar? (Tab, Enter, Space, Escape)
- [ ] Fokus-Reihenfolge logisch? (oben links nach unten rechts, kein Fokus-Verlust bei dynamischen Inhalten)
- [ ] Browser-Zoom auf 200%: kein horizontales Scrollen, alles lesbar?
- [ ] Dark Mode: alle Kontraste eingehalten? (besonders grüne Texte auf dunklem Hintergrund)
- [ ] Mobile (375px): alle Touch-Targets mindestens 44x44px?
- [ ] Sprachswitch EN → EL → DE: lang-Attribut am `<html>`-Tag ändert sich korrekt? (nach Fix von Aufgabe 2)
- [ ] Screen Reader: VoiceOver (macOS/iOS) oder NVDA (Windows) — werden Formular-Labels korrekt angesagt?
- [ ] Fehlermeldungen: werden von Screen Reader sofort angesagt? (role="alert" Test)
- [ ] Skip-Link bei Tab-Focus sichtbar und anklickbar?
- [ ] Gamification-Punkte-Update: Screen Reader kündigt Änderung an?
- [ ] SDG-Buttons: werden als "SDG 1, nicht ausgewählt" etc. angesagt?
- [ ] Mobile-Menu: wird bei Hamburger-Klick korrekt auf- und zugeklappt (aria-expanded)?

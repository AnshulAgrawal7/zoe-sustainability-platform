# ZOE Platform — Accessibility & Quality Guidelines

**Version:** 1.0 — 25. Mai 2026
**Gilt für:** Alle Komponenten und Seiten der ZOE Sustainability Platform

---

## Rechtliche Grundlage

Die ZOE Platform ist ein digitaler Dienst einer griechischen Gemeinde (Nordkorfu / Dimos Voreias Kerkyras). Als öffentliches E-Government-Portal greift folgendes Rechtsrahmen:

**EU Directive 2016/2102** (Web Accessibility Directive) verpflichtet alle öffentlichen Stellen in EU-Mitgliedstaaten, ihre Websites und mobilen Anwendungen nach dem WCAG 2.1 Level AA-Standard zugänglich zu gestalten. Griechenland hat die Richtlinie mit nationalem Recht umgesetzt. Neue oder überarbeitete Websites sind seit September 2019 betroffen.

**EN 301 549** ist die europäische Norm, auf die die Directive verweist. Sie übernimmt WCAG 2.1 AA als technischen Standard für Web-Inhalte und ergänzt ihn um weitere Anforderungen für Software und Dokumente. Für eine React-SPA gilt primär der Web-Abschnitt (Kapitel 9).

**WCAG 2.1 Level AA** (W3C, 2018) definiert 50 Erfolgskriterien auf vier Ebenen: A (Mindest), AA (Standard), AAA (erweitert). Level AA ist der rechtlich geforderte Standard. Die ZOE Platform muss alle A- und AA-Kriterien erfüllen.

**European Accessibility Act (EAA) 2019/882**, gültig ab Juni 2025, erweitert die Anforderungen auf private Wirtschaftsakteure für bestimmte Produkte und Dienstleistungen. Für eine gemeindliche Plattform bleibt die Web Accessibility Directive maßgeblich; der EAA schafft aber auch Erwartungen auf Seiten der Nutzer gegenüber digitalen Diensten allgemein.

Für die Gemeinde Nordkorfu gilt konkret: Eine Plattform, die griechische Bürgerinnen und Bürger zur Partizipation einlädt — darunter ältere Menschen, Menschen mit Behinderungen, Personen mit geringen Digitalkenntnissen — muss barrierefrei sein, um ihren demokratischen Zweck zu erfüllen. Accessibility ist hier kein technisches Zusatz-Feature, sondern Voraussetzung für inklusives E-Government.

---

## WCAG 2.1 AA — POUR-Prinzipien Kurzreferenz

### Perceivable

Inhalte müssen für alle Nutzer wahrnehmbar sein, unabhängig von Sinneskanal.

**Alt-Texte für Bilder:** Jedes `<img>`-Element braucht ein `alt`-Attribut. Inhaltlich relevante Bilder erhalten eine beschreibende Alternative (`alt="Olivenhain im Norden Korfus"`). Rein dekorative Bilder erhalten `alt=""`, damit Screen Reader sie überspringen. SVG-Icons über lucide-react werden mit `aria-hidden="true"` versehen, wenn sie dekorativ sind, oder mit `aria-label` wenn sie funktional sind.

**Kontrast:** Normaler Text (unter 18px regular / 14px bold) muss mindestens 4.5:1 Kontrast zum Hintergrund haben. Großer Text (18px+ oder 14px+ bold) benötigt mindestens 3:1. UI-Komponenten-Grenzen und informative Grafiken benötigen 3:1. Diese Anforderungen gelten für Light Mode und Dark Mode gleichermaßen. Tailwind-Klassen wie `text-gray-400` auf weißem Hintergrund bestehen das Verhältnis oft nicht — Messung ist Pflicht.

**Keine Info nur durch Farbe:** Status-Anzeigen (z.B. Projekt-Status OPEN/CLOSED) dürfen Farbe als visuellen Zusatz nutzen, aber der Text selbst muss die Information tragen. Ein grüner Punkt allein ist nicht ausreichend; "OPEN" + grüner Punkt ist korrekt.

**Untertitel und Transkripte:** Wenn in künftigen Iterationen Video- oder Audio-Inhalte hinzukommen (z.B. Bürger-Interviews, Event-Aufzeichnungen), sind Untertitel (Level A) und Audiodeskription (Level AA) Pflicht.

### Operable

Alle Funktionen müssen über Tastatur bedienbar sein; keine Zeitlimits ohne Kontrolle.

**Tastaturnavigation:** Jede interaktive Komponente (Link, Button, Input, Select, Textarea, Toggle) muss per Tab erreichbar sein und per Enter oder Space aktivierbar. Modale Dialoge und Dropdown-Menüs müssen per Escape schließbar sein und den Fokus zurückgeben. Keine "Fokus-Fallen" — der Nutzer darf nie in einem Element feststecken.

**Skip-Link:** Ein `<a href="#main-content">Skip to main content</a>`-Link muss das erste fokussierbare Element auf jeder Seite sein. Er ist standardmäßig visuell versteckt (`sr-only`) und erscheint nur bei Fokus (`focus:not-sr-only`). Ziel-Element: `<main id="main-content">`. Implementiert in `index.html`.

**Fokus-Indikatoren:** Jedes fokussierte Element muss einen sichtbaren Fokusring haben. Tailwind-Pattern: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2`. Nie `outline: none` ohne sofortigen Ersatz setzen. `focus-visible` ist gegenüber `focus` zu bevorzugen, damit Maus-Nutzer nicht unnötig Ringe sehen.

**`aria-current`:** Aktive Navigation-Links erhalten `aria-current="page"`. React Router's `NavLink` setzt dies automatisch wenn `aria-current` prop übergeben wird. Explizite Angabe: `<NavLink aria-current={isActive ? 'page' : undefined}>`.

**`prefers-reduced-motion`:** Animationen und Transitions müssen auf Wunsch des Betriebssystems deaktivierbar sein. Tailwind unterstützt `motion-reduce:transition-none` und `motion-reduce:animate-none`. Alle nicht-wesentlichen CSS-Transitions (`transition-colors`, `transition-all`) sollten mit `motion-reduce:`-Variante versehen werden.

### Understandable

Inhalte und Bedienelemente müssen verständlich sein.

**`lang`-Attribut:** Das `<html>`-Element muss das korrekte `lang`-Attribut für die aktive Sprache tragen. Bei Sprachwechsel muss `document.documentElement.lang` aktualisiert werden. Für die ZOE Platform: `'en'`, `'el'`, `'de'`. Dies ist kritisch, weil Screen Reader die Aussprache-Engine nach dem `lang`-Wert auswählen. Griechischer Text der auf Englisch vorgelesen wird ist unverständlich.

**Formulare:** Jedes Formularfeld braucht ein sichtbares Label, das über `htmlFor`/`id` mit dem Feld verknüpft ist. Placeholder-Text allein ist kein Label-Ersatz (er verschwindet beim Tippen und hat schlechtere Kontraste). Pflichtfelder brauchen `aria-required="true"` oder `required` (beides ist von Browsern und Screen Readern unterstützt). Bei Validierungsfehlern: `aria-invalid="true"` auf dem Feld und `aria-describedby` verweist auf das Fehler-Element.

**Konsistente Navigation:** Die globale Navigation erscheint auf allen Seiten in gleicher Reihenfolge und gleicher Position. Elemente dürfen nicht zwischen Seiten verschwinden oder umsortiert werden, außer auf begründeten Nutzer-Interaktionen.

**Fehlererkennung und -beschreibung:** Wenn ein Formular-Submit fehlschlägt, muss die Fehlermeldung (a) in Text beschrieben sein — nicht nur in roter Farbe, (b) mit `role="alert"` oder `aria-live="assertive"` sofort von Screen Readern angesagt werden, und (c) idealerweise das betroffene Feld benennen.

### Robust

Inhalte müssen von aktuellen und zukünftigen Assistive Technologies interpretierbar sein.

**Semantisches HTML:** Verwende immer das semantisch korrekteste Element: `<button>` für Aktionen (nicht `<div onClick>`), `<a href>` für Navigation, `<nav>` für Navigationsblöcke, `<main>` für den Hauptinhalt, `<header>` für die Kopfzeile, `<footer>` für die Fußzeile, `<section>` mit `aria-labelledby` für benannte Abschnitte. `<h1>` darf nur einmal pro Seite vorkommen und beschreibt den Seiteninhalt. Heading-Hierarchie (h1→h2→h3) muss logisch sein und darf keine Ebenen überspringen.

**ARIA-Regeln:** ARIA ergänzt semantisches HTML — es ersetzt es nicht. Keine ARIA-Rollen auf Elementen, die bereits die richtige native Semantik haben. Wichtige Patterns: `aria-expanded` auf Toggles, `aria-pressed` auf Toggle-Buttons, `aria-haspopup` auf Buttons die Menüs öffnen, `aria-controls` verweist auf das gesteuerte Element.

**`aria-live` für dynamische Inhalte:** Wenn Inhalte sich ohne Seitenreload ändern, brauchen Screen Reader eine Ankündigung. `aria-live="polite"` für nicht-dringende Updates (Punkte-Zähler, Lade-Status), `aria-live="assertive"` oder `role="alert"` für Fehler und wichtige Status-Änderungen. Übermäßiger Einsatz von `assertive` ist zu vermeiden.

---

## Kontrast-Anforderungen

| Texttyp | Mindest-Verhältnis | WCAG-Kriterium |
|---|---|---|
| Normaler Text (unter 18px / unter 14px bold) | 4.5:1 | 1.4.3 (Level AA) |
| Großer Text (18px+ oder 14px+ bold) | 3:1 | 1.4.3 (Level AA) |
| UI-Komponenten (Rahmen, Icons) | 3:1 | 1.4.11 (Level AA) |
| Dark Mode (alle obigen) | gleiche Anforderungen | 1.4.3 / 1.4.11 |
| Dekorativer Text (kein Informationswert) | keine Anforderung | — |
| Logotypen und Markennamen | keine Anforderung | — |

**Häufig problematische Tailwind-Kombinationen im ZOE-Kontext:**

| Klasse (Vordergrund) | Hintergrund | Verhältnis (approx.) | Status |
|---|---|---|---|
| `text-gray-300` | `bg-white` | ~7.1:1 | OK |
| `text-gray-400` | `bg-white` | ~4.6:1 | knapp OK (prüfen) |
| `text-gray-500` | `bg-white` | ~3.0:1 | FAIL (normaler Text) |
| `text-gray-600` | `bg-white` | ~5.9:1 | OK |
| `text-green-600` | `bg-white` | ~4.5:1 | knapp OK (prüfen) |
| `text-green-700` | `bg-white` | ~5.9:1 | OK |
| `text-amber-800` | `bg-amber-100` | ~4.8:1 | OK |
| `text-green-400` | `bg-gray-900` | ~5.1:1 | OK |
| `text-gray-300` | `bg-gray-800` | ~6.4:1 | OK |

**Tool:** https://webaim.org/resources/contrastchecker/

Tipp: Im Tailwind-Kontext den tatsächlichen CSS-Farbwert aus den Browser-DevTools ablesen und in den Contrast Checker eingeben — Tailwind-Klassen-Namen allein sind nicht präzise genug.

---

## Komponenten-Checkliste

Vor jedem Commit prüfe für jeden neuen oder geänderten Component:

```
Semantik & Struktur
□ Semantisch korrektes HTML-Element (button für Aktion, a für Navigation)
□ h1 nur einmal pro Seite; Heading-Hierarchie lückenlos (h1→h2→h3)
□ Hauptinhalt in <main>, Navigation in <nav>, Regionen korrekt benannt

Bilder & Medien
□ Alle <img>: alt-Attribut vorhanden (beschreibend oder alt="" wenn dekorativ)
□ SVG/Icon-Komponenten: aria-hidden="true" wenn dekorativ
□ Icon-Only-Buttons: aria-label vorhanden und beschreibend

Farbe & Kontrast
□ Farbkontrast gemessen: 4.5:1 (normaler Text) / 3:1 (großer Text / UI)
□ Kein Information-Nur-durch-Farbe
□ Dark Mode: Kontraste gleichwertig eingehalten

Tastatur & Fokus
□ Keyboard-navigierbar: Tab, Enter/Space, Escape (bei Modalen)
□ Fokus-Indikator sichtbar: focus-visible:ring-2 focus-visible:ring-green-500
□ Kein Fokus-Verlust nach dynamischen DOM-Änderungen
□ Modale/Dropdowns: Fokus wird gesetzt und zurückgegeben

Formulare
□ label + htmlFor + id korrekt verknüpft (kein Placeholder als Label-Ersatz)
□ required oder aria-required="true" auf Pflichtfeldern
□ aria-invalid="true" bei Validierungsfehlern
□ aria-describedby verweist auf Fehlermeldungs-Element
□ role="alert" auf dynamisch erscheinende Fehlermeldungen

Internationalisierung
□ Kein hardcodierter Text — ausnahmslos t('key') aus react-i18next
□ document.documentElement.lang wird bei Sprachwechsel aktualisiert
□ Alle drei Sprachen (EN/EL/DE) geprüft auf Textlängen-Varianz

Mobile & Touch
□ Touch-Targets mindestens 44×44px (bevorzugt p-3 oder p-2.5 für Icons)
□ Kein horizontales Scrollen auf 375px Viewport
□ inputMode-Attribut auf number/email/tel-Feldern gesetzt

Dynamische Inhalte
□ Automatische Updates: aria-live="polite" vorhanden
□ Fehler und Warnungen: role="alert" oder aria-live="assertive"
□ Ladezustand kommuniziert (aria-busy oder visueller/textueller Hinweis)

Reduzierende Einstellungen
□ prefers-reduced-motion: Transitions mit motion-reduce:-Variante versehen
□ prefers-color-scheme: Dark Mode korrekt implementiert (Tailwind class-Strategie)
```

---

## i18n & Mehrsprachigkeit

**Dynamisches `lang`-Attribut:** Wenn der Nutzer die Sprache wechselt, muss der `<html>`-Tag sofort aktualisiert werden. In `languageStore.setLanguage()`:

```typescript
setLanguage: (lang) => {
  i18n.changeLanguage(lang);
  document.documentElement.lang = lang;  // kritisch für Screen Reader
  localStorage.setItem('zoe-language', lang);
  set({ language: lang });
},
```

**Griechischer Zeichensatz:** Die Inter-Schriftart (Standard-Tailwind-Stack) unterstützt das griechische Alphabet. Im Produktivbetrieb sollte `font-family` explizit auch `'Noto Sans'` als Fallback enthalten, da Inter's griechische Abdeckung begrenzt ist. Im aktuellen Prototyp-Stadium (Browser-Standardschrift) akzeptabel.

**Textlängen-Varianz EN → EL:** Griechischer Text ist im Durchschnitt ca. 25–30% länger als Englisch. Alle UI-Elemente mit fester Breite (Buttons, Badges, Tabellenspalten) müssen ausreichend Platz für die längste Übersetzung haben oder `truncate` / `overflow-wrap: break-word` nutzen. Tailwind `min-w-0` in Flex-Containern verhindert Überlauf.

**Zahlen und Datumsformate:** Verwende `Intl.NumberFormat` und `Intl.DateTimeFormat` statt manueller Formatierung, damit Zahlen und Daten sprachkorrekt ausgegeben werden:

```typescript
// Zahlen lokalisieren
const formatNumber = (n: number, lang: string) =>
  new Intl.NumberFormat(lang).format(n);
// Beispiel: 1234.5 → "1,234.5" (EN), "1.234,5" (DE), "1.234,5" (EL)

// Datum lokalisieren
const formatDate = (date: Date, lang: string) =>
  new Intl.DateTimeFormat(lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
// Beispiel (EL): "25 Μαΐου 2026"
```

**Übersetzungs-Vollständigkeit:** Vor jeder Präsentation sicherstellen, dass alle drei Locale-Dateien (`src/locales/en/`, `el/`, `de/`) dieselben Keys enthalten. Fehlende Keys fallen auf den Fallback `en` zurück — das ist für Screen-Reader-Nutzer in EL/DE kritisch.

---

## Mobile Anforderungen

**Touch-Target-Größen:** WCAG 2.5.8 (Level AA in WCAG 2.2) fordert mindestens 24×24px für Touch-Targets. Best Practice und WCAG 2.5.5 (Level AAA) fordern 44×44px. Alle interaktiven Elemente der ZOE Platform sollen 44×44px anstreben. Tailwind-Richtwert: `p-2.5` (10px Padding) + Icon 22px = 42px, `p-3` (12px) + Icon 20px = 44px. Im Zweifel `min-h-[44px] min-w-[44px]` direkt setzen.

**Kein horizontales Scrollen:** Auf 375px Viewport-Breite darf kein horizontales Scrollen auftreten. Gefährliche Patterns: feste Breiten (`w-[500px]`), lange Wörter ohne `overflow-wrap`, Tabellen ohne responsive Behandlung. Alle Grids mit `grid-cols-1` als Mobile-Base starten (wie aktuell implementiert).

**`inputMode`-Attribute:** Auf Touch-Geräten zeigt `inputMode` die passende virtuelle Tastatur:

```html
<input type="text" inputMode="email" />   <!-- E-Mail-Tastatur -->
<input type="text" inputMode="numeric" /> <!-- Zahlen-Tastatur -->
<input type="text" inputMode="tel" />     <!-- Telefon-Tastatur -->
```

**Hamburger-Menü:** Das Mobile-Menü in `Header.tsx` ist korrekt mit `aria-expanded`, `aria-controls` und `aria-label` implementiert. Wenn das Menü geöffnet ist, sollte Fokus ins Menü gesetzt werden (aktuell nicht implementiert — `useEffect` mit `menuOpen`-Abhängigkeit und `ref.current.focus()` auf erstem Nav-Link).

---

## Performance-Ziele (Core Web Vitals)

Performance und Accessibility sind verbunden: langsame Seiten sind für Nutzer mit Assistive Technologies, langsamen Verbindungen (ländliches Korfu) und älteren Geräten besonders belastend.

| Metrik | Ziel | Bedeutung |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | Haupt-Inhalt ist schnell sichtbar |
| INP (Interaction to Next Paint) | < 200ms | Interaktionen fühlen sich sofort an |
| CLS (Cumulative Layout Shift) | < 0.1 | Keine sprungenden Layouts |
| FCP (First Contentful Paint) | < 1.8s | Erster Inhalt erscheint schnell |
| TTFB (Time to First Byte) | < 800ms | Server antwortet prompt |

Messung: Chrome DevTools Lighthouse-Tab, PageSpeed Insights (https://pagespeed.web.dev/). Für den Prototyp auf lokalem Dev-Server gelten diese Werte als Zielwerte für den Produktivbetrieb; `npm run build` + lokales Preview (`npm run preview`) für realistischere Messungen.

---

## Forms — Best Practices

Formulare sind für Barrierefreiheit die kritischste UI-Kategorie. Jedes Formular in der ZOE Platform muss folgendem Muster folgen:

**Vollständiges Formular-Feld-Muster:**

```tsx
function FormField({
  id,
  label,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>
      {React.cloneElement(children as React.ReactElement, {
        id,
        'aria-required': required,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error ? errorId : undefined,
      })}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1 text-xs text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}
```

**Dynamische Fehlermeldungen:** Fehlermeldungen die nach Submit erscheinen müssen `role="alert"` tragen. React rendert sie erst nach dem Submit, was bedeutet dass assistive Technologies die Änderung automatisch ankündigen — dies funktioniert nur, wenn die `role="alert"`-Element bereits im DOM vorhanden ist (leer) bevor der Fehler-Text hineingeschrieben wird, oder wenn es mit dem Fehler-Text neu eingebunden wird. Das aktuelle Pattern (conditional render mit `{error && <div role="alert">}`) funktioniert korrekt in modernen Screen Readern.

**`noValidate` auf Forms:** Forms mit eigener Validierungslogik erhalten `noValidate`, um Browser-native Validierungs-Popups zu unterdrücken. Eigene Fehlermeldungen sind zugänglicher da sie per `role="alert"` angekündigt werden und Gestaltungskontrolle erlauben.

---

## Semantisches HTML — Pflicht-Elemente

| Element | Verwendung | Anmerkung |
|---|---|---|
| `<header>` | Seiten-Kopfzeile mit Logo und Navigation | Nur einmal; entspricht `role="banner"` |
| `<nav aria-label="...">` | Navigationsblöcke | `aria-label` differenziert zwischen mehreren `<nav>` (Desktop/Mobile/Footer) |
| `<main id="main-content">` | Haupt-Seiteninhalt | Sprungziel des Skip-Links; entspricht `role="main"` |
| `<footer>` | Seiten-Fußzeile | Entspricht `role="contentinfo"` |
| `<h1>` | Seitentitel | Genau einmal pro Seite; beschreibt den aktuellen Inhalt |
| `<h2>` | Abschnittsüberschriften | Nur als echte inhaltliche Strukturierung, nicht als Style-Element |
| `<section aria-labelledby="id">` | Benannter Inhaltsabschnitt | `aria-labelledby` verweist auf die `<h2>` des Abschnitts |
| `<article>` | Eigenständige Inhaltseinheit | Für Projekt-Cards, Event-Einträge |
| `<form>` | Formulare | Mit `noValidate` wenn eigene Validierung |
| `<button type="button">` | Aktionen die kein Submit auslösen | Verhindert ungewollten Form-Submit |
| `<ul>` / `<ol>` | Listen von Links oder Elementen | Im Footer für Link-Listen; Screen Reader kündigt Anzahl der Einträge an |

**`<h1>` nur einmal:** Jede Seite hat genau eine `<h1>`, die den primären Seiteninhalt beschreibt. Die `<h1>` ist nicht der Markenname ("ZOE Platform") — der ist im `<header>` als Logo-Link. Die `<h1>` ist der Seiteninhalt ("Projects", "Login", "Admin Dashboard" etc.).

---

## Testing-Workflow

### Automatisiert

**axe-core mit Vitest** prüft einzelne Komponenten auf bekannte WCAG-Verstöße automatisch. Pattern:

```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('LoginPage has no accessibility violations', async () => {
  const { container } = render(<LoginPage />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

Paket: `npm install -D jest-axe @types/jest-axe`. Axe erkennt ca. 30–40% aller WCAG-Verstöße automatisch. Manuelle Tests sind unverzichtbar.

**Playwright E2E mit Accessibility-Checks:**

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('has no accessibility violations on home page', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
```

### Manuell (vor Demo)

Folgende manuelle Tests sind vor der Präsentation am 15. Juni 2026 durchzuführen:

- [ ] Vollständige Tastatur-Navigation durch alle öffentlichen Seiten (ohne Maus)
- [ ] Fokus-Sichtbarkeit auf allen interaktiven Elementen in Light und Dark Mode
- [ ] Login- und Registrierungs-Formular mit Screen Reader (VoiceOver oder NVDA)
- [ ] Sprachenwechsel EN → EL → DE: Seiteninhalt und `lang`-Attribut korrekt
- [ ] Browser-Zoom 200%: kein horizontales Scrollen, keine abgeschnittenen Inhalte
- [ ] Mobile 375px: alle Touch-Targets erreichbar, Hamburger-Menü funktional
- [ ] Dark Mode: Kontrast-Check mit DevTools Color Picker auf kritischen Elementen
- [ ] Prototype-Banner auf allen Seiten sichtbar

### Online-Tools

- **WAVE Web Accessibility Evaluation Tool:** https://wave.webaim.org/ — analysiert eine live-URL oder Browser-Extension für lokale Entwicklung
- **Lighthouse (Chrome DevTools):** DevTools → Lighthouse → Categories: Accessibility → Generate report. Zielwert: 90+.
- **Kontrast-Checker:** https://webaim.org/resources/contrastchecker/ — manuelle Farbpaar-Prüfung
- **axe DevTools Browser-Extension:** https://www.deque.com/axe/devtools/ — kostenlose Extension für Chrome/Firefox
- **Screen Reader:** VoiceOver (macOS: Cmd+F5; iOS: Einstellungen → Bedienungshilfen), NVDA (Windows, kostenlos: https://www.nvaccess.org/)

---

## ZOE-Spezifische Patterns

**PrototypeBanner:** Der PrototypeBanner erscheint auf jeder Seite via `Layout.tsx`. Er sollte `role="status"` tragen, damit er von Screen Readern korrekt als Status-Information und nicht als Fehlermeldung klassifiziert wird. Der Bannertext muss über i18n übersetzt werden, da griechische Nutzer ihn in ihrer Sprache lesen sollten. Aktuell hardcodiert — siehe Accessibility Audit.

**Mehrsprachige Formularfelder im Admin (NewProjectPage):** Die Formularfelder für EN/EL/DE-Titel und -Beschreibungen brauchen klare Labels die angeben, welche Sprache eingegeben wird. Das Pattern `<label>English *</label>` ist funktional, aber nicht i18n-fähig. Besser: `<label>{t('admin.languageEn')} *</label>` kombiniert mit `<input id="title-en" lang="en" />` — das `lang`-Attribut auf dem Input informiert Screen Reader in welcher Sprache die Eingabe erwartet wird.

**Gamification-Punkte als `aria-live`:** Die Punkte-Anzeige im Header (`{user.points}`) aktualisiert sich nach Aktionen. Um Screen-Reader-Nutzer über Punkte-Gewinne zu informieren:

```tsx
<span
  aria-live="polite"
  aria-label={t('header.pointsLabel', { points: user.points })}
  className="flex items-center gap-1 text-sm font-semibold text-amber-600 dark:text-amber-400"
>
  <Star size={14} aria-hidden="true" />
  {user.points}
</span>
```

**SDG-Badges mit `aria-label`:** SDG-Badges die nur eine Zahl anzeigen (z.B. "13") brauchen ein beschreibendes `aria-label` statt der bloßen Zahl. Da die SDG-Namen übersetzt werden können:

```tsx
<span
  aria-label={t(`sdg.goal${n}.name`)}  // z.B. "SDG 13: Climate Action"
  className="..."
>
  {n}
</span>
```

Für interaktive SDG-Toggle-Buttons (wie in `NewProjectPage`) ist das aktuelle `aria-label="SDG N"` ausreichend — eine Erweiterung auf den vollen SDG-Namen wäre eine sinnvolle Verbesserung.

**Bewertungs- und Feedback-Formulare:** Wenn zukünftige Iterationen Sterne-Bewertungen oder Slider-Komponenten einführen, gelten spezifische ARIA-Patterns:
- Sterne-Bewertung: `role="radiogroup"` mit einzelnen `role="radio"`-Elementen
- Slider: `role="slider"` mit `aria-valuenow`, `aria-valuemin`, `aria-valuemax`

---

## Letzte Überprüfung

**Datum:** 25. Mai 2026
**Geprüft:** Vollständiger Codebase-Audit (Header, Footer, Layout, LoginPage, RegisterPage, ParticipationPage, NewProjectPage, index.html, index.css, languageStore, i18n-Konfiguration)
**Nächste Überprüfung:** Vor Präsentation 15. Juni 2026
**Offene Issues:** Siehe `docs/accessibility-audit.md` — 11 identifizierte Probleme, davon 2 kritisch (WCAG Fail)

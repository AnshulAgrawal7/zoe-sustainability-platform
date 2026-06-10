# Iterations-Skizze (Phase-3-Visual) — Konzept + Bild-Prompt

> Zweck: zeigen, wie die ZOE-Plattform iterativ entstand
> (**Skizze → Mockup → fertige Plattform**). Dieses Dokument liefert (a) die
> inhaltliche Beschreibung der drei Stufen und (b) **einen** fertigen Prompt für
> eine Bildgenerierungs-KI. Es werden hier **keine Bilder erzeugt**.
> Referenz-Screenshots im Repo: `docs/slides/mockups/*` und `docs/slides/mobile/*`.

## (a) Die drei Stufen (bezogen auf unsere echten Screens)

1. **Wireframe-Skizze (Lo-Fi, handgezeichnet).** Grobe Anordnung der Projekt-
   Übersicht: Kopfzeile mit Logo + Sprachumschalter, Filterleiste, ein Raster aus
   Projektkarten (Platzhalter-Rechtecke), eine Reihe quadratischer SDG-Kacheln.
   Nur Graustufen/Bleistift, Kästchen + Kritzeltext — Fokus auf Struktur und
   Informationsarchitektur, nicht auf Farbe.

2. **Mid-Fi-Mockup (graustufig + erste grüne Akzente).** Dieselbe Struktur, jetzt
   sauber gerastert: erkennbare Projektkarten mit Titel, Kategorie-Badge und
   Punkte-Indikator, eine Zeile SDG-Kacheln, klare Buttons. Dezente grüne
   Primärfarbe als Akzent, ansonsten neutrale Flächen — Layout und Hierarchie
   stehen, Inhalte noch generisch.

3. **High-Fi (fertige Plattform).** Der reale Zustand: grünes Theme, Projektliste
   mit echten ZOE-Aktionen (Mobilität, Kreislaufwirtschaft, Meeresschutz,
   Naturdenkmäler …), Kategorie-Filter, **offizielle UN-SDG-Icons** als
   anklickbare Kacheln, dreisprachige UI. Entspricht den Screenshots unter
   `docs/slides/mockups/` (Desktop/Tablet) und `docs/slides/mobile/` (375px).

## (b) Bild-Prompt für eine Bildgenerierungs-KI

> Nutzbar auf Deutsch oder Englisch. Erzeugt **ein** Bild mit drei nebeneinander
> liegenden Panels (Sketch → Mockup → High-Fi). Enthält **keine** Marken-,
> Logo- oder geschützten Icon-Darstellungen (die echten UN-Icons werden NICHT
> nachgebildet — nur generische bunte Quadrate als Platzhalter).

```
A clean three-panel "evolution of a web app" illustration, left to right,
equal-width panels with thin labels above each ("1 Sketch", "2 Mockup",
"3 Final"):

Panel 1 — low-fidelity hand-drawn wireframe on white paper: pencil-style
boxes for a header bar, a filter row, a 2x3 grid of empty project cards, and
a row of small squares representing goal icons; greyscale, sketchy lines,
squiggle placeholder text, no colour.

Panel 2 — mid-fidelity greyscale mockup with subtle green accents: the same
layout now crisp and aligned; project cards show a title line, a small
category tag and a points dot; one row of plain coloured squares as goal-icon
placeholders; clean buttons; mostly neutral greys with a green primary accent.

Panel 3 — high-fidelity finished product, light green and teal theme:
a sustainability project list for a small Mediterranean island municipality,
with realistic project cards (cover image, title, category label, points),
a category filter bar, and a row of generic colourful rounded square tiles as
sustainability-goal icons; modern, friendly, accessible UI; mobile-first feel.

Style: flat, modern UI illustration, soft shadows, high contrast, no real
brand logos, no copyrighted icons, no text that must be readable. 16:9,
high resolution.
```

> Hinweis: Die generierten „goal icons" sind bewusst **generische** bunte
> Quadrate (kein Nachbau der offiziellen UN-Icons), um Marken-/IP-Rechte nicht zu
> verletzen. Für die echte High-Fi-Stufe in der Präsentation eigene Screenshots
> (`docs/slides/mockups/*`) verwenden — diese zeigen die offiziellen UN-Icons
> lizenzkonform (siehe `public/sdg-icons/README.md`).

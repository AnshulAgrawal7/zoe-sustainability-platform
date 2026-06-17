# Barrierefreiheitserklärung — Vorlage (formal)

> ⚠️ **Keine Rechtsberatung.** Vorlage für die **formale** Erklärung nach
> **EU-Richtlinie 2016/2102** / **EN 301 549** (Future_Work 9.7, 10.3). Die im
> Repo vorhandene A11y-Seite ist *informativ*; öffentliche Stellen brauchen
> zusätzlich diese formale Erklärung mit Konformitätsstatus, Feedback-Mechanismus
> und Verweis auf das Durchsetzungsverfahren. **Platzhalter `[…]` ersetzen** und
> Status erst nach einem **externen Audit** final festlegen.

## 1. Geltungsbereich
Diese Erklärung gilt für die Website **[Domain]** der **Gemeinde Nord-Korfu**.

## 2. Konformitätsstatus
Die Website ist **[vollständig / teilweise / nicht]** konform mit
**WCAG 2.1 Level AA** bzw. **EN 301 549**.
> Status erst nach externem Audit (Future_Work 10.1) verbindlich setzen.

## 3. Nicht barrierefreie Inhalte
[Liste bekannter Einschränkungen — je Punkt: betroffener Inhalt, verletztes
Kriterium, Grund (technisch/unverhältnismäßige Belastung/außerhalb Geltungsbereich),
geplante Behebung.]
- Beispiel: Leaflet-Karten — Pins sind für Screenreader nicht erreichbar;
  **Maßnahme bereits umgesetzt:** tastatur-/SR-taugliche Marker-Liste als
  Textäquivalent (WCAG 1.1.1).
- Beispiel: maschinell übersetzte Feed-Texte (DeepL) — redaktionelles Review
  läuft (`needsReview`-Flag).

## 4. Erstellung dieser Erklärung
Erstellt am **[Datum]**. Methode: **[Selbstbewertung / externe Prüfung durch …]**.
Letzte Überprüfung: **[Datum]**.

## 5. Feedback-Mechanismus
Barrieren melden an: **[E-Mail / Kontaktformular der Gemeinde]**.
Wir antworten innerhalb von **[Frist, z. B. 2 Wochen]**.

## 6. Durchsetzungsverfahren
Wird auf eine Meldung nicht zufriedenstellend reagiert, kann **[zuständige
Durchsetzungs-/Schlichtungsstelle in Griechenland]** kontaktiert werden:
[Adresse / Kontakt].

## 7. Technische Grundlagen (Ist-Stand im Prototyp)
Bereits umgesetzt (siehe `docs/accessibility-guidelines.md`): semantisches HTML,
Tastaturbedienbarkeit + sichtbarer Fokus, Skip-Link, `prefers-reduced-motion`,
Dark-Mode-Kontraste, trilinguale Aria-Labels, jest-axe-Tests für Schlüsselseiten.

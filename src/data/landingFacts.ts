// PROTOTYPE DATA — documented, sourced programme figures for the landing stats
// strip. These are REAL municipal programme numbers (see each `source`). They are
// stored as raw numbers and formatted per active locale via Intl in the
// component (see utils/format.ts) — never pre-formatted per language, so the
// thousands/decimal separators always follow the active locale.
export interface LandingFact {
  key: string;
  value: number;
  /** Appended after the formatted number (e.g. "t"). */
  unit?: string;
  /** Decimal places for Intl.NumberFormat (default 0). */
  fractionDigits?: number;
  labelKey: string;
  sourceKey: string;
}

export const LANDING_FACTS: LandingFact[] = [
  {
    key: 'led',
    value: 4866,
    labelKey: 'landing.facts.led.label',
    sourceKey: 'landing.facts.led.source',
  },
  {
    key: 'waste',
    value: 2682.699,
    unit: 't',
    fractionDigits: 3,
    labelKey: 'landing.facts.waste.label',
    sourceKey: 'landing.facts.waste.source',
  },
  {
    key: 'scope',
    value: 8,
    labelKey: 'landing.facts.scope.label',
    sourceKey: 'landing.facts.scope.source',
  },
];

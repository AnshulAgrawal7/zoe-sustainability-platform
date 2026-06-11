// PROTOTYPE DATA — the three illustrative headline figures for the landing
// stats banner (B2). These are DELIBERATELY FICTIONAL demonstration values (see
// the banner microcopy), not measured impact. Numbers are stored raw and
// formatted per active locale via Intl in the component (utils/format.ts), so
// the thousands separator follows the language (DE/EL "2.389", EN "2,389").
export interface LandingFact {
  key: string;
  value: number;
  /** Descriptive label shown under the number. */
  labelKey: string;
}

export const LANDING_FACTS: LandingFact[] = [
  {
    key: 'volunteers',
    value: 640,
    labelKey: 'landing.facts.volunteers.label',
  },
  {
    key: 'trees',
    value: 2389,
    labelKey: 'landing.facts.trees.label',
  },
  {
    key: 'turtles',
    value: 127,
    labelKey: 'landing.facts.turtles.label',
  },
];

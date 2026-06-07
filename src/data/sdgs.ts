// PROTOTYPE DATA — UN Sustainable Development Goals catalog (all 17).
// Source: UN SDGs (https://sdgs.un.org/goals) — official goal colors + per-goal UN page.
// Titles and the "how ZOE contributes" texts are translated (see locales: sdgCatalog.*);
// the mapping of local actions to SDGs is illustrative.

import type { SDG, SDGNumber, SDGProgress } from '../types';

const SDG_COLORS: Record<SDGNumber, string> = {
  1: '#E5243B',
  2: '#DDA63A',
  3: '#4C9F38',
  4: '#C5192D',
  5: '#FF3A21',
  6: '#26BDE2',
  7: '#FCC30B',
  8: '#A21942',
  9: '#FD6925',
  10: '#DD1367',
  11: '#FD9D24',
  12: '#BF8B2E',
  13: '#3F7E44',
  14: '#0A97D9',
  15: '#56C02B',
  16: '#00689D',
  17: '#19486A',
};

// All 17 goals. `unUrl` links to the official UN page for that goal.
export const sdgs: SDG[] = (
  Object.keys(SDG_COLORS).map(Number) as SDGNumber[]
).map((number) => ({
  number,
  color: SDG_COLORS[number],
  unUrl: `https://sdgs.un.org/goals/goal${number}`,
}));

export const getSdgByNumber = (num: number): SDG | undefined =>
  sdgs.find((s) => s.number === num);

// PROTOTYPE DATA — fictional progress percentages for the goals ZOE addresses.
export const sdgProgressData: SDGProgress[] = [
  { sdg: 3, projectCount: 2, progressPercent: 45 },
  { sdg: 4, projectCount: 3, progressPercent: 62 },
  { sdg: 6, projectCount: 2, progressPercent: 38 },
  { sdg: 8, projectCount: 2, progressPercent: 41 },
  { sdg: 11, projectCount: 4, progressPercent: 55 },
  { sdg: 12, projectCount: 3, progressPercent: 71 },
  { sdg: 13, projectCount: 5, progressPercent: 48 },
  { sdg: 14, projectCount: 3, progressPercent: 34 },
  { sdg: 15, projectCount: 4, progressPercent: 59 },
  { sdg: 17, projectCount: 6, progressPercent: 80 },
];

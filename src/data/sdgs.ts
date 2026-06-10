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

// Official SDGs addressed by the ZOE programme of the Municipality of North Corfu.
// Source/provenance: Verde.tec environmental award, Feb 2026 (life-news.gr, 03.03.2026).
export const OFFICIAL_PROGRAMME_SDGS: SDGNumber[] = [
  4, 6, 11, 12, 13, 14, 15, 17,
];

// All 17 goals. `unUrl` links to the official UN page; `iconUrl` is the official
// UN icon (downloaded unmodified to public/sdg-icons/, see that folder's README).
export const sdgs: SDG[] = (
  Object.keys(SDG_COLORS).map(Number) as SDGNumber[]
).map((number) => ({
  number,
  color: SDG_COLORS[number],
  unUrl: `https://sdgs.un.org/goals/goal${number}`,
  iconUrl: `/sdg-icons/E-WEB-Goal-${String(number).padStart(2, '0')}.png`,
}));

export const getSdgByNumber = (num: number): SDG | undefined =>
  sdgs.find((s) => s.number === num);

// Programme-level progress for the official ZOE SDGs (the 8 above). `projectCount`
// reflects the seeded ZOE projects mapped to each goal; `progressPercent` is an
// ILLUSTRATIVE prototype indicator, not a measured value (impact = Phase 5).
export const sdgProgressData: SDGProgress[] = [
  { sdg: 4, projectCount: 2, progressPercent: 55 },
  { sdg: 6, projectCount: 2, progressPercent: 50 },
  { sdg: 11, projectCount: 3, progressPercent: 45 },
  { sdg: 12, projectCount: 2, progressPercent: 60 },
  { sdg: 13, projectCount: 3, progressPercent: 50 },
  { sdg: 14, projectCount: 2, progressPercent: 45 },
  { sdg: 15, projectCount: 3, progressPercent: 55 },
  { sdg: 17, projectCount: 1, progressPercent: 50 },
];

// PROTOTYPE DATA — Sustainable Development Goals relevant to ZOE program
// Source: UN SDGs (https://sdgs.un.org/goals) — mapping to local actions is illustrative

import type { SDG, SDGProgress } from '../types';

export const sdgs: SDG[] = [
  {
    number: 3,
    title: 'Good Health & Well-Being',
    color: '#4C9F38',
    description: 'Healthy ecosystems and clean environments contribute to community well-being.',
  },
  {
    number: 4,
    title: 'Quality Education',
    color: '#C5192D',
    description: 'Environmental education programs build long-term sustainability literacy.',
  },
  {
    number: 6,
    title: 'Clean Water & Sanitation',
    color: '#26BDE2',
    description: 'Protecting water sources and coastal zones ensures clean water for all.',
  },
  {
    number: 11,
    title: 'Sustainable Cities & Communities',
    color: '#FD9D24',
    description: 'Green urban planning and community engagement foster sustainable local governance.',
  },
  {
    number: 12,
    title: 'Responsible Consumption & Production',
    color: '#BF8B2E',
    description: 'Circular economy and waste reduction actions promote sustainable patterns.',
  },
  {
    number: 13,
    title: 'Climate Action',
    color: '#3F7E44',
    description: 'Local climate mitigation and adaptation measures address the climate crisis.',
  },
  {
    number: 14,
    title: 'Life Below Water',
    color: '#0A97D9',
    description: "Protecting coastal and marine ecosystems is central to Corfu's environment.",
  },
  {
    number: 15,
    title: 'Life on Land',
    color: '#56C02B',
    description: 'Biodiversity conservation and reforestation protect terrestrial ecosystems.',
  },
  {
    number: 17,
    title: 'Partnerships for the Goals',
    color: '#19486A',
    description: 'Multi-stakeholder collaboration is essential to achieving all other goals.',
  },
];

// PROTOTYPE DATA — fictional progress percentages for demonstration
export const sdgProgressData: SDGProgress[] = [
  { sdg: 3, projectCount: 2, progressPercent: 45 },
  { sdg: 4, projectCount: 3, progressPercent: 62 },
  { sdg: 6, projectCount: 2, progressPercent: 38 },
  { sdg: 11, projectCount: 4, progressPercent: 55 },
  { sdg: 12, projectCount: 3, progressPercent: 71 },
  { sdg: 13, projectCount: 5, progressPercent: 48 },
  { sdg: 14, projectCount: 3, progressPercent: 34 },
  { sdg: 15, projectCount: 4, progressPercent: 59 },
  { sdg: 17, projectCount: 6, progressPercent: 80 },
];

export const getSdgByNumber = (num: number): SDG | undefined =>
  sdgs.find((s) => s.number === num);

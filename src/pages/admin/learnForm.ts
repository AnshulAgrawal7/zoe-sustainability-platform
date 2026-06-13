// Shared admin learning-resource form types/defaults (kept out of the component
// so fast refresh keeps working — see react-refresh/only-export-components).

export const LEARN_CATEGORIES = [
  'MOBILITY',
  'WASTE_CIRCULAR',
  'MARINE_PROTECTION',
  'NATURAL_MONUMENTS',
  'ENERGY',
  'EDUCATION_PARTICIPATION',
] as const;

export const ALL_SDGS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
];

// `type` (not interface) so it stays assignable to AutoTranslatePanel's
// `Record<string, unknown>` prop.
export type LearnFormState = {
  titleEn: string;
  titleEl: string;
  titleDe: string;
  bodyEn: string;
  bodyEl: string;
  bodyDe: string;
  category: (typeof LEARN_CATEGORIES)[number];
  imageUrl: string;
  sourceNote: string;
  projectId: string;
};

export const emptyLearnForm: LearnFormState = {
  titleEn: '',
  titleEl: '',
  titleDe: '',
  bodyEn: '',
  bodyEl: '',
  bodyDe: '',
  category: 'MOBILITY',
  imageUrl: '',
  sourceNote: '',
  projectId: '',
};

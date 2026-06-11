// Shared admin event-form types/defaults (kept out of the component file so fast
// refresh keeps working — see react-refresh/only-export-components).

export const EVENT_CATEGORIES = [
  'ENVIRONMENT',
  'MOBILITY',
  'COMMUNITY',
  'EDUCATION',
  'CULTURE',
] as const;

// `type` (not `interface`) so the form object stays assignable to the
// `Record<string, unknown>` prop of AutoTranslatePanel — interfaces have no
// implicit index signature, which previously broke `tsc --noEmit`.
export type EventFormState = {
  titleEn: string;
  titleEl: string;
  titleDe: string;
  descriptionEn: string;
  descriptionEl: string;
  descriptionDe: string;
  date: string; // value of <input type="datetime-local">
  location: string;
  category: (typeof EVENT_CATEGORIES)[number];
  rewardPoints: number | string;
  capacity: number | string;
  imageUrl: string;
  projectId: string;
};

export const emptyEventForm: EventFormState = {
  titleEn: '',
  titleEl: '',
  titleDe: '',
  descriptionEn: '',
  descriptionEl: '',
  descriptionDe: '',
  date: '',
  location: '',
  category: 'ENVIRONMENT',
  rewardPoints: 20,
  capacity: '',
  imageUrl: '',
  projectId: '',
};

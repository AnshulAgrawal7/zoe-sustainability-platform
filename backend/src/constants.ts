// Shared domain constants. Categories are stored as plain strings (no Prisma
// enum/table) and validated at the application layer; keep this the SINGLE source
// of truth so Project and Idea share one list instead of duplicating it.

export const PROJECT_CATEGORIES = [
  'ENVIRONMENT',
  'MOBILITY',
  'COMMUNITY',
  'EDUCATION',
  'CULTURE',
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

// Lifecycle of a citizen-submitted idea (goal Z3), reviewed by admins.
export const IDEA_STATUSES = [
  'NEW',
  'IN_REVIEW',
  'ACCEPTED',
  'DECLINED',
] as const;

export type IdeaStatus = (typeof IDEA_STATUSES)[number];

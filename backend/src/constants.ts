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

// Moderation state of a comment on an approved idea (Z3 discourse).
export const COMMENT_STATUSES = ['VISIBLE', 'HIDDEN'] as const;

export type CommentStatus = (typeof COMMENT_STATUSES)[number];

// Citizen submissions from /participate that are NOT ideas: environmental issue
// reports and general feedback. Stored for the admin overview (no workflow yet).
export const SUBMISSION_TYPES = ['REPORT', 'FEEDBACK'] as const;

export type SubmissionType = (typeof SUBMISSION_TYPES)[number];

// Handling workflow for a citizen report/feedback so the submitter gets feedback.
export const SUBMISSION_STATUSES = [
  'NEW',
  'IN_REVIEW',
  'RESOLVED',
  'DECLINED',
] as const;

export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

// Event lifecycle: points are awarded when an admin completes the event.
export const EVENT_STATUSES = ['UPCOMING', 'COMPLETED'] as const;

export type EventStatusValue = (typeof EVENT_STATUSES)[number];

// Self-selected audience profiles (User.profile) — also the reward-track roles
// of the ZOE levels (RewardTierRole.role).
export const USER_PROFILES = [
  'RESIDENT',
  'VISITOR',
  'STUDENT',
  'VOLUNTEER',
] as const;

export type UserProfileValue = (typeof USER_PROFILES)[number];

// Public username rules: 3–20 chars, lowercase letters/digits/underscore. Shown
// in all community contexts instead of the real name (privacy / pseudonymity).
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;
export const USERNAME_REGEX = /^[a-z0-9_]+$/;

// Source language of a citizen event proposal + its review lifecycle.
export const APP_LANGUAGES = ['EN', 'EL', 'DE'] as const;
export type AppLanguageValue = (typeof APP_LANGUAGES)[number];

export const EVENT_PROPOSAL_STATUSES = ['NEW', 'CONVERTED', 'DECLINED'] as const;
export type EventProposalStatus = (typeof EVENT_PROPOSAL_STATUSES)[number];

// User-facing notification kinds (citizen bell): a comment mention, or an admin
// status change on something the user submitted (idea / event proposal / report).
export const NOTIFICATION_TYPES = [
  'MENTION',
  'IDEA_STATUS',
  'PROPOSAL_STATUS',
  'SUBMISSION_STATUS',
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

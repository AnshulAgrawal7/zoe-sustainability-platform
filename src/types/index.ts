// Core domain types for the ZOE platform prototype

// Finer-grained categories retained for EVENTS only. Projects use the canonical
// 6-value `ApiProjectCategory` (single source of truth across all project screens).
export type ProjectCategory =
  | 'Biodiversity'
  | 'Circular Economy'
  | 'Waste Reduction'
  | 'Education'
  | 'Water Protection'
  | 'Sustainable Tourism'
  | 'Community Action';

export type ProjectStatus = 'Planning' | 'Active' | 'Completed' | 'Paused';

export type SDGNumber =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17;

// Title and "how ZOE contributes" text are translated (i18n: sdgCatalog.*).
export interface SDG {
  number: SDGNumber;
  color: string; // official UN goal color
  unUrl: string; // official UN goal page
  iconUrl: string; // official UN goal icon (public/sdg-icons/, used unmodified)
}

export interface Project {
  id: string;
  title: string;
  category: ApiProjectCategory; // canonical 6-value taxonomy (consistent with /projects API)
  status: ProjectStatus;
  location: string;
  lat?: number;
  lng?: number;
  description: string;
  problem: string;
  expectedImpact: string;
  sdgs: SDGNumber[];
  progressPercent: number;
  startDate: string;
  endDate: string;
  citizenInvolvement: string[];
  transparencyMetrics: TransparencyMetric[];
  participantCount: number;
  thumbnailColor: string; // Tailwind color class for placeholder
  sourceNote?: string; // provenance, e.g. "Verde.tec 2026 / life-news.gr"
}

export interface TransparencyMetric {
  label: string;
  value: string;
  unit: string;
}

// Event as served by the backend (trilingual, like ApiProject). `date` is an ISO
// string; `registeredCount` is derived from EventRegistration; `project` is the
// optional parent initiative.
export interface ApiEventProjectRef {
  id: string;
  titleEn: string;
  titleEl: string;
  titleDe: string;
  category: ApiProjectCategory;
}

// Lifecycle: points are awarded when an admin marks the event COMPLETED.
export type ApiEventStatus = 'UPCOMING' | 'COMPLETED';

export interface ApiEvent {
  id: string;
  titleEn: string;
  titleEl: string;
  titleDe: string;
  descriptionEn: string;
  descriptionEl: string;
  descriptionDe: string;
  date: string;
  location: string | null;
  lat: number | null;
  lng: number | null;
  category: ApiProjectCategory;
  status: ApiEventStatus;
  rewardPoints: number;
  capacity: number | null;
  imageUrl: string | null;
  projectId: string | null;
  project?: ApiEventProjectRef | null;
  registeredCount?: number;
  /** True when the requesting (logged-in) user is registered for this event. */
  registeredByMe?: boolean;
  createdAt: string;
}

// One of the logged-in user's event registrations (dashboard "my events").
// `event` is null if the event row was deleted (soft reference).
export interface MyEventRegistration {
  id: string;
  eventId: string;
  createdAt: string;
  /** Points actually credited (0 until the event is completed). */
  pointsAwarded: number;
  /** Points still pending until the admin completes the event (else 0). */
  pointsPending: number;
  event: ApiEvent | null;
}

// Text (label/unit/description) is translated — see i18n: impactMetrics.<id>.*
export interface ImpactMetric {
  id: string;
  value: string | number;
  icon: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface SDGProgress {
  sdg: SDGNumber;
  projectCount: number;
  progressPercent: number;
}

// Text (title/description/actionLabel) is translated — see i18n: participationOpts.<id>.*
export interface ParticipationOption {
  id: string;
  icon: string;
}

// Text (name/description/rewards) is translated — see i18n: rewardData.tiers.<id>.*
// greekName is the canonical Greek tier name and is shown in every language.
export interface RewardTier {
  id: string;
  greekName: string;
  pointsMin: number;
  pointsMax: number | null;
  icon: string;
  colorClasses: string;
}

// Text (label) is translated — see i18n: rewardData.activities.<id>
export interface RewardActivity {
  id: string;
  points: number;
  /** Upper bound when the activity awards a range (e.g. events grant 20–30). */
  pointsMax?: number;
  icon: string;
  category: string;
}

// Text (label/reward) is translated — see i18n: rewardData.milestones.<id>.*
export interface CommunityMilestone {
  id: string;
  /** Collective threshold/condition to reach (e.g. 1000 participants). */
  target: number;
  /** Demo progress towards the threshold. */
  current: number;
  unlocked: boolean;
  /** Bonus points awarded to the community when the milestone is reached (A6). */
  points: number;
}

// Text (name/tagline/description/keyConcerns/channel labels/entryPoint/barrierNote)
// is translated — see i18n: audienceData.<id>.*. `channels` here keeps only the type
// (for the online/offline icon); labels come from audienceData.<id>.channels (by index).
export interface TargetAudience {
  id: string;
  icon: string;
  channels: { type: 'online' | 'offline' }[];
}

// --- Auth & User types (backend-connected) ---

export type UserRole = 'USER' | 'ADMIN';
export type UserLanguage = 'EN' | 'EL' | 'DE';
export type UserProfile = 'RESIDENT' | 'VISITOR' | 'STUDENT' | 'VOLUNTEER';
export type ApiProjectStatus = 'DRAFT' | 'OPEN' | 'CLOSED' | 'COMPLETED';
export type ApiProjectCategory =
  | 'MOBILITY'
  | 'WASTE_CIRCULAR'
  | 'MARINE_PROTECTION'
  | 'NATURAL_MONUMENTS'
  | 'ENERGY'
  | 'EDUCATION_PARTICIPATION';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  name: string;
  role: UserRole;
  points: number;
  avatarUrl: string | null;
  language: UserLanguage;
  profile: UserProfile;
}

export interface ApiProject {
  id: string;
  titleEn: string;
  titleEl: string;
  titleDe: string;
  descriptionEn: string;
  descriptionEl: string;
  descriptionDe: string;
  sdgIds: string; // JSON string of number[]
  category: ApiProjectCategory;
  status: ApiProjectStatus;
  rewardPoints: number;
  location: string | null;
  lat: number | null;
  lng: number | null;
  maxParticipants: number | null;
  imageUrl: string | null;
  sourceNote: string | null;
  metrics?: ApiProjectMetric[];
  // Value chain (Hammer & Champy): Input -> Activity -> Output, trilingual, optional.
  inputResourcesEn: string | null;
  inputResourcesEl: string | null;
  inputResourcesDe: string | null;
  keyActivitiesEn: string | null;
  keyActivitiesEl: string | null;
  keyActivitiesDe: string | null;
  outputResultsEn: string | null;
  outputResultsEl: string | null;
  outputResultsDe: string | null;
  createdAt: string;
  _count?: { participations: number };
}

export interface ApiBadge {
  id: string;
  nameEn: string;
  nameEl: string;
  nameDe: string;
  descEn: string;
  descEl: string;
  descDe: string;
  iconName: string;
  threshold: number;
}

export interface ApiUserBadge {
  badge: ApiBadge;
  earnedAt: string;
}

export interface ApiParticipation {
  id: string;
  projectId: string;
  joinedAt: string;
  pointsAwarded: number;
  project?: Pick<
    ApiProject,
    'id' | 'titleEn' | 'titleEl' | 'titleDe' | 'category'
  >;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// One registration row in the admin attendance overview: either a member
// (`user` set) or a guest (guestName/guestEmail set).
export interface AdminEventRegistration {
  id: string;
  eventId: string;
  createdAt: string;
  pointsAwarded: number;
  guestName: string | null;
  guestEmail: string | null;
  userId: string | null;
  user: { id: string; name: string; email: string } | null;
}

// --- ZOE reward levels (admin-editable, served by /api/rewards/tiers) ---

export interface ApiRewardTierRole {
  id: string;
  tierId: string;
  role: UserProfile;
  nameEn: string;
  nameEl: string;
  nameDe: string;
  descriptionEn: string;
  descriptionEl: string;
  descriptionDe: string;
  /** Newline-separated reward lists (one reward per line). */
  rewardsEn: string;
  rewardsEl: string;
  rewardsDe: string;
}

export interface ApiRewardTier {
  id: string;
  order: number;
  greekName: string;
  icon: string;
  pointsMin: number;
  pointsMax: number | null;
  roleVariants: ApiRewardTierRole[];
}

/** Normalized for the UI: the active language is already picked. */
export interface UiRewardTier {
  id: string;
  greekName: string;
  icon: string;
  colorClasses: string;
  pointsMin: number;
  pointsMax: number | null;
  byRole: Record<
    UserProfile,
    { name: string; description: string; rewards: string[] }
  >;
}

// Citizen report (environmental issue) or feedback from /participate.
export type SubmissionType = 'REPORT' | 'FEEDBACK';

// Handling workflow for a report/feedback so the submitter gets feedback.
export type SubmissionStatus = 'NEW' | 'IN_REVIEW' | 'RESOLVED' | 'DECLINED';

export interface ApiSubmission {
  id: string;
  type: SubmissionType;
  message: string;
  status: SubmissionStatus;
  adminNote: string | null;
  submitterName: string | null;
  submitterEmail: string | null;
  userId: string | null;
  user?: { id: string; username: string; name: string; email: string } | null;
  createdAt: string;
}

// A citizen's own report/feedback (with status + admin reply) — dashboard.
export interface MySubmission {
  id: string;
  type: SubmissionType;
  message: string;
  status: SubmissionStatus;
  adminNote: string | null;
  createdAt: string;
}

export interface LoginPayload {
  // Either a username or an email address.
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  username: string;
  language?: UserLanguage;
  profile?: UserProfile;
}

// --- Citizen event proposals (community → admin review → real Event) ---

export type EventProposalStatus = 'NEW' | 'CONVERTED' | 'DECLINED';

export interface EventProposalPayload {
  title: string;
  description: string;
  lang: UserLanguage;
  category: ApiProjectCategory;
  date: string;
  location?: string;
  lat?: number | null;
  lng?: number | null;
  capacity?: number | null;
  imageUrl?: string;
  projectId?: string;
  submitterName?: string;
  submitterEmail?: string;
}

export interface AdminEventProposal {
  id: string;
  title: string;
  description: string;
  lang: UserLanguage;
  category: ApiProjectCategory;
  date: string;
  location: string | null;
  lat: number | null;
  lng: number | null;
  capacity: number | null;
  rewardPoints: number | null;
  imageUrl: string | null;
  projectId: string | null;
  status: EventProposalStatus;
  adminNote: string | null;
  submitterName: string | null;
  submitterEmail: string | null;
  createdEventId: string | null;
  createdAt: string;
  user: { id: string; username: string; name: string; email: string } | null;
}

// --- Citizen in-app notifications (mention bell) ---

export type UserNotificationType =
  | 'MENTION'
  | 'IDEA_STATUS'
  | 'PROPOSAL_STATUS'
  | 'SUBMISSION_STATUS';

export interface UserNotification {
  id: string;
  type: UserNotificationType;
  read: boolean;
  createdAt: string;
  eventId: string | null;
  ideaId: string | null;
  submissionId: string | null;
  commentId: string | null;
  status: string | null;
  message: string | null;
  actorUsername: string | null;
}

// --- Geocoding (Nominatim, via backend proxy) ---

export interface GeocodeResult {
  label: string;
  lat: number;
  lng: number;
}

// --- News / blog posts ---

export type PostType = 'PROJECT_NEW' | 'PROJECT_COMPLETED' | 'ANNOUNCEMENT';

export interface Post {
  id: string;
  type: PostType;
  titleEn: string;
  titleEl: string;
  titleDe: string;
  bodyEn: string;
  bodyEl: string;
  bodyDe: string;
  imageUrl: string | null;
  published: boolean;
  projectId: string | null;
  createdAt: string;
}

// --- Citizen ideas (goal Z3) ---

export type IdeaStatus = 'NEW' | 'IN_REVIEW' | 'ACCEPTED' | 'DECLINED';

// Public idea-board shape (GET /api/ideas/public). ACCEPTED only, no personal data.
export interface PublicIdea {
  id: string;
  title: string;
  description: string;
  category: ApiProjectCategory;
  status: 'ACCEPTED';
  voteCount: number;
  votedByMe: boolean;
  createdAt: string;
}

// A citizen's own idea (any status) — for dashboard tracking.
export interface MyIdea {
  id: string;
  title: string;
  description: string;
  category: ApiProjectCategory;
  status: IdeaStatus;
  adminNote: string | null;
  voteCount: number;
  createdAt: string;
}

// A citizen's own event proposal (any status) — for dashboard tracking.
export interface MyEventProposal {
  id: string;
  title: string;
  category: ApiProjectCategory;
  date: string;
  status: EventProposalStatus;
  adminNote: string | null;
  createdEventId: string | null;
  createdAt: string;
}

// Learning resources (Z5) — locally-grounded educational content.
export interface LearningProjectRef {
  id: string;
  titleEn: string;
  titleEl: string;
  titleDe: string;
  category: ApiProjectCategory;
}

export interface LearningResource {
  id: string;
  titleEn: string;
  titleEl: string;
  titleDe: string;
  bodyEn: string;
  bodyEl: string;
  bodyDe: string;
  category: ApiProjectCategory;
  sdgIds: string; // JSON array string
  imageUrl: string | null;
  sourceNote: string | null;
  projectId: string | null;
  project?: LearningProjectRef | null;
  createdAt: string;
}

// Documented, sourced impact figure for a project (Z1).
export interface ApiProjectMetric {
  id: string;
  labelEn: string;
  labelEl: string;
  labelDe: string;
  value: string;
  unit: string | null;
  source: string | null;
  projectId: string;
}

// Aggregated impact figure (GET /api/projects/impact) — carries its project.
export interface ApiImpactMetric extends ApiProjectMetric {
  project: {
    id: string;
    titleEn: string;
    titleEl: string;
    titleDe: string;
  } | null;
}

// "What's New" merged feed (imported Facebook posts + project posts).
export interface FeedImage {
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
}

export type FeedCategory =
  | 'ANNOUNCEMENT'
  | 'EVENT'
  | 'PROJECT'
  | 'NEWS'
  | 'PROJECT_UPDATE';

export interface FeedItem {
  id: string;
  source: 'feed' | 'project';
  category: FeedCategory;
  eventStatus: 'UPCOMING' | 'COMPLETED' | null;
  date: string;
  title: string;
  excerpt: string;
  images: FeedImage[];
  needsReview: boolean;
}

// Single-entry detail — like FeedItem but with the FULL body (no excerpt).
export interface FeedDetail {
  id: string;
  source: 'feed' | 'project';
  category: FeedCategory;
  eventStatus: 'UPCOMING' | 'COMPLETED' | null;
  date: string;
  title: string;
  body: string;
  images: FeedImage[];
  needsReview: boolean;
}

// Admin-facing feed shapes (all translations + images).
export interface AdminFeedTranslation {
  id: string;
  locale: string;
  title: string;
  body: string;
  isMachineTranslated: boolean;
}
// Trilingual alt text for one image (WCAG 2.1 AA). `text = ""` is a deliberate
// decorative image. `needsReview` is per-language (machine-generated until checked).
export interface AdminFeedImageAltText {
  id: string;
  locale: string;
  text: string;
  needsReview: boolean;
}
export interface AdminFeedImage {
  id: string;
  storagePath: string;
  publicUrl: string;
  order: number;
  altTexts: AdminFeedImageAltText[];
  width: number | null;
  height: number | null;
}
export interface AdminFeedPost {
  id: string;
  category: 'ANNOUNCEMENT' | 'EVENT' | 'PROJECT' | 'NEWS';
  eventStatus: 'UPCOMING' | 'COMPLETED' | null;
  publishedAt: string;
  sourceFolder: string;
  needsReview: boolean;
  translations: AdminFeedTranslation[];
  images: AdminFeedImage[];
}

export type CommentStatus = 'VISIBLE' | 'HIDDEN';

// Public comment on an approved idea — author display name only, no PII.
export interface PublicComment {
  id: string;
  body: string;
  createdAt: string;
  authorUsername: string;
  authorAvatarUrl: string | null;
  likeCount: number;
  likedByMe: boolean;
}

export interface PublicIdeaDetail {
  idea: PublicIdea;
  comments: PublicComment[];
}

// Admin moderation shape (GET /api/admin/comments).
export interface AdminComment {
  id: string;
  body: string;
  status: CommentStatus;
  createdAt: string;
  user: { username: string };
  idea: { id: string; title: string } | null;
  event: { id: string; titleEn: string } | null;
  _count: { likes: number };
}

// Admin-facing shape (GET /api/admin/ideas). `category` reuses ApiProjectCategory.
export interface Idea {
  id: string;
  title: string;
  description: string;
  category: ApiProjectCategory;
  status: IdeaStatus;
  adminNote: string | null;
  submitterName: string | null;
  submitterEmail: string | null;
  userId: string | null;
  user: { id: string; username: string; name: string; email: string } | null;
  createdAt: string;
}

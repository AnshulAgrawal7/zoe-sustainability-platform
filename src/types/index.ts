// Core domain types for the ZOE platform prototype

// Finer-grained categories retained for EVENTS only. Projects use the canonical
// 5-value `ApiProjectCategory` (single source of truth across all project screens).
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
  category: ApiProjectCategory; // canonical 5-value taxonomy (consistent with /projects API)
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
  category: ApiProjectCategory;
  rewardPoints: number;
  capacity: number | null;
  imageUrl: string | null;
  projectId: string | null;
  project?: ApiEventProjectRef | null;
  registeredCount?: number;
  createdAt: string;
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
  icon: string;
  category: string;
}

// Text (label/reward) is translated — see i18n: rewardData.milestones.<id>.*
export interface CommunityMilestone {
  id: string;
  target: number;
  current: number;
  unlocked: boolean;
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
  | 'ENVIRONMENT'
  | 'MOBILITY'
  | 'COMMUNITY'
  | 'EDUCATION'
  | 'CULTURE';

export interface AuthUser {
  id: string;
  email: string;
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

export interface AuthTokens {
  accessToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  language?: UserLanguage;
  profile?: UserProfile;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  avatarUrl: string | null;
  _count: { participations: number };
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

export type CommentStatus = 'VISIBLE' | 'HIDDEN';

// Public comment on an approved idea — author display name only, no PII.
export interface PublicComment {
  id: string;
  body: string;
  createdAt: string;
  authorName: string;
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
  user: { name: string };
  idea: { id: string; title: string };
  _count: { likes: number };
}

// Admin-facing shape (GET /api/admin/ideas). `category` reuses ApiProjectCategory.
export interface Idea {
  id: string;
  title: string;
  description: string;
  category: ApiProjectCategory;
  status: IdeaStatus;
  submitterName: string | null;
  submitterEmail: string | null;
  userId: string | null;
  user: { id: string; name: string; email: string } | null;
  createdAt: string;
}

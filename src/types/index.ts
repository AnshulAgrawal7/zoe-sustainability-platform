// Core domain types for the ZOE platform prototype

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
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;
  location: string;
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
}

export interface TransparencyMetric {
  label: string;
  value: string;
  unit: string;
}

export interface Event {
  id: string;
  title: string;
  category: ProjectCategory;
  date: string;
  time: string;
  location: string;
  description: string;
  participantsMax: number;
  participantsRegistered: number;
  projectId?: string;
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

export interface RewardTier {
  id: string;
  name: string;
  greekName: string;
  pointsMin: number;
  pointsMax: number | null;
  icon: string;
  colorClasses: string;
  description: string;
  rewards: string[];
}

export interface RewardActivity {
  id: string;
  label: string;
  points: number;
  icon: string;
  category: string;
}

export interface CommunityMilestone {
  label: string;
  target: number;
  current: number;
  reward: string;
  unlocked: boolean;
}

export interface TargetAudience {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  keyConcerns: string[];
  channels: { label: string; type: 'online' | 'offline' }[];
  entryPoint: string;
  barrierNote: string;
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
  maxParticipants: number | null;
  imageUrl: string | null;
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

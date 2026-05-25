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
  | 3
  | 4
  | 6
  | 7
  | 8
  | 11
  | 12
  | 13
  | 14
  | 15
  | 17;

export interface SDG {
  number: SDGNumber;
  title: string;
  color: string;
  description: string;
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

export interface ImpactMetric {
  label: string;
  value: string | number;
  unit: string;
  icon: string;
  description: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface SDGProgress {
  sdg: SDGNumber;
  projectCount: number;
  progressPercent: number;
}

export interface ParticipationOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  actionLabel: string;
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

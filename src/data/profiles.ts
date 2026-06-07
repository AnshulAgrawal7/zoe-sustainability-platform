// PROTOTYPE DATA — audience profiles for a tailored reward focus (supports DP4:
// target-group heterogeneity). Self-selected, optional, no personal data (no age!).
// Labels/descriptions live in i18n under `profiles.*` (no hardcoded text in components).
import type { UserProfile } from '../types';

export interface ProfileOption {
  id: UserProfile;
  emoji: string;
}

export const PROFILE_OPTIONS: ProfileOption[] = [
  { id: 'RESIDENT', emoji: '🏡' },
  { id: 'VISITOR', emoji: '🧳' },
  { id: 'STUDENT', emoji: '🎓' },
  { id: 'VOLUNTEER', emoji: '🤝' },
];

export const PROFILE_EMOJI: Record<UserProfile, string> = {
  RESIDENT: '🏡',
  VISITOR: '🧳',
  STUDENT: '🎓',
  VOLUNTEER: '🤝',
};

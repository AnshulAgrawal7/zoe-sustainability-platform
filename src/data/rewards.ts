// PROTOTYPE DATA — reward tiers, activities, and milestones (illustrative).
// All user-facing text is translated (see locales: rewardData.*).
import type { RewardTier, RewardActivity, CommunityMilestone } from '../types';

export const rewardTiers: RewardTier[] = [
  {
    id: 'sporos',
    greekName: 'Σπόρος',
    pointsMin: 0,
    pointsMax: 249,
    icon: '🌱',
    colorClasses: 'bg-lime-50 border-lime-300 text-lime-800',
  },
  {
    id: 'phyllo',
    greekName: 'Φύλλο',
    pointsMin: 250,
    pointsMax: 999,
    icon: '🍃',
    colorClasses: 'bg-green-50 border-green-300 text-green-800',
  },
  {
    id: 'kladi',
    greekName: 'Κλαδί',
    pointsMin: 1000,
    pointsMax: 2499,
    icon: '🌿',
    colorClasses: 'bg-teal-50 border-teal-300 text-teal-800',
  },
  {
    id: 'fylakas',
    greekName: 'Φύλακας',
    pointsMin: 2500,
    pointsMax: 4999,
    icon: '🛡️',
    colorClasses: 'bg-emerald-50 border-emerald-300 text-emerald-800',
  },
  {
    id: 'thematofylakas',
    greekName: 'Θεματοφύλακας',
    pointsMin: 5000,
    pointsMax: null,
    icon: '🏛️',
    colorClasses: 'bg-cyan-50 border-cyan-400 text-cyan-900',
  },
];

// Reduced to two illustrative examples (J3); no emojis on the point rows.
export const rewardActivities: RewardActivity[] = [
  { id: 'submit-idea', points: 10, icon: '', category: 'Participation' },
  { id: 'attend-event', points: 20, icon: '', category: 'Action' },
];

// Community milestones as a point source (A6) — DEMO DATA. Each = a collective
// threshold for North Corfu that, when reached, awards bonus `points` to the
// community. Trilingual label/reward live in i18n (rewardData.milestones.<id>).
// (Config now; an admin-editable `CommunityMilestone` DB model is the future
// path — see run-log PENDING.)
export const communityMilestones: CommunityMilestone[] = [
  {
    id: 'residents-100',
    target: 100,
    current: 73,
    unlocked: false,
    points: 500,
  },
  {
    id: 'volunteer-hours-500',
    target: 500,
    current: 500,
    unlocked: true,
    points: 1000,
  },
  {
    id: 'participants-1000',
    target: 1000,
    current: 1000,
    unlocked: true,
    points: 2000,
  },
];

// PROTOTYPE DATA — reward tiers, activities, and milestones (illustrative).
// All user-facing text is translated (see locales: rewardData.*).
import type { RewardTier, RewardActivity, CommunityMilestone } from '../types';

export const rewardTiers: RewardTier[] = [
  {
    id: 'sporos',
    greekName: 'Σπόρος',
    pointsMin: 0,
    pointsMax: 24,
    icon: '🌱',
    colorClasses: 'bg-lime-50 border-lime-300 text-lime-800',
  },
  {
    id: 'phyllo',
    greekName: 'Φύλλο',
    pointsMin: 25,
    pointsMax: 99,
    icon: '🍃',
    colorClasses: 'bg-green-50 border-green-300 text-green-800',
  },
  {
    id: 'kladi',
    greekName: 'Κλαδί',
    pointsMin: 100,
    pointsMax: 249,
    icon: '🌿',
    colorClasses: 'bg-teal-50 border-teal-300 text-teal-800',
  },
  {
    id: 'fylakas',
    greekName: 'Φύλακας',
    pointsMin: 250,
    pointsMax: 499,
    icon: '🛡️',
    colorClasses: 'bg-emerald-50 border-emerald-300 text-emerald-800',
  },
  {
    id: 'thematofylakas',
    greekName: 'Θεματοφύλακας',
    pointsMin: 500,
    pointsMax: null,
    icon: '🏛️',
    colorClasses: 'bg-cyan-50 border-cyan-400 text-cyan-900',
  },
];

// Reduced to two illustrative examples (J3); no emojis on the point rows.
export const rewardActivities: RewardActivity[] = [
  { id: 'submit-idea', points: 1, icon: '', category: 'Participation' },
  { id: 'attend-event', points: 2, icon: '', category: 'Action' },
];

export const communityMilestones: CommunityMilestone[] = [
  { id: 'residents-100', target: 100, current: 73, unlocked: false },
  { id: 'volunteer-hours-500', target: 500, current: 500, unlocked: true },
  { id: 'eco-businesses-10', target: 10, current: 6, unlocked: false },
  { id: 'feedback-200', target: 200, current: 148, unlocked: false },
  { id: 'participants-1000', target: 1000, current: 1000, unlocked: true },
];

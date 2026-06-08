// PROTOTYPE DATA — school reward tiers (illustrative), based on a school's
// combined (total) member points. Separate from the individual reward tiers in
// rewards.ts. All user-facing text is translated (see locales: schoolRewards.*).
import type { SchoolRewardTier } from '../types';

export const schoolRewardTiers: SchoolRewardTier[] = [
  {
    id: 'sporeio',
    greekName: 'Σπορείο',
    pointsMin: 0,
    pointsMax: 499,
    icon: '🌱',
    colorClasses: 'bg-lime-50 border-lime-300 text-lime-800',
  },
  {
    id: 'alsos',
    greekName: 'Άλσος',
    pointsMin: 500,
    pointsMax: 1499,
    icon: '🌳',
    colorClasses: 'bg-green-50 border-green-300 text-green-800',
  },
  {
    id: 'dasos',
    greekName: 'Δάσος',
    pointsMin: 1500,
    pointsMax: 2999,
    icon: '🌲',
    colorClasses: 'bg-teal-50 border-teal-300 text-teal-800',
  },
  {
    id: 'frouros',
    greekName: 'Φρουρός Φύσης',
    pointsMin: 3000,
    pointsMax: 5999,
    icon: '🛡️',
    colorClasses: 'bg-emerald-50 border-emerald-300 text-emerald-800',
  },
  {
    id: 'faros',
    greekName: 'Φάρος Βιωσιμότητας',
    pointsMin: 6000,
    pointsMax: null,
    icon: '🏛️',
    colorClasses: 'bg-cyan-50 border-cyan-400 text-cyan-900',
  },
];

/** The tier a school has reached for a given combined (total) points value. */
export function schoolTierForPoints(totalPoints: number): SchoolRewardTier {
  return (
    [...schoolRewardTiers]
      .reverse()
      .find((tier) => totalPoints >= tier.pointsMin) ?? schoolRewardTiers[0]
  );
}

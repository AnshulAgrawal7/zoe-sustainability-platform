import { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trophy, Star, Lock, ArrowRight, TrendingUp } from 'lucide-react';
import { getMyBadges } from '../../services/userService';
import { useRewardTiers, tierForPoints } from '../../hooks/useRewardTiers';
import { useAuthStore } from '../../stores/authStore';
import PointsBadge from '../../components/ui/PointsBadge';
import type { ApiBadge, ApiUserBadge } from '../../types';

interface BadgesData {
  earned: ApiUserBadge[];
  all: ApiBadge[];
  points: number;
  nextBadge: ApiBadge | null;
}

export default function UserRewardsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2);
  const user = useAuthStore((s) => s.user);
  // Admin-editable ZOE levels (same content as /rewards).
  const { tiers } = useRewardTiers();

  const [badges, setBadges] = useState<BadgesData | null>(null);
  const [loading, setLoading] = useState(true);

  // No individual citizen ranking by design: it would expose names + points
  // and create social friction in a small island community
  // (see docs/design-rationale-matrix.md B3) — community milestones on
  // /rewards fill that role instead.
  useEffect(() => {
    getMyBadges()
      .then(setBadges)
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  function getBadgeName(b: ApiBadge): string {
    if (lang === 'el') return b.nameEl;
    if (lang === 'de') return b.nameDe;
    return b.nameEn;
  }
  function getBadgeDesc(b: ApiBadge): string {
    if (lang === 'el') return b.descEl;
    if (lang === 'de') return b.descDe;
    return b.descEn;
  }

  const earnedIds = new Set(badges?.earned.map((ub) => ub.badge.id) ?? []);

  // Current ZOE level + next level (same admin-editable content as /rewards),
  // role-specific for the user's own profile.
  const points = badges?.points ?? user?.points ?? 0;
  const profile = user?.profile ?? 'RESIDENT';
  const currentTier = tierForPoints(tiers, points);
  const nextTier = tiers.find((tier) => tier.pointsMin > points) ?? null;
  const pointsToNext = nextTier ? nextTier.pointsMin - points : 0;
  const progressInTier =
    currentTier && currentTier.pointsMax
      ? ((points - currentTier.pointsMin) /
          (currentTier.pointsMax - currentTier.pointsMin)) *
        100
      : 100;

  return (
    <Container className="py-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        {t('rewards.title')}
      </h1>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : (
        <div className="max-w-3xl">
          {/* Points + Badges */}
          <div className="space-y-6">
            {/* Points + current ZOE level (same content as /rewards) */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex items-center gap-3">
                <Star className="h-6 w-6 text-amber-500" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('rewards.yourPoints')}
                </h2>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <PointsBadge
                  points={points}
                  iconSize={36}
                  className="gap-2 text-5xl font-bold text-amber-500"
                />
                {currentTier && (
                  <div className="flex items-center gap-2">
                    <span className="text-3xl" aria-hidden="true">
                      {currentTier.icon}
                    </span>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('rewards.currentTier')}
                      </p>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {currentTier.greekName}
                        <span className="ml-1 font-medium text-gray-500 dark:text-gray-400">
                          — {currentTier.byRole[profile].name}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress towards the next level */}
              {currentTier && (
                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <PointsBadge points={currentTier.pointsMin} iconSize={11} />
                    {currentTier.pointsMax && (
                      <PointsBadge
                        points={currentTier.pointsMax}
                        iconSize={11}
                      />
                    )}
                  </div>
                  <div className="mb-3 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-amber-400 transition-all"
                      style={{ width: `${Math.min(progressInTier, 100)}%` }}
                      role="progressbar"
                      aria-valuenow={points}
                      aria-valuemin={currentTier.pointsMin}
                      aria-valuemax={currentTier.pointsMax ?? points}
                    />
                  </div>
                  {nextTier ? (
                    <p className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                      <TrendingUp
                        size={14}
                        className="text-green-600 dark:text-green-400"
                        aria-hidden="true"
                      />
                      <span>
                        <strong>
                          {t('rewards.morePoints', { count: pointsToNext })}
                        </strong>{' '}
                        {t('rewards.toReach', {
                          tier: nextTier.greekName,
                          name: nextTier.byRole[profile].name,
                        })}{' '}
                        {nextTier.icon}
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                      {t('rewards.highestTier')}
                    </p>
                  )}
                </div>
              )}

              {/* What the NEXT level unlocks — the same role-specific rewards
                  as on /rewards */}
              {nextTier && (
                <div className="mt-5 rounded-xl border border-green-100 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
                  <p className="mb-2 text-sm font-semibold text-green-900 dark:text-green-200">
                    {t('rewards.nextTierRewards', {
                      tier: nextTier.greekName,
                      name: nextTier.byRole[profile].name,
                    })}
                  </p>
                  <ul className="space-y-1.5">
                    {nextTier.byRole[profile].rewards.map((r) => (
                      <li
                        key={r}
                        className="flex items-start gap-2 text-sm text-green-900/90 dark:text-green-100/90"
                      >
                        <Star
                          size={13}
                          className="mt-0.5 flex-shrink-0 text-amber-500"
                          aria-hidden="true"
                        />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Link
                to="/rewards"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:underline dark:text-green-400"
              >
                {t('getInvolved.rewardsLink')}
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>

            {/* All Badges */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                {t('rewards.allBadges')}
              </h2>
              {badges?.nextBadge && (
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  {t('rewards.nextBadge')}:{' '}
                  <strong>{getBadgeName(badges.nextBadge)}</strong> (
                  {t('rewards.pointsToGo', {
                    points: badges.nextBadge.threshold - points,
                  })}
                  )
                </p>
              )}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {badges?.all.map((badge) => {
                  const earned = earnedIds.has(badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`flex items-start gap-3 rounded-xl border p-3 transition-colors ${
                        earned
                          ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20'
                          : 'border-gray-200 opacity-50 dark:border-gray-700'
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${earned ? 'bg-amber-100 dark:bg-amber-900' : 'bg-gray-100 dark:bg-gray-700'}`}
                      >
                        {earned ? (
                          <Trophy
                            className="h-5 w-5 text-amber-500"
                            aria-hidden="true"
                          />
                        ) : (
                          <Lock
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {getBadgeName(badge)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {badge.threshold} pts
                        </p>
                        <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                          {getBadgeDesc(badge)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

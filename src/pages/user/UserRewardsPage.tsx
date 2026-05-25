import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy, Star, Lock } from 'lucide-react';
import { getMyBadges, getLeaderboard } from '../../services/userService';
import type { ApiBadge, ApiUserBadge, LeaderboardEntry } from '../../types';

interface BadgesData {
  earned: ApiUserBadge[];
  all: ApiBadge[];
  points: number;
  nextBadge: ApiBadge | null;
}

export default function UserRewardsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2);

  const [badges, setBadges] = useState<BadgesData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyBadges(), getLeaderboard()])
      .then(([b, lb]) => {
        setBadges(b);
        setLeaderboard(lb);
      })
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        {t('rewards.title')}
      </h1>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Points + Badges */}
          <div className="space-y-6 lg:col-span-2">
            {/* Points */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex items-center gap-3">
                <Star className="h-6 w-6 text-amber-500" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('rewards.yourPoints')}
                </h2>
              </div>
              <p className="mb-2 text-5xl font-bold text-amber-500">
                {badges?.points ?? 0}
              </p>
              {badges?.nextBadge && (
                <div className="mt-4">
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    {t('rewards.nextBadge')}:{' '}
                    <strong>{getBadgeName(badges.nextBadge)}</strong> (
                    {t('rewards.pointsToGo', {
                      points: badges.nextBadge.threshold - (badges.points ?? 0),
                    })}
                    )
                  </p>
                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-amber-400 transition-all"
                      style={{
                        width: `${Math.min(100, ((badges.points ?? 0) / badges.nextBadge.threshold) * 100)}%`,
                      }}
                      role="progressbar"
                      aria-valuenow={badges.points}
                      aria-valuemax={badges.nextBadge.threshold}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* All Badges */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                {t('rewards.allBadges')}
              </h2>
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

          {/* Right: Leaderboard */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              {t('rewards.leaderboard')}
            </h2>
            <ol className="space-y-3">
              {leaderboard.map((entry, i) => (
                <li key={entry.id} className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      i === 0
                        ? 'bg-amber-400 text-white'
                        : i === 1
                          ? 'bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-white'
                          : i === 2
                            ? 'bg-orange-300 text-white'
                            : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 truncate text-sm text-gray-800 dark:text-gray-200">
                    {entry.name}
                  </span>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    {entry.points}
                  </span>
                </li>
              ))}
              {leaderboard.length === 0 && (
                <li className="text-sm text-gray-500 dark:text-gray-400">
                  {t('common.loading')}
                </li>
              )}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

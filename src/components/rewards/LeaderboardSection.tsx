import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trophy, Medal } from 'lucide-react';
import { getLeaderboard } from '../../services/userService';
import { useAuthStore } from '../../stores/authStore';
import PointsBadge from '../ui/PointsBadge';
import type { LeaderboardEntry } from '../../types';

const RANK_COLOR: Record<number, string> = {
  1: 'text-amber-500',
  2: 'text-gray-400',
  3: 'text-orange-400',
};

// Leaderboard rendered as a section of the Rewards page. Logged-in only
// (pseudonymous usernames; DSR B3) — guests see a short prompt to log in.
export default function LeaderboardSection() {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  // Only authenticated users fetch — start "loading" only then.
  const [loading, setLoading] = useState(isAuthenticated);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await getLeaderboard();
        if (!cancelled) setEntries(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  return (
    <section aria-labelledby="leaderboard-heading" className="mt-12">
      <div className="mb-1 flex items-center gap-2">
        <Trophy size={20} className="text-amber-500" aria-hidden="true" />
        <h2
          id="leaderboard-heading"
          className="text-xl font-bold text-gray-900 dark:text-white"
        >
          {t('leaderboard.title')}
        </h2>
      </div>
      <p className="mb-4 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
        {t('leaderboard.subtitle')}
      </p>

      {!isAuthenticated ? (
        <p className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300">
          {t('leaderboard.loginHint')}{' '}
          <Link
            to="/login"
            className="font-medium text-green-700 underline dark:text-green-400"
          >
            {t('comments.login')}
          </Link>
        </p>
      ) : loading ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : error ? (
        <p className="text-gray-500 dark:text-gray-400">{t('common.error')}</p>
      ) : entries.length === 0 ? (
        <p className="py-8 text-center text-gray-500 dark:text-gray-400">
          {t('leaderboard.empty')}
        </p>
      ) : (
        <ol className="space-y-2">
          {entries.map((e) => (
            <li
              key={e.rank}
              className={`flex items-center gap-4 rounded-xl border p-4 ${
                e.isMe
                  ? 'border-green-400 bg-green-50 dark:border-green-600 dark:bg-green-900/20'
                  : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
              }`}
            >
              <span
                className={`flex w-8 shrink-0 items-center justify-center text-lg font-bold ${
                  RANK_COLOR[e.rank] ?? 'text-gray-400 dark:text-gray-500'
                }`}
                aria-hidden="true"
              >
                {e.rank <= 3 ? <Medal size={20} /> : e.rank}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-gray-900 dark:text-white">
                  @{e.username}
                  {e.isMe && (
                    <span className="ml-2 rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      {t('leaderboard.you')}
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('leaderboard.rank', { rank: e.rank })} ·{' '}
                  {t('leaderboard.projects', { count: e.participationCount })}
                </p>
              </div>
              <PointsBadge
                points={e.points}
                className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
              />
            </li>
          ))}
        </ol>
      )}

      <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
        {t('leaderboard.privacyNote')}
      </p>
    </section>
  );
}

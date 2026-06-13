import { useState, useEffect } from 'react';
import Container from '../components/layout/Container';
import { useTranslation } from 'react-i18next';
import { Trophy, Medal } from 'lucide-react';
import { getLeaderboard } from '../services/userService';
import PointsBadge from '../components/ui/PointsBadge';
import type { LeaderboardEntry } from '../types';

const RANK_COLOR: Record<number, string> = {
  1: 'text-amber-500',
  2: 'text-gray-400',
  3: 'text-orange-400',
};

export default function LeaderboardPage() {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getLeaderboard()
      .then(setEntries)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxW="lg" className="py-8">
      <div className="mb-1 flex items-center gap-2">
        <Trophy size={22} className="text-amber-500" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('leaderboard.title')}
        </h1>
      </div>
      <p className="mb-6 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
        {t('leaderboard.subtitle')}
      </p>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : error ? (
        <p className="text-gray-500 dark:text-gray-400">{t('common.error')}</p>
      ) : entries.length === 0 ? (
        <p className="py-12 text-center text-gray-500 dark:text-gray-400">
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

      <p className="mt-6 text-xs text-gray-400 dark:text-gray-500">
        {t('leaderboard.privacyNote')}
      </p>
    </Container>
  );
}

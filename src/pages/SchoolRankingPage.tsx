import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trophy, Users, GraduationCap, Info } from 'lucide-react';
import { getSchoolLeaderboard } from '../services/schoolService';
import { fallbackSchools, FALLBACK_MIN_RANKED_MEMBERS } from '../data/schools';
import { schoolTierForPoints } from '../data/schoolRewards';
import type { SchoolSummary } from '../types';

export default function SchoolRankingPage() {
  const { t } = useTranslation();
  const [schools, setSchools] = useState<SchoolSummary[]>([]);
  const [minMembers, setMinMembers] = useState(FALLBACK_MIN_RANKED_MEMBERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSchoolLeaderboard()
      .then((data) => {
        setSchools(data.schools);
        setMinMembers(data.minRankedMembers);
      })
      .catch(() => setSchools(fallbackSchools))
      .finally(() => setLoading(false));
  }, []);

  const ranked = schools.filter((s) => s.ranked);
  const unranked = schools.filter((s) => !s.ranked);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
          <GraduationCap size={16} aria-hidden="true" />
          {t('schools.ranking.badge')}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          {t('schools.ranking.title')}
        </h1>
        <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
          {t('schools.ranking.subtitle')}
        </p>
      </header>

      <div className="mb-6 flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-200">
        <Info size={16} aria-hidden="true" className="mt-0.5 flex-shrink-0" />
        <p>{t('schools.ranking.minMembersNote', { count: minMembers })}</p>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : (
        <>
          <ol className="space-y-3">
            {ranked.map((school, i) => (
              <SchoolRow key={school.id} school={school} rank={i + 1} />
            ))}
          </ol>

          {ranked.length === 0 && (
            <p className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              {t('schools.ranking.empty')}
            </p>
          )}

          {unranked.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {t('schools.ranking.notRankedHeading')}
              </h2>
              <ul className="space-y-3">
                {unranked.map((school) => (
                  <SchoolRow key={school.id} school={school} rank={null} />
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-5 text-center dark:border-green-800 dark:bg-green-900/20">
        <p className="text-sm font-semibold text-green-800 dark:text-green-300">
          {t('schools.ranking.joinTitle')}
        </p>
        <p className="mt-1 text-sm text-green-700 dark:text-green-200/90">
          {t('schools.ranking.joinBody')}
        </p>
        <Link
          to="/profile"
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
        >
          {t('schools.ranking.joinCta')}
        </Link>
      </div>
    </div>
  );
}

function SchoolRow({
  school,
  rank,
}: {
  school: SchoolSummary;
  rank: number | null;
}) {
  const { t } = useTranslation();
  const tier = schoolTierForPoints(school.totalPoints);

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3 sm:w-auto">
        <span
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
            rank === 1
              ? 'bg-amber-400 text-white'
              : rank === 2
                ? 'bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-white'
                : rank === 3
                  ? 'bg-orange-300 text-white'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          {rank ?? '–'}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-900 dark:text-white">
            {school.name}
          </p>
          {school.location && (
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {school.location}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 sm:ml-auto sm:justify-end">
        <Stat
          label={t('schools.ranking.colAvg')}
          value={String(school.avgPoints)}
          highlight
        />
        <Stat
          label={t('schools.ranking.colTotal')}
          value={String(school.totalPoints)}
        />
        <span className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <Users size={14} aria-hidden="true" />
          {t('schools.ranking.members', { count: school.memberCount })}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${tier.colorClasses} dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200`}
        >
          <Trophy size={12} aria-hidden="true" />
          {t(`schoolRewards.tiers.${tier.id}.name`)}
        </span>
      </div>
    </li>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <span className="text-sm">
      <span
        className={`font-bold ${highlight ? 'text-green-700 dark:text-green-400' : 'text-gray-800 dark:text-gray-200'}`}
      >
        {value}
      </span>{' '}
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
    </span>
  );
}

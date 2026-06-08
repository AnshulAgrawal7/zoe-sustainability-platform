import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GraduationCap, Trophy, Users, Star, KeyRound } from 'lucide-react';
import { getMySchool } from '../../services/schoolService';
import {
  schoolRewardTiers,
  schoolTierForPoints,
} from '../../data/schoolRewards';
import type { MySchool } from '../../types';

export default function SchoolDashboardPage() {
  const { t } = useTranslation();
  const [school, setSchool] = useState<MySchool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getMySchool()
      .then(setSchool)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300"
        >
          {t('schools.dashboard.error')}
        </p>
      </div>
    );
  }

  const tier = schoolTierForPoints(school.totalPoints);
  const nextTier = schoolRewardTiers.find(
    (tr) => tr.pointsMin > school.totalPoints
  );
  const progress = nextTier
    ? Math.min(100, Math.round((school.totalPoints / nextTier.pointsMin) * 100))
    : 100;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900">
          <GraduationCap
            className="h-6 w-6 text-green-600 dark:text-green-400"
            aria-hidden="true"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {school.name}
          </h1>
          {school.location && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {school.location}
            </p>
          )}
        </div>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={Trophy}
          label={t('schools.dashboard.rank')}
          value={
            school.rank ? `#${school.rank}` : t('schools.dashboard.unranked')
          }
        />
        <StatCard
          icon={Star}
          label={t('schools.dashboard.avgPoints')}
          value={String(school.avgPoints)}
        />
        <StatCard
          icon={Star}
          label={t('schools.dashboard.totalPoints')}
          value={String(school.totalPoints)}
        />
        <StatCard
          icon={Users}
          label={t('schools.dashboard.members')}
          value={String(school.memberCount)}
        />
      </div>

      {/* Join code */}
      <section className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
        <KeyRound
          size={18}
          aria-hidden="true"
          className="text-green-600 dark:text-green-400"
        />
        <div>
          <p className="text-xs font-medium text-green-700 dark:text-green-300">
            {t('schools.dashboard.joinCodeLabel')}
          </p>
          <p className="font-mono text-lg font-bold tracking-wider text-green-900 dark:text-green-200">
            {school.code}
          </p>
        </div>
        <p className="w-full text-xs text-green-700 dark:text-green-300/90 sm:w-auto sm:flex-1">
          {t('schools.dashboard.joinCodeHint')}
        </p>
      </section>

      {/* Tier + progress */}
      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('schools.dashboard.tierTitle')}
          </h2>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium ${tier.colorClasses} dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200`}
          >
            {t(`schoolRewards.tiers.${tier.id}.name`)}
          </span>
        </div>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {t(`schoolRewards.tiers.${tier.id}.desc`)}
        </p>
        {nextTier ? (
          <div>
            <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
              {t('schools.dashboard.toNextTier', {
                points: nextTier.pointsMin - school.totalPoints,
                tier: t(`schoolRewards.tiers.${nextTier.id}.name`),
              })}
            </p>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2 rounded-full bg-green-500 transition-all"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={school.totalPoints}
                aria-valuemin={0}
                aria-valuemax={nextTier.pointsMin}
              />
            </div>
          </div>
        ) : (
          <p className="text-sm font-medium text-green-700 dark:text-green-400">
            {t('schools.dashboard.topTier')}
          </p>
        )}
      </section>

      {/* Members (read-only) */}
      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {t('schools.dashboard.membersTitle')}
        </h2>
        {school.members.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('schools.dashboard.noMembers')}
          </p>
        ) : (
          <ol className="space-y-2">
            {school.members.map((m, i) => (
              <li
                key={m.id}
                className="flex items-center gap-3 border-b border-gray-100 pb-2 last:border-0 dark:border-gray-700/50"
              >
                <span className="w-5 text-right text-xs font-semibold text-gray-400">
                  {i + 1}
                </span>
                <span className="flex-1 truncate text-sm text-gray-800 dark:text-gray-200">
                  {m.name}
                </span>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                  {t('schools.dashboard.pointsValue', { points: m.points })}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-800">
      <Icon
        size={18}
        aria-hidden="true"
        className="mx-auto mb-1 text-green-600 dark:text-green-400"
      />
      <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}

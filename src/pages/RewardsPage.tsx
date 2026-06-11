import { useState } from 'react';
import Container from '../components/layout/Container';
import {
  Award,
  Star,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Circle,
  TrendingUp,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  rewardTiers,
  rewardActivities,
  communityMilestones,
} from '../data/rewards';
import { PROFILE_OPTIONS } from '../data/profiles';
import type { RewardTier, UserProfile } from '../types';

const DEMO_POINTS = 130;

const categoryColors: Record<string, string> = {
  Action:
    'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  Training: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  Participation:
    'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  Community:
    'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  Business:
    'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  Education: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
  Ongoing: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300',
};

function TierCard({
  tier,
  isCurrent,
}: {
  tier: RewardTier;
  isCurrent: boolean;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(isCurrent);
  return (
    <div
      className={`rounded-xl border-2 transition-all ${tier.colorClasses} ${
        isCurrent
          ? 'shadow-md ring-2 ring-green-500 ring-offset-2'
          : 'opacity-70'
      }`}
    >
      <button
        className="flex w-full items-center justify-between p-4 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">
            {tier.icon}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold">{tier.greekName}</span>
              <span className="text-sm font-medium opacity-70">
                — {t(`rewardData.tiers.${tier.id}.name`)}
              </span>
              {isCurrent && (
                <span className="rounded-full bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
                  {t('rewards.yourTier')}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs opacity-70">
              {tier.pointsMax
                ? t('rewards.pointsRange', {
                    min: tier.pointsMin,
                    max: tier.pointsMax,
                  })
                : t('rewards.pointsMin', { min: tier.pointsMin })}
            </p>
          </div>
        </div>
        {open ? (
          <ChevronUp size={16} aria-hidden="true" />
        ) : (
          <ChevronDown size={16} aria-hidden="true" />
        )}
      </button>
      {open && (
        <div className="border-current/10 border-t px-4 pb-4 pt-3">
          <p className="mb-3 text-sm opacity-80">
            {t(`rewardData.tiers.${tier.id}.description`)}
          </p>
          <ul className="space-y-1.5">
            {(
              t(`rewardData.tiers.${tier.id}.rewards`, {
                returnObjects: true,
              }) as string[]
            ).map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm">
                <Star
                  size={13}
                  className="mt-0.5 flex-shrink-0 opacity-60"
                  aria-hidden="true"
                />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function RewardsPage() {
  const { t } = useTranslation();
  // J4: reward focus per audience profile (data lives in i18n profiles.<id>.*).
  const [profile, setProfile] = useState<UserProfile>('RESIDENT');
  const currentTier = rewardTiers.find(
    (tier) =>
      DEMO_POINTS >= tier.pointsMin &&
      (tier.pointsMax === null || DEMO_POINTS <= tier.pointsMax)
  )!;
  const nextTier =
    rewardTiers.find((tier) => tier.pointsMin > DEMO_POINTS) ?? null;
  const pointsToNext = nextTier ? nextTier.pointsMin - DEMO_POINTS : 0;
  const progressInTier = currentTier.pointsMax
    ? ((DEMO_POINTS - currentTier.pointsMin) /
        (currentTier.pointsMax - currentTier.pointsMin)) *
      100
    : 100;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 to-teal-700 py-14 text-white">
        <Container maxW="4xl">
          <div className="mb-3 flex items-center gap-2 text-sm text-green-100">
            <Award size={14} aria-hidden="true" />
            <span>{t('rewards.heroEyebrow')}</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white">
            {t('rewards.heroTitle')}
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed text-green-100">
            {t('rewards.heroSubtitle')}
          </p>
        </Container>
      </section>

      {/* Demo progress tracker */}
      <section className="border-b border-gray-200 bg-white py-10 dark:border-gray-700 dark:bg-gray-900">
        <Container maxW="3xl">
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
            <span className="font-semibold">{t('rewards.demoLabel')}</span>{' '}
            {t('rewards.demoText', { points: DEMO_POINTS })}
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                  {t('rewards.currentTier')}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl" aria-hidden="true">
                    {currentTier.icon}
                  </span>
                  <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {currentTier.greekName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t(`rewardData.tiers.${currentTier.id}.name`)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                  {t('rewards.totalPoints')}
                </p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                  {DEMO_POINTS}
                </p>
              </div>
            </div>

            <div className="mb-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>
                {currentTier.pointsMin} {t('rewards.ptsShort')}
              </span>
              {currentTier.pointsMax && (
                <span>
                  {currentTier.pointsMax} {t('rewards.ptsShort')}
                </span>
              )}
            </div>
            <div className="mb-3 h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-3 rounded-full bg-green-600 transition-all"
                style={{ width: `${Math.min(progressInTier, 100)}%` }}
                role="progressbar"
                aria-valuenow={DEMO_POINTS}
                aria-valuemin={currentTier.pointsMin}
                aria-valuemax={currentTier.pointsMax ?? DEMO_POINTS}
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
                    name: t(`rewardData.tiers.${nextTier.id}.name`),
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
        </Container>
      </section>

      {/* Tiers */}
      <section className="bg-gray-50 py-14 dark:bg-gray-900/50">
        <Container maxW="3xl">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              {t('rewards.tiersTitle')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('rewards.tiersSubtitle')}
            </p>
          </div>
          <div className="space-y-3">
            {rewardTiers.map((tier) => (
              <TierCard
                key={tier.id}
                tier={tier}
                isCurrent={tier.id === currentTier.id}
              />
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
            {t('rewards.tiersNote')}
          </p>
        </Container>
      </section>

      {/* Reward focus per profile (J4) — tabs switch the tailored focus text */}
      <section className="bg-white py-14 dark:bg-gray-900">
        <Container maxW="3xl">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              {t('profiles.rewardFocusTitle')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('rewards.profileFocusSubtitle')}
            </p>
          </div>
          <div
            role="tablist"
            aria-label={t('profiles.rewardFocusTitle')}
            className="mb-6 flex flex-wrap justify-center gap-2"
          >
            {PROFILE_OPTIONS.map((p) => {
              const active = profile === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setProfile(p.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                    active
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-gray-300 bg-white text-gray-600 hover:border-green-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  {t(`profiles.${p.id}.label`)}
                </button>
              );
            })}
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t(`profiles.${profile}.reward`)}
            </p>
          </div>
        </Container>
      </section>

      {/* How to earn points */}
      <section className="border-t border-gray-100 bg-white py-14 dark:border-gray-800 dark:bg-gray-900">
        <Container maxW="4xl">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              {t('rewards.earnTitle')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('rewards.earnSubtitle')}
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">
                    {t('rewards.thActivity')}
                  </th>
                  <th className="hidden px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300 sm:table-cell">
                    {t('rewards.thCategory')}
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">
                    {t('rewards.thPoints')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rewardActivities.map((activity, i) => (
                  <tr
                    key={activity.id}
                    className={`border-b border-gray-100 last:border-0 dark:border-gray-700/60 ${
                      i % 2 === 0
                        ? 'bg-white dark:bg-gray-900'
                        : 'bg-gray-50/50 dark:bg-gray-800/40'
                    }`}
                  >
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                      {t(`rewardData.activities.${activity.id}`)}
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          categoryColors[activity.category] ??
                          'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {t(`rewards.categories.${activity.category}`)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-green-700 dark:text-green-400">
                      +{activity.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-center text-xs text-gray-400 dark:text-gray-500">
            {t('rewards.earnNote')}
          </p>
        </Container>
      </section>

      {/* Community milestones */}
      <section className="bg-gray-50 py-14 dark:bg-gray-900/50">
        <Container maxW="4xl">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              {t('rewards.milestonesTitle')}
            </h2>
            <p className="mx-auto max-w-xl text-gray-600 dark:text-gray-300">
              {t('rewards.milestonesSubtitle')}
            </p>
          </div>
          <div className="space-y-4">
            {communityMilestones.map((milestone) => {
              const pct = Math.min(
                (milestone.current / milestone.target) * 100,
                100
              );
              return (
                <div
                  key={milestone.id}
                  className={`rounded-xl border p-5 ${
                    milestone.unlocked
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-2">
                      {milestone.unlocked ? (
                        <CheckCircle
                          size={18}
                          className="mt-0.5 flex-shrink-0 text-green-600 dark:text-green-400"
                          aria-hidden="true"
                        />
                      ) : (
                        <Circle
                          size={18}
                          className="mt-0.5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                      )}
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            milestone.unlocked
                              ? 'text-green-900 dark:text-green-300'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {t(`rewardData.milestones.${milestone.id}.label`)}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          {t('rewards.rewardPrefix')}{' '}
                          {t(`rewardData.milestones.${milestone.id}.reward`)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`whitespace-nowrap text-xs font-bold ${
                        milestone.unlocked
                          ? 'text-green-700 dark:text-green-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {milestone.unlocked
                        ? t('rewards.unlocked')
                        : `${milestone.current} / ${milestone.target}`}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        milestone.unlocked ? 'bg-green-500' : 'bg-teal-400'
                      }`}
                      style={{ width: `${pct}%` }}
                      role="progressbar"
                      aria-valuenow={milestone.current}
                      aria-valuemin={0}
                      aria-valuemax={milestone.target}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-center text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
            <span className="font-semibold">
              {t('rewards.milestonesNoteLabel')}
            </span>{' '}
            {t('rewards.milestonesNote')}
          </div>
        </Container>
      </section>
    </div>
  );
}

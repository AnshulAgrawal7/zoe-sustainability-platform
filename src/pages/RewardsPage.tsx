import { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import {
  Award,
  Star,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Circle,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { rewardActivities, communityMilestones } from '../data/rewards';
import { PROFILE_OPTIONS } from '../data/profiles';
import PointsBadge from '../components/ui/PointsBadge';
import { useRewardTiers, tierForPoints } from '../hooks/useRewardTiers';
import { useAuthStore } from '../stores/authStore';
import type { UiRewardTier, UserProfile } from '../types';

function TierCard({
  tier,
  isCurrent,
  role,
}: {
  tier: UiRewardTier;
  isCurrent: boolean;
  role: UserProfile;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(isCurrent);
  // Texts come from the admin-editable DB content (i18n as fallback) — already
  // language-resolved by useRewardTiers.
  const variant = tier.byRole[role];
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
                — {variant.name}
              </span>
              {isCurrent && (
                <span className="rounded-full bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
                  {t('rewards.yourTier')}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs opacity-70">
              <PointsBadge
                points={
                  tier.pointsMax
                    ? `${tier.pointsMin}–${tier.pointsMax}`
                    : `${tier.pointsMin}+`
                }
                iconSize={11}
              />
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
          <p className="mb-3 text-sm opacity-80">{variant.description}</p>
          <ul className="space-y-1.5">
            {variant.rewards.map((r) => (
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
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  // Admin-editable levels from the DB (static data + i18n as fallback).
  const { tiers } = useRewardTiers();
  // Role toggle for the tiers: each role has its own level names + rewards.
  // Defaults to the logged-in user's own role.
  const [profile, setProfile] = useState<UserProfile>(
    user?.profile ?? 'RESIDENT'
  );

  // A3: the current level/tier is shown ONLY for logged-in users, from their
  // REAL points (no static demo value anymore — A2).
  const points = user?.points ?? 0;
  const currentTier = isAuthenticated && tierForPoints(tiers, points);
  const nextTier = isAuthenticated
    ? (tiers.find((tier) => tier.pointsMin > points) ?? null)
    : null;
  const pointsToNext = nextTier ? nextTier.pointsMin - points : 0;
  const progressInTier =
    currentTier && currentTier.pointsMax
      ? ((points - currentTier.pointsMin) /
          (currentTier.pointsMax - currentTier.pointsMin)) *
        100
      : 100;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 to-teal-700 py-14 text-white">
        <Container>
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

      {/* Current level — logged-in: real tier + progress (A3); logged-out: two
          CTAs to register / log in (A4). The old static demo block is gone (A2). */}
      {currentTier ? (
        <section className="border-b border-gray-200 bg-white py-10 dark:border-gray-700 dark:bg-gray-900">
          <Container>
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
                        {/* Always the USER'S OWN role designation, regardless
                            of which role the tier list below is toggled to. */}
                        {currentTier.byRole[user?.profile ?? profile].name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                    {t('rewards.totalPoints')}
                  </p>
                  <PointsBadge
                    points={points}
                    iconSize={26}
                    className="justify-end gap-1.5 text-3xl font-bold text-green-700 dark:text-green-400"
                  />
                </div>
              </div>

              <div className="mb-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <PointsBadge points={currentTier.pointsMin} iconSize={11} />
                {currentTier.pointsMax && (
                  <PointsBadge points={currentTier.pointsMax} iconSize={11} />
                )}
              </div>
              <div className="mb-3 h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-3 rounded-full bg-green-600 transition-all"
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
                      name: nextTier.byRole[user?.profile ?? profile].name,
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
      ) : (
        <section className="border-b border-gray-200 bg-white py-12 dark:border-gray-700 dark:bg-gray-900">
          <Container>
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20 sm:p-8">
              <p className="max-w-2xl text-lg leading-relaxed text-gray-800 dark:text-gray-100">
                {t('rewards.guest.lead')}
              </p>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                >
                  {t('rewards.guest.registerCta')}
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('rewards.guest.haveAccount')}{' '}
                  <Link
                    to="/login"
                    className="font-medium text-green-700 underline transition-colors hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                  >
                    {t('rewards.guest.loginCta')}
                  </Link>
                </p>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Tiers */}
      <section className="bg-gray-50 py-14 dark:bg-gray-900/50">
        <Container>
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              {t('rewards.tiersTitle')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('rewards.tiersSubtitle')}
            </p>
          </div>

          {/* Role toggle — level names + rewards differ per role. */}
          <p className="mb-3 text-center text-sm text-gray-600 dark:text-gray-300">
            {t('rewards.rolePickerHint')}
          </p>
          <div
            role="tablist"
            aria-label={t('rewards.rolePickerLabel')}
            className="mb-8 flex flex-wrap justify-center gap-2"
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
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                    active
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-gray-300 bg-white text-gray-600 hover:border-green-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  <span aria-hidden="true">{p.emoji}</span>
                  {t(`profiles.${p.id}.label`)}
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            {tiers.map((tier) => (
              <TierCard
                key={tier.id}
                tier={tier}
                // "Your tier" only applies on the user's OWN role track — when
                // peeking at another role's levels, nothing is highlighted.
                isCurrent={
                  !!currentTier &&
                  tier.id === currentTier.id &&
                  user?.profile === profile
                }
                role={profile}
              />
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
            {t('rewards.tiersNote')}
          </p>
        </Container>
      </section>

      {/* How to earn points */}
      <section className="border-t border-gray-100 bg-white py-14 dark:border-gray-800 dark:bg-gray-900">
        <Container>
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
                    <td className="px-4 py-3 text-right">
                      <PointsBadge
                        points={
                          activity.pointsMax
                            ? `${activity.points}–${activity.pointsMax}`
                            : activity.points
                        }
                        showPlus
                        className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                      />
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
        <Container>
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
                        {/* A6: milestone as a point source — bonus on reaching it */}
                        <PointsBadge
                          points={milestone.points}
                          showPlus
                          className="mt-1.5 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        />
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

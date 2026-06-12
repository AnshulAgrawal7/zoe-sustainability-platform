import { useState, useEffect, useCallback } from 'react';
import Container from '../../components/layout/Container';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Award,
  CalendarDays,
  ArrowRight,
  Calendar,
  Loader2,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useToastStore } from '../../stores/toastStore';
import { getMe } from '../../services/userService';
import {
  getMyEventRegistrations,
  cancelEventRegistration,
} from '../../services/eventService';
import { useRewardTiers, tierForPoints } from '../../hooks/useRewardTiers';
import PointsBadge from '../../components/ui/PointsBadge';
import type { MyEventRegistration } from '../../types';

const LOCALES: Record<string, string> = {
  en: 'en-GB',
  el: 'el-GR',
  de: 'de-DE',
};

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const showToast = useToastStore((s) => s.showToast);
  const lang = i18n.language.slice(0, 2);
  const locale = LOCALES[lang] ?? 'en-GB';

  const [registrations, setRegistrations] = useState<MyEventRegistration[]>([]);
  const [badgeCount, setBadgeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const loadData = useCallback(() => {
    Promise.all([getMe(), getMyEventRegistrations()])
      .then(([me, regs]) => {
        setBadgeCount(me._count.userBadges);
        updateUser({ points: me.points });
        setRegistrations(regs);
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [updateUser]);

  useEffect(loadData, [loadData]);

  // Current ZOE tier from the user's REAL points; the level designation is
  // role-specific and admin-editable (DB via useRewardTiers, i18n fallback).
  const { tiers } = useRewardTiers();
  const points = user?.points ?? 0;
  const tier = tierForPoints(tiers, points);
  const profile = user?.profile ?? 'RESIDENT';

  function eventTitle(r: MyEventRegistration): string {
    if (!r.event) return r.eventId;
    if (lang === 'el') return r.event.titleEl;
    if (lang === 'de') return r.event.titleDe;
    return r.event.titleEn;
  }

  async function cancel(r: MyEventRegistration) {
    setCancelling(r.eventId);
    try {
      await cancelEventRegistration(r.eventId);
      showToast(t('events.rsvp.cancelled'));
      loadData();
    } catch {
      showToast(t('events.rsvp.error'));
    } finally {
      setCancelling(null);
    }
  }

  return (
    <Container className="py-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        {t('dashboard.title')}
      </h1>
      {user && (
        <p className="mb-8 text-gray-500 dark:text-gray-400">
          {t('dashboard.welcome', { name: user.name })}
        </p>
      )}

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Points + current level (role-specific designation) */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-xl dark:bg-amber-900/30"
              aria-hidden="true"
            >
              {tier?.icon}
            </span>
            <div>
              <PointsBadge
                points={points}
                iconSize={16}
                className="text-2xl font-bold text-gray-900 dark:text-white [&>svg]:text-amber-500"
              />
              {tier && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('dashboard.tierLine', {
                    tier: tier.greekName,
                    name: tier.byRole[profile].name,
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Award className="h-5 w-5 text-purple-500" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {badgeCount}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('dashboard.badgesEarned')}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <CalendarDays
                className="h-5 w-5 text-green-500"
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {registrations.length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('dashboard.eventsJoined')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Link
          to="/rewards"
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          {t('nav.rewards')} <ArrowRight size={14} aria-hidden="true" />
        </Link>
        <Link
          to="/events"
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t('nav.events')} <ArrowRight size={14} aria-hidden="true" />
        </Link>
        <Link
          to="/profile"
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t('nav.profile')} <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>

      {/* My events — DB-backed registrations (cancel works from here too) */}
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        {t('dashboard.yourEvents')}
      </h2>
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : registrations.length === 0 ? (
        <div className="rounded-xl bg-gray-50 p-8 text-center dark:bg-gray-800/50">
          <p className="mb-3 text-gray-500 dark:text-gray-400">
            {t('dashboard.noEvents')}
          </p>
          <Link
            to="/events"
            className="text-sm font-medium text-green-600 hover:underline"
          >
            {t('nav.events')} →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {registrations.map((r) => {
            const completed = r.event?.status === 'COMPLETED';
            return (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="min-w-0">
                  <Link
                    to={
                      r.event?.projectId
                        ? `/projects/${r.event.projectId}`
                        : '/events'
                    }
                    className="text-sm font-medium text-gray-800 hover:text-green-700 hover:underline dark:text-gray-200 dark:hover:text-green-400"
                  >
                    {eventTitle(r)}
                  </Link>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                    {r.event && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={12} aria-hidden="true" />
                        {new Date(r.event.date).toLocaleDateString(locale, {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2 py-0.5 font-semibold ${
                        completed
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}
                    >
                      {completed
                        ? t('events.statusCompleted')
                        : t('events.statusUpcoming')}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {completed ? (
                    <PointsBadge
                      points={r.pointsAwarded}
                      showPlus
                      className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                    />
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                      <PointsBadge points={r.pointsPending} showPlus />
                      {t('dashboard.pointsPending')}
                    </span>
                  )}
                  {!completed && (
                    <button
                      type="button"
                      onClick={() => void cancel(r)}
                      disabled={cancelling === r.eventId}
                      aria-label={`${t('events.rsvp.cancelCta')}: ${eventTitle(r)}`}
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-rose-300 px-3 py-2 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:opacity-60 dark:border-rose-700 dark:text-rose-400 dark:hover:bg-rose-900/20"
                    >
                      {cancelling === r.eventId ? (
                        <Loader2
                          size={13}
                          className="motion-safe:animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <X size={13} aria-hidden="true" />
                      )}
                      {t('events.rsvp.cancelCta')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
}

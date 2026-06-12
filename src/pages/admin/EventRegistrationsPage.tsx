import { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Calendar,
  Users,
  User as UserIcon,
  Mail,
  AlertCircle,
} from 'lucide-react';
import { getEventRegistrationsAdmin } from '../../services/eventService';
import PointsBadge from '../../components/ui/PointsBadge';
import type { ApiEvent, AdminEventRegistration } from '../../types';

const LOCALES: Record<string, string> = {
  en: 'en-GB',
  el: 'el-GR',
  de: 'de-DE',
};

// Admin attendance overview for ONE event: members (with points status) and
// guests, newest first. Read-only — registering/cancelling stays with the
// participants themselves.
export default function EventRegistrationsPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const lang = i18n.language.slice(0, 2);
  const locale = LOCALES[lang] ?? 'en-GB';

  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [registrations, setRegistrations] = useState<AdminEventRegistration[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getEventRegistrationsAdmin(id)
      .then((data) => {
        setEvent(data.event);
        setRegistrations(data.registrations);
      })
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  function title(e: ApiEvent): string {
    if (lang === 'el') return e.titleEl;
    if (lang === 'de') return e.titleDe;
    return e.titleEn;
  }

  if (loading) {
    return (
      <Container className="py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container className="py-12 text-center">
        <AlertCircle
          size={40}
          className="mx-auto mb-3 text-gray-400"
          aria-hidden="true"
        />
        <p className="mb-4 text-gray-500 dark:text-gray-400">
          {t('common.error')}
        </p>
        <Link
          to="/admin/events"
          className="font-medium text-green-700 underline dark:text-green-400"
        >
          ← {t('adminEvents.title')}
        </Link>
      </Container>
    );
  }

  const completed = event.status === 'COMPLETED';

  return (
    <Container className="py-8">
      <Link
        to="/admin/events"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        {t('adminEvents.title')}
      </Link>

      {/* Event summary */}
      <div className="mb-6">
        <h1 className="mb-2 flex flex-wrap items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
          {title(event)}
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${
              completed
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
            }`}
          >
            {completed
              ? t('events.statusCompleted')
              : t('events.statusUpcoming')}
          </span>
        </h1>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={14} aria-hidden="true" />
            {new Date(event.date).toLocaleDateString(locale, {
              weekday: 'short',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users size={14} aria-hidden="true" />
            {t('adminEvents.registeredCount', { count: registrations.length })}
            {event.capacity != null && ` / ${event.capacity}`}
          </span>
          <PointsBadge points={event.rewardPoints} showPlus />
        </p>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        {t('adminEventRegs.title')}
      </h2>

      {registrations.length === 0 ? (
        <p className="rounded-xl bg-gray-50 p-8 text-center text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
          {t('adminEventRegs.empty')}
        </p>
      ) : (
        <ul className="space-y-3">
          {registrations.map((r) => {
            const isMember = !!r.user;
            const name = r.user?.name ?? r.guestName ?? '—';
            const email = r.user?.email ?? r.guestEmail ?? '';
            return (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                    <UserIcon
                      size={14}
                      aria-hidden="true"
                      className="text-gray-400"
                    />
                    {name}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        isMember
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {isMember
                        ? t('adminEventRegs.member')
                        : t('adminEventRegs.guest')}
                    </span>
                  </p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                    {email && (
                      <span className="inline-flex items-center gap-1">
                        <Mail size={12} aria-hidden="true" />
                        {email}
                      </span>
                    )}
                    <time dateTime={r.createdAt}>
                      {new Date(r.createdAt).toLocaleDateString(locale, {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </time>
                  </p>
                </div>
                {isMember &&
                  (r.pointsAwarded > 0 ? (
                    <PointsBadge
                      points={r.pointsAwarded}
                      showPlus
                      className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                    />
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                      <PointsBadge points={event.rewardPoints} showPlus />
                      {t('dashboard.pointsPending')}
                    </span>
                  ))}
              </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
}

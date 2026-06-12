import { useState, useEffect } from 'react';
import Container from '../components/layout/Container';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getEvents } from '../services/eventService';
import EventRegister from '../components/events/EventRegister';
import EntityImage from '../components/ui/EntityImage';
import PointsBadge from '../components/ui/PointsBadge';
import AccountPointsHint from '../components/ui/AccountPointsHint';
import { useAuthStore } from '../stores/authStore';
import { projectCategoryVisual } from '../components/ui/categoryVisuals';
import type { ApiEvent, ApiProjectCategory } from '../types';

const CATEGORIES: ApiProjectCategory[] = [
  'ENVIRONMENT',
  'MOBILITY',
  'COMMUNITY',
  'EDUCATION',
  'CULTURE',
];

const LOCALES: Record<string, string> = {
  en: 'en-GB',
  el: 'el-GR',
  de: 'de-DE',
};

function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(iso: string, locale: string): string {
  return new Date(iso).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function EventsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2);
  const locale = LOCALES[lang] ?? 'en-GB';
  const isAdmin = useAuthStore((s) => s.isAdmin);

  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  // Period filter (F3): inclusive ISO date strings (yyyy-mm-dd); '' = open end.
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Reloadable so register/cancel can refresh counts + registeredByMe flags.
  const loadEvents = () => {
    getEvents()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  };
  useEffect(loadEvents, []);

  function title(e: ApiEvent): string {
    if (lang === 'el') return e.titleEl;
    if (lang === 'de') return e.titleDe;
    return e.titleEn;
  }
  function description(e: ApiEvent): string {
    if (lang === 'el') return e.descriptionEl;
    if (lang === 'de') return e.descriptionDe;
    return e.descriptionEn;
  }
  function projectTitle(e: ApiEvent): string {
    if (!e.project) return '';
    if (lang === 'el') return e.project.titleEl;
    if (lang === 'de') return e.project.titleDe;
    return e.project.titleEn;
  }

  const fromTs = fromDate ? new Date(`${fromDate}T00:00:00`).getTime() : null;
  // Include the whole "to" day.
  const toTs = toDate ? new Date(`${toDate}T23:59:59`).getTime() : null;

  const visible = events.filter((e) => {
    if (categoryFilter && e.category !== categoryFilter) return false;
    const ts = new Date(e.date).getTime();
    if (fromTs != null && ts < fromTs) return false;
    if (toTs != null && ts > toTs) return false;
    return true;
  });

  const periodActive = Boolean(fromDate || toDate);

  return (
    <Container className="py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          {t('events.title')}
        </h1>
        <p className="max-w-2xl text-gray-600 dark:text-gray-300">
          {t('events.intro')}
        </p>
        <p className="mt-2 inline-block rounded border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
          {t('events.demoNote')}
        </p>
      </div>

      {/* Account hint — points/rewards for attending require an account. */}
      <AccountPointsHint className="mb-6" />

      {/* Category filter */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {t('events.filterBy')}
        </span>
        <button
          onClick={() => setCategoryFilter('')}
          className={`rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
            !categoryFilter
              ? 'border-green-600 bg-green-600 text-white'
              : 'border-gray-300 bg-white text-gray-600 hover:border-green-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          {t('events.all')}
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c === categoryFilter ? '' : c)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
              categoryFilter === c
                ? 'border-green-600 bg-green-600 text-white'
                : 'border-gray-300 bg-white text-gray-600 hover:border-green-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {t(`projects.category.${c}`)}
          </button>
        ))}
      </div>

      {/* Period filter (F3) */}
      <div className="mb-6 flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {t('events.periodLabel')}
        </span>
        <div className="flex flex-col">
          <label
            htmlFor="events-from"
            className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400"
          >
            {t('events.dateFrom')}
          </label>
          <input
            id="events-from"
            type="date"
            value={fromDate}
            max={toDate || undefined}
            onChange={(e) => setFromDate(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="events-to"
            className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400"
          >
            {t('events.dateTo')}
          </label>
          <input
            id="events-to"
            type="date"
            value={toDate}
            min={fromDate || undefined}
            onChange={(e) => setToDate(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        {periodActive && (
          <button
            onClick={() => {
              setFromDate('');
              setToDate('');
            }}
            className="text-sm text-green-700 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-green-400"
          >
            {t('events.clearPeriod')}
          </button>
        )}
      </div>

      {loading ? (
        <p className="py-16 text-center text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : (
        <>
          <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
            {t('events.eventsFound', { count: visible.length })}
          </p>

          {visible.length === 0 ? (
            <div className="py-16 text-center text-gray-500 dark:text-gray-400">
              <p>{t('events.noEventsMatch')}</p>
              <button
                onClick={() => {
                  setCategoryFilter('');
                  setFromDate('');
                  setToDate('');
                }}
                className="mt-2 text-sm text-green-700 underline dark:text-green-400"
              >
                {t('events.showAll')}
              </button>
            </div>
          ) : (
            // F2: three cards per row (responsive 1 / 2 / 3).
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((event) => {
                const capacity = event.capacity;
                const registered = event.registeredCount ?? 0;
                const spotsLeft =
                  capacity != null ? capacity - registered : null;
                const fillPercent =
                  capacity != null && capacity > 0
                    ? Math.round((registered / capacity) * 100)
                    : 0;
                const colorClass = projectCategoryVisual(event.category).badge;

                return (
                  <article
                    key={event.id}
                    className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                  >
                    {/* Cover preview — empty imageUrl falls back to the category
                        gradient + icon (one source). */}
                    <EntityImage
                      src={event.imageUrl}
                      alt={title(event)}
                      category={event.category}
                      className="h-44 w-full"
                    />
                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
                        >
                          {t(`projects.category.${event.category}`)}
                        </span>
                        {event.projectId && (
                          <Link
                            to={`/projects/${event.projectId}`}
                            className="text-xs text-green-700 hover:underline dark:text-green-400"
                          >
                            {t('events.relatedProject', {
                              project: projectTitle(event),
                            })}
                          </Link>
                        )}
                        {event.rewardPoints > 0 && (
                          <PointsBadge
                            points={event.rewardPoints}
                            showPlus
                            className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                          />
                        )}
                        {event.status === 'COMPLETED' && (
                          <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                            {t('events.statusCompleted')}
                          </span>
                        )}
                      </div>
                      <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                        {title(event)}
                      </h2>
                      <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                        {description(event)}
                      </p>

                      {/* Meta */}
                      <div className="mb-4 flex flex-col gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} aria-hidden="true" />
                          <span>{formatDate(event.date, locale)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} aria-hidden="true" />
                          <span>{formatTime(event.date, locale)}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin size={14} aria-hidden="true" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Capacity */}
                      {capacity != null && (
                        <div className="mb-4">
                          <div className="mb-1.5 flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                            <Users size={14} aria-hidden="true" />
                            <span className="text-sm font-medium">
                              {registered}/{capacity}
                            </span>
                          </div>
                          <div className="mb-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className={`h-1.5 rounded-full ${
                                fillPercent >= 90
                                  ? 'bg-rose-500'
                                  : fillPercent >= 70
                                    ? 'bg-amber-500'
                                    : 'bg-green-500'
                              }`}
                              style={{ width: `${fillPercent}%` }}
                            />
                          </div>
                          <p
                            className={`text-xs font-medium ${
                              spotsLeft != null && spotsLeft <= 5
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            {spotsLeft != null && spotsLeft <= 0
                              ? t('events.fullyBooked')
                              : t('events.spotsLeft', {
                                  count: spotsLeft ?? 0,
                                })}
                          </p>
                        </div>
                      )}

                      {/* Registration — open to guests (no account needed).
                          Also shown when completed (status note), when the
                          user is registered (cancel option) even if full, and
                          always for admins (manage-registrations link). */}
                      {(isAdmin ||
                        event.status === 'COMPLETED' ||
                        event.registeredByMe ||
                        spotsLeft == null ||
                        spotsLeft > 0) && (
                        <div className="mt-auto border-t border-gray-100 pt-4 dark:border-gray-700">
                          <EventRegister
                            eventId={event.id}
                            rewardPoints={event.rewardPoints}
                            registered={event.registeredByMe}
                            completed={event.status === 'COMPLETED'}
                            onChanged={loadEvents}
                          />
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Note */}
      <div className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-5 text-center dark:border-gray-700 dark:bg-gray-800/50">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {t('events.suggestText')}{' '}
          <Link
            to="/participate"
            className="font-medium text-green-700 hover:underline dark:text-green-400"
          >
            {t('events.suggestLink')}
          </Link>
        </p>
      </div>
    </Container>
  );
}

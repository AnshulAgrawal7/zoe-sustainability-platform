import { useState, useEffect } from 'react';
import Container from '../components/layout/Container';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getEvents } from '../services/eventService';
import EventRegister from '../components/events/EventRegister';
import EntityImage from '../components/ui/EntityImage';
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

  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

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

  const visible = events.filter(
    (e) => !categoryFilter || e.category === categoryFilter
  );

  return (
    <Container maxW="5xl" className="py-10">
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

      {/* Filter */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
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
                onClick={() => setCategoryFilter('')}
                className="mt-2 text-sm text-green-700 underline dark:text-green-400"
              >
                {t('events.showAll')}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
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
                    className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6"
                  >
                    {/* Cover preview — always rendered: an empty imageUrl slot
                        falls back to the intentional category gradient + icon
                        (one source), so imageless rows look deliberate, not flat. */}
                    <EntityImage
                      src={event.imageUrl}
                      alt={title(event)}
                      category={event.category}
                      className="mb-4 h-44 w-full rounded-lg"
                    />
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
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
                        </div>
                        <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                          {title(event)}
                        </h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                          {description(event)}
                        </p>

                        {/* Meta row */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
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
                      </div>

                      {/* Capacity + CTA */}
                      {capacity != null && (
                        <div className="flex-shrink-0 sm:w-44">
                          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-center dark:border-gray-700 dark:bg-gray-900/40">
                            <div className="mb-2 flex items-center justify-center gap-1.5 text-gray-600 dark:text-gray-300">
                              <Users size={14} aria-hidden="true" />
                              <span className="text-sm font-medium">
                                {registered}/{capacity}
                              </span>
                            </div>
                            <div className="mb-2 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
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
                        </div>
                      )}
                    </div>

                    {/* Registration — open to guests (no account needed) */}
                    {(spotsLeft == null || spotsLeft > 0) && (
                      <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700">
                        <EventRegister
                          eventId={event.id}
                          rewardPoints={event.rewardPoints}
                        />
                      </div>
                    )}
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

import { useState, useEffect } from 'react';
import Container from '../components/layout/Container';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  MapPin,
  Users,
  AlertCircle,
  Calendar,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { getEvent } from '../services/eventService';
import EventRegister from '../components/events/EventRegister';
import EntityImage from '../components/ui/EntityImage';
import PointsBadge from '../components/ui/PointsBadge';
import AccountPointsHint from '../components/ui/AccountPointsHint';
import Lightbox from '../components/news/Lightbox';
import { useAuthStore } from '../stores/authStore';
import { projectCategoryVisual } from '../components/ui/categoryVisuals';
import type { ApiEvent } from '../types';

const DATE_LOCALES: Record<string, string> = {
  en: 'en-GB',
  el: 'el-GR',
  de: 'de-DE',
};

export default function EventDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lang = i18n.language.slice(0, 2);
  const locale = DATE_LOCALES[lang] ?? 'en-GB';
  const isAdmin = useAuthStore((s) => s.isAdmin);

  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Reloadable so register/cancel refreshes counts + registeredByMe flags.
  const loadEvent = () => {
    if (!id) return;
    getEvent(id)
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  };
  useEffect(loadEvent, [id]);

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

  if (loading) {
    return (
      <Container className="py-20 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container className="py-20 text-center">
        <AlertCircle
          size={48}
          className="mx-auto mb-4 text-gray-400"
          aria-hidden="true"
        />
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          {t('common.error')}
        </h1>
        <Link
          to="/events"
          className="font-medium text-green-700 underline dark:text-green-400"
        >
          ← {t('events.title')}
        </Link>
      </Container>
    );
  }

  const dateStr = new Date(event.date).toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timeStr = new Date(event.date).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
  const capacity = event.capacity;
  const registered = event.registeredCount ?? 0;
  const spotsLeft = capacity != null ? capacity - registered : null;
  const fillPercent =
    capacity != null && capacity > 0
      ? Math.round((registered / capacity) * 100)
      : 0;
  const colorClass = projectCategoryVisual(event.category).badge;

  return (
    <Container className="py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        {t('common.back')}
      </button>

      {/* Hero card */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        {event.imageUrl && (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label={t('feed.gallery.label')}
            className="block w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-500"
          >
            <EntityImage
              src={event.imageUrl}
              alt={title(event)}
              category={event.category}
              className="h-56 w-full sm:h-72"
            />
          </button>
        )}
        <div className="p-6 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${colorClass}`}
            >
              {t(`projects.category.${event.category}`)}
            </span>
            {event.status === 'COMPLETED' ? (
              <span className="rounded-full bg-gray-200 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {t('events.statusCompleted')}
              </span>
            ) : (
              <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {t('events.statusUpcoming')}
              </span>
            )}
            {event.rewardPoints > 0 && (
              <PointsBadge
                points={event.rewardPoints}
                showPlus
                className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
              />
            )}
          </div>

          <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            {title(event)}
          </h1>

          <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} aria-hidden="true" />
              {dateStr}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} aria-hidden="true" />
              {timeStr}
            </span>
            {event.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} aria-hidden="true" />
                {event.location}
              </span>
            )}
          </div>

          <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
            {description(event)}
          </p>

          {event.projectId && (
            <Link
              to={`/projects/${event.projectId}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:underline dark:text-green-400"
            >
              <ArrowRight size={14} aria-hidden="true" />
              {t('events.relatedProject', { project: projectTitle(event) })}
            </Link>
          )}
        </div>
      </div>

      {/* Capacity + registration */}
      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 sm:p-8">
        <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
          {t('eventDetail.registerHeading')}
        </h2>

        <AccountPointsHint className="mb-5" />

        {capacity != null && (
          <div className="mb-5 max-w-sm">
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
                : t('events.spotsLeft', { count: spotsLeft ?? 0 })}
            </p>
          </div>
        )}

        {isAdmin ||
        event.status === 'COMPLETED' ||
        event.registeredByMe ||
        spotsLeft == null ||
        spotsLeft > 0 ? (
          <div className="border-t border-gray-100 pt-4 dark:border-gray-700">
            <EventRegister
              eventId={event.id}
              rewardPoints={event.rewardPoints}
              registered={event.registeredByMe}
              completed={event.status === 'COMPLETED'}
              onChanged={loadEvent}
            />
          </div>
        ) : (
          <p className="border-t border-gray-100 pt-4 text-sm font-medium text-rose-600 dark:border-gray-700 dark:text-rose-400">
            {t('events.fullyBooked')}
          </p>
        )}
      </section>

      {lightboxOpen && event.imageUrl && (
        <Lightbox
          images={[
            {
              url: event.imageUrl,
              alt: title(event),
              width: null,
              height: null,
            },
          ]}
          startIndex={0}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </Container>
  );
}

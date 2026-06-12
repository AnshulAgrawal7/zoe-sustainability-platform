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
  Boxes,
  Cog,
  Sparkles,
  GraduationCap,
  ArrowRight,
  BarChart3,
} from 'lucide-react';
import { getProject } from '../services/projectService';
import { getEvents } from '../services/eventService';
import { getLearningResources } from '../services/learnService';
import EventRegister from '../components/events/EventRegister';
import EntityImage from '../components/ui/EntityImage';
import SdgIcon from '../components/ui/SdgIcon';
import PointsBadge from '../components/ui/PointsBadge';
import Lightbox from '../components/news/Lightbox';
import { formatNumber } from '../utils/format';
import type { ApiProject, ApiEvent, LearningResource } from '../types';

const DATE_LOCALES: Record<string, string> = {
  en: 'en-GB',
  el: 'el-GR',
  de: 'de-DE',
};

export default function ProjectDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lang = i18n.language.slice(0, 2);

  const [project, setProject] = useState<ApiProject | null>(null);
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [learn, setLearn] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);
  // D3: full-size cover image in the shared Lightbox (reused, not rewritten).
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Events for this project (non-blocking; failure just hides the section).
  // Reloadable so register/cancel can refresh counts + registeredByMe flags.
  const loadEvents = () => {
    if (!id) return;
    getEvents({ projectId: id })
      .then(setEvents)
      .catch(() => setEvents([]));
  };

  useEffect(() => {
    if (!id) return;
    async function load() {
      setLoading(true);
      try {
        setProject(await getProject(id!));
      } catch {
        setProject(null);
      } finally {
        setLoading(false);
      }
    }
    void load();
    loadEvents();
    // Linked learning resources (non-blocking; failure just hides the section).
    getLearningResources({ projectId: id })
      .then(setLearn)
      .catch(() => setLearn([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function getTitle(): string {
    if (!project) return '';
    if (lang === 'el') return project.titleEl;
    if (lang === 'de') return project.titleDe;
    return project.titleEn;
  }

  function getDescription(): string {
    if (!project) return '';
    if (lang === 'el') return project.descriptionEl;
    if (lang === 'de') return project.descriptionDe;
    return project.descriptionEn;
  }

  function parseSdgs(): number[] {
    if (!project) return [];
    try {
      return JSON.parse(project.sdgIds) as number[];
    } catch {
      return [];
    }
  }

  // Value chain (Block 5): language-appropriate text for one base field.
  function valueChain(
    base: 'inputResources' | 'keyActivities' | 'outputResults'
  ): string {
    if (!project) return '';
    const suffix = lang === 'el' ? 'El' : lang === 'de' ? 'De' : 'En';
    return (project[`${base}${suffix}` as keyof ApiProject] as string) ?? '';
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

  if (!project) {
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
          to="/projects"
          className="font-medium text-green-700 underline dark:text-green-400"
        >
          ← {t('nav.projects')}
        </Link>
      </Container>
    );
  }

  const sdgs = parseSdgs();
  const metrics = project.metrics ?? [];
  const metricLabel = (m: (typeof metrics)[number]): string =>
    lang === 'el' ? m.labelEl : lang === 'de' ? m.labelDe : m.labelEn;
  // Locale-aware display for raw figures (thousands separators + decimals).
  const fmt = (v: number | string) => {
    const n = typeof v === 'number' ? v : parseFloat(v);
    return Number.isFinite(n) ? formatNumber(n, i18n.language) : String(v);
  };
  const participantCount = project._count?.participations ?? 0;
  const valueChainSteps = [
    {
      key: 'input',
      Icon: Boxes,
      label: t('projects.valueChain.input'),
      text: valueChain('inputResources'),
    },
    {
      key: 'activity',
      Icon: Cog,
      label: t('projects.valueChain.activity'),
      text: valueChain('keyActivities'),
    },
    {
      key: 'output',
      Icon: Sparkles,
      label: t('projects.valueChain.output'),
      text: valueChain('outputResults'),
    },
  ].filter((s) => s.text);
  const categoryColor =
    {
      ENVIRONMENT: 'bg-green-500',
      MOBILITY: 'bg-blue-500',
      COMMUNITY: 'bg-orange-500',
      EDUCATION: 'bg-purple-500',
      CULTURE: 'bg-teal-500',
    }[project.category] ?? 'bg-gray-400';

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
        {/* Header image — only when set (no big empty placeholder on detail).
            Click opens the full-size Lightbox (D3). */}
        {project.imageUrl && (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label={t('feed.gallery.label')}
            className="block w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-500"
          >
            <EntityImage
              src={project.imageUrl}
              alt={getTitle()}
              category={project.category}
              className="h-56 w-full sm:h-72"
            />
          </button>
        )}
        <div className={`h-2 ${categoryColor}`} aria-hidden="true" />
        <div className="p-6 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:bg-gray-700 dark:text-gray-400">
              {t(`projects.category.${project.category}`)}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                project.status === 'OPEN'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {t(`projects.status.${project.status}`)}
            </span>
          </div>

          <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            {getTitle()}
          </h1>

          <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            {project.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} aria-hidden="true" />
                {project.location}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Users size={14} aria-hidden="true" />
              {t('projects.participants', { count: participantCount })}
            </span>
          </div>

          <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
            {getDescription()}
          </p>

          {/* SDG tiles — official UN icons linking to the internal SDG page (H3) */}
          {sdgs.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {sdgs.map((n) => (
                <SdgIcon key={n} number={n} size={64} linkToDashboard />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Events linked to this project */}
      {events.length > 0 && (
        <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 sm:p-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
            <Calendar
              size={18}
              aria-hidden="true"
              className="text-green-600 dark:text-green-400"
            />
            {t('projects.eventsTitle')}
          </h2>
          <ul className="space-y-4">
            {events.map((ev) => {
              const evTitle =
                lang === 'el'
                  ? ev.titleEl
                  : lang === 'de'
                    ? ev.titleDe
                    : ev.titleEn;
              const evDesc =
                lang === 'el'
                  ? ev.descriptionEl
                  : lang === 'de'
                    ? ev.descriptionDe
                    : ev.descriptionEn;
              const dloc = DATE_LOCALES[lang] ?? 'en-GB';
              const dateStr = new Date(ev.date).toLocaleDateString(dloc, {
                weekday: 'short',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              });
              const timeStr = new Date(ev.date).toLocaleTimeString(dloc, {
                hour: '2-digit',
                minute: '2-digit',
              });
              const capacity = ev.capacity;
              const registered = ev.registeredCount ?? 0;
              const spotsLeft = capacity != null ? capacity - registered : null;
              return (
                <li
                  key={ev.id}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {evTitle}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                    {evDesc}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} aria-hidden="true" />
                      {dateStr}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} aria-hidden="true" />
                      {timeStr}
                    </span>
                    {ev.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} aria-hidden="true" />
                        {ev.location}
                      </span>
                    )}
                    {capacity != null && (
                      <span className="flex items-center gap-1.5">
                        <Users size={14} aria-hidden="true" />
                        {registered}/{capacity}
                      </span>
                    )}
                    {ev.rewardPoints > 0 && (
                      <PointsBadge
                        points={ev.rewardPoints}
                        showPlus
                        className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                      />
                    )}
                  </div>
                  {(ev.status === 'COMPLETED' ||
                    ev.registeredByMe ||
                    spotsLeft == null ||
                    spotsLeft > 0) && (
                    <div className="mt-3 border-t border-gray-100 pt-3 dark:border-gray-700">
                      <EventRegister
                        eventId={ev.id}
                        rewardPoints={ev.rewardPoints}
                        registered={ev.registeredByMe}
                        completed={ev.status === 'COMPLETED'}
                        onChanged={loadEvents}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Documented impact (Z1) — shown ONLY for COMPLETED projects (H2).
          Active/ongoing projects don't render this block. */}
      {project.status === 'COMPLETED' && (
        <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 sm:p-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
            <BarChart3
              size={18}
              aria-hidden="true"
              className="text-green-600 dark:text-green-400"
            />
            {t('projImpact.heading')}
          </h2>
          {metrics.length > 0 ? (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {metrics.map((m) => (
                <li
                  key={m.id}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40"
                >
                  <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                    {fmt(m.value)}
                    {m.unit && (
                      <span className="ml-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                        {m.unit}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {metricLabel(m)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('projImpact.notMeasured')}
            </p>
          )}
        </section>
      )}

      {/* Value chain — Input -> Activity -> Result (Block 5). Only when filled. */}
      {valueChainSteps.length > 0 && (
        <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 sm:p-8">
          <h2 className="mb-5 text-lg font-bold text-gray-900 dark:text-white">
            {t('projects.valueChain.heading')}
          </h2>
          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {valueChainSteps.map(({ key, Icon, label, text }) => (
              <li
                key={key}
                className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40"
              >
                <div className="mb-2 flex items-center gap-2 text-green-700 dark:text-green-400">
                  <Icon size={18} aria-hidden="true" />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    {label}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {text}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Linked learning resources — "learn more about this topic" */}
      {learn.length > 0 && (
        <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 sm:p-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
            <GraduationCap
              size={18}
              aria-hidden="true"
              className="text-green-600 dark:text-green-400"
            />
            {t('learn.title')}
          </h2>
          <ul className="space-y-2">
            {learn.map((r) => (
              <li key={r.id}>
                <Link
                  to={`/learn/${r.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:underline dark:text-green-400"
                >
                  <ArrowRight size={14} aria-hidden="true" />
                  {lang === 'el'
                    ? r.titleEl
                    : lang === 'de'
                      ? r.titleDe
                      : r.titleEn}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {lightboxOpen && project.imageUrl && (
        <Lightbox
          images={[
            {
              url: project.imageUrl,
              alt: getTitle(),
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

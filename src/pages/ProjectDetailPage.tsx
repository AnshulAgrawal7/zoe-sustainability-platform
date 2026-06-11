import { useState, useEffect } from 'react';
import Container from '../components/layout/Container';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  MapPin,
  Users,
  Star,
  CheckCircle,
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
import { getProject, participate, withdraw } from '../services/projectService';
import { getEvents } from '../services/eventService';
import { getLearningResources } from '../services/learnService';
import { getMe } from '../services/userService';
import EventRegister from '../components/events/EventRegister';
import EntityImage from '../components/ui/EntityImage';
import { useAuthStore } from '../stores/authStore';
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

  const { isAuthenticated, user, updateUser } = useAuthStore();

  const [project, setProject] = useState<ApiProject | null>(null);
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [learn, setLearn] = useState<LearningResource[]>([]);
  const [isParticipating, setIsParticipating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!id) return;
    async function load() {
      setLoading(true);
      try {
        const [proj, participating] = await Promise.all([
          getProject(id!),
          isAuthenticated
            ? getMe().then((me) =>
                me.participations.some((p) => p.projectId === id)
              )
            : Promise.resolve(false),
        ]);
        setProject(proj);
        setIsParticipating(participating);
      } catch {
        setProject(null);
      } finally {
        setLoading(false);
      }
    }
    void load();
    // Events for this project (non-blocking; failure just hides the section).
    getEvents({ projectId: id })
      .then(setEvents)
      .catch(() => setEvents([]));
    // Linked learning resources (non-blocking; failure just hides the section).
    getLearningResources({ projectId: id })
      .then(setLearn)
      .catch(() => setLearn([]));
  }, [id, isAuthenticated]);

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

  async function handleParticipate() {
    if (!id || !project) return;
    setActionLoading(true);
    setActionMessage(null);
    try {
      const { pointsAwarded } = await participate(id);
      setIsParticipating(true);
      setProject((prev) =>
        prev
          ? {
              ...prev,
              _count: {
                participations: (prev._count?.participations ?? 0) + 1,
              },
            }
          : prev
      );
      updateUser({ points: (user?.points ?? 0) + pointsAwarded });
      setActionMessage({
        type: 'success',
        text: t('projects.joinSuccess', { points: pointsAwarded }),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('common.error');
      setActionMessage({ type: 'error', text: msg });
    } finally {
      setActionLoading(false);
    }
  }

  async function handleWithdraw() {
    if (!id) return;
    setActionLoading(true);
    setActionMessage(null);
    try {
      await withdraw(id);
      setIsParticipating(false);
      setProject((prev) =>
        prev
          ? {
              ...prev,
              _count: {
                participations: Math.max(
                  0,
                  (prev._count?.participations ?? 1) - 1
                ),
              },
            }
          : prev
      );
      setActionMessage({
        type: 'success',
        text: t('projects.withdrawSuccess'),
      });
    } catch {
      setActionMessage({ type: 'error', text: t('common.error') });
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <Container maxW="4xl" className="py-20 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container maxW="4xl" className="py-20 text-center">
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
    <Container maxW="4xl" className="py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        {t('common.back')}
      </button>

      {/* Hero card */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        {/* Header image — only when set (no big empty placeholder on detail) */}
        {project.imageUrl && (
          <EntityImage
            src={project.imageUrl}
            alt={getTitle()}
            category={project.category}
            className="h-56 w-full sm:h-72"
          />
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
            <span className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
              <Star size={14} aria-hidden="true" />
              {t('projects.points', { points: project.rewardPoints })}
            </span>
          </div>

          <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
            {getDescription()}
          </p>

          {/* Provenance (programme fact, not measured impact) */}
          {project.sourceNote && (
            <p className="mb-6 text-xs text-gray-500 dark:text-gray-400">
              {t('projects.source')}: {project.sourceNote}
            </p>
          )}

          {/* SDG badges */}
          {sdgs.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {sdgs.map((n) => (
                <span
                  key={n}
                  className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  SDG {n}
                </span>
              ))}
            </div>
          )}

          {/* Action message */}
          {actionMessage && (
            <div
              role={actionMessage.type === 'error' ? 'alert' : 'status'}
              className={`mb-4 flex items-center gap-2 rounded-lg p-3 text-sm ${
                actionMessage.type === 'success'
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
              }`}
            >
              {actionMessage.type === 'success' && (
                <CheckCircle size={16} aria-hidden="true" />
              )}
              {actionMessage.text}
            </div>
          )}

          {/* Participate button */}
          {project.status === 'OPEN' && (
            <div className="flex flex-wrap gap-3">
              {isAuthenticated ? (
                isParticipating ? (
                  <button
                    onClick={() => void handleWithdraw()}
                    disabled={actionLoading}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <CheckCircle
                      size={16}
                      className="text-green-500"
                      aria-hidden="true"
                    />
                    {actionLoading
                      ? t('common.loading')
                      : t('projects.participating')}{' '}
                    — {t('projects.withdraw')}
                  </button>
                ) : (
                  <button
                    onClick={() => void handleParticipate()}
                    disabled={actionLoading}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
                  >
                    <Star size={16} aria-hidden="true" />
                    {actionLoading
                      ? t('common.loading')
                      : `${t('projects.participate')} (+${project.rewardPoints} pts)`}
                  </button>
                )
              ) : (
                <Link
                  to="/login"
                  className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                >
                  {t('nav.login')} → {t('projects.participate')}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Documented impact (Z1) — only real, sourced figures; else honest note */}
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
                  {m.value}
                  {m.unit && (
                    <span className="ml-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                      {m.unit}
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {metricLabel(m)}
                </p>
                {m.source && (
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    {t('projImpact.source')}: {m.source}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('projImpact.notMeasured')}
          </p>
        )}
      </section>

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
                  </div>
                  {(spotsLeft == null || spotsLeft > 0) && (
                    <div className="mt-3 border-t border-gray-100 pt-3 dark:border-gray-700">
                      <EventRegister
                        eventId={ev.id}
                        rewardPoints={ev.rewardPoints}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
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
    </Container>
  );
}

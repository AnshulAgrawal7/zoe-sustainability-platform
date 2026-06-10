import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { getProject, participate, withdraw } from '../services/projectService';
import { getEvents } from '../services/eventService';
import { getMe } from '../services/userService';
import EventRegister from '../components/events/EventRegister';
import { useAuthStore } from '../stores/authStore';
import type { ApiProject, ApiEvent } from '../types';

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
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
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
      </div>
    );
  }

  const sdgs = parseSdgs();
  const participantCount = project._count?.participations ?? 0;
  const categoryColor =
    {
      ENVIRONMENT: 'bg-green-500',
      MOBILITY: 'bg-blue-500',
      COMMUNITY: 'bg-orange-500',
      EDUCATION: 'bg-purple-500',
      CULTURE: 'bg-teal-500',
    }[project.category] ?? 'bg-gray-400';

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        {t('common.back')}
      </button>

      {/* Hero card */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
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
    </div>
  );
}

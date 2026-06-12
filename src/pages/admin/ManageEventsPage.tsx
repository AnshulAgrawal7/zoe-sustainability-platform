import { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Calendar, CheckCircle2, Loader2 } from 'lucide-react';
import { getEvents, completeEvent } from '../../services/eventService';
import { useToastStore } from '../../stores/toastStore';
import type { ApiEvent } from '../../types';

const LOCALES: Record<string, string> = {
  en: 'en-GB',
  el: 'el-GR',
  de: 'de-DE',
};

export default function ManageEventsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2);
  const locale = LOCALES[lang] ?? 'en-GB';
  const showToast = useToastStore((s) => s.showToast);
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  // Lifecycle action state: which event shows the inline confirm / is busy.
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);

  const loadEvents = () => {
    getEvents()
      .then(setEvents)
      .catch(() => null)
      .finally(() => setLoading(false));
  };
  useEffect(loadEvents, []);

  function title(e: ApiEvent) {
    if (lang === 'el') return e.titleEl;
    if (lang === 'de') return e.titleDe;
    return e.titleEn;
  }
  function projectTitle(e: ApiEvent) {
    if (!e.project) return '';
    if (lang === 'el') return e.project.titleEl;
    if (lang === 'de') return e.project.titleDe;
    return e.project.titleEn;
  }

  async function complete(e: ApiEvent) {
    setCompletingId(e.id);
    try {
      const result = await completeEvent(e.id);
      showToast(
        t('adminEvents.completedToast', { count: result.awardedCount })
      );
      setConfirmingId(null);
      loadEvents();
    } catch {
      showToast(t('common.error'));
    } finally {
      setCompletingId(null);
    }
  }

  return (
    <Container className="py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('adminEvents.title')}
        </h1>
        <Link
          to="/admin/events/new"
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          <Plus size={16} aria-hidden="true" /> {t('adminEvents.create')}
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : events.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t('adminEvents.empty')}
        </p>
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <div
              key={e.id}
              className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                    {title(e)}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        e.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}
                    >
                      {e.status === 'COMPLETED'
                        ? t('events.statusCompleted')
                        : t('events.statusUpcoming')}
                    </span>
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar size={12} aria-hidden="true" />
                    {new Date(e.date).toLocaleDateString(locale, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}{' '}
                    · {t(`projects.category.${e.category}`)}
                    {e.project ? ` · ${projectTitle(e)}` : ''}
                    {' · '}
                    {t('adminEvents.registeredCount', {
                      count: e.registeredCount ?? 0,
                    })}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {e.status !== 'COMPLETED' && confirmingId !== e.id && (
                    <button
                      type="button"
                      onClick={() => setConfirmingId(e.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-green-300 px-3 py-2 text-xs font-medium text-green-700 transition-colors hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20"
                    >
                      <CheckCircle2 size={14} aria-hidden="true" />
                      {t('adminEvents.complete')}
                    </button>
                  )}
                  <Link
                    to={`/admin/events/${e.id}/edit`}
                    aria-label={`${t('adminEvents.edit')}: ${title(e)}`}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20"
                  >
                    <Pencil size={16} aria-hidden="true" />
                  </Link>
                </div>
              </div>

              {/* Inline confirmation — completing awards points irreversibly. */}
              {confirmingId === e.id && (
                <div
                  role="alertdialog"
                  aria-label={t('adminEvents.complete')}
                  className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20"
                >
                  <p className="text-xs text-amber-800 dark:text-amber-200">
                    {t('adminEvents.completeConfirm', {
                      points: e.rewardPoints,
                    })}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => void complete(e)}
                      disabled={completingId === e.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:opacity-60"
                    >
                      {completingId === e.id ? (
                        <Loader2
                          size={13}
                          className="motion-safe:animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <CheckCircle2 size={13} aria-hidden="true" />
                      )}
                      {t('adminEvents.completeYes')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingId(null)}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-600 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}

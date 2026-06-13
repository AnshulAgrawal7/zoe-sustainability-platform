import { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lightbulb, Mail, ExternalLink, Loader2 } from 'lucide-react';
import { getIdeas, updateIdeaStatus } from '../../services/ideaService';
import { useToastStore } from '../../stores/toastStore';
import type { Idea, IdeaStatus } from '../../types';

const STATUSES: IdeaStatus[] = ['NEW', 'IN_REVIEW', 'ACCEPTED', 'DECLINED'];

const STATUS_BADGE: Record<IdeaStatus, string> = {
  NEW: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  IN_REVIEW:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  ACCEPTED:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  DECLINED: 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
};

const LOCALES: Record<string, string> = {
  en: 'en-GB',
  el: 'el-GR',
  de: 'de-DE',
};

interface Draft {
  status: IdeaStatus;
  message: string;
}

export default function ManageIdeasPage() {
  const { t, i18n } = useTranslation();
  const locale = LOCALES[i18n.language.slice(0, 2)] ?? 'en-GB';
  const showToast = useToastStore((s) => s.showToast);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filter, setFilter] = useState<IdeaStatus | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);
  // Per-idea draft (chosen status + optional message to the submitter).
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await getIdeas(filter === 'ALL' ? undefined : filter);
        if (!cancelled) {
          setIdeas(data);
          setDrafts(
            Object.fromEntries(
              data.map((i) => [i.id, { status: i.status, message: '' }])
            )
          );
        }
      } catch {
        /* ignore — list stays as-is */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [filter]);

  function setDraft(id: string, patch: Partial<Draft>) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  async function save(idea: Idea) {
    const draft = drafts[idea.id];
    if (!draft) return;
    setSavingId(idea.id);
    try {
      await updateIdeaStatus(idea.id, draft.status, draft.message || undefined);
      showToast(t('adminIdeas.saved'));
      // Reflect new status + note locally; drop from a filtered view if it no
      // longer matches.
      setIdeas((prev) =>
        filter !== 'ALL' && draft.status !== filter
          ? prev.filter((i) => i.id !== idea.id)
          : prev.map((i) =>
              i.id === idea.id
                ? {
                    ...i,
                    status: draft.status,
                    adminNote: draft.message || i.adminNote,
                  }
                : i
            )
      );
      setDraft(idea.id, { message: '' });
    } catch {
      showToast(t('common.error'));
    } finally {
      setSavingId(null);
    }
  }

  function submitter(idea: Idea): string {
    if (idea.user) return `${idea.user.name} (@${idea.user.username})`;
    if (idea.submitterName) return idea.submitterName;
    return t('adminIdeas.anonymous');
  }

  return (
    <Container className="py-8">
      <div className="mb-1 flex items-center gap-2">
        <Lightbulb size={22} className="text-amber-500" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('adminIdeas.title')}
        </h1>
      </div>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        {t('adminIdeas.subtitle')}
      </p>

      {/* Status filter */}
      <div
        role="group"
        aria-label={t('adminIdeas.filterLabel')}
        className="mb-6 flex flex-wrap gap-2"
      >
        {(['ALL', ...STATUSES] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            aria-pressed={filter === s}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
              filter === s
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {s === 'ALL' ? t('adminIdeas.all') : t(`ideaStatus.${s}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : ideas.length === 0 ? (
        <p className="py-12 text-center text-gray-500 dark:text-gray-400">
          {t('adminIdeas.empty')}
        </p>
      ) : (
        <ul className="space-y-3">
          {ideas.map((idea) => {
            const draft = drafts[idea.id] ?? {
              status: idea.status,
              message: '',
            };
            const dirty =
              draft.status !== idea.status || draft.message.trim().length > 0;
            return (
              <li
                key={idea.id}
                className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_BADGE[idea.status]}`}
                      >
                        {t(`ideaStatus.${idea.status}`)}
                      </span>
                      <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                        {t(`projects.category.${idea.category}`)}
                      </span>
                    </div>
                    {/* Approved ideas have a public page — open it to view as a
                        citizen would (with discussion + votes). */}
                    {idea.status === 'ACCEPTED' ? (
                      <Link
                        to={`/ideas/${idea.id}`}
                        className="inline-flex items-center gap-1.5 font-medium text-gray-900 hover:text-green-700 hover:underline dark:text-white dark:hover:text-green-400"
                      >
                        {idea.title}
                        <ExternalLink size={13} aria-hidden="true" />
                      </Link>
                    ) : (
                      <p className="font-medium text-gray-900 dark:text-white">
                        {idea.title}
                      </p>
                    )}
                    <p className="mt-1 whitespace-pre-line text-sm text-gray-600 dark:text-gray-300">
                      {idea.description}
                    </p>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {submitter(idea)} ·{' '}
                      {new Date(idea.createdAt).toLocaleDateString(locale)}
                    </p>
                    {idea.adminNote && (
                      <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:bg-gray-900/40 dark:text-gray-300">
                        <span className="font-semibold">
                          {t('adminIdeas.currentNote')}:
                        </span>{' '}
                        {idea.adminNote}
                      </p>
                    )}
                    {idea.submitterEmail && (
                      <a
                        href={`mailto:${idea.submitterEmail}?subject=${encodeURIComponent(
                          t('adminIdeas.emailSubject', { title: idea.title })
                        )}`}
                        aria-label={t('adminIdeas.replyByEmail', {
                          email: idea.submitterEmail,
                        })}
                        className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-green-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 dark:text-green-400"
                      >
                        <Mail size={12} aria-hidden="true" />
                        {idea.submitterEmail}
                      </a>
                    )}
                  </div>

                  <div className="flex w-full shrink-0 flex-col gap-2 sm:w-64">
                    <label
                      htmlFor={`status-${idea.id}`}
                      className="text-xs text-gray-500 dark:text-gray-400"
                    >
                      {t('adminIdeas.changeStatus')}
                    </label>
                    <select
                      id={`status-${idea.id}`}
                      value={draft.status}
                      onChange={(e) =>
                        setDraft(idea.id, {
                          status: e.target.value as IdeaStatus,
                        })
                      }
                      className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {t(`ideaStatus.${s}`)}
                        </option>
                      ))}
                    </select>
                    <label
                      htmlFor={`msg-${idea.id}`}
                      className="text-xs text-gray-500 dark:text-gray-400"
                    >
                      {t('adminIdeas.messageLabel')}
                    </label>
                    <textarea
                      id={`msg-${idea.id}`}
                      rows={2}
                      value={draft.message}
                      onChange={(e) =>
                        setDraft(idea.id, { message: e.target.value })
                      }
                      placeholder={t('adminIdeas.messagePlaceholder')}
                      className="resize-none rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => void save(idea)}
                      disabled={savingId === idea.id || !dirty}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:opacity-50"
                    >
                      {savingId === idea.id && (
                        <Loader2
                          size={13}
                          className="motion-safe:animate-spin"
                          aria-hidden="true"
                        />
                      )}
                      {t('adminIdeas.save')}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
}

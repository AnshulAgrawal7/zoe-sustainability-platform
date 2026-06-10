import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Lightbulb } from 'lucide-react';
import { getIdeas, updateIdeaStatus } from '../../services/ideaService';
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

export default function ManageIdeasPage() {
  const { t, i18n } = useTranslation();
  const locale = LOCALES[i18n.language.slice(0, 2)] ?? 'en-GB';
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filter, setFilter] = useState<IdeaStatus | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await getIdeas(filter === 'ALL' ? undefined : filter);
        if (!cancelled) setIdeas(data);
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

  async function changeStatus(id: string, status: IdeaStatus) {
    setIdeas((prev) =>
      filter !== 'ALL' && status !== filter
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, status } : i))
    );
    try {
      await updateIdeaStatus(id, status);
    } catch {
      // Revert to server truth on failure.
      const data = await getIdeas(filter === 'ALL' ? undefined : filter).catch(
        () => null
      );
      if (data) setIdeas(data);
    }
  }

  function submitter(idea: Idea): string {
    if (idea.user) return idea.user.name;
    if (idea.submitterName) return idea.submitterName;
    return t('adminIdeas.anonymous');
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
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
          {ideas.map((idea) => (
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
                  <p className="font-medium text-gray-900 dark:text-white">
                    {idea.title}
                  </p>
                  <p className="mt-1 whitespace-pre-line text-sm text-gray-600 dark:text-gray-300">
                    {idea.description}
                  </p>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {submitter(idea)}
                    {idea.submitterEmail && !idea.user
                      ? ` · ${idea.submitterEmail}`
                      : ''}
                    {' · '}
                    {new Date(idea.createdAt).toLocaleDateString(locale)}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col gap-1 sm:items-end">
                  <label
                    htmlFor={`status-${idea.id}`}
                    className="text-xs text-gray-500 dark:text-gray-400"
                  >
                    {t('adminIdeas.changeStatus')}
                  </label>
                  <select
                    id={`status-${idea.id}`}
                    value={idea.status}
                    onChange={(e) =>
                      void changeStatus(idea.id, e.target.value as IdeaStatus)
                    }
                    className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {t(`ideaStatus.${s}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

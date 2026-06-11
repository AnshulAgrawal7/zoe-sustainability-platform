import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Heart } from 'lucide-react';
import {
  getAllComments,
  setCommentStatus,
} from '../../services/commentService';
import type { AdminComment } from '../../types';

export default function ManageCommentsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2);
  const locale = lang === 'el' ? 'el-GR' : lang === 'de' ? 'de-DE' : 'en-GB';

  const [comments, setComments] = useState<AdminComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllComments()
      .then(setComments)
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, []);

  async function toggle(c: AdminComment) {
    const next = c.status === 'VISIBLE' ? 'HIDDEN' : 'VISIBLE';
    setComments((prev) =>
      prev.map((x) => (x.id === c.id ? { ...x, status: next } : x))
    );
    try {
      await setCommentStatus(c.id, next);
    } catch {
      // revert on failure
      setComments((prev) =>
        prev.map((x) => (x.id === c.id ? { ...x, status: c.status } : x))
      );
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        {t('adminComments.title')}
      </h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        {t('adminComments.subtitle')}
      </p>

      {loading ? (
        <p className="py-12 text-center text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : comments.length === 0 ? (
        <p className="py-12 text-center text-gray-500 dark:text-gray-400">
          {t('adminComments.empty')}
        </p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li
              key={c.id}
              className={`rounded-xl border p-4 ${
                c.status === 'HIDDEN'
                  ? 'border-gray-200 bg-gray-50 opacity-70 dark:border-gray-700 dark:bg-gray-900/40'
                  : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
              }`}
            >
              <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {c.user.name}
                </span>
                <span>
                  {t('adminComments.onIdea')}{' '}
                  <Link
                    to={`/ideas/${c.idea.id}`}
                    className="text-green-700 underline dark:text-green-400"
                  >
                    {c.idea.title}
                  </Link>
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    c.status === 'VISIBLE'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {c.status === 'VISIBLE'
                    ? t('adminComments.statusVisible')
                    : t('adminComments.statusHidden')}
                </span>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {c.body}
              </p>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                  <Heart size={12} aria-hidden="true" />
                  {t('adminComments.likes', { count: c._count.likes })}
                  <time dateTime={c.createdAt} className="ml-2">
                    {new Date(c.createdAt).toLocaleDateString(locale, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </time>
                </span>
                <button
                  type="button"
                  onClick={() => void toggle(c)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {c.status === 'VISIBLE' ? (
                    <>
                      <EyeOff size={14} aria-hidden="true" />
                      {t('adminComments.hide')}
                    </>
                  ) : (
                    <>
                      <Eye size={14} aria-hidden="true" />
                      {t('adminComments.show')}
                    </>
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

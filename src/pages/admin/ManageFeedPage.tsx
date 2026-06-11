import { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Pencil, AlertTriangle } from 'lucide-react';
import { getAdminFeed } from '../../services/feedAdminService';
import type { AdminFeedPost } from '../../types';

function pickTitle(post: AdminFeedPost, lang: string): string {
  const tr =
    post.translations.find((t) => t.locale === lang) ??
    post.translations.find((t) => t.locale === 'el') ??
    post.translations[0];
  return tr?.title ?? '(untitled)';
}

export default function ManageFeedPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2);
  const locale = lang === 'el' ? 'el-GR' : lang === 'de' ? 'de-DE' : 'en-GB';

  const [posts, setPosts] = useState<AdminFeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminFeed()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxW="4xl" className="py-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        {t('adminFeed.title')}
      </h1>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
        {t('adminFeed.subtitle')}
      </p>

      {loading ? (
        <p className="py-12 text-center text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : posts.length === 0 ? (
        <p className="py-12 text-center text-gray-500 dark:text-gray-400">
          {t('adminFeed.empty')}
        </p>
      ) : (
        <ul className="space-y-2">
          {posts.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900 dark:text-white">
                  {pickTitle(p, lang)}
                </p>
                <p className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{t(`feed.category.${p.category}`)}</span>
                  <span>·</span>
                  <time dateTime={p.publishedAt}>
                    {new Date(p.publishedAt).toLocaleDateString(locale, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </time>
                  {p.needsReview && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      <AlertTriangle size={10} aria-hidden="true" />
                      {t('adminFeed.needsReview')}
                    </span>
                  )}
                </p>
              </div>
              <Link
                to={`/admin/feed/${p.id}/edit`}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Pencil size={13} aria-hidden="true" />
                {t('adminFeed.edit')}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}

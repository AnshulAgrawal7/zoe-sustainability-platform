import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Newspaper } from 'lucide-react';
import { getPosts } from '../services/postService';
import { fallbackPosts } from '../data/posts';
import PostCard from '../components/news/PostCard';
import type { Post, PostType } from '../types';

const FILTERS: (PostType | 'ALL')[] = [
  'ALL',
  'PROJECT_NEW',
  'PROJECT_COMPLETED',
  'ANNOUNCEMENT',
];

export default function NewsPage() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PostType | 'ALL'>('ALL');

  useEffect(() => {
    getPosts({ limit: 50 })
      .then(setPosts)
      .catch(() => setPosts(fallbackPosts))
      .finally(() => setLoading(false));
  }, []);

  const visible =
    filter === 'ALL' ? posts : posts.filter((p) => p.type === filter);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
          <Newspaper size={16} aria-hidden="true" />
          {t('news.badge')}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          {t('news.title')}
        </h1>
        <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
          {t('news.subtitle')}
        </p>
      </header>

      {/* Type filter */}
      <div
        className="mb-6 flex flex-wrap gap-2"
        role="group"
        aria-label={t('news.filterLabel')}
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 ${
              filter === f
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {f === 'ALL' ? t('news.filterAll') : t(`news.types.${f}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : visible.length === 0 ? (
        <p className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
          {t('news.empty')}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

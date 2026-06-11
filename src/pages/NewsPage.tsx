import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Newspaper, CheckCircle2 } from 'lucide-react';
import { getFeed } from '../services/feedService';
import FeedCard from '../components/news/FeedCard';
import type { FeedItem, FeedCategory } from '../types';

const CATEGORIES: FeedCategory[] = [
  'ANNOUNCEMENT',
  'EVENT',
  'PROJECT',
  'NEWS',
  'PROJECT_UPDATE',
];

export default function NewsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2);

  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<FeedCategory | ''>('');
  const [completedOnly, setCompletedOnly] = useState(false);

  // Refetch on locale change so the body text follows the active language.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await getFeed(lang);
        if (!cancelled) setItems(data);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  const visible = completedOnly
    ? items.filter(
        (i) => i.category === 'EVENT' && i.eventStatus === 'COMPLETED'
      )
    : category
      ? items.filter((i) => i.category === category)
      : items;

  function chipClass(active: boolean): string {
    return `rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 ${
      active
        ? 'bg-green-600 text-white'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
    }`;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
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

      {/* Category filter + "Completed events" toggle */}
      <div
        className="mb-6 flex flex-wrap items-center gap-2"
        role="group"
        aria-label={t('feed.filterBy')}
      >
        <button
          type="button"
          onClick={() => {
            setCategory('');
            setCompletedOnly(false);
          }}
          aria-pressed={!category && !completedOnly}
          className={chipClass(!category && !completedOnly)}
        >
          {t('feed.all')}
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setCategory(c);
              setCompletedOnly(false);
            }}
            aria-pressed={category === c && !completedOnly}
            className={chipClass(category === c && !completedOnly)}
          >
            {t(`feed.category.${c}`)}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            setCompletedOnly(true);
            setCategory('');
          }}
          aria-pressed={completedOnly}
          className={`inline-flex items-center gap-1.5 ${chipClass(completedOnly)}`}
        >
          <CheckCircle2 size={13} aria-hidden="true" />
          {t('feed.completedEvents')}
        </button>
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
        <>
          <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
            {t('feed.found', { count: visible.length })}
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item) => (
              <FeedCard key={`${item.source}-${item.id}`} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

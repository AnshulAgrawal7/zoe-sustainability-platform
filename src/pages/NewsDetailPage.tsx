import { useState, useEffect } from 'react';
import Container from '../components/layout/Container';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, AlertCircle, Calendar, CheckCircle2 } from 'lucide-react';
import { getFeedItem } from '../services/feedService';
import Gallery from '../components/news/Gallery';
import { DATE_LOCALES, categoryColor } from '../components/news/feedMeta';
import type { FeedDetail } from '../types';

export default function NewsDetailPage() {
  const { t, i18n } = useTranslation();
  const { source, id } = useParams<{ source: string; id: string }>();
  const lang = i18n.language.slice(0, 2);

  const [entry, setEntry] = useState<FeedDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Refetch on locale change so title/body follow the active language.
  useEffect(() => {
    if (!source || !id) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await getFeedItem(source!, id!, lang);
        if (!cancelled) {
          setEntry(data);
          setNotFound(false);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [source, id, lang]);

  if (loading) {
    return (
      <Container className="py-20 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      </Container>
    );
  }

  if (notFound || !entry) {
    return (
      <Container className="py-20 text-center">
        <AlertCircle
          size={40}
          className="mx-auto mb-4 text-gray-400"
          aria-hidden="true"
        />
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          {t('newsDetail.notFound')}
        </p>
        <Link
          to="/news"
          className="font-medium text-green-700 underline dark:text-green-400"
        >
          ← {t('newsDetail.back')}
        </Link>
      </Container>
    );
  }

  const locale = DATE_LOCALES[lang] ?? 'en-GB';
  const dateStr = new Date(entry.date).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Container className="py-10">
      <Link
        to="/news"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        {t('newsDetail.back')}
      </Link>

      <article>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColor(entry.category)}`}
          >
            {t(`feed.category.${entry.category}`)}
          </span>
          {entry.category === 'EVENT' && entry.eventStatus && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {entry.eventStatus === 'COMPLETED' && (
                <CheckCircle2 size={11} aria-hidden="true" />
              )}
              {t(`feed.event.${entry.eventStatus}`)}
            </span>
          )}
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          {entry.title}
        </h1>
        <p className="mb-6 flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500">
          <Calendar size={14} aria-hidden="true" />
          <time dateTime={entry.date}>{dateStr}</time>
        </p>

        <div className="whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-300">
          {entry.body}
        </div>

        {entry.images.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {t('feed.gallery.label')}
            </h2>
            <Gallery images={entry.images} />
          </div>
        )}
      </article>
    </Container>
  );
}

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, CheckCircle2 } from 'lucide-react';
import type { FeedItem } from '../../types';
import CardGallery from './CardGallery';
import { DATE_LOCALES, categoryColor } from './feedMeta';

export default function FeedCard({ item }: { item: FeedItem }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2);
  const locale = DATE_LOCALES[lang] ?? 'en-GB';
  const dateStr = new Date(item.date).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const href = `/news/${item.source}/${item.id}`;

  // The whole card is clickable via the title link's stretched ::after overlay
  // (single tab stop, no JS, no second link element). The gallery controls sit
  // above it (z-10), so they never trigger navigation to the detail page.
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <CardGallery images={item.images} />

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColor(item.category)}`}
          >
            {t(`feed.category.${item.category}`)}
          </span>
          {item.category === 'EVENT' && item.eventStatus && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {item.eventStatus === 'COMPLETED' && (
                <CheckCircle2 size={11} aria-hidden="true" />
              )}
              {t(`feed.event.${item.eventStatus}`)}
            </span>
          )}
        </div>
        <h2 className="mb-1 text-base font-bold text-gray-900 dark:text-white">
          <Link
            to={href}
            className="rounded after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          >
            {item.title}
          </Link>
        </h2>
        <p className="mb-3 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
          <Calendar size={12} aria-hidden="true" />
          <time dateTime={item.date}>{dateStr}</time>
        </p>
        <p className="line-clamp-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {item.excerpt}
        </p>
      </div>
    </article>
  );
}

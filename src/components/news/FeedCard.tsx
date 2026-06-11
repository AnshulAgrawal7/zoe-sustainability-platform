import { useTranslation } from 'react-i18next';
import { Calendar, CheckCircle2 } from 'lucide-react';
import type { FeedItem } from '../../types';

const DATE_LOCALES: Record<string, string> = {
  en: 'en-GB',
  el: 'el-GR',
  de: 'de-DE',
};

const CATEGORY_COLOR: Record<string, string> = {
  ANNOUNCEMENT:
    'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  EVENT:
    'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  PROJECT:
    'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  NEWS: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
  PROJECT_UPDATE:
    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export default function FeedCard({ item }: { item: FeedItem }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2);
  const locale = DATE_LOCALES[lang] ?? 'en-GB';
  const dateStr = new Date(item.date).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const single = item.images.length === 1 ? item.images[0] : undefined;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Gallery: single image, or a horizontal scroll-snap strip for several */}
      {single ? (
        <img
          src={single.url}
          alt={single.alt ?? item.title}
          loading="lazy"
          width={single.width ?? undefined}
          height={single.height ?? undefined}
          className="h-48 w-full object-cover"
        />
      ) : item.images.length > 1 ? (
        <ul
          className="flex snap-x snap-mandatory gap-2 overflow-x-auto p-2"
          aria-label={t('feed.gallery')}
        >
          {item.images.map((img, idx) => (
            <li key={img.url} className="shrink-0 snap-start">
              <img
                src={img.url}
                alt={img.alt ?? `${item.title} (${idx + 1})`}
                loading="lazy"
                width={img.width ?? undefined}
                height={img.height ?? undefined}
                className="h-44 w-64 rounded-lg object-cover"
              />
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              CATEGORY_COLOR[item.category] ?? CATEGORY_COLOR['PROJECT_UPDATE']
            }`}
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
          {item.title}
        </h2>
        <p className="mb-3 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
          <Calendar size={12} aria-hidden="true" />
          <time dateTime={item.date}>{dateStr}</time>
        </p>
        <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {item.excerpt}
        </p>
      </div>
    </article>
  );
}

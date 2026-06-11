import { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Calendar } from 'lucide-react';
import { getEvents } from '../../services/eventService';
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
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

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
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {title(e)}
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
                </p>
              </div>
              <Link
                to={`/admin/events/${e.id}/edit`}
                aria-label={`${t('adminEvents.edit')}: ${title(e)}`}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20"
              >
                <Pencil size={16} aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}

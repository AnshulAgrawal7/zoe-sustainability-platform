import { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil } from 'lucide-react';
import { getLearningResources } from '../../services/learnService';
import type { LearningResource } from '../../types';

export default function ManageLearnPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2);

  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLearningResources()
      .then(setResources)
      .catch(() => setResources([]))
      .finally(() => setLoading(false));
  }, []);

  function title(r: LearningResource): string {
    if (lang === 'el') return r.titleEl;
    if (lang === 'de') return r.titleDe;
    return r.titleEn;
  }
  function projectTitle(r: LearningResource): string {
    if (!r.project) return '';
    if (lang === 'el') return r.project.titleEl;
    if (lang === 'de') return r.project.titleDe;
    return r.project.titleEn;
  }

  return (
    <Container maxW="4xl" className="py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('adminLearn.title')}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t('adminLearn.subtitle')}
          </p>
        </div>
        <Link
          to="/admin/learn/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
        >
          <Plus size={16} aria-hidden="true" />
          {t('adminLearn.create')}
        </Link>
      </div>

      {loading ? (
        <p className="py-12 text-center text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : resources.length === 0 ? (
        <p className="py-12 text-center text-gray-500 dark:text-gray-400">
          {t('adminLearn.empty')}
        </p>
      ) : (
        <ul className="space-y-2">
          {resources.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900 dark:text-white">
                  {title(r)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t(`projects.category.${r.category}`)}
                  {r.project && (
                    <>
                      {' · '}
                      {t('adminLearn.projectColumn')}: {projectTitle(r)}
                    </>
                  )}
                </p>
              </div>
              <Link
                to={`/admin/learn/${r.id}/edit`}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Pencil size={13} aria-hidden="true" />
                {t('adminLearn.edit')}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}

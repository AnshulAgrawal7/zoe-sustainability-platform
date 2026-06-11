import { useState, useEffect } from 'react';
import Container from '../components/layout/Container';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GraduationCap, ArrowRight, Folder } from 'lucide-react';
import { getLearningResources } from '../services/learnService';
import EntityImage from '../components/ui/EntityImage';
import type { LearningResource, ApiProjectCategory } from '../types';

const CATEGORIES: ApiProjectCategory[] = [
  'ENVIRONMENT',
  'MOBILITY',
  'COMMUNITY',
  'EDUCATION',
  'CULTURE',
];

export default function LearnPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2);

  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');

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
  function body(r: LearningResource): string {
    if (lang === 'el') return r.bodyEl;
    if (lang === 'de') return r.bodyDe;
    return r.bodyEn;
  }
  function projectTitle(r: LearningResource): string {
    if (!r.project) return '';
    if (lang === 'el') return r.project.titleEl;
    if (lang === 'de') return r.project.titleDe;
    return r.project.titleEn;
  }

  const visible = resources.filter(
    (r) => !categoryFilter || r.category === categoryFilter
  );

  return (
    <Container className="py-10">
      <div className="mb-6">
        <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-white">
          <GraduationCap
            size={26}
            aria-hidden="true"
            className="text-green-600 dark:text-green-400"
          />
          {t('learn.title')}
        </h1>
        <p className="max-w-2xl text-gray-600 dark:text-gray-300">
          {t('learn.intro')}
        </p>
        <p className="mt-2 inline-block rounded border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
          {t('learn.demoNote')}
        </p>
      </div>

      <div
        className="mb-6 flex flex-wrap items-center gap-2"
        role="group"
        aria-label={t('learn.filterBy')}
      >
        <button
          onClick={() => setCategoryFilter('')}
          aria-pressed={!categoryFilter}
          className={`rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
            !categoryFilter
              ? 'border-green-600 bg-green-600 text-white'
              : 'border-gray-300 bg-white text-gray-600 hover:border-green-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          {t('learn.all')}
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c === categoryFilter ? '' : c)}
            aria-pressed={categoryFilter === c}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
              categoryFilter === c
                ? 'border-green-600 bg-green-600 text-white'
                : 'border-gray-300 bg-white text-gray-600 hover:border-green-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {t(`projects.category.${c}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="py-16 text-center text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : visible.length === 0 ? (
        <p className="py-16 text-center text-gray-500 dark:text-gray-400">
          {t('learn.empty')}
        </p>
      ) : (
        <>
          <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
            {t('learn.found', { count: visible.length })}
          </p>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {visible.map((r) => (
              <li
                key={r.id}
                className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <EntityImage
                  src={r.imageUrl}
                  alt={title(r)}
                  category={r.category}
                  className="h-32 w-full"
                />
                <div className="flex flex-1 flex-col p-5">
                  <span className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {t(`projects.category.${r.category}`)}
                  </span>
                  <h2 className="mb-1 text-base font-bold text-gray-900 dark:text-white">
                    {title(r)}
                  </h2>
                  <p className="mb-3 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                    {body(r)}
                  </p>
                  {r.project && (
                    <Link
                      to={`/projects/${r.project.id}`}
                      className="mb-2 inline-flex items-center gap-1 text-xs text-gray-500 hover:text-green-700 dark:text-gray-400 dark:hover:text-green-400"
                    >
                      <Folder size={12} aria-hidden="true" />
                      {projectTitle(r)}
                    </Link>
                  )}
                  <Link
                    to={`/learn/${r.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:underline dark:text-green-400"
                  >
                    {t('learn.readMore')}
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </Container>
  );
}

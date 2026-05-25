import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Filter, Users, ArrowRight, Star } from 'lucide-react';
import { getProjects } from '../services/projectService';
import type { ApiProject } from '../types';

const CATEGORIES = [
  'ENVIRONMENT',
  'MOBILITY',
  'COMMUNITY',
  'EDUCATION',
  'CULTURE',
] as const;

export default function ProjectsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2);

  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getProjects({
          page,
          limit: 12,
          category: categoryFilter || undefined,
          status: 'OPEN',
        });
        if (!cancelled) {
          setProjects(data.projects);
          setTotal(data.total);
          setPages(data.pages);
        }
      } catch {
        if (!cancelled) setError(t('common.error'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [page, categoryFilter, t]);

  function getTitle(p: ApiProject): string {
    if (lang === 'el') return p.titleEl;
    if (lang === 'de') return p.titleDe;
    return p.titleEn;
  }

  function parseSdgs(sdgIds: string): number[] {
    try {
      return JSON.parse(sdgIds) as number[];
    } catch {
      return [];
    }
  }

  function handleCategoryChange(cat: string) {
    setCategoryFilter(cat);
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          {t('projects.title')}
        </h1>
        <p className="max-w-2xl text-gray-600 dark:text-gray-400">
          {t('projects.subtitle')}
        </p>
        <p className="mt-2 inline-block rounded border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
          Prototype — {total} {t('projects.title').toLowerCase()}
        </p>
      </div>

      {/* Filter */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
          <Filter size={16} aria-hidden="true" />
          <span>{t('projects.filter')}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange('')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              categoryFilter === ''
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {t('projects.allCategories')}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                categoryFilter === cat
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {t(`projects.category.${cat}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
            />
          ))}
        </div>
      ) : error ? (
        <div className="py-16 text-center">
          <p className="mb-4 text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => void fetchProjects()}
            className="font-medium text-green-600 hover:underline"
          >
            {t('common.retry')}
          </button>
        </div>
      ) : projects.length === 0 ? (
        <p className="py-16 text-center text-gray-500 dark:text-gray-400">
          {t('projects.noProjects')}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const sdgs = parseSdgs(project.sdgIds);
              const participantCount = project._count?.participations ?? 0;
              return (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-green-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-700"
                >
                  {/* Color bar by category */}
                  <div
                    className={`h-1.5 ${
                      project.category === 'ENVIRONMENT'
                        ? 'bg-green-500'
                        : project.category === 'MOBILITY'
                          ? 'bg-blue-500'
                          : project.category === 'COMMUNITY'
                            ? 'bg-orange-500'
                            : project.category === 'EDUCATION'
                              ? 'bg-purple-500'
                              : 'bg-teal-500'
                    }`}
                    aria-hidden="true"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        {t(`projects.category.${project.category}`)}
                      </span>
                      <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                        <Star size={12} aria-hidden="true" />
                        {project.rewardPoints}
                      </span>
                    </div>
                    <h2 className="mb-2 line-clamp-2 text-base font-bold text-gray-900 transition-colors group-hover:text-green-700 dark:text-white dark:group-hover:text-green-400">
                      {getTitle(project)}
                    </h2>
                    {project.location && (
                      <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                        📍 {project.location}
                      </p>
                    )}
                    {sdgs.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1">
                        {sdgs.slice(0, 4).map((n) => (
                          <span
                            key={n}
                            className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                          >
                            SDG {n}
                          </span>
                        ))}
                        {sdgs.length > 4 && (
                          <span className="text-xs text-gray-400">
                            +{sdgs.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
                      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Users size={12} aria-hidden="true" />
                        {t('projects.participants', {
                          count: participantCount,
                        })}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                        {t('projects.participate')}{' '}
                        <ArrowRight size={12} aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-green-600 text-white'
                      : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                  aria-current={p === page ? 'page' : undefined}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

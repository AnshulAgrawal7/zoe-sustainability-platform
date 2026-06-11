import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Filter, Users, ArrowRight, Star, List, Map } from 'lucide-react';
import { getProjects } from '../services/projectService';
import ProjectMap, { type MapPoint } from '../components/map/ProjectMap';
import type { ApiProject } from '../types';

const CATEGORIES = [
  'ENVIRONMENT',
  'MOBILITY',
  'COMMUNITY',
  'EDUCATION',
  'CULTURE',
] as const;

// Status filter: 'OPEN' (default), 'COMPLETED', or 'ALL' (every status).
const STATUS_FILTERS = ['OPEN', 'COMPLETED', 'ALL'] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

export default function ProjectsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2);

  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('OPEN');
  const [view, setView] = useState<'list' | 'map'>('list');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

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
          status: statusFilter,
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
  }, [page, categoryFilter, statusFilter, t, retryCount]);

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

  function handleStatusChange(status: StatusFilter) {
    setStatusFilter(status);
    setPage(1);
  }

  function statusLabel(status: StatusFilter): string {
    if (status === 'ALL') return t('projects.allStatuses');
    return t(`projects.status.${status}`);
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
          {t('projects.prototypeCount', { count: total })}
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

        {/* Status filter — Open (default) · Completed · All */}
        <div
          className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-gray-700"
          role="group"
          aria-label={t('projects.filterStatus')}
        >
          <span className="self-center text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('projects.filterStatus')}:
          </span>
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              aria-pressed={statusFilter === s}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {statusLabel(s)}
            </button>
          ))}
        </div>
      </div>

      {/* List / Map view toggle */}
      <div
        className="mb-6 flex justify-end gap-2"
        role="group"
        aria-label={t('map.toggle')}
      >
        <button
          onClick={() => setView('list')}
          aria-pressed={view === 'list'}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            view === 'list'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <List size={15} aria-hidden="true" />
          {t('map.viewList')}
        </button>
        <button
          onClick={() => setView('map')}
          aria-pressed={view === 'map'}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            view === 'map'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <Map size={15} aria-hidden="true" />
          {t('map.viewMap')}
        </button>
      </div>

      {/* Grid / Map */}
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
            onClick={() => setRetryCount((c) => c + 1)}
            className="font-medium text-green-600 hover:underline"
          >
            {t('common.retry')}
          </button>
        </div>
      ) : projects.length === 0 ? (
        <p className="py-16 text-center text-gray-500 dark:text-gray-400">
          {t('projects.noProjects')}
        </p>
      ) : view === 'map' ? (
        <ProjectMap
          points={projects
            .filter((p) => p.lat != null && p.lng != null)
            .map<MapPoint>((p) => ({
              id: p.id,
              title: getTitle(p),
              category: p.category,
              sdgs: parseSdgs(p.sdgIds),
              lat: p.lat as number,
              lng: p.lng as number,
            }))}
        />
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
                  {/* Cover image (optional) */}
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt={getTitle(project)}
                      loading="lazy"
                      className="h-40 w-full object-cover"
                    />
                  )}
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
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          {t(`projects.category.${project.category}`)}
                        </span>
                        {project.status !== 'OPEN' && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                              project.status === 'COMPLETED'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {t(`projects.status.${project.status}`)}
                          </span>
                        )}
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

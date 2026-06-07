import { Link } from 'react-router-dom';
import { Globe, ArrowRight, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { sdgs, sdgProgressData, getSdgByNumber } from '../data/sdgs';
import { projects } from '../data/projects';
import ProgressBar from '../components/ui/ProgressBar';
import type { SDGNumber } from '../types';

function getProjectsForSdg(sdgNumber: SDGNumber) {
  return projects.filter((p) => p.sdgs.includes(sdgNumber));
}

export default function SDGDashboardPage() {
  const { t } = useTranslation();

  // The set of addressed goals is DERIVED from the project data (single source of
  // truth) — not a hand-maintained number.
  const addressed = Array.from(new Set(projects.flatMap((p) => p.sdgs))).sort(
    (a, b) => a - b
  ) as SDGNumber[];
  const addressedSet = new Set<number>(addressed);

  const stats = [
    {
      label: t('sdgDashboard.statSdgsAddressed'),
      value: addressed.length,
      unit: t('sdgDashboard.unitOf17'),
    },
    {
      label: t('sdgDashboard.statActiveProjects'),
      value: projects.filter((p) => p.status === 'Active').length,
      unit: t('sdgDashboard.unitProjects'),
    },
    {
      label: t('sdgDashboard.statCompletedProjects'),
      value: projects.filter((p) => p.status === 'Completed').length,
      unit: t('sdgDashboard.unitProjects'),
    },
    {
      label: t('sdgDashboard.statAvgProgress'),
      value: Math.round(
        sdgProgressData.reduce((a, b) => a + b.progressPercent, 0) /
          sdgProgressData.length
      ),
      unit: t('sdgDashboard.unitPercentPrototype'),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Globe size={16} aria-hidden="true" />
          <span>{t('sdgDashboard.eyebrow')}</span>
        </div>
        <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
          {t('sdgDashboard.title')}
        </h1>
        <p className="max-w-2xl leading-relaxed text-gray-600 dark:text-gray-300">
          {t('sdgDashboard.intro')}
        </p>
        <div className="mt-3 inline-block rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          <strong>{t('sdgDashboard.prototypeNoteLabel')}</strong>{' '}
          {t('sdgDashboard.prototypeNote')}
        </div>
      </div>

      {/* Overview row */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-800"
          >
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">
              {item.value}
              <span className="ml-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                {item.unit}
              </span>
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* All 17 SDGs — clickable grid linking to the official UN pages */}
      <section aria-labelledby="all-sdgs-heading" className="mb-12">
        <h2
          id="all-sdgs-heading"
          className="mb-1 text-xl font-bold text-gray-900 dark:text-white"
        >
          {t('sdgGrid.heading')}
        </h2>
        <p className="mb-4 max-w-3xl text-sm text-gray-600 dark:text-gray-300">
          {t('sdgGrid.intro')}{' '}
          <span className="font-medium text-green-700 dark:text-green-400">
            {t('sdgGrid.addressedOfTotal', { count: addressed.length })}
          </span>
        </p>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {sdgs.map((sdg) => {
            const isAddressed = addressedSet.has(sdg.number);
            return (
              <li key={sdg.number}>
                <a
                  href={sdg.unUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('sdgGrid.openOnUn', { number: sdg.number })}
                  className={`flex h-full min-h-[112px] flex-col justify-between rounded-lg p-3 text-white transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 motion-safe:hover:scale-[1.03] ${
                    isAddressed
                      ? 'opacity-100 shadow-sm'
                      : 'opacity-40 grayscale'
                  }`}
                  style={{ backgroundColor: sdg.color }}
                >
                  <span className="text-lg font-extrabold">{sdg.number}</span>
                  <span className="mt-1 text-xs font-medium leading-snug">
                    {t(`sdgCatalog.${sdg.number}.title`)}
                  </span>
                  <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide">
                    {isAddressed
                      ? t('sdgGrid.addressed')
                      : t('sdgGrid.notAddressed')}
                    <ExternalLink size={10} aria-hidden="true" />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Addressed goals — detail cards */}
      <section aria-label={t('sdgGrid.addressed')}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {addressed.map((number) => {
            const sdg = getSdgByNumber(number);
            if (!sdg) return null;
            const progressEntry = sdgProgressData.find((d) => d.sdg === number);
            const linkedProjects = getProjectsForSdg(number);
            const progress = progressEntry?.progressPercent ?? 0;

            return (
              <div
                key={number}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <div
                  className="h-2"
                  style={{ backgroundColor: sdg.color }}
                  aria-hidden="true"
                />
                <div className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <span
                      className="rounded px-2 py-0.5 text-sm font-bold text-white"
                      style={{ backgroundColor: sdg.color }}
                    >
                      SDG {number}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {t('sdgDashboard.projectsCount', {
                        count: linkedProjects.length,
                      })}
                    </span>
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                    {t(`sdgCatalog.${number}.title`)}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                    {t(`sdgCatalog.${number}.contribution`, {
                      defaultValue: '',
                    })}
                  </p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{t('sdgDashboard.programmeProgress')}</span>
                      <span>{progress}%</span>
                    </div>
                    <ProgressBar
                      value={progress}
                      color="bg-green-500"
                      showLabel={false}
                    />
                  </div>

                  {/* Linked projects */}
                  {linkedProjects.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t('sdgDashboard.contributingProjects')}
                      </p>
                      <ul className="space-y-1">
                        {linkedProjects.map((p) => (
                          <li key={p.id}>
                            <Link
                              to={`/projects/${p.id}`}
                              className="flex items-center gap-1 text-xs text-green-700 hover:text-green-900 hover:underline dark:text-green-400 dark:hover:text-green-300"
                            >
                              <ArrowRight size={10} aria-hidden="true" />
                              {p.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

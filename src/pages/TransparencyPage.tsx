import { useState, useEffect } from 'react';
import Container from '../components/layout/Container';
import {
  Leaf,
  Users,
  Recycle,
  Waves,
  TreePine,
  Wind,
  GraduationCap,
  Globe,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { impactMetrics } from '../data/metrics';
import { projects } from '../data/projects';
import { getImpactMetrics } from '../services/projectService';
import StatusBadge from '../components/ui/StatusBadge';
import type { ApiImpactMetric } from '../types';

const iconMap: Record<string, React.ElementType> = {
  Leaf,
  Users,
  Recycle,
  Waves,
  TreePine,
  Wind,
  GraduationCap,
  Globe,
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

const trendColors = {
  up: 'text-green-600',
  down: 'text-rose-600',
  stable: 'text-gray-400',
};

export default function TransparencyPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2);
  const principles = t('transparency.principles', {
    returnObjects: true,
  }) as { title: string; desc: string }[];

  const [documented, setDocumented] = useState<ApiImpactMetric[]>([]);
  useEffect(() => {
    getImpactMetrics()
      .then(setDocumented)
      .catch(() => setDocumented([]));
  }, []);

  function metricLabel(m: ApiImpactMetric): string {
    if (lang === 'el') return m.labelEl;
    if (lang === 'de') return m.labelDe;
    return m.labelEn;
  }
  function projectTitle(m: ApiImpactMetric): string {
    if (!m.project) return '';
    if (lang === 'el') return m.project.titleEl;
    if (lang === 'de') return m.project.titleDe;
    return m.project.titleEn;
  }

  return (
    <Container className="py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
          {t('transparency.title')}
        </h1>
        <p className="max-w-2xl leading-relaxed text-gray-600 dark:text-gray-300">
          {t('transparency.intro')}
        </p>
        <div className="mt-3 inline-block rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          <strong>{t('transparency.prototypeNoticeLabel')}</strong>{' '}
          {t('transparency.prototypeNotice')}
        </div>
      </div>

      {/* Documented impact (sourced) — only real figures from the API (Z1) */}
      {documented.length > 0 && (
        <section aria-labelledby="documented-impact-heading" className="mb-12">
          <h2
            id="documented-impact-heading"
            className="mb-2 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white"
          >
            <BarChart3
              size={20}
              aria-hidden="true"
              className="text-green-600 dark:text-green-400"
            />
            {t('transparency.documented.heading')}
          </h2>
          <p className="mb-5 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
            {t('transparency.documented.intro')}
          </p>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {documented.map((m) => (
              <li
                key={m.id}
                className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
              >
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {m.value}
                  {m.unit && (
                    <span className="ml-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                      {m.unit}
                    </span>
                  )}
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                  {metricLabel(m)}
                </p>
                {m.project && (
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {projectTitle(m)}
                  </p>
                )}
                {m.source && (
                  <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                    {t('projImpact.source')}: {m.source}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* KPI grid — clearly labelled as illustrative prototype data */}
      <section aria-label={t('transparency.kpiSectionLabel')} className="mb-12">
        <h2 className="mb-1 text-xl font-semibold text-gray-900 dark:text-white">
          {t('transparency.kpiHeading')}
        </h2>
        <p className="mb-5 text-sm font-medium text-amber-700 dark:text-amber-400">
          {t('transparency.documented.illustrativeLabel')}
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {impactMetrics.map((metric) => {
            const Icon = iconMap[metric.icon] ?? Leaf;
            const TrendIcon = metric.trend
              ? trendIcons[metric.trend]
              : undefined;
            const trendColor = metric.trend
              ? trendColors[metric.trend]
              : 'text-gray-400';
            return (
              <div
                key={metric.id}
                className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="rounded-lg bg-green-50 p-2 dark:bg-green-900/20">
                    <Icon
                      size={20}
                      className="text-green-600 dark:text-green-400"
                      aria-hidden="true"
                    />
                  </div>
                  {TrendIcon && metric.trend && (
                    <TrendIcon
                      size={16}
                      className={trendColor}
                      aria-label={t(
                        `transparency.trend.${metric.trend}` as const
                      )}
                    />
                  )}
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {t(`impactMetrics.${metric.id}.unit`)}
                </p>
                <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t(`impactMetrics.${metric.id}.label`)}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                  {t(`impactMetrics.${metric.id}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Project progress table */}
      <section
        aria-label={t('transparency.progressSectionLabel')}
        className="mb-12"
      >
        <h2 className="mb-5 text-xl font-semibold text-gray-900 dark:text-white">
          {t('transparency.progressHeading')}
        </h2>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50">
                <tr>
                  <th className="px-5 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                    {t('transparency.thProject')}
                  </th>
                  <th className="hidden px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300 sm:table-cell">
                    {t('transparency.thCategory')}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                    {t('transparency.thStatus')}
                  </th>
                  <th className="hidden px-5 py-3 text-right font-medium text-gray-600 dark:text-gray-300 sm:table-cell">
                    {t('transparency.thParticipants')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                {projects.map((p) => (
                  <tr
                    key={p.id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40"
                  >
                    <td className="px-5 py-3.5">
                      <a
                        href={`/projects/${p.id}`}
                        className="font-medium text-gray-900 transition-colors hover:text-green-700 dark:text-white dark:hover:text-green-400"
                      >
                        {p.title}
                      </a>
                    </td>
                    <td className="hidden px-4 py-3.5 text-gray-500 dark:text-gray-400 sm:table-cell">
                      {p.category}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="hidden px-5 py-3.5 text-right text-gray-500 dark:text-gray-400 sm:table-cell">
                      {p.participantCount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Transparency principles */}
      <section
        aria-label={t('transparency.principlesSectionLabel')}
        className="mb-10"
      >
        <h2 className="mb-5 text-xl font-semibold text-gray-900 dark:text-white">
          {t('transparency.principlesHeading')}
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
            >
              <div
                className="mb-3 h-6 w-1.5 rounded bg-green-500"
                aria-hidden="true"
              />
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Prototype footer */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-800 dark:bg-amber-900/20">
        <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-300">
          <strong>{t('transparency.footerLabel')}</strong>{' '}
          {t('transparency.footerText')}
        </p>
      </div>
    </Container>
  );
}

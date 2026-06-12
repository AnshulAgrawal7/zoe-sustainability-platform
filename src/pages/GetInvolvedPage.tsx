import { useTranslation } from 'react-i18next';
import Container from '../components/layout/Container';
import { Link } from 'react-router-dom';
import { Award, ArrowRight, CalendarDays, GraduationCap } from 'lucide-react';
import TouristContribution from '../components/engagement/TouristContribution';
import ProjectMap, { type MapPoint } from '../components/map/ProjectMap';
import { projects } from '../data/projects';

// Fallback-data points (this page uses the static catalogue, no backend call).
const mapPoints: MapPoint[] = projects
  .filter((p) => p.lat != null && p.lng != null)
  .map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    sdgs: p.sdgs,
    lat: p.lat as number,
    lng: p.lng as number,
  }));

// "Get Involved as a Visitor" (J2) — reframed around tourists. The general
// initiative explorer (residents/overview) lives on the Projects/Initiatives
// pages; here the focus is low-threshold ways a visitor can help during a stay.
const QUICK_ACTIONS = [
  { key: 'events', to: '/events', Icon: CalendarDays },
  { key: 'learn', to: '/learn', Icon: GraduationCap },
] as const;

export default function GetInvolvedPage() {
  const { t } = useTranslation();

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
        {t('getInvolved.title')}
      </h1>
      <p className="mt-3 max-w-3xl text-lg text-gray-700 dark:text-gray-300">
        {t('getInvolved.subtitle')}
      </p>

      {/* Tourist contribution — the centrepiece of this page */}
      <div className="mt-10">
        <TouristContribution />
      </div>

      {/* Quick, low-threshold actions during a visit */}
      <section aria-labelledby="quick-heading" className="mt-12">
        <h2
          id="quick-heading"
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          {t('getInvolved.quick.heading')}
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {QUICK_ACTIONS.map(({ key, to, Icon }) => (
            <Link
              key={key}
              to={to}
              className="group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-green-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-600"
            >
              <span className="rounded-lg bg-green-100 p-2.5 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <Icon size={22} aria-hidden="true" />
              </span>
              <span className="flex-1">
                <span className="flex items-center gap-1.5 font-semibold text-gray-900 transition-colors group-hover:text-green-700 dark:text-white dark:group-hover:text-green-400">
                  {t(`getInvolved.quick.${key}.title`)}
                  <ArrowRight size={15} aria-hidden="true" />
                </span>
                <span className="mt-1 block text-sm text-gray-600 dark:text-gray-300">
                  {t(`getInvolved.quick.${key}.desc`)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Compact map — where the initiatives happen across North Corfu.
          The ProjectMap's role="region" already carries the accessible name. */}
      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          {t('map.ariaLabel')}
        </h2>
        <ProjectMap points={mapPoints} />
      </section>

      {/* Rewards is a CONSEQUENCE of participation, shown as a secondary link. */}
      <div className="mt-12 rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Award
              size={16}
              aria-hidden="true"
              className="text-amber-500 dark:text-amber-400"
            />
            {t('getInvolved.rewardsNote')}
          </p>
          <Link
            to="/rewards"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:underline dark:text-green-400"
          >
            {t('getInvolved.rewardsLink')}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Container>
  );
}

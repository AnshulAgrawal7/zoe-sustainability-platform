import { useTranslation } from 'react-i18next';
import Container from '../components/layout/Container';
import { Link } from 'react-router-dom';
import { Award, ArrowRight } from 'lucide-react';
import InitiativeTabs from '../components/engagement/InitiativeTabs';
import TouristContribution from '../components/engagement/TouristContribution';
import NewsletterSignup from '../components/ui/NewsletterSignup';
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

/**
 * "Get Involved" — additive page (Iteration 7) bundling three additive,
 * literature-grounded features:
 *  - InitiativeTabs (TP1 / stakeholder "tabs by initiative")
 *  - TouristContribution (TP6 / tourists as a resource)
 *  - NewsletterSignup (stakeholder "newsletter" — concept only)
 */
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

      <section aria-labelledby="initiatives-heading" className="mt-10">
        <h2
          id="initiatives-heading"
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          {t('getInvolved.initiatives.heading')}
        </h2>
        <p className="mt-2 max-w-2xl text-gray-700 dark:text-gray-300">
          {t('getInvolved.initiatives.intro')}
        </p>
        <div className="mt-6">
          <InitiativeTabs projects={projects} />
        </div>
      </section>

      {/* Compact map of the initiatives (Z1 central info / Z5 local identity).
          The <section> is intentionally NOT a landmark (no accessible name) — the
          ProjectMap's role="region" already carries the name, so this avoids a
          duplicate-landmark axe violation. */}
      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          {t('map.ariaLabel')}
        </h2>
        <ProjectMap points={mapPoints} />
      </section>

      <div className="mt-12">
        <TouristContribution />
      </div>

      <div className="mt-12">
        <NewsletterSignup />
      </div>

      {/* Rewards is a CONSEQUENCE of participation, not a participation path — so it
          lives here as a secondary link (and in the personal menu), not in the
          main "Mitmachen" menu. */}
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

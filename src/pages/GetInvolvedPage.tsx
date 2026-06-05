import { useTranslation } from 'react-i18next';
import InitiativeTabs from '../components/engagement/InitiativeTabs';
import TouristContribution from '../components/engagement/TouristContribution';
import NewsletterSignup from '../components/ui/NewsletterSignup';
import { projects } from '../data/projects';

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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
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

      <div className="mt-12">
        <TouristContribution />
      </div>

      <div className="mt-12">
        <NewsletterSignup />
      </div>
    </div>
  );
}

import { useTranslation } from 'react-i18next';
import { Lock, Mail } from 'lucide-react';

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <Lock
            size={32}
            className="text-green-600 dark:text-green-400"
            aria-hidden="true"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('privacy.title')}
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {t('privacy.subtitle')}
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          {t('privacy.prototypeNotice')}
        </div>
      </div>

      <div className="space-y-8">
        <section aria-labelledby="overview-heading">
          <h2
            id="overview-heading"
            className="mb-3 text-xl font-semibold text-gray-900 dark:text-white"
          >
            {t('privacy.overviewTitle')}
          </h2>
          <p className="leading-relaxed text-gray-600 dark:text-gray-300">
            {t('privacy.overviewText')}
          </p>
        </section>

        <section aria-labelledby="data-heading">
          <h2
            id="data-heading"
            className="mb-3 text-xl font-semibold text-gray-900 dark:text-white"
          >
            {t('privacy.dataTitle')}
          </h2>
          <p className="leading-relaxed text-gray-600 dark:text-gray-300">
            {t('privacy.dataText')}
          </p>
        </section>

        <section aria-labelledby="cookies-heading">
          <h2
            id="cookies-heading"
            className="mb-3 text-xl font-semibold text-gray-900 dark:text-white"
          >
            {t('privacy.cookiesTitle')}
          </h2>
          <p className="leading-relaxed text-gray-600 dark:text-gray-300">
            {t('privacy.cookiesText')}
          </p>
        </section>

        <section aria-labelledby="analytics-heading">
          <h2
            id="analytics-heading"
            className="mb-3 text-xl font-semibold text-gray-900 dark:text-white"
          >
            {t('privacy.analyticsTitle')}
          </h2>
          <p className="leading-relaxed text-gray-600 dark:text-gray-300">
            {t('privacy.analyticsText')}
          </p>
        </section>

        <section aria-labelledby="processors-heading">
          <h2
            id="processors-heading"
            className="mb-3 text-xl font-semibold text-gray-900 dark:text-white"
          >
            {t('privacy.processorsTitle')}
          </h2>
          <p className="leading-relaxed text-gray-600 dark:text-gray-300">
            {t('privacy.processorsText')}
          </p>
        </section>

        <section aria-labelledby="rights-heading">
          <h2
            id="rights-heading"
            className="mb-3 text-xl font-semibold text-gray-900 dark:text-white"
          >
            {t('privacy.rightsTitle')}
          </h2>
          <p className="leading-relaxed text-gray-600 dark:text-gray-300">
            {t('privacy.rightsText')}
          </p>
        </section>

        <section
          aria-labelledby="contact-heading"
          className="rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20"
        >
          <h2
            id="contact-heading"
            className="mb-3 text-xl font-semibold text-gray-900 dark:text-white"
          >
            {t('privacy.contactTitle')}
          </h2>
          <p className="mb-3 text-gray-600 dark:text-gray-300">
            {t('privacy.contactText')}
          </p>
          <a
            href="mailto:privacy@zoe-corfu.gr"
            className="inline-flex items-center gap-2 font-medium text-green-700 hover:underline dark:text-green-400"
          >
            <Mail size={16} aria-hidden="true" />
            privacy@zoe-corfu.gr
          </a>
        </section>

        <div className="border-t border-gray-200 pt-4 text-sm text-gray-400 dark:border-gray-700 dark:text-gray-500">
          {t('privacy.lastUpdate')}: {t('privacy.lastUpdateDate')}
        </div>
      </div>
    </div>
  );
}

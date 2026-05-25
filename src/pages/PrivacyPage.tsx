import { useTranslation } from 'react-i18next';
import { Lock, Mail } from 'lucide-react';

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Lock size={32} className="text-green-600 dark:text-green-400" aria-hidden="true" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('privacy.title')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{t('privacy.subtitle')}</p>
          </div>
        </div>
        <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
          {t('privacy.prototypeNotice')}
        </div>
      </div>

      <div className="space-y-8">
        <section aria-labelledby="overview-heading">
          <h2 id="overview-heading" className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {t('privacy.overviewTitle')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {t('privacy.overviewText')}
          </p>
        </section>

        <section aria-labelledby="data-heading">
          <h2 id="data-heading" className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {t('privacy.dataTitle')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {t('privacy.dataText')}
          </p>
        </section>

        <section aria-labelledby="cookies-heading">
          <h2 id="cookies-heading" className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {t('privacy.cookiesTitle')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {t('privacy.cookiesText')}
          </p>
        </section>

        <section aria-labelledby="rights-heading">
          <h2 id="rights-heading" className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {t('privacy.rightsTitle')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {t('privacy.rightsText')}
          </p>
        </section>

        <section
          aria-labelledby="contact-heading"
          className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-6"
        >
          <h2 id="contact-heading" className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {t('privacy.contactTitle')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-3">
            {t('privacy.contactText')}
          </p>
          <a
            href="mailto:privacy@zoe-corfu.gr"
            className="inline-flex items-center gap-2 text-green-700 dark:text-green-400 font-medium hover:underline"
          >
            <Mail size={16} aria-hidden="true" />
            privacy@zoe-corfu.gr
          </a>
        </section>

        <div className="text-sm text-gray-400 dark:text-gray-500 border-t border-gray-200 dark:border-gray-700 pt-4">
          {t('privacy.lastUpdate')}: {t('privacy.lastUpdateDate')}
        </div>
      </div>
    </div>
  );
}

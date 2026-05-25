import { useTranslation } from 'react-i18next';
import { ShieldCheck, Mail, ExternalLink } from 'lucide-react';

export default function AccessibilityPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck size={32} className="text-green-600 dark:text-green-400" aria-hidden="true" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('accessibility.title')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{t('accessibility.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <section aria-labelledby="conformance-heading">
          <h2 id="conformance-heading" className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {t('accessibility.conformanceTitle')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {t('accessibility.conformanceText')}
          </p>
        </section>

        <section aria-labelledby="limits-heading">
          <h2 id="limits-heading" className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {t('accessibility.limitsTitle')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {t('accessibility.limitsText')}
          </p>
        </section>

        <section
          aria-labelledby="feedback-heading"
          className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-6"
        >
          <h2 id="feedback-heading" className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {t('accessibility.feedbackTitle')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-3">
            {t('accessibility.feedbackText')}
          </p>
          <a
            href="mailto:accessibility@zoe-corfu.gr"
            className="inline-flex items-center gap-2 text-green-700 dark:text-green-400 font-medium hover:underline"
          >
            <Mail size={16} aria-hidden="true" />
            accessibility@zoe-corfu.gr
          </a>
        </section>

        <section aria-labelledby="legal-heading">
          <h2 id="legal-heading" className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {t('accessibility.legalBasis')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
            {t('accessibility.legalBasisText')}
          </p>
          <a
            href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016L2102"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green-700 dark:text-green-400 font-medium hover:underline"
          >
            <ExternalLink size={16} aria-hidden="true" />
            {t('accessibility.euDirectiveLink')}
          </a>
        </section>

        <div className="text-sm text-gray-400 dark:text-gray-500 border-t border-gray-200 dark:border-gray-700 pt-4">
          {t('accessibility.lastReview')}: {t('accessibility.lastReviewDate')}
        </div>
      </div>
    </div>
  );
}

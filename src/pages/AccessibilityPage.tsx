import { useTranslation } from 'react-i18next';
import Container from '../components/layout/Container';
import { ShieldCheck, Mail, ExternalLink } from 'lucide-react';

export default function AccessibilityPage() {
  const { t } = useTranslation();

  return (
    <Container maxW="3xl" className="py-12">
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <ShieldCheck
            size={32}
            className="text-green-600 dark:text-green-400"
            aria-hidden="true"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('accessibility.title')}
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {t('accessibility.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <section aria-labelledby="conformance-heading">
          <h2
            id="conformance-heading"
            className="mb-3 text-xl font-semibold text-gray-900 dark:text-white"
          >
            {t('accessibility.conformanceTitle')}
          </h2>
          <p className="leading-relaxed text-gray-600 dark:text-gray-300">
            {t('accessibility.conformanceText')}
          </p>
        </section>

        <section aria-labelledby="limits-heading">
          <h2
            id="limits-heading"
            className="mb-3 text-xl font-semibold text-gray-900 dark:text-white"
          >
            {t('accessibility.limitsTitle')}
          </h2>
          <p className="leading-relaxed text-gray-600 dark:text-gray-300">
            {t('accessibility.limitsText')}
          </p>
        </section>

        <section
          aria-labelledby="feedback-heading"
          className="rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20"
        >
          <h2
            id="feedback-heading"
            className="mb-3 text-xl font-semibold text-gray-900 dark:text-white"
          >
            {t('accessibility.feedbackTitle')}
          </h2>
          <p className="mb-3 text-gray-600 dark:text-gray-300">
            {t('accessibility.feedbackText')}
          </p>
          <a
            href="mailto:accessibility@zoe-corfu.gr"
            className="inline-flex items-center gap-2 font-medium text-green-700 hover:underline dark:text-green-400"
          >
            <Mail size={16} aria-hidden="true" />
            accessibility@zoe-corfu.gr
          </a>
        </section>

        <section aria-labelledby="legal-heading">
          <h2
            id="legal-heading"
            className="mb-3 text-xl font-semibold text-gray-900 dark:text-white"
          >
            {t('accessibility.legalBasis')}
          </h2>
          <p className="mb-3 leading-relaxed text-gray-600 dark:text-gray-300">
            {t('accessibility.legalBasisText')}
          </p>
          <a
            href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016L2102"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-medium text-green-700 hover:underline dark:text-green-400"
          >
            <ExternalLink size={16} aria-hidden="true" />
            {t('accessibility.euDirectiveLink')}
          </a>
        </section>

        <div className="border-t border-gray-200 pt-4 text-sm text-gray-400 dark:border-gray-700 dark:text-gray-500">
          {t('accessibility.lastReview')}: {t('accessibility.lastReviewDate')}
        </div>
      </div>
    </Container>
  );
}

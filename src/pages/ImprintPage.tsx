import { useTranslation } from 'react-i18next';
import Container from '../components/layout/Container';
import { FileText, Mail, AlertTriangle } from 'lucide-react';

/**
 * Imprint / Impressum — template page for Szenario A (self-hosted public demo).
 * All operator-specific values are placeholders ([…]) the operator fills in
 * before going live; see to-do.md §6 and docs/deployment/handover-szenario-a.md.
 * Not legal advice.
 */
export default function ImprintPage() {
  const { t } = useTranslation();

  const placeholderRows = [
    {
      label: t('imprint.fieldOperator'),
      value: t('imprint.placeholderOperator'),
    },
    {
      label: t('imprint.fieldAddress'),
      value: t('imprint.placeholderAddress'),
    },
    { label: t('imprint.fieldEmail'), value: t('imprint.placeholderEmail') },
    { label: t('imprint.fieldPhone'), value: t('imprint.placeholderPhone') },
  ];

  return (
    <Container maxW="3xl" className="py-12">
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <FileText
            size={32}
            className="text-green-600 dark:text-green-400"
            aria-hidden="true"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('imprint.title')}
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {t('imprint.subtitle')}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          <AlertTriangle
            size={18}
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <span>{t('imprint.prototypeNotice')}</span>
        </div>
      </div>

      <div className="space-y-8">
        <section aria-labelledby="operator-heading">
          <h2
            id="operator-heading"
            className="mb-3 text-xl font-semibold text-gray-900 dark:text-white"
          >
            {t('imprint.operatorTitle')}
          </h2>
          <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">
            {t('imprint.operatorIntro')}
          </p>
          <dl className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
            {placeholderRows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-3"
              >
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {row.label}
                </dt>
                <dd className="font-mono text-sm text-gray-700 dark:text-gray-200 sm:col-span-2">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="responsible-heading">
          <h2
            id="responsible-heading"
            className="mb-3 text-xl font-semibold text-gray-900 dark:text-white"
          >
            {t('imprint.responsibleTitle')}
          </h2>
          <p className="leading-relaxed text-gray-600 dark:text-gray-300">
            {t('imprint.responsibleText')}
          </p>
        </section>

        <section aria-labelledby="disclaimer-heading">
          <h2
            id="disclaimer-heading"
            className="mb-3 text-xl font-semibold text-gray-900 dark:text-white"
          >
            {t('imprint.disclaimerTitle')}
          </h2>
          <p className="leading-relaxed text-gray-600 dark:text-gray-300">
            {t('imprint.disclaimerText')}
          </p>
        </section>

        <section aria-labelledby="liability-heading">
          <h2
            id="liability-heading"
            className="mb-3 text-xl font-semibold text-gray-900 dark:text-white"
          >
            {t('imprint.liabilityLinksTitle')}
          </h2>
          <p className="leading-relaxed text-gray-600 dark:text-gray-300">
            {t('imprint.liabilityLinksText')}
          </p>
        </section>

        <section aria-labelledby="copyright-heading">
          <h2
            id="copyright-heading"
            className="mb-3 text-xl font-semibold text-gray-900 dark:text-white"
          >
            {t('imprint.copyrightTitle')}
          </h2>
          <p className="leading-relaxed text-gray-600 dark:text-gray-300">
            {t('imprint.copyrightText')}
          </p>
        </section>

        <section
          aria-labelledby="imprint-contact-heading"
          className="rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20"
        >
          <h2
            id="imprint-contact-heading"
            className="mb-3 text-xl font-semibold text-gray-900 dark:text-white"
          >
            {t('imprint.contactTitle')}
          </h2>
          <p className="mb-3 text-gray-600 dark:text-gray-300">
            {t('imprint.contactText')}
          </p>
          <a
            href="mailto:privacy@zoe-corfu.gr"
            className="inline-flex items-center gap-2 rounded font-medium text-green-700 hover:underline focus-visible:ring-2 focus-visible:ring-green-500 dark:text-green-400"
          >
            <Mail size={16} aria-hidden="true" />
            privacy@zoe-corfu.gr
          </a>
        </section>

        <div className="border-t border-gray-200 pt-4 text-sm text-gray-400 dark:border-gray-700 dark:text-gray-500">
          {t('imprint.lastUpdate')}: {t('imprint.lastUpdateDate')}
        </div>
      </div>
    </Container>
  );
}

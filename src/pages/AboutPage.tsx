import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AboutPage() {
  const { t } = useTranslation();
  const principles = t('about.principles', { returnObjects: true }) as {
    title: string;
    desc: string;
  }[];
  const contextStats = t('about.contextStats', { returnObjects: true }) as {
    stat: string;
    label: string;
    note: string;
  }[];
  const issues = t('about.issues', { returnObjects: true }) as {
    title: string;
    desc: string;
  }[];
  const partners = t('about.partners', { returnObjects: true }) as {
    name: string;
    desc: string;
  }[];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 to-green-700 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-teal-200">
            <MapPin size={14} aria-hidden="true" />
            <span>{t('about.heroEyebrow')}</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold text-white">
            {t('about.heroTitle')}
          </h1>
          <p className="text-xl leading-relaxed text-teal-100">
            {t('about.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* What is ZOE */}
      <section className="bg-white py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                {t('about.whatTitle')}
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                {t('about.whatP1')}
              </p>
              <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                {t('about.whatP2')}
              </p>
              <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                {t('about.whatP3')}
              </p>
            </div>
            <div className="rounded-xl border border-green-100 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
              <h3 className="mb-4 font-semibold text-green-800 dark:text-green-300">
                {t('about.principlesTitle')}
              </h3>
              <ul className="space-y-3">
                {principles.map((p) => (
                  <li key={p.title} className="flex items-start gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {p.title}:
                      </span>{' '}
                      <span className="text-gray-600 dark:text-gray-300">
                        {p.desc}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Northern Corfu context */}
      <section className="bg-white py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
            {t('about.contextTitle')}
          </h2>
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {contextStats.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800"
              >
                <p className="mb-1 text-2xl font-bold text-green-700 dark:text-green-400">
                  {item.stat}
                </p>
                <p className="text-xs font-medium text-gray-900 dark:text-white">
                  {item.label}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {item.note}
                </p>
              </div>
            ))}
          </div>

          {/* Real issues */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {issues.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <h3 className="mb-1.5 text-sm font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Partners */}
          <div className="rounded-xl border border-green-100 bg-green-50 p-5 dark:border-green-800 dark:bg-green-900/20">
            <h3 className="mb-3 text-sm font-semibold text-green-800 dark:text-green-300">
              {t('about.partnersTitle')}
            </h3>
            <div className="grid grid-cols-1 gap-3 text-sm text-gray-700 dark:text-gray-300 sm:grid-cols-2">
              {partners.map((p) => (
                <div key={p.name} className="flex items-start gap-2">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500"
                    aria-hidden="true"
                  />
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {p.name}:
                    </span>{' '}
                    <span className="text-gray-600 dark:text-gray-300">
                      {p.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-700 py-12 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-white">
            {t('about.ctaTitle')}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/projects"
              className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 font-semibold text-green-700 transition-colors hover:bg-green-50"
            >
              {t('about.ctaProjects')}{' '}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              to="/audiences"
              className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 font-semibold text-green-700 transition-colors hover:bg-green-50"
            >
              {t('about.ctaAudiences')}{' '}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              to="/sdg-dashboard"
              className="rounded-lg border-2 border-white/60 px-5 py-2.5 font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              {t('about.ctaSdg')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

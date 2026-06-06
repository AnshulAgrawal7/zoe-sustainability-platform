import { CheckCircle2, Circle, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type Status = 'completed' | 'current' | 'upcoming';

// Structural metadata (status + which items are done) lives in code; the text
// content is translated and read from i18n by index.
const phaseMeta: { status: Status; done: boolean[] }[] = [
  { status: 'current', done: Array(10).fill(true) },
  { status: 'upcoming', done: Array(8).fill(false) },
  { status: 'upcoming', done: Array(7).fill(false) },
  { status: 'upcoming', done: Array(8).fill(false) },
  { status: 'upcoming', done: Array(7).fill(false) },
];

const statusConfig: Record<
  Status,
  { dotClass: string; badgeClass: string; lineClass: string }
> = {
  completed: {
    dotClass: 'bg-green-500 border-green-500',
    badgeClass:
      'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    lineClass: 'bg-green-300 dark:bg-green-700',
  },
  current: {
    dotClass:
      'bg-green-600 border-green-600 ring-4 ring-green-100 dark:ring-green-900/40',
    badgeClass: 'bg-green-600 text-white',
    lineClass: 'bg-gray-200 dark:bg-gray-700',
  },
  upcoming: {
    dotClass: 'bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600',
    badgeClass: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    lineClass: 'bg-gray-200 dark:bg-gray-700',
  },
};

interface PhaseContent {
  phase: string;
  period: string;
  description: string;
  items: string[];
}

export default function RoadmapPage() {
  const { t } = useTranslation();
  const phases = t('roadmap.phases', { returnObjects: true }) as PhaseContent[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
          {t('roadmap.title')}
        </h1>
        <p className="max-w-2xl leading-relaxed text-gray-600 dark:text-gray-300">
          {t('roadmap.intro')}
        </p>
        <div className="mt-3 inline-block rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
          <strong>{t('roadmap.statusLabel')}</strong> {t('roadmap.statusNote')}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {phaseMeta.map((meta, idx) => {
          const config = statusConfig[meta.status];
          const content = phases[idx];
          const isLast = idx === phaseMeta.length - 1;
          if (!content) return null;
          return (
            <div key={idx} className="mb-8 flex gap-6">
              {/* Timeline column */}
              <div className="flex flex-col items-center">
                <div
                  className={`mt-1 h-4 w-4 flex-shrink-0 rounded-full border-2 ${config.dotClass}`}
                  aria-hidden="true"
                />
                {!isLast && (
                  <div
                    className={`mt-1 w-0.5 flex-1 ${config.lineClass}`}
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {content.phase}
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${config.badgeClass}`}
                  >
                    {t(`roadmap.status.${meta.status}`)}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Clock size={13} aria-hidden="true" />
                    {content.period}
                  </span>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {content.description}
                </p>

                <ul className="space-y-1.5">
                  {content.items.map((label, i) => {
                    const done = meta.done[i] ?? false;
                    return (
                      <li
                        key={label}
                        className="flex items-start gap-2 text-sm"
                      >
                        {done ? (
                          <CheckCircle2
                            size={15}
                            className="mt-0.5 flex-shrink-0 text-green-500"
                            aria-hidden="true"
                          />
                        ) : (
                          <Circle
                            size={15}
                            className="mt-0.5 flex-shrink-0 text-gray-300 dark:text-gray-600"
                            aria-hidden="true"
                          />
                        )}
                        <span
                          className={
                            done
                              ? 'text-gray-700 dark:text-gray-200'
                              : 'text-gray-500 dark:text-gray-400'
                          }
                        >
                          {label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Backend concept link */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
        <h2 className="mb-2 font-semibold text-gray-900 dark:text-white">
          {t('roadmap.backendTitle')}
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {t('roadmap.backendText')}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/transparency"
            className="flex items-center gap-1 text-sm font-medium text-green-700 hover:underline dark:text-green-400"
          >
            {t('roadmap.linkImpact')}{' '}
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
          <Link
            to="/participate"
            className="flex items-center gap-1 text-sm font-medium text-green-700 hover:underline dark:text-green-400"
          >
            {t('roadmap.linkFeedback')}{' '}
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

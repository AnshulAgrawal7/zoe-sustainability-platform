import { useState } from 'react';
import Container from '../components/layout/Container';
import {
  Home,
  Wheat,
  Anchor,
  Building2,
  Sparkles,
  Plane,
  Wifi,
  WifiOff,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { targetAudiences } from '../data/audiences';

const iconMap: Record<string, React.ElementType> = {
  Home,
  Wheat,
  Anchor,
  Building2,
  Sparkles,
  Plane,
};

const audienceColors: Record<string, string> = {
  residents:
    'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-900/20',
  farmers:
    'border-lime-300 bg-lime-50 dark:border-lime-800 dark:bg-lime-900/20',
  fishermen:
    'border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20',
  'tourism-businesses':
    'border-teal-300 bg-teal-50 dark:border-teal-800 dark:bg-teal-900/20',
  'young-people':
    'border-violet-300 bg-violet-50 dark:border-violet-800 dark:bg-violet-900/20',
  tourists:
    'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20',
};

const audienceIconColors: Record<string, string> = {
  residents:
    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  farmers: 'bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300',
  fishermen: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'tourism-businesses':
    'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  'young-people':
    'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  tourists:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
};

export default function AudiencesPage() {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string | null>(null);
  const context = t('audiences.context', { returnObjects: true }) as {
    stat: string;
    label: string;
    note: string;
  }[];
  const principles = t('audiences.principles', { returnObjects: true }) as {
    title: string;
    desc: string;
  }[];

  return (
    <Container maxW="5xl" className="py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
          {t('audiences.title')}
        </h1>
        <p className="max-w-2xl leading-relaxed text-gray-600 dark:text-gray-300">
          {t('audiences.intro')}
        </p>
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20">
          <Info
            size={18}
            className="mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400"
            aria-hidden="true"
          />
          <p className="text-sm leading-relaxed text-blue-800 dark:text-blue-300">
            {t('audiences.researchNote')}
          </p>
        </div>
      </div>

      {/* Context strip */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {context.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-800"
          >
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">
              {item.stat}
            </p>
            <p className="mt-0.5 text-sm font-medium text-gray-900 dark:text-white">
              {item.label}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {item.note}
            </p>
          </div>
        ))}
      </div>

      {/* Audience cards */}
      <div className="space-y-4">
        {targetAudiences.map((audience) => {
          const Icon = iconMap[audience.icon] ?? Home;
          const isOpen = expanded === audience.id;
          const borderColor =
            audienceColors[audience.id] ??
            'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800';
          const iconColor =
            audienceIconColors[audience.id] ??
            'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';

          return (
            <div
              key={audience.id}
              className={`rounded-xl border-2 transition-all ${borderColor}`}
            >
              {/* Summary row — always visible */}
              <button
                onClick={() => setExpanded(isOpen ? null : audience.id)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left"
                aria-expanded={isOpen}
              >
                <div className={`flex-shrink-0 rounded-lg p-2.5 ${iconColor}`}>
                  <Icon size={20} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    {t(`audienceData.${audience.id}.name`)}
                  </h2>
                  <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">
                    {t(`audienceData.${audience.id}.tagline`)}
                  </p>
                </div>
                {isOpen ? (
                  <ChevronUp
                    size={18}
                    className="flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                ) : (
                  <ChevronDown
                    size={18}
                    className="flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                )}
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="grid grid-cols-1 gap-6 border-t border-black/5 px-5 pb-6 pt-5 dark:border-white/10 md:grid-cols-2">
                  {/* Left: description + concerns */}
                  <div>
                    <p className="mb-4 text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                      {t(`audienceData.${audience.id}.description`)}
                    </p>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      {t('audiences.keyConcerns')}
                    </h3>
                    <ul className="space-y-1.5">
                      {(
                        t(`audienceData.${audience.id}.keyConcerns`, {
                          returnObjects: true,
                        }) as string[]
                      ).map((concern) => (
                        <li
                          key={concern}
                          className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200"
                        >
                          <span
                            className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400"
                            aria-hidden="true"
                          />
                          {concern}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: channels + strategy */}
                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      {t('audiences.effectiveChannels')}
                    </h3>
                    <ul className="mb-4 space-y-1.5">
                      {audience.channels.map((ch, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200"
                        >
                          {ch.type === 'online' ? (
                            <Wifi
                              size={13}
                              className="mt-0.5 flex-shrink-0 text-blue-500"
                              aria-label={t('audiences.onlineChannel')}
                            />
                          ) : (
                            <WifiOff
                              size={13}
                              className="mt-0.5 flex-shrink-0 text-orange-500"
                              aria-label={t('audiences.offlineChannel')}
                            />
                          )}
                          {
                            (
                              t(`audienceData.${audience.id}.channels`, {
                                returnObjects: true,
                              }) as string[]
                            )[i]
                          }
                        </li>
                      ))}
                    </ul>

                    <div className="mb-3 rounded-lg border border-white bg-white/70 p-3 dark:border-gray-700 dark:bg-gray-900/40">
                      <p className="mb-1 text-xs font-semibold text-green-700 dark:text-green-400">
                        {t('audiences.entryPoint')}
                      </p>
                      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                        {t(`audienceData.${audience.id}.entryPoint`)}
                      </p>
                    </div>

                    <div className="rounded-lg border border-amber-100 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
                      <p className="mb-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                        {t('audiences.watchOut')}
                      </p>
                      <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-200">
                        {t(`audienceData.${audience.id}.barrierNote`)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sensitization principles */}
      <div className="mt-12">
        <h2 className="mb-5 text-xl font-semibold text-gray-900 dark:text-white">
          {t('audiences.principlesHeading')}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
            >
              <div
                className="mb-3 h-5 w-1 rounded bg-green-500"
                aria-hidden="true"
              />
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-10 rounded-xl border border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-900/20">
        <p className="mb-4 text-sm text-gray-700 dark:text-gray-200">
          {t('audiences.ctaText')}
        </p>
        <Link
          to="/participate"
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
        >
          {t('audiences.ctaButton')}
        </Link>
      </div>
    </Container>
  );
}

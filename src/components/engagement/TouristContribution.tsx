import { Link } from 'react-router-dom';
import { Trash2, MapPin, Anchor, Leaf, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// TP6 — turn visitors from a perceived burden into a resource for
// sustainability. Grounded in Vegas Macias et al. (2023) [A] and
// Laksmi et al. (2026) [A]; see docs/literature-review.md §G.
const WAYS = [
  { key: 'cleanups', Icon: Trash2 },
  { key: 'report', Icon: MapPin },
  { key: 'choose', Icon: Anchor },
  { key: 'respect', Icon: Leaf },
] as const;

export default function TouristContribution() {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="tourists-heading"
      className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900 sm:p-8"
    >
      <h2
        id="tourists-heading"
        className="text-2xl font-bold text-gray-900 dark:text-white"
      >
        {t('getInvolved.tourists.heading')}
      </h2>
      <p className="mt-2 max-w-2xl text-gray-700 dark:text-gray-300">
        {t('getInvolved.tourists.intro')}
      </p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {WAYS.map(({ key, Icon }) => (
          <li
            key={key}
            className="flex gap-3 rounded-lg bg-green-50 p-4 dark:bg-green-900/20"
          >
            <Icon
              size={22}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-green-700 dark:text-green-400"
            />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t(`getInvolved.tourists.ways.${key}.title`)}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {t(`getInvolved.tourists.ways.${key}.desc`)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <Link
        to="/participate"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
      >
        {t('getInvolved.tourists.cta')}
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </section>
  );
}

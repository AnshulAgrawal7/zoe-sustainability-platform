import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import type { Project, ApiProjectCategory } from '../../types';

// Maps ZOE's 5 canonical project categories onto the thematic initiatives the
// municipality communicates (stakeholder request: "tabs for different
// initiatives — marine protection, natural monuments, ...").
type InitiativeId =
  | 'natureBiodiversity'
  | 'circularClimate'
  | 'educationTourism';

const CATEGORY_TO_INITIATIVE: Record<ApiProjectCategory, InitiativeId> = {
  ENVIRONMENT: 'natureBiodiversity',
  MOBILITY: 'circularClimate',
  COMMUNITY: 'circularClimate',
  EDUCATION: 'educationTourism',
  CULTURE: 'educationTourism',
};

const INITIATIVE_ORDER: InitiativeId[] = [
  'natureBiodiversity',
  'circularClimate',
  'educationTourism',
];

interface InitiativeTabsProps {
  projects: Project[];
}

/**
 * Accessible tabbed grouping of ZOE actions by thematic initiative.
 * Implements the WAI-ARIA tabs pattern (roving tabindex + arrow-key nav).
 */
export default function InitiativeTabs({ projects }: InitiativeTabsProps) {
  const { t } = useTranslation();
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const grouped = INITIATIVE_ORDER.map((id) => ({
    id,
    items: projects.filter((p) => CATEGORY_TO_INITIATIVE[p.category] === id),
  })).filter((group) => group.items.length > 0);

  if (grouped.length === 0) {
    return (
      <p className="text-gray-600 dark:text-gray-300">
        {t('getInvolved.initiatives.noProjects')}
      </p>
    );
  }

  const current = Math.min(active, grouped.length - 1);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const last = grouped.length - 1;
    let next: number;
    switch (event.key) {
      case 'ArrowRight':
        next = current === last ? 0 : current + 1;
        break;
      case 'ArrowLeft':
        next = current === 0 ? last : current - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = last;
        break;
      default:
        return;
    }
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={t('getInvolved.initiatives.tablistLabel')}
        className="flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-700"
      >
        {grouped.map((group, index) => {
          const selected = index === current;
          return (
            <button
              key={group.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${group.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${group.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={onKeyDown}
              className={`-mb-px rounded-t-md border-b-2 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 ${
                selected
                  ? 'border-green-600 text-green-700 dark:border-green-400 dark:text-green-400'
                  : 'border-transparent text-gray-600 hover:text-green-700 dark:text-gray-300 dark:hover:text-green-400'
              }`}
            >
              {t(`getInvolved.initiatives.${group.id}.name`)}
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {group.items.length}
              </span>
            </button>
          );
        })}
      </div>

      {grouped.map((group, index) => (
        <div
          key={group.id}
          role="tabpanel"
          id={`${baseId}-panel-${group.id}`}
          aria-labelledby={`${baseId}-tab-${group.id}`}
          hidden={index !== current}
          tabIndex={0}
          className="pt-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
        >
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t(`getInvolved.initiatives.${group.id}.description`)}
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {group.items.map((project) => (
              <li
                key={project.id}
                className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
              >
                <Link
                  to={`/projects/${project.id}`}
                  className="font-semibold text-green-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-green-400"
                >
                  {project.title}
                </Link>
                <p className="mt-1 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <MapPin size={14} aria-hidden="true" />
                  {project.location}
                </p>
                <span className="mt-2 inline-block rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  {t(`getInvolved.initiatives.status.${project.status}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

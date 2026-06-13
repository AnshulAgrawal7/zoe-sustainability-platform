import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getEvents } from '../../services/eventService';
import EventsMap from './EventsMap';
import {
  buildProjectColors,
  colorForProject,
  NO_PROJECT_COLOR,
  type EventMapPoint,
} from './eventColors';
import type { ApiEvent } from '../../types';

interface Props {
  className?: string;
}

interface LegendEntry {
  projectId: string | null;
  label: string;
  color: string;
}

// Self-contained events map: fetches located events, colours markers by project
// and renders a matching legend. Reused on /events and /get-involved.
export default function EventsMapSection({ className }: Props) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2);
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoaded(true));
  }, []);

  function projectTitle(e: ApiEvent): string {
    if (!e.project) return '';
    if (lang === 'el') return e.project.titleEl;
    if (lang === 'de') return e.project.titleDe;
    return e.project.titleEn;
  }
  function eventTitle(e: ApiEvent): string {
    if (lang === 'el') return e.titleEl;
    if (lang === 'de') return e.titleDe;
    return e.titleEn;
  }

  const located = events.filter((e) => e.lat != null && e.lng != null);

  const points: EventMapPoint[] = located.map((e) => ({
    id: e.id,
    title: eventTitle(e),
    projectId: e.projectId,
    lat: e.lat as number,
    lng: e.lng as number,
  }));

  const colors = buildProjectColors(located.map((e) => e.projectId));

  // Legend: distinct projects present (+ "no specific project" if any).
  const seen = new Set<string>();
  const legend: LegendEntry[] = [];
  let hasNoProject = false;
  for (const e of located) {
    if (!e.projectId) {
      hasNoProject = true;
      continue;
    }
    if (seen.has(e.projectId)) continue;
    seen.add(e.projectId);
    legend.push({
      projectId: e.projectId,
      label: projectTitle(e) || e.projectId,
      color: colorForProject(e.projectId, colors),
    });
  }
  legend.sort((a, b) => a.label.localeCompare(b.label));
  if (hasNoProject) {
    legend.push({
      projectId: null,
      label: t('map.noSpecificProject'),
      color: NO_PROJECT_COLOR,
    });
  }

  // Nothing to show until events with coordinates exist.
  if (loaded && points.length === 0) return null;

  return (
    <div className={className}>
      <EventsMap points={points} colors={colors} className="mb-3" />
      {legend.length > 0 && (
        <ul
          aria-label={t('map.legendLabel')}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs dark:border-gray-700 dark:bg-gray-800"
        >
          <li className="font-medium text-gray-600 dark:text-gray-300">
            {t('map.legendByProject')}:
          </li>
          {legend.map((entry) => (
            <li
              key={entry.projectId ?? 'none'}
              className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300"
            >
              <span
                className="inline-block h-3 w-3 rounded-full ring-1 ring-black/10 dark:ring-white/20"
                style={{ backgroundColor: entry.color }}
                aria-hidden="true"
              />
              {entry.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

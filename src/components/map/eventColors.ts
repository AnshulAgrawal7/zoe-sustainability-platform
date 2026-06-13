// Marker-colour helpers for the events map, kept out of the component file so
// fast refresh keeps working (react-refresh/only-export-components).

// Each PROJECT gets its own marker colour (events are coloured by the project
// they belong to). Events without a project fall back to grey.
export const NO_PROJECT_COLOR = '#9ca3af';

const PALETTE = [
  '#16a34a', // green
  '#2563eb', // blue
  '#f97316', // orange
  '#a855f7', // purple
  '#0d9488', // teal
  '#dc2626', // red
  '#ca8a04', // amber
  '#db2777', // pink
  '#0891b2', // cyan
  '#65a30d', // lime
  '#7c3aed', // violet
  '#e11d48', // rose
];

// Stable projectId → colour map (sorted so the assignment never shuffles).
export function buildProjectColors(
  projectIds: (string | null)[]
): Record<string, string> {
  const uniq = [
    ...new Set(projectIds.filter((id): id is string => !!id)),
  ].sort();
  const map: Record<string, string> = {};
  uniq.forEach((id, i) => {
    map[id] = PALETTE[i % PALETTE.length];
  });
  return map;
}

export function colorForProject(
  projectId: string | null,
  colors: Record<string, string>
): string {
  return (projectId && colors[projectId]) || NO_PROJECT_COLOR;
}

export interface EventMapPoint {
  id: string;
  title: string;
  projectId: string | null;
  lat: number;
  lng: number;
}

import {
  Leaf,
  Bike,
  Users,
  GraduationCap,
  Palette,
  Megaphone,
  CalendarDays,
  FolderKanban,
  Newspaper,
  RefreshCw,
} from 'lucide-react';
import type { ElementType } from 'react';

// ONE source of card visuals. Both category enums (PROJECT_CATEGORIES for
// projects/events/learn, PostCategory for the feed) map onto the same generic
// visual keys below, so the accent bar, the no-image fallback gradient, the
// category icon and the badge chip never have parallel definitions.

export interface CategoryVisual {
  /** Accent bar / strong colour (e.g. card top strip). */
  accent: string;
  /** Raw hex of `accent` — for non-Tailwind contexts (Leaflet divIcons, legend
   *  swatches, inline SVG) where a class name can't be used. Keep in sync. */
  dotHex: string;
  /** No-image fallback gradient (used with `bg-gradient-to-br`). */
  gradient: string;
  /** Light badge chip (bg + text), light & dark. */
  badge: string;
  /** Category icon. */
  Icon: ElementType;
}

// Generic visual keys (the single source of truth).
const VISUALS = {
  environment: {
    accent: 'bg-green-500',
    dotHex: '#22c55e',
    gradient: 'from-green-400 to-emerald-600',
    badge:
      'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    Icon: Leaf,
  },
  mobility: {
    accent: 'bg-blue-500',
    dotHex: '#3b82f6',
    gradient: 'from-sky-400 to-blue-600',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    Icon: Bike,
  },
  community: {
    accent: 'bg-orange-500',
    dotHex: '#f97316',
    gradient: 'from-amber-400 to-orange-600',
    badge:
      'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
    Icon: Users,
  },
  education: {
    accent: 'bg-purple-500',
    dotHex: '#a855f7',
    gradient: 'from-violet-400 to-purple-600',
    badge:
      'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    Icon: GraduationCap,
  },
  culture: {
    accent: 'bg-teal-500',
    dotHex: '#14b8a6',
    gradient: 'from-teal-400 to-cyan-600',
    badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
    Icon: Palette,
  },
  announcement: {
    accent: 'bg-blue-500',
    dotHex: '#3b82f6',
    gradient: 'from-blue-400 to-indigo-600',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    Icon: Megaphone,
  },
  event: {
    accent: 'bg-orange-500',
    dotHex: '#f97316',
    gradient: 'from-orange-400 to-rose-500',
    badge:
      'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
    Icon: CalendarDays,
  },
  projectFeed: {
    accent: 'bg-green-500',
    dotHex: '#22c55e',
    gradient: 'from-green-400 to-emerald-600',
    badge:
      'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    Icon: FolderKanban,
  },
  news: {
    accent: 'bg-teal-500',
    dotHex: '#14b8a6',
    gradient: 'from-teal-400 to-cyan-600',
    badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
    Icon: Newspaper,
  },
  update: {
    accent: 'bg-gray-400',
    dotHex: '#9ca3af',
    gradient: 'from-gray-400 to-slate-500',
    badge: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    Icon: RefreshCw,
  },
} satisfies Record<string, CategoryVisual>;

type VisualKey = keyof typeof VISUALS;

// Every real enum value is mapped explicitly — no silent gray default.
const PROJECT_CATEGORY: Record<string, VisualKey> = {
  ENVIRONMENT: 'environment',
  MOBILITY: 'mobility',
  COMMUNITY: 'community',
  EDUCATION: 'education',
  CULTURE: 'culture',
};

const FEED_CATEGORY: Record<string, VisualKey> = {
  ANNOUNCEMENT: 'announcement',
  EVENT: 'event',
  PROJECT: 'projectFeed',
  NEWS: 'news',
  PROJECT_UPDATE: 'update',
};

/** Visual for a PROJECT_CATEGORIES value (projects, events, learn). */
export function projectCategoryVisual(category: string): CategoryVisual {
  return VISUALS[PROJECT_CATEGORY[category] ?? 'community'];
}

/** Raw hex accent for a PROJECT_CATEGORIES value (Leaflet markers, legend). */
export function projectCategoryHex(category: string): string {
  return projectCategoryVisual(category).dotHex;
}

/** The five project categories, in their canonical order (legend, filters). */
export const PROJECT_CATEGORY_KEYS = [
  'ENVIRONMENT',
  'MOBILITY',
  'COMMUNITY',
  'EDUCATION',
  'CULTURE',
] as const;

/** Visual for a PostCategory value (the merged feed). */
export function feedCategoryVisual(category: string): CategoryVisual {
  return VISUALS[FEED_CATEGORY[category] ?? 'update'];
}

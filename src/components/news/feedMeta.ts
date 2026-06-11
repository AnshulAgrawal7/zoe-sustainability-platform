// Shared presentation maps for the feed card and the news detail page.
export const DATE_LOCALES: Record<string, string> = {
  en: 'en-GB',
  el: 'el-GR',
  de: 'de-DE',
};

export const CATEGORY_COLOR: Record<string, string> = {
  ANNOUNCEMENT:
    'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  EVENT:
    'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  PROJECT:
    'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  NEWS: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
  PROJECT_UPDATE:
    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export function categoryColor(category: string): string {
  return CATEGORY_COLOR[category] ?? CATEGORY_COLOR['PROJECT_UPDATE']!;
}

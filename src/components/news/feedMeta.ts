import { feedCategoryVisual } from '../ui/categoryVisuals';

// Date locales for the feed card / detail page.
export const DATE_LOCALES: Record<string, string> = {
  en: 'en-GB',
  el: 'el-GR',
  de: 'de-DE',
};

// Category badge chip — delegates to the single visual source (ui/categoryVisuals)
// so the badge, accent and no-image gradient never drift apart.
export function categoryColor(category: string): string {
  return feedCategoryVisual(category).badge;
}

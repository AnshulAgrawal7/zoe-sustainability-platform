// Locale-aware formatting helpers. Pass the active i18next language (e.g. 'en',
// 'el', 'de' — or a regional tag like 'en-GB'); Intl resolves the BCP-47 tag and
// applies the right thousands/decimal separators (EN "2,682.699" vs DE/EL
// "2.682,699") and date conventions. Centralised so numbers/dates are never
// hand-formatted per locale in the UI.

export function formatNumber(
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatDate(
  date: Date | string,
  locale: string,
  options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(d);
}

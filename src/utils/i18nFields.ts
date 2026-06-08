// Pick the right language variant of a trilingual (En/El/De) API field.
// `lang` is the i18next language code (e.g. "en", "el", "de", "en-US").
export function pickLang(
  lang: string,
  en: string,
  el: string,
  de: string
): string {
  if (lang.startsWith('el')) return el;
  if (lang.startsWith('de')) return de;
  return en;
}

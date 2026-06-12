import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en/translation.json';
import el from '../locales/el/translation.json';
import de from '../locales/de/translation.json';

const savedLanguage = localStorage.getItem('zoe-language') || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    el: { translation: el },
    de: { translation: de },
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
    // Locale-aware number style for every interpolated number (counts, points,
    // …) so separators/decimals follow the active language: EN "1,234.5" vs
    // DE/EL "1.234,5". Non-numbers pass through unchanged.
    format: (value, _format, lng) =>
      typeof value === 'number' && Number.isFinite(value)
        ? new Intl.NumberFormat(lng).format(value)
        : (value as string),
  },
});

export default i18n;

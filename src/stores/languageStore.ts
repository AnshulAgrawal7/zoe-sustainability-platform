import { create } from 'zustand';
import i18n from '../utils/i18n';

export type Language = 'en' | 'el' | 'de';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: (localStorage.getItem('zoe-language') as Language) || 'en',
  setLanguage: (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('zoe-language', lang);
    set({ language: lang });
  },
}));

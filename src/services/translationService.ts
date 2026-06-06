import { api } from './api';
import type { ApiResponse } from '../types';

export type ContentLang = 'EN' | 'EL' | 'DE';

// Maps an app content language to the form field suffix (titleEn / titleEl / titleDe).
export const LANG_SUFFIX: Record<ContentLang, 'En' | 'El' | 'De'> = {
  EN: 'En',
  EL: 'El',
  DE: 'De',
};

export interface TranslateResult {
  sourceLang: ContentLang;
  // targetLang -> { fieldName -> translated text }
  translations: Record<string, Record<string, string>>;
}

/**
 * Ask the backend to translate the given fields from `sourceLang` into the
 * other languages (DeepL). Admin-only endpoint; requires a configured key.
 */
export async function translateFields(
  fields: Record<string, string>,
  sourceLang: ContentLang
): Promise<TranslateResult> {
  const res = await api.post<ApiResponse<TranslateResult>>('/admin/translate', {
    fields,
    sourceLang,
  });
  return res.data;
}

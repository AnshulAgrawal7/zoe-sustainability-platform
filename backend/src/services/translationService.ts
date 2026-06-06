// Translation service — DeepL provider, pluggable and key-driven.
//
// Design decisions:
//  - The API key lives ONLY in the environment (DEEPL_API_KEY), never in code.
//  - DeepL Free vs Pro is auto-detected from the key: Free keys end with ":fx"
//    and use the api-free.deepl.com endpoint; otherwise the Pro endpoint is used.
//    => Upgrading from Free to Pro later is just swapping the key in .env.
//  - If no key is configured the service throws TranslationNotConfiguredError,
//    so the rest of the app (and the test/CI run) keeps working without a key.

export type AppLang = 'EN' | 'EL' | 'DE';

export const APP_LANGS: readonly AppLang[] = ['EN', 'EL', 'DE'] as const;

export class TranslationNotConfiguredError extends Error {
  constructor() {
    super('translation_not_configured');
    this.name = 'TranslationNotConfiguredError';
  }
}

export class TranslationFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TranslationFailedError';
  }
}

// DeepL expects a regional variant for English targets; EL/DE are plain.
const DEEPL_TARGET: Record<AppLang, string> = { EN: 'EN-US', EL: 'EL', DE: 'DE' };
const DEEPL_SOURCE: Record<AppLang, string> = { EN: 'EN', EL: 'EL', DE: 'DE' };

// Minimal fetch contract so the service is trivially mockable and does not
// depend on a particular lib/dom typing setup.
interface FetchResponseLike {
  ok: boolean;
  status: number;
  text(): Promise<string>;
  json(): Promise<unknown>;
}
export type FetchLike = (
  url: string,
  init: { method: string; headers: Record<string, string>; body: string },
) => Promise<FetchResponseLike>;

const defaultFetch: FetchLike = (url, init) =>
  (globalThis.fetch as unknown as FetchLike)(url, init);

export function isTranslationConfigured(): boolean {
  return Boolean(process.env['DEEPL_API_KEY']);
}

export function deeplEndpoint(key: string): string {
  return key.trim().endsWith(':fx')
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate';
}

/** Translate an array of strings from one source language into one target language. */
export async function translateBatch(
  texts: string[],
  sourceLang: AppLang,
  targetLang: AppLang,
  fetchImpl: FetchLike = defaultFetch,
): Promise<string[]> {
  const key = process.env['DEEPL_API_KEY'];
  if (!key) throw new TranslationNotConfiguredError();
  if (texts.length === 0) return [];
  if (sourceLang === targetLang) return [...texts];

  let res: FetchResponseLike;
  try {
    res = await fetchImpl(deeplEndpoint(key), {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: texts,
        source_lang: DEEPL_SOURCE[sourceLang],
        target_lang: DEEPL_TARGET[targetLang],
      }),
    });
  } catch (err) {
    throw new TranslationFailedError(
      err instanceof Error ? err.message : 'network error',
    );
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new TranslationFailedError(`DeepL ${res.status}: ${detail.slice(0, 200)}`);
  }

  const data = (await res.json()) as { translations?: { text: string }[] };
  if (!data.translations || data.translations.length !== texts.length) {
    throw new TranslationFailedError('unexpected DeepL response shape');
  }
  return data.translations.map((entry) => entry.text);
}

/**
 * Translate a set of named fields (e.g. { title, description }) from a source
 * language into several target languages, preserving field names.
 */
export async function translateFields(
  fields: Record<string, string>,
  sourceLang: AppLang,
  targetLangs: AppLang[],
  fetchImpl: FetchLike = defaultFetch,
): Promise<Record<string, Record<string, string>>> {
  const names = Object.keys(fields);
  const values = names.map((name) => fields[name] ?? '');
  const result: Record<string, Record<string, string>> = {};

  for (const target of targetLangs) {
    const translated = await translateBatch(values, sourceLang, target, fetchImpl);
    const perField: Record<string, string> = {};
    names.forEach((name, i) => {
      perField[name] = translated[i] ?? '';
    });
    result[target] = perField;
  }
  return result;
}

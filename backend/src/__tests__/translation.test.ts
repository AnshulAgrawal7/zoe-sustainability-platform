import { describe, it, expect, afterEach } from 'vitest';
import {
  translateBatch,
  translateFields,
  isTranslationConfigured,
  deeplEndpoint,
  TranslationNotConfiguredError,
  type FetchLike,
} from '../services/translationService';

const ORIGINAL_KEY = process.env['DEEPL_API_KEY'];

afterEach(() => {
  if (ORIGINAL_KEY === undefined) delete process.env['DEEPL_API_KEY'];
  else process.env['DEEPL_API_KEY'] = ORIGINAL_KEY;
});

function makeFetch(
  capture: { url?: string; body?: string },
  texts: string[],
): FetchLike {
  return async (url, init) => {
    capture.url = url;
    capture.body = init.body;
    return {
      ok: true,
      status: 200,
      text: async () => '',
      json: async () => ({ translations: texts.map((t) => ({ text: t })) }),
    };
  };
}

describe('translationService', () => {
  it('throws when no key is configured', async () => {
    delete process.env['DEEPL_API_KEY'];
    expect(isTranslationConfigured()).toBe(false);
    await expect(translateBatch(['hi'], 'EN', 'DE')).rejects.toBeInstanceOf(
      TranslationNotConfiguredError,
    );
  });

  it('selects the free endpoint for :fx keys and pro otherwise', () => {
    expect(deeplEndpoint('abc:fx')).toContain('api-free.deepl.com');
    expect(deeplEndpoint('abc')).toBe('https://api.deepl.com/v2/translate');
  });

  it('uses the free endpoint and parses the DeepL response', async () => {
    process.env['DEEPL_API_KEY'] = 'test-key:fx';
    const capture: { url?: string; body?: string } = {};
    const fetchMock = makeFetch(capture, ['Hallo', 'Welt']);
    const out = await translateBatch(['Hello', 'World'], 'EN', 'DE', fetchMock);
    expect(out).toEqual(['Hallo', 'Welt']);
    expect(capture.url).toContain('api-free.deepl.com');
    expect(capture.body).toContain('"target_lang":"DE"');
  });

  it('returns a copy when source equals target (no API call)', async () => {
    process.env['DEEPL_API_KEY'] = 'k:fx';
    const out = await translateBatch(['x'], 'DE', 'DE');
    expect(out).toEqual(['x']);
  });

  it('translateFields maps named fields per target language', async () => {
    process.env['DEEPL_API_KEY'] = 'k:fx';
    const capture: { url?: string; body?: string } = {};
    const fetchMock = makeFetch(capture, ['Titel', 'Beschreibung']);
    const res = await translateFields(
      { title: 'Title', description: 'Description' },
      'EN',
      ['DE'],
      fetchMock,
    );
    expect(res['DE']).toEqual({ title: 'Titel', description: 'Beschreibung' });
  });
});

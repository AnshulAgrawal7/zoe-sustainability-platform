import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import { ok, badRequest, serviceUnavailable, serverError } from '../utils/response';
import {
  translateFields,
  isTranslationConfigured,
  APP_LANGS,
  TranslationNotConfiguredError,
  TranslationFailedError,
  type AppLang,
} from '../services/translationService';

const MAX_FIELD_LEN = 5000;
const MAX_FIELDS = 10;

interface TranslateBody {
  fields?: Record<string, unknown>;
  sourceLang?: unknown;
  targetLangs?: unknown;
}

function isAppLang(value: unknown): value is AppLang {
  return typeof value === 'string' && (APP_LANGS as readonly string[]).includes(value);
}

/**
 * POST /api/admin/translate  (adminOnly)
 * Body: { fields: { title, description, ... }, sourceLang: 'EN'|'EL'|'DE', targetLangs?: [...] }
 * Returns the fields translated into the requested target languages.
 */
export async function translateProjectFields(req: AuthRequest, res: Response) {
  const body = req.body as TranslateBody;
  const { fields, sourceLang } = body;

  if (!isAppLang(sourceLang)) {
    badRequest(res, 'sourceLang must be one of EN, EL, DE');
    return;
  }
  if (!fields || typeof fields !== 'object' || Array.isArray(fields)) {
    badRequest(res, 'fields object is required');
    return;
  }

  const names = Object.keys(fields);
  if (names.length === 0 || names.length > MAX_FIELDS) {
    badRequest(res, `fields must contain between 1 and ${MAX_FIELDS} entries`);
    return;
  }

  const cleaned: Record<string, string> = {};
  for (const name of names) {
    const value = fields[name];
    if (typeof value !== 'string') {
      badRequest(res, `field "${name}" must be a string`);
      return;
    }
    if (value.length > MAX_FIELD_LEN) {
      badRequest(res, `field "${name}" exceeds ${MAX_FIELD_LEN} characters`);
      return;
    }
    cleaned[name] = value;
  }

  // Default: translate into the two languages other than the source.
  const requested = Array.isArray(body.targetLangs) ? body.targetLangs : undefined;
  const targetLangs = (requested ?? APP_LANGS).filter(
    (lang): lang is AppLang => isAppLang(lang) && lang !== sourceLang,
  );
  if (targetLangs.length === 0) {
    badRequest(res, 'no valid target languages');
    return;
  }

  if (!isTranslationConfigured()) {
    serviceUnavailable(res, 'translation_not_configured');
    return;
  }

  try {
    const translations = await translateFields(cleaned, sourceLang, targetLangs);
    ok(res, { sourceLang, translations });
  } catch (err) {
    if (err instanceof TranslationNotConfiguredError) {
      serviceUnavailable(res, 'translation_not_configured');
      return;
    }
    if (err instanceof TranslationFailedError) {
      serverError(res, 'translation_failed');
      return;
    }
    serverError(res);
  }
}

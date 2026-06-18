import { describe, it, expect } from 'vitest';
import en from '../locales/en/translation.json';
import el from '../locales/el/translation.json';
import de from '../locales/de/translation.json';

// Guards i18n completeness (Future_Work §6.3): every key must exist in all three
// locales (EN is the fallback/reference). The standalone scripts/check-i18n.mjs
// runs the same parity check in CI plus an advisory hardcoded-string scan.
type Json = Record<string, unknown>;

function flatten(
  obj: Json,
  prefix = '',
  out: Set<string> = new Set()
): Set<string> {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v))
      flatten(v as Json, key, out);
    else out.add(key);
  }
  return out;
}

const keys = {
  en: flatten(en as Json),
  el: flatten(el as Json),
  de: flatten(de as Json),
};

describe('i18n key parity', () => {
  it.each(['el', 'de'] as const)('%s has no missing keys vs en', (locale) => {
    const missing = [...keys.en].filter((k) => !keys[locale].has(k));
    expect(missing, `missing in ${locale}: ${missing.join(', ')}`).toEqual([]);
  });

  it.each(['el', 'de'] as const)(
    '%s has no orphan keys not in en',
    (locale) => {
      const orphan = [...keys[locale]].filter((k) => !keys.en.has(k));
      expect(orphan, `orphan in ${locale}: ${orphan.join(', ')}`).toEqual([]);
    }
  );
});

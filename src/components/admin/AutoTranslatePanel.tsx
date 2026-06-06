import { useState } from 'react';
import { Languages, Loader2, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  translateFields,
  LANG_SUFFIX,
  type ContentLang,
} from '../../services/translationService';

const LANGS: { code: ContentLang; label: string }[] = [
  { code: 'EN', label: 'English' },
  { code: 'EL', label: 'Ελληνικά' },
  { code: 'DE', label: 'Deutsch' },
];

interface AutoTranslatePanelProps {
  /** The admin form state (contains titleEn/El/De, descriptionEn/El/De, ...). */
  values: Record<string, unknown>;
  /** The form's setter: onChange('titleDe', '…'). */
  onChange: (field: string, value: string) => void;
}

/**
 * Admin helper: type title + description in one language, then fill the other
 * two via DeepL (results stay editable). Requires DEEPL_API_KEY on the backend.
 */
export default function AutoTranslatePanel({
  values,
  onChange,
}: AutoTranslatePanelProps) {
  const { t } = useTranslation();
  const [sourceLang, setSourceLang] = useState<ContentLang>('EN');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleTranslate() {
    const sfx = LANG_SUFFIX[sourceLang];
    const title = String(values[`title${sfx}`] ?? '').trim();
    const description = String(values[`description${sfx}`] ?? '').trim();
    if (!title || !description) {
      setError(t('admin.autoTranslate.needSource'));
      setStatus('idle');
      return;
    }
    setError(null);
    setStatus('loading');
    try {
      const result = await translateFields({ title, description }, sourceLang);
      for (const [lang, fields] of Object.entries(result.translations)) {
        const targetSfx = LANG_SUFFIX[lang as ContentLang];
        if (!targetSfx) continue;
        if (typeof fields.title === 'string') {
          onChange(`title${targetSfx}`, fields.title);
        }
        if (typeof fields.description === 'string') {
          onChange(`description${targetSfx}`, fields.description);
        }
      }
      setStatus('done');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      setError(
        msg === 'translation_not_configured'
          ? t('admin.autoTranslate.notConfigured')
          : t('admin.autoTranslate.failed')
      );
      setStatus('idle');
    }
  }

  return (
    <section className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label
            htmlFor="auto-translate-source"
            className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300"
          >
            {t('admin.autoTranslate.inputLang')}
          </label>
          <select
            id="auto-translate-source"
            value={sourceLang}
            onChange={(e) => {
              setSourceLang(e.target.value as ContentLang);
              setStatus('idle');
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            {LANGS.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleTranslate}
          disabled={status === 'loading'}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {status === 'loading' ? (
            <Loader2
              size={16}
              aria-hidden="true"
              className="motion-safe:animate-spin"
            />
          ) : (
            <Languages size={16} aria-hidden="true" />
          )}
          {status === 'loading'
            ? t('admin.autoTranslate.running')
            : t('admin.autoTranslate.button')}
        </button>
        {status === 'done' && !error && (
          <span
            role="status"
            className="inline-flex items-center gap-1 text-sm text-green-700 dark:text-green-400"
          >
            <Check size={16} aria-hidden="true" />
            {t('admin.autoTranslate.done')}
          </span>
        )}
      </div>
      <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
        {t('admin.autoTranslate.hint')}
      </p>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </section>
  );
}

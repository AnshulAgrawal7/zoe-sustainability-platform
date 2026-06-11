import { useTranslation } from 'react-i18next';

// Block 5 — admin inputs for the project value chain (Input -> Activity -> Output),
// trilingual and optional. Shared by the New and Edit project forms. `form` is
// the inline form-state object (typed loosely like AutoTranslatePanel's values).

interface Props {
  form: Record<string, unknown>;
  set: (field: string, value: string) => void;
}

const GROUPS = [
  { base: 'inputResources', labelKey: 'admin.valueChainInput' },
  { base: 'keyActivities', labelKey: 'admin.valueChainActivity' },
  { base: 'outputResults', labelKey: 'admin.valueChainOutput' },
] as const;

const LANGS = ['En', 'El', 'De'] as const;
const LANG_LABEL: Record<(typeof LANGS)[number], string> = {
  En: 'English',
  El: 'Ελληνικά',
  De: 'Deutsch',
};

const inputClass =
  'w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white';

export default function ValueChainFields({ form, set }: Props) {
  const { t } = useTranslation();

  return (
    <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
          {t('admin.valueChainHeading')}
        </h2>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          {t('admin.valueChainHint')}
        </p>
      </div>

      {GROUPS.map((group) => (
        <fieldset key={group.base} className="space-y-2">
          <legend className="text-xs font-semibold text-gray-600 dark:text-gray-300">
            {t(group.labelKey)}
          </legend>
          {LANGS.map((l) => {
            const field = `${group.base}${l}`;
            return (
              <div key={l}>
                <label
                  htmlFor={`vc-${group.base}-${l.toLowerCase()}`}
                  className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  {LANG_LABEL[l]}
                </label>
                <textarea
                  id={`vc-${group.base}-${l.toLowerCase()}`}
                  rows={2}
                  value={(form[field] as string | undefined) ?? ''}
                  onChange={(e) => set(field, e.target.value)}
                  className={inputClass}
                />
              </div>
            );
          })}
        </fieldset>
      ))}
    </section>
  );
}

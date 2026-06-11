import { useTranslation } from 'react-i18next';
import type { ApiProject } from '../../types';
import { LEARN_CATEGORIES, ALL_SDGS, type LearnFormState } from './learnForm';

interface Props {
  form: LearnFormState;
  set: (field: string, value: string) => void;
  projects: ApiProject[];
  selectedSdgs: number[];
  toggleSdg: (n: number) => void;
}

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white';
const labelClass =
  'mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400';

export default function LearnFormFields({
  form,
  set,
  projects,
  selectedSdgs,
  toggleSdg,
}: Props) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2);

  function projectLabel(p: ApiProject): string {
    if (lang === 'el') return p.titleEl;
    if (lang === 'de') return p.titleDe;
    return p.titleEn;
  }

  return (
    <>
      {/* Titles */}
      <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
          {t('admin.formTitle')}
        </h2>
        {(['En', 'El', 'De'] as const).map((l) => (
          <div key={l}>
            <label
              htmlFor={`learn-title-${l.toLowerCase()}`}
              className={labelClass}
            >
              {l === 'En' ? 'English' : l === 'El' ? 'Ελληνικά' : 'Deutsch'} *
            </label>
            <input
              id={`learn-title-${l.toLowerCase()}`}
              type="text"
              required
              aria-required="true"
              value={form[`title${l}` as keyof LearnFormState] as string}
              onChange={(e) => set(`title${l}`, e.target.value)}
              className={inputClass}
            />
          </div>
        ))}
      </section>

      {/* Body */}
      <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
          {t('adminLearn.formBody')}
        </h2>
        {(['En', 'El', 'De'] as const).map((l) => (
          <div key={l}>
            <label
              htmlFor={`learn-body-${l.toLowerCase()}`}
              className={labelClass}
            >
              {l === 'En' ? 'English' : l === 'El' ? 'Ελληνικά' : 'Deutsch'} *
            </label>
            <textarea
              id={`learn-body-${l.toLowerCase()}`}
              required
              aria-required="true"
              rows={6}
              value={form[`body${l}` as keyof LearnFormState] as string}
              onChange={(e) => set(`body${l}`, e.target.value)}
              className={`${inputClass} resize-y`}
            />
          </div>
        ))}
      </section>

      {/* Meta */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
          {t('admin.formDetails')}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="learn-category" className={labelClass}>
              {t('admin.formCategory')} *
            </label>
            <select
              id="learn-category"
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className={inputClass}
            >
              {LEARN_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {t(`projects.category.${c}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="learn-project" className={labelClass}>
              {t('adminLearn.formProject')}
            </label>
            <select
              id="learn-project"
              value={form.projectId}
              onChange={(e) => set('projectId', e.target.value)}
              className={inputClass}
            >
              <option value="">{t('adminLearn.noProject')}</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {projectLabel(p)}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="learn-image" className={labelClass}>
              {t('admin.formImageUrl')}
            </label>
            <input
              id="learn-image"
              type="url"
              inputMode="url"
              value={form.imageUrl}
              onChange={(e) => set('imageUrl', e.target.value)}
              placeholder="https://…/image.jpg"
              className={inputClass}
            />
            {form.imageUrl && (
              <div className="mt-2">
                <img
                  src={form.imageUrl}
                  alt=""
                  className="h-28 w-full rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => set('imageUrl', '')}
                  className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-red-400"
                >
                  {t('admin.formImageRemove')}
                </button>
              </div>
            )}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="learn-source" className={labelClass}>
              {t('adminLearn.formSource')}
            </label>
            <input
              id="learn-source"
              type="text"
              value={form.sourceNote}
              onChange={(e) => set('sourceNote', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* SDGs */}
        <div className="mt-4">
          <span className={labelClass}>{t('adminLearn.formSdgs')}</span>
          <div className="flex flex-wrap gap-2">
            {ALL_SDGS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => toggleSdg(n)}
                aria-pressed={selectedSdgs.includes(n)}
                aria-label={`SDG ${n}`}
                className={`h-9 w-9 rounded-lg text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  selectedSdgs.includes(n)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-green-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-green-900/20'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

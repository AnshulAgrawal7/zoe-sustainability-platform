import { useTranslation } from 'react-i18next';
import type { ApiProject } from '../../types';
import { EVENT_CATEGORIES, type EventFormState } from './eventForm';

interface Props {
  form: EventFormState;
  set: (field: string, value: string | number) => void;
  projects: ApiProject[];
}

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white';

export default function EventFormFields({ form, set, projects }: Props) {
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
              htmlFor={`event-title-${l.toLowerCase()}`}
              className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {l === 'En' ? 'English' : l === 'El' ? 'Ελληνικά' : 'Deutsch'} *
            </label>
            <input
              id={`event-title-${l.toLowerCase()}`}
              type="text"
              required
              aria-required="true"
              value={form[`title${l}` as keyof EventFormState] as string}
              onChange={(e) => set(`title${l}`, e.target.value)}
              className={inputClass}
            />
          </div>
        ))}
      </section>

      {/* Descriptions */}
      <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
          {t('admin.formDescription')}
        </h2>
        {(['En', 'El', 'De'] as const).map((l) => (
          <div key={l}>
            <label
              htmlFor={`event-desc-${l.toLowerCase()}`}
              className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {l === 'En' ? 'English' : l === 'El' ? 'Ελληνικά' : 'Deutsch'} *
            </label>
            <textarea
              id={`event-desc-${l.toLowerCase()}`}
              required
              aria-required="true"
              rows={3}
              value={form[`description${l}` as keyof EventFormState] as string}
              onChange={(e) => set(`description${l}`, e.target.value)}
              className={`${inputClass} resize-none`}
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
            <label
              htmlFor="event-date"
              className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {t('adminEvents.formDate')} *
            </label>
            <input
              id="event-date"
              type="datetime-local"
              required
              aria-required="true"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="event-category"
              className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {t('admin.formCategory')} *
            </label>
            <select
              id="event-category"
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className={inputClass}
            >
              {EVENT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {t(`projects.category.${c}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="event-reward-points"
              className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {t('admin.formRewardPoints')}
            </label>
            <input
              id="event-reward-points"
              type="number"
              min={0}
              value={form.rewardPoints}
              onChange={(e) => set('rewardPoints', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="event-capacity"
              className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {t('adminEvents.formCapacity')}
            </label>
            <input
              id="event-capacity"
              type="number"
              min={1}
              value={form.capacity}
              onChange={(e) => set('capacity', e.target.value)}
              placeholder={t('adminEvents.formUnlimited')}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="event-location"
              className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {t('admin.formLocation')}
            </label>
            <input
              id="event-location"
              type="text"
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder="e.g. Kassiopi Beach, North Corfu"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="event-image-url"
              className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {t('admin.formImageUrl')}
            </label>
            <input
              id="event-image-url"
              type="url"
              inputMode="url"
              value={form.imageUrl}
              onChange={(e) => set('imageUrl', e.target.value)}
              placeholder="https://…/image.jpg"
              className={inputClass}
            />
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {t('admin.formImageUrlHint')}
            </p>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="event-project"
              className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {t('adminEvents.formProject')}
            </label>
            <select
              id="event-project"
              value={form.projectId}
              onChange={(e) => set('projectId', e.target.value)}
              className={inputClass}
            >
              <option value="">{t('adminEvents.formNoProject')}</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {projectLabel(p)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>
    </>
  );
}

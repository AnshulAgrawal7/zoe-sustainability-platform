import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react';
import { createProject } from '../../services/projectService';
import AutoTranslatePanel from '../../components/admin/AutoTranslatePanel';
import ValueChainFields from './ValueChainFields';

const TRANSLATABLE = [
  'title',
  'description',
  'inputResources',
  'keyActivities',
  'outputResults',
];

const CATEGORIES = [
  'ENVIRONMENT',
  'MOBILITY',
  'COMMUNITY',
  'EDUCATION',
  'CULTURE',
] as const;
const STATUSES = ['DRAFT', 'OPEN', 'CLOSED', 'COMPLETED'] as const;
const ALL_SDGS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

export default function NewProjectPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titleEn: '',
    titleEl: '',
    titleDe: '',
    descriptionEn: '',
    descriptionEl: '',
    descriptionDe: '',
    inputResourcesEn: '',
    inputResourcesEl: '',
    inputResourcesDe: '',
    keyActivitiesEn: '',
    keyActivitiesEl: '',
    keyActivitiesDe: '',
    outputResultsEn: '',
    outputResultsEl: '',
    outputResultsDe: '',
    category: 'ENVIRONMENT' as (typeof CATEGORIES)[number],
    status: 'OPEN' as (typeof STATUSES)[number],
    rewardPoints: 50,
    location: '',
    maxParticipants: '',
    imageUrl: '',
  });
  const [selectedSdgs, setSelectedSdgs] = useState<number[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleSdg(n: number) {
    setSelectedSdgs((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titleEn || !form.titleEl || !form.titleDe) {
      setError(t('admin.validationTitlesRequired'));
      return;
    }
    if (!form.descriptionEn || !form.descriptionEl || !form.descriptionDe) {
      setError(t('admin.validationDescriptionsRequired'));
      return;
    }
    if (selectedSdgs.length === 0) {
      setError(t('admin.validationSdgRequired'));
      return;
    }
    setError('');
    setLoading(true);
    try {
      await createProject({
        ...form,
        rewardPoints: Number(form.rewardPoints),
        maxParticipants: form.maxParticipants
          ? Number(form.maxParticipants)
          : undefined,
        location: form.location || undefined,
        imageUrl: form.imageUrl || undefined,
        sdgIds: selectedSdgs,
      } as Parameters<typeof createProject>[0]);
      navigate('/admin/projects');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        to="/admin/projects"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
      >
        <ChevronLeft size={16} aria-hidden="true" /> {t('common.back')}
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {t('admin.createProject')}
      </h1>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <AutoTranslatePanel
          values={form}
          onChange={set}
          fields={TRANSLATABLE}
        />

        {/* Titles */}
        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
            {t('admin.formTitle')}
          </h2>
          {(['En', 'El', 'De'] as const).map((lang) => (
            <div key={lang}>
              <label
                htmlFor={`new-title-${lang.toLowerCase()}`}
                className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {lang === 'En'
                  ? 'English'
                  : lang === 'El'
                    ? 'Ελληνικά'
                    : 'Deutsch'}{' '}
                *
              </label>
              <input
                id={`new-title-${lang.toLowerCase()}`}
                type="text"
                required
                aria-required="true"
                value={form[`title${lang}` as keyof typeof form] as string}
                onChange={(e) => set(`title${lang}`, e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          ))}
        </section>

        {/* Descriptions */}
        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
            {t('admin.formDescription')}
          </h2>
          {(['En', 'El', 'De'] as const).map((lang) => (
            <div key={lang}>
              <label
                htmlFor={`new-desc-${lang.toLowerCase()}`}
                className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {lang === 'En'
                  ? 'English'
                  : lang === 'El'
                    ? 'Ελληνικά'
                    : 'Deutsch'}{' '}
                *
              </label>
              <textarea
                id={`new-desc-${lang.toLowerCase()}`}
                required
                aria-required="true"
                rows={3}
                value={
                  form[`description${lang}` as keyof typeof form] as string
                }
                onChange={(e) => set(`description${lang}`, e.target.value)}
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          ))}
        </section>

        {/* Value chain (Input -> Activity -> Output) */}
        <ValueChainFields form={form} set={set} />

        {/* Meta */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
            {t('admin.formDetails')}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="new-category"
                className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t('admin.formCategory')} *
              </label>
              <select
                id="new-category"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {t(`projects.category.${c}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="new-status"
                className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t('admin.formStatus')}
              </label>
              <select
                id="new-status"
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {t(`projects.status.${s}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="new-reward-points"
                className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t('admin.formRewardPoints')}
              </label>
              <input
                id="new-reward-points"
                type="number"
                min={0}
                value={form.rewardPoints}
                onChange={(e) => set('rewardPoints', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="new-max-participants"
                className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t('admin.formMaxParticipants')}
              </label>
              <input
                id="new-max-participants"
                type="number"
                min={0}
                value={form.maxParticipants}
                onChange={(e) => set('maxParticipants', e.target.value)}
                placeholder={t('admin.formUnlimited')}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="new-location"
                className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t('admin.formLocation')}
              </label>
              <input
                id="new-location"
                type="text"
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                placeholder={t('admin.locationPlaceholder')}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="new-image-url"
                className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t('admin.formImageUrl')}
              </label>
              <input
                id="new-image-url"
                type="url"
                inputMode="url"
                value={form.imageUrl}
                onChange={(e) => set('imageUrl', e.target.value)}
                placeholder="https://…/image.jpg"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {t('admin.formImageUrlHint')}
              </p>
            </div>
          </div>
        </section>

        {/* SDGs */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
            {t('admin.formSdgs')} *
          </h2>
          <div className="flex flex-wrap gap-2">
            {ALL_SDGS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => toggleSdg(n)}
                className={`h-10 w-10 rounded-lg text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  selectedSdgs.includes(n)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-green-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-green-900/20'
                }`}
                aria-pressed={selectedSdgs.includes(n)}
                aria-label={`SDG ${n}`}
              >
                {n}
              </button>
            ))}
          </div>
          {selectedSdgs.length > 0 && (
            <p className="mt-2 text-xs text-green-600 dark:text-green-400">
              {t('admin.formSdgSelected')}{' '}
              {selectedSdgs.sort((a, b) => a - b).join(', ')}
            </p>
          )}
        </section>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? t('common.loading') : t('admin.saveChanges')}
          </button>
          <Link
            to="/admin/projects"
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {t('common.cancel')}
          </Link>
        </div>
      </form>
    </div>
  );
}

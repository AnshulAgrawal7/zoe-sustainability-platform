import { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react';
import { getProject, updateProject } from '../../services/projectService';
import AutoTranslatePanel from '../../components/admin/AutoTranslatePanel';
import ValueChainFields from './ValueChainFields';
import type { ApiProject } from '../../types';

const TRANSLATABLE = [
  'title',
  'description',
  'inputResources',
  'keyActivities',
  'outputResults',
];

const CATEGORIES = [
  'MOBILITY',
  'WASTE_CIRCULAR',
  'MARINE_PROTECTION',
  'NATURAL_MONUMENTS',
  'ENERGY',
  'EDUCATION_PARTICIPATION',
] as const;
const STATUSES = ['DRAFT', 'OPEN', 'CLOSED', 'COMPLETED'] as const;
const ALL_SDGS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

export default function EditProjectPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ApiProject | null>(null);
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
    category: 'MOBILITY' as (typeof CATEGORIES)[number],
    status: 'OPEN' as (typeof STATUSES)[number],
    rewardPoints: 50,
    location: '',
    imageUrl: '',
  });
  const [selectedSdgs, setSelectedSdgs] = useState<number[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!id) return;
    getProject(id)
      .then((p) => {
        setProject(p);
        setForm({
          titleEn: p.titleEn,
          titleEl: p.titleEl,
          titleDe: p.titleDe,
          descriptionEn: p.descriptionEn,
          descriptionEl: p.descriptionEl,
          descriptionDe: p.descriptionDe,
          inputResourcesEn: p.inputResourcesEn ?? '',
          inputResourcesEl: p.inputResourcesEl ?? '',
          inputResourcesDe: p.inputResourcesDe ?? '',
          keyActivitiesEn: p.keyActivitiesEn ?? '',
          keyActivitiesEl: p.keyActivitiesEl ?? '',
          keyActivitiesDe: p.keyActivitiesDe ?? '',
          outputResultsEn: p.outputResultsEn ?? '',
          outputResultsEl: p.outputResultsEl ?? '',
          outputResultsDe: p.outputResultsDe ?? '',
          category: p.category as (typeof CATEGORIES)[number],
          status: p.status as (typeof STATUSES)[number],
          rewardPoints: p.rewardPoints,
          location: p.location ?? '',
          imageUrl: p.imageUrl ?? '',
        });
        try {
          setSelectedSdgs(JSON.parse(p.sdgIds) as number[]);
        } catch {
          setSelectedSdgs([]);
        }
      })
      .catch(() => setError(t('common.error')))
      .finally(() => setFetching(false));
  }, [id, t]);

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
    if (!id) return;
    setError('');
    setLoading(true);
    try {
      await updateProject(id, {
        ...form,
        rewardPoints: Number(form.rewardPoints),
        sdgIds: selectedSdgs,
      });
      navigate('/admin/projects');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  }

  if (fetching)
    return (
      <div className="p-8 text-gray-500 dark:text-gray-400">
        {t('common.loading')}
      </div>
    );
  if (!project)
    return <div className="p-8 text-red-600">{t('common.error')}</div>;

  return (
    <Container className="py-8">
      <Link
        to="/admin/projects"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 dark:text-gray-400"
      >
        <ChevronLeft size={16} aria-hidden="true" /> {t('common.back')}
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {t('admin.editProject')}
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
                htmlFor={`edit-title-${lang.toLowerCase()}`}
                className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {lang === 'En'
                  ? 'English'
                  : lang === 'El'
                    ? 'Ελληνικά'
                    : 'Deutsch'}
              </label>
              <input
                id={`edit-title-${lang.toLowerCase()}`}
                type="text"
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
                htmlFor={`edit-desc-${lang.toLowerCase()}`}
                className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {lang === 'En'
                  ? 'English'
                  : lang === 'El'
                    ? 'Ελληνικά'
                    : 'Deutsch'}
              </label>
              <textarea
                id={`edit-desc-${lang.toLowerCase()}`}
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
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                {t('admin.formCategory')}
              </label>
              <select
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
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                {t('admin.formStatus')}
              </label>
              <select
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
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                {t('admin.formLocation')}
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="edit-image-url"
                className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t('admin.formImageUrl')}
              </label>
              <input
                id="edit-image-url"
                type="url"
                inputMode="url"
                value={form.imageUrl}
                onChange={(e) => set('imageUrl', e.target.value)}
                placeholder="https://…/image.jpg"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {t('admin.formImageUrlHint')}
              </p>
            </div>
          </div>
        </section>

        {/* SDGs */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
            {t('admin.formSdgs')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {ALL_SDGS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => toggleSdg(n)}
                className={`h-10 w-10 rounded-lg text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${selectedSdgs.includes(n) ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
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
    </Container>
  );
}

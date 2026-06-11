import { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react';
import { createLearningResource } from '../../services/learnService';
import { getProjects } from '../../services/projectService';
import AutoTranslatePanel from '../../components/admin/AutoTranslatePanel';
import LearnFormFields from './LearnFormFields';
import { type LearnFormState, emptyLearnForm } from './learnForm';
import type { ApiProject } from '../../types';

const TRANSLATABLE = ['title', 'body'];

export default function NewLearnPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState<LearnFormState>(emptyLearnForm);
  const [selectedSdgs, setSelectedSdgs] = useState<number[]>([]);
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProjects({ status: 'ALL', limit: 50 })
      .then((data) => setProjects(data.projects))
      .catch(() => null);
  }, []);

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
    setError('');
    setLoading(true);
    try {
      await createLearningResource({
        titleEn: form.titleEn,
        titleEl: form.titleEl,
        titleDe: form.titleDe,
        bodyEn: form.bodyEn,
        bodyEl: form.bodyEl,
        bodyDe: form.bodyDe,
        category: form.category,
        sdgIds: selectedSdgs,
        imageUrl: form.imageUrl || undefined,
        sourceNote: form.sourceNote || undefined,
        projectId: form.projectId || null,
      });
      navigate('/admin/learn');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxW="3xl" className="py-8">
      <Link
        to="/admin/learn"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
      >
        <ChevronLeft size={16} aria-hidden="true" /> {t('common.back')}
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {t('adminLearn.create')}
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
        <LearnFormFields
          form={form}
          set={set}
          projects={projects}
          selectedSdgs={selectedSdgs}
          toggleSdg={toggleSdg}
        />
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? t('common.loading') : t('admin.saveChanges')}
          </button>
          <Link
            to="/admin/learn"
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {t('common.cancel')}
          </Link>
        </div>
      </form>
    </Container>
  );
}

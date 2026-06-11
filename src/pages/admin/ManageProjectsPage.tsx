import { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil } from 'lucide-react';
import { getProjects } from '../../services/projectService';
import type { ApiProject } from '../../types';

export default function ManageProjectsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2);
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects({ status: undefined as unknown as string, limit: 50 })
      .then((data) => setProjects(data.projects))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  function getTitle(p: ApiProject) {
    if (lang === 'el') return p.titleEl;
    if (lang === 'de') return p.titleDe;
    return p.titleEn;
  }

  return (
    <Container className="py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('admin.projects')}
        </h1>
        <Link
          to="/admin/projects/new"
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          <Plus size={16} aria-hidden="true" /> {t('admin.createProject')}
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {getTitle(p)}
                </p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {t(`projects.status.${p.status}`)} ·{' '}
                  {t(`projects.category.${p.category}`)} · {p.rewardPoints} pts
                </p>
              </div>
              <Link
                to={`/admin/projects/${p.id}/edit`}
                aria-label={`${t('admin.editProject')}: ${getTitle(p)}`}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20"
              >
                <Pencil size={16} aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}

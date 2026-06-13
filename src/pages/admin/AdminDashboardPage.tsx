import { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Folder,
  BarChart2,
  CalendarDays,
  ArrowRight,
} from 'lucide-react';
import { api } from '../../services/api';
import type { ApiResponse } from '../../types';

interface Stats {
  totalUsers: number;
  totalProjects: number;
  totalParticipations: number;
  openProjects: number;
  totalEvents: number;
  projectsByCategory: { category: string; _count: { id: number } }[];
}

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<ApiResponse<Stats>>('/admin/stats')
      .then((res) => setStats(res.data))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container className="py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {t('admin.title')}
      </h1>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : (
        stats && (
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              {
                label: t('admin.totalUsers'),
                value: stats.totalUsers,
                icon: Users,
                color: 'blue',
              },
              {
                label: t('admin.totalProjects'),
                value: stats.totalProjects,
                icon: Folder,
                color: 'green',
              },
              {
                label: t('admin.totalParticipations'),
                value: stats.totalParticipations,
                icon: BarChart2,
                color: 'purple',
              },
              {
                label: t('admin.openProjects'),
                value: stats.openProjects,
                icon: Folder,
                color: 'amber',
              },
              {
                label: t('adminEvents.totalEvents'),
                value: stats.totalEvents,
                icon: CalendarDays,
                color: 'teal',
              },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <div
                  className={`h-8 w-8 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 mb-2 flex items-center justify-center`}
                >
                  <Icon
                    className={`h-4 w-4 text-${color}-600 dark:text-${color}-400`}
                    aria-hidden="true"
                  />
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {label}
                </p>
              </div>
            ))}
          </div>
        )
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          to="/admin/projects"
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-green-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-700"
        >
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {t('admin.projects')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('admin.createProject')}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Link>
        <Link
          to="/admin/users"
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-green-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-700"
        >
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {t('admin.users')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('admin.changeRole')}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Link>
        <Link
          to="/admin/events"
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-green-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-700"
        >
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {t('adminEvents.title')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('adminEvents.cardSubtitle')}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Link>
        <Link
          to="/admin/posts"
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-green-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-700"
        >
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {t('admin.posts.title')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('admin.posts.createTitle')}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Link>
        <Link
          to="/admin/ideas"
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-green-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-700"
        >
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {t('adminIdeas.title')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('adminIdeas.cardSubtitle')}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Link>
        <Link
          to="/admin/event-proposals"
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-green-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-700"
        >
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {t('adminEventProposals.title')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('adminEventProposals.cardSubtitle')}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Link>
        <Link
          to="/admin/monitoring"
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-green-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-700"
        >
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {t('adminMonitoring.title')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('adminMonitoring.cardSubtitle')}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Link>
        <Link
          to="/admin/rewards"
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-green-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-700"
        >
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {t('adminRewards.title')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('adminRewards.cardSubtitle')}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Link>
        <Link
          to="/admin/submissions"
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-green-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-700"
        >
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {t('adminSubmissions.title')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('adminSubmissions.cardSubtitle')}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Link>
        <Link
          to="/admin/comments"
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-green-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-700"
        >
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {t('adminComments.title')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('adminComments.navLabel')}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Link>
        <Link
          to="/admin/learn"
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-green-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-700"
        >
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {t('adminLearn.title')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('adminLearn.navLabel')}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Link>
        <Link
          to="/admin/feed"
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-green-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-700"
        >
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {t('adminFeed.title')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('adminFeed.navLabel')}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Link>
      </div>
    </Container>
  );
}

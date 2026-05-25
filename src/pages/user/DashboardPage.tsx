import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, Award, Users, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { getMe } from '../../services/userService';
import type { ApiParticipation } from '../../types';

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const lang = i18n.language.slice(0, 2);

  const [participations, setParticipations] = useState<ApiParticipation[]>([]);
  const [badgeCount, setBadgeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((data) => {
        setParticipations(data.participations ?? []);
        setBadgeCount(data._count.userBadges);
        updateUser({ points: data.points });
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [updateUser]);

  function getProjectTitle(p: ApiParticipation): string {
    if (!p.project) return p.projectId;
    if (lang === 'el') return p.project.titleEl;
    if (lang === 'de') return p.project.titleDe;
    return p.project.titleEn;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        {t('dashboard.title')}
      </h1>
      {user && (
        <p className="mb-8 text-gray-500 dark:text-gray-400">
          {t('dashboard.welcome', { name: user.name })}
        </p>
      )}

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Star className="h-5 w-5 text-amber-500" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.points ?? 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('dashboard.totalPoints')}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Award className="h-5 w-5 text-purple-500" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {badgeCount}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('dashboard.badgesEarned')}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <Users className="h-5 w-5 text-green-500" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {participations.length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('dashboard.projectsJoined')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Link
          to="/rewards"
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          {t('nav.rewards')} <ArrowRight size={14} aria-hidden="true" />
        </Link>
        <Link
          to="/projects"
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t('nav.projects')} <ArrowRight size={14} aria-hidden="true" />
        </Link>
        <Link
          to="/profile"
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t('nav.profile')} <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>

      {/* Participations */}
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        {t('dashboard.yourProjects')}
      </h2>
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : participations.length === 0 ? (
        <div className="rounded-xl bg-gray-50 p-8 text-center dark:bg-gray-800/50">
          <p className="mb-3 text-gray-500 dark:text-gray-400">
            {t('dashboard.noActivity')}
          </p>
          <Link
            to="/projects"
            className="text-sm font-medium text-green-600 hover:underline"
          >
            {t('nav.projects')} →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {participations.map((p) => (
            <Link
              key={p.id}
              to={`/projects/${p.projectId}`}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-green-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-700"
            >
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {getProjectTitle(p)}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <Star size={12} aria-hidden="true" /> +{p.pointsAwarded}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

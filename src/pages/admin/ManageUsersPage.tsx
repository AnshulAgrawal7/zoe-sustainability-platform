import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import type { ApiResponse } from '../../types';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  points: number;
  language: string;
  createdAt: string;
  _count: { participations: number; userBadges: number };
}

export default function ManageUsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<ApiResponse<AdminUser[]>>('/admin/users')
      .then((res) => setUsers(res.data))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  async function toggleRole(user: AdminUser) {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    setUpdating(user.id);
    try {
      await api.put(`/admin/users/${user.id}/role`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
    } catch {
      // silently fail in prototype
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {t('admin.users')}
      </h1>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                <th className="pb-3 pr-4 font-medium">{t('auth.name')}</th>
                <th className="pb-3 pr-4 font-medium">{t('auth.email')}</th>
                <th className="pb-3 pr-4 font-medium">Role</th>
                <th className="pb-3 pr-4 font-medium">Pts</th>
                <th className="pb-3 font-medium">{t('admin.changeRole')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">
                    {u.name}
                  </td>
                  <td className="py-3 pr-4 text-gray-500 dark:text-gray-400">
                    {u.email}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-500 dark:text-gray-400">
                    {u.points}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => void toggleRole(u)}
                      disabled={updating === u.id}
                      className="text-xs text-green-600 hover:underline disabled:opacity-50 dark:text-green-400"
                    >
                      {updating === u.id
                        ? t('common.loading')
                        : u.role === 'ADMIN'
                          ? '→ USER'
                          : '→ ADMIN'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

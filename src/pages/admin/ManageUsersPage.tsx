import { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import { useToastStore } from '../../stores/toastStore';
import type { ApiResponse } from '../../types';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
  points: number;
  language: string;
  createdAt: string;
  _count: { participations: number; userBadges: number };
}

export default function ManageUsersPage() {
  const { t } = useTranslation();
  const showToast = useToastStore((s) => s.showToast);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  // Per-row draft of the points input (id → string), so editing one row never
  // touches another.
  const [pointsDraft, setPointsDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    api
      .get<ApiResponse<AdminUser[]>>('/admin/users')
      .then((res) => setUsers(res.data))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  function patchUser(
    updated: Pick<AdminUser, 'id' | 'role' | 'active' | 'points'>
  ) {
    setUsers((prev) =>
      prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u))
    );
  }

  function onError() {
    // The backend returns stable codes (CANNOT_CHANGE_OWN_ROLE, LAST_ADMIN,
    // CANNOT_SUSPEND_SELF, …); a single localised message covers all guards.
    showToast(t('admin.actionForbidden'), { variant: 'error' });
  }

  async function toggleRole(user: AdminUser) {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    setUpdating(user.id);
    try {
      const res = await api.put<ApiResponse<AdminUser>>(
        `/admin/users/${user.id}/role`,
        { role: newRole }
      );
      patchUser(res.data);
      showToast(t('admin.userUpdated'), { variant: 'success' });
    } catch {
      onError();
    } finally {
      setUpdating(null);
    }
  }

  async function toggleActive(user: AdminUser) {
    setUpdating(user.id);
    try {
      const res = await api.patch<ApiResponse<AdminUser>>(
        `/admin/users/${user.id}/active`,
        { active: !user.active }
      );
      patchUser(res.data);
      showToast(t('admin.userUpdated'), { variant: 'success' });
    } catch {
      onError();
    } finally {
      setUpdating(null);
    }
  }

  async function savePoints(user: AdminUser) {
    const raw = pointsDraft[user.id];
    if (raw === undefined) return;
    const value = Number(raw);
    if (!Number.isInteger(value) || value < 0) {
      onError();
      return;
    }
    setUpdating(user.id);
    try {
      const res = await api.patch<ApiResponse<AdminUser>>(
        `/admin/users/${user.id}/points`,
        { points: value }
      );
      patchUser(res.data);
      setPointsDraft((d) => {
        const next = { ...d };
        delete next[user.id];
        return next;
      });
      showToast(t('admin.userUpdated'), { variant: 'success' });
    } catch {
      onError();
    } finally {
      setUpdating(null);
    }
  }

  return (
    <Container className="py-8">
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
                <th className="pb-3 pr-4 font-medium">{t('common.role')}</th>
                <th className="pb-3 pr-4 font-medium">{t('admin.status')}</th>
                <th className="pb-3 pr-4 font-medium">{t('common.pts')}</th>
                <th className="pb-3 font-medium">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.map((u) => {
                const draft = pointsDraft[u.id];
                const busy = updating === u.id;
                return (
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
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          u.active
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                        }`}
                      >
                        {u.active ? t('admin.active') : t('admin.suspended')}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-1.5">
                        <label htmlFor={`pts-${u.id}`} className="sr-only">
                          {t('admin.adjustPoints')}
                        </label>
                        <input
                          id={`pts-${u.id}`}
                          type="number"
                          min={0}
                          value={draft ?? String(u.points)}
                          onChange={(e) =>
                            setPointsDraft((d) => ({
                              ...d,
                              [u.id]: e.target.value,
                            }))
                          }
                          className="w-20 rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        {draft !== undefined && draft !== String(u.points) && (
                          <button
                            type="button"
                            onClick={() => void savePoints(u)}
                            disabled={busy}
                            className="rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:opacity-50"
                          >
                            {t('admin.savePoints')}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => void toggleRole(u)}
                          disabled={busy}
                          className="text-xs text-green-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:opacity-50 dark:text-green-400"
                        >
                          {busy
                            ? t('common.loading')
                            : u.role === 'ADMIN'
                              ? '→ USER'
                              : '→ ADMIN'}
                        </button>
                        <button
                          type="button"
                          onClick={() => void toggleActive(u)}
                          disabled={busy}
                          className="text-xs text-rose-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:opacity-50 dark:text-rose-400"
                        >
                          {u.active
                            ? t('admin.suspend')
                            : t('admin.reactivate')}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}

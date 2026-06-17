import { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import type { ApiResponse } from '../../types';

interface AuditEntry {
  id: string;
  actorEmail: string;
  action: string;
  targetType: string;
  targetId: string | null;
  targetLabel: string | null;
  detail: string | null;
  createdAt: string;
}

// Known action codes the backend writes (utils/audit.ts). Unknown codes fall
// back to the raw string so a new action never renders blank.
const KNOWN_ACTIONS = [
  'ROLE_CHANGE',
  'ACCOUNT_SUSPEND',
  'ACCOUNT_REACTIVATE',
  'POINTS_ADJUST',
  'ACCOUNT_DELETE',
];

// Read-only view of the admin audit trail (Future Work 4.2). The data is already
// served by GET /admin/audit; this is the operator-facing surface for it.
export default function AuditLogPage() {
  const { t, i18n } = useTranslation();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api
      .get<ApiResponse<AuditEntry[]>>('/admin/audit')
      .then((res) => setEntries(res.data))
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  function actionLabel(action: string): string {
    return KNOWN_ACTIONS.includes(action)
      ? t(`adminAudit.action.${action}`)
      : action;
  }

  function formatWhen(iso: string): string {
    return new Date(iso).toLocaleString(i18n.language);
  }

  return (
    <Container className="py-8">
      <h1 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
        {t('adminAudit.title')}
      </h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        {t('adminAudit.subtitle')}
      </p>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : failed ? (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300"
        >
          {t('common.loadError')}
        </p>
      ) : entries.length === 0 ? (
        <p className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
          {t('adminAudit.empty')}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="sr-only">{t('adminAudit.title')}</caption>
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-4 py-3">
                  {t('adminAudit.colWhen')}
                </th>
                <th scope="col" className="px-4 py-3">
                  {t('adminAudit.colActor')}
                </th>
                <th scope="col" className="px-4 py-3">
                  {t('adminAudit.colAction')}
                </th>
                <th scope="col" className="px-4 py-3">
                  {t('adminAudit.colTarget')}
                </th>
                <th scope="col" className="px-4 py-3">
                  {t('adminAudit.colDetail')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {entries.map((e) => (
                <tr key={e.id} className="bg-white dark:bg-gray-900">
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500 dark:text-gray-400">
                    {formatWhen(e.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white">
                    {e.actorEmail}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      {actionLabel(e.action)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {e.targetLabel ?? e.targetId ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {e.detail ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}

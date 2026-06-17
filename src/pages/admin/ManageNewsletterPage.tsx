import { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import { useTranslation } from 'react-i18next';
import { Download, Trash2 } from 'lucide-react';
import {
  getNewsletterSignups,
  deleteNewsletterSignup,
  exportNewsletterSignups,
  type NewsletterSignup,
} from '../../services/newsletterService';
import { useToastStore } from '../../stores/toastStore';

// Admin view of newsletter signups (Future Work 4.4): list, CSV export and
// single-row removal (list hygiene / right to erasure). Prototype: there is no
// real mailing pipeline — this only manages the stored addresses.
export default function ManageNewsletterPage() {
  const { t, i18n } = useTranslation();
  const showToast = useToastStore((s) => s.showToast);
  const [signups, setSignups] = useState<NewsletterSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  // Two-step delete: first click arms the row, second confirms.
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    getNewsletterSignups()
      .then((d) => setSignups(d.signups))
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (confirmId !== id) {
      setConfirmId(id);
      return;
    }
    setBusy(id);
    try {
      await deleteNewsletterSignup(id);
      setSignups((prev) => prev.filter((s) => s.id !== id));
      showToast(t('adminNewsletter.deleted'), { variant: 'success' });
    } catch {
      showToast(t('common.loadError'), { variant: 'error' });
    } finally {
      setBusy(null);
      setConfirmId(null);
    }
  }

  async function handleExport() {
    try {
      await exportNewsletterSignups();
    } catch {
      showToast(t('common.loadError'), { variant: 'error' });
    }
  }

  return (
    <Container className="py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
            {t('adminNewsletter.title')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('adminNewsletter.subtitle')}
          </p>
        </div>
        {signups.length > 0 && (
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <Download size={16} aria-hidden="true" />
            {t('adminNewsletter.export')}
          </button>
        )}
      </div>

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
      ) : signups.length === 0 ? (
        <p className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
          {t('adminNewsletter.empty')}
        </p>
      ) : (
        <>
          <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
            {t('adminNewsletter.count', { count: signups.length })}
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full min-w-[560px] text-left text-sm">
              <caption className="sr-only">
                {t('adminNewsletter.title')}
              </caption>
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    {t('adminNewsletter.colEmail')}
                  </th>
                  <th scope="col" className="px-4 py-3">
                    {t('adminNewsletter.colLocale')}
                  </th>
                  <th scope="col" className="px-4 py-3">
                    {t('adminNewsletter.colWhen')}
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    {t('adminNewsletter.colActions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {signups.map((s) => (
                  <tr key={s.id} className="bg-white dark:bg-gray-900">
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {s.email}
                    </td>
                    <td className="px-4 py-3 uppercase text-gray-500 dark:text-gray-400">
                      {s.locale}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500 dark:text-gray-400">
                      {new Date(s.createdAt).toLocaleDateString(i18n.language)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(s.id)}
                        disabled={busy === s.id}
                        aria-label={t('adminNewsletter.deleteAria', {
                          email: s.email,
                        })}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:opacity-60 dark:text-rose-400 dark:hover:bg-rose-900/20"
                      >
                        <Trash2 size={14} aria-hidden="true" />
                        {confirmId === s.id
                          ? t('adminNewsletter.confirmDelete')
                          : t('common.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Container>
  );
}

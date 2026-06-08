import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Pencil, Users, KeyRound, X } from 'lucide-react';
import {
  getSchools,
  createSchool,
  updateSchool,
  deleteSchool,
  type CreateSchoolResult,
} from '../../services/schoolService';
import type { SchoolSummary } from '../../types';

const EMPTY_FORM = {
  name: '',
  code: '',
  location: '',
  coordinatorEmail: '',
  coordinatorName: '',
  coordinatorPassword: '',
};

export default function ManageSchoolsPage() {
  const { t } = useTranslation();
  const [schools, setSchools] = useState<SchoolSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [createdCreds, setCreatedCreds] =
    useState<CreateSchoolResult['coordinator']>(undefined);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    code: '',
    location: '',
  });

  function load() {
    getSchools()
      .then(setSchools)
      .catch(() => null)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim()) {
      setError(t('admin.schools.validationRequired'));
      return;
    }
    setError('');
    setSaving(true);
    setCreatedCreds(undefined);
    try {
      const result = await createSchool({
        name: form.name.trim(),
        code: form.code.trim(),
        location: form.location.trim() || undefined,
        coordinatorEmail: form.coordinatorEmail.trim() || undefined,
        coordinatorName: form.coordinatorName.trim() || undefined,
        coordinatorPassword: form.coordinatorPassword.trim() || undefined,
      });
      setCreatedCreds(result.coordinator);
      setForm({ ...EMPTY_FORM });
      setLoading(true);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setSaving(false);
    }
  }

  function startEdit(s: SchoolSummary & { code?: string }) {
    setEditId(s.id);
    setEditForm({
      name: s.name,
      code: (s as { code?: string }).code ?? '',
      location: s.location ?? '',
    });
  }

  async function handleEditSave(id: string) {
    try {
      await updateSchool(id, {
        name: editForm.name.trim(),
        ...(editForm.code.trim() ? { code: editForm.code.trim() } : {}),
        location: editForm.location.trim(),
      });
      setEditId(null);
      setLoading(true);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm(t('admin.schools.confirmDelete'))) return;
    try {
      await deleteSchool(id);
      setSchools((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {t('admin.schools.title')}
      </h1>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300"
        >
          {error}
        </div>
      )}

      {/* Coordinator credentials (shown once after creation) */}
      {createdCreds && (
        <div
          role="status"
          className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-900/20"
        >
          <p className="flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-300">
            <KeyRound size={16} aria-hidden="true" />
            {t('admin.schools.coordinatorCreated')}
          </p>
          <p className="mt-1 font-mono text-sm text-amber-900 dark:text-amber-200">
            {createdCreds.email} · {createdCreds.password}
          </p>
          <p className="mt-1 text-xs text-amber-700 dark:text-amber-300/90">
            {t('admin.schools.coordinatorHint')}
          </p>
        </div>
      )}

      {/* Create form */}
      <form
        onSubmit={handleCreate}
        className="mb-8 space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
      >
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
          {t('admin.schools.createTitle')}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            id="school-name"
            label={t('admin.schools.name')}
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            required
          />
          <Field
            id="school-code"
            label={t('admin.schools.code')}
            value={form.code}
            onChange={(v) => setForm({ ...form, code: v })}
            required
            mono
          />
          <Field
            id="school-location"
            label={t('admin.schools.location')}
            value={form.location}
            onChange={(v) => setForm({ ...form, location: v })}
          />
        </div>
        <fieldset className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <legend className="px-1 text-xs font-medium text-gray-500 dark:text-gray-400">
            {t('admin.schools.coordinatorLegend')}
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field
              id="coord-email"
              label={t('admin.schools.coordinatorEmail')}
              value={form.coordinatorEmail}
              onChange={(v) => setForm({ ...form, coordinatorEmail: v })}
              type="email"
            />
            <Field
              id="coord-name"
              label={t('admin.schools.coordinatorName')}
              value={form.coordinatorName}
              onChange={(v) => setForm({ ...form, coordinatorName: v })}
            />
            <Field
              id="coord-pass"
              label={t('admin.schools.coordinatorPassword')}
              value={form.coordinatorPassword}
              onChange={(v) => setForm({ ...form, coordinatorPassword: v })}
            />
          </div>
        </fieldset>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
        >
          <Plus size={16} aria-hidden="true" />
          {saving ? t('common.loading') : t('admin.schools.create')}
        </button>
      </form>

      {/* List */}
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
        {t('admin.schools.listTitle')}
      </h2>
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : (
        <ul className="space-y-3">
          {schools.map((s) => (
            <li
              key={s.id}
              className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              {editId === s.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Field
                      id={`edit-name-${s.id}`}
                      label={t('admin.schools.name')}
                      value={editForm.name}
                      onChange={(v) => setEditForm({ ...editForm, name: v })}
                    />
                    <Field
                      id={`edit-code-${s.id}`}
                      label={t('admin.schools.code')}
                      value={editForm.code}
                      onChange={(v) => setEditForm({ ...editForm, code: v })}
                      mono
                    />
                    <Field
                      id={`edit-loc-${s.id}`}
                      label={t('admin.schools.location')}
                      value={editForm.location}
                      onChange={(v) =>
                        setEditForm({ ...editForm, location: v })
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditSave(s.id)}
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                    >
                      {t('common.save')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditId(null)}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <X size={14} aria-hidden="true" />
                      {t('common.cancel')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900 dark:text-white">
                      {s.name}
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="inline-flex items-center gap-1">
                        <Users size={12} aria-hidden="true" />
                        {t('schools.ranking.members', { count: s.memberCount })}
                      </span>
                      {s.location && <span>{s.location}</span>}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(s)}
                      aria-label={`${t('admin.schools.edit')}: ${s.name}`}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20"
                    >
                      <Pencil size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id)}
                      aria-label={`${t('admin.schools.delete')}: ${s.name}`}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  required,
  type = 'text',
  mono,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
      >
        {label}
        {required ? ' *' : ''}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        aria-required={required}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${mono ? 'font-mono' : ''}`}
      />
    </div>
  );
}

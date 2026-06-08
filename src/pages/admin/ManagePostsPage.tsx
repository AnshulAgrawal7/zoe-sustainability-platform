import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
} from '../../services/postService';
import AutoTranslatePanel from '../../components/admin/AutoTranslatePanel';
import { pickLang } from '../../utils/i18nFields';
import type { Post, PostType } from '../../types';

const TYPES: PostType[] = ['ANNOUNCEMENT', 'PROJECT_NEW', 'PROJECT_COMPLETED'];

const EMPTY = {
  type: 'ANNOUNCEMENT' as PostType,
  titleEn: '',
  titleEl: '',
  titleDe: '',
  bodyEn: '',
  bodyEl: '',
  bodyDe: '',
  imageUrl: '',
  published: true,
};

export default function ManagePostsPage() {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ...EMPTY });
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function load() {
    getPosts({ limit: 50 })
      .then(setPosts)
      .catch(() => null)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetForm() {
    setForm({ ...EMPTY });
    setEditId(null);
  }

  function startEdit(p: Post) {
    setEditId(p.id);
    setForm({
      type: p.type,
      titleEn: p.titleEn,
      titleEl: p.titleEl,
      titleDe: p.titleDe,
      bodyEn: p.bodyEn,
      bodyEl: p.bodyEl,
      bodyDe: p.bodyDe,
      imageUrl: p.imageUrl ?? '',
      published: p.published,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titleEn || !form.titleEl || !form.titleDe) {
      setError(t('admin.posts.validationTitles'));
      return;
    }
    if (!form.bodyEn || !form.bodyEl || !form.bodyDe) {
      setError(t('admin.posts.validationBodies'));
      return;
    }
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        imageUrl: form.imageUrl || undefined,
      };
      if (editId) {
        await updatePost(editId, payload);
      } else {
        await createPost(payload);
      }
      resetForm();
      setLoading(true);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm(t('admin.posts.confirmDelete'))) return;
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {t('admin.posts.title')}
      </h1>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mb-8 space-y-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
            {editId ? t('admin.posts.editTitle') : t('admin.posts.createTitle')}
          </h2>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-green-600 dark:text-gray-400"
            >
              <X size={14} aria-hidden="true" />
              {t('admin.posts.newPost')}
            </button>
          )}
        </div>

        <AutoTranslatePanel
          values={form}
          onChange={set}
          fields={['title', 'body']}
        />

        {/* Titles */}
        <fieldset className="space-y-3">
          <legend className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {t('admin.posts.fieldTitle')}
          </legend>
          {(['En', 'El', 'De'] as const).map((l) => (
            <div key={l}>
              <label
                htmlFor={`post-title-${l}`}
                className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {l === 'En' ? 'English' : l === 'El' ? 'Ελληνικά' : 'Deutsch'} *
              </label>
              <input
                id={`post-title-${l}`}
                type="text"
                required
                aria-required="true"
                value={form[`title${l}` as keyof typeof form] as string}
                onChange={(e) => set(`title${l}`, e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          ))}
        </fieldset>

        {/* Bodies */}
        <fieldset className="space-y-3">
          <legend className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {t('admin.posts.fieldBody')}
          </legend>
          {(['En', 'El', 'De'] as const).map((l) => (
            <div key={l}>
              <label
                htmlFor={`post-body-${l}`}
                className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {l === 'En' ? 'English' : l === 'El' ? 'Ελληνικά' : 'Deutsch'} *
              </label>
              <textarea
                id={`post-body-${l}`}
                required
                aria-required="true"
                rows={3}
                value={form[`body${l}` as keyof typeof form] as string}
                onChange={(e) => set(`body${l}`, e.target.value)}
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          ))}
        </fieldset>

        {/* Meta */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="post-type"
              className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {t('admin.posts.fieldType')}
            </label>
            <select
              id="post-type"
              value={form.type}
              onChange={(e) => set('type', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {TYPES.map((ty) => (
                <option key={ty} value={ty}>
                  {t(`news.types.${ty}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="post-image"
              className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {t('admin.posts.fieldImageUrl')}
            </label>
            <input
              id="post-image"
              type="url"
              inputMode="url"
              value={form.imageUrl}
              onChange={(e) => set('imageUrl', e.target.value)}
              placeholder="https://…/image.jpg"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => set('published', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          {t('admin.posts.published')}
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
          >
            <Plus size={16} aria-hidden="true" />
            {saving
              ? t('common.loading')
              : editId
                ? t('common.save')
                : t('admin.posts.create')}
          </button>
        </div>
      </form>

      {/* List */}
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
        {t('admin.posts.listTitle')}
      </h2>
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {pickLang(i18n.language, p.titleEn, p.titleEl, p.titleDe)}
                </p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {t(`news.types.${p.type}`)}
                  {!p.published && ` · ${t('admin.posts.draft')}`}
                </p>
              </div>
              <div className="flex flex-shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(p)}
                  aria-label={`${t('admin.posts.edit')}`}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20"
                >
                  <Pencil size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  aria-label={`${t('admin.posts.delete')}`}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

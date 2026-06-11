import { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Trash2, ArrowUp, ArrowDown, Save } from 'lucide-react';
import {
  getAdminFeedPost,
  updateFeedPost,
  deleteFeedPost,
  updateFeedImage,
  deleteFeedImage,
  reorderFeedImages,
} from '../../services/feedAdminService';
import type { AdminFeedPost, AdminFeedImage } from '../../types';

const CATEGORIES = ['ANNOUNCEMENT', 'EVENT', 'PROJECT', 'NEWS'] as const;
const LOCALES = [
  { code: 'el', label: 'Ελληνικά' },
  { code: 'de', label: 'Deutsch' },
  { code: 'en', label: 'English' },
] as const;

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white';

export default function EditFeedPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [post, setPost] = useState<AdminFeedPost | null>(null);
  const [category, setCategory] = useState<AdminFeedPost['category']>('NEWS');
  const [eventStatus, setEventStatus] = useState<string>('');
  const [needsReview, setNeedsReview] = useState(false);
  const [tr, setTr] = useState<Record<string, { title: string; body: string }>>(
    {}
  );
  const [images, setImages] = useState<AdminFeedImage[]>([]);
  const [savedImg, setSavedImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    getAdminFeedPost(id)
      .then((p) => {
        setPost(p);
        setCategory(p.category);
        setEventStatus(p.eventStatus ?? '');
        setNeedsReview(p.needsReview);
        const map: Record<string, { title: string; body: string }> = {};
        for (const loc of LOCALES) {
          const found = p.translations.find((x) => x.locale === loc.code);
          map[loc.code] = {
            title: found?.title ?? '',
            body: found?.body ?? '',
          };
        }
        setTr(map);
        setImages([...p.images].sort((a, b) => a.order - b.order));
      })
      .catch(() => setNotFound(true));
  }, [id]);

  function setTrField(locale: string, field: 'title' | 'body', value: string) {
    setTr((prev) => ({
      ...prev,
      [locale]: {
        ...(prev[locale] ?? { title: '', body: '' }),
        [field]: value,
      },
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    setError('');
    setSaved(false);
    setLoading(true);
    try {
      const updated = await updateFeedPost(id, {
        category,
        eventStatus: eventStatus
          ? (eventStatus as 'UPCOMING' | 'COMPLETED')
          : null,
        needsReview,
        translations: LOCALES.map((l) => ({
          locale: l.code,
          title: tr[l.code]?.title ?? '',
          body: tr[l.code]?.body ?? '',
        })),
      });
      setPost(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePost() {
    if (!id || !window.confirm(t('adminFeed.deleteConfirm'))) return;
    setLoading(true);
    try {
      await deleteFeedPost(id);
      navigate('/admin/feed');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
      setLoading(false);
    }
  }

  // Alt text resolved for one locale (used both for editing and the thumbnail
  // preview). Returns the persisted row or a transient blank to edit into.
  function altOf(img: AdminFeedImage, locale: string) {
    return img.altTexts.find((a) => a.locale === locale);
  }

  // Active-UI-language preview for the thumbnail (active → EN → "").
  function previewAlt(img: AdminFeedImage): string {
    const active = i18n.language.slice(0, 2);
    return (altOf(img, active) ?? altOf(img, 'en'))?.text ?? '';
  }

  function patchAlt(
    imageId: string,
    locale: string,
    patch: Partial<{ text: string; needsReview: boolean }>
  ) {
    setSavedImg(null);
    setImages((prev) =>
      prev.map((im) => {
        if (im.id !== imageId) return im;
        const exists = im.altTexts.some((a) => a.locale === locale);
        const altTexts = exists
          ? im.altTexts.map((a) =>
              a.locale === locale ? { ...a, ...patch } : a
            )
          : [
              ...im.altTexts,
              {
                id: `new-${locale}`,
                locale,
                text: '',
                needsReview: true,
                ...patch,
              },
            ];
        return { ...im, altTexts };
      })
    );
  }

  async function saveAlt(img: AdminFeedImage) {
    try {
      const updated = await updateFeedImage(img.id, {
        altTexts: LOCALES.map((l) => {
          const a = altOf(img, l.code);
          return {
            locale: l.code,
            text: a?.text ?? '',
            needsReview: a?.needsReview ?? true,
          };
        }),
      });
      setImages((prev) =>
        prev.map((im) =>
          im.id === img.id ? { ...im, altTexts: updated.altTexts } : im
        )
      );
      setSavedImg(img.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const next = index + dir;
    if (!id || next < 0 || next >= images.length) return;
    const reordered = [...images];
    const a = reordered[index];
    const b = reordered[next];
    if (!a || !b) return;
    reordered[index] = b;
    reordered[next] = a;
    setImages(reordered);
    try {
      await reorderFeedImages(
        id,
        reordered.map((im) => im.id)
      );
    } catch {
      /* keep optimistic order */
    }
  }

  async function removeImage(imageId: string) {
    if (!window.confirm(t('adminFeed.deleteImageConfirm'))) return;
    try {
      await deleteFeedImage(imageId);
      setImages((prev) => prev.filter((im) => im.id !== imageId));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    }
  }

  if (notFound) {
    return (
      <Container className="py-20 text-center">
        <p className="text-gray-500 dark:text-gray-400">{t('common.error')}</p>
        <Link
          to="/admin/feed"
          className="mt-2 inline-block font-medium text-green-700 underline dark:text-green-400"
        >
          ← {t('adminFeed.title')}
        </Link>
      </Container>
    );
  }
  if (!post) {
    return (
      <div className="p-8 text-gray-500 dark:text-gray-400">
        {t('common.loading')}
      </div>
    );
  }

  return (
    <Container className="py-8">
      <Link
        to="/admin/feed"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
      >
        <ChevronLeft size={16} aria-hidden="true" /> {t('common.back')}
      </Link>
      <h1 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
        {t('adminFeed.edit')}
      </h1>
      <p className="mb-6 text-xs text-gray-400 dark:text-gray-500">
        {t('adminFeed.sourceFolder')}: {post.sourceFolder}
      </p>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Meta */}
        <section className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800 sm:grid-cols-2">
          <div>
            <label
              htmlFor="feed-category"
              className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {t('adminFeed.formCategory')}
            </label>
            <select
              id="feed-category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as AdminFeedPost['category'])
              }
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {t(`feed.category.${c}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="feed-eventstatus"
              className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {t('adminFeed.formEventStatus')}
            </label>
            <select
              id="feed-eventstatus"
              value={eventStatus}
              onChange={(e) => setEventStatus(e.target.value)}
              className={inputClass}
            >
              <option value="">{t('adminFeed.eventStatusNone')}</option>
              <option value="UPCOMING">{t('feed.event.UPCOMING')}</option>
              <option value="COMPLETED">{t('feed.event.COMPLETED')}</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2">
            <input
              type="checkbox"
              checked={needsReview}
              onChange={(e) => setNeedsReview(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            {t('adminFeed.formNeedsReview')}
          </label>
        </section>

        {/* Translations */}
        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
            {t('adminFeed.translations')}
          </h2>
          {LOCALES.map((loc) => {
            const meta = post.translations.find((x) => x.locale === loc.code);
            return (
              <div
                key={loc.code}
                className="rounded-lg border border-gray-100 p-3 dark:border-gray-700"
              >
                <p className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  {loc.label}
                  {meta?.isMachineTranslated && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      {t('adminFeed.machineTranslated')}
                    </span>
                  )}
                </p>
                <input
                  type="text"
                  aria-label={`${loc.label} — title`}
                  value={tr[loc.code]?.title ?? ''}
                  onChange={(e) =>
                    setTrField(loc.code, 'title', e.target.value)
                  }
                  className={`${inputClass} mb-2`}
                />
                <textarea
                  aria-label={`${loc.label} — body`}
                  rows={5}
                  value={tr[loc.code]?.body ?? ''}
                  onChange={(e) => setTrField(loc.code, 'body', e.target.value)}
                  className={`${inputClass} resize-y`}
                />
              </div>
            );
          })}
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? t('common.loading') : t('admin.saveChanges')}
          </button>
          {saved && (
            <span
              role="status"
              className="text-sm text-green-600 dark:text-green-400"
            >
              {t('adminFeed.saved')}
            </span>
          )}
          <button
            type="button"
            onClick={() => void handleDeletePost()}
            disabled={loading}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Trash2 size={15} aria-hidden="true" />
            {t('adminFeed.delete')}
          </button>
        </div>
      </form>

      {/* Images (managed outside the form to avoid nested submits) */}
      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
          {t('adminFeed.imagesHeading')}
        </h2>
        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          {t('adminFeed.altIntro')}
        </p>
        <ul className="space-y-3">
          {images.map((img, idx) => (
            <li
              key={img.id}
              className="flex gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-700"
            >
              <img
                src={img.publicUrl}
                alt={previewAlt(img)}
                width={img.width ?? undefined}
                height={img.height ?? undefined}
                className="h-20 w-28 shrink-0 rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="mb-2 block text-xs font-medium text-gray-500 dark:text-gray-400">
                  {t('adminFeed.altLabel')}
                </p>
                <div className="space-y-2">
                  {LOCALES.map((loc) => {
                    const a = altOf(img, loc.code);
                    const unreviewed = a?.needsReview ?? true;
                    return (
                      <div key={loc.code}>
                        <label
                          htmlFor={`alt-${img.id}-${loc.code}`}
                          className="mb-1 flex items-center gap-2 text-[11px] font-medium text-gray-500 dark:text-gray-400"
                        >
                          {loc.label}
                          {unreviewed && (
                            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                              {t('adminFeed.altUnchecked')}
                            </span>
                          )}
                        </label>
                        <input
                          id={`alt-${img.id}-${loc.code}`}
                          type="text"
                          value={a?.text ?? ''}
                          onChange={(e) =>
                            patchAlt(img.id, loc.code, { text: e.target.value })
                          }
                          className={inputClass}
                        />
                        <label className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-600 dark:text-gray-400">
                          <input
                            type="checkbox"
                            checked={unreviewed}
                            onChange={(e) =>
                              patchAlt(img.id, loc.code, {
                                needsReview: e.target.checked,
                              })
                            }
                            className="h-3.5 w-3.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          {t('adminFeed.altReviewToggle')}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void saveAlt(img)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Save size={13} aria-hidden="true" />
                    {t('adminFeed.altSave')}
                  </button>
                  {savedImg === img.id && (
                    <span
                      role="status"
                      className="text-xs text-green-600 dark:text-green-400"
                    >
                      {t('adminFeed.saved')}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void move(idx, -1)}
                    disabled={idx === 0}
                    aria-label={t('adminFeed.moveUp')}
                    className="rounded border border-gray-300 p-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-600 dark:text-gray-300"
                  >
                    <ArrowUp size={14} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void move(idx, 1)}
                    disabled={idx === images.length - 1}
                    aria-label={t('adminFeed.moveDown')}
                    className="rounded border border-gray-300 p-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-600 dark:text-gray-300"
                  >
                    <ArrowDown size={14} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void removeImage(img.id)}
                    className="ml-auto inline-flex items-center gap-1 rounded border border-red-300 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                  >
                    <Trash2 size={13} aria-hidden="true" />
                    {t('adminFeed.deleteImage')}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}

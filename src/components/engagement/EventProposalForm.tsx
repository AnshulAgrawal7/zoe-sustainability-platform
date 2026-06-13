import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';
import { submitEventProposal } from '../../services/eventProposalService';
import { getProjects } from '../../services/projectService';
import { useAuthStore } from '../../stores/authStore';
import AddressPicker, { type AddressValue } from '../map/AddressPicker';
import ImageUpload from '../ui/ImageUpload';
import type { ApiProjectCategory, ApiProject, UserLanguage } from '../../types';

const CATEGORIES: ApiProjectCategory[] = [
  'ENVIRONMENT',
  'MOBILITY',
  'COMMUNITY',
  'EDUCATION',
  'CULTURE',
];

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white';
const labelClass =
  'mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  onClose: () => void;
}

// Citizen EVENT proposal (one language). Reviewed by an admin who converts it
// into a real, trilingual Event (the source language is auto-translated). Works
// without an account; the address autocomplete + image upload need a login.
export default function EventProposalForm({ onClose }: Props) {
  const { t, i18n } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const lang =
    (i18n.language.slice(0, 2).toUpperCase() as UserLanguage) || 'EN';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ApiProjectCategory | ''>('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState<AddressValue>({
    location: '',
    lat: null,
    lng: null,
  });
  const [capacity, setCapacity] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [projectId, setProjectId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projects, setProjects] = useState<ApiProject[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getProjects({ status: 'ALL', limit: 50 })
      .then((d) => setProjects(d.projects))
      .catch(() => setProjects([]));
  }, []);

  function projectLabel(p: ApiProject): string {
    if (lang === 'EL') return p.titleEl;
    if (lang === 'DE') return p.titleDe;
    return p.titleEn;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fe: Record<string, string> = {};
    if (!title.trim()) fe.title = t('validation.title');
    if (!category) fe.category = t('validation.category');
    if (!description.trim()) fe.description = t('validation.description');
    if (!date) fe.date = t('validation.date');
    if (!(isAuthenticated && user)) {
      if (!name.trim()) fe.name = t('validation.name');
      if (!email.trim() || !EMAIL_RE.test(email.trim()))
        fe.email = t('validation.email');
    }
    setFieldErrors(fe);
    if (Object.keys(fe).length > 0) return;

    setError('');
    setSubmitting(true);
    try {
      await submitEventProposal({
        title: title.trim(),
        description: description.trim(),
        lang,
        category: category as ApiProjectCategory,
        date: new Date(date).toISOString(),
        location: address.location || undefined,
        lat: address.lat,
        lng: address.lng,
        capacity: capacity ? Number(capacity) : null,
        imageUrl: imageUrl || undefined,
        projectId: projectId || undefined,
        submitterName:
          isAuthenticated && user ? undefined : name.trim() || undefined,
        submitterEmail:
          isAuthenticated && user ? undefined : email.trim() || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('participate.submitError')
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="py-8 text-center">
        <CheckCircle2
          size={48}
          className="mx-auto mb-4 text-green-500"
          aria-hidden="true"
        />
        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
          {t('eventProposal.thankYouTitle')}
        </h3>
        <p className="mb-2 text-gray-600 dark:text-gray-300">
          {t('eventProposal.thankYouBody')}
        </p>
        <button
          onClick={onClose}
          className="mt-6 text-sm text-green-700 underline dark:text-green-400"
        >
          {t('common.close')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <p className="rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-800 dark:border-teal-800 dark:bg-teal-900/20 dark:text-teal-200">
        {t('eventProposal.intro')}
      </p>

      <div>
        <label htmlFor="ep-title" className={labelClass}>
          {t('eventProposal.titleLabel')}
        </label>
        <input
          id="ep-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setFieldErrors((fe) => ({ ...fe, title: '' }));
          }}
          aria-invalid={!!fieldErrors.title}
          className={inputClass}
        />
        {fieldErrors.title && (
          <p
            role="alert"
            className="mt-1 text-xs text-rose-600 dark:text-rose-400"
          >
            {fieldErrors.title}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ep-category" className={labelClass}>
            {t('participate.categoryLabel')}
          </label>
          <select
            id="ep-category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as ApiProjectCategory);
              setFieldErrors((fe) => ({ ...fe, category: '' }));
            }}
            aria-invalid={!!fieldErrors.category}
            className={inputClass}
          >
            <option value="">{t('participate.categoryPlaceholder')}</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t(`projects.category.${c}`)}
              </option>
            ))}
          </select>
          {fieldErrors.category && (
            <p
              role="alert"
              className="mt-1 text-xs text-rose-600 dark:text-rose-400"
            >
              {fieldErrors.category}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="ep-date" className={labelClass}>
            {t('eventProposal.dateLabel')}
          </label>
          <input
            id="ep-date"
            type="datetime-local"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setFieldErrors((fe) => ({ ...fe, date: '' }));
            }}
            aria-invalid={!!fieldErrors.date}
            className={inputClass}
          />
          {fieldErrors.date && (
            <p
              role="alert"
              className="mt-1 text-xs text-rose-600 dark:text-rose-400"
            >
              {fieldErrors.date}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="ep-description" className={labelClass}>
          {t('eventProposal.descriptionLabel')}
        </label>
        <textarea
          id="ep-description"
          rows={4}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setFieldErrors((fe) => ({ ...fe, description: '' }));
          }}
          aria-invalid={!!fieldErrors.description}
          className={`${inputClass} resize-none`}
        />
        {fieldErrors.description && (
          <p
            role="alert"
            className="mt-1 text-xs text-rose-600 dark:text-rose-400"
          >
            {fieldErrors.description}
          </p>
        )}
      </div>

      {/* Address → coordinates (autocomplete needs a login; guests may type a
          plain location). */}
      <AddressPicker
        id="ep-address"
        label={t('eventProposal.locationLabel')}
        value={address}
        onChange={setAddress}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ep-capacity" className={labelClass}>
            {t('eventProposal.capacityLabel')}
          </label>
          <input
            id="ep-capacity"
            type="number"
            min={1}
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder={t('adminEvents.formUnlimited')}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="ep-project" className={labelClass}>
            {t('eventProposal.projectLabel')}
          </label>
          <select
            id="ep-project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className={inputClass}
          >
            <option value="">{t('eventProposal.noProject')}</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {projectLabel(p)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Image upload requires a login (stored in Supabase). */}
      {isAuthenticated ? (
        <ImageUpload
          id="ep-image"
          label={t('eventProposal.imageLabel')}
          value={imageUrl}
          onChange={setImageUrl}
        />
      ) : (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t('eventProposal.imageLoginHint')}
        </p>
      )}

      {/* Contact details — taken from the profile when logged in. */}
      {isAuthenticated && user ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300">
          {t('participate.profileContact', {
            name: user.name,
            email: user.email,
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="ep-name" className={labelClass}>
              {t('participate.yourName')}
            </label>
            <input
              id="ep-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFieldErrors((fe) => ({ ...fe, name: '' }));
              }}
              aria-invalid={!!fieldErrors.name}
              className={inputClass}
            />
            {fieldErrors.name && (
              <p
                role="alert"
                className="mt-1 text-xs text-rose-600 dark:text-rose-400"
              >
                {fieldErrors.name}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="ep-email" className={labelClass}>
              {t('participate.emailAddress')}
            </label>
            <input
              id="ep-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors((fe) => ({ ...fe, email: '' }));
              }}
              aria-invalid={!!fieldErrors.email}
              className={inputClass}
            />
            {fieldErrors.email && (
              <p
                role="alert"
                className="mt-1 text-xs text-rose-600 dark:text-rose-400"
              >
                {fieldErrors.email}
              </p>
            )}
          </div>
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300"
        >
          {error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-green-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-60"
        >
          {submitting ? t('common.loading') : t('eventProposal.submit')}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {t('common.cancel')}
        </button>
      </div>
    </form>
  );
}

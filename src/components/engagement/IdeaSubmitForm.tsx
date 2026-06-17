import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';
import { submitIdea } from '../../services/ideaService';
import { useAuthStore } from '../../stores/authStore';
import type { ApiProjectCategory } from '../../types';

// Reuses the Project category values (labels via i18n `projects.category.*`).
const CATEGORIES: ApiProjectCategory[] = [
  'MOBILITY',
  'WASTE_CIRCULAR',
  'MARINE_PROTECTION',
  'NATURAL_MONUMENTS',
  'ENERGY',
  'EDUCATION_PARTICIPATION',
];

interface IdeaSubmitFormProps {
  onClose: () => void;
}

// Same lightweight email shape as the other public forms (RSVP, report/feedback,
// event proposal). The address is optional here, so it is only checked when filled.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white';
const labelClass =
  'mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300';

// Real citizen idea submission (goal Z3) — persists via POST /api/ideas.
// Works without an account; name/email are optional. When logged in they are
// prefilled (and the idea links to the user server-side via the bearer token).
export default function IdeaSubmitForm({ onClose }: IdeaSubmitFormProps) {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ApiProjectCategory | ''>('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string;
    category?: string;
    description?: string;
    email?: string;
  }>({});
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fe: typeof fieldErrors = {};
    if (!title.trim()) fe.title = t('validation.title');
    if (!category) fe.category = t('validation.category');
    if (!description.trim()) fe.description = t('validation.description');
    // Email is optional; validate the format only when something was entered.
    if (email.trim() && !EMAIL_RE.test(email.trim()))
      fe.email = t('validation.email');
    setFieldErrors(fe);
    // The `|| !category` narrows `category` from `'' | ApiProjectCategory` to
    // `ApiProjectCategory` for the submit payload below (the empty default is
    // already reported as a field error above).
    if (Object.keys(fe).length > 0 || !category) return;
    setError('');
    setLoading(true);
    try {
      await submitIdea({
        title: title.trim(),
        description: description.trim(),
        category,
        submitterName: name.trim() || undefined,
        submitterEmail: email.trim() || undefined,
      });
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('participate.submitError')
      );
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="py-8 text-center" role="status" aria-live="polite">
        <CheckCircle2
          size={48}
          className="mx-auto mb-4 text-green-500"
          aria-hidden="true"
        />
        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
          {t('participate.thankYou')}
        </h3>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          {t('participate.submitSuccess')}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-green-700 underline dark:text-green-400"
        >
          {t('common.close')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="idea-title" className={labelClass}>
          {t('participate.ideaTitleLabel')}
        </label>
        <input
          id="idea-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setFieldErrors((fe) => ({ ...fe, title: undefined }));
          }}
          placeholder={t('participate.ideaTitlePlaceholder')}
          aria-invalid={!!fieldErrors.title}
          aria-describedby={fieldErrors.title ? 'idea-title-err' : undefined}
          className={inputClass}
        />
        {fieldErrors.title && (
          <p
            id="idea-title-err"
            role="alert"
            className="mt-1 text-xs text-rose-600 dark:text-rose-400"
          >
            {fieldErrors.title}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="idea-category" className={labelClass}>
          {t('participate.categoryLabel')}
        </label>
        <select
          id="idea-category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value as ApiProjectCategory);
            setFieldErrors((fe) => ({ ...fe, category: undefined }));
          }}
          aria-invalid={!!fieldErrors.category}
          aria-describedby={
            fieldErrors.category ? 'idea-category-err' : undefined
          }
          className={inputClass}
        >
          <option value="" disabled>
            {t('participate.categoryPlaceholder')}
          </option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {t(`projects.category.${c}`)}
            </option>
          ))}
        </select>
        {fieldErrors.category && (
          <p
            id="idea-category-err"
            role="alert"
            className="mt-1 text-xs text-rose-600 dark:text-rose-400"
          >
            {fieldErrors.category}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="idea-message" className={labelClass}>
          {t('participate.yourMessage')}
        </label>
        <textarea
          id="idea-message"
          rows={5}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setFieldErrors((fe) => ({ ...fe, description: undefined }));
          }}
          placeholder={t('participate.messagePlaceholder')}
          aria-invalid={!!fieldErrors.description}
          aria-describedby={
            fieldErrors.description ? 'idea-message-err' : undefined
          }
          className={`${inputClass} resize-none`}
        />
        {fieldErrors.description && (
          <p
            id="idea-message-err"
            role="alert"
            className="mt-1 text-xs text-rose-600 dark:text-rose-400"
          >
            {fieldErrors.description}
          </p>
        )}
      </div>

      {user ? (
        // Logged-in: contact details are taken from the profile, fixed.
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300">
          {t('participate.profileContact', {
            name: user.name,
            email: user.email,
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="idea-name" className={labelClass}>
              {t('participate.yourName')}{' '}
              <span className="font-normal text-gray-400">
                ({t('participate.optionalLabel')})
              </span>
            </label>
            <input
              id="idea-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('participate.namePlaceholder')}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="idea-email" className={labelClass}>
              {t('participate.emailAddress')}{' '}
              <span className="font-normal text-gray-400">
                ({t('participate.optionalLabel')})
              </span>
            </label>
            <input
              id="idea-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors((fe) => ({ ...fe, email: undefined }));
              }}
              placeholder={t('participate.emailPlaceholder')}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={
                fieldErrors.email ? 'idea-email-err' : undefined
              }
              className={inputClass}
            />
            {fieldErrors.email && (
              <p
                id="idea-email-err"
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

      <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
        {t('participate.privacyNote')}
      </p>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-green-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {loading ? t('common.loading') : t('participate.submitButton')}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {t('common.close')}
        </button>
      </div>
    </form>
  );
}

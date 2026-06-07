import { useId, useState, type FormEvent } from 'react';
import { z } from 'zod';
import { Mail, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { trackEvent, ANALYTICS_EVENTS } from '../../services/analytics';

const emailSchema = z.string().email();

/**
 * Newsletter opt-in — UI concept for the stakeholder's "newsletter / update"
 * request. Deliberate design decision: no backend send in the prototype
 * (a real, GDPR-compliant dispatch is Future Work; see docs/handover).
 */
export default function NewsletterSignup() {
  const { t } = useTranslation();
  const fieldId = useId();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = emailSchema.safeParse(email.trim());
    if (!result.success) {
      setError(t('getInvolved.newsletter.invalidEmail'));
      setSubmitted(false);
      return;
    }
    setError(null);
    setSubmitted(true); // prototype only — nothing is stored or sent
    trackEvent(ANALYTICS_EVENTS.newsletterSignup); // conversion (no PII sent)
    setEmail('');
  }

  return (
    <section
      aria-labelledby={`${fieldId}-heading`}
      className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900 sm:p-8"
    >
      <h2
        id={`${fieldId}-heading`}
        className="text-2xl font-bold text-gray-900 dark:text-white"
      >
        {t('getInvolved.newsletter.heading')}
      </h2>
      <p className="mt-2 max-w-2xl text-gray-700 dark:text-gray-300">
        {t('getInvolved.newsletter.intro')}
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-4 flex flex-col gap-3 sm:flex-row"
      >
        <label htmlFor={`${fieldId}-email`} className="sr-only">
          {t('getInvolved.newsletter.emailLabel')}
        </label>
        <input
          id={`${fieldId}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t('getInvolved.newsletter.emailPlaceholder')}
          aria-required="true"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:max-w-xs"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
        >
          <Mail size={16} aria-hidden="true" />
          {t('getInvolved.newsletter.subscribe')}
        </button>
      </form>

      {error && (
        <p
          id={`${fieldId}-error`}
          role="alert"
          className="mt-2 text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      )}
      {submitted && (
        <p
          role="status"
          className="mt-2 flex items-center gap-2 text-sm text-green-700 dark:text-green-400"
        >
          <CheckCircle2 size={16} aria-hidden="true" />
          {t('getInvolved.newsletter.success')}
        </p>
      )}

      <p className="mt-4 text-xs text-amber-700 dark:text-amber-400">
        {t('getInvolved.newsletter.prototypeNotice')}
      </p>
    </section>
  );
}

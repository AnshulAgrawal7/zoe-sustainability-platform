import { useId, useState, type FormEvent } from 'react';
import { z } from 'zod';
import { Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { subscribeNewsletter } from '../../services/newsletterService';
import HoneypotField, { useHoneypot } from '../ui/HoneypotField';
import { useToastStore } from '../../stores/toastStore';

const emailSchema = z.string().email();

// Global footer newsletter opt-in (F1/F3/F4). Records email + locale via the
// backend (F2); PROTOTYPE — no mailing. Confirms with a toast; the demo notice
// makes the no-send behaviour explicit. No double-opt-in/unsubscribe.
export default function FooterNewsletter() {
  const { t, i18n } = useTranslation();
  const fieldId = useId();
  const showToast = useToastStore((s) => s.showToast);
  const [email, setEmail] = useState('');
  const honeypot = useHoneypot();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!emailSchema.safeParse(value).success) {
      setError(t('footer.newsletter.invalidEmail'));
      return;
    }
    setError(null);
    const locale = i18n.language.slice(0, 2);
    try {
      await subscribeNewsletter(value, locale, honeypot.value);
    } catch {
      // Prototype touchpoint — confirm regardless (no real mailing pipeline).
    }
    showToast(t('footer.newsletter.success'));
    setEmail('');
  }

  return (
    <div>
      <h3 className="mb-2 font-semibold text-white">
        {t('footer.newsletter.heading')}
      </h3>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-2 sm:flex-row"
      >
        <HoneypotField {...honeypot.fieldProps} />
        <label htmlFor={`${fieldId}-email`} className="sr-only">
          {t('footer.newsletter.emailLabel')}
        </label>
        <input
          id={`${fieldId}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('footer.newsletter.emailPlaceholder')}
          aria-required="true"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className="w-full rounded-lg border border-green-800 bg-green-900 px-3 py-2 text-sm text-white placeholder-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-green-950"
        >
          <Mail size={15} aria-hidden="true" />
          {t('footer.newsletter.subscribe')}
        </button>
      </form>
      {error && (
        <p
          id={`${fieldId}-error`}
          role="alert"
          className="mt-1.5 text-xs text-red-300"
        >
          {error}
        </p>
      )}
      <p className="mt-2 text-xs text-green-400">
        {t('footer.newsletter.demoNotice')}
      </p>
    </div>
  );
}

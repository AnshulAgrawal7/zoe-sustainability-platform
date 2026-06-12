import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { joinEvent, registerForEvent } from '../../services/eventService';

interface EventRegisterProps {
  eventId: string;
  // The event's own reward (logged-in users earn this on join). Default mirrors
  // the backend EVENT_POINTS fallback.
  rewardPoints?: number;
}

// Event RSVP that works WITHOUT an account to lower the participation barrier:
// logged-in users join in one click and earn the event's points; guests provide
// name + email + consent and earn none.
export default function EventRegister({
  eventId,
  rewardPoints = 200,
}: EventRegisterProps) {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<{ points: number } | null>(null);

  async function submit(asGuest: boolean) {
    setError('');
    setLoading(true);
    try {
      const result = asGuest
        ? await registerForEvent(eventId, {
            guestName: name.trim(),
            guestEmail: email.trim(),
            consent,
          })
        : await joinEvent(eventId);
      if (!asGuest && result.pointsAwarded && user) {
        updateUser({ points: user.points + result.pointsAwarded });
      }
      setDone({ points: result.pointsAwarded });
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('events.rsvp.error'));
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div
        role="status"
        className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300"
      >
        <span className="inline-flex items-center gap-1.5">
          <Check size={16} aria-hidden="true" />
          {t('events.rsvp.success')}
        </span>
        {done.points > 0 && (
          <span className="ml-1 font-semibold">
            {t('events.rsvp.successPoints', { points: done.points })}
          </span>
        )}
      </div>
    );
  }

  // Logged-in → one-click registration.
  if (isAuthenticated) {
    return (
      <div>
        <button
          type="button"
          onClick={() => void submit(false)}
          disabled={loading}
          className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {loading ? (
            <Loader2
              size={14}
              className="motion-safe:animate-spin"
              aria-hidden="true"
            />
          ) : (
            <>
              {t('events.register')}
              <ArrowRight size={14} aria-hidden="true" />
            </>
          )}
        </button>
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          {t('events.rsvp.loginPerk', { points: rewardPoints })}
        </p>
        {error && (
          <p
            role="alert"
            className="mt-1 text-xs text-rose-600 dark:text-rose-400"
          >
            {error}
          </p>
        )}
      </div>
    );
  }

  // Guest → reveal a minimal form (name + email + consent).
  if (!open) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
        >
          {t('events.register')}
          <ArrowRight size={14} aria-hidden="true" />
        </button>
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          {t('events.rsvp.noAccountNote')}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void submit(true);
      }}
      className="max-w-sm space-y-2.5"
    >
      <div>
        <label htmlFor={`rsvp-name-${eventId}`} className="sr-only">
          {t('events.rsvp.guestName')}
        </label>
        <input
          id={`rsvp-name-${eventId}`}
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('events.rsvp.guestName')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div>
        <label htmlFor={`rsvp-email-${eventId}`} className="sr-only">
          {t('events.rsvp.guestEmail')}
        </label>
        <input
          id={`rsvp-email-${eventId}`}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('events.rsvp.guestEmail')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <label className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-green-600 focus-visible:ring-2 focus-visible:ring-green-500"
        />
        <span>{t('events.rsvp.consent')}</span>
      </label>
      {error && (
        <p role="alert" className="text-xs text-rose-600 dark:text-rose-400">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {loading ? (
            <Loader2
              size={14}
              className="motion-safe:animate-spin"
              aria-hidden="true"
            />
          ) : (
            t('events.rsvp.submit')
          )}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="min-h-[44px] rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t('events.rsvp.cancel')}
        </button>
      </div>
    </form>
  );
}

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Check, Loader2, CalendarCheck, X } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useToastStore } from '../../stores/toastStore';
import {
  joinEvent,
  registerForEvent,
  cancelEventRegistration,
} from '../../services/eventService';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface EventRegisterProps {
  eventId: string;
  // The event's own reward (credited AFTER the event is completed). Default
  // mirrors the backend EVENT_POINTS fallback.
  rewardPoints?: number;
  /** True when the logged-in user is already registered (from the API). */
  registered?: boolean;
  /** True when an admin has marked the event COMPLETED. */
  completed?: boolean;
  /** Called after a successful register/cancel so the parent can refetch. */
  onChanged?: () => void;
}

// Event RSVP that works WITHOUT an account to lower the participation barrier:
// guests provide name + email + consent (no points). Logged-in users register
// after an explicit confirmation step, see their registered state on revisit,
// and can cancel any time before the event is completed. Points are pending
// until an admin completes the event.
export default function EventRegister({
  eventId,
  rewardPoints = 20,
  registered = false,
  completed = false,
  onChanged,
}: EventRegisterProps) {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const showToast = useToastStore((s) => s.showToast);

  const [open, setOpen] = useState(false); // guest form
  const [confirming, setConfirming] = useState(false); // logged-in confirm step
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    consent?: string;
  }>({});
  // Local override so the UI flips immediately after register/cancel even
  // before the parent refetches.
  const [localRegistered, setLocalRegistered] = useState<boolean | null>(null);
  const [guestDone, setGuestDone] = useState(false);

  const isRegistered = localRegistered ?? registered;

  async function submit(asGuest: boolean) {
    setError('');
    if (asGuest) {
      const fe: typeof fieldErrors = {};
      if (!name.trim()) fe.name = t('validation.name');
      if (!email.trim() || !EMAIL_RE.test(email.trim()))
        fe.email = t('validation.email');
      if (!consent) fe.consent = t('validation.consent');
      setFieldErrors(fe);
      if (Object.keys(fe).length > 0) return;
    }
    setLoading(true);
    try {
      if (asGuest) {
        await registerForEvent(eventId, {
          guestName: name.trim(),
          guestEmail: email.trim(),
          consent,
        });
        setGuestDone(true);
        setOpen(false);
      } else {
        await joinEvent(eventId);
        setLocalRegistered(true);
        setConfirming(false);
        onChanged?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('events.rsvp.error'));
    } finally {
      setLoading(false);
    }
  }

  async function cancel() {
    setError('');
    setLoading(true);
    try {
      await cancelEventRegistration(eventId);
      setLocalRegistered(false);
      showToast(t('events.rsvp.cancelled'));
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('events.rsvp.error'));
    } finally {
      setLoading(false);
    }
  }

  // --- Completed events: registration is closed. ---
  if (completed) {
    if (isAuthenticated && isRegistered) {
      return (
        <p
          role="status"
          className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300"
        >
          <span className="inline-flex items-center gap-1.5">
            <Check size={16} aria-hidden="true" />
            {t('events.rsvp.attended', { points: rewardPoints })}
          </span>
        </p>
      );
    }
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t('events.rsvp.completedNote')}
      </p>
    );
  }

  // --- Logged-in & already registered → status + cancel. ---
  if (isAuthenticated && isRegistered) {
    return (
      <div className="space-y-2">
        <p
          role="status"
          className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300"
        >
          <span className="inline-flex items-center gap-1.5">
            <CalendarCheck size={16} aria-hidden="true" />
            {t('events.rsvp.registered')}
          </span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t('events.rsvp.pendingNote', { points: rewardPoints })}
        </p>
        <button
          type="button"
          onClick={() => void cancel()}
          disabled={loading}
          className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border border-rose-300 px-4 py-2.5 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:opacity-60 dark:border-rose-700 dark:text-rose-400 dark:hover:bg-rose-900/20"
        >
          {loading ? (
            <Loader2
              size={14}
              className="motion-safe:animate-spin"
              aria-hidden="true"
            />
          ) : (
            <>
              <X size={14} aria-hidden="true" />
              {t('events.rsvp.cancelCta')}
            </>
          )}
        </button>
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

  // --- Logged-in & not registered → register with confirmation step. ---
  if (isAuthenticated) {
    if (confirming) {
      return (
        <div
          role="alertdialog"
          aria-labelledby={`rsvp-confirm-title-${eventId}`}
          aria-describedby={`rsvp-confirm-body-${eventId}`}
          className="space-y-3 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20"
        >
          <p
            id={`rsvp-confirm-title-${eventId}`}
            className="text-sm font-semibold text-gray-900 dark:text-white"
          >
            {t('events.rsvp.confirmTitle')}
          </p>
          <p
            id={`rsvp-confirm-body-${eventId}`}
            className="text-xs leading-relaxed text-gray-600 dark:text-gray-300"
          >
            {t('events.rsvp.confirmBody', { points: rewardPoints })}
          </p>
          {error && (
            <p
              role="alert"
              className="text-xs text-rose-600 dark:text-rose-400"
            >
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void submit(false)}
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
                t('events.rsvp.confirmYes')
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirming(false);
                setError('');
              }}
              className="min-h-[44px] rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {t('events.rsvp.confirmNo')}
            </button>
          </div>
        </div>
      );
    }
    return (
      <div>
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
        >
          {t('events.register')}
          <ArrowRight size={14} aria-hidden="true" />
        </button>
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          {t('events.rsvp.loginPerk', { points: rewardPoints })}
        </p>
      </div>
    );
  }

  // --- Guests ---
  if (guestDone) {
    return (
      <p
        role="status"
        className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300"
      >
        <span className="inline-flex items-center gap-1.5">
          <Check size={16} aria-hidden="true" />
          {t('events.rsvp.success')}
        </span>
      </p>
    );
  }

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
      noValidate
      className="max-w-sm space-y-2.5"
    >
      <div>
        <label htmlFor={`rsvp-name-${eventId}`} className="sr-only">
          {t('events.rsvp.guestName')}
        </label>
        <input
          id={`rsvp-name-${eventId}`}
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setFieldErrors((fe) => ({ ...fe, name: undefined }));
          }}
          placeholder={t('events.rsvp.guestName')}
          aria-invalid={!!fieldErrors.name}
          aria-describedby={
            fieldErrors.name ? `rsvp-name-err-${eventId}` : undefined
          }
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        {fieldErrors.name && (
          <p
            id={`rsvp-name-err-${eventId}`}
            role="alert"
            className="mt-1 text-xs text-rose-600 dark:text-rose-400"
          >
            {fieldErrors.name}
          </p>
        )}
      </div>
      <div>
        <label htmlFor={`rsvp-email-${eventId}`} className="sr-only">
          {t('events.rsvp.guestEmail')}
        </label>
        <input
          id={`rsvp-email-${eventId}`}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setFieldErrors((fe) => ({ ...fe, email: undefined }));
          }}
          placeholder={t('events.rsvp.guestEmail')}
          aria-invalid={!!fieldErrors.email}
          aria-describedby={
            fieldErrors.email ? `rsvp-email-err-${eventId}` : undefined
          }
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        {fieldErrors.email && (
          <p
            id={`rsvp-email-err-${eventId}`}
            role="alert"
            className="mt-1 text-xs text-rose-600 dark:text-rose-400"
          >
            {fieldErrors.email}
          </p>
        )}
      </div>
      <label className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            setFieldErrors((fe) => ({ ...fe, consent: undefined }));
          }}
          aria-invalid={!!fieldErrors.consent}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-green-600 focus-visible:ring-2 focus-visible:ring-green-500"
        />
        <span>{t('events.rsvp.consent')}</span>
      </label>
      {fieldErrors.consent && (
        <p role="alert" className="text-xs text-rose-600 dark:text-rose-400">
          {fieldErrors.consent}
        </p>
      )}
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

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import { ShieldCheck, ShieldOff, ShieldAlert } from 'lucide-react';
import {
  setupTwoFactor,
  enableTwoFactor,
  disableTwoFactor,
  type TwoFactorSetup,
} from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';

// Self-service TOTP two-factor management (Future_Work §2.5). Lives in the
// profile's security section. Especially recommended for admin accounts, but
// available to every user. No third-party service: the QR is rendered locally
// from the otpauth URI the backend returns.
type Phase = 'idle' | 'setup' | 'codes' | 'disabling';

export default function TwoFactorSettings() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [phase, setPhase] = useState<Phase>('idle');
  const [setup, setSetup] = useState<TwoFactorSetup | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [code, setCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const enabled = user?.twoFactorEnabled === true;

  // Render the QR locally whenever a new setup secret arrives.
  useEffect(() => {
    if (!setup?.otpauthUrl) {
      setQrDataUrl('');
      return;
    }
    QRCode.toDataURL(setup.otpauthUrl, { margin: 1, width: 192 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(''));
  }, [setup]);

  async function startSetup() {
    setError('');
    setLoading(true);
    try {
      const data = await setupTwoFactor();
      setSetup(data);
      setPhase('setup');
    } catch {
      setError(t('auth.twoFactorError'));
    } finally {
      setLoading(false);
    }
  }

  async function confirmEnable() {
    setError('');
    setLoading(true);
    try {
      const codes = await enableTwoFactor(code.trim());
      setBackupCodes(codes);
      setPhase('codes');
      setCode('');
      updateUser({ twoFactorEnabled: true });
    } catch (err) {
      const c = err instanceof Error ? err.message : '';
      setError(c === 'INVALID_2FA' ? t('auth.twoFactorInvalid') : t('auth.twoFactorError'));
    } finally {
      setLoading(false);
    }
  }

  async function confirmDisable() {
    setError('');
    setLoading(true);
    try {
      await disableTwoFactor(code.trim());
      updateUser({ twoFactorEnabled: false });
      setPhase('idle');
      setCode('');
      setSetup(null);
    } catch (err) {
      const c = err instanceof Error ? err.message : '';
      setError(c === 'INVALID_2FA' ? t('auth.twoFactorInvalid') : t('auth.twoFactorError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
        {enabled ? (
          <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" aria-hidden="true" />
        ) : (
          <ShieldAlert className="h-5 w-5 text-amber-500" aria-hidden="true" />
        )}
        {t('auth.twoFactorTitle')}
      </h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        {enabled ? t('auth.twoFactorOn') : t('auth.twoFactorIntro')}
      </p>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300"
        >
          {error}
        </div>
      )}

      {/* DISABLED → offer setup */}
      {!enabled && phase === 'idle' && (
        <button
          type="button"
          onClick={startSetup}
          disabled={loading}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {loading ? t('common.loading') : t('auth.twoFactorEnableBtn')}
        </button>
      )}

      {/* SETUP → show QR + secret + confirm code */}
      {!enabled && phase === 'setup' && setup && (
        <div className="space-y-4">
          <ol className="list-decimal space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-300">
            <li>{t('auth.twoFactorStep1')}</li>
            <li>{t('auth.twoFactorStep2')}</li>
          </ol>
          {qrDataUrl && (
            <img
              src={qrDataUrl}
              alt={t('auth.twoFactorQrAlt')}
              width={192}
              height={192}
              className="rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700"
            />
          )}
          <p className="break-all font-mono text-xs text-gray-500 dark:text-gray-400">
            {t('auth.twoFactorSecretLabel')}: {setup.secret}
          </p>
          <div>
            <label
              htmlFor="enable-2fa-code"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t('auth.twoFactorCodeLabel')}
            </label>
            <input
              id="enable-2fa-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-40 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm tracking-widest text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            type="button"
            onClick={confirmEnable}
            disabled={loading || !code.trim()}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {loading ? t('common.loading') : t('auth.twoFactorVerify')}
          </button>
        </div>
      )}

      {/* CODES → show one-time backup codes */}
      {phase === 'codes' && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('auth.twoFactorBackupTitle')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('auth.twoFactorBackupHint')}
          </p>
          <ul className="grid grid-cols-2 gap-2 rounded-lg bg-gray-50 p-3 font-mono text-sm dark:bg-gray-900/40">
            {backupCodes.map((c) => (
              <li key={c} className="text-gray-800 dark:text-gray-200">
                {c}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setPhase('idle')}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
          >
            {t('auth.twoFactorBackupDone')}
          </button>
        </div>
      )}

      {/* ENABLED → offer disable */}
      {enabled && phase !== 'codes' && (
        <div className="space-y-3">
          {phase !== 'disabling' ? (
            <button
              type="button"
              onClick={() => setPhase('disabling')}
              className="inline-flex items-center gap-2 rounded-lg border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-900/20"
            >
              <ShieldOff className="h-4 w-4" aria-hidden="true" />
              {t('auth.twoFactorDisableBtn')}
            </button>
          ) : (
            <div className="space-y-2">
              <label
                htmlFor="disable-2fa-code"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('auth.twoFactorDisablePrompt')}
              </label>
              <input
                id="disable-2fa-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-48 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm tracking-widest text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={confirmDisable}
                  disabled={loading || !code.trim()}
                  className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:opacity-60"
                >
                  {loading ? t('common.loading') : t('auth.twoFactorDisableConfirm')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPhase('idle');
                    setCode('');
                    setError('');
                  }}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

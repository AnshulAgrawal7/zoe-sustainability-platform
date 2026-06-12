import { useTranslation } from 'react-i18next';
import { useLanguageStore, type Language } from '../../stores/languageStore';

type FlagCode = 'gb' | 'gr' | 'de';

// Order left→right: Greek, English, German (A3).
const LANGS: { code: Language; label: string; flag: FlagCode }[] = [
  { code: 'el', label: 'Ελληνικά', flag: 'gr' },
  { code: 'en', label: 'English', flag: 'gb' },
  { code: 'de', label: 'Deutsch', flag: 'de' },
];

/** Small inline SVG flags — render identically on every OS (unlike emoji flags). */
function Flag({ code }: { code: FlagCode }) {
  const common = { width: '100%', height: '100%', preserveAspectRatio: 'none' };
  if (code === 'de') {
    return (
      <svg viewBox="0 0 5 3" {...common} role="presentation">
        <rect width="5" height="3" fill="#000" />
        <rect y="1" width="5" height="1" fill="#D00" />
        <rect y="2" width="5" height="1" fill="#FFCE00" />
      </svg>
    );
  }
  if (code === 'gr') {
    return (
      <svg viewBox="0 0 27 18" {...common} role="presentation">
        <rect width="27" height="18" fill="#fff" />
        {[0, 4, 8, 12, 16].map((y) => (
          <rect key={y} y={y} width="27" height="2" fill="#0D5EAF" />
        ))}
        <rect width="10" height="10" fill="#0D5EAF" />
        <rect x="4" width="2" height="10" fill="#fff" />
        <rect y="4" width="10" height="2" fill="#fff" />
      </svg>
    );
  }
  // gb — simplified Union Jack (recognisable at icon size)
  return (
    <svg viewBox="0 0 60 30" {...common} role="presentation">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0 0 L60 30 M0 30 L60 0" stroke="#fff" strokeWidth="6" />
      <path d="M0 0 L60 30 M0 30 L60 0" stroke="#C8102E" strokeWidth="2" />
      <path d="M30 0 V30 M0 15 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0 V30 M0 15 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

interface LanguageSwitcherProps {
  /** 'sm' for the compact header, 'md' for the mobile menu (larger touch targets). */
  size?: 'sm' | 'md';
}

export default function LanguageSwitcher({
  size = 'sm',
}: LanguageSwitcherProps) {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageStore();

  // Flag-only; the active language is marked with a green pill. `md` (mobile
  // menu) keeps a ≥44px touch target; `sm` (header) is compact.
  const flagBox = size === 'md' ? 'h-5 w-[30px]' : 'h-[15px] w-[22px]';
  const pad =
    size === 'md'
      ? 'min-h-[44px] min-w-[44px] justify-center px-3 py-2'
      : 'px-2 py-1.5';

  return (
    <div
      role="group"
      aria-label={t('common.language')}
      className="inline-flex items-center gap-1 rounded-full bg-gray-100 p-0.5 dark:bg-gray-800"
    >
      {LANGS.map((l) => {
        const active = language === l.code;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLanguage(l.code)}
            aria-pressed={active}
            aria-label={l.label}
            title={l.label}
            className={`inline-flex items-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-900 ${pad} ${
              active ? 'bg-green-600 shadow-sm' : 'opacity-60 hover:opacity-100'
            }`}
          >
            <span
              className={`block ${flagBox} overflow-hidden rounded-[3px] ring-1 ${
                active ? 'ring-white/70' : 'ring-black/10 dark:ring-white/20'
              }`}
            >
              <Flag code={l.flag} />
            </span>
          </button>
        );
      })}
    </div>
  );
}

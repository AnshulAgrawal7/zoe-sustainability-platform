import { useTranslation } from 'react-i18next';
import { useLanguageStore, type Language } from '../../stores/languageStore';

type FlagCode = 'gb' | 'gr' | 'de';

const LANGS: { code: Language; label: string; flag: FlagCode }[] = [
  { code: 'en', label: 'English', flag: 'gb' },
  { code: 'el', label: 'Ελληνικά', flag: 'gr' },
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

  const flagBox = size === 'md' ? 'h-4 w-[24px]' : 'h-[13px] w-[20px]';
  const pad = size === 'md' ? 'px-3 py-2 text-sm' : 'px-2 py-1 text-xs';

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
            className={`inline-flex items-center gap-1.5 rounded-full font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-900 ${pad} ${
              active
                ? 'bg-white text-green-700 shadow-sm dark:bg-gray-700 dark:text-green-400'
                : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <span
              className={`block ${flagBox} overflow-hidden rounded-[3px] ring-1 ${
                active ? 'ring-green-500' : 'ring-black/10 dark:ring-white/20'
              }`}
            >
              <Flag code={l.flag} />
            </span>
            {/* Text code (EN/EL/DE) — clear for sighted users; SR uses aria-label */}
            <span aria-hidden="true">{l.code.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}

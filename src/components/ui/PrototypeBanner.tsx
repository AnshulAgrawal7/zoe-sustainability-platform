import { useTranslation } from 'react-i18next';

export default function PrototypeBanner() {
  const { t } = useTranslation();

  return (
    <div className="bg-amber-50 border-b border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 px-4 py-2 text-center">
      <p className="text-sm text-amber-800 dark:text-amber-300">
        {t('prototype.banner')}
      </p>
    </div>
  );
}

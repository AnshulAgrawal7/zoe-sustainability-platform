import { useTranslation } from 'react-i18next';
import { getSdgByNumber } from '../../data/sdgs';
import type { SDGNumber } from '../../types';

interface SDGBadgeProps {
  number: SDGNumber;
  showTitle?: boolean;
}

export default function SDGBadge({ number, showTitle = false }: SDGBadgeProps) {
  const { t } = useTranslation();
  const sdg = getSdgByNumber(number);
  if (!sdg) return null;
  const title = t(`sdgCatalog.${number}.title`);

  return (
    <span
      title={`SDG ${number}: ${title}`}
      className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold text-white"
      style={{ backgroundColor: sdg.color }}
    >
      <span>SDG {number}</span>
      {showTitle && <span className="font-normal">— {title}</span>}
    </span>
  );
}

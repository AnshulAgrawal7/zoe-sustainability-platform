import { getSdgByNumber } from '../../data/sdgs';
import type { SDGNumber } from '../../types';

interface SDGBadgeProps {
  number: SDGNumber;
  showTitle?: boolean;
}

export default function SDGBadge({ number, showTitle = false }: SDGBadgeProps) {
  const sdg = getSdgByNumber(number);
  if (!sdg) return null;

  return (
    <span
      title={`SDG ${number}: ${sdg.title}`}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold text-white"
      style={{ backgroundColor: sdg.color }}
    >
      <span>SDG {number}</span>
      {showTitle && <span className="font-normal">— {sdg.title}</span>}
    </span>
  );
}

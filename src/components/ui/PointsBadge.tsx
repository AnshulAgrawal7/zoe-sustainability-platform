import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatNumber } from '../../utils/format';

interface PointsBadgeProps {
  /** Numeric points, or a pre-built range string like "20–30". */
  points: number | string;
  /** Prefix the value with "+" (for "you earn …" contexts). */
  showPlus?: boolean;
  /** Styling for the wrapper (controls pill vs. inline look). */
  className?: string;
  iconSize?: number;
}

// ZOE points are represented by a star ★ instead of a "pts"/"points" label.
// The value comes first, then the star (e.g. "+20 ★"); the visible text is
// decorative and the localized aria-label carries the meaning.
export default function PointsBadge({
  points,
  showPlus = false,
  className = '',
  iconSize = 13,
}: PointsBadgeProps) {
  const { t, i18n } = useTranslation();
  const display =
    typeof points === 'number' ? formatNumber(points, i18n.language) : points;
  const label = t('rewards.pointsAria', { points });
  return (
    <span
      // role="img" makes the value+star a single labelled graphic, which is
      // what permits aria-label on this otherwise-generic span (WCAG / ARIA:
      // aria-label is prohibited on a span with no valid role).
      role="img"
      className={`inline-flex items-center gap-1 ${className}`}
      aria-label={label}
      title={label}
    >
      <span aria-hidden="true">
        {showPlus ? '+' : ''}
        {display}
      </span>
      <Star size={iconSize} aria-hidden="true" className="shrink-0" />
    </span>
  );
}

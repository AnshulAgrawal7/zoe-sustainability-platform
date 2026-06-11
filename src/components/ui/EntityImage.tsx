import { useState } from 'react';
import {
  Leaf,
  Bike,
  Users,
  GraduationCap,
  Palette,
  Image as ImageIcon,
} from 'lucide-react';

// Reusable cover/preview image for projects and events. Robust by design:
// when `src` is empty OR the image fails to load (onError), it renders a calm,
// category-coloured placeholder with an icon — never a broken-image symbol.
// The real image carries `alt` (= entity name, WCAG); the placeholder is purely
// decorative (the surrounding card always shows the title as text).

type Variant = { bg: string; icon: string; Icon: React.ElementType };

const CATEGORY_VARIANT: Record<string, Variant> = {
  ENVIRONMENT: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    icon: 'text-green-500/60 dark:text-green-400/50',
    Icon: Leaf,
  },
  MOBILITY: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: 'text-blue-500/60 dark:text-blue-400/50',
    Icon: Bike,
  },
  COMMUNITY: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    icon: 'text-orange-500/60 dark:text-orange-400/50',
    Icon: Users,
  },
  EDUCATION: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    icon: 'text-purple-500/60 dark:text-purple-400/50',
    Icon: GraduationCap,
  },
  CULTURE: {
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    icon: 'text-teal-500/60 dark:text-teal-400/50',
    Icon: Palette,
  },
};

const FALLBACK_VARIANT: Variant = {
  bg: 'bg-gray-100 dark:bg-gray-800',
  icon: 'text-gray-400 dark:text-gray-500',
  Icon: ImageIcon,
};

interface EntityImageProps {
  /** Image URL; null/empty → placeholder. */
  src?: string | null;
  /** Accessible name for the real image (project/event title). */
  alt: string;
  /** Drives the placeholder colour + icon. */
  category?: string;
  /** Sizing/aspect classes for the box, e.g. "h-40 w-full". */
  className?: string;
}

export default function EntityImage({
  src,
  alt,
  category,
  className = '',
}: EntityImageProps) {
  // Track which URL failed (not a boolean): when `src` changes — the box may be
  // reused across a list — a fresh URL no longer matches `failedSrc`, so the next
  // load is attempted automatically without a reset effect.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const variant = (category && CATEGORY_VARIANT[category]) || FALLBACK_VARIANT;
  const { Icon } = variant;

  return (
    <div className={`overflow-hidden ${className}`}>
      {src && failedSrc !== src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailedSrc(src)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className={`flex h-full w-full items-center justify-center ${variant.bg}`}
        >
          <Icon
            className={`h-10 w-10 ${variant.icon}`}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}

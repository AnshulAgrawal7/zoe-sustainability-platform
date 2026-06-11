import { useState } from 'react';
import { projectCategoryVisual } from './categoryVisuals';

// Reusable cover/preview image for projects, events and learning resources.
// When `src` is empty OR the image fails to load (onError), it renders an
// INTENTIONAL category gradient with the category icon — not a flat surface and
// never a broken-image symbol. The real image carries `alt` (= entity name,
// WCAG); the placeholder is decorative (the card always shows the title as text).
// Accent bar, gradient and icon all come from ui/categoryVisuals (one source).

interface EntityImageProps {
  /** Image URL; null/empty → category-gradient placeholder. */
  src?: string | null;
  /** Accessible name for the real image (project/event/resource title). */
  alt: string;
  /** PROJECT_CATEGORIES value — drives the placeholder gradient + icon. */
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
  const { gradient, Icon } = projectCategoryVisual(category ?? '');

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
          className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}
        >
          <Icon
            className="h-10 w-10 text-white/85"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}

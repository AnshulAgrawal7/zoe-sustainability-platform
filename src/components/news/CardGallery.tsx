import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useImageNav } from '../../hooks/useImageNav';
import { feedCategoryVisual } from '../ui/categoryVisuals';
import type { FeedImage } from '../../types';

// Compact image preview for a feed card, coupled to the image COUNT:
//   0 images → intentional category-gradient fallback + icon (no flat surface)
//   1 image  → static image, no navigation controls
//   ≥2 images → one image at a time with clickable prev/next arrows + dots
//               (up to DOTS_MAX), otherwise an "n/total" counter
// Touch-swipe still works (no visible scrollbar). The controls sit above the
// card's stretched title link (z-10), so clicking an arrow/dot/counter never
// triggers navigation to the detail page — only the image/text area does.
const DOTS_MAX = 5;

const ctrl =
  'rounded-full bg-black/50 p-1.5 text-white transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-0';

export default function CardGallery({
  images,
  category,
}: {
  images: FeedImage[];
  category: string;
}) {
  const { t } = useTranslation();
  const { index, goTo, next, prev, touchHandlers } = useImageNav(images.length);

  // 0 images → category gradient + icon (same one source as the rest of the cards).
  if (images.length === 0) {
    const { gradient, Icon } = feedCategoryVisual(category);
    return (
      <div
        aria-hidden="true"
        className={`flex h-48 w-full items-center justify-center bg-gradient-to-br ${gradient}`}
      >
        <Icon
          className="h-10 w-10 text-white/85"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>
    );
  }

  if (images.length === 1) {
    const img = images[0]!;
    return (
      <img
        src={img.url}
        alt={img.alt ?? ''}
        loading="lazy"
        width={img.width ?? undefined}
        height={img.height ?? undefined}
        className="h-48 w-full object-cover"
      />
    );
  }

  const img = images[index] ?? images[0]!;

  return (
    <div
      className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-900"
      {...touchHandlers}
    >
      <img
        src={img.url}
        alt={img.alt ?? ''}
        loading="lazy"
        width={img.width ?? undefined}
        height={img.height ?? undefined}
        className="h-48 w-full object-cover"
      />

      <button
        type="button"
        onClick={prev}
        disabled={index === 0}
        aria-label={t('feed.gallery.prev')}
        className={`absolute left-1.5 top-1/2 z-10 -translate-y-1/2 ${ctrl}`}
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={next}
        disabled={index === images.length - 1}
        aria-label={t('feed.gallery.next')}
        className={`absolute right-1.5 top-1/2 z-10 -translate-y-1/2 ${ctrl}`}
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>

      {images.length <= DOTS_MAX ? (
        <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {images.map((im, i) => (
            <button
              key={im.url}
              type="button"
              onClick={() => goTo(i)}
              aria-label={t('feed.gallery.goTo', { n: i + 1 })}
              aria-current={i === index ? 'true' : undefined}
              className={`h-2 w-2 rounded-full transition ${
                i === index ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      ) : (
        <span className="absolute bottom-2 right-2 z-10 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
          {index + 1}/{images.length}
        </span>
      )}
    </div>
  );
}

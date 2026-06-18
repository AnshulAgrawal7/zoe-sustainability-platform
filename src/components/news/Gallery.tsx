import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Lightbox from './Lightbox';
import type { FeedImage } from '../../types';

// Detail-page thumbnail grid (order as delivered). Clicking a thumbnail opens
// the full-screen Lightbox at that index. Each thumbnail is a real button; its
// aria-label is the resolved alt text (or a generic "open image" when the image
// is decorative), and the inner <img> is alt="" so it is not announced twice.
export default function Gallery({ images }: { images: FeedImage[] }) {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);

  if (images.length === 0) return null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((img, i) => (
          <li key={img.url}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={
                img.alt && img.alt.trim()
                  ? img.alt
                  : t('feed.gallery.open', {
                      current: i + 1,
                      total: images.length,
                    })
              }
              className="group block w-full overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
            >
              <img
                src={img.url}
                alt=""
                loading="lazy"
                decoding="async"
                width={img.width ?? undefined}
                height={img.height ?? undefined}
                className="h-32 w-full object-cover transition-transform group-hover:scale-105 sm:h-40"
              />
            </button>
          </li>
        ))}
      </ul>
      {openIndex !== null && (
        <Lightbox images={images} startIndex={openIndex} onClose={close} />
      )}
    </>
  );
}

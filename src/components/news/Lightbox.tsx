import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useImageNav } from '../../hooks/useImageNav';
import type { FeedImage } from '../../types';

interface LightboxProps {
  images: FeedImage[];
  startIndex: number;
  onClose: () => void;
}

// Full-screen image viewer (detail page only). Accessible dialog: role="dialog"
// + aria-modal, focus moved in on open and restored on close, ESC closes, arrow
// keys + on-screen buttons navigate, backdrop click closes. Body scroll locked
// while open.
export default function Lightbox({
  images,
  startIndex,
  onClose,
}: LightboxProps) {
  const { t } = useTranslation();
  const { index, next, prev, touchHandlers } = useImageNav(
    images.length,
    startIndex
  );
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const multiple = images.length > 1;

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        next();
      } else if (e.key === 'ArrowLeft') {
        prev();
      } else if (e.key === 'Tab') {
        // Trap focus within the dialog.
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled])'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [next, prev, onClose]);

  const img = images[index] ?? images[0]!;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={t('feed.gallery.label')}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
    >
      <button
        ref={closeBtnRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label={t('feed.gallery.close')}
        className="absolute right-3 top-3 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <X size={22} aria-hidden="true" />
      </button>

      <div
        className="relative flex max-h-full max-w-5xl flex-col items-center"
        onClick={(e) => e.stopPropagation()}
        {...touchHandlers}
      >
        <img
          src={img.url}
          alt={img.alt ?? ''}
          decoding="async"
          className="max-h-[80vh] w-auto max-w-full rounded object-contain"
        />
        {multiple && (
          <p className="mt-3 text-sm font-medium text-white/90">
            {t('feed.gallery.counter', {
              current: index + 1,
              total: images.length,
            })}
          </p>
        )}
      </div>

      {multiple && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            disabled={index === 0}
            aria-label={t('feed.gallery.prev')}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-30"
          >
            <ChevronLeft size={26} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            disabled={index === images.length - 1}
            aria-label={t('feed.gallery.next')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-30"
          >
            <ChevronRight size={26} aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}

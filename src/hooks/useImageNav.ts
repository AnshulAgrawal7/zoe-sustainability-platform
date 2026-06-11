import { useCallback, useRef, useState } from 'react';

// Shared image-navigation state for the feed card preview (Phase 1b) and the
// detail-page lightbox (Phase 4): current index, prev/next (clamped, no wrap),
// jump-to, plus touch-swipe handlers so swiping keeps working without a visible
// scrollbar. Preview and lightbox stay functionally separate — they only share
// this index/swipe logic.
export function useImageNav(count: number, initial = 0) {
  const [index, setIndex] = useState(initial);
  const startX = useRef<number | null>(null);

  const clamp = useCallback(
    (i: number) => Math.max(0, Math.min(count - 1, i)),
    [count]
  );
  const goTo = useCallback((i: number) => setIndex(() => clamp(i)), [clamp]);
  const next = useCallback(() => setIndex((i) => clamp(i + 1)), [clamp]);
  const prev = useCallback(() => setIndex((i) => clamp(i - 1)), [clamp]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0]?.clientX ?? null;
  }, []);
  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (startX.current === null) return;
      const endX = e.changedTouches[0]?.clientX ?? startX.current;
      const dx = endX - startX.current;
      startX.current = null;
      const THRESHOLD = 40; // px before a swipe counts
      if (dx <= -THRESHOLD) next();
      else if (dx >= THRESHOLD) prev();
    },
    [next, prev]
  );

  return {
    index,
    goTo,
    next,
    prev,
    touchHandlers: { onTouchStart, onTouchEnd },
  };
}

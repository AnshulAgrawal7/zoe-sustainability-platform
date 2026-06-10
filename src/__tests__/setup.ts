import '@testing-library/jest-dom';
import { configureAxe } from 'jest-axe';

// jsdom lacks matchMedia; themeStore reads it at import time (system theme).
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

configureAxe({
  rules: {
    // Colour-contrast is hard to verify in jsdom (no rendered pixels) — skipped here, checked manually
    'color-contrast': { enabled: false },
  },
});

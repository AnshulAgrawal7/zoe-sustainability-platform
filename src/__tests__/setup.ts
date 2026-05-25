import '@testing-library/jest-dom';
import { configureAxe } from 'jest-axe';

configureAxe({
  rules: {
    // Colour-contrast is hard to verify in jsdom (no rendered pixels) — skipped here, checked manually
    'color-contrast': { enabled: false },
  },
});

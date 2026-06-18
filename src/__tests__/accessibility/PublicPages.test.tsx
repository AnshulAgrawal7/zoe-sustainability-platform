import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  beforeAll,
  afterAll,
  afterEach,
  vi,
  describe,
  test,
  expect,
} from 'vitest';
import type { ComponentType } from 'react';
import { TestWrapper } from '../test-utils';

// Broad WCAG smoke test across ALL top-level public pages (Future_Work §11.1 /
// "jest-axe on all pages"). Data-fetching pages render their offline/fallback
// state here: `fetch` is stubbed to reject, so each page settles deterministically
// without a backend, and axe runs against the resulting DOM.

import LandingPage from '../../pages/LandingPage';
import AboutPage from '../../pages/AboutPage';
import ProjectsPage from '../../pages/ProjectsPage';
import SDGDashboardPage from '../../pages/SDGDashboardPage';
import ParticipationPage from '../../pages/ParticipationPage';
import IdeasPage from '../../pages/IdeasPage';
import LearnPage from '../../pages/LearnPage';
import AudiencesPage from '../../pages/AudiencesPage';
import EventsPage from '../../pages/EventsPage';
import TransparencyPage from '../../pages/TransparencyPage';
import RewardsPage from '../../pages/RewardsPage';
import NewsPage from '../../pages/NewsPage';
import ImprintPage from '../../pages/ImprintPage';
import RegisterPage from '../../pages/auth/RegisterPage';

expect.extend(toHaveNoViolations);

const pages: [string, ComponentType][] = [
  ['LandingPage', LandingPage],
  ['AboutPage', AboutPage],
  ['ProjectsPage', ProjectsPage],
  ['SDGDashboardPage', SDGDashboardPage],
  ['ParticipationPage', ParticipationPage],
  ['IdeasPage', IdeasPage],
  ['LearnPage', LearnPage],
  ['AudiencesPage', AudiencesPage],
  ['EventsPage', EventsPage],
  ['TransparencyPage', TransparencyPage],
  ['RewardsPage', RewardsPage],
  ['NewsPage', NewsPage],
  ['ImprintPage', ImprintPage],
  ['RegisterPage', RegisterPage],
];

beforeAll(() => {
  // Force every API call to fail fast → pages render their fallback/empty state.
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.reject(new Error('offline')))
  );
  // Leaflet measures layout; jsdom has no real box model. A no-op stub keeps
  // map-bearing pages from throwing during render.
  if (!('ResizeObserver' in globalThis)) {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    );
  }
});

afterEach(() => vi.clearAllMocks());
afterAll(() => vi.unstubAllGlobals());

describe('public pages have no accessibility violations', () => {
  test.each(pages)('%s', async (_name, Page) => {
    const { container } = render(
      <TestWrapper>
        <Page />
      </TestWrapper>
    );
    // Let pending fallbacks resolve before auditing.
    await new Promise((r) => setTimeout(r, 0));
    expect(await axe(container)).toHaveNoViolations();
  });
});

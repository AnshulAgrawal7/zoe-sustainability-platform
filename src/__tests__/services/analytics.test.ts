import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

/**
 * The analytics service reads import.meta.env at call time, so we stub env per
 * test and reset modules to clear the one-shot "script injected" flag.
 */
describe('analytics service', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    document.head.innerHTML = '';
    delete window.plausible;
    delete window.umami;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('is disabled and no-ops when no provider env is set', async () => {
    const a = await import('../../services/analytics');
    expect(a.isAnalyticsEnabled()).toBe(false);

    a.loadAnalytics();
    expect(document.querySelector('script')).toBeNull();

    expect(() =>
      a.trackEvent(a.ANALYTICS_EVENTS.ctaExploreProjects)
    ).not.toThrow();
    expect(window.plausible).toBeUndefined();
  });

  it('stays disabled when Plausible domain is missing', async () => {
    vi.stubEnv('VITE_ANALYTICS_PROVIDER', 'plausible');
    const a = await import('../../services/analytics');
    expect(a.isAnalyticsEnabled()).toBe(false);
  });

  it('injects the Plausible script and forwards events when configured', async () => {
    vi.stubEnv('VITE_ANALYTICS_PROVIDER', 'plausible');
    vi.stubEnv('VITE_ANALYTICS_DOMAIN', 'zoe-corfu-demo.org');
    const a = await import('../../services/analytics');
    expect(a.isAnalyticsEnabled()).toBe(true);

    a.loadAnalytics();
    const script = document.querySelector('script');
    expect(script).not.toBeNull();
    expect(script?.getAttribute('data-domain')).toBe('zoe-corfu-demo.org');
    expect(script?.src).toContain('plausible.io/js/script.js');

    // Swap the queue stub for a spy to assert correct forwarding shape.
    const spy = vi.fn();
    window.plausible = spy as unknown as typeof window.plausible;
    a.trackEvent(a.ANALYTICS_EVENTS.ctaExploreProjects);
    a.trackEvent(a.ANALYTICS_EVENTS.ideaSubmitted, { type: 'submit-idea' });

    expect(spy).toHaveBeenCalledWith('CTA: Explore Projects', undefined);
    expect(spy).toHaveBeenCalledWith('Idea Submitted', {
      props: { type: 'submit-idea' },
    });
  });

  it('injects the script only once', async () => {
    vi.stubEnv('VITE_ANALYTICS_PROVIDER', 'plausible');
    vi.stubEnv('VITE_ANALYTICS_DOMAIN', 'zoe-corfu-demo.org');
    const a = await import('../../services/analytics');
    a.loadAnalytics();
    a.loadAnalytics();
    expect(document.querySelectorAll('script').length).toBe(1);
  });

  it('supports Umami with website id + src', async () => {
    vi.stubEnv('VITE_ANALYTICS_PROVIDER', 'umami');
    vi.stubEnv('VITE_ANALYTICS_WEBSITE_ID', 'abc-123');
    vi.stubEnv('VITE_ANALYTICS_SRC', 'https://analytics.example.org/script.js');
    const a = await import('../../services/analytics');
    expect(a.isAnalyticsEnabled()).toBe(true);

    a.loadAnalytics();
    const script = document.querySelector('script');
    expect(script?.getAttribute('data-website-id')).toBe('abc-123');

    const track = vi.fn();
    window.umami = { track };
    a.trackEvent(a.ANALYTICS_EVENTS.newsletterSignup);
    expect(track).toHaveBeenCalledWith('Newsletter Signup', undefined);
  });
});

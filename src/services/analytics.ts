/**
 * Privacy-friendly, cookieless web analytics — DISABLED BY DEFAULT.
 *
 * Activated only when the operator sets the analytics env vars at build time
 * (see `.env.example` and `docs/deployment/analytics.md`). With no env set,
 * every function here is a no-op, so the prototype ships zero tracking and
 * needs no cookie-consent banner (Szenario A).
 *
 * Supported providers (both cookieless, GDPR-friendly, EU hosting available):
 *   - Plausible  → VITE_ANALYTICS_PROVIDER=plausible + VITE_ANALYTICS_DOMAIN
 *   - Umami      → VITE_ANALYTICS_PROVIDER=umami + VITE_ANALYTICS_WEBSITE_ID + VITE_ANALYTICS_SRC
 *
 * Page views (incl. SPA route changes) are tracked automatically by the
 * provider script via the History API. This module adds the script and the
 * custom *conversion* events (the "… and then do XY" funnel).
 */

type Provider = 'plausible' | 'umami';

type EventProps = Record<string, string | number | boolean>;

interface PlausibleFn {
  (event: string, options?: { props?: EventProps }): void;
  q?: unknown[][];
}

interface UmamiApi {
  track: (event: string, data?: EventProps) => void;
}

declare global {
  interface Window {
    plausible?: PlausibleFn;
    umami?: UmamiApi;
  }
}

interface AnalyticsConfig {
  provider: Provider;
  src: string;
  domain?: string;
  websiteId?: string;
}

/** Stable names for the conversion events we care about (the funnel). */
export const ANALYTICS_EVENTS = {
  ctaExploreProjects: 'CTA: Explore Projects',
  ctaGetInvolved: 'CTA: Get Involved',
  ctaSubmitIdea: 'CTA: Submit Idea',
  ctaJoinEvent: 'CTA: Join Event',
  ctaSeeImpact: 'CTA: See Impact',
  ideaSubmitted: 'Idea Submitted',
  newsletterSignup: 'Newsletter Signup',
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function readConfig(): AnalyticsConfig | null {
  const env = import.meta.env;
  const provider = str(env['VITE_ANALYTICS_PROVIDER']).toLowerCase();

  if (provider === 'plausible') {
    const domain = str(env['VITE_ANALYTICS_DOMAIN']);
    if (!domain) return null;
    const src =
      str(env['VITE_ANALYTICS_SRC']) || 'https://plausible.io/js/script.js';
    return { provider, src, domain };
  }

  if (provider === 'umami') {
    const websiteId = str(env['VITE_ANALYTICS_WEBSITE_ID']);
    const src = str(env['VITE_ANALYTICS_SRC']);
    if (!websiteId || !src) return null;
    return { provider, src, websiteId };
  }

  return null;
}

/** True when analytics env vars are present and complete. */
export function isAnalyticsEnabled(): boolean {
  return readConfig() !== null;
}

let scriptInjected = false;

/**
 * Inject the provider script once. Safe to call unconditionally on startup:
 * does nothing when analytics are not configured or already loaded, or when
 * there is no DOM (tests / SSR).
 */
export function loadAnalytics(): void {
  if (scriptInjected) return;
  if (typeof document === 'undefined') return;
  const config = readConfig();
  if (!config) return;
  scriptInjected = true;

  const script = document.createElement('script');
  script.defer = true;
  script.src = config.src;

  if (config.provider === 'plausible') {
    script.setAttribute('data-domain', config.domain ?? '');
    // Queue stub: events fired before the script finishes loading are buffered
    // and flushed once it is ready (Plausible's recommended snippet).
    if (!window.plausible) {
      const stub = ((...args: unknown[]) => {
        (stub.q = stub.q ?? []).push(args);
      }) as PlausibleFn;
      window.plausible = stub;
    }
  } else {
    script.setAttribute('data-website-id', config.websiteId ?? '');
  }

  document.head.appendChild(script);
}

/**
 * Record a custom conversion event. No-op when analytics are disabled.
 * Never send personal data in `props` — keep it to aggregate dimensions.
 */
export function trackEvent(name: string, props?: EventProps): void {
  if (typeof window === 'undefined') return;
  const config = readConfig();
  if (!config) return;

  if (config.provider === 'plausible') {
    window.plausible?.(name, props ? { props } : undefined);
  } else {
    window.umami?.track(name, props);
  }
}

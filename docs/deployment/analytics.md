# Web Analytics & Monitoring — ZOE (Szenario A)

> Goal: understand **how many people visit the site** and **how many of them go
> on to do XY** (the conversion funnel), **without** cookies, without collecting
> personal data, and **without** a consent banner — so the prototype stays
> GDPR-light and faithful to Szenario A.
> ⚠️ Not legal advice. Status: 2026-06-07.

## TL;DR

- Analytics are **disabled by default**. With no env vars set, the app ships
  **zero tracking** and needs **no cookie-consent banner**.
- To enable, set a few `VITE_ANALYTICS_*` variables in the **frontend host**
  (Vercel) and redeploy. Recommended provider: **Plausible** (cookieless, EU).
- Page views (incl. SPA route changes) are tracked automatically by the provider
  script. We additionally send a small set of **custom conversion events**
  (the funnel) — see [Tracked events](#tracked-events).

---

## Why cookieless (and why no consent banner)

Under the GDPR/ePrivacy regime, a consent banner is generally required when you
**store or read information on the user's device** (cookies, localStorage for
tracking) or process **personal data** such as full IP addresses. Privacy-first
analytics avoid all of that:

- **no cookies / no localStorage** for tracking,
- **no cross-site / cross-session identifiers**,
- only **aggregated, anonymous** counts (page views, event counts),
- IPs (if seen at all) are hashed/discarded server-side, not stored.

This keeps Szenario A clean: a public **prototype** demo with **no real personal
data**. The privacy page already documents this (cookieless analytics + named
processors). Always have the final setup reviewed before a real launch.

---

## Provider comparison

| Criterion | **Plausible** (recommended) | **Umami** | **Vercel Web Analytics** |
|---|---|---|---|
| Cookieless / no consent banner | ✅ | ✅ | ✅ |
| EU hosting | ✅ Cloud is EU (Germany) | ✅ if self-hosted in EU | ⚠️ provider-dependent |
| Custom events (funnels/goals) | ✅ goals + funnels | ✅ events | ✅ custom events (Pro for some) |
| Self-hostable (free) | ✅ (also paid Cloud) | ✅ fully free, OSS | ❌ |
| Setup effort | very low (Cloud) | low–medium (host Umami + DB) | lowest **if** hosting on Vercel |
| Cost | paid Cloud / free self-host | free (your infra) | free tier + paid |
| DPA available | ✅ | n/a (you are the processor) | ✅ |
| Best when… | you want EU SaaS + funnels, minimal ops | you already run a DB and want $0 SaaS | you deploy on Vercel and want one click |

**Recommendation for this project: Plausible.** Cookieless, EU-hosted, has a DPA,
and supports **goals + funnels** out of the box, which is exactly the
"landing → does XY" question. Umami is the best $0 option if the operator is
comfortable self-hosting (it pairs naturally with the Supabase Postgres already
planned in `to-do.md`). Vercel Web Analytics is the least-effort choice **if** the
frontend is hosted on Vercel and a funnel across custom events is not required.

> The code supports **Plausible and Umami** today (env-switchable). Vercel
> Analytics would be a small additive integration (`@vercel/analytics`) if the
> operator later prefers it — documented as Future Work.

---

## Setup

All variables go in the **frontend host** (Vercel) as build-time env vars and
require a redeploy to take effect. Leave them empty to keep analytics off.

### Option A — Plausible Cloud (fastest)
1. Create an account at <https://plausible.io>, add your site (the domain you
   will serve the demo on, e.g. `zoe-corfu-demo.org`).
2. Set in the frontend host:
   ```
   VITE_ANALYTICS_PROVIDER=plausible
   VITE_ANALYTICS_DOMAIN=zoe-corfu-demo.org
   # VITE_ANALYTICS_SRC defaults to https://plausible.io/js/script.js
   ```
3. Conclude the **DPA** in the Plausible dashboard and name Plausible as a
   processor in the privacy page (the section already exists; fill in details).
4. Redeploy. Open the site, then check the Plausible dashboard for live visitors.

### Option B — Plausible self-hosted / Umami
- **Plausible self-hosted:** same vars as above, but point `VITE_ANALYTICS_SRC`
  at your instance, e.g. `https://analytics.example.org/js/script.js`.
- **Umami:** host Umami (Docker) against a Postgres DB (e.g. a second Supabase
  project), create a website, then set:
  ```
  VITE_ANALYTICS_PROVIDER=umami
  VITE_ANALYTICS_WEBSITE_ID=<your-website-id>
  VITE_ANALYTICS_SRC=https://analytics.example.org/script.js
  ```

---

## Tracked events

Page views are automatic (provider script via the History API). On top of that,
the app sends these **custom conversion events** — defined once in
`src/services/analytics.ts` (`ANALYTICS_EVENTS`) and fired at the funnel points:

| Event name | Fired when | Where |
|---|---|---|
| `CTA: Explore Projects` | hero "Explore Projects" clicked | `LandingPage` |
| `CTA: Get Involved` | hero "Get Involved" clicked | `LandingPage` |
| `CTA: Submit Idea` | bottom CTA "Submit an Idea" clicked | `LandingPage` |
| `CTA: Join Event` | bottom CTA "Join an Event" clicked | `LandingPage` |
| `CTA: See Impact` | bottom CTA "See Impact Data" clicked | `LandingPage` |
| `Idea Submitted` | participation form submitted (prop: `type`) | `ParticipationPage` |
| `Newsletter Signup` | newsletter opt-in submitted | `NewsletterSignup` |

**No personal data is ever sent.** Only the event name and—at most—a coarse
dimension (e.g. the participation `type`, never the name/email/message).

### Building the funnel
The headline question — *"how many land on the homepage and then do XY"* — is:

```
pageview "/"  →  CTA: * (or Idea Submitted / Newsletter Signup)
```

- **Plausible:** add each event above as a **Goal**, then create a **Funnel**
  starting from the `/` pageview to the goal(s). The conversion rate is shown
  directly.
- **Umami:** the events appear under the website's **Events**; use the funnel
  report with the `/` URL step followed by the event step.

### Adding a new event
1. Add a stable name to `ANALYTICS_EVENTS` in `src/services/analytics.ts`.
2. Call `trackEvent(ANALYTICS_EVENTS.yourEvent)` at the interaction (keep props
   free of personal data).
3. Register it as a Goal in the provider dashboard.

---

## What is intentionally NOT tracked (Szenario A)
- No cookies, no fingerprinting, no cross-site identifiers.
- No personal data in event properties (no names, emails, free-text messages).
- No server-side product analytics / session replay.
- No analytics at all unless the operator explicitly configures it.

→ Server uptime/error monitoring, log retention and backups are operational
concerns for a real launch (Szenario B / Future Work), not part of A.

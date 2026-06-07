# Go-Live Vorbereitung — Progress Log (Iteration 9)

> In-Repo-Fortschrittsnotiz für den autonomen „Szenario A übergabe-bereit machen"-Lauf.
> Branch: `claude/nightly-run` · Start: 2026-06-07 · zugehörig: [`to-do.md`](../../to-do.md), [`handover-szenario-a.md`](handover-szenario-a.md).
> Legende: ✅ fertig · 🔨 in Arbeit · ⏳ offen

## Aufgaben (🤖 im Repo vorbereitbar)

| # | Aufgabe | Status |
|---|---|---|
| 17 | Rechtsseiten: Impressum + Datenschutz-Ausbau (EN/EL/DE, Platzhalter, Prototyp-Disclaimer, Supabase/DeepL als Auftragsverarbeiter) | ✅ |
| 18 | Datenschutzfreundliche, cookielose Analytics (env-gesteuert, default off) + Funnel-/Conversion-Events + `docs/deployment/analytics.md` | ✅ |
| 19 | Prod-Härtung: sichere Cookies (`secure`/`SameSite`) in Prod, Prod-`.env.example`, `render.yaml`, Deploy-/Migrations-Doku | ⏳ |
| 20 | Abgeschlossene Projekte: `imageUrl` (additiv), Backend create/update, Admin-Formular, ProjectsPage Statusfilter + Bildanzeige | ⏳ |
| 21 | DEVLOG Iteration 9 + `to-do.md` 🤖-Häkchen, `.gitignore`-Sweep, Merge `claude/nightly-run` → `main`, Push | ⏳ |

## Grenzen / Invarianten
- Rein **additiv**, nichts Bestehendes brechen; Tests bleiben grün (Frontend 15/15, Backend 37/37).
- Keine Secrets ins Repo (DeepL-Key, Connection-Strings nur in `.env`).
- Prototyp-Banner bleibt; keine echten personenbezogenen Daten; keine FB-Inhalte.
- Analytics: **cookielos**, kein Consent-Banner nötig, **default deaktiviert** (nur aktiv, wenn ENV gesetzt).

## Verlauf
- 2026-06-07 — Start, Recon abgeschlossen (authController-Cookies, Footer, Router, schema.prisma, LandingPage-WIP = i18n-Konvertierung). Beginn #17.
- 2026-06-07 — **#17 ✅**: `ImprintPage.tsx` (Impressum-Template mit Platzhaltern, Prototyp-Disclaimer, Haftungs-/Urheberrecht-Abschnitte) unter `/imprint`; Footer-Link `footer.imprint`; PrivacyPage um **Webanalyse** (cookielos, default off) + **Auftragsverarbeiter** (Supabase, DeepL, EU-Region) erweitert; neuer `imprint`-Namespace (25 Keys) + 4 neue `privacy`-Keys + `nav.imprint` in EN/EL/DE (Parität geprüft). LandingPage-i18n separat committet. Frontend 15/15, tsc grün.
- 2026-06-07 — **#18 ✅**: `src/services/analytics.ts` — cookieloser, env-gesteuerter Analytics-Service (Plausible + Umami), **default deaktiviert** (no-op ohne ENV → kein Cookie-Banner). `loadAnalytics()` in `main.tsx`; Provider-Skript trackt Pageviews automatisch (History API). Conversion-Events (`ANALYTICS_EVENTS`) an den Funnel-Punkten: Landing-Hero-CTAs + Bottom-CTAs, `Idea Submitted` (ParticipationPage, nur `type`, keine PII), `Newsletter Signup`. Env-Vars in `.env.example`. Doku `docs/deployment/analytics.md` (Plausible vs Umami vs Vercel, Funnel-Aufbau, getrackte Events). Test `analytics.test.ts` (5). Frontend **20/20**, tsc + build grün.

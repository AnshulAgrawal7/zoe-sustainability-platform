import { useState, useEffect } from 'react';
import Container from '../components/layout/Container';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Leaf,
  Users,
  BarChart3,
  ArrowRight,
  Waves,
  TreePine,
  Recycle,
  GraduationCap,
  Eye,
  CheckCircle2,
  CalendarDays,
  Lightbulb,
} from 'lucide-react';
import { projects } from '../data/projects';
import { LANDING_FACTS } from '../data/landingFacts';
import logoGemeinde from '../assets/logo-gemeinde-korfu.png';
import { formatNumber } from '../utils/format';
import StatusBadge from '../components/ui/StatusBadge';
import FeedCard from '../components/news/FeedCard';
import EntityImage from '../components/ui/EntityImage';
import { getFeed } from '../services/feedService';
import { getEvents } from '../services/eventService';
import { getProjects } from '../services/projectService';
import { getPublicIdeas } from '../services/ideaService';
import { getLearningResources } from '../services/learnService';
import { trackEvent, ANALYTICS_EVENTS } from '../services/analytics';
import type {
  FeedItem,
  ApiEvent,
  ApiProject,
  PublicIdea,
  LearningResource,
} from '../types';

const highlights = projects.filter((p) => p.status === 'Active').slice(0, 3);

// Addressed SDGs (B3) — derived from the project data (single source of truth),
// shown as an icon row that links to the internal SDG page.
const addressedSdgs = Array.from(new Set(projects.flatMap((p) => p.sdgs))).sort(
  (a, b) => a - b
);

function sdgIconPath(n: number): string {
  return `/sdg-icons/E-WEB-Goal-${String(n).padStart(2, '0')}.png`;
}

const DATE_LOCALES: Record<string, string> = {
  en: 'en-GB',
  el: 'el-GR',
  de: 'de-DE',
};

// A normalised tile for the "Get involved now" section: upcoming events first,
// then OPEN projects fill the remaining slots.
interface EngageItem {
  key: string;
  to: string;
  kind: 'event' | 'project';
  title: string;
  category: string;
  imageUrl: string | null;
  date?: string;
}

const categoryIcons: Record<string, React.ElementType> = {
  Biodiversity: TreePine,
  'Circular Economy': Recycle,
  'Waste Reduction': Recycle,
  Education: GraduationCap,
  'Water Protection': Waves,
  'Sustainable Tourism': Leaf,
  'Community Action': Users,
};

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2);
  const [feedTeaser, setFeedTeaser] = useState<FeedItem[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<ApiEvent[]>([]);
  const [openProjects, setOpenProjects] = useState<ApiProject[]>([]);
  const [communityIdeas, setCommunityIdeas] = useState<PublicIdea[]>([]);
  const [learnResources, setLearnResources] = useState<LearningResource[]>([]);

  useEffect(() => {
    // "Get involved now": upcoming events (date asc from the API) take priority,
    // OPEN projects fill the rest. Both calls are public; failures degrade to empty.
    getEvents({ upcoming: true })
      .then((events) => setUpcomingEvents(events))
      .catch(() => setUpcomingEvents([]));
    getProjects({ status: 'OPEN', limit: 4 })
      .then((data) => setOpenProjects(data.projects))
      .catch(() => setOpenProjects([]));
    // New sections: approved community ideas (Z3) + learning resources (Z5).
    getPublicIdeas()
      .then((ideas) => setCommunityIdeas(ideas.slice(0, 3)))
      .catch(() => setCommunityIdeas([]));
    getLearningResources()
      .then((res) => setLearnResources(res.slice(0, 3)))
      .catch(() => setLearnResources([]));
  }, []);

  // "What's new" teaser = top 3 of the merged feed, refetched on locale change.
  useEffect(() => {
    let cancelled = false;
    getFeed(lang)
      .then((items) => {
        if (!cancelled) setFeedTeaser(items.slice(0, 3));
      })
      .catch(() => {
        if (!cancelled) setFeedTeaser([]);
      });
    return () => {
      cancelled = true;
    };
  }, [lang]);

  // Illustrative demo figures for the stats banner (B2). Numbers are raw in
  // data/landingFacts.ts and formatted to the active locale here via Intl, so the
  // thousands separator follows the language (DE/EL "2.389" vs EN "2,389").
  const facts = LANDING_FACTS.map((f) => ({
    key: f.key,
    value: formatNumber(f.value, i18n.language, { maximumFractionDigits: 0 }),
    label: t(f.labelKey),
  }));

  function pickLang(en: string, el: string, de: string): string {
    if (lang === 'el') return el;
    if (lang === 'de') return de;
    return en;
  }

  const engageItems: EngageItem[] = [
    ...upcomingEvents.map<EngageItem>((e) => ({
      key: `event-${e.id}`,
      to: '/events',
      kind: 'event',
      title: pickLang(e.titleEn, e.titleEl, e.titleDe),
      category: e.category,
      imageUrl: e.imageUrl,
      date: e.date,
    })),
    ...openProjects.map<EngageItem>((p) => ({
      key: `project-${p.id}`,
      to: `/projects/${p.id}`,
      kind: 'project',
      title: pickLang(p.titleEn, p.titleEl, p.titleDe),
      category: p.category,
      imageUrl: p.imageUrl,
    })),
  ].slice(0, 3);

  const engageViewAll = upcomingEvents.length > 0 ? '/events' : '/projects';

  const pillars = [
    {
      icon: Eye,
      titleKey: 'landing.pillars.transparency.title',
      descKey: 'landing.pillars.transparency.description',
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400',
    },
    {
      icon: Users,
      titleKey: 'landing.pillars.participation.title',
      descKey: 'landing.pillars.participation.description',
      color: 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400',
    },
    {
      icon: BarChart3,
      titleKey: 'landing.pillars.impact.title',
      descKey: 'landing.pillars.impact.description',
      color: 'text-teal-600 bg-teal-50 dark:bg-teal-950 dark:text-teal-400',
    },
  ];

  const ctaButtons = [
    {
      labelKey: 'landing.cta.submitIdea',
      to: '/participate',
      event: ANALYTICS_EVENTS.ctaSubmitIdea,
    },
    {
      labelKey: 'landing.cta.joinEvent',
      to: '/events',
      event: ANALYTICS_EVENTS.ctaJoinEvent,
    },
    {
      labelKey: 'landing.cta.seeImpact',
      to: '/transparency',
      event: ANALYTICS_EVENTS.ctaSeeImpact,
    },
  ];

  return (
    <div>
      {/* Hero — compact (Part 2A): lower padding so the next section peeks in */}
      <section className="bg-gradient-to-br from-green-700 via-green-600 to-teal-600 text-white">
        <Container className="py-12 sm:py-16">
          {/* Municipality crest — large, centered, on a clean light card ABOVE
              the headline. The artwork is dark-on-transparent, so it needs a
              light surface to stay legible on the green hero gradient. The alt
              text carries the municipality name the crest stands for. */}
          <div className="mb-8 flex justify-center sm:mb-10">
            <div className="rounded-2xl bg-white px-8 py-5 shadow-lg ring-1 ring-black/5 sm:px-10 sm:py-6">
              <img
                src={logoGemeinde}
                alt={t('landing.hero.badge')}
                className="h-16 w-auto sm:h-24 lg:h-32"
              />
            </div>
          </div>
          <div className="max-w-3xl">
            <h1 className="mb-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
              {t('landing.hero.title')}
            </h1>
            <p className="mb-6 max-w-2xl text-lg leading-relaxed text-green-100">
              {t('landing.hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/projects"
                onClick={() => trackEvent(ANALYTICS_EVENTS.ctaExploreProjects)}
                className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-green-700 transition-colors hover:bg-green-50"
              >
                {t('landing.hero.exploreProjects')}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                to="/participate"
                onClick={() => trackEvent(ANALYTICS_EVENTS.ctaGetInvolved)}
                className="rounded-lg border-2 border-white/60 px-6 py-3 font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
              >
                {t('landing.hero.getInvolved')}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured projects */}
      <section className="bg-white py-10 dark:bg-gray-900">
        <Container>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                {t('landing.featured.heading')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t('landing.featured.subheading')}
              </p>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 whitespace-nowrap font-semibold text-green-700 transition-colors hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
            >
              {t('landing.featured.viewAll')}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {highlights.map((project) => {
              const Icon = categoryIcons[project.category] ?? Leaf;
              return (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-green-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-600"
                >
                  <div
                    className={`h-3 ${project.thumbnailColor}`}
                    aria-hidden="true"
                  />
                  <div className="p-5">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Icon size={16} aria-hidden="true" />
                        <span className="text-xs">{project.category}</span>
                      </div>
                      <StatusBadge status={project.status} />
                    </div>
                    <h3 className="mb-2 font-semibold text-gray-900 transition-colors group-hover:text-green-700 dark:text-white dark:group-hover:text-green-400">
                      {project.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {project.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Get involved now — upcoming events first, then OPEN projects. Placed
          here so participation is the first action after the intro sections. */}
      {engageItems.length > 0 && (
        <section
          aria-labelledby="engage-heading"
          className="bg-gray-50 py-10 dark:bg-gray-800"
        >
          <Container>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2
                  id="engage-heading"
                  className="mb-2 flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-white"
                >
                  <CalendarDays
                    size={26}
                    aria-hidden="true"
                    className="text-green-600 dark:text-green-400"
                  />
                  {t('landing.engage.heading')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('landing.engage.subheading')}
                </p>
              </div>
              <Link
                to={engageViewAll}
                className="inline-flex items-center gap-2 whitespace-nowrap font-semibold text-green-700 transition-colors hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
              >
                {t('landing.engage.viewAll')}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {engageItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.to}
                  className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-green-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-600"
                >
                  <EntityImage
                    src={item.imageUrl}
                    alt={item.title}
                    category={item.category}
                    className="h-32 w-full"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-800 dark:bg-green-900/40 dark:text-green-300">
                        {item.kind === 'event'
                          ? t('landing.engage.eventLabel')
                          : t('landing.engage.projectLabel')}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        {t(`projects.category.${item.category}`)}
                      </span>
                    </div>
                    <h3 className="mb-2 line-clamp-2 text-base font-bold text-gray-900 transition-colors group-hover:text-green-700 dark:text-white dark:group-hover:text-green-400">
                      {item.title}
                    </h3>
                    {item.date && (
                      <p className="mb-3 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <CalendarDays size={13} aria-hidden="true" />
                        {new Date(item.date).toLocaleDateString(
                          DATE_LOCALES[lang] ?? 'en-GB',
                          { weekday: 'short', day: 'numeric', month: 'long' }
                        )}
                      </p>
                    )}
                    <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                      {item.kind === 'event'
                        ? t('landing.engage.eventCta')
                        : t('landing.engage.projectCta')}
                      <ArrowRight size={12} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Headline figures — green banner (B2). Slimmer than the hero. The three
          values are DELIBERATELY FICTIONAL demo data (see microcopy). */}
      <section
        className="bg-gradient-to-br from-green-700 via-green-600 to-teal-600 text-white"
        aria-label={t('landing.statsAria')}
      >
        <Container maxW="5xl" className="py-8">
          <h2 className="mb-6 text-center text-2xl font-bold text-white">
            {t('landing.stats.heading')}
          </h2>
          <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.key}>
                <p className="text-3xl font-bold text-white sm:text-4xl">
                  {f.value}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-green-100">
                  {f.label}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-green-100/80">
            {t('landing.stats.disclaimer')}
          </p>
        </Container>
      </section>

      {/* Addressed SDGs — icon row linking to the internal SDG page (B3) */}
      {addressedSdgs.length > 0 && (
        <section
          aria-labelledby="landing-sdgs-heading"
          className="bg-gray-50 py-10 dark:bg-gray-800"
        >
          <Container>
            <h2
              id="landing-sdgs-heading"
              className="mb-2 text-center text-xl font-bold text-gray-900 dark:text-white"
            >
              {t('landing.sdgs.heading')}
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-center text-sm text-gray-600 dark:text-gray-400">
              {t('landing.sdgs.subheading')}
            </p>
            <ul className="flex flex-wrap justify-center gap-3">
              {addressedSdgs.map((n) => (
                <li key={n}>
                  <Link
                    to={`/sdg-dashboard#sdg-${n}`}
                    aria-label={t('projects.sdgLinkAria', { n })}
                    className="block h-14 w-14 overflow-hidden rounded-lg transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 motion-safe:hover:scale-105 sm:h-16 sm:w-16"
                  >
                    <img
                      src={sdgIconPath(n)}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="h-full w-full"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* What's new — merged feed teaser */}
      {feedTeaser.length > 0 && (
        <section className="bg-white py-10 dark:bg-gray-900">
          <Container>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {t('landing.news.heading')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('landing.news.subheading')}
                </p>
              </div>
              <Link
                to="/news"
                className="inline-flex items-center gap-2 whitespace-nowrap font-semibold text-green-700 transition-colors hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
              >
                {t('landing.news.viewAll')}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {feedTeaser.map((item) => (
                <FeedCard key={`${item.source}-${item.id}`} item={item} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Learn & discover — locally-grounded educational content (Z5) */}
      {learnResources.length > 0 && (
        <section className="bg-gray-50 py-10 dark:bg-gray-800">
          <Container>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="mb-2 flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-white">
                  <GraduationCap
                    size={24}
                    aria-hidden="true"
                    className="text-green-600 dark:text-green-400"
                  />
                  {t('landing.learnSection.heading')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('landing.learnSection.subheading')}
                </p>
              </div>
              <Link
                to="/learn"
                className="inline-flex items-center gap-2 whitespace-nowrap font-semibold text-green-700 transition-colors hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
              >
                {t('landing.learnSection.viewAll')}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {learnResources.map((r) => (
                <Link
                  key={r.id}
                  to={`/learn/${r.id}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-green-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-600"
                >
                  <EntityImage
                    src={r.imageUrl}
                    alt={pickLang(r.titleEn, r.titleEl, r.titleDe)}
                    category={r.category}
                    className="h-32 w-full"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <span className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      {t(`projects.category.${r.category}`)}
                    </span>
                    <h3 className="line-clamp-2 text-base font-bold text-gray-900 transition-colors group-hover:text-green-700 dark:text-white dark:group-hover:text-green-400">
                      {pickLang(r.titleEn, r.titleEl, r.titleDe)}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Why ZOE — three pillars */}
      <section className="bg-white py-10 dark:bg-gray-900">
        <Container>
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              {t('landing.pillars.heading')}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              {t('landing.pillars.subheading')}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {pillars.map((p) => (
              <div
                key={p.titleKey}
                className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
              >
                <div className={`mb-4 inline-flex rounded-xl p-3 ${p.color}`}>
                  <p.icon size={24} aria-hidden="true" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                  {t(p.titleKey)}
                </h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                  {t(p.descKey)}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* From the community — newest approved citizen ideas (Z3) */}
      {communityIdeas.length > 0 && (
        <section className="bg-gray-50 py-10 dark:bg-gray-800">
          <Container>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="mb-2 flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-white">
                  <Lightbulb
                    size={24}
                    aria-hidden="true"
                    className="text-green-600 dark:text-green-400"
                  />
                  {t('landing.community.heading')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('landing.community.subheading')}
                </p>
              </div>
              <Link
                to="/ideas"
                className="inline-flex items-center gap-2 whitespace-nowrap font-semibold text-green-700 transition-colors hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
              >
                {t('landing.community.viewAll')}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {communityIdeas.map((idea) => (
                <Link
                  key={idea.id}
                  to={`/ideas/${idea.id}`}
                  className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-green-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-green-600"
                >
                  <span className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {t(`projects.category.${idea.category}`)}
                  </span>
                  <h3 className="mb-1 line-clamp-2 text-base font-bold text-gray-900 transition-colors group-hover:text-green-700 dark:text-white dark:group-hover:text-green-400">
                    {idea.title}
                  </h3>
                  <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                    {idea.description}
                  </p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CTA — Participate */}
      <section className="bg-green-700 py-10 text-white">
        <Container maxW="4xl" className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            {t('landing.cta.heading')}
          </h2>
          <p className="mx-auto mb-4 max-w-2xl text-lg text-green-100">
            {t('landing.cta.body')}
          </p>
          <p className="mb-8 text-sm text-green-100">
            {t('landing.cta.rewards')}{' '}
            <Link
              to="/rewards"
              className="text-white underline hover:text-green-100"
            >
              {t('landing.cta.rewardsLink')}
            </Link>
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {ctaButtons.map((btn) => (
              <Link
                key={btn.labelKey}
                to={btn.to}
                onClick={() => trackEvent(btn.event)}
                className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 font-semibold text-green-700 transition-colors hover:bg-green-50"
              >
                <CheckCircle2 size={16} aria-hidden="true" />
                {t(btn.labelKey)}
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

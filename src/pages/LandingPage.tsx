import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { projects } from '../data/projects';
import { impactMetrics } from '../data/metrics';
import { fallbackPosts } from '../data/posts';
import StatusBadge from '../components/ui/StatusBadge';
import ProgressBar from '../components/ui/ProgressBar';
import PostCard from '../components/news/PostCard';
import EntityImage from '../components/ui/EntityImage';
import { getPosts } from '../services/postService';
import { getEvents } from '../services/eventService';
import { getProjects } from '../services/projectService';
import { trackEvent, ANALYTICS_EVENTS } from '../services/analytics';
import type { Post, ApiEvent, ApiProject } from '../types';

const highlights = projects.filter((p) => p.status === 'Active').slice(0, 3);

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
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<ApiEvent[]>([]);
  const [openProjects, setOpenProjects] = useState<ApiProject[]>([]);

  useEffect(() => {
    getPosts({ limit: 3 })
      .then((posts) => setLatestPosts(posts.slice(0, 3)))
      .catch(() => setLatestPosts(fallbackPosts.slice(0, 3)));
    // "Get involved now": upcoming events (date asc from the API) take priority,
    // OPEN projects fill the rest. Both calls are public; failures degrade to empty.
    getEvents({ upcoming: true })
      .then((events) => setUpcomingEvents(events))
      .catch(() => setUpcomingEvents([]));
    getProjects({ status: 'OPEN', limit: 4 })
      .then((data) => setOpenProjects(data.projects))
      .catch(() => setOpenProjects([]));
  }, []);

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
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 via-green-600 to-teal-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium">
              <Leaf size={16} aria-hidden="true" />
              <span>{t('landing.hero.badge')}</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              {t('landing.hero.title')}
            </h1>
            <p className="mb-8 max-w-2xl text-xl leading-relaxed text-green-100">
              {t('landing.hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
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
        </div>
      </section>

      {/* Get involved now — upcoming events first, then OPEN projects. Placed
          directly under the hero so participation is the first call to action. */}
      {engageItems.length > 0 && (
        <section
          aria-labelledby="engage-heading"
          className="bg-white py-16 dark:bg-gray-900"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                    className="h-40 w-full"
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
          </div>
        </section>
      )}

      {/* Stats bar */}
      <section
        className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
        aria-label="Key statistics"
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
            {impactMetrics.slice(0, 4).map((m) => (
              <div key={m.id}>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400 sm:text-3xl">
                  {m.value}
                  <span className="ml-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                    {t(`impactMetrics.${m.id}.unit`)}
                  </span>
                </p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {t(`impactMetrics.${m.id}.label`)}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-amber-700 dark:text-amber-400">
            {t('landing.stats.disclaimer')}
          </p>
        </div>
      </section>

      {/* Three pillars */}
      <section className="bg-gray-50 py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              {t('landing.pillars.heading')}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              {t('landing.pillars.subheading')}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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
        </div>
      </section>

      {/* Featured projects */}
      <section className="bg-white py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                    <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {project.description}
                    </p>
                    <div>
                      <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{t('landing.featured.progress')}</span>
                      </div>
                      <ProgressBar value={project.progressPercent} />
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Users size={13} aria-hidden="true" />
                      <span>
                        {t('landing.featured.participants', {
                          count: project.participantCount.toLocaleString(),
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* What's new — news feed */}
      {latestPosts.length > 0 && (
        <section className="bg-gray-50 py-16 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
              {latestPosts.map((post) => (
                <PostCard key={post.id} post={post} compact />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA — Participate */}
      <section className="bg-green-700 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-white">
            {t('landing.cta.heading')}
          </h2>
          <p className="mx-auto mb-4 max-w-2xl text-lg text-green-100">
            {t('landing.cta.body')}
          </p>
          <p className="mb-8 text-sm text-green-200">
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
        </div>
      </section>
    </div>
  );
}

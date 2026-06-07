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
} from 'lucide-react';
import { projects } from '../data/projects';
import { impactMetrics } from '../data/metrics';
import StatusBadge from '../components/ui/StatusBadge';
import ProgressBar from '../components/ui/ProgressBar';

const highlights = projects.filter((p) => p.status === 'Active').slice(0, 3);

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
  const { t } = useTranslation();

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
    { labelKey: 'landing.cta.submitIdea', to: '/participate' },
    { labelKey: 'landing.cta.joinEvent', to: '/events' },
    { labelKey: 'landing.cta.seeImpact', to: '/transparency' },
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
                className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-green-700 transition-colors hover:bg-green-50"
              >
                {t('landing.hero.exploreProjects')}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                to="/participate"
                className="rounded-lg border-2 border-white/60 px-6 py-3 font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
              >
                {t('landing.hero.getInvolved')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section
        className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
        aria-label="Key statistics"
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
            {impactMetrics.slice(0, 4).map((m) => (
              <div key={m.label}>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400 sm:text-3xl">
                  {m.value}
                  <span className="ml-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                    {m.unit}
                  </span>
                </p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {m.label}
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

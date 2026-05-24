import {
  Leaf,
  Users,
  Recycle,
  Waves,
  TreePine,
  Wind,
  GraduationCap,
  Globe,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { impactMetrics } from '../data/metrics';
import { projects } from '../data/projects';
import ProgressBar from '../components/ui/ProgressBar';
import StatusBadge from '../components/ui/StatusBadge';

const iconMap: Record<string, React.ElementType> = {
  Leaf,
  Users,
  Recycle,
  Waves,
  TreePine,
  Wind,
  GraduationCap,
  Globe,
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

const trendColors = {
  up: 'text-green-600',
  down: 'text-rose-600',
  stable: 'text-gray-400',
};

export default function TransparencyPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Impact & Transparency Data
        </h1>
        <p className="text-gray-600 max-w-2xl leading-relaxed">
          The ZOE programme publishes transparent data on all project activities
          and outcomes. This page provides a programme-wide overview of key
          performance indicators.
        </p>
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-sm text-amber-800 inline-block">
          <strong>Prototype notice:</strong> All figures below are fictional
          dummy data for demonstration purposes. A real deployment would show
          verified, live data from project reports.
        </div>
      </div>

      {/* KPI grid */}
      <section aria-label="Key performance indicators" className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">
          Programme KPIs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {impactMetrics.map((metric) => {
            const Icon = iconMap[metric.icon] ?? Leaf;
            const TrendIcon =
              metric.trend ? trendIcons[metric.trend] : undefined;
            const trendColor =
              metric.trend ? trendColors[metric.trend] : 'text-gray-400';
            return (
              <div
                key={metric.label}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Icon
                      size={20}
                      className="text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  {TrendIcon && (
                    <TrendIcon
                      size={16}
                      className={trendColor}
                      aria-label={`Trend: ${metric.trend}`}
                    />
                  )}
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{metric.unit}</p>
                <p className="text-sm font-medium text-gray-700 mt-2">
                  {metric.label}
                </p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {metric.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Project progress table */}
      <section aria-label="Project progress" className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">
          Project Progress Overview
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">
                    Project
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">
                    Category
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 w-48">
                    Progress
                  </th>
                  <th className="text-right px-5 py-3 font-medium text-gray-600 hidden sm:table-cell">
                    Participants
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <a
                        href={`/projects/${p.id}`}
                        className="font-medium text-gray-900 hover:text-green-700 transition-colors"
                      >
                        {p.title}
                      </a>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell text-gray-500">
                      {p.category}
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3.5 w-48">
                      <ProgressBar value={p.progressPercent} color="bg-green-500" />
                    </td>
                    <td className="px-5 py-3.5 text-right text-gray-500 hidden sm:table-cell">
                      {p.participantCount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Transparency principles */}
      <section aria-label="Transparency principles" className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">
          Our Transparency Commitment
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: 'Open Progress Data',
              desc: 'Every project publishes regular updates on progress, spending, and outcomes. No data is hidden from citizens.',
            },
            {
              title: 'Independent Metrics',
              desc: 'Where possible, progress is measured by third-party organisations or citizen scientists rather than project teams alone.',
            },
            {
              title: 'Public Participation Records',
              desc: 'Participation counts and event records are published openly, showing who is engaged and how.',
            },
            {
              title: 'SDG Accountability',
              desc: 'All SDG alignment claims are justified with specific, measurable targets and reviewed annually.',
            },
            {
              title: 'Feedback Integration',
              desc: 'Citizen feedback is tracked and visibly incorporated into project iteration decisions.',
            },
            {
              title: 'Annual Reporting',
              desc: 'The ZOE programme publishes an annual report combining all project data, citizen engagement statistics, and environmental outcomes.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="w-1.5 h-6 bg-green-500 rounded mb-3" aria-hidden="true" />
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prototype footer */}
      <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 text-center">
        <p className="text-amber-800 text-sm leading-relaxed">
          <strong>Research transparency:</strong> This is a prototype platform
          built for a Design Science Research academic project. All data shown
          is fictional and intended to demonstrate the information architecture
          and UX concepts only. A production deployment would require a verified
          data pipeline from real project management systems.
        </p>
      </div>
    </div>
  );
}

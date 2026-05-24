import { Link } from 'react-router-dom';
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

const pillars = [
  {
    icon: Eye,
    title: 'Transparency',
    description:
      'Every project publishes progress metrics, participation numbers, and impact data openly. Citizens can see where funding goes and what is being achieved.',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: Users,
    title: 'Citizen Participation',
    description:
      'From submitting ideas to volunteering on the ground, the ZOE platform connects residents directly to the environmental actions shaping their community.',
    color: 'text-green-600 bg-green-50',
  },
  {
    icon: BarChart3,
    title: 'Sustainability Impact',
    description:
      'Aligned with the UN Sustainable Development Goals, each ZOE project is designed to deliver measurable, long-term environmental benefit.',
    color: 'text-teal-600 bg-teal-50',
  },
];

const categoryIcons = {
  Biodiversity: TreePine,
  'Circular Economy': Recycle,
  'Waste Reduction': Recycle,
  Education: GraduationCap,
  'Water Protection': Waves,
  'Sustainable Tourism': Leaf,
  'Community Action': Users,
};

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 via-green-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Leaf size={16} aria-hidden="true" />
              <span>Municipality of Northern Corfu</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
              ZOE — Environmental Actions for Northern Corfu
            </h1>
            <p className="text-xl text-green-100 leading-relaxed mb-8 max-w-2xl">
              A transparent, participatory platform connecting citizens with the
              environmental projects protecting the nature, coastlines, and
              communities of Northern Corfu.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/projects"
                className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center gap-2"
              >
                Explore Projects
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                to="/participate"
                className="border-2 border-white/60 text-white px-6 py-3 rounded-lg font-semibold hover:border-white hover:bg-white/10 transition-colors"
              >
                Get Involved
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-200" aria-label="Key statistics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {impactMetrics.slice(0, 4).map((m) => (
              <div key={m.label}>
                <p className="text-2xl sm:text-3xl font-bold text-green-700">
                  {m.value}
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    {m.unit}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mt-1">{m.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-amber-700 mt-4">
            * All statistics are prototype dummy data for demonstration purposes.
          </p>
        </div>
      </section>

      {/* Three pillars */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why the ZOE Platform?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Environmental governance in small municipalities often lacks
              visibility and citizen connection. ZOE changes that with three
              core commitments.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex p-3 rounded-xl mb-4 ${p.color}`}>
                  <p.icon size={24} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {p.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Active Projects
              </h2>
              <p className="text-gray-600">
                Environmental actions underway right now in Northern Corfu.
              </p>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-green-700 font-semibold hover:text-green-800 transition-colors whitespace-nowrap"
            >
              View all projects
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((project) => {
              const Icon =
                categoryIcons[project.category] ?? Leaf;
              return (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="group bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all overflow-hidden"
                >
                  <div
                    className={`h-3 ${project.thumbnailColor}`}
                    aria-hidden="true"
                  />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Icon size={16} aria-hidden="true" />
                        <span className="text-xs">{project.category}</span>
                      </div>
                      <StatusBadge status={project.status} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {project.description}
                    </p>
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                      </div>
                      <ProgressBar value={project.progressPercent} />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-3">
                      <Users size={13} aria-hidden="true" />
                      <span>
                        {project.participantCount.toLocaleString()} participants
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
      <section className="bg-green-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Your participation matters
          </h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Whether you have five minutes to share feedback or five hours to
            volunteer at a restoration site — the ZOE programme needs your
            involvement to succeed.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { label: 'Submit an Idea', to: '/participate' },
              { label: 'Join an Event', to: '/events' },
              { label: 'See Impact Data', to: '/transparency' },
            ].map((btn) => (
              <Link
                key={btn.label}
                to={btn.to}
                className="bg-white text-green-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center gap-2"
              >
                <CheckCircle2 size={16} aria-hidden="true" />
                {btn.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

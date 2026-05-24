import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Target,
  TrendingUp,
  Leaf,
  AlertCircle,
} from 'lucide-react';
import { getProjectById } from '../data/projects';
import { getSdgByNumber } from '../data/sdgs';
import StatusBadge from '../components/ui/StatusBadge';
import ProgressBar from '../components/ui/ProgressBar';
import SDGBadge from '../components/ui/SDGBadge';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = id ? getProjectById(id) : undefined;

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <AlertCircle
          size={48}
          className="mx-auto text-gray-400 mb-4"
          aria-hidden="true"
        />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Project not found
        </h1>
        <p className="text-gray-600 mb-6">
          The project you are looking for does not exist.
        </p>
        <Link
          to="/projects"
          className="text-green-700 underline font-medium"
        >
          Back to all projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back nav */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to projects
      </button>

      {/* Title block */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className={`h-3 ${project.thumbnailColor}`} aria-hidden="true" />
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-sm text-gray-500 bg-gray-100 rounded px-2 py-0.5">
              {project.category}
            </span>
            <StatusBadge status={project.status} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            {project.title}
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} className="text-gray-400" aria-hidden="true" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar
                size={16}
                className="text-gray-400"
                aria-hidden="true"
              />
              <span>
                {project.startDate} → {project.endDate}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users size={16} className="text-gray-400" aria-hidden="true" />
              <span>
                {project.participantCount.toLocaleString()} participants
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span className="font-medium">Overall Progress</span>
              <span>{project.progressPercent}%</span>
            </div>
            <ProgressBar value={project.progressPercent} color="bg-green-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Problem */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Target size={18} className="text-rose-500" aria-hidden="true" />
              Problem Addressed
            </h2>
            <p className="text-gray-700 leading-relaxed">{project.problem}</p>
          </div>

          {/* Impact */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <TrendingUp
                size={18}
                className="text-green-500"
                aria-hidden="true"
              />
              Expected Impact
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {project.expectedImpact}
            </p>
          </div>

          {/* Citizen involvement */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Users size={18} className="text-blue-500" aria-hidden="true" />
              How Citizens Can Get Involved
            </h2>
            <ul className="space-y-3">
              {project.citizenInvolvement.map((option) => (
                <li
                  key={option}
                  className="flex items-start gap-3 text-gray-700"
                >
                  <span
                    className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span>{option}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link
                to="/participate"
                className="text-sm text-green-700 font-medium hover:text-green-800 transition-colors"
              >
                → Register your interest on the Participation page
              </Link>
            </div>
          </div>
        </div>

        {/* Right column — sidebar */}
        <div className="space-y-6">
          {/* Transparency metrics */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
              Transparency Metrics
            </h2>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 mb-4">
              Prototype dummy data only
            </p>
            <div className="space-y-4">
              {project.transparencyMetrics.map((metric) => (
                <div key={metric.label}>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-gray-500">{metric.label}</span>
                    <span className="font-semibold text-gray-900 text-sm">
                      {metric.value}{' '}
                      <span className="font-normal text-gray-500 text-xs">
                        {metric.unit}
                      </span>
                    </span>
                  </div>
                  <div className="h-px bg-gray-100 mt-2" />
                </div>
              ))}
            </div>
          </div>

          {/* SDGs */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
              SDG Alignment
            </h2>
            <div className="space-y-3">
              {project.sdgs.map((n) => {
                const sdg = getSdgByNumber(n);
                return (
                  <div key={n} className="flex items-start gap-2">
                    <SDGBadge number={n} />
                    <span className="text-xs text-gray-600 mt-0.5 leading-tight">
                      {sdg?.title}
                    </span>
                  </div>
                );
              })}
            </div>
            <Link
              to="/sdg-dashboard"
              className="mt-4 block text-xs text-green-700 hover:text-green-800 transition-colors"
            >
              → View SDG Dashboard
            </Link>
          </div>

          {/* Quick actions */}
          <div className="bg-green-50 rounded-xl border border-green-100 p-5">
            <h2 className="font-semibold text-green-800 mb-3 text-sm">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Link
                to="/participate"
                className="block bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg text-center hover:bg-green-700 transition-colors"
              >
                <Leaf
                  size={14}
                  className="inline mr-1.5"
                  aria-hidden="true"
                />
                Volunteer for this project
              </Link>
              <Link
                to="/events"
                className="block bg-white text-green-700 text-sm font-medium px-4 py-2 rounded-lg text-center border border-green-200 hover:bg-green-50 transition-colors"
              >
                Find related events
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

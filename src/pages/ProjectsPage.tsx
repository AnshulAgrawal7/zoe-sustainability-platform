import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Users, ArrowRight } from 'lucide-react';
import { projects } from '../data/projects';
import { getSdgByNumber } from '../data/sdgs';
import StatusBadge from '../components/ui/StatusBadge';
import ProgressBar from '../components/ui/ProgressBar';
import type { ProjectCategory, ProjectStatus, SDGNumber } from '../types';

const categories: ProjectCategory[] = [
  'Biodiversity',
  'Circular Economy',
  'Waste Reduction',
  'Education',
  'Water Protection',
  'Sustainable Tourism',
  'Community Action',
];

const statuses: ProjectStatus[] = ['Active', 'Planning', 'Completed', 'Paused'];

const allSdgs: SDGNumber[] = [3, 4, 6, 8, 11, 12, 13, 14, 15, 17];

export default function ProjectsPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sdgFilter, setSdgFilter] = useState<string>('');

  const filtered = projects.filter((p) => {
    if (categoryFilter && p.category !== categoryFilter) return false;
    if (statusFilter && p.status !== statusFilter) return false;
    if (sdgFilter && !p.sdgs.includes(Number(sdgFilter) as SDGNumber))
      return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Environmental Projects
        </h1>
        <p className="text-gray-600 max-w-2xl">
          All active, planned and completed environmental action projects under
          the ZOE programme in Northern Corfu.
        </p>
        <p className="text-xs text-amber-700 mt-2 bg-amber-50 border border-amber-200 rounded px-3 py-1.5 inline-block">
          Prototype: all project data is illustrative dummy data.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
        <div className="flex items-center gap-2 text-gray-700 font-medium mb-4">
          <Filter size={16} aria-hidden="true" />
          <span>Filter Projects</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="category-filter"
              className="block text-xs font-medium text-gray-600 mb-1.5"
            >
              Category
            </label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="status-filter"
              className="block text-xs font-medium text-gray-600 mb-1.5"
            >
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="sdg-filter"
              className="block text-xs font-medium text-gray-600 mb-1.5"
            >
              SDG
            </label>
            <select
              id="sdg-filter"
              value={sdgFilter}
              onChange={(e) => setSdgFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All SDGs</option>
              {allSdgs.map((n) => {
                const sdg = getSdgByNumber(n);
                return (
                  <option key={n} value={n}>
                    SDG {n} — {sdg?.title}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        {(categoryFilter || statusFilter || sdgFilter) && (
          <button
            onClick={() => {
              setCategoryFilter('');
              setStatusFilter('');
              setSdgFilter('');
            }}
            className="mt-3 text-xs text-green-700 hover:text-green-900 underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-5">
        Showing {filtered.length} of {projects.length} projects
      </p>

      {/* Project grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">No projects match your filters.</p>
          <button
            onClick={() => {
              setCategoryFilter('');
              setStatusFilter('');
              setSdgFilter('');
            }}
            className="text-green-700 underline text-sm"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="group bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              <div
                className={`h-2 ${project.thumbnailColor}`}
                aria-hidden="true"
              />
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-0.5">
                    {project.category}
                  </span>
                  <StatusBadge status={project.status} />
                </div>
                <h2 className="font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                  {project.title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                  {project.description}
                </p>

                {/* SDGs */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.sdgs.map((n) => {
                    const sdg = getSdgByNumber(n);
                    return (
                      <span
                        key={n}
                        className="text-xs font-semibold text-white rounded px-1.5 py-0.5"
                        style={{ backgroundColor: sdg?.color ?? '#6b7280' }}
                        title={`SDG ${n}: ${sdg?.title}`}
                      >
                        {n}
                      </span>
                    );
                  })}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Progress</span>
                    <span>{project.progressPercent}%</span>
                  </div>
                  <ProgressBar
                    value={project.progressPercent}
                    showLabel={false}
                  />
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Users size={13} aria-hidden="true" />
                    <span>
                      {project.participantCount.toLocaleString()} participants
                    </span>
                  </div>
                  <span className="text-xs text-green-700 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Details <ArrowRight size={12} aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

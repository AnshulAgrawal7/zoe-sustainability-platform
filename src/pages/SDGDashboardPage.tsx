import { Link } from 'react-router-dom';
import { Globe, ArrowRight } from 'lucide-react';
import { sdgs, sdgProgressData } from '../data/sdgs';
import { projects } from '../data/projects';
import ProgressBar from '../components/ui/ProgressBar';
import type { SDGNumber } from '../types';

function getProjectsForSdg(sdgNumber: SDGNumber) {
  return projects.filter((p) => p.sdgs.includes(sdgNumber));
}

export default function SDGDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
          <Globe size={16} aria-hidden="true" />
          <span>UN Sustainable Development Goals</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          SDG Dashboard
        </h1>
        <p className="text-gray-600 max-w-2xl leading-relaxed">
          The ZOE programme aligns all projects to relevant UN Sustainable
          Development Goals. This dashboard shows which goals are addressed,
          how many projects contribute to each, and illustrative progress
          estimates.
        </p>
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-sm text-amber-800 inline-block">
          <strong>Prototype note:</strong> All percentages and figures are
          fictional dummy data for demonstration purposes only.
        </div>
      </div>

      {/* Overview row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'SDGs Addressed', value: sdgs.length, unit: 'of 17' },
          { label: 'Active Projects', value: projects.filter((p) => p.status === 'Active').length, unit: 'projects' },
          { label: 'Completed Projects', value: projects.filter((p) => p.status === 'Completed').length, unit: 'projects' },
          { label: 'Avg SDG Progress', value: Math.round(sdgProgressData.reduce((a, b) => a + b.progressPercent, 0) / sdgProgressData.length), unit: '% (prototype)' },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-xl border border-gray-200 p-4 text-center"
          >
            <p className="text-2xl font-bold text-green-700">
              {item.value}
              <span className="text-sm font-normal text-gray-500 ml-1">
                {item.unit}
              </span>
            </p>
            <p className="text-xs text-gray-600 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* SDG cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sdgs.map((sdg) => {
          const progressEntry = sdgProgressData.find(
            (d) => d.sdg === sdg.number
          );
          const linkedProjects = getProjectsForSdg(sdg.number as SDGNumber);
          const progress = progressEntry?.progressPercent ?? 0;

          return (
            <div
              key={sdg.number}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* SDG color header */}
              <div
                className="h-2"
                style={{ backgroundColor: sdg.color }}
                aria-hidden="true"
              />
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span
                    className="text-sm font-bold text-white rounded px-2 py-0.5"
                    style={{ backgroundColor: sdg.color }}
                  >
                    SDG {sdg.number}
                  </span>
                  <span className="text-xs text-gray-500">
                    {linkedProjects.length} project
                    {linkedProjects.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <h2 className="font-semibold text-gray-900 mb-2">
                  {sdg.title}
                </h2>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {sdg.description}
                </p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Programme progress (prototype)</span>
                    <span>{progress}%</span>
                  </div>
                  <ProgressBar
                    value={progress}
                    color="bg-green-500"
                    showLabel={false}
                  />
                </div>

                {/* Linked projects */}
                {linkedProjects.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      Contributing projects:
                    </p>
                    <ul className="space-y-1">
                      {linkedProjects.map((p) => (
                        <li key={p.id}>
                          <Link
                            to={`/projects/${p.id}`}
                            className="text-xs text-green-700 hover:text-green-900 hover:underline flex items-center gap-1"
                          >
                            <ArrowRight
                              size={10}
                              aria-hidden="true"
                            />
                            {p.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="mt-10 bg-gray-50 rounded-xl border border-gray-200 p-6 text-center">
        <h2 className="font-semibold text-gray-900 mb-2">
          About this dashboard
        </h2>
        <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
          SDG alignment is self-reported by project coordinators and reviewed
          by the ZOE team. Progress percentages represent the municipality's
          own assessment against locally-defined targets. This dashboard is a
          prototype — a real system would pull live data from verified project
          reports.
        </p>
      </div>
    </div>
  );
}

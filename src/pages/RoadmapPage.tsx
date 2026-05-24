import { CheckCircle2, Circle, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RoadmapPhase {
  id: string;
  phase: string;
  period: string;
  status: 'completed' | 'current' | 'upcoming';
  description: string;
  items: { label: string; done: boolean }[];
}

const phases: RoadmapPhase[] = [
  {
    id: 'phase-1',
    phase: 'Phase 1 — MVP Prototype',
    period: 'Spring 2025',
    status: 'current',
    description:
      'Build and demonstrate the core frontend prototype as a Design Science Research artefact. Establish information architecture, dummy data, and core participation workflows.',
    items: [
      { label: 'Vite + React + TypeScript project setup', done: true },
      { label: 'Tailwind CSS design system', done: true },
      { label: 'Landing, About, and Projects pages', done: true },
      { label: 'SDG Dashboard', done: true },
      { label: 'Citizen Participation page with mock form', done: true },
      { label: 'Events & Initiatives listing', done: true },
      { label: 'Transparency / Impact metrics page', done: true },
      { label: 'Responsive navigation and layout', done: true },
      { label: 'Prototype data clearly labelled', done: true },
      { label: 'DSR documentation (methodology, architecture, evaluation)', done: true },
    ],
  },
  {
    id: 'phase-2',
    phase: 'Phase 2 — UX & Content Improvement',
    period: 'Summer–Autumn 2025',
    status: 'upcoming',
    description:
      'Improve UI polish, content quality and accessibility based on initial user feedback. Conduct formative evaluation with municipality staff and citizen focus groups.',
    items: [
      { label: 'Expert UI/UX review and iterations', done: false },
      { label: 'Accessibility audit (WCAG 2.1 AA)', done: false },
      { label: 'Greek language support / internationalisation', done: false },
      { label: 'Improved mobile experience', done: false },
      { label: 'Enhanced SDG visualisations and charts', done: false },
      { label: 'Content reviewed by municipality communications team', done: false },
      { label: 'User testing sessions with 5–10 participants', done: false },
      { label: 'Formative evaluation report', done: false },
    ],
  },
  {
    id: 'phase-3',
    phase: 'Phase 3 — DSR Evaluation & Iteration',
    period: 'Autumn–Winter 2025',
    status: 'upcoming',
    description:
      'Conduct structured evaluation against DSR criteria. Iterate on findings. Prepare evaluation report for academic submission and stakeholder presentation.',
    items: [
      { label: 'Structured evaluation interviews (n ≥ 10)', done: false },
      { label: 'Survey-based usability assessment (SUS score)', done: false },
      { label: 'Expert walkthroughs with DSR researchers', done: false },
      { label: 'Platform iteration based on evaluation findings', done: false },
      { label: 'Updated artifact description and architecture docs', done: false },
      { label: 'Formal evaluation report for academic submission', done: false },
      { label: 'Stakeholder presentation to municipality', done: false },
    ],
  },
  {
    id: 'phase-4',
    phase: 'Phase 4 — Backend Concept & Pilot',
    period: '2026',
    status: 'upcoming',
    description:
      'Design and prototype a real backend to replace dummy data. Establish database schema, API layer, admin interface, and citizen submission workflows.',
    items: [
      { label: 'Database schema design (projects, events, users, submissions)', done: false },
      { label: 'REST / GraphQL API design', done: false },
      { label: 'Authentication & role management (citizen vs admin)', done: false },
      { label: 'Admin dashboard for municipality staff', done: false },
      { label: 'Citizen submission moderation workflow', done: false },
      { label: 'Data migration from dummy to real data', done: false },
      { label: 'Security & privacy assessment (GDPR)', done: false },
      { label: 'Pilot deployment with selected municipality staff', done: false },
    ],
  },
  {
    id: 'phase-5',
    phase: 'Phase 5 — Production Deployment',
    period: '2026–2027',
    status: 'upcoming',
    description:
      'Full production deployment for public use by Northern Corfu residents and municipality. Ongoing maintenance, analytics, and further feature development.',
    items: [
      { label: 'Production infrastructure setup', done: false },
      { label: 'Public launch and communications campaign', done: false },
      { label: 'Citizen onboarding and tutorials', done: false },
      { label: 'Analytics and reporting dashboard', done: false },
      { label: 'API integrations (e.g., municipal systems, open data)', done: false },
      { label: 'Mobile app exploration', done: false },
      { label: 'Ongoing summative evaluation', done: false },
    ],
  },
];

const statusConfig = {
  completed: {
    label: 'Completed',
    dotClass: 'bg-green-500 border-green-500',
    badgeClass: 'bg-green-100 text-green-800',
    lineClass: 'bg-green-300',
  },
  current: {
    label: 'In Progress',
    dotClass: 'bg-green-600 border-green-600 ring-4 ring-green-100',
    badgeClass: 'bg-green-600 text-white',
    lineClass: 'bg-gray-200',
  },
  upcoming: {
    label: 'Planned',
    dotClass: 'bg-white border-gray-300',
    badgeClass: 'bg-gray-100 text-gray-600',
    lineClass: 'bg-gray-200',
  },
};

export default function RoadmapPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Platform Roadmap
        </h1>
        <p className="text-gray-600 max-w-2xl leading-relaxed">
          The ZOE platform follows an iterative Design Science Research
          process. This roadmap describes the planned phases from the current
          MVP prototype through to a full production system.
        </p>
        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 text-sm text-blue-800 inline-block">
          <strong>Current status:</strong> Phase 1 (MVP Prototype) is
          complete. Future phases depend on evaluation findings and municipality
          decisions.
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {phases.map((phase, idx) => {
          const config = statusConfig[phase.status];
          const isLast = idx === phases.length - 1;
          return (
            <div key={phase.id} className="flex gap-6 mb-8">
              {/* Timeline column */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-1 ${config.dotClass}`}
                  aria-hidden="true"
                />
                {!isLast && (
                  <div
                    className={`w-0.5 flex-1 mt-1 ${config.lineClass}`}
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Content */}
              <div className="pb-6 flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {phase.phase}
                  </h2>
                  <span
                    className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${config.badgeClass}`}
                  >
                    {config.label}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock size={13} aria-hidden="true" />
                    {phase.period}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {phase.description}
                </p>

                <ul className="space-y-1.5">
                  {phase.items.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-start gap-2 text-sm"
                    >
                      {item.done ? (
                        <CheckCircle2
                          size={15}
                          className="text-green-500 flex-shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                      ) : (
                        <Circle
                          size={15}
                          className="text-gray-300 flex-shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                      )}
                      <span
                        className={
                          item.done ? 'text-gray-700' : 'text-gray-500'
                        }
                      >
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Backend concept link */}
      <div className="mt-6 bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-2">
          Backend architecture concept
        </h2>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          The technical design for the future backend (Phases 4–5) is documented
          in the project repository. It covers database schema, API layer, admin
          interface, and security/privacy considerations.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/transparency"
            className="text-sm text-green-700 font-medium hover:underline flex items-center gap-1"
          >
            View current impact data <ArrowRight size={13} aria-hidden="true" />
          </Link>
          <Link
            to="/participate"
            className="text-sm text-green-700 font-medium hover:underline flex items-center gap-1"
          >
            Give feedback on the roadmap <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

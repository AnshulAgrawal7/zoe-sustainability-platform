import { Link } from 'react-router-dom';
import {
  Leaf,
  MapPin,
  Target,
  BookOpen,
  ArrowRight,
  Milestone,
  FlaskConical,
  Globe,
} from 'lucide-react';

const dsrSteps = [
  {
    number: '01',
    title: 'Problem Identification',
    description:
      'Northern Corfu faces environmental degradation, low citizen awareness of municipal sustainability efforts, and limited transparent communication channels between government and residents.',
    icon: Target,
  },
  {
    number: '02',
    title: 'Define Objectives',
    description:
      'Design a digital platform artifact that increases transparency of environmental actions, enables citizen participation, and communicates SDG alignment — all accessible to non-technical users.',
    icon: Milestone,
  },
  {
    number: '03',
    title: 'Design & Development',
    description:
      'Build a frontend MVP prototype using React + TypeScript + Tailwind. Structure information around projects, SDG mapping, events and citizen engagement. Use realistic dummy data.',
    icon: FlaskConical,
  },
  {
    number: '04',
    title: 'Demonstration',
    description:
      'This prototype demonstrates the artifact to stakeholders — municipality staff, researchers and citizens — showing the intended information architecture and participation workflows.',
    icon: BookOpen,
  },
  {
    number: '05',
    title: 'Evaluation',
    description:
      'An evaluation plan (see docs/) defines how the platform should be assessed against criteria: usefulness, usability, completeness, accessibility and participation support.',
    icon: Globe,
  },
  {
    number: '06',
    title: 'Communication',
    description:
      'Results, design decisions, and lessons learned are documented in DSR methodology, architecture and evaluation documents for academic and stakeholder communication.',
    icon: Leaf,
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 to-green-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-teal-200 text-sm mb-4">
            <MapPin size={14} aria-hidden="true" />
            <span>Municipality of Northern Corfu, Greece</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-6">
            About the ZOE Programme
          </h1>
          <p className="text-xl text-teal-100 leading-relaxed">
            ZOE (Ζωή — "life" in Greek) is the strategic environmental action
            framework of the Municipality of Northern Corfu. This digital
            platform is the communication and participation layer of the ZOE
            programme, built as a Design Science Research artefact.
          </p>
        </div>
      </section>

      {/* What is ZOE */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What is the ZOE Programme?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                ZOE is a strategic framework for environmental governance at the
                municipal level. It coordinates a portfolio of environmental
                projects spanning biodiversity, circular economy, waste
                reduction, water protection, education, and sustainable tourism.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                The programme is grounded in the UN Sustainable Development
                Goals (SDGs) and European Green Deal principles, adapted for the
                specific ecological and social context of Northern Corfu.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Key to the ZOE approach is the belief that environmental action
                cannot succeed without genuine citizen participation and radical
                transparency. This platform is designed to enable both.
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
              <h3 className="font-semibold text-green-800 mb-4">
                Programme Principles
              </h3>
              <ul className="space-y-3">
                {[
                  ['Transparency', 'Open progress data for every project'],
                  ['Participation', 'Active citizen involvement in governance'],
                  ['Science-Based', 'Evidence-informed project design'],
                  ['SDG Alignment', 'Linked to global sustainability goals'],
                  ['Long-Term Thinking', 'Planning for 2030 and beyond'],
                  ['Local Knowledge', 'Rooted in community expertise'],
                ].map(([title, desc]) => (
                  <li key={title} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-900">{title}:</span>{' '}
                      <span className="text-gray-600">{desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DSR Context */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Design Science Research Context
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              This platform is a <strong>DSR artefact</strong> — a prototype
              designed to address a real-world problem through a structured
              research process. It follows the Peffers et al. (2007) DSR
              methodology framework.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dsrSteps.map((step) => (
              <div
                key={step.number}
                className="bg-white rounded-xl p-5 border border-gray-200 hover:border-green-300 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold text-green-600 bg-green-50 rounded px-2 py-0.5">
                    {step.number}
                  </span>
                  <step.icon
                    size={18}
                    className="text-gray-500"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-amber-50 rounded-xl p-5 border border-amber-200 text-center">
            <p className="text-amber-800 text-sm">
              <span className="font-semibold">Research note:</span> This
              platform is a prototype (Version 1). Further iterations should
              follow user testing, expert evaluation, and stakeholder feedback
              as described in the evaluation plan.
            </p>
          </div>
        </div>
      </section>

      {/* Northern Corfu context */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Northern Corfu: Context & Challenges
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { stat: '~102,000', label: 'Permanent residents', note: 'Corfu island (ELSTAT 2021)' },
              { stat: '4 million', label: 'Visitors per year', note: '40× the permanent population' },
              { stat: '350–400t', label: 'Waste per day (summer)', note: 'vs. ~170t in winter' },
              { stat: '3.5 million', label: 'Olive trees', note: 'many abandoned since 1960s' },
            ].map((item) => (
              <div
                key={item.label}
                className="text-center bg-gray-50 rounded-xl p-4 border border-gray-100"
              >
                <p className="text-2xl font-bold text-green-700 mb-1">
                  {item.stat}
                </p>
                <p className="font-medium text-gray-900 text-xs">{item.label}</p>
                <p className="text-xs text-gray-500 mt-1">{item.note}</p>
              </div>
            ))}
          </div>

          {/* Real issues */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              {
                title: 'Waste crisis',
                desc: "Corfu's only landfill at Temploni filled to capacity and was blockaded in 2018, creating a visible garbage crisis during peak tourist season. A new waste treatment unit is planned for 2027.",
              },
              {
                title: 'Olive grove abandonment',
                desc: 'The post-1960s shift to tourism left thousands of hectares of terraced olive groves in Northern Corfu\'s hill villages abandoned, accelerating soil erosion and fire risk.',
              },
              {
                title: 'Antinioti Lagoon under pressure',
                desc: 'The Natura 2000 protected lagoon between Kassiopi and Roda faces agricultural runoff and habitat degradation. It supports 44+ migratory bird species.',
              },
              {
                title: 'Erimitis development threat',
                desc: 'A major hotel and marina development proposed for the last virgin forested headland in NE Corfu has triggered the most significant civic environmental campaign in recent Corfu history.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Partners */}
          <div className="bg-green-50 rounded-xl border border-green-100 p-5">
            <h3 className="font-semibold text-green-800 mb-3 text-sm">
              Existing partners & initiatives ZOE builds on
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
              {[
                ['Ionian Environment Foundation (IEF)', 'Island-wide environmental charity funding 18+ projects including Posidonia mapping, marine cleanup and school education.'],
                ['SIN.PRAXI — Sinies Small Green Spot', 'Community cooperative in NE Corfu running the only licensed recycling hub on the island. ZOE replicates this model.'],
                ['Save Erimitis Coalition', 'Citizen campaign opposing development on the Erimitis Peninsula — a model for community-led environmental advocacy.'],
                ['All For Blue', 'NGO conducting seasonal beach and underwater cleanups at Palaiokastritsa and other Corfu beaches.'],
              ].map(([name, desc]) => (
                <div key={name} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <span className="font-medium text-gray-900">{name}:</span>{' '}
                    <span className="text-gray-600">{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to explore the platform?
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/projects"
              className="bg-white text-green-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center gap-2"
            >
              View Projects <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              to="/audiences"
              className="bg-white text-green-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center gap-2"
            >
              Who We Reach <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              to="/sdg-dashboard"
              className="border-2 border-white/60 text-white px-5 py-2.5 rounded-lg font-semibold hover:border-white hover:bg-white/10 transition-colors"
            >
              SDG Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

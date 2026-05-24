import { useState } from 'react';
import {
  Home,
  Wheat,
  Anchor,
  Building2,
  Sparkles,
  Plane,
  Wifi,
  WifiOff,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { targetAudiences } from '../data/audiences';

const iconMap: Record<string, React.ElementType> = {
  Home,
  Wheat,
  Anchor,
  Building2,
  Sparkles,
  Plane,
};

const audienceColors: Record<string, string> = {
  residents: 'border-green-300 bg-green-50',
  farmers: 'border-lime-300 bg-lime-50',
  fishermen: 'border-blue-300 bg-blue-50',
  'tourism-businesses': 'border-teal-300 bg-teal-50',
  'young-people': 'border-violet-300 bg-violet-50',
  tourists: 'border-amber-300 bg-amber-50',
};

const audienceIconColors: Record<string, string> = {
  residents: 'bg-green-100 text-green-700',
  farmers: 'bg-lime-100 text-lime-700',
  fishermen: 'bg-blue-100 text-blue-700',
  'tourism-businesses': 'bg-teal-100 text-teal-700',
  'young-people': 'bg-violet-100 text-violet-700',
  tourists: 'bg-amber-100 text-amber-700',
};

export default function AudiencesPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Who We Reach — Target Audiences & Sensitization
        </h1>
        <p className="text-gray-600 max-w-2xl leading-relaxed">
          Environmental change in Northern Corfu requires reaching very
          different groups of people — each with distinct concerns, channels,
          and motivations. ZOE uses a multi-audience, multi-channel approach
          because no single message or medium works for everyone.
        </p>
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-start gap-3">
          <Info size={18} className="text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-blue-800 leading-relaxed">
            This analysis is based on demographic research into Northern Corfu
            and the Ionian islands, civic engagement studies in Greek
            municipalities, and fieldwork by the Ionian Environment Foundation
            (IEF). The platform itself is a prototype — not yet live with real
            reach data.
          </p>
        </div>
      </div>

      {/* Context strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { stat: '~102,000', label: 'permanent residents on Corfu', note: 'majority in working age, ageing rapidly' },
          { stat: '4 million', label: 'visitors per year', note: '40× the permanent population in peak season' },
          { stat: '78%', label: 'rural household internet penetration', note: 'offline channels still essential' },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-xl border border-gray-200 p-4 text-center"
          >
            <p className="text-2xl font-bold text-green-700">{item.stat}</p>
            <p className="text-sm font-medium text-gray-900 mt-0.5">{item.label}</p>
            <p className="text-xs text-gray-500 mt-1">{item.note}</p>
          </div>
        ))}
      </div>

      {/* Audience cards */}
      <div className="space-y-4">
        {targetAudiences.map((audience) => {
          const Icon = iconMap[audience.icon] ?? Home;
          const isOpen = expanded === audience.id;
          const borderColor = audienceColors[audience.id] ?? 'border-gray-200 bg-white';
          const iconColor = audienceIconColors[audience.id] ?? 'bg-gray-100 text-gray-600';

          return (
            <div
              key={audience.id}
              className={`rounded-xl border-2 transition-all ${borderColor}`}
            >
              {/* Summary row — always visible */}
              <button
                onClick={() => setExpanded(isOpen ? null : audience.id)}
                className="w-full text-left px-5 py-4 flex items-center gap-4"
                aria-expanded={isOpen}
              >
                <div className={`p-2.5 rounded-lg flex-shrink-0 ${iconColor}`}>
                  <Icon size={20} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-900">{audience.name}</h2>
                  <p className="text-sm text-gray-600 mt-0.5">{audience.tagline}</p>
                </div>
                {isOpen ? (
                  <ChevronUp size={18} className="text-gray-400 flex-shrink-0" aria-hidden="true" />
                ) : (
                  <ChevronDown size={18} className="text-gray-400 flex-shrink-0" aria-hidden="true" />
                )}
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="px-5 pb-6 border-t border-white/60 grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
                  {/* Left: description + concerns */}
                  <div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      {audience.description}
                    </p>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Key concerns
                    </h3>
                    <ul className="space-y-1.5">
                      {audience.keyConcerns.map((concern) => (
                        <li
                          key={concern}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" aria-hidden="true" />
                          {concern}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: channels + strategy */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Effective channels
                    </h3>
                    <ul className="space-y-1.5 mb-4">
                      {audience.channels.map((ch) => (
                        <li
                          key={ch.label}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          {ch.type === 'online' ? (
                            <Wifi size={13} className="text-blue-500 flex-shrink-0 mt-0.5" aria-label="Online channel" />
                          ) : (
                            <WifiOff size={13} className="text-orange-500 flex-shrink-0 mt-0.5" aria-label="Offline channel" />
                          )}
                          {ch.label}
                        </li>
                      ))}
                    </ul>

                    <div className="bg-white/70 rounded-lg p-3 border border-white mb-3">
                      <p className="text-xs font-semibold text-green-700 mb-1">Entry point</p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {audience.entryPoint}
                      </p>
                    </div>

                    <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                      <p className="text-xs font-semibold text-amber-700 mb-1">
                        Watch out for
                      </p>
                      <p className="text-sm text-amber-900 leading-relaxed">
                        {audience.barrierNote}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sensitization principles */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">
          Sensitization Principles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Local and concrete',
              desc: "Name real places — Antinioti Lagoon, Erimitis, Kassiopi beach. Abstract 'sustainability' messaging fails where tangible, local threats succeed.",
            },
            {
              title: 'Multi-channel by design',
              desc: "Digital-only misses 40%+ of Northern Corfu's rural population. Every programme must include offline channels: radio, community meetings, church networks.",
            },
            {
              title: 'Seasonal timing',
              desc: 'Launch engagement in shoulder season (April–May, September–October). Summer is for tourists and working — not for launching new civic programmes to residents.',
            },
            {
              title: 'Trusted intermediaries',
              desc: 'In village settings, a respected local farmer or fisherman is more persuasive than municipal communications. Identify and support these natural advocates.',
            },
            {
              title: 'Visible results first',
              desc: 'Post-crisis trust in Greek municipalities is low. Show tangible results — a cleaned beach, a restored terrace wall, a saved forest — before asking for sustained commitment.',
            },
            {
              title: 'Frame around livelihood, not ideology',
              desc: "For farmers, fishermen and businesses, sustainability must be an economic argument before it is a moral one. Show how it protects income, not just the environment.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="w-1 h-5 bg-green-500 rounded mb-3" aria-hidden="true" />
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-10 bg-green-50 rounded-xl border border-green-200 p-6 text-center">
        <p className="text-gray-700 text-sm mb-4">
          Participate in the ZOE programme — whichever group you belong to, there is a role for you.
        </p>
        <Link
          to="/participate"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
        >
          Find your participation option
        </Link>
      </div>
    </div>
  );
}

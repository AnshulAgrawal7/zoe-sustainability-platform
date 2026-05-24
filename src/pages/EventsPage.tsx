import { useState } from 'react';
import { Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getUpcomingEvents } from '../data/events';
import type { ProjectCategory } from '../types';

const categories: ProjectCategory[] = [
  'Biodiversity',
  'Circular Economy',
  'Waste Reduction',
  'Education',
  'Water Protection',
  'Sustainable Tourism',
  'Community Action',
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const categoryColors: Record<string, string> = {
  Biodiversity: 'bg-green-100 text-green-800',
  'Circular Economy': 'bg-amber-100 text-amber-800',
  'Waste Reduction': 'bg-orange-100 text-orange-800',
  Education: 'bg-rose-100 text-rose-800',
  'Water Protection': 'bg-blue-100 text-blue-800',
  'Sustainable Tourism': 'bg-teal-100 text-teal-800',
  'Community Action': 'bg-purple-100 text-purple-800',
};

export default function EventsPage() {
  const [categoryFilter, setCategoryFilter] = useState('');
  const sorted = getUpcomingEvents().filter(
    (e) => !categoryFilter || e.category === categoryFilter
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Events & Initiatives
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Upcoming events, workshops, cleanup days and community forums. Find an
          activity near you and get involved.
        </p>
        <p className="text-xs text-amber-700 mt-2 bg-amber-50 border border-amber-200 rounded px-3 py-1.5 inline-block">
          Prototype: all event data and dates are illustrative dummy data.
        </p>
      </div>

      {/* Filter */}
      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-gray-600">Filter by:</span>
        <button
          onClick={() => setCategoryFilter('')}
          className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
            !categoryFilter
              ? 'bg-green-600 text-white border-green-600'
              : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c === categoryFilter ? '' : c)}
            className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
              categoryFilter === c
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Events list */}
      <p className="text-sm text-gray-500 mb-5">
        {sorted.length} event{sorted.length !== 1 ? 's' : ''} found
      </p>

      {sorted.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p>No events match your filter.</p>
          <button
            onClick={() => setCategoryFilter('')}
            className="text-green-700 underline text-sm mt-2"
          >
            Show all events
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {sorted.map((event) => {
            const spotsLeft = event.participantsMax - event.participantsRegistered;
            const fillPercent = Math.round(
              (event.participantsRegistered / event.participantsMax) * 100
            );
            const colorClass =
              categoryColors[event.category] ?? 'bg-gray-100 text-gray-700';

            return (
              <article
                key={event.id}
                className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span
                        className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${colorClass}`}
                      >
                        {event.category}
                      </span>
                      {event.projectId && (
                        <Link
                          to={`/projects/${event.projectId}`}
                          className="text-xs text-green-700 hover:underline"
                        >
                          → Related project
                        </Link>
                      )}
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      {event.title}
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {event.description}
                    </p>

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} aria-hidden="true" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} aria-hidden="true" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} aria-hidden="true" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Capacity + CTA */}
                  <div className="sm:w-44 flex-shrink-0">
                    <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                      <div className="flex items-center justify-center gap-1.5 text-gray-600 mb-2">
                        <Users size={14} aria-hidden="true" />
                        <span className="text-sm font-medium">
                          {event.participantsRegistered}/{event.participantsMax}
                        </span>
                      </div>
                      {/* Capacity bar */}
                      <div className="bg-gray-200 rounded-full h-1.5 mb-2">
                        <div
                          className={`h-1.5 rounded-full ${
                            fillPercent >= 90
                              ? 'bg-rose-500'
                              : fillPercent >= 70
                              ? 'bg-amber-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${fillPercent}%` }}
                        />
                      </div>
                      <p
                        className={`text-xs font-medium mb-3 ${
                          spotsLeft <= 5
                            ? 'text-rose-600'
                            : 'text-gray-500'
                        }`}
                      >
                        {spotsLeft <= 0
                          ? 'Fully booked'
                          : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
                      </p>
                      <Link
                        to="/participate"
                        className="block bg-green-600 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                      >
                        Register
                        <ArrowRight size={12} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Note */}
      <div className="mt-10 bg-gray-50 rounded-xl border border-gray-200 p-5 text-center">
        <p className="text-sm text-gray-600">
          Want to suggest a new event or initiative?{' '}
          <Link
            to="/participate"
            className="text-green-700 font-medium hover:underline"
          >
            Submit your idea on the Participation page →
          </Link>
        </p>
      </div>
    </div>
  );
}

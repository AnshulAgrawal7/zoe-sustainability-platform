import { useState } from 'react';
import {
  Lightbulb,
  HandHeart,
  Calendar,
  AlertTriangle,
  MessageSquare,
  CheckCircle2,
  X,
  Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { participationOptions } from '../data/metrics';

const optionPoints: Record<string, number> = {
  'submit-idea': 15,
  'volunteer': 25,
  'join-event': 20,
  'report-issue': 10,
  'feedback': 10,
};

const iconMap: Record<string, React.ElementType> = {
  Lightbulb,
  HandHeart,
  Calendar,
  AlertTriangle,
  MessageSquare,
};

interface FormState {
  name: string;
  email: string;
  type: string;
  message: string;
}

const emptyForm: FormState = { name: '', email: '', type: '', message: '' };

export default function ParticipationPage() {
  const [activeOption, setActiveOption] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // No backend — just show a local success message
    setSubmitted(true);
    setForm(emptyForm);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Citizen Participation
        </h1>
        <p className="text-gray-600 max-w-2xl leading-relaxed">
          The ZOE programme is driven by citizens as much as by the
          municipality. There are many ways to get involved — from sharing a
          local idea to volunteering in the field. Choose how you want to
          participate below.
        </p>
        <Link
          to="/rewards"
          className="inline-flex items-center gap-2 mt-4 bg-green-50 border border-green-200 text-green-800 text-sm font-medium rounded-lg px-4 py-2 hover:bg-green-100 transition-colors"
        >
          <Award size={15} aria-hidden="true" />
          Every action earns ZOE points — see the Rewards Programme
        </Link>
      </div>

      {/* Participation options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        {participationOptions.map((option) => {
          const Icon = iconMap[option.icon] ?? Lightbulb;
          const isActive = activeOption === option.id;
          return (
            <button
              key={option.id}
              onClick={() => {
                setActiveOption(isActive ? null : option.id);
                setSubmitted(false);
                setForm((f) => ({ ...f, type: option.id }));
              }}
              className={`text-left rounded-xl border p-5 transition-all hover:shadow-md ${
                isActive
                  ? 'border-green-400 bg-green-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-green-200'
              }`}
              aria-pressed={isActive}
            >
              <div
                className={`inline-flex p-2.5 rounded-lg mb-3 ${
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                <Icon size={22} aria-hidden="true" />
              </div>
              <h2 className="font-semibold text-gray-900 mb-1.5">
                {option.title}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {option.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`text-sm font-medium ${
                    isActive ? 'text-green-700' : 'text-gray-400'
                  }`}
                >
                  {isActive ? '↑ Selected' : option.actionLabel + ' →'}
                </span>
                {optionPoints[option.id] && (
                  <span className="text-xs font-semibold bg-amber-100 text-amber-800 rounded-full px-2 py-0.5">
                    +{optionPoints[option.id]} pts
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Form panel */}
      {activeOption && (
        <div
          id="participation-form"
          className="bg-white rounded-xl border border-green-200 shadow-sm p-6 sm:p-8 mb-10"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {participationOptions.find((o) => o.id === activeOption)
                  ?.title ?? 'Submit'}
              </h2>
              <p className="text-xs text-amber-700 mt-1 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 inline-block">
                Prototype: this form does not send data anywhere. Local
                success message only.
              </p>
            </div>
            <button
              onClick={() => setActiveOption(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close form"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle2
                size={48}
                className="mx-auto text-green-500 mb-4"
                aria-hidden="true"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Thank you for your submission!
              </h3>
              <p className="text-gray-600 mb-2">
                In a real deployment, your input would be sent to the ZOE
                coordination team for review.
              </p>
              <p className="text-sm text-amber-700">
                Note: This is a prototype. No data was transmitted or stored.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setActiveOption(null);
                }}
                className="mt-6 text-green-700 underline text-sm"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="part-name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Name
                  </label>
                  <input
                    id="part-name"
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    required
                    placeholder="Maria Georgiou"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="part-email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    id="part-email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    required
                    placeholder="maria@example.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="part-message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Message or Idea
                </label>
                <textarea
                  id="part-message"
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  required
                  placeholder="Describe your idea, availability, or issue here..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setForm(emptyForm)}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Clear
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Events CTA */}
      <div className="bg-teal-50 rounded-xl border border-teal-200 p-6 text-center">
        <h2 className="font-semibold text-teal-900 mb-2">
          Looking for upcoming events?
        </h2>
        <p className="text-teal-700 text-sm mb-4">
          Join a cleanup day, biodiversity workshop, or community forum in
          person.
        </p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-teal-700 transition-colors text-sm"
        >
          <Calendar size={16} aria-hidden="true" />
          Browse upcoming events
        </Link>
      </div>
    </div>
  );
}

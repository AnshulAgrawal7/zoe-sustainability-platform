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
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [activeOption, setActiveOption] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setForm(emptyForm);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {t('participate.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
          {t('participate.subtitle')}
        </p>
        <Link
          to="/rewards"
          className="inline-flex items-center gap-2 mt-4 bg-green-50 border border-green-200 text-green-800 text-sm font-medium rounded-lg px-4 py-2 hover:bg-green-100 transition-colors dark:bg-green-900/20 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/30"
        >
          <Award size={15} aria-hidden="true" />
          {t('participate.rewardsLink')}
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
                  ? 'border-green-400 bg-green-50 shadow-sm dark:bg-green-900/20 dark:border-green-600'
                  : 'border-gray-200 bg-white hover:border-green-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-700'
              }`}
              aria-pressed={isActive}
            >
              <div
                className={`inline-flex p-2.5 rounded-lg mb-3 ${
                  isActive
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                <Icon size={22} aria-hidden="true" />
              </div>
              <h2 className="font-semibold text-gray-900 dark:text-white mb-1.5">
                {option.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {option.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`text-sm font-medium ${
                    isActive ? 'text-green-700 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {isActive ? t('participate.selected') : option.actionLabel + ' →'}
                </span>
                {optionPoints[option.id] && (
                  <span className="text-xs font-semibold bg-amber-100 text-amber-800 rounded-full px-2 py-0.5 dark:bg-amber-900/30 dark:text-amber-300">
                    {t('participate.pts', { points: optionPoints[option.id] })}
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
          className="bg-white dark:bg-gray-800 rounded-xl border border-green-200 dark:border-green-800 shadow-sm p-6 sm:p-8 mb-10"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {participationOptions.find((o) => o.id === activeOption)
                  ?.title ?? t('participate.submitButton')}
              </h2>
              <p className="text-xs text-amber-700 mt-1 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 inline-block dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300">
                {t('participate.prototypeNotice')}
              </p>
            </div>
            <button
              onClick={() => setActiveOption(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors dark:hover:text-gray-200"
              aria-label={t('common.close')}
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
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('participate.thankYou')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {t('participate.deploymentNote')}
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {t('participate.prototypeNote')}
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setActiveOption(null);
                }}
                className="mt-6 text-green-700 underline text-sm dark:text-green-400"
              >
                {t('common.close')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="part-name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    {t('participate.yourName')}
                  </label>
                  <input
                    id="part-name"
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    required
                    placeholder={t('participate.namePlaceholder')}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="part-email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    {t('participate.emailAddress')}
                  </label>
                  <input
                    id="part-email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    required
                    placeholder={t('participate.emailPlaceholder')}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="part-message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {t('participate.yourMessage')}
                </label>
                <textarea
                  id="part-message"
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  required
                  placeholder={t('participate.messagePlaceholder')}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  {t('participate.submitButton')}
                </button>
                <button
                  type="button"
                  onClick={() => setForm(emptyForm)}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  {t('participate.clearButton')}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Events CTA */}
      <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-200 dark:border-teal-800 p-6 text-center">
        <h2 className="font-semibold text-teal-900 dark:text-teal-200 mb-2">
          {t('participate.eventsTitle')}
        </h2>
        <p className="text-teal-700 dark:text-teal-300 text-sm mb-4">
          {t('participate.eventsSubtitle')}
        </p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-teal-700 transition-colors text-sm"
        >
          <Calendar size={16} aria-hidden="true" />
          {t('participate.browseEvents')}
        </Link>
      </div>
    </div>
  );
}

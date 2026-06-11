import { useState } from 'react';
import Container from '../components/layout/Container';
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
import { trackEvent, ANALYTICS_EVENTS } from '../services/analytics';
import IdeaSubmitForm from '../components/engagement/IdeaSubmitForm';

const optionPoints: Record<string, number> = {
  'submit-idea': 15,
  volunteer: 25,
  'join-event': 20,
  'report-issue': 10,
  feedback: 10,
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
    // Conversion event — only the selected option type, never the message/PII.
    trackEvent(ANALYTICS_EVENTS.ideaSubmitted, {
      type: form.type || 'unknown',
    });
    setForm(emptyForm);
  }

  return (
    <Container className="py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
          {t('participate.title')}
        </h1>
        <p className="max-w-2xl leading-relaxed text-gray-600 dark:text-gray-300">
          {t('participate.subtitle')}
        </p>
        <Link
          to="/rewards"
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-800 transition-colors hover:bg-green-100 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30"
        >
          <Award size={15} aria-hidden="true" />
          {t('participate.rewardsLink')}
        </Link>
      </div>

      {/* Participation options */}
      <div className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
              className={`rounded-xl border p-5 text-left transition-all hover:shadow-md ${
                isActive
                  ? 'border-green-400 bg-green-50 shadow-sm dark:border-green-600 dark:bg-green-900/20'
                  : 'border-gray-200 bg-white hover:border-green-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-700'
              }`}
              aria-pressed={isActive}
            >
              <div
                className={`mb-3 inline-flex rounded-lg p-2.5 ${
                  isActive
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                <Icon size={22} aria-hidden="true" />
              </div>
              <h2 className="mb-1.5 font-semibold text-gray-900 dark:text-white">
                {t(`participationOpts.${option.id}.title`)}
              </h2>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {t(`participationOpts.${option.id}.description`)}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`text-sm font-medium ${
                    isActive
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {isActive
                    ? t('participate.selected')
                    : t(`participationOpts.${option.id}.actionLabel`) + ' →'}
                </span>
                {optionPoints[option.id] && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
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
          className="mb-10 rounded-xl border border-green-200 bg-white p-6 shadow-sm dark:border-green-800 dark:bg-gray-800 sm:p-8"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {activeOption
                  ? t(`participationOpts.${activeOption}.title`)
                  : t('participate.submitButton')}
              </h2>
              {activeOption !== 'submit-idea' && (
                <p className="mt-1 inline-block rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                  {t('participate.prototypeNotice')}
                </p>
              )}
            </div>
            <button
              onClick={() => setActiveOption(null)}
              className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
              aria-label={t('common.close')}
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          {activeOption === 'submit-idea' ? (
            <IdeaSubmitForm onClose={() => setActiveOption(null)} />
          ) : submitted ? (
            <div className="py-8 text-center">
              <CheckCircle2
                size={48}
                className="mx-auto mb-4 text-green-500"
                aria-hidden="true"
              />
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                {t('participate.thankYou')}
              </h3>
              <p className="mb-2 text-gray-600 dark:text-gray-300">
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
                className="mt-6 text-sm text-green-700 underline dark:text-green-400"
              >
                {t('common.close')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="part-name"
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="part-email"
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="part-message"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="rounded-lg bg-green-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-green-700"
                >
                  {t('participate.submitButton')}
                </button>
                <button
                  type="button"
                  onClick={() => setForm(emptyForm)}
                  className="text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {t('participate.clearButton')}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Events CTA */}
      <div className="rounded-xl border border-teal-200 bg-teal-50 p-6 text-center dark:border-teal-800 dark:bg-teal-900/20">
        <h2 className="mb-2 font-semibold text-teal-900 dark:text-teal-200">
          {t('participate.eventsTitle')}
        </h2>
        <p className="mb-4 text-sm text-teal-700 dark:text-teal-300">
          {t('participate.eventsSubtitle')}
        </p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700"
        >
          <Calendar size={16} aria-hidden="true" />
          {t('participate.browseEvents')}
        </Link>
      </div>
    </Container>
  );
}

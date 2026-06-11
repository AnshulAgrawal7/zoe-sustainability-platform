import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Info,
  MessageSquare,
} from 'lucide-react';
import { getPublicIdeas } from '../services/ideaService';
import type { PublicIdea, ApiProjectCategory } from '../types';

const CATEGORIES: ApiProjectCategory[] = [
  'ENVIRONMENT',
  'MOBILITY',
  'COMMUNITY',
  'EDUCATION',
  'CULTURE',
];

const LOCALES: Record<string, string> = {
  en: 'en-GB',
  el: 'el-GR',
  de: 'de-DE',
};

const categoryColors: Record<string, string> = {
  ENVIRONMENT:
    'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  MOBILITY: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  COMMUNITY:
    'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  EDUCATION: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
  CULTURE: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
};

export default function IdeasPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2);
  const locale = LOCALES[lang] ?? 'en-GB';

  const [ideas, setIdeas] = useState<PublicIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    getPublicIdeas()
      .then(setIdeas)
      .catch(() => setIdeas([]))
      .finally(() => setLoading(false));
  }, []);

  const visible = ideas.filter(
    (i) => !categoryFilter || i.category === categoryFilter
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-white">
          <Lightbulb
            size={26}
            aria-hidden="true"
            className="text-green-600 dark:text-green-400"
          />
          {t('ideasBoard.title')}
        </h1>
        <p className="max-w-2xl text-gray-600 dark:text-gray-300">
          {t('ideasBoard.intro')}
        </p>
        <p className="mt-2 inline-block rounded border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
          {t('ideasBoard.demoNote')}
        </p>
      </div>

      {/* How it works + submit CTA */}
      <div className="mb-8 flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Info
            size={16}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-green-600 dark:text-green-400"
          />
          {t('ideasBoard.howItWorks')}
        </p>
        <Link
          to="/participate"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
        >
          {t('ideasBoard.submitCta')}
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>

      {/* Category filter */}
      <div
        className="mb-6 flex flex-wrap items-center gap-2"
        role="group"
        aria-label={t('ideasBoard.filterBy')}
      >
        <button
          onClick={() => setCategoryFilter('')}
          aria-pressed={!categoryFilter}
          className={`rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
            !categoryFilter
              ? 'border-green-600 bg-green-600 text-white'
              : 'border-gray-300 bg-white text-gray-600 hover:border-green-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          {t('ideasBoard.all')}
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c === categoryFilter ? '' : c)}
            aria-pressed={categoryFilter === c}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
              categoryFilter === c
                ? 'border-green-600 bg-green-600 text-white'
                : 'border-gray-300 bg-white text-gray-600 hover:border-green-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {t(`projects.category.${c}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="py-16 text-center text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : visible.length === 0 ? (
        <div className="py-16 text-center text-gray-500 dark:text-gray-400">
          <p className="mb-3">{t('ideasBoard.empty')}</p>
          <Link
            to="/participate"
            className="font-medium text-green-700 underline dark:text-green-400"
          >
            {t('ideasBoard.emptyCta')}
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
            {t('ideasBoard.found', { count: visible.length })}
          </p>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {visible.map((idea) => (
              <li
                key={idea.id}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      categoryColors[idea.category] ??
                      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {t(`projects.category.${idea.category}`)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/40 dark:text-green-300">
                    <CheckCircle2 size={12} aria-hidden="true" />
                    {t('ideasBoard.approved')}
                  </span>
                </div>
                <h2 className="mb-1 text-base font-bold text-gray-900 dark:text-white">
                  {idea.title}
                </h2>
                <p className="mb-3 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {idea.description}
                </p>
                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
                  <time
                    dateTime={idea.createdAt}
                    className="text-xs text-gray-400 dark:text-gray-500"
                  >
                    {new Date(idea.createdAt).toLocaleDateString(locale, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </time>
                  <Link
                    to={`/ideas/${idea.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 hover:underline dark:text-green-400"
                  >
                    <MessageSquare size={13} aria-hidden="true" />
                    {t('ideasBoard.discuss')}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

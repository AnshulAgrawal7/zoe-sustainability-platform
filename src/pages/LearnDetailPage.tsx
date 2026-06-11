import { useState, useEffect } from 'react';
import Container from '../components/layout/Container';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, AlertCircle, Folder } from 'lucide-react';
import { getLearningResource } from '../services/learnService';
import EntityImage from '../components/ui/EntityImage';
import type { LearningResource } from '../types';

function parseSdgs(json: string): number[] {
  try {
    return JSON.parse(json) as number[];
  } catch {
    return [];
  }
}

export default function LearnDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const lang = i18n.language.slice(0, 2);

  const [resource, setResource] = useState<LearningResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const r = await getLearningResource(id!);
        if (!cancelled) {
          setResource(r);
          setNotFound(false);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  function pick(en: string, el: string, de: string): string {
    if (lang === 'el') return el;
    if (lang === 'de') return de;
    return en;
  }

  if (loading) {
    return (
      <Container maxW="3xl" className="py-20 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      </Container>
    );
  }

  if (notFound || !resource) {
    return (
      <Container maxW="3xl" className="py-20 text-center">
        <AlertCircle
          size={40}
          className="mx-auto mb-4 text-gray-400"
          aria-hidden="true"
        />
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          {t('learnDetail.notFound')}
        </p>
        <Link
          to="/learn"
          className="font-medium text-green-700 underline dark:text-green-400"
        >
          ← {t('learnDetail.back')}
        </Link>
      </Container>
    );
  }

  const sdgs = parseSdgs(resource.sdgIds);
  const title = pick(resource.titleEn, resource.titleEl, resource.titleDe);
  const body = pick(resource.bodyEn, resource.bodyEl, resource.bodyDe);

  return (
    <Container maxW="3xl" className="py-10">
      <Link
        to="/learn"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        {t('learnDetail.back')}
      </Link>

      <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        {resource.imageUrl && (
          <EntityImage
            src={resource.imageUrl}
            alt={title}
            category={resource.category}
            className="h-56 w-full sm:h-72"
          />
        )}
        <div className="p-6 sm:p-8">
          <span className="mb-3 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:bg-gray-700 dark:text-gray-400">
            {t(`projects.category.${resource.category}`)}
          </span>
          <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            {title}
          </h1>

          <div className="whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-300">
            {body}
          </div>

          {sdgs.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {sdgs.map((n) => (
                <span
                  key={n}
                  className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  SDG {n}
                </span>
              ))}
            </div>
          )}

          {resource.project && (
            <div className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-700">
              <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                {t('learnDetail.aboutProject')}
              </p>
              <Link
                to={`/projects/${resource.project.id}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:underline dark:text-green-400"
              >
                <Folder size={14} aria-hidden="true" />
                {pick(
                  resource.project.titleEn,
                  resource.project.titleEl,
                  resource.project.titleDe
                )}
              </Link>
            </div>
          )}
        </div>
      </article>
    </Container>
  );
}

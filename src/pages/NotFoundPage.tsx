import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Container from '../components/layout/Container';

/**
 * Catch-all 404 page (router `path: '*'`). Translated, keyboard-accessible and
 * mobile-first — gives a clear way back instead of a blank screen for any
 * unknown URL.
 */
export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <Container maxW="2xl" className="py-20 text-center">
      <Compass
        size={48}
        className="mx-auto mb-6 text-green-600 dark:text-green-400"
        aria-hidden="true"
      />
      <p className="mb-2 text-5xl font-bold text-gray-900 dark:text-white">
        404
      </p>
      <h1 className="mb-3 text-2xl font-semibold text-gray-900 dark:text-white">
        {t('notFound.title')}
      </h1>
      <p className="mx-auto mb-8 max-w-md leading-relaxed text-gray-600 dark:text-gray-300">
        {t('notFound.text')}
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
      >
        {t('notFound.home')}
      </Link>
    </Container>
  );
}

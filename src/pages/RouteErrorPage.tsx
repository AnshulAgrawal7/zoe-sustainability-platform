import { useTranslation } from 'react-i18next';
import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import Container from '../components/layout/Container';
import NotFoundPage from './NotFoundPage';

/**
 * Root-level `errorElement`. A thrown 404 response renders the friendly
 * NotFoundPage; any other thrown error (loader/render failure) shows a generic,
 * translated fallback instead of React Router's default white error screen.
 * Replaces the whole shell on purpose — chrome may itself be the failure source.
 */
export default function RouteErrorPage() {
  const { t } = useTranslation();
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />;
  }

  return (
    <Container maxW="2xl" className="py-20 text-center">
      <AlertTriangle
        size={48}
        className="mx-auto mb-6 text-amber-500"
        aria-hidden="true"
      />
      <h1 className="mb-3 text-2xl font-semibold text-gray-900 dark:text-white">
        {t('errorBoundary.title')}
      </h1>
      <p className="mx-auto mb-8 max-w-md leading-relaxed text-gray-600 dark:text-gray-300">
        {t('errorBoundary.text')}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
        >
          {t('errorBoundary.home')}
        </Link>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
        >
          {t('errorBoundary.retry')}
        </button>
      </div>
    </Container>
  );
}

import { Component, type ErrorInfo, type ReactNode } from 'react';
import i18n from '../utils/i18n';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Last-resort React error boundary around the whole router. React Router's
 * per-route `errorElement` handles errors inside routes; this catches anything
 * that throws *outside* the route tree (e.g. the provider itself), so the user
 * never sees a blank white screen. Uses the i18next singleton directly because
 * a class component cannot call the `useTranslation` hook.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Surfaced to error-tracking in production (see Future_Work §8.4). Kept off
    // the console in normal builds; logged only in DEV for local debugging.
    if (import.meta.env.DEV) {
      console.error('Unhandled UI error:', error, info.componentStack);
    }
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    const t = i18n.t.bind(i18n);
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center dark:bg-gray-900"
        role="alert"
      >
        <h1 className="mb-3 text-2xl font-semibold text-gray-900 dark:text-white">
          {t('errorBoundary.title')}
        </h1>
        <p className="mb-8 max-w-md leading-relaxed text-gray-600 dark:text-gray-300">
          {t('errorBoundary.text')}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
        >
          {t('errorBoundary.retry')}
        </button>
      </div>
    );
  }
}

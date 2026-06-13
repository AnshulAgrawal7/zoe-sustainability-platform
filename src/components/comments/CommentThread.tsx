import { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, MessageSquare, Info } from 'lucide-react';
import MentionTextarea from './MentionTextarea';
import type { PublicComment } from '../../types';

const LOCALES: Record<string, string> = {
  en: 'en-GB',
  el: 'el-GR',
  de: 'de-DE',
};

const MENTION_SPLIT = /(@[a-z0-9_]{3,20})/gi;

// Render a comment body, visually emphasising @username mentions.
function renderBody(body: string) {
  return body.split(MENTION_SPLIT).map((part, i) =>
    /^@[a-z0-9_]{3,20}$/i.test(part) ? (
      <span
        key={i}
        className="font-semibold text-green-700 dark:text-green-400"
      >
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}

interface Props {
  comments: PublicComment[];
  isAuthenticated: boolean;
  onSubmit: (body: string) => Promise<void>;
  onLike: (commentId: string) => void;
}

// Shared discussion thread for ideas and events. Everyone can read; only
// logged-in users can post (a hint sits above the section). Supports @mentions
// via MentionTextarea.
export default function CommentThread({
  comments,
  isAuthenticated,
  onSubmit,
  onLike,
}: Props) {
  const { t, i18n } = useTranslation();
  const locale = LOCALES[i18n.language.slice(0, 2)] ?? 'en-GB';
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setError('');
    setPosting(true);
    try {
      await onSubmit(body.trim());
      setBody('');
    } catch {
      setError(t('comments.submitError'));
    } finally {
      setPosting(false);
    }
  }

  return (
    <section aria-labelledby="discussion-heading">
      <h2
        id="discussion-heading"
        className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white"
      >
        <MessageSquare
          size={18}
          aria-hidden="true"
          className="text-green-600 dark:text-green-400"
        />
        {t('comments.discussion')}
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          ({t('comments.count', { count: comments.length })})
        </span>
      </h2>

      {/* Persistent hint above every comment section: read by all, write needs
          an account. */}
      <p className="mb-4 flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300">
        <Info size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
        <span>
          {t('comments.accountHint')}
          {!isAuthenticated && (
            <>
              {' '}
              <Link
                to="/login"
                className="font-medium text-green-700 underline dark:text-green-400"
              >
                {t('comments.login')}
              </Link>
            </>
          )}
        </span>
      </p>

      {comments.length === 0 ? (
        <p className="mb-6 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
          {t('comments.empty')}
        </p>
      ) : (
        <ul className="mb-6 space-y-3" aria-live="polite">
          {comments.map((c) => (
            <li
              key={c.id}
              className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  @{c.authorUsername}
                </span>
                <time
                  dateTime={c.createdAt}
                  className="text-xs text-gray-400 dark:text-gray-500"
                >
                  {formatDate(c.createdAt)}
                </time>
              </div>
              <p className="mb-3 whitespace-pre-line text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {renderBody(c.body)}
              </p>
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => onLike(c.id)}
                  aria-pressed={c.likedByMe}
                  aria-label={t('comments.likeAria', { count: c.likeCount })}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                    c.likedByMe
                      ? 'border-green-500 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-900/30 dark:text-green-300'
                      : 'border-gray-300 text-gray-600 hover:border-green-400 dark:border-gray-600 dark:text-gray-300'
                  }`}
                >
                  <Heart
                    size={13}
                    aria-hidden="true"
                    fill={c.likedByMe ? 'currentColor' : 'none'}
                  />
                  {c.likeCount}
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <Heart size={13} aria-hidden="true" />
                  {c.likeCount}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {isAuthenticated && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
        >
          <label
            htmlFor="comment-body"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t('comments.label')}
          </label>
          <MentionTextarea
            id="comment-body"
            value={body}
            onChange={setBody}
            placeholder={t('comments.placeholder')}
            aria-describedby={error ? 'comment-error' : undefined}
            aria-invalid={!!error}
          />
          {error && (
            <p
              id="comment-error"
              role="alert"
              className="mt-2 text-sm text-red-600 dark:text-red-400"
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={posting || !body.trim()}
            className="mt-3 rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {posting ? t('common.loading') : t('comments.submit')}
          </button>
        </form>
      )}
    </section>
  );
}

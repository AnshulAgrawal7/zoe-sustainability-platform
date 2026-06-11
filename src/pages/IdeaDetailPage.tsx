import { useState, useEffect } from 'react';
import Container from '../components/layout/Container';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Heart, MessageSquare, AlertCircle } from 'lucide-react';
import {
  getPublicIdeaDetail,
  postComment,
  toggleCommentLike,
} from '../services/commentService';
import { useAuthStore } from '../stores/authStore';
import type { PublicIdea, PublicComment } from '../types';

const LOCALES: Record<string, string> = {
  en: 'en-GB',
  el: 'el-GR',
  de: 'de-DE',
};

export default function IdeaDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const lang = i18n.language.slice(0, 2);
  const locale = LOCALES[lang] ?? 'en-GB';
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [idea, setIdea] = useState<PublicIdea | null>(null);
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const d = await getPublicIdeaDetail(id!);
        if (cancelled) return;
        setIdea(d.idea);
        setComments(d.comments);
        setNotFound(false);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !body.trim()) return;
    setError('');
    setPosting(true);
    try {
      const comment = await postComment(id, body.trim());
      setComments((prev) => [...prev, comment]);
      setBody('');
    } catch {
      setError(t('ideaDetail.submitError'));
    } finally {
      setPosting(false);
    }
  }

  async function handleLike(commentId: string) {
    try {
      const { liked, likeCount } = await toggleCommentLike(commentId);
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, likedByMe: liked, likeCount } : c
        )
      );
    } catch {
      /* a failed like is non-critical — leave the UI unchanged */
    }
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  if (loading) {
    return (
      <Container className="py-20 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      </Container>
    );
  }

  if (notFound || !idea) {
    return (
      <Container className="py-20 text-center">
        <AlertCircle
          size={40}
          className="mx-auto mb-4 text-gray-400"
          aria-hidden="true"
        />
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          {t('ideaDetail.notFound')}
        </p>
        <Link
          to="/ideas"
          className="font-medium text-green-700 underline dark:text-green-400"
        >
          ← {t('ideaDetail.back')}
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <Link
        to="/ideas"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        {t('ideaDetail.back')}
      </Link>

      {/* Idea */}
      <article className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 sm:p-8">
        <span className="mb-3 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:bg-gray-700 dark:text-gray-400">
          {t(`projects.category.${idea.category}`)}
        </span>
        <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          {idea.title}
        </h1>
        <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
          {idea.description}
        </p>
        <time
          dateTime={idea.createdAt}
          className="text-xs text-gray-400 dark:text-gray-500"
        >
          {formatDate(idea.createdAt)}
        </time>
      </article>

      {/* Discussion */}
      <section aria-labelledby="discussion-heading">
        <h2
          id="discussion-heading"
          className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white"
        >
          <MessageSquare
            size={18}
            aria-hidden="true"
            className="text-green-600 dark:text-green-400"
          />
          {t('ideaDetail.discussion')}
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            ({t('ideaDetail.commentsCount', { count: comments.length })})
          </span>
        </h2>

        {/* Comment list */}
        {comments.length === 0 ? (
          <p className="mb-6 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
            {t('ideaDetail.noComments')}
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
                    {c.authorName}
                  </span>
                  <time
                    dateTime={c.createdAt}
                    className="text-xs text-gray-400 dark:text-gray-500"
                  >
                    {formatDate(c.createdAt)}
                  </time>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {c.body}
                </p>
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => void handleLike(c.id)}
                    aria-pressed={c.likedByMe}
                    aria-label={t('ideaDetail.likeAria', {
                      count: c.likeCount,
                    })}
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

        {/* Comment form (logged-in) or login prompt (guest) */}
        {isAuthenticated ? (
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <label
              htmlFor="comment-body"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t('ideaDetail.commentLabel')}
            </label>
            <textarea
              id="comment-body"
              required
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t('ideaDetail.commentPlaceholder')}
              className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            {error && (
              <p
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
              {posting ? t('common.loading') : t('ideaDetail.submit')}
            </button>
          </form>
        ) : (
          <p className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300">
            {t('ideaDetail.loginToComment')}{' '}
            <Link
              to="/login"
              className="font-medium text-green-700 underline dark:text-green-400"
            >
              {t('ideaDetail.login')}
            </Link>
          </p>
        )}
      </section>
    </Container>
  );
}

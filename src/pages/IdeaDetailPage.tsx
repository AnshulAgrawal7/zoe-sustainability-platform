import { useState, useEffect } from 'react';
import Container from '../components/layout/Container';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, AlertCircle, ThumbsUp } from 'lucide-react';
import {
  getPublicIdeaDetail,
  postComment,
  toggleCommentLike,
} from '../services/commentService';
import { toggleIdeaVote } from '../services/ideaService';
import { useAuthStore } from '../stores/authStore';
import CommentThread from '../components/comments/CommentThread';
import type { PublicIdea, PublicComment } from '../types';

const LOCALES: Record<string, string> = {
  en: 'en-GB',
  el: 'el-GR',
  de: 'de-DE',
};

export default function IdeaDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const locale = LOCALES[i18n.language.slice(0, 2)] ?? 'en-GB';
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [idea, setIdea] = useState<PublicIdea | null>(null);
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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

  async function handleSubmit(body: string) {
    if (!id) return;
    const comment = await postComment(id, body);
    setComments((prev) => [...prev, comment]);
  }

  async function handleVote() {
    if (!idea) return;
    const optimistic = {
      ...idea,
      votedByMe: !idea.votedByMe,
      voteCount: idea.voteCount + (idea.votedByMe ? -1 : 1),
    };
    setIdea(optimistic);
    try {
      const { voted, voteCount } = await toggleIdeaVote(idea.id);
      setIdea((prev) =>
        prev ? { ...prev, votedByMe: voted, voteCount } : prev
      );
    } catch {
      setIdea(idea); // revert
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
      {/* Single-column idea + discussion → reading-width column (FU2-2). */}
      <div className="mx-auto max-w-prose">
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <time
              dateTime={idea.createdAt}
              className="text-xs text-gray-400 dark:text-gray-500"
            >
              {formatDate(idea.createdAt)}
            </time>
            {/* Support vote (participatory prioritization). */}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => void handleVote()}
                aria-pressed={idea.votedByMe}
                aria-label={t('ideasBoard.voteAria', { count: idea.voteCount })}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                  idea.votedByMe
                    ? 'border-green-500 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-900/30 dark:text-green-300'
                    : 'border-gray-300 text-gray-600 hover:border-green-400 dark:border-gray-600 dark:text-gray-300'
                }`}
              >
                <ThumbsUp
                  size={15}
                  aria-hidden="true"
                  fill={idea.votedByMe ? 'currentColor' : 'none'}
                />
                {idea.votedByMe
                  ? t('ideasBoard.voted', { count: idea.voteCount })
                  : t('ideasBoard.vote', { count: idea.voteCount })}
              </button>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                <ThumbsUp size={15} aria-hidden="true" />
                {t('ideasBoard.votes', { count: idea.voteCount })}
              </span>
            )}
          </div>
        </article>

        <CommentThread
          comments={comments}
          isAuthenticated={isAuthenticated}
          onSubmit={handleSubmit}
          onLike={handleLike}
        />
      </div>
    </Container>
  );
}

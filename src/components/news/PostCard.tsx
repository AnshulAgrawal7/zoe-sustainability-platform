import { useTranslation } from 'react-i18next';
import { Sparkles, CheckCircle2, Megaphone } from 'lucide-react';
import { pickLang } from '../../utils/i18nFields';
import type { Post, PostType } from '../../types';

const TYPE_META: Record<
  PostType,
  { Icon: React.ElementType; classes: string }
> = {
  PROJECT_NEW: {
    Icon: Sparkles,
    classes:
      'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  },
  PROJECT_COMPLETED: {
    Icon: CheckCircle2,
    classes: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  },
  ANNOUNCEMENT: {
    Icon: Megaphone,
    classes:
      'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  },
};

export default function PostCard({
  post,
  compact,
}: {
  post: Post;
  compact?: boolean;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const meta = TYPE_META[post.type] ?? TYPE_META.ANNOUNCEMENT;
  const title = pickLang(lang, post.titleEn, post.titleEl, post.titleDe);
  const body = pickLang(lang, post.bodyEn, post.bodyEl, post.bodyDe);
  const date = new Date(post.createdAt).toLocaleDateString(lang, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      {post.imageUrl && !compact && (
        <img
          src={post.imageUrl}
          alt=""
          aria-hidden="true"
          className="h-40 w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.classes}`}
          >
            <meta.Icon size={12} aria-hidden="true" />
            {t(`news.types.${post.type}`)}
          </span>
          <time
            dateTime={post.createdAt}
            className="text-xs text-gray-400 dark:text-gray-500"
          >
            {date}
          </time>
        </div>
        <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p
          className={`text-sm text-gray-600 dark:text-gray-400 ${compact ? 'line-clamp-2' : 'line-clamp-4'}`}
        >
          {body}
        </p>
      </div>
    </article>
  );
}

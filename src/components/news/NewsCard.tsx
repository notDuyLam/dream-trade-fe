import type { NewsArticle } from '@/types/trading';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

import { normalizeCategory } from '@/services/news/newsService';

type NewsCardProps = {
  article: NewsArticle;
};

export const NewsCard = ({ article }: NewsCardProps) => {
  const { t } = useLanguage();

  const formattedDate = new Date(article.published_date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return diffInMinutes <= 1 ? '1 phút trước' : `${diffInMinutes} phút trước`;
    }
    if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    }
    if (diffInDays === 1) {
      return '1 ngày trước';
    }
    if (diffInDays < 7) {
      return `${diffInDays} ngày trước`;
    }
    return formattedDate;
  };

  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-slate-300 bg-slate-100/80 shadow-lg shadow-black/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-emerald-400/50 hover:shadow-2xl hover:shadow-emerald-500/20 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-black/20 dark:hover:border-emerald-500/50"
    >
      <Link
        href={`/dashboard/news/${article._id}`}
        className="block"
      >
        {/* Featured Image */}
        <div className="relative h-52 w-full overflow-hidden bg-linear-to-br from-slate-700 to-slate-900">
          {article.image_url
            ? (
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )
            : (
                <div className="flex h-full items-center justify-center">
                  <svg
                    className="h-16 w-16 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
              )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

          {/* Category Badge */}
          {article.category && (
            <div className="absolute top-3 left-3 max-w-[calc(100%-1.5rem)]">
              <span className="inline-block truncate rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold tracking-wider text-white uppercase shadow-lg shadow-emerald-500/50">
                {normalizeCategory(article.category) || article.category}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="mb-3 line-clamp-2 text-xl font-bold text-slate-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
            {article.title}
          </h3>

          {/* Description */}
          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {article.excerpt}
          </p>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {article.tags.slice(0, 3).map(tag => (
                <span
                  key={`${article._id}-${tag}`}
                  className="inline-block rounded-lg bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  #
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <span className="font-bold tracking-wider uppercase">
                {article.source}
              </span>
              {article.readingTime && (
                <>
                  <span className="text-slate-400 dark:text-slate-600">•</span>
                  <span>
                    {article.readingTime}
                    {' '}
                    {t('news.minRead')}
                  </span>
                </>
              )}
            </div>
            <time dateTime={article.published_date} className="text-xs font-medium text-slate-500 dark:text-slate-500">
              {timeAgo(article.published_date)}
            </time>
          </div>

          {/* Author */}
          {article.author && (
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-500">
              {t('news.author')}
              :
              {article.author}
            </div>
          )}
        </div>

        {/* Hover Glow Effect */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-emerald-500/10 via-transparent to-blue-500/10" />
        </div>
      </Link>
    </article>
  );
};

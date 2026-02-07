'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { newsService } from '@/services/news/newsService';
import type { NewsArticle } from '@/types/trading';
// import { useLanguage } from '@/contexts/LanguageContext';

type NewsDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

// Clean and sanitize article content
function cleanContent(content: string): string {
  // Remove common noise patterns from crawled content
  let cleaned = content;
  
  // Remove "Strict editorial policy" blocks
  cleaned = cleaned.replace(/Strict editorial policy[\s\S]*?(?=<|$)/gi, '');
  
  // Remove disclaimer sections
  cleaned = cleaned.replace(/Disclaimer:[\s\S]*?(?=<p|<h|$)/gi, '');
  
  // Remove very long author bio sections (usually at the end)
  cleaned = cleaned.replace(/<p>[\s\S]*?is a writer[\s\S]*?<\/p>/gi, '');
  
  // Remove repeated metadata
  cleaned = cleaned.replace(/Morbi pretium leo[\s\S]*?eu odio\./gi, '');
  
  return cleaned.trim();
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);
  // const { t } = useLanguage();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true);
        setError(null);
        const data = await newsService.getArticleById(id);
        setArticle(data);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Không thể tải bài viết. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [id]);

  const formattedDate = article
    ? new Date(article.published_date).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          <p className="text-slate-600 dark:text-slate-400">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex h-full items-center justify-center bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
            <svg
              className="h-12 w-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            {error || 'Không tìm thấy bài viết'}
          </p>
          <button
            onClick={() => router.back()}
            className="rounded-lg bg-emerald-500 px-6 py-2 font-medium text-white transition-colors hover:bg-emerald-600"
            type="button"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white dark:bg-slate-950">
      {/* Header Buttons */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            type="button"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Quay lại
          </button>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-600"
          >
            Xem bài viết gốc
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Article Content */}
      <article className="mx-auto max-w-4xl px-4 py-8">
        {/* Category Badge */}
        {article.category && (
          <div className="mb-4">
            <span className="inline-block rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-bold tracking-wider text-white uppercase shadow-lg shadow-emerald-500/30">
              {article.category}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="mb-6 text-3xl font-bold leading-tight text-slate-900 md:text-4xl dark:text-white">
          {article.title}
        </h1>

        {/* Meta Info */}
        <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-slate-200 pb-6 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <span className="font-bold uppercase">{article.source}</span>
          </div>

          {article.author && (
            <>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>{article.author}</span>
              </div>
            </>
          )}

          <span className="text-slate-400 dark:text-slate-600">•</span>
          <time dateTime={article.published_date}>{formattedDate}</time>

          {article.readingTime && (
            <>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <span>
                {article.readingTime}
                {' '}
                phút đọc
              </span>
            </>
          )}
        </div>

        {/* Featured Image */}
        {article.image_url && (
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-2xl">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
          </div>
        )}

        {/* Description/Excerpt */}
        {article.description && (
          <div className="mb-6 rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-4 text-lg leading-relaxed text-slate-700 dark:bg-emerald-900/20 dark:text-slate-300">
            {article.description}
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg prose-slate max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:mb-4 prose-p:leading-relaxed prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-a:text-emerald-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline dark:prose-a:text-emerald-400 prose-strong:text-slate-900 dark:prose-strong:text-white prose-ul:my-4 prose-li:my-2 prose-img:rounded-lg prose-img:shadow-lg"
          dangerouslySetInnerHTML={{ __html: cleanContent(article.content) }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
            <h3 className="mb-3 text-sm font-semibold text-slate-700 uppercase dark:text-slate-300">
              Tags:
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <span
                  key={`${article._id}-${tag}`}
                  className="inline-block rounded-lg bg-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  #
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

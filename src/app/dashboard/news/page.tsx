import type { Metadata } from 'next';
import { NewsSection } from '@/components/news/NewsSection';
import { newsService } from '@/services/news/newsService';

export const metadata: Metadata = {
  title: 'Tin tức | Dream Trade',
  description: 'Cập nhật tin tức và phân tích thị trường crypto mới nhất',
};

export default async function NewsPage() {
  // Fetch initial news data on server
  let initialArticles: any[] = [];
  let initialTotal: number = 0;
  let error: string | null = null;

  try {
    const response = await newsService.getArticles({ page: 1, limit: 12 });
    initialArticles = response.data;
    initialTotal = response.meta.total;
  } catch (err) {
    console.error('Failed to fetch initial news:', err);
    error = err instanceof Error ? err.message : 'Failed to load news';
  }

  // If error, show error state
  if (error) {
    return (
      <main className="flex h-full flex-1 flex-col overflow-hidden bg-white px-4 py-6 md:px-8 dark:bg-slate-950">
        <div className="flex min-h-[600px] flex-col items-center justify-center rounded-2xl border border-slate-300 bg-slate-100/80 p-12 text-center backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60">
          <svg
            className="mb-4 h-16 w-16 text-rose-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
            Không thể tải tin tức
          </h3>
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
            {error}
          </p>
          <p className="text-xs text-slate-500">
            Vui lòng kiểm tra kết nối với backend crawler service
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-full flex-1 flex-col overflow-auto bg-white px-4 py-6 md:px-8 dark:bg-slate-950">
      <NewsSection
        initialArticles={initialArticles}
        initialTotal={initialTotal}
        initialPage={1}
      />
    </main>
  );
}

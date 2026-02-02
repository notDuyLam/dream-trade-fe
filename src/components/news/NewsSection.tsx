'use client';

import type { NewsArticle } from '@/types/trading';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useLanguage } from '@/contexts/LanguageContext';
import { newsService } from '@/services/news/newsService';

import { NewsCard } from './NewsCard';
import { NewsCardSkeleton } from './NewsCardSkeleton';
import { NewsFilters } from './NewsFilters';

type NewsSectionProps = {
  initialArticles: NewsArticle[];
  initialTotal: number;
  initialPage: number;
};

export const NewsSection = ({
  initialArticles,
  initialTotal,
  initialPage,
}: NewsSectionProps) => {
  const { t } = useLanguage();
  const [articles, setArticles] = useState<NewsArticle[]>(initialArticles);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(Math.ceil(initialTotal / 12));
  const [categories, setCategories] = useState<string[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCoin, setSelectedCoin] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Refs
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await newsService.getCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    void loadCategories();
  }, []);

  // Track scroll position for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      // Find the scrollable parent container
      const scrollableParent = containerRef.current?.closest('.overflow-auto') as HTMLElement;
      if (scrollableParent) {
        setShowScrollTop(scrollableParent.scrollTop > 400);
      }
    };

    // Find the scrollable parent and attach listener
    const scrollableParent = containerRef.current?.closest('.overflow-auto') as HTMLElement;
    if (scrollableParent) {
      scrollableParent.addEventListener('scroll', handleScroll);
      return () => scrollableParent.removeEventListener('scroll', handleScroll);
    }
    return undefined;
  }, []);

  // Scroll to top handler
  const scrollToTop = () => {
    const scrollableParent = containerRef.current?.closest('.overflow-auto') as HTMLElement;
    if (scrollableParent) {
      scrollableParent.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  // Load more articles
  const loadMoreArticles = useCallback(async () => {
    // Only load more if not already loading, no error, and there are more pages
    if (isLoading || hasError || currentPage >= totalPages) {
      return;
    }

    setIsLoading(true);
    setHasError(false);
    try {
      const response = await newsService.getArticles({
        page: currentPage + 1,
        limit: 12,
        q: searchQuery,
        category: selectedCategory,
        coin: selectedCoin,
        sortBy,
      });

      setArticles(prev => [...prev, ...response.data]);
      setCurrentPage(response.meta.page);
      setTotalPages(response.meta.total_pages);
      setHasError(false);
    } catch (error) {
      console.error('Failed to load more articles:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, totalPages, isLoading, hasError, searchQuery, selectedCategory, selectedCoin, sortBy]);

  // Handle filter changes with debounce for search
  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchFilteredArticles = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
          const response = await newsService.getArticles({
            page: 1,
            limit: 12,
            q: searchQuery || undefined,
            category: selectedCategory || undefined,
            coin: selectedCoin || undefined,
            sortBy,
          });
          setArticles(response.data);
          setCurrentPage(1);
          setTotalPages(response.meta.total_pages);
        } catch (error) {
          console.error('Failed to fetch filtered articles:', error);
          setHasError(true);
        } finally {
          setIsLoading(false);
        }
      };

      // Always fetch when filters change (including reset to empty)
      void fetchFilteredArticles();
    }, searchQuery ? 500 : 0); // Debounce search, but not category/coin/sort

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedCoin, sortBy]);

  // Backend now handles sorting, so we use articles directly

  // Setup infinite scroll observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isLoading && !hasError && currentPage < totalPages) {
          void loadMoreArticles();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreTriggerRef.current) {
      observerRef.current.observe(loadMoreTriggerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreArticles, isLoading, currentPage, totalPages, hasError]);

  return (
    <div ref={containerRef} className="relative space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t('news.title')}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {t('news.subtitle')}
        </p>
      </div>

      {/* Filters */}
      <NewsFilters
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        onCoinChange={setSelectedCoin}
        onSortChange={setSortBy}
        categories={categories}
        selectedCategory={selectedCategory}
        selectedCoin={selectedCoin}
        selectedSort={sortBy}
      />

      {/* Articles Grid */}
      {articles.length > 0
        ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map(article => (
                <NewsCard key={article._id} article={article} />
              ))}
            </div>
          )
        : !isLoading && (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-300 bg-slate-100/80 p-12 text-center backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60">
              <svg
                className="mb-4 h-16 w-16 text-slate-400"
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
              <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                {t('news.noResults')}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc
              </p>
            </div>
          )}

      {/* Loading Skeletons - only show on initial load or when list is empty */}
      {isLoading && articles.length === 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map(id => (
            <NewsCardSkeleton key={`skeleton-${id}`} />
          ))}
        </div>
      )}

      {/* Infinite Scroll Trigger - always render when there are more pages */}
      {currentPage < totalPages && (
        <div
          ref={loadMoreTriggerRef}
          className="flex min-h-[100px] items-center justify-center py-8"
        >
          {isLoading && articles.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <svg
                className="h-5 w-5 animate-spin text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Đang tải thêm tin tức...</span>
            </div>
          )}
          {hasError && (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-red-500">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Không thể tải thêm tin tức</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setHasError(false);
                  void loadMoreArticles();
                }}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-emerald-600"
              >
                Thử lại
              </button>
            </div>
          )}
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed right-8 bottom-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-110 hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/40 focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:outline-none dark:bg-emerald-600 dark:hover:bg-emerald-500"
          aria-label="Scroll to top"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

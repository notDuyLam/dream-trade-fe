'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

type NewsFiltersProps = {
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: string) => void;
  onCoinChange: (coin: string) => void;
  onSortChange: (sort: 'newest' | 'oldest') => void;
  categories: string[];
  selectedCategory: string;
  selectedCoin: string;
  selectedSort: 'newest' | 'oldest';
};

// Popular crypto coins for filtering
const POPULAR_COINS = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE'];

export const NewsFilters = ({
  onSearchChange,
  onCategoryChange,
  onCoinChange,
  onSortChange,
  categories,
  selectedCategory,
  selectedCoin,
  selectedSort,
}: NewsFiltersProps) => {
  const { t } = useLanguage();
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange(value);
  };

  const handleClearAll = () => {
    setSearchValue('');
    onSearchChange('');
    onCategoryChange('');
    onCoinChange('');
    onSortChange('newest');
  };

  const hasActiveFilters = searchValue || selectedCategory || selectedCoin || selectedSort !== 'newest';

  return (
    <div className="space-y-4">
      {/* Row 1: Search Bar + Clear Button + Sort */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <svg
              className="h-5 w-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={t('news.search')}
            className="w-full rounded-xl border border-slate-300 bg-slate-100/80 py-2.5 pr-4 pl-11 text-sm text-slate-900 backdrop-blur-sm transition-all placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>

        {/* Clear All Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearAll}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-100/80 px-4 py-2.5 text-sm font-semibold text-slate-700 backdrop-blur-sm transition-all hover:border-red-400 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-red-500 dark:hover:bg-red-950 dark:hover:text-red-400"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="hidden sm:inline">Xóa bộ lọc</span>
          </button>
        )}

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold tracking-wide text-slate-700 uppercase dark:text-slate-300">
            {t('news.sortBy')}
          </span>
          <select
            value={selectedSort}
            onChange={e => onSortChange(e.target.value as 'newest' | 'oldest')}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="newest">{t('news.newest')}</option>
            <option value="oldest">{t('news.oldest')}</option>
          </select>
        </div>
      </div>

      {/* Row 2: Category Filters */}
      <div className="space-y-2">
        <label className="text-xs font-bold tracking-wide text-slate-700 uppercase dark:text-slate-300">
          {t('news.category')}
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onCategoryChange('')}
            className={[
              'rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-wide transition-all',
              selectedCategory === ''
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/50'
                : 'border border-slate-300 bg-slate-100/80 text-slate-600 hover:border-emerald-400 hover:bg-emerald-50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:border-emerald-500 dark:hover:bg-emerald-950',
            ].join(' ')}
          >
            {t('news.allCategories')}
          </button>

          {categories.map(category => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={[
                'rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-wide transition-all',
                selectedCategory === category
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/50'
                  : 'border border-slate-300 bg-slate-100/80 text-slate-600 hover:border-emerald-400 hover:bg-emerald-50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:border-emerald-500 dark:hover:bg-emerald-950',
              ].join(' ')}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Row 3: Coin Filters */}
      <div className="space-y-2">
        <label
          htmlFor="coin-filters"
          className="text-xs font-bold tracking-wide text-slate-700 uppercase dark:text-slate-300"
        >
          Coin
        </label>
        <div id="coin-filters" className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onCoinChange('')}
            className={[
              'rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-wide transition-all',
              selectedCoin === ''
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-400/50'
                : 'border border-slate-300 bg-slate-100/80 text-slate-600 hover:border-blue-400 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:bg-blue-950',
            ].join(' ')}
          >
            All Coins
          </button>

          {POPULAR_COINS.map(coin => (
            <button
              key={coin}
              type="button"
              onClick={() => onCoinChange(coin)}
              className={[
                'rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-wide transition-all',
                selectedCoin === coin
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-400/50'
                  : 'border border-slate-300 bg-slate-100/80 text-slate-600 hover:border-blue-400 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:bg-blue-950',
              ].join(' ')}
            >
              {coin}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

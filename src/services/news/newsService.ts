/**
 * News Service - Crawler API Integration
 * Connects to backend crawler service to fetch news articles
 */

import type { NewsArticle, NewsFilters, NewsListResponse } from '@/types/trading';

// TODO: Update this URL once crawler service port is confirmed
// Default assumes crawler runs on same backend as market service
const API_BASE_URL = process.env.NEXT_PUBLIC_CRAWLER_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Calculate reading time based on word count
 * Average reading speed: 200 words per minute
 */
function calculateReadingTime(wordCount: number | null): number {
  if (!wordCount) {
    return 1;
  }
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Generate excerpt from content or description
 */
function generateExcerpt(article: NewsArticle): string {
  if (article.description) {
    return article.description.length > 150
      ? `${article.description.substring(0, 150)}...`
      : article.description;
  }

  if (article.content) {
    const plainText = article.content.replace(/<[^>]*>/g, '').trim();
    return plainText.length > 150
      ? `${plainText.substring(0, 150)}...`
      : plainText;
  }

  return 'No description available';
}

/**
 * Normalize category string to be clean and readable
 */
export function normalizeCategory(category: string | null): string | null {
  if (!category) {
    return null;
  }

  const cat = category.trim();

  // Fix specific messy categories
  if (cat.toUpperCase().includes('ETHEREUM NEWS')) {
    return 'Ethereum';
  }
  if (cat.toUpperCase() === 'PRESS RELEASES') {
    return 'Press Releases';
  }
  if (cat.toUpperCase() === 'TIN TỨC') {
    return 'Tin Tức';
  }
  if (cat.toUpperCase().includes('BITCOIN')) {
    return 'Bitcoin';
  }
  if (cat.toUpperCase().includes('BLOCKCHAIN')) {
    return 'Blockchain';
  }
  if (cat.toUpperCase().includes('DEFI')) {
    return 'DeFi';
  }
  if (cat.toUpperCase().includes('NFT')) {
    return 'NFT';
  }
  if (cat.toUpperCase().includes('METAVERSE')) {
    return 'Metaverse';
  }
  if (cat.toUpperCase().includes('ALTCOIN')) {
    return 'Altcoin';
  }
  if (cat.toUpperCase().includes('PHÂN TÍCH')) {
    return 'Phân Tích';
  }

  // Return original if valid, otherwise null
  if (cat.length > 20 || cat.length < 2) {
    return null;
  }

  return cat;
}

/**
 * Transform raw API article to include computed fields
 */
function transformArticle(article: NewsArticle): NewsArticle {
  return {
    ...article,
    excerpt: generateExcerpt(article),
    category: normalizeCategory(article.category),
    readingTime: calculateReadingTime(article.word_count),
  };
}

export const newsService = {
  /**
   * Fetch paginated list of articles
   */
  async getArticles(filters: NewsFilters = {}): Promise<NewsListResponse> {
    try {
      const params = new URLSearchParams();

      if (filters.page) {
        params.append('page', filters.page.toString());
      }
      if (filters.limit) {
        params.append('limit', filters.limit.toString());
      }
      if (filters.q) {
        params.append('q', filters.q);
      }
      if (filters.category) {
        params.append('category', filters.category);
      }
      if (filters.coin) {
        params.append('coin', filters.coin);
      }
      if (filters.sortBy) {
        params.append('sort', filters.sortBy);
      }

      const url = `${API_BASE_URL}/api/v1/articles?${params.toString()}`;

      const response = await fetch(url, {
        cache: 'no-store', // Always fetch fresh news
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data: NewsListResponse = await response.json();

      // Transform articles to include computed fields
      data.data = data.data.map(transformArticle);

      return data;
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      throw error;
    }
  },

  /**
   * Fetch single article by ID
   */
  async getArticleById(id: string): Promise<NewsArticle> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/articles/${id}`,
        { cache: 'no-store' },
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const article: NewsArticle = await response.json();
      return transformArticle(article);
    } catch (error) {
      console.error(`Failed to fetch article ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get unique categories from articles
   * Note: This is a client-side implementation
   * In production, backend should provide a dedicated endpoint
   */
  async getCategories(): Promise<string[]> {
    try {
      const response = await this.getArticles({ limit: 100 });
      const categories = new Set<string>();

      response.data.forEach((article) => {
        const normalized = normalizeCategory(article.category);
        if (normalized) {
          categories.add(normalized);
        }
      });

      return Array.from(categories).sort();
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  },

  /**
   * Get unique sources from articles
   * Note: This is a client-side implementation
   * In production, backend should provide a dedicated endpoint
   */
  async getSources(): Promise<string[]> {
    try {
      const response = await this.getArticles({ limit: 100 });
      const sources = new Set<string>();

      response.data.forEach((article) => {
        if (article.source) {
          sources.add(article.source);
        }
      });

      return Array.from(sources).sort();
    } catch (error) {
      console.error('Failed to fetch sources:', error);
      return [];
    }
  },
};

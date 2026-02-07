/**
 * AI Analysis Service - via API Gateway on port 8080
 * Flow: Client → Gateway (/analysis/analyze) → VipForAnalysisGuard (check JWT & VIP)
 *       → Subscription Service → If VIP → Proxy to AI Service
 *       → If NOT VIP → 403 Forbidden
 * Uses credentials: 'include' for cookie auth with JWT.
 */

import type { AiInsight, AnalysisEvent, ChartData, SentimentLabel, Timeframe, TradingSymbol } from '@/types/trading';
import { getAnalysisBaseUrl } from '@/services/api/client';

/** Backend analyze response shape (AI service) */
export type AnalysisApiResponse = {
  symbol?: string;
  coin?: string;
  hours_back?: number;
  articles_count?: number;
  timestamp?: string;
  summary?: Record<string, unknown> | string;
  /** Backend sends name + count (article counts per concept); legacy score is optional */
  top_concepts?: Array<{ name: string; count?: number; score?: number; [key: string]: unknown }>;
  top_articles?: Array<{
    title?: string;
    sentiment?: string;
    explanation?: string;
    [key: string]: unknown;
  }>;
  // New causal analysis fields
  granger_causality?: {
    sentiment_to_price: {
      is_causal: boolean;
      p_value: number;
      best_lag: number;
    };
    fear_greed_to_price: {
      is_causal: boolean;
      p_value: number;
      best_lag: number;
    };
  };
  correlations?: {
    correlation_matrix: Record<string, Record<string, number>>;
    p_values: Record<string, Record<string, number>>;
    method: string;
    significant_pairs: Array<{
      var1: string;
      var2: string;
      correlation: number;
      p_value: number;
      strength: string;
    }>;
  };
  lead_lag?: {
    sentiment_lead: number;
    max_correlation: number;
  };
  stationarity?: {
    sentiment: {
      series_name: string;
      adf_statistic: number;
      p_value: number;
      critical_values: {
        '1%': number;
        '5%': number;
        '10%': number;
      };
      is_stationary: boolean;
      interpretation: string;
    };
    price: {
      series_name: string;
      adf_statistic: number;
      p_value: number;
      critical_values: {
        '1%': number;
        '5%': number;
        '10%': number;
      };
      is_stationary: boolean;
      interpretation: string;
    };
    fear_greed: {
      series_name: string;
      adf_statistic: number;
      p_value: number;
      critical_values: {
        '1%': number;
        '5%': number;
        '10%': number;
      };
      is_stationary: boolean;
      interpretation: string;
    };
  };
  data_stats?: {
    observations: number;
    start_date: string;
    end_date: string;
    resample_frequency: string;
  };
  events?: AnalysisEvent[];
  chart_data?: ChartData;
};

const COIN_TO_SYMBOL: Record<string, TradingSymbol> = {
  BTC: 'BTCUSDT',
  ETH: 'ETHUSDT',
  BNB: 'BNBUSDT',
  SOL: 'SOLUSDT',
  XRP: 'XRPUSDT',
  ADA: 'ADAUSDT',
  DOGE: 'BTCUSDT', // DOGE not in TradingSymbol, fallback
};

function coinToTradingSymbol(coin: string): TradingSymbol {
  const normalized = coin.toUpperCase().replace('USDT', '');
  return COIN_TO_SYMBOL[normalized] ?? 'BTCUSDT';
}

function mapBackendSentiment(sentiment: string | undefined): SentimentLabel {
  if (!sentiment) {
    return 'neutral';
  }
  const s = sentiment.toLowerCase();
  if (s === 'positive' || s === 'bullish') {
    return 'bullish';
  }
  if (s === 'negative' || s === 'bearish') {
    return 'bearish';
  }
  return 'neutral';
}

/**
 * Map backend analyze response to AiInsight[] for AiInsightsPanel.
 * Backend provides: summary.overall_sentiment, summary.average_confidence, top_concepts[].count
 * New: Also handles causal analysis response with correlations, granger causality, etc.
 */
export function mapAnalyzeResponseToInsights(res: AnalysisApiResponse): AiInsight[] {
  const summaryObj
    = typeof res.summary === 'object' && res.summary !== null ? res.summary : {};

  const sentiment
    = 'overall_sentiment' in summaryObj
      ? String((summaryObj as { overall_sentiment?: string }).overall_sentiment ?? 'neutral')
      : 'sentiment' in summaryObj
        ? String((summaryObj as { sentiment?: string }).sentiment ?? 'neutral')
        : 'neutral';

  const direction
    = sentiment === 'positive' || sentiment === 'bullish'
      ? 'up'
      : sentiment === 'negative' || sentiment === 'bearish'
        ? 'down'
        : 'range';

  const confidence
    = typeof (summaryObj as { average_confidence?: number }).average_confidence === 'number'
      ? Math.min(1, Math.max(0, (summaryObj as { average_confidence: number }).average_confidence))
      : (res.top_concepts?.length ?? 0) > 0
          ? Math.min(
              1,
              Math.max(
                0,
                res.top_concepts!.reduce(
                  (a, c) => a + (typeof c.score === 'number' ? c.score : 0),
                  0,
                ) / res.top_concepts!.length,
              ),
            )
          : 0.5;

  // Extract summary text
  let summaryStr = 'AI analysis';
  if (typeof res.summary === 'string') {
    summaryStr = res.summary;
  } else if (summaryObj) {
    const causalSummary = summaryObj as {
      key_findings?: string[];
      actionable_insights?: string[];
      causal_relationships?: string[];
    };

    // Use first actionable insight or key finding as summary
    const allInsights = [
      ...(causalSummary.actionable_insights ?? []),
      ...(causalSummary.key_findings ?? []),
      ...(causalSummary.causal_relationships ?? []),
    ];

    if (allInsights.length > 0) {
      summaryStr = allInsights[0]!;
    }
  }

  // Build reasoning from multiple sources
  let reasoning: string[] = [];

  // 1. Try top_concepts first (for sentiment analysis)
  if (res.top_concepts && res.top_concepts.length > 0) {
    reasoning = res.top_concepts
      .slice(0, 7)
      .map(
        (c: { name: string; count?: number; score?: number }) =>
          `${c.name}: ${typeof c.count === 'number' ? c.count : (c.score ?? 0).toFixed(2)}`,
      );
  }

  // 2. If no top_concepts, try analysisSummary (for causal analysis)
  if (reasoning.length === 0 && summaryObj) {
    const causalSummary = summaryObj as {
      key_findings?: string[];
      actionable_insights?: string[];
      causal_relationships?: string[];
    };

    // Combine all insights (skip the first one as it's used in summary)
    const findings = causalSummary.key_findings ?? [];
    const insights = causalSummary.actionable_insights ?? [];
    const relationships = causalSummary.causal_relationships ?? [];

    const allInsights = [...insights, ...findings, ...relationships];
    // Skip first item if it's used as summary
    reasoning = allInsights.slice(1, 8);

    // If only 1 insight total, use it in reasoning too
    if (allInsights.length === 1) {
      reasoning = allInsights;
    }
  }

  // 3. Fallback to top_articles if still empty
  if (reasoning.length === 0 && (res.top_articles ?? []).length > 0) {
    res.top_articles!.slice(0, 5).forEach((a: { title?: string }) => {
      if (a.title) {
        reasoning.push(a.title);
      }
    });
  }

  const coinSymbol = res.symbol || res.coin || 'BTC';
  const symbol = coinToTradingSymbol(coinSymbol);
  const displaySymbol = `${String(coinSymbol).toUpperCase().replace(/USDT$/i, '')}USDT`;
  const timeframe: Timeframe = '1h';
  const dist
    = typeof (summaryObj as { sentiment_distribution?: { bullish?: number; bearish?: number; neutral?: number } })
      .sentiment_distribution === 'object'
      ? (summaryObj as { sentiment_distribution: { bullish?: number; bearish?: number; neutral?: number } })
          .sentiment_distribution
      : undefined;
  const fearGreed
    = typeof (summaryObj as { fear_greed_score?: number }).fear_greed_score === 'number'
      ? (summaryObj as { fear_greed_score: number }).fear_greed_score
      : undefined;

  const directionLabel
    = direction === 'up' ? 'upside' : direction === 'down' ? 'downside' : 'range-bound';
  const userSummary
    = res.articles_count && res.articles_count > 0
      ? `Based on ${res.articles_count} articles, sentiment is ${sentiment}. Short-term outlook: ${directionLabel} (next 60 mins).`
      : summaryStr;

  const topArticles = (res.top_articles ?? []).slice(0, 3).map(
    (a: { title?: string; sentiment?: string; explanation?: string }) => ({
      title: a.title ?? '',
      sentiment: a.sentiment,
      explanation: a.explanation,
    }),
  );

  const insight: AiInsight = {
    id: `ai-${coinSymbol}-${Date.now()}`,
    symbol,
    displaySymbol,
    timeframe,
    direction,
    confidence,
    summary: summaryStr,
    reasoning,
    catalystWindowMinutes: 60,
    sentiment: mapBackendSentiment(sentiment),
    userSummary,
    fearGreedScore: fearGreed,
    sentimentDistribution: dist
      ? {
          bullish: dist.bullish ?? 0,
          bearish: dist.bearish ?? 0,
          neutral: dist.neutral ?? 0,
        }
      : undefined,
    topArticles: topArticles.filter(a => a.title),
    articlesCount: res.articles_count,
    hoursBack: res.hours_back,
    grangerCausality: res.granger_causality,
    correlations: res.correlations,
    leadLag: res.lead_lag,
    stationarity: res.stationarity,
    dataStats: res.data_stats,
    analysisSummary: (summaryObj as { causal_relationships?: string[]; key_findings?: string[]; actionable_insights?: string[] })
      ? {
          causal_relationships: (summaryObj as { causal_relationships?: string[] }).causal_relationships ?? [],
          key_findings: (summaryObj as { key_findings?: string[] }).key_findings ?? [],
          actionable_insights: (summaryObj as { actionable_insights?: string[] }).actionable_insights ?? [],
        }
      : undefined,
    events: res.events,
    chartData: res.chart_data,

  };

  return [insight];
}

export type AnalyzeResult
  = | { success: true; data: AnalysisApiResponse }
    | { success: false; status: 401 | 403 | 404 | 503; message?: string };

/**
 * Payload matches backend AnalysisRequest: { coin_symbol: str, hours_back: int (1–720, default 24) }
 * Call Gateway POST /analysis/api/causal-analysis (port 8080).
 * Gateway validates VIP status via VipForAnalysisGuard and proxies to AI service.
 * Uses credentials: 'include' for JWT cookie auth.
 */
export async function analyzeCoin(
  coinSymbol: string,
  hoursBack: number = 24,
): Promise<AnalyzeResult> {
  const baseUrl = getAnalysisBaseUrl();
  const url = `${baseUrl}/analysis/api/causal-analysis`;
  const body = { coin_symbol: coinSymbol, hours_back: hoursBack };

  let response: Response;
  try {
    // Add 30-second timeout to prevent infinite loading
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    // Import fetchWithAuth at the top of the file for consistent auth handling
    const { fetchWithAuth } = await import('@/services/api/client');
    
    response = await fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return {
        success: false,
        status: 503,
        message: 'Request timeout. AI analysis is taking too long. Please try again later.',
      };
    }

    const msg
      = err instanceof TypeError && (err.message === 'Failed to fetch' || err.message.includes('fetch'))
        ? 'Cannot connect to API Gateway. Make sure it is running (port 8080).'
        : err instanceof Error
          ? err.message
          : 'Network error';
    return { success: false, status: 503, message: msg };
  }

  if (response.status === 401) {
    const text = await response.text();
    let message: string | undefined;
    try {
      const json = JSON.parse(text);
      message = json.message ?? text;
    } catch {
      message = text || 'Invalid or expired token';
    }
    return { success: false, status: 401, message };
  }

  if (response.status === 403) {
    const text = await response.text();
    let message: string | undefined;
    try {
      const json = JSON.parse(text);
      message = json.message ?? text;
    } catch {
      message = text || 'AI analysis is for VIP users only';
    }
    return { success: false, status: 403, message };
  }

  if (!response.ok) {
    const status = (response.status === 404 || response.status === 503
      ? response.status
      : 503) as 404 | 503;
    const text = await response.text();
    let message: string | undefined;
    try {
      const json = JSON.parse(text);
      message = json.message ?? json.detail ?? text;
    } catch {
      message = text || 'Analysis temporarily unavailable';
    }
    return { success: false, status, message };
  }

  const data: AnalysisApiResponse = await response.json();
  return { success: true, data };
}

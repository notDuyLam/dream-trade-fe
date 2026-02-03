/**
 * AI Analysis Service - Direct to AI service on port 3003
 * Uses NEXT_PUBLIC_ANALYSIS_API_URL and credentials: 'include' for cookie auth.
 */

import type { AiInsight, SentimentLabel, Timeframe, TradingSymbol } from '@/types/trading';
import { getAnalysisBaseUrl } from '@/services/api/client';

/** Backend analyze response shape (AI service) */
export type AnalysisApiResponse = {
  coin: string;
  articles_count: number;
  timestamp: string;
  summary: Record<string, unknown> | string;
  /** Backend sends name + count (article counts per concept); legacy score is optional */
  top_concepts: Array<{ name: string; count?: number; score?: number; [key: string]: unknown }>;
  top_articles: Array<{
    title?: string;
    sentiment?: string;
    explanation?: string;
    [key: string]: unknown;
  }>;
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
      : res.top_concepts?.length > 0
        ? Math.min(
            1,
            Math.max(
              0,
              res.top_concepts.reduce(
                (a, c) => a + (typeof c.score === 'number' ? c.score : 0),
                0,
              ) / res.top_concepts.length,
            ),
          )
        : 0.5;

  const summaryStr
    = typeof res.summary === 'string'
      ? res.summary
      : 'summary' in summaryObj
        ? String((summaryObj as { summary?: string }).summary ?? 'AI analysis')
        : 'AI analysis';

  const reasoning = (res.top_concepts ?? [])
    .slice(0, 7)
    .map(
      (c: { name: string; count?: number; score?: number }) =>
        `${c.name}: ${typeof c.count === 'number' ? c.count : (c.score ?? 0).toFixed(2)}`,
    );

  if (reasoning.length === 0 && (res.top_articles ?? []).length > 0) {
    res.top_articles!.slice(0, 5).forEach((a: { title?: string }) => {
      if (a.title) {
        reasoning.push(a.title);
      }
    });
  }

  const symbol = coinToTradingSymbol(res.coin);
  const displaySymbol = `${String(res.coin).toUpperCase().replace(/USDT$/i, '')}USDT`;
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
    = res.articles_count > 0
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
    id: `ai-${res.coin}-${Date.now()}`,
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
  };

  return [insight];
}

export type AnalyzeResult
  = | { success: true; data: AnalysisApiResponse }
    | { success: false; status: 401 | 403 | 404 | 503; message?: string };

/**
 * Payload matches backend AnalysisRequest: { coin_symbol: str, hours_back: int (1–720, default 24) }
 * Call AI service POST /api/analyze on port 3003. Uses credentials: 'include' for cookie auth.
 */
export async function analyzeCoin(
  coinSymbol: string,
  hoursBack: number = 24,
): Promise<AnalyzeResult> {
  const baseUrl = getAnalysisBaseUrl();
  const url = `${baseUrl}/api/analyze`;
  const body = { coin_symbol: coinSymbol, hours_back: hoursBack };

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
      cache: 'no-store',
    });
  } catch (err) {
    const msg
      = err instanceof TypeError && (err.message === 'Failed to fetch' || err.message.includes('fetch'))
        ? 'Cannot connect to AI Analysis service. Make sure it is running (e.g. port 3003).'
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

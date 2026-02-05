export type TradingSymbol
  = | 'BTCUSDT'
    | 'ETHUSDT'
    | 'BNBUSDT'
    | 'SOLUSDT'
    | 'XRPUSDT'
    | 'ADAUSDT';

export type Timeframe
  = | '1s'
    | '1m'
    | '5m'
    | '15m'
    | '1h'
    | '4h'
    | '1d'
    | '1s';

export type CandleDataPoint = {
  time: number; // epoch seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type RealtimePrice = {
  symbol: TradingSymbol;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  vol24h: number;
  updatedAt: number;
};

export type SentimentLabel = 'bullish' | 'bearish' | 'neutral';

// Enhanced NewsArticle type matching backend crawler API
export type NewsArticle = {
  _id: string;
  title: string;
  content: string;
  description: string | null;
  author: string | null;
  published_date: string; // ISO8601
  image_url: string | null;
  source: string;
  url: string;
  tags: string[];
  category: string | null;
  crawled_at: string; // ISO8601
  word_count: number | null;
  language: string | null;

  // Computed fields for display
  excerpt?: string; // Generated from description or content
  readingTime?: number; // Calculated from word_count
};

export type NewsListResponse = {
  data: NewsArticle[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
};

export type NewsFilters = {
  search?: string;
  q?: string; // New: for API search
  category?: string;
  coin?: string; // New: for API coin filter
  source?: string;
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'oldest';
};

// Causal Analysis Response Types
export type GrangerCausalityResult = {
  is_causal: boolean;
  p_value: number;
  best_lag: number;
};

export type SignificantCorrelationPair = {
  var1: string;
  var2: string;
  correlation: number;
  p_value: number;
  strength: string;
};

export type CorrelationAnalysis = {
  correlation_matrix: Record<string, Record<string, number>>;
  p_values: Record<string, Record<string, number>>;
  method: string;
  significant_pairs: SignificantCorrelationPair[];
};

export type LeadLagAnalysis = {
  sentiment_lead: number;
  max_correlation: number;
};

export type StationarityTest = {
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

export type DataStats = {
  observations: number;
  start_date: string;
  end_date: string;
  resample_frequency: string;
};

export type AnalysisSummary = {
  causal_relationships: string[];
  key_findings: string[];
  actionable_insights: string[];
};

export type AnalysisEvent = {
  timestamp: string;
  type: 'price_movement' | 'sentiment_spike';
  description: string;
  score: number;
  value: number;
};

export type ChartData = {
  timestamps: string[];
  price: number[];
  price_change: number[];
  sentiment: number[];
  fear_greed: number[];
  volume: number[];
};

export type AiInsight = {
  id: string;
  symbol: TradingSymbol;
  timeframe: Timeframe;
  direction: 'up' | 'down' | 'range';
  confidence: number; // 0 - 1
  summary: string;
  reasoning: string[];
  catalystWindowMinutes: number;
  sentiment: SentimentLabel;
  /** Display in UI: always the analyzed coin pair (e.g. ETHUSDT), from API res.coin – not fallback */
  displaySymbol?: string;
  /** Plain-language outlook for users (e.g. "Based on 175 articles, neutral. Range-bound in next 60 mins.") */
  userSummary?: string;
  /** Fear & Greed 0–100 from backend */
  fearGreedScore?: number;
  /** Bullish / bearish / neutral article counts */
  sentimentDistribution?: { bullish: number; bearish: number; neutral: number };
  /** Top articles driving this outlook (title + sentiment + short explanation) */
  topArticles?: Array<{ title: string; sentiment?: string; explanation?: string }>;
  /** Number of articles analyzed */
  articlesCount?: number;
  /** Hours back for analysis */
  hoursBack?: number;
  /** Granger causality test results */
  grangerCausality?: {
    sentiment_to_price: GrangerCausalityResult;
    fear_greed_to_price: GrangerCausalityResult;
  };
  /** Correlation analysis */
  correlations?: CorrelationAnalysis;
  /** Lead-lag analysis */
  leadLag?: LeadLagAnalysis;
  /** Stationarity tests */
  stationarity?: {
    sentiment: StationarityTest;
    price: StationarityTest;
    fear_greed: StationarityTest;
  };
  /** Data statistics */
  dataStats?: DataStats;
  /** Analysis summary with findings */
  analysisSummary?: AnalysisSummary;
  /** Significant events detected */
  events?: AnalysisEvent[];
  /** Time-series data for charting */
  chartData?: ChartData;
};

export type ChartTheme = 'dark' | 'light';

export type ChartDisplay = 'candles' | 'line';

/**
 * Binance WebSocket Kline (Candlestick) Data
 * Ref: https://binance-docs.github.io/apidocs/spot/en/#kline-candlestick-streams
 */
export type BinanceKlineData = {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  k: {
    t: number; // Kline start time
    T: number; // Kline close time
    s: string; // Symbol
    i: string; // Interval
    f: number; // First trade ID
    L: number; // Last trade ID
    o: string; // Open price
    c: string; // Close price
    h: string; // High price
    l: string; // Low price
    v: string; // Base asset volume
    n: number; // Number of trades
    x: boolean; // Is this kline closed?
    q: string; // Quote asset volume
    V: string; // Taker buy base asset volume
    Q: string; // Taker buy quote asset volume
    B: string; // Ignore
  };
};

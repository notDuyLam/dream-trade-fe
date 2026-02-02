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

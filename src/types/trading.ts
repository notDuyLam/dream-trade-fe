export type TradingSymbol
  = | 'BTCUSDT'
    | 'ETHUSDT'
    | 'BNBUSDT'
    | 'SOLUSDT'
    | 'XRPUSDT'
    | 'ADAUSDT';

export type Timeframe
  = | '1m'
    | '5m'
    | '15m'
    | '1h'
    | '4h'
    | '1d';

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
  updatedAt: number;
};

export type SentimentLabel = 'bullish' | 'bearish' | 'neutral';

export type NewsArticle = {
  id: string;
  title: string;
  source: string;
  url: string;
  excerpt: string;
  publishedAt: string;
  symbols: TradingSymbol[];
  sentiment: SentimentLabel;
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

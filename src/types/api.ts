export type ApiState = 'idle' | 'loading' | 'success' | 'error';

export type ApiError = {
  message: string;
  status?: number;
};

export type PaginatedResponse<TData> = {
  data: TData[];
  nextCursor?: string;
};

export type CandlesResponse<TCandle> = {
  symbol: string;
  timeframe: string;
  candles: TCandle[];
};

export type NewsResponse<TArticle> = PaginatedResponse<TArticle>;

export type AiInsightResponse<TInsight> = PaginatedResponse<TInsight>;

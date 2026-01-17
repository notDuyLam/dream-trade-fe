import type { CandleDataPoint, Timeframe, TradingSymbol } from '@/types/trading';

const BINANCE_API_BASE = 'https://api.binance.com/api/v3';

// Map timeframe to Binance interval format
const timeframeToInterval: Record<Timeframe, string> = {
  '1m': '1m',
  '5m': '5m',
  '15m': '15m',
  '1h': '1h',
  '4h': '4h',
  '1d': '1d',
};

type BinanceKline = {
  0: number; // Open time
  1: string; // Open
  2: string; // High
  3: string; // Low
  4: string; // Close
  5: string; // Volume
  6: number; // Close time
  7: string; // Quote asset volume
  8: number; // Number of trades
  9: string; // Taker buy base asset volume
  10: string; // Taker buy quote asset volume
  11: string; // Ignore
};

/**
 * Fetch candlestick data from Binance API
 */
export async function fetchBinanceCandles(params: { symbol: TradingSymbol; timeframe: Timeframe; limit?: number }): Promise<CandleDataPoint[]> {
  const { symbol, timeframe, limit = 500 } = params;
  const interval = timeframeToInterval[timeframe];

  try {
    const url = `${BINANCE_API_BASE}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status} ${response.statusText}`);
    }

    const data: BinanceKline[] = await response.json();

    // Convert Binance kline format to CandleDataPoint
    return data.map(kline => ({
      time: Math.floor(kline[0] / 1000), // Convert ms to seconds
      open: Number.parseFloat(kline[1]),
      high: Number.parseFloat(kline[2]),
      low: Number.parseFloat(kline[3]),
      close: Number.parseFloat(kline[4]),
      volume: Number.parseFloat(kline[5]),
    }));
  } catch (error) {
    console.error('Error fetching Binance candles:', error);
    throw error;
  }
}

/**
 * Fetch 24h ticker data from Binance
 */
export async function fetchBinance24hTicker(symbol: TradingSymbol) {
  try {
    const url = `${BINANCE_API_BASE}/ticker/24hr?symbol=${symbol}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return {
      symbol,
      price: Number.parseFloat(data.lastPrice),
      change24h: Number.parseFloat(data.priceChangePercent),
      high24h: Number.parseFloat(data.highPrice),
      low24h: Number.parseFloat(data.lowPrice),
      updatedAt: Date.now(),
    };
  } catch (error) {
    console.error('Error fetching Binance 24h ticker:', error);
    throw error;
  }
}

export const binanceService = {
  fetchCandles: fetchBinanceCandles,
  fetch24hTicker: fetchBinance24hTicker,
};

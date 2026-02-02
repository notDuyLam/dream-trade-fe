import type { CandleDataPoint, Timeframe, TradingSymbol } from '@/types/trading';
import { BinanceStreamService } from './binanceStreamService';

type KlineCallback = (candle: CandleDataPoint, isClosed: boolean) => void;

/**
 * Binance Kline (Candlestick) WebSocket Stream
 * Provides real-time candlestick updates for trading charts
 */
export class BinanceKlineStream {
  private streamService: BinanceStreamService;
  private subscriptions = new Map<string, () => void>();

  constructor() {
    this.streamService = BinanceStreamService.getInstance();
  }

  /**
   * Subscribe to kline updates for a symbol and timeframe
   * @param symbol - Trading symbol (e.g., 'BTCUSDT')
   * @param timeframe - Timeframe interval (e.g., '1m', '5m', '1h')
   * @param callback - Called with candle data and whether it's closed
   * @returns Unsubscribe function
   */
  subscribe(symbol: TradingSymbol, timeframe: Timeframe, callback: KlineCallback): () => void {
    // Map app timeframes to Binance intervals
    const intervalMap: Record<Timeframe, string> = {
      '1s': '1s',
      '1m': '1m',
      '5m': '5m',
      '15m': '15m',
      '1h': '1h',
      '4h': '4h',
      '1d': '1d',
    };

    const interval = intervalMap[timeframe] || '1m';
    const subscriptionKey = `${symbol}_${timeframe}`;

    // Prevent duplicate subscriptions
    if (this.subscriptions.has(subscriptionKey)) {
      console.warn(`[BinanceKlineStream] Already subscribed to ${subscriptionKey}`);
      return this.subscriptions.get(subscriptionKey)!;
    }

    // STANDARD KLINE SUBSCRIPTION (Now includes native 1s)
    const unsubscribe = this.streamService.subscribeKline(
      symbol.toLowerCase(),
      interval,
      (data: any) => {
        try {
          // Binance kline stream format: { stream: "...", data: { e: "kline", k: {...} } }
          const klineData = data.k;

          if (!klineData) {
            console.error('[BinanceKlineStream] Invalid kline data:', data);
            return;
          }

          const candle: CandleDataPoint = {
            time: Math.floor(klineData.t / 1000), // Convert ms to seconds
            open: Number.parseFloat(klineData.o),
            high: Number.parseFloat(klineData.h),
            low: Number.parseFloat(klineData.l),
            close: Number.parseFloat(klineData.c),
            volume: Number.parseFloat(klineData.v),
          };

          const isClosed = klineData.x === true;

          callback(candle, isClosed);
        } catch (error) {
          console.error('[BinanceKlineStream] Error parsing kline data:', error);
        }
      },
    );

    // Store unsubscribe function
    const wrappedUnsubscribe = () => {
      unsubscribe();
      this.subscriptions.delete(subscriptionKey);
      console.warn(`[BinanceKlineStream] Unsubscribed from ${subscriptionKey}`);
    };

    this.subscriptions.set(subscriptionKey, wrappedUnsubscribe);

    console.warn(`[BinanceKlineStream] Subscribed to ${symbol} @ ${interval}`);

    return wrappedUnsubscribe;
  }

  /**
   * Unsubscribe from all active subscriptions
   */
  unsubscribeAll() {
    this.subscriptions.forEach(unsubscribe => unsubscribe());
    this.subscriptions.clear();
  }
}

// Singleton instance
export const binanceKlineStream = new BinanceKlineStream();

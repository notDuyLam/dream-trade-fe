import type { Metadata } from 'next';
import type { CandleDataPoint, Timeframe, TradingSymbol } from '@/types/trading';
import { TradingWorkspace } from '@/components/trading/TradingWorkspace';
import { CoinService } from '@/services/coins/coinService';
import { marketService } from '@/services/market/marketService';

export const metadata: Metadata = {
  title: 'Workspace',
  description: 'Monitor markets, news, and AI signals in one place.',
};

type DashboardPageProps = {
  searchParams: Promise<{ symbol?: string }>;
};

export default async function DashboardPage(props: DashboardPageProps) {
  const searchParams = await props.searchParams;
  const DEFAULT_SYMBOL: TradingSymbol = (searchParams.symbol as TradingSymbol) || 'BTCUSDT';
  const DEFAULT_TIMEFRAME: Timeframe = '1h';

  // Validate symbol using CoinService
  const validSymbols = CoinService.getAllSymbols();
  const symbol = CoinService.isValidSymbol(DEFAULT_SYMBOL) ? DEFAULT_SYMBOL : (validSymbols[0] ?? 'BTCUSDT');

  // Fetch real data from Binance API via backend
  let initialCandles: CandleDataPoint[] = [];

  try {
    // Limit set to 500 to avoid Binance API errors (max is 1000 but can be unstable)
    const history = await marketService.getHistory(symbol, DEFAULT_TIMEFRAME, 500);

    initialCandles = history.data
      .map((candle: any) => {
      // Binance returns array format: [timestamp, open, high, low, close, volume, ...]
      // Or object format: { timestamp, open, high, low, close, volume }
        let timeInSeconds: number;
        let open: number, high: number, low: number, close: number, volume: number;

        if (Array.isArray(candle)) {
        // Array format from Binance
          timeInSeconds = Math.floor(candle[0] / 1000); // timestamp in ms
          open = Number.parseFloat(candle[1]);
          high = Number.parseFloat(candle[2]);
          low = Number.parseFloat(candle[3]);
          close = Number.parseFloat(candle[4]);
          volume = Number.parseFloat(candle[5]);
        } else {
        // Object format
          if (typeof candle.timestamp === 'number') {
            timeInSeconds = Math.floor(candle.timestamp / 1000);
          } else {
            const date = new Date(candle.timestamp);
            timeInSeconds = Math.floor(date.getTime() / 1000);
          }
          open = candle.open;
          high = candle.high;
          low = candle.low;
          close = candle.close;
          volume = candle.volume;
        }

        return {
          time: timeInSeconds,
          open,
          high,
          low,
          close,
          volume,
        };
      })
    // Filter out invalid data
      .filter((candle: CandleDataPoint) =>
      // Check that all values are defined and not NaN
        candle.time !== undefined
        && candle.open !== undefined
        && candle.high !== undefined
        && candle.low !== undefined
        && candle.close !== undefined
        && candle.volume !== undefined
        && !Number.isNaN(candle.time)
        && !Number.isNaN(candle.open)
        && !Number.isNaN(candle.high)
        && !Number.isNaN(candle.low)
        && !Number.isNaN(candle.close)
        && !Number.isNaN(candle.volume)
        && candle.time > 0
        && candle.open > 0
        && candle.close > 0,
      )
    // Sort by time ascending (required by chart library)
      .sort((a: CandleDataPoint, b: CandleDataPoint) => a.time - b.time);
  } catch (error) {
    console.error('Failed to fetch market data, using empty chart:', error);
    // Continue with empty data - chart will show "No data" message
    initialCandles = [];
  }

  return (
    <div className="min-h-full w-full bg-white dark:bg-slate-950">
      <TradingWorkspace defaultSymbol={symbol} defaultTimeframe={DEFAULT_TIMEFRAME} initialCandles={initialCandles} />
    </div>
  );
}

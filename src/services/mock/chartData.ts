import type { CandleDataPoint, Timeframe, TradingSymbol } from '@/types/trading';

const basePrices: Record<TradingSymbol, number> = {
  BTCUSDT: 64000,
  ETHUSDT: 3200,
  BNBUSDT: 550,
  SOLUSDT: 145,
  XRPUSDT: 0.58,
  ADAUSDT: 0.62,
};

const timeframeSeconds: Record<Timeframe, number> = {
  '1m': 60,
  '5m': 300,
  '15m': 900,
  '1h': 3600,
  '4h': 14400,
  '1d': 86400,
};

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

export const generateMockCandles = (
  symbol: TradingSymbol,
  timeframe: Timeframe,
  points = 240,
): CandleDataPoint[] => {
  const seedPrice = basePrices[symbol];
  const candles: CandleDataPoint[] = [];
  const interval = timeframeSeconds[timeframe];

  let current = seedPrice * randomBetween(0.98, 1.02);
  const now = Math.floor(Date.now() / 1000);

  for (let index = points - 1; index >= 0; index -= 1) {
    const time = now - index * interval;
    const drift = randomBetween(-1.2, 1.2);
    const open = current;
    const close = Math.max(0.0001, open + drift * (seedPrice * 0.0005));
    const high = Math.max(open, close) + randomBetween(0, seedPrice * 0.0003);
    const low = Math.min(open, close) - randomBetween(0, seedPrice * 0.0003);
    const volume = Math.abs(randomBetween(80, 160)) * seedPrice * 0.00001;

    candles.push({
      time,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Number(volume.toFixed(2)),
    });

    current = close;
  }

  return candles;
};

export const mockChartService = {
  async fetchCandles(params: { symbol: TradingSymbol; timeframe: Timeframe }) {
    return generateMockCandles(params.symbol, params.timeframe);
  },
};

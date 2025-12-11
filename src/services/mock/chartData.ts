import type { CandleDataPoint, Timeframe, TradingSymbol } from '@/types/trading';
import { BASE_PRICES } from '@/services/coins/coinConfig';
import { getPricePrecision, roundPrice } from '@/utils/pricePrecision';

const timeframeSeconds: Record<Timeframe, number> = {
  '1m': 60,
  '5m': 300,
  '15m': 900,
  '1h': 3600,
  '4h': 14400,
  '1d': 86400,
};

// Cache để lưu dữ liệu 1D cho mỗi symbol
const dailyDataCache = new Map<TradingSymbol, CandleDataPoint[]>();

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

/**
 * Tạo dữ liệu 1D (240 ngày) - đây là dữ liệu gốc
 */
function generateDailyData(symbol: TradingSymbol): CandleDataPoint[] {
  if (dailyDataCache.has(symbol)) {
    return dailyDataCache.get(symbol)!;
  }

  const seedPrice = BASE_PRICES[symbol] ?? 0;
  const pricePrecision = getPricePrecision(seedPrice);
  const candles: CandleDataPoint[] = [];
  const interval = timeframeSeconds['1d'];
  const days = 240; // 240 ngày

  let current = seedPrice * randomBetween(0.98, 1.02);
  const now = Math.floor(Date.now() / 1000);

  // Điều chỉnh biến động dựa trên giá trị coin
  // Coin giá thấp (< 1) cần biến động phần trăm cao hơn
  const isLowPriceCoin = seedPrice < 1;
  const dailyVolatility = isLowPriceCoin ? 0.02 : 0.005; // 2% cho coin giá thấp, 0.5% cho coin giá cao
  const highLowRange = isLowPriceCoin ? 0.015 : 0.003; // 1.5% vs 0.3%

  for (let index = days - 1; index >= 0; index -= 1) {
    const time = now - index * interval;
    const drift = randomBetween(-1.2, 1.2);
    const open = current;
    const close = Math.max(0.0001, open + drift * (seedPrice * dailyVolatility));
    const high = Math.max(open, close) + randomBetween(0, seedPrice * highLowRange);
    const low = Math.min(open, close) - randomBetween(0, seedPrice * highLowRange);
    const volume = Math.abs(randomBetween(80, 160)) * seedPrice * 0.00001;

    candles.push({
      time,
      open: roundPrice(open, pricePrecision),
      high: roundPrice(high, pricePrecision),
      low: roundPrice(low, pricePrecision),
      close: roundPrice(close, pricePrecision),
      volume: Number(volume.toFixed(2)),
    });

    current = close;
  }

  dailyDataCache.set(symbol, candles);
  return candles;
}

/**
 * Aggregate nhiều nến nhỏ thành 1 nến lớn hơn
 */
function aggregateCandles(
  candles: CandleDataPoint[],
  targetInterval: number,
  sourceInterval: number,
): CandleDataPoint[] {
  if (candles.length === 0) {
    return [];
  }

  const firstCandle = candles[0];
  if (!firstCandle) {
    return [];
  }

  const ratio = targetInterval / sourceInterval;
  const aggregated: CandleDataPoint[] = [];
  const pricePrecision = getPricePrecision(firstCandle.open);

  for (let i = 0; i < candles.length; i += ratio) {
    const group = candles.slice(i, i + ratio);
    if (group.length === 0) {
      break;
    }

    const openCandle = group[0];
    const closeCandle = group[group.length - 1];
    if (!openCandle || !closeCandle) {
      continue;
    }

    const open = openCandle.open;
    const close = closeCandle.close;
    const high = Math.max(...group.map(c => c.high));
    const low = Math.min(...group.map(c => c.low));
    const volume = group.reduce((sum, c) => sum + c.volume, 0);
    const time = openCandle.time;

    aggregated.push({
      time,
      open: roundPrice(open, pricePrecision),
      high: roundPrice(high, pricePrecision),
      low: roundPrice(low, pricePrecision),
      close: roundPrice(close, pricePrecision),
      volume: Number(volume.toFixed(2)),
    });
  }

  return aggregated;
}

/**
 * Chia nhỏ 1 nến lớn thành nhiều nến nhỏ hơn
 * Đảm bảo: nến đầu có open = candle.open, nến cuối có close = candle.close
 * Tối ưu cho cả coin giá cao (BTC) và giá thấp (XRP)
 */
function subdivideCandle(
  candle: CandleDataPoint,
  targetInterval: number,
  sourceInterval: number,
): CandleDataPoint[] {
  const ratio = Math.floor(sourceInterval / targetInterval);
  if (ratio <= 1) {
    return [candle];
  }

  const subdivided: CandleDataPoint[] = [];
  const pricePrecision = getPricePrecision(candle.open);
  const priceRange = candle.high - candle.low;
  const totalChange = candle.close - candle.open;

  // Tính volatility dựa trên giá trị của coin
  // Coin giá thấp (< 1) cần volatility cao hơn để có biến động đáng kể
  const basePrice = candle.open;
  const isLowPriceCoin = basePrice < 1;
  const volatilityMultiplier = isLowPriceCoin ? 0.5 : 0.2; // Coin giá thấp: 0.5, coin giá cao: 0.2
  const minVolatility = isLowPriceCoin ? basePrice * 0.01 : basePrice * 0.001; // Tối thiểu 1% cho coin giá thấp

  // Tạo các điểm giá trung gian với nhiều biến động hơn
  const pricePoints: number[] = [candle.open];
  for (let i = 1; i < ratio; i += 1) {
    const progress = i / ratio;
    // Tạo đường cong giá từ open đến close với biến động
    const basePricePoint = candle.open + totalChange * progress;

    // Tạo nhiều sóng biến động để đa dạng hơn
    const wave1 = Math.sin(progress * Math.PI * 4) * volatilityMultiplier;
    const wave2 = Math.sin(progress * Math.PI * 6 + Math.PI / 3) * volatilityMultiplier * 0.5;
    const randomNoise = randomBetween(-0.5, 0.5) * volatilityMultiplier;

    const volatility = priceRange * (wave1 + wave2 + randomNoise);
    const minChange = Math.max(minVolatility, Math.abs(volatility));
    const finalVolatility = volatility >= 0 ? minChange : -minChange;

    pricePoints.push(basePricePoint + finalVolatility);
  }
  pricePoints.push(candle.close); // Đảm bảo điểm cuối = close

  // Tạo các nến từ các điểm giá với biến động đa dạng hơn
  for (let i = 0; i < ratio; i += 1) {
    const open = i === 0 ? candle.open : pricePoints[i] ?? candle.open;
    const close = pricePoints[i + 1] ?? candle.close;

    // High và low phải nằm trong phạm vi của nến gốc
    const candleRange = Math.abs(close - open);
    const baseHigh = Math.max(open, close);
    const baseLow = Math.min(open, close);

    // Tăng biến động cho high/low để đa dạng hơn
    const highVolatility = Math.min(
      candleRange * 0.4,
      (candle.high - baseHigh) * randomBetween(0.6, 1.0),
    );
    const lowVolatility = Math.min(
      candleRange * 0.4,
      (baseLow - candle.low) * randomBetween(0.6, 1.0),
    );

    const high = Math.min(candle.high, baseHigh + highVolatility);
    const low = Math.max(candle.low, baseLow - lowVolatility);
    const volume = candle.volume / ratio * randomBetween(0.8, 1.2);
    const time = candle.time + i * targetInterval;

    subdivided.push({
      time,
      open: roundPrice(Math.max(candle.low, Math.min(candle.high, open)), pricePrecision),
      high: roundPrice(Math.min(candle.high, high), pricePrecision),
      low: roundPrice(Math.max(candle.low, low), pricePrecision),
      close: roundPrice(Math.max(candle.low, Math.min(candle.high, close)), pricePrecision),
      volume: Number(volume.toFixed(2)),
    });
  }

  return subdivided;
}

/**
 * Tạo dữ liệu cho timeframe từ dữ liệu 1D
 */
function generateFromDaily(
  symbol: TradingSymbol,
  timeframe: Timeframe,
  points = 240,
): CandleDataPoint[] {
  const dailyCandles = generateDailyData(symbol);
  const targetInterval = timeframeSeconds[timeframe];
  const dailyInterval = timeframeSeconds['1d'];

  // Nếu là 1D, trả về trực tiếp
  if (timeframe === '1d') {
    return dailyCandles.slice(-points);
  }

  // Nếu timeframe lớn hơn 1D (không có trong hệ thống hiện tại)
  if (targetInterval > dailyInterval) {
    return aggregateCandles(dailyCandles, targetInterval, dailyInterval).slice(-points);
  }

  // Nếu timeframe nhỏ hơn 1D, chia nhỏ từ 1D
  const result: CandleDataPoint[] = [];
  const ratio = dailyInterval / targetInterval;

  // Lấy số ngày cần thiết để có đủ số nến
  const daysNeeded = Math.ceil(points / ratio);
  const relevantDays = dailyCandles.slice(-daysNeeded);

  for (const dayCandle of relevantDays) {
    const subdivided = subdivideCandle(dayCandle, targetInterval, dailyInterval);
    result.push(...subdivided);
  }

  // Chỉ lấy số nến cần thiết (từ cuối)
  return result.slice(-points);
}

export const generateMockCandles = (
  symbol: TradingSymbol,
  timeframe: Timeframe,
  points = 240,
): CandleDataPoint[] => {
  return generateFromDaily(symbol, timeframe, points);
};

export const mockChartService = {
  async fetchCandles(params: { symbol: TradingSymbol; timeframe: Timeframe }) {
    return generateMockCandles(params.symbol, params.timeframe);
  },
};

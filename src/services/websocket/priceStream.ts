import type { RealtimePrice, TradingSymbol } from '@/types/trading';
import { BASE_PRICES } from '@/services/coins/coinConfig';
import { getPricePrecision, roundPrice } from '@/utils/pricePrecision';

type Listener = (payload: RealtimePrice) => void;

/**
 * Tạo drift nhỏ quanh giá hiện tại (không phải giá gốc)
 * Dao động ±0.3% mỗi tick để giống thị trường thực tế
 */
const randomDrift = (currentPrice: number) => {
  // Dao động nhỏ quanh giá hiện tại: ±0.3% mỗi tick
  const changePercent = (Math.random() - 0.5) * 0.006; // ±0.3%
  return currentPrice * changePercent;
};

/**
 * Giới hạn giá trong phạm vi hợp lý quanh giá gốc (±5%)
 */
const clampPrice = (price: number, basePrice: number) => {
  const minPrice = basePrice * 0.95; // -5%
  const maxPrice = basePrice * 1.05; // +5%
  return Math.max(minPrice, Math.min(maxPrice, price));
};

class MockPriceStream {
  private listeners = new Map<TradingSymbol, Set<Listener>>();

  private timers = new Map<TradingSymbol, number>();

  private lastPrice = new Map<TradingSymbol, number>();

  private high24h = new Map<TradingSymbol, number>();

  private low24h = new Map<TradingSymbol, number>();

  subscribe(symbol: TradingSymbol, listener: Listener) {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const symbolListeners = this.listeners.get(symbol) ?? new Set<Listener>();
    symbolListeners.add(listener);
    this.listeners.set(symbol, symbolListeners);

    this.start(symbol);

    return () => {
      symbolListeners.delete(listener);

      if (!symbolListeners.size) {
        this.stop(symbol);
      }
    };
  }

  private start(symbol: TradingSymbol) {
    if (this.timers.has(symbol)) {
      return;
    }

    const interval = window.setInterval(() => {
      const nextPayload = this.createPayload(symbol);
      const symbolListeners = this.listeners.get(symbol);

      if (symbolListeners) {
        symbolListeners.forEach(listener => listener(nextPayload));
      }
    }, 2000 + Math.random() * 1500);

    this.timers.set(symbol, interval);
  }

  private stop(symbol: TradingSymbol) {
    const intervalId = this.timers.get(symbol);

    if (intervalId) {
      clearInterval(intervalId);
      this.timers.delete(symbol);
    }
  }

  private createPayload(symbol: TradingSymbol): RealtimePrice {
    const base = BASE_PRICES[symbol] ?? 0;
    const precision = getPricePrecision(base);
    const prev = this.lastPrice.get(symbol) ?? base;

    // Drift tính theo giá hiện tại, không phải giá gốc
    const newPrice = prev + randomDrift(prev);

    // Giới hạn giá trong phạm vi hợp lý (±5% từ giá gốc)
    const price = clampPrice(newPrice, base);

    const change24h = ((price - base) / base) * 100;

    // High24h và Low24h cập nhật dần theo giá hiện tại
    const currentHigh24h = this.high24h.get(symbol) ?? base * 1.02;
    const currentLow24h = this.low24h.get(symbol) ?? base * 0.98;

    const high24h = Math.max(price, currentHigh24h * 0.999); // Giảm dần nếu giá không đạt
    const low24h = Math.min(price, currentLow24h * 1.001); // Tăng dần nếu giá không đạt

    const payload: RealtimePrice = {
      symbol,
      price: roundPrice(price, precision),
      change24h: Number(change24h.toFixed(2)),
      high24h: roundPrice(high24h, precision),
      low24h: roundPrice(low24h, precision),
      updatedAt: Date.now(),
    };

    this.lastPrice.set(symbol, payload.price);
    this.high24h.set(symbol, high24h);
    this.low24h.set(symbol, low24h);

    return payload;
  }
}

export const priceStream = new MockPriceStream();

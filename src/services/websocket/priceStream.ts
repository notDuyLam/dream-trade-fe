import type { RealtimePrice, TradingSymbol } from '@/types/trading';

type Listener = (payload: RealtimePrice) => void;

const seedPrices: Record<TradingSymbol, number> = {
  BTCUSDT: 64000,
  ETHUSDT: 3200,
  BNBUSDT: 550,
  SOLUSDT: 145,
  XRPUSDT: 0.58,
  ADAUSDT: 0.62,
};

const randomDrift = (base: number) => base * (Math.random() - 0.5) * 0.0025;

class MockPriceStream {
  private listeners = new Map<TradingSymbol, Set<Listener>>();

  private timers = new Map<TradingSymbol, number>();

  private lastPrice = new Map<TradingSymbol, number>();

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
    const base = seedPrices[symbol];
    const prev = this.lastPrice.get(symbol) ?? base;
    const price = Math.max(0.0001, prev + randomDrift(base));
    const change24h = ((price - base) / base) * 100;

    const payload: RealtimePrice = {
      symbol,
      price: Number(price.toFixed(2)),
      change24h: Number(change24h.toFixed(2)),
      high24h: Number(Math.max(price, base * 1.02).toFixed(2)),
      low24h: Number(Math.min(price, base * 0.98).toFixed(2)),
      updatedAt: Date.now(),
    };

    this.lastPrice.set(symbol, payload.price);

    return payload;
  }
}

export const priceStream = new MockPriceStream();

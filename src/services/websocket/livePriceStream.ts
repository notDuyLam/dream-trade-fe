import type { Socket } from 'socket.io-client';

import type { RealtimePrice, TradingSymbol } from '@/types/trading';
import { io } from 'socket.io-client';
import { getPricePrecision, roundPrice } from '@/utils/pricePrecision';

type Listener = (payload: RealtimePrice) => void;

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:4000';

class LivePriceStream {
  private socket: Socket | null = null;

  private listeners = new Map<TradingSymbol, Set<Listener>>();

  private connected = false;

  private ensureSocket() {
    if (typeof window === 'undefined') {
      return null;
    }

    if (this.socket) {
      return this.socket;
    }

    const socket = io(WS_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      this.connected = true;
    });

    socket.on('disconnect', () => {
      this.connected = false;
    });

    socket.on('price_tick', (payload: Partial<RealtimePrice> & { symbol: TradingSymbol; price: number; updatedAt: number }) => {
      const { symbol } = payload;
      const symbolListeners = this.listeners.get(symbol);

      if (!symbolListeners?.size) {
        return;
      }

      const precision = getPricePrecision(payload.price);
      const formatted: RealtimePrice = {
        symbol,
        price: roundPrice(payload.price, precision),
        change24h: roundPrice(payload.change24h ?? 0, 2),
        high24h: roundPrice(payload.high24h ?? payload.price, precision),
        low24h: roundPrice(payload.low24h ?? payload.price, precision),
        vol24h: payload.vol24h ?? 0,
        updatedAt: payload.updatedAt ?? Date.now(),
      };

      symbolListeners.forEach(listener => listener(formatted));
    });

    this.socket = socket;
    return socket;
  }

  subscribe(symbol: TradingSymbol, listener: Listener) {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const socket = this.ensureSocket();
    if (!socket) {
      return () => {};
    }

    const symbolListeners = this.listeners.get(symbol) ?? new Set<Listener>();
    symbolListeners.add(listener);
    this.listeners.set(symbol, symbolListeners);

    return () => {
      symbolListeners.delete(listener);

      if (!symbolListeners.size) {
        this.listeners.delete(symbol);
      }
    };
  }

  isConnected() {
    return this.connected;
  }
}

export const livePriceStream = new LivePriceStream();
export const livePriceStreamUrl = WS_URL;

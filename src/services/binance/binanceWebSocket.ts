import type { RealtimePrice, TradingSymbol } from '@/types/trading';

type Listener = (payload: RealtimePrice) => void;

const BINANCE_WS_BASE = 'wss://stream.binance.com:9443/ws';

type BinanceTickerData = {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  c: string; // Current close price
  p: string; // Price change
  P: string; // Price change percent
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  q: string; // Total traded quote asset volume
};

/**
 * Binance WebSocket stream for real-time price updates
 */
class BinancePriceStream {
  private sockets = new Map<TradingSymbol, WebSocket>();
  private listeners = new Map<TradingSymbol, Set<Listener>>();

  /**
   * Subscribe to price updates for a symbol
   */
  subscribe(symbol: TradingSymbol, listener: Listener): () => void {
    // Browser-only
    if (typeof window === 'undefined') {
      return () => {};
    }

    // Add listener
    if (!this.listeners.has(symbol)) {
      this.listeners.set(symbol, new Set());
    }
    this.listeners.get(symbol)!.add(listener);

    // Create WebSocket connection if not exists
    if (!this.sockets.has(symbol)) {
      this.connectSymbol(symbol);
    }

    // Return unsubscribe function
    return () => {
      const listenerSet = this.listeners.get(symbol);
      if (listenerSet) {
        listenerSet.delete(listener);

        // Close socket if no more listeners
        if (listenerSet.size === 0) {
          this.disconnectSymbol(symbol);
        }
      }
    };
  }

  private connectSymbol(symbol: TradingSymbol) {
    const streamName = `${symbol.toLowerCase()}@ticker`;
    const ws = new WebSocket(`${BINANCE_WS_BASE}/${streamName}`);

    ws.onopen = () => {
      console.log(`[BinanceWS] Connected to ${symbol}`);
    };

    ws.onmessage = (event) => {
      try {
        const data: BinanceTickerData = JSON.parse(event.data);

        const payload: RealtimePrice = {
          symbol,
          price: Number.parseFloat(data.c),
          change24h: Number.parseFloat(data.P),
          high24h: Number.parseFloat(data.h),
          low24h: Number.parseFloat(data.l),
          updatedAt: data.E,
        };

        // Notify all listeners
        const listeners = this.listeners.get(symbol);
        if (listeners) {
          listeners.forEach(listener => listener(payload));
        }
      } catch (error) {
        console.error('[BinanceWS] Error parsing message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error(`[BinanceWS] Error for ${symbol}:`, error);
    };

    ws.onclose = () => {
      console.log(`[BinanceWS] Disconnected from ${symbol}`);
      this.sockets.delete(symbol);
    };

    this.sockets.set(symbol, ws);
  }

  private disconnectSymbol(symbol: TradingSymbol) {
    const ws = this.sockets.get(symbol);
    if (ws) {
      ws.close();
      this.sockets.delete(symbol);
      this.listeners.delete(symbol);
    }
  }

  /**
   * Disconnect all WebSocket connections
   */
  disconnectAll() {
    this.sockets.forEach((ws) => {
      ws.close();
    });
    this.sockets.clear();
    this.listeners.clear();
  }
}

export const binancePriceStream = new BinancePriceStream();

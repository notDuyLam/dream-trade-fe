type StreamCallback = (data: any) => void;

export class BinanceStreamService {
  private ws: WebSocket | null = null;
  private readonly baseUrl = 'wss://stream.binance.com:9443/stream';
  private subscriptions: Map<string, Set<StreamCallback>> = new Map();
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private lastMessageTime = 0;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_DELAY = 30000;
  private readonly HEARTBEAT_INTERVAL = 30000; // 30s check
  private readonly RECONNECT_THRESHOLD = 60000; // 60s silence -> reconnect

  // Singleton instance
  private static instance: BinanceStreamService;

  private constructor() {
    this.connect();
  }

  public static getInstance(): BinanceStreamService {
    if (!BinanceStreamService.instance) {
      BinanceStreamService.instance = new BinanceStreamService();
    }
    return BinanceStreamService.instance;
  }

  private connect() {
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isConnecting = true;
    console.warn(`🔌 Binance Stream: Connecting... (Attempt ${this.reconnectAttempts + 1})`);

    try {
      this.ws = new WebSocket(this.baseUrl);

      this.ws.onopen = () => {
        console.warn('✅ Binance Stream: Connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.lastMessageTime = Date.now();
        this.startHeartbeat();
        this.resubscribeAll();
      };

      this.ws.onmessage = (event) => {
        this.lastMessageTime = Date.now();
        try {
          const payload = JSON.parse(event.data as string);

          // Handle Combined Stream Payload: { stream: "...", data: ... }
          if (payload.stream && payload.data) {
            this.notifySubscribers(payload.stream, payload.data);
          }
        } catch (error) {
          console.error('❌ Binance Stream: Parse error', error);
        }
      };

      this.ws.onclose = () => {
        console.warn('⚠️ Binance Stream: Closed');
        this.cleanup();
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('❌ Binance Stream: Error', error);
        // Error will usually trigger onclose, so logic handled there
      };
    } catch (error) {
      console.error('❌ Binance Stream: Connection failed', error);
      this.cleanup();
      this.scheduleReconnect();
    }
  }

  private cleanup() {
    this.isConnecting = false;
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }
    if (this.ws) {
      this.ws.onclose = null; // Prevent loops
      this.ws.close();
      this.ws = null;
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) {
      return;
    }

    // Exponential backoff with jitter
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, this.MAX_RECONNECT_DELAY);
    const jitter = Math.random() * 1000;

    console.warn(`⏳ Binance Stream: Reconnecting in ${(delay + jitter).toFixed(0)}ms...`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.reconnectAttempts++;
      this.connect();
    }, delay + jitter);
  }

  private startHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }

    this.heartbeatTimer = setInterval(() => {
      const now = Date.now();
      if (now - this.lastMessageTime > this.RECONNECT_THRESHOLD) {
        console.warn(`⚠️ Binance Stream: No data for ${this.RECONNECT_THRESHOLD}ms - Force Reconnecting`);
        if (this.ws) {
          this.ws.close();
        } // This will trigger onclose -> reconnect
      }
    }, this.HEARTBEAT_INTERVAL);
  }

  private send(method: 'SUBSCRIBE' | 'UNSUBSCRIBE', params: string[]) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    const id = Date.now();
    const msg = {
      method,
      params,
      id,
    };
    this.ws.send(JSON.stringify(msg));
  }

  private resubscribeAll() {
    const allStreams = Array.from(this.subscriptions.keys());
    if (allStreams.length > 0) {
      console.warn('🔄 Binance Stream: Resubscribing to', allStreams.length, 'streams');
      // Binance allows max 1024 streams per connection, but usually recommend batching
      // We'll batch by 50 just in case
      for (let i = 0; i < allStreams.length; i += 50) {
        const batch = allStreams.slice(i, i + 50);
        this.send('SUBSCRIBE', batch);
      }
    }
  }

  private notifySubscribers(stream: string, data: any) {
    const callbacks = this.subscriptions.get(stream);
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }

  /**
   * Subscribe to a specific stream
   * @returns Unsubscribe function
   */
  public subscribe(streamName: string, callback: StreamCallback): () => void {
    const stream = streamName.toLowerCase();

    if (!this.subscriptions.has(stream)) {
      this.subscriptions.set(stream, new Set());
      // First subscriber for this stream -> send SUBSCRIBE to Binance
      this.send('SUBSCRIBE', [stream]);
    }

    this.subscriptions.get(stream)!.add(callback);

    // Unsubscribe function
    return () => {
      const callbacks = this.subscriptions.get(stream);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.subscriptions.delete(stream);
          // Last subscriber gone -> send UNSUBSCRIBE to Binance
          this.send('UNSUBSCRIBE', [stream]);
        }
      }
    };
  }

  /**
   * Helper for kline stream
   * e.g. btcusdt@kline_1h
   */
  public subscribeKline(symbol: string, timeframe: string, callback: StreamCallback) {
    // Binance intervals: 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M
    // Map custom timeframes if necessary (e.g. 'D' -> '1d')
    const intervalMap: Record<string, string> = {
      '1m': '1m',
      '5m': '5m',
      '15m': '15m',
      '1h': '1h',
      '4h': '4h',
      '1d': '1d',
      '1w': '1w',
    };
    const interval = intervalMap[timeframe] || timeframe.toLowerCase();
    const stream = `${symbol.toLowerCase()}@kline_${interval}`;
    return this.subscribe(stream, callback);
  }

  /**
   * Helper for individual ticker stream
   * e.g. btcusdt@ticker
   */
  public subscribeTicker(symbol: string, callback: StreamCallback) {
    const stream = `${symbol.toLowerCase()}@ticker`;
    return this.subscribe(stream, callback);
  }
}

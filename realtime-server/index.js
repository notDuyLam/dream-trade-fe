// Simple Socket.io price streamer for dev purposes.
// Run with: node realtime-server/index.js

const { Server } = require('socket.io');

const PORT = Number(process.env.WS_PORT || 4000);
const ALLOWED_ORIGIN = process.env.WS_CORS_ORIGIN || '*';

const symbols = ['BTCUSDT', 'ETHUSDT'];
const basePrices = {
  BTCUSDT: 64000,
  ETHUSDT: 3200,
};

const lastPrice = new Map();

const round = (value, decimals = 2) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

/**
 * Tạo drift nhỏ quanh giá hiện tại (không phải giá gốc)
 * Dao động ±0.3% mỗi tick để giống thị trường thực tế
 */
const drift = (currentPrice) => {
  // Dao động nhỏ quanh giá hiện tại: ±0.3% mỗi tick
  const changePercent = (Math.random() - 0.5) * 0.006; // ±0.3%
  return currentPrice * changePercent;
};

/**
 * Giới hạn giá trong phạm vi hợp lý quanh giá gốc (±5%)
 */
const clampPrice = (price, basePrice) => {
  const minPrice = basePrice * 0.95; // -5%
  const maxPrice = basePrice * 1.05; // +5%
  return Math.max(minPrice, Math.min(maxPrice, price));
};

const io = new Server(PORT, {
  cors: {
    origin: ALLOWED_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.warn(`[ws] client connected: ${socket.id}`);

  socket.on('disconnect', (reason) => {
    console.warn(`[ws] client disconnected: ${socket.id} (${reason})`);
  });
});

const emitTick = () => {
  const now = Date.now();

  symbols.forEach((symbol) => {
    const base = basePrices[symbol];
    const prev = lastPrice.get(symbol) ?? base;

    // Drift tính theo giá hiện tại, không phải giá gốc
    const newPrice = prev + drift(prev);

    // Giới hạn giá trong phạm vi hợp lý (±5% từ giá gốc)
    const price = clampPrice(newPrice, base);

    const change24h = ((price - base) / base) * 100;

    // High24h và Low24h cập nhật dần theo giá hiện tại
    const currentHigh24h = lastPrice.get(`${symbol}_high24h`) ?? base * 1.02;
    const currentLow24h = lastPrice.get(`${symbol}_low24h`) ?? base * 0.98;

    const high24h = Math.max(price, currentHigh24h * 0.999); // Giảm dần nếu giá không đạt
    const low24h = Math.min(price, currentLow24h * 1.001); // Tăng dần nếu giá không đạt

    const payload = {
      symbol,
      price: round(price, 2),
      change24h: round(change24h, 2),
      high24h: round(high24h, 2),
      low24h: round(low24h, 2),
      updatedAt: now,
      time: Math.floor(now / 1000),
    };

    lastPrice.set(symbol, payload.price);
    lastPrice.set(`${symbol}_high24h`, high24h);
    lastPrice.set(`${symbol}_low24h`, low24h);
    io.emit('price_tick', payload);
  });
};

setInterval(emitTick, 1000);

console.warn(
  `[ws] Socket.io server listening on port ${PORT}, CORS: ${ALLOWED_ORIGIN}`,
);

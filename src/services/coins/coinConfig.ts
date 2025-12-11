import type { TradingSymbol } from '@/types/trading';

export type CoinMetadata = {
  symbol: TradingSymbol;
  name: string;
  basePrice: number;
  volume24h?: number;
};

/**
 * Central configuration for all supported coins
 * This can be easily replaced with an API call later
 */
export const COIN_CONFIG: CoinMetadata[] = [
  { symbol: 'BTCUSDT', name: 'Bitcoin', basePrice: 64000, volume24h: 25000000000 },
  { symbol: 'ETHUSDT', name: 'Ethereum', basePrice: 3200, volume24h: 12000000000 },
  { symbol: 'BNBUSDT', name: 'BNB', basePrice: 550, volume24h: 800000000 },
  { symbol: 'SOLUSDT', name: 'Solana', basePrice: 145, volume24h: 2000000000 },
  { symbol: 'XRPUSDT', name: 'Ripple', basePrice: 0.58, volume24h: 1500000000 },
  { symbol: 'ADAUSDT', name: 'Cardano', basePrice: 0.62, volume24h: 600000000 },
];

/**
 * Helper maps for quick lookup
 */
export const BASE_PRICES: Record<TradingSymbol, number> = Object.fromEntries(
  COIN_CONFIG.map(coin => [coin.symbol, coin.basePrice]),
) as Record<TradingSymbol, number>;

export const COIN_NAMES: Record<TradingSymbol, string> = Object.fromEntries(
  COIN_CONFIG.map(coin => [coin.symbol, coin.name]),
) as Record<TradingSymbol, string>;

export const COIN_VOLUMES: Record<TradingSymbol, number> = Object.fromEntries(
  COIN_CONFIG.map(coin => [coin.symbol, coin.volume24h ?? 0]),
) as Record<TradingSymbol, number>;

export const ALL_SYMBOLS: TradingSymbol[] = COIN_CONFIG.map(coin => coin.symbol);

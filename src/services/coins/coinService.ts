import type { CoinMetadata } from './coinConfig';
import type { TradingSymbol } from '@/types/trading';
import { COIN_CONFIG } from './coinConfig';

/**
 * Service to manage coin data
 * Currently returns static config, but can be easily replaced with API calls
 */
export class CoinService {
  /**
   * Get all available coins
   * In the future, this can fetch from API: return apiRequest<CoinMetadata[]>('/api/coins')
   */
  static async getAllCoins(): Promise<CoinMetadata[]> {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(COIN_CONFIG), 0);
    });
  }

  /**
   * Get coin metadata by symbol
   */
  static async getCoinBySymbol(symbol: TradingSymbol): Promise<CoinMetadata | null> {
    const coins = await this.getAllCoins();
    return coins.find(coin => coin.symbol === symbol) ?? null;
  }

  /**
   * Get all trading symbols
   */
  static getAllSymbols(): TradingSymbol[] {
    return COIN_CONFIG.map(coin => coin.symbol);
  }

  /**
   * Check if a symbol is valid
   */
  static isValidSymbol(symbol: string): symbol is TradingSymbol {
    return COIN_CONFIG.some(coin => coin.symbol === symbol);
  }
}

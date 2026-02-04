/**
 * Simple Market Service - Binance API Integration via Gateway
 * All requests go through API Gateway (port 8080) which routes to market service
 */

import { getApiBaseUrl } from '@/services/api/client';

const API_BASE_URL = getApiBaseUrl();

export const marketService = {
  /**
   * Lấy giá 24h ticker cho nhiều symbols
   */
  async getTicker24hr(symbols: string[]) {
    try {
      const symbolsParam = symbols.join(',');
      const response = await fetch(
        `${API_BASE_URL}/market/ticker/24hr?symbols=${symbolsParam}`,
        { cache: 'no-store' },
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch ticker data:', error);
      throw error;
    }
  },

  /**
   * Lấy dữ liệu lịch sử (klines/candlestick)
   */
  async getHistory(
    symbol: string,
    timeframe = '1h',
    limit = 100,
    startTime?: number,
    endTime?: number,
  ) {
    try {
      let url = `${API_BASE_URL}/market/history/${symbol}?timeframe=${timeframe}&limit=${limit}`;

      if (startTime) {
        url += `&startTime=${startTime}`;
      }
      if (endTime) {
        url += `&endTime=${endTime}`;
      }

      const response = await fetch(url, { cache: 'no-store' });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch history:', error);
      throw error;
    }
  },
};

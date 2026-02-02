'use client';

import type { TradingSymbol } from '@/types/trading';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { binancePriceStream } from '@/services/binance/binanceWebSocket';
import { COIN_VOLUMES } from '@/services/coins/coinConfig';
import { CoinService } from '@/services/coins/coinService';
import { formatPrice } from '@/utils/pricePrecision';

type CoinInfo = {
  symbol: TradingSymbol;
  name: string;
  price: number | null;
  change24h: number | null;
  high24h: number | null;
  low24h: number | null;
  volume24h: number | null;
};

export const CoinList = () => {
  const [coins, setCoins] = useState<CoinInfo[]>([]);
  const [allSymbols, setAllSymbols] = useState<TradingSymbol[]>([]);

  // Load coins from service (can be replaced with API call)
  useEffect(() => {
    void (async () => {
      const coinData = await CoinService.getAllCoins();
      const symbols = coinData.map(coin => coin.symbol);
      setAllSymbols(symbols);

      setCoins(
        coinData.map(coin => ({
          symbol: coin.symbol,
          name: coin.name,
          price: null,
          change24h: null,
          high24h: null,
          low24h: null,
          volume24h: coin.volume24h ?? COIN_VOLUMES[coin.symbol] ?? null,
        })),
      );
    })();
  }, []);

  // Subscribe to Binance WebSocket for real-time price updates
  useEffect(() => {
    if (allSymbols.length === 0) {
      return;
    }

    console.warn('🔌 Subscribing to Binance WebSocket for', allSymbols.length, 'symbols');

    // Subscribe to all symbols via Binance WebSocket
    const unsubscribers = allSymbols.map(symbol =>
      binancePriceStream.subscribe(symbol, (payload) => {
        setCoins(prev =>
          prev.map(coin =>
            coin.symbol === symbol
              ? {
                  ...coin,
                  price: payload.price,
                  change24h: payload.change24h,
                  high24h: payload.high24h,
                  low24h: payload.low24h,
                }
              : coin,
          ),
        );
      }),
    );

    return () => {
      console.warn('🔌 Unsubscribing from Binance WebSocket');
      unsubscribers.forEach(unsub => unsub());
    };
  }, [allSymbols]);

  const formatVolume = (volume: number | null) => {
    if (volume === null) {
      return '--';
    }
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`;
    }
    if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`;
    }
    return `$${volume.toLocaleString()}`;
  };

  return (
    <div className="flex-1 overflow-hidden rounded-2xl border border-slate-300 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/70">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-slate-300 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">#</th>
              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">Coin</th>
              <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">Price</th>
              <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">24h Change</th>
              <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">24h High</th>
              <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">24h Low</th>
              <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">24h Volume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {coins.map((coin, index) => {
              const changeColor = coin.change24h ? (coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400') : 'text-slate-400';

              return (
                <tr key={coin.symbol} className="transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-900/50">
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{index + 1}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard?symbol=${coin.symbol}`}
                      className="flex items-center gap-3 font-semibold text-slate-900 transition-colors hover:text-emerald-600 dark:text-white dark:hover:text-emerald-400"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-emerald-600 dark:bg-slate-800 dark:text-emerald-400">
                        {coin.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold">{coin.name}</div>
                        <div className="text-xs text-slate-500">{coin.symbol}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900 dark:text-white">
                    {coin.price !== null ? formatPrice(coin.price) : '--'}
                  </td>
                  <td className={`px-6 py-4 text-right text-sm font-semibold ${changeColor}`}>
                    {coin.change24h !== null ? `${coin.change24h >= 0 ? '+' : ''}${coin.change24h.toFixed(2)}%` : '--'}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-slate-600 dark:text-slate-300">
                    {coin.high24h !== null ? formatPrice(coin.high24h) : '--'}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-slate-600 dark:text-slate-300">
                    {coin.low24h !== null ? formatPrice(coin.low24h) : '--'}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-slate-600 dark:text-slate-300">{formatVolume(coin.volume24h)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

'use client';

import type { CandleDataPoint, ChartDisplay, RealtimePrice, Timeframe, TradingSymbol } from '@/types/trading';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { binanceService } from '@/services/binance/binanceApi';
import { binancePriceStream } from '@/services/binance/binanceWebSocket';
import { CoinService } from '@/services/coins/coinService';
import { formatPrice, roundPrice } from '@/utils/pricePrecision';
import { AccountInfo } from './AccountInfo';
import { SymbolSelector } from './SymbolSelector';
import { TimeframeSelector } from './TimeframeSelector';

import { TradingChart } from './TradingChart';

const AccountDropdown = dynamic(() => import('@/components/auth/AccountDropdown').then(mod => ({ default: mod.AccountDropdown })), {
  ssr: false,
});

type TradingWorkspaceProps = {
  defaultSymbol: TradingSymbol;
  defaultTimeframe: Timeframe;
  initialCandles: CandleDataPoint[];
};

const chartTypes: { id: ChartDisplay; label: string }[] = [
  { id: 'candles', label: 'Candles' },
  { id: 'line', label: 'Line' },
];

// Watchlist will be loaded dynamically
const getWatchlistSymbols = (): TradingSymbol[] => {
  // In the future, this can come from user preferences or API
  return CoinService.getAllSymbols();
};

const fallbackQuote = (symbol: TradingSymbol, candle?: CandleDataPoint): RealtimePrice | null => {
  if (!candle) {
    return null;
  }

  return {
    symbol,
    price: roundPrice(candle.close),
    change24h: 0,
    high24h: roundPrice(candle.high),
    low24h: roundPrice(candle.low),
    updatedAt: Date.now(),
  };
};

export const TradingWorkspace = (props: TradingWorkspaceProps) => {
  const { t } = useLanguage();
  const [symbol, setSymbol] = useState<TradingSymbol>(props.defaultSymbol);
  const [timeframe, setTimeframe] = useState<Timeframe>(props.defaultTimeframe);
  const [candles, setCandles] = useState<CandleDataPoint[]>(() => props.initialCandles);
  const [chartType, setChartType] = useState<ChartDisplay>('candles');
  const [isLoading, setIsLoading] = useState(false);
  const [quote, setQuote] = useState<RealtimePrice | null>(() => fallbackQuote(props.defaultSymbol, props.initialCandles.at(-1)));
  const [watchlistQuotes, setWatchlistQuotes] = useState<Partial<Record<TradingSymbol, RealtimePrice | null>>>({});
  const [watchlistSymbols] = useState<TradingSymbol[]>(() => getWatchlistSymbols());

  const updateWorkspace = useCallback(async (nextSymbol: TradingSymbol, nextTimeframe: Timeframe) => {
    setIsLoading(true);
    try {
      const data = await binanceService.fetchCandles({
        symbol: nextSymbol,
        timeframe: nextTimeframe,
      });
      setCandles(data);
    } catch (error) {
      console.error('Failed to fetch candles:', error);
    }
    setIsLoading(false);
  }, []);

  const handleSymbolChange = (nextSymbol: TradingSymbol) => {
    setSymbol(nextSymbol);
    setQuote(null);
    void updateWorkspace(nextSymbol, timeframe);
  };

  const handleTimeframeChange = (nextTimeframe: Timeframe) => {
    setTimeframe(nextTimeframe);
    setQuote(null);
    void updateWorkspace(symbol, nextTimeframe);
  };

  const fallback = useMemo(() => fallbackQuote(symbol, candles.at(-1)), [symbol, candles]);
  const displayQuote = quote ?? fallback;

  useEffect(() => {
    const unsubscribe = binancePriceStream.subscribe(symbol, (payload) => {
      setQuote(payload);
      // Don't update candles here - let TradingChart handle real-time updates
    });

    return unsubscribe;
  }, [symbol]);

  useEffect(() => {
    if (watchlistSymbols.length === 0) {
      return;
    }

    const unsubscribers = watchlistSymbols.map(itemSymbol =>
      binancePriceStream.subscribe(itemSymbol, (payload) => {
        setWatchlistQuotes(prev => ({
          ...prev,
          [itemSymbol]: payload,
        }));
      }),
    );

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [watchlistSymbols]);

  const changeColor = useMemo(() => {
    if (!displayQuote) {
      return 'text-slate-400';
    }

    return displayQuote.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400';
  }, [displayQuote]);

  const latestCandle = candles.at(-1);

  return (
    <div className="flex h-full flex-col gap-6  bg-white dark:bg-zinc-900">
      <nav className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-300 bg-slate-100 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/50">
        <div>
          <p className="text-[11px] tracking-[0.4em] text-emerald-600 uppercase dark:text-emerald-400">{t('trading.dreamTrade')}</p>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{t('trading.intelligence')}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <button type="button" className="rounded-full border border-slate-400 px-4 py-1.5 text-slate-900 dark:border-slate-700 dark:text-white">
            {t('nav.workspace')}
          </button>
          <button type="button" className="rounded-full border border-transparent px-4 py-1.5 hover:text-slate-900 dark:hover:text-white">
            {t('nav.insights')}
          </button>
          <button type="button" className="rounded-full border border-transparent px-4 py-1.5 hover:text-slate-900 dark:hover:text-white">
            {t('nav.news')}
          </button>
          <button type="button" className="rounded-full border border-transparent px-4 py-1.5 hover:text-slate-900 dark:hover:text-white">
            {t('nav.settings')}
          </button>
          <AccountDropdown />
        </div>
      </nav>

      <div className="grid grow gap-6 overflow-hidden lg:grid-cols-[3fr_1fr]">
        <section className="flex h-full flex-col rounded-[32px] border border-slate-300 bg-slate-50 p-6 dark:border-slate-900/80 dark:bg-slate-950/70">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs tracking-[0.35em] text-slate-500 uppercase">{t('trading.priceChart')}</p>
                <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">{symbol}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {chartTypes.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setChartType(type.id)}
                    className={[
                      'rounded-md border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition',
                      type.id === chartType
                        ? 'border-emerald-400 bg-emerald-500/10 text-slate-900 dark:text-white'
                        : 'border-slate-400 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-500 dark:hover:border-slate-500',
                    ].join(' ')}
                  >
                    {t(`trading.${type.id}`)}
                  </button>
                ))}
              </div>
            </div>

            <SymbolSelector value={symbol} onChange={handleSymbolChange} />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <TimeframeSelector value={timeframe} onChange={handleTimeframeChange} />
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {t('trading.updated')}
                :
                {displayQuote ? new Date(displayQuote.updatedAt).toLocaleTimeString() : '--'}
              </p>
            </div>
          </div>

          <div className="flex grow flex-col">
            {isLoading
              ? (
                  <div className="flex grow items-center justify-center rounded-[28px] border border-slate-300 bg-slate-100 text-sm tracking-[0.4em] text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-950/40">
                    {t('trading.loadingData')}
                  </div>
                )
              : (
                  <TradingChart candles={candles} symbol={symbol} timeframe={timeframe} chartType={chartType} theme="dark" className="h-full grow" />
                )}
          </div>
        </section>

        <aside className="flex h-full flex-col gap-4 rounded-[32px] border border-slate-300 bg-slate-100 p-4 dark:border-slate-900/80 dark:bg-slate-950/60">
          {/* Account Info Section */}
          <AccountInfo />

          <section className="flex h-0 flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] tracking-[0.35em] text-slate-500 uppercase">List</p>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t('trading.watchlist')}</h3>
              </div>
            </div>
            <div className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1">
              {watchlistSymbols.map((item) => {
                const data = watchlistQuotes[item];
                const changeColorItem = data?.change24h ? (data.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400') : 'text-slate-500';
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSymbolChange(item)}
                    className={[
                      'flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition',
                      item === symbol
                        ? 'border-emerald-400 bg-emerald-500/10 text-slate-900 dark:text-white'
                        : 'border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600',
                    ].join(' ')}
                  >
                    <div>
                      <p className="text-sm font-semibold">{item}</p>
                      <p className="text-xs text-slate-500">{t('trading.realtime')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-semibold">{formatPrice(data?.price)}</p>
                      <p className={`text-xs ${changeColorItem}`}>{data ? `${data.change24h >= 0 ? '+' : ''}${data.change24h.toFixed(2)}%` : '--'}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="flex-shrink-0 space-y-4 rounded-2xl border border-slate-300 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950/80">
            <div>
              <p className="text-[11px] tracking-[0.35em] text-slate-500 uppercase">{t('trading.details')}</p>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{symbol}</h3>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-semibold text-slate-900 dark:text-white">{formatPrice(displayQuote?.price)}</span>
              <span className={`text-sm font-semibold ${changeColor}`}>
                {displayQuote ? `${displayQuote.change24h >= 0 ? '+' : ''}${displayQuote.change24h.toFixed(2)}%` : '--'}
              </span>
            </div>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs tracking-[0.3em] text-slate-500 uppercase">{t('trading.open')}</dt>
                <dd className="mt-1 text-slate-900 dark:text-white">{formatPrice(latestCandle?.open)}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.3em] text-slate-500 uppercase">{t('trading.close')}</dt>
                <dd className="mt-1 text-slate-900 dark:text-white">{formatPrice(latestCandle?.close)}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.3em] text-slate-500 uppercase">{t('trading.high')}</dt>
                <dd className="mt-1 text-slate-900 dark:text-white">{formatPrice(latestCandle?.high)}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.3em] text-slate-500 uppercase">{t('trading.low')}</dt>
                <dd className="mt-1 text-slate-900 dark:text-white">{formatPrice(latestCandle?.low)}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.3em] text-slate-500 uppercase">{t('trading.volume')}</dt>
                <dd className="mt-1 text-slate-900 dark:text-white">{latestCandle ? `${latestCandle.volume.toFixed(0)}` : '--'}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.3em] text-slate-500 uppercase">{t('trading.timeframe')}</dt>
                <dd className="mt-1 text-slate-900 dark:text-white">{timeframe}</dd>
              </div>
            </dl>
            <p className="text-xs text-slate-500">
              {t('trading.dataUpdatedAt')}
              :
              {displayQuote ? new Date(displayQuote.updatedAt).toLocaleTimeString() : '--'}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
};

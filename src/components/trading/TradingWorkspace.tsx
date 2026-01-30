'use client';

import type { CandleDataPoint, ChartDisplay, RealtimePrice, Timeframe, TradingSymbol } from '@/types/trading';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CoinService } from '@/services/coins/coinService';
import { marketService } from '@/services/market/marketService';
import { formatPrice, roundPrice } from '@/utils/pricePrecision';
import { SymbolSelector } from './SymbolSelector';

import { TimeframeSelector } from './TimeframeSelector';

import { TradingChart } from './TradingChart';

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
  if (!candle || !candle.close || !candle.high || !candle.low) {
    return null;
  }

  return {
    symbol,
    price: roundPrice(candle.close),
    change24h: 0,
    high24h: roundPrice(candle.high),
    low24h: roundPrice(candle.low),
    vol24h: candle.volume || 0,
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
      // Fetch native history for the selected timeframe (including 1s)
      const fetchLimit = nextTimeframe === '1s' ? 300 : 1000;
      const history = await marketService.getHistory(nextSymbol, nextTimeframe, fetchLimit);
      const newCandles = history.data.map((candle: any) => {
        // Binance returns array format: [timestamp, open, high, low, close, volume, ...]
        // Or object format: { timestamp, open, high, low, close, volume }
        let timeInSeconds: number;
        let open: number, high: number, low: number, close: number, volume: number;

        if (Array.isArray(candle)) {
          // Array format from Binance
          timeInSeconds = Math.floor(candle[0] / 1000); // timestamp in ms
          open = Number.parseFloat(candle[1]);
          high = Number.parseFloat(candle[2]);
          low = Number.parseFloat(candle[3]);
          close = Number.parseFloat(candle[4]);
          volume = Number.parseFloat(candle[5]);
        } else {
          // Object format
          if (typeof candle.timestamp === 'number') {
            timeInSeconds = Math.floor(candle.timestamp / 1000);
          } else {
            const date = new Date(candle.timestamp);
            timeInSeconds = Math.floor(date.getTime() / 1000);
          }
          open = candle.open;
          high = candle.high;
          low = candle.low;
          close = candle.close;
          volume = candle.volume;
        }

        return {
          time: timeInSeconds,
          open,
          high,
          low,
          close,
          volume,
        };
      }).filter((candle: CandleDataPoint) =>
        // Check that all values are defined and not NaN
        candle.time !== undefined
        && candle.open !== undefined
        && candle.high !== undefined
        && candle.low !== undefined
        && candle.close !== undefined
        && candle.volume !== undefined
        && !Number.isNaN(candle.time)
        && !Number.isNaN(candle.open)
        && !Number.isNaN(candle.high)
        && !Number.isNaN(candle.low)
        && !Number.isNaN(candle.close)
        && !Number.isNaN(candle.volume)
        && candle.time > 0
        && candle.open > 0
        && candle.close > 0,
      ).sort((a: CandleDataPoint, b: CandleDataPoint) => a.time - b.time);

      setCandles(newCandles);
    } catch (error) {
      console.error('Failed to fetch history:', error);
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

  // REAL-TIME CURRENT SYMBOL QUOTE using 1-SECOND POLLING
  useEffect(() => {
    const fetchCurrentQuote = async () => {
      try {
        const tickers = await marketService.getTicker24hr([symbol]);

        if (tickers && tickers.length > 0) {
          const ticker = tickers[0];
          setQuote({
            symbol,
            price: Number.parseFloat(ticker.lastPrice || ticker.c),
            change24h: Number.parseFloat(ticker.priceChangePercent || ticker.P),
            high24h: Number.parseFloat(ticker.highPrice || ticker.h),
            low24h: Number.parseFloat(ticker.lowPrice || ticker.l),
            vol24h: Number.parseFloat(ticker.volume || ticker.v || '0'),
            updatedAt: Date.now(),
          });
        }
      } catch (error) {
        console.error('Failed to fetch current quote:', error);
      }
    };

    // Fetch immediately
    void fetchCurrentQuote();

    // Set up 1-second interval
    const intervalId = setInterval(() => {
      void fetchCurrentQuote();
    }, 1000); // Update every 1 second

    return () => {
      clearInterval(intervalId);
    };
  }, [symbol]);

  // REAL-TIME WATCHLIST UPDATES using 1-SECOND POLLING
  useEffect(() => {
    if (watchlistSymbols.length === 0) {
      return;
    }

    // Initial fetch
    const fetchWatchlistPrices = async () => {
      try {
        const tickers = await marketService.getTicker24hr(watchlistSymbols);

        const newQuotes: Partial<Record<TradingSymbol, RealtimePrice | null>> = {};

        tickers.forEach((ticker: any) => {
          const symbolKey = ticker.symbol as TradingSymbol;
          newQuotes[symbolKey] = {
            symbol: symbolKey,
            price: Number.parseFloat(ticker.lastPrice || ticker.c),
            change24h: Number.parseFloat(ticker.priceChangePercent || ticker.P),
            high24h: Number.parseFloat(ticker.highPrice || ticker.h),
            low24h: Number.parseFloat(ticker.lowPrice || ticker.l),
            vol24h: Number.parseFloat(ticker.volume || ticker.v || '0'),
            updatedAt: Date.now(),
          };
        });

        setWatchlistQuotes(newQuotes);
      } catch (error) {
        console.error('Failed to fetch watchlist prices:', error);
      }
    };

    // Fetch immediately
    void fetchWatchlistPrices();

    // Set up 1-second interval
    const intervalId = setInterval(() => {
      void fetchWatchlistPrices();
    }, 1000); // Update every 1 second

    return () => {
      clearInterval(intervalId);
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
    <div className="flex h-full flex-col overflow-hidden bg-transparent">

      <div className="grid min-h-0 flex-1 gap-2 p-2 lg:gap-3 lg:p-3 xl:grid-cols-[1fr_360px]">
        {/* Main Chart Section */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-[20px] border border-slate-200/50 bg-white/80 p-3 shadow-xl shadow-black/5 backdrop-blur-xl lg:rounded-[24px] lg:p-4 dark:border-slate-800/50 dark:bg-slate-900/40">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-medium tracking-[0.2em] text-slate-500 uppercase">{t('trading.priceChart')}</p>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{symbol}</h2>
                  <div className="flex gap-1">
                    {chartTypes.map(type => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setChartType(type.id)}
                        className={[
                          'rounded px-2 py-0.5 text-[10px] font-bold uppercase transition-all',
                          type.id === chartType
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700',
                        ].join(' ')}
                      >
                        {t(`trading.${type.id}`)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <SymbolSelector value={symbol} onChange={handleSymbolChange} />
              <TimeframeSelector value={timeframe} onChange={handleTimeframeChange} />
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

        {/* Sidebar */}
        <aside className="flex min-h-0 flex-col gap-2 lg:gap-3">
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden rounded-[20px] border border-slate-200/50 bg-white/80 p-3 shadow-xl shadow-black/5 backdrop-blur-xl lg:rounded-[24px] dark:border-slate-800/50 dark:bg-slate-900/40">

            <section className="flex min-h-0 flex-col overflow-hidden">
              <div>
                <p className="text-[10px] font-medium tracking-[0.2em] text-slate-500 uppercase">Market Overview</p>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('trading.watchlist')}</h3>
              </div>
              <div className="mt-2 flex-1 space-y-1 overflow-y-auto pr-1">
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
                        <p className={`text-xs ${changeColorItem}`}>
                          {data && typeof data.change24h === 'number'
                            ? `${data.change24h >= 0 ? '+' : ''}${data.change24h.toFixed(2)}%`
                            : '--'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Asset Detail Card */}
            <section className="space-y-4 rounded-xl border border-slate-200/50 bg-slate-50/50 p-4 dark:border-slate-800/50 dark:bg-slate-950/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">{t('trading.details')}</p>
                  <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{symbol}</h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">{formatPrice(displayQuote?.price)}</p>
                  <p className={`text-sm font-bold ${changeColor}`}>
                    {displayQuote && typeof displayQuote.change24h === 'number'
                      ? `${displayQuote.change24h >= 0 ? '+' : ''}${displayQuote.change24h.toFixed(2)}%`
                      : '--'}
                  </p>
                </div>
              </div>
              <div className="h-px bg-slate-200/50 dark:bg-slate-800/50" />
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-[11px]">
                <div className="flex items-center justify-between rounded-lg bg-slate-100/30 p-2.5 dark:bg-slate-800/20">
                  <dt className="font-semibold tracking-tight text-slate-500 uppercase">Open</dt>
                  <dd className="font-mono font-bold text-slate-900 dark:text-slate-200">{formatPrice(latestCandle?.open)}</dd>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-100/30 p-2.5 dark:bg-slate-800/20">
                  <dt className="font-semibold tracking-tight text-slate-500 uppercase">Close</dt>
                  <dd className="font-mono font-bold text-slate-900 dark:text-slate-200">{formatPrice(latestCandle?.close)}</dd>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-100/30 p-2.5 dark:bg-slate-800/20">
                  <dt className="font-semibold tracking-tight text-slate-500 uppercase">High</dt>
                  <dd className="font-mono font-bold text-emerald-500">{formatPrice(latestCandle?.high)}</dd>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-100/30 p-2.5 dark:bg-slate-800/20">
                  <dt className="font-semibold tracking-tight text-slate-500 uppercase">Low</dt>
                  <dd className="font-mono font-bold text-rose-500">{formatPrice(latestCandle?.low)}</dd>
                </div>
              </dl>
              <p className="mt-1 text-center text-[9px] font-medium text-slate-500 italic">
                Candle:
                {' '}
                {timeframe}
              </p>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
};

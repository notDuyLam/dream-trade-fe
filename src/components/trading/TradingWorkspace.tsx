'use client';

import type {
  CandleDataPoint,
  ChartDisplay,
  RealtimePrice,
  Timeframe,
  TradingSymbol,
} from '@/types/trading';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { mockChartService } from '@/services/mock/chartData';
import { priceStream } from '@/services/websocket/priceStream';
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
  { id: 'candles', label: 'Nến' },
  { id: 'line', label: 'Đường' },
];

const watchlistSymbols: TradingSymbol[] = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'ADAUSDT'];

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
  const [symbol, setSymbol] = useState<TradingSymbol>(props.defaultSymbol);
  const [timeframe, setTimeframe] = useState<Timeframe>(props.defaultTimeframe);
  const [candles, setCandles] = useState<CandleDataPoint[]>(props.initialCandles);
  const [chartType, setChartType] = useState<ChartDisplay>('candles');
  const [isLoading, setIsLoading] = useState(false);
  const [quote, setQuote] = useState<RealtimePrice | null>(
    fallbackQuote(props.defaultSymbol, props.initialCandles.at(-1)),
  );
  const [watchlistQuotes, setWatchlistQuotes] = useState<Partial<Record<TradingSymbol, RealtimePrice | null>>>({});

  const updateWorkspace = useCallback(async (nextSymbol: TradingSymbol, nextTimeframe: Timeframe) => {
    setIsLoading(true);
    const data = await mockChartService.fetchCandles({
      symbol: nextSymbol,
      timeframe: nextTimeframe,
    });
    setCandles(data);
    setIsLoading(false);
  }, []);

  const handleSymbolChange = (nextSymbol: TradingSymbol) => {
    setSymbol(nextSymbol);
    void updateWorkspace(nextSymbol, timeframe);
  };

  const handleTimeframeChange = (nextTimeframe: Timeframe) => {
    setTimeframe(nextTimeframe);
    void updateWorkspace(symbol, nextTimeframe);
  };

  useEffect(() => {
    setQuote(fallbackQuote(symbol, candles.at(-1)));
  }, [candles, symbol]);

  useEffect(() => {
    const unsubscribe = priceStream.subscribe(symbol, payload => setQuote(payload));
    return unsubscribe;
  }, [symbol]);

  useEffect(() => {
    const unsubscribers = watchlistSymbols.map(itemSymbol =>
      priceStream.subscribe(itemSymbol, (payload) => {
        setWatchlistQuotes(prev => ({
          ...prev,
          [itemSymbol]: payload,
        }));
      }),
    );

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  const changeColor = useMemo(() => {
    if (!quote) {
      return 'text-slate-400';
    }

    return quote.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400';
  }, [quote]);

  const latestCandle = candles.at(-1);

  return (
    <div className="flex h-full flex-col gap-6">
      <nav className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/50 px-6 py-4">
        <div>
          <p className="text-[11px] tracking-[0.4em] text-emerald-400 uppercase">Dream Trade</p>
          <h1 className="text-xl font-semibold text-white">Trading Intelligence</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-300">
          <button type="button" className="rounded-full border border-slate-700 px-4 py-1.5 text-white">
            Workspace
          </button>
          <button type="button" className="rounded-full border border-transparent px-4 py-1.5 hover:text-white">
            Insights
          </button>
          <button type="button" className="rounded-full border border-transparent px-4 py-1.5 hover:text-white">
            News
          </button>
          <button type="button" className="rounded-full border border-transparent px-4 py-1.5 hover:text-white">
            Settings
          </button>
        </div>
      </nav>

      <div className="grid grow gap-6 overflow-hidden lg:grid-cols-[3fr_1fr]">
        <section className="flex h-full flex-col rounded-[32px] border border-slate-900/80 bg-slate-950/70 p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs tracking-[0.35em] text-slate-500 uppercase">Biểu đồ giá</p>
                <h2 className="text-3xl font-semibold text-white">{symbol}</h2>
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
                        ? 'border-emerald-400 bg-emerald-500/10 text-white'
                        : 'border-slate-700 text-slate-300 hover:border-slate-500',
                    ].join(' ')}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <SymbolSelector value={symbol} onChange={handleSymbolChange} />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <TimeframeSelector value={timeframe} onChange={handleTimeframeChange} />
              <p className="text-xs text-slate-500">
                Cập nhật:
                {' '}
                {quote ? new Date(quote.updatedAt).toLocaleTimeString() : '--'}
              </p>
            </div>
          </div>

          <div className="flex grow flex-col">
            {isLoading
              ? (
                  <div className="flex grow items-center justify-center rounded-[28px] border border-slate-800 bg-slate-950/40 text-sm tracking-[0.4em] text-slate-500 uppercase">
                    Loading data…
                  </div>
                )
              : (
                  <TradingChart
                    candles={candles}
                    symbol={symbol}
                    timeframe={timeframe}
                    chartType={chartType}
                    theme="dark"
                    className="h-full grow"
                  />
                )}
          </div>
        </section>

        <aside className="flex h-full flex-col gap-4 rounded-[32px] border border-slate-900/80 bg-slate-950/60 p-4">
          <section className="flex h-0 flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] tracking-[0.35em] text-slate-500 uppercase">Danh sách</p>
                <h3 className="text-lg font-semibold text-white">Watchlist</h3>
              </div>
            </div>
            <div className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1">
              {watchlistSymbols.map((item) => {
                const data = watchlistQuotes[item];
                const changeColorItem = data?.change24h
                  ? data.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  : 'text-slate-500';
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSymbolChange(item)}
                    className={[
                      'flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition',
                      item === symbol
                        ? 'border-emerald-400 bg-emerald-500/10 text-white'
                        : 'border-slate-800 text-slate-200 hover:border-slate-600',
                    ].join(' ')}
                  >
                    <div>
                      <p className="text-sm font-semibold">{item}</p>
                      <p className="text-xs text-slate-500">Realtime</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-semibold">{formatPrice(data?.price)}</p>
                      <p className={`text-xs ${changeColorItem}`}>
                        {data ? `${data.change24h >= 0 ? '+' : ''}${data.change24h.toFixed(2)}%` : '--'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="flex-shrink-0 space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <div>
              <p className="text-[11px] tracking-[0.35em] text-slate-500 uppercase">Chi tiết</p>
              <h3 className="text-xl font-semibold text-white">{symbol}</h3>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-semibold text-white">{formatPrice(quote?.price)}</span>
              <span className={`text-sm font-semibold ${changeColor}`}>
                {quote ? `${quote.change24h >= 0 ? '+' : ''}${quote.change24h.toFixed(2)}%` : '--'}
              </span>
            </div>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs tracking-[0.3em] text-slate-500 uppercase">Open</dt>
                <dd className="mt-1 text-white">{formatPrice(latestCandle?.open)}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.3em] text-slate-500 uppercase">Close</dt>
                <dd className="mt-1 text-white">{formatPrice(latestCandle?.close)}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.3em] text-slate-500 uppercase">High</dt>
                <dd className="mt-1 text-white">{formatPrice(latestCandle?.high)}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.3em] text-slate-500 uppercase">Low</dt>
                <dd className="mt-1 text-white">{formatPrice(latestCandle?.low)}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.3em] text-slate-500 uppercase">Volume</dt>
                <dd className="mt-1 text-white">{latestCandle ? `${latestCandle.volume.toFixed(0)}` : '--'}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.3em] text-slate-500 uppercase">Timeframe</dt>
                <dd className="mt-1 text-white">{timeframe}</dd>
              </div>
            </dl>
            <p className="text-xs text-slate-500">
              Dữ liệu cập nhật lúc:
              {' '}
              {quote ? new Date(quote.updatedAt).toLocaleTimeString() : '--'}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
};

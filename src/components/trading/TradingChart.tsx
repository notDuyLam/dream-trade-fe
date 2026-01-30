'use client';

import type {
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
} from 'lightweight-charts';
import type {
  CandleDataPoint,
  ChartDisplay,
  ChartTheme,
  Timeframe,
  TradingSymbol,
} from '@/types/trading';
import {
  CandlestickSeries,
  ColorType,
  createChart,
  HistogramSeries,
  LineSeries,
} from 'lightweight-charts';
import { useCallback, useEffect, useRef, useState } from 'react';

type TradingChartProps = {
  candles: CandleDataPoint[];
  symbol: TradingSymbol;
  timeframe: Timeframe;
  theme?: ChartTheme;
  chartType: ChartDisplay;
  className?: string;
};

const themeMap = {
  dark: {
    background: 'transparent',
    text: '#cbd5f5',
    grid: '#1f2937',
  },
  light: {
    background: '#ffffff',
    text: '#0f172a',
    grid: '#e2e8f0',
  },
} satisfies Record<
  ChartTheme,
  { background: string; text: string; grid: string }
>;

export const TradingChart = (props: TradingChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const priceSeriesRef = useRef<
    ISeriesApi<'Candlestick'> | ISeriesApi<'Line'> | null
  >(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const ma7SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const ma25SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const ma99SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  const [latestCandle, setLatestCandle] = useState<CandleDataPoint | null>(null);
  const seriesReadyRef = useRef<boolean>(false);
  const candleBufferRef = useRef<CandleDataPoint[]>([]);
  const currentSeriesTypeRef = useRef<ChartDisplay | null>(null);

  // Helper to calculate SMA
  const calculateSMA = (data: CandleDataPoint[], period: number) => {
    const smaData = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        continue;
      }
      let sum = 0;
      for (let j = 0; j < period; j++) {
        const candle = data[i - j];
        if (!candle) {
          continue;
        }
        sum += candle.close;
      }
      const currentCandle = data[i];
      if (!currentCandle) {
        continue;
      }
      smaData.push({
        time: currentCandle.time as UTCTimestamp,
        value: sum / period,
      });
    }
    return smaData;
  };

  // 1. Chart Creation & Lifecycle (Stable across mode switches)
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const { background, text, grid } = themeMap[props.theme ?? 'dark'];

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: background },
        textColor: text,
      },
      rightPriceScale: {
        borderColor: grid,
        scaleMargins: { top: 0.1, bottom: 0.2 },
      },
      timeScale: {
        borderColor: grid,
        timeVisible: true,
        secondsVisible: true,
      },
      grid: {
        vertLines: { color: grid },
        horzLines: { color: grid },
      },
      crosshair: { mode: 1 },
    });

    chartRef.current = chart;

    // Create Immutable Series (MA + Volume)
    const ma7Series = chart.addSeries(LineSeries, {
      color: '#EAB308',
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    const ma25Series = chart.addSeries(LineSeries, {
      color: '#A855F7',
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    const ma99Series = chart.addSeries(LineSeries, {
      color: '#F43F5E',
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#334155',
      priceFormat: { type: 'volume' },
      priceScaleId: '',
    });
    volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } });

    ma7SeriesRef.current = ma7Series;
    ma25SeriesRef.current = ma25Series;
    ma99SeriesRef.current = ma99Series;
    volumeSeriesRef.current = volumeSeries;

    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { width, height } = entry.contentRect;
        chart.applyOptions({ width, height });
      });
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesReadyRef.current = false;
      priceSeriesRef.current = null;
      currentSeriesTypeRef.current = null;
    };
  }, [props.symbol, props.theme, props.timeframe]);

  // 2. Buffer Sync (History -> Buffer)
  // Only runs when symbols/timeframe/initial candles change.
  useEffect(() => {
    candleBufferRef.current = [...props.candles];

    // Only refresh if series is ready AND types match
    if (seriesReadyRef.current && priceSeriesRef.current && currentSeriesTypeRef.current === props.chartType) {
      const candles = candleBufferRef.current;
      if (props.chartType === 'candles') {
        (priceSeriesRef.current as ISeriesApi<'Candlestick'>).setData(candles.map(c => ({
          time: c.time as UTCTimestamp,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        })));
      } else {
        (priceSeriesRef.current as ISeriesApi<'Line'>).setData(candles.map(c => ({
          time: c.time as UTCTimestamp,
          value: c.close,
        })));
      }
      volumeSeriesRef.current?.setData(candles.map(c => ({
        time: c.time as UTCTimestamp,
        value: c.volume,
        color: c.open > c.close ? '#ef4444' : '#10b981',
      })));
      ma7SeriesRef.current?.setData(calculateSMA(candles, 7));
      ma25SeriesRef.current?.setData(calculateSMA(candles, 25));
      ma99SeriesRef.current?.setData(calculateSMA(candles, 99));
    }
  }, [props.candles, props.symbol, props.timeframe, props.chartType]);

  // 3. Price Series Swap & Continuity
  // Handles chartType changes and ensures the new series is immediately populated.
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) {
      return;
    }

    if (priceSeriesRef.current) {
      chart.removeSeries(priceSeriesRef.current);
    }

    const priceSeries = props.chartType === 'candles'
      ? (chart.addSeries(CandlestickSeries, {
          upColor: '#10b981',
          downColor: '#ef4444',
          wickUpColor: '#10b981',
          wickDownColor: '#ef4444',
          borderVisible: false,
        }) as ISeriesApi<'Candlestick'>)
      : (chart.addSeries(LineSeries, {
          color: '#10b981',
          lineWidth: 2,
        }) as ISeriesApi<'Line'>);

    priceSeriesRef.current = priceSeries;
    currentSeriesTypeRef.current = props.chartType; // Update type record
    seriesReadyRef.current = true;

    // Immediately populate ALL series from unified buffer
    const currentData = candleBufferRef.current;
    if (currentData.length > 0) {
      if (props.chartType === 'candles') {
        priceSeries.setData(currentData.map(c => ({
          time: c.time as UTCTimestamp,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        })));
      } else {
        (priceSeries as ISeriesApi<'Line'>).setData(currentData.map(c => ({
          time: c.time as UTCTimestamp,
          value: c.close,
        })));
      }

      // Populate Volume and MAs as well to ensure historical visibility
      volumeSeriesRef.current?.setData(currentData.map(c => ({
        time: c.time as UTCTimestamp,
        value: c.volume,
        color: c.open > c.close ? '#ef4444' : '#10b981',
      })));
      ma7SeriesRef.current?.setData(calculateSMA(currentData, 7));
      ma25SeriesRef.current?.setData(calculateSMA(currentData, 25));
      ma99SeriesRef.current?.setData(calculateSMA(currentData, 99));
    }
  }, [props.chartType, props.symbol, props.timeframe]);

  // 4. Real-time Subscription Callback
  useEffect(() => {
    if (!seriesReadyRef.current) {
      return;
    }

    let isCancelled = false;
    let unsubscribe: (() => void) | null = null;

    import('@/services/binance/binanceKlineStream').then(({ binanceKlineStream }) => {
      if (isCancelled) {
        return;
      }
      unsubscribe = binanceKlineStream.subscribe(props.symbol, props.timeframe, (candle) => {
        if (isCancelled) {
          return;
        }

        // IMPORTANT: Verify that the current price series matches the data format we are about to push
        // If they don't match (due to chartType swap delay), skip this tick to avoid crashing.
        if (currentSeriesTypeRef.current !== props.chartType) {
          return;
        }

        const time = candle.time as UTCTimestamp;

        // Update internal buffer
        const buffer = candleBufferRef.current;
        const lastCandle = buffer[buffer.length - 1];
        if (lastCandle && lastCandle.time === candle.time) {
          buffer[buffer.length - 1] = candle;
        } else {
          buffer.push(candle);
          if (buffer.length > 500) {
            buffer.shift();
          }
        }

        // Update Charts (Safe guarded by type check above)
        if (props.chartType === 'candles') {
          (priceSeriesRef.current as ISeriesApi<'Candlestick'>)?.update({
            time,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
          });
        } else {
          (priceSeriesRef.current as ISeriesApi<'Line'>)?.update({
            time,
            value: candle.close,
          });
        }

        volumeSeriesRef.current?.update({
          time,
          value: candle.volume,
          color: candle.open > candle.close ? '#ef4444' : '#10b981',
        });

        // Calc MAs
        const updateMA = (period: number, series: ISeriesApi<'Line'> | null) => {
          if (!series || buffer.length < period) {
            return;
          }
          let sum = 0;
          for (let i = buffer.length - period; i < buffer.length; i++) {
            const candle = buffer[i];
            if (candle) {
              sum += candle.close;
            }
          }
          (series as ISeriesApi<'Line'>).update({ time, value: sum / period });
        };
        updateMA(7, ma7SeriesRef.current);
        updateMA(25, ma25SeriesRef.current);
        updateMA(99, ma99SeriesRef.current);

        setLatestCandle(candle);
      });
    });

    return () => {
      isCancelled = true;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [props.symbol, props.timeframe, props.chartType]);

  // Legend State
  const [legendData, setLegendData] = useState<{
    time: number | undefined;
    open: number | undefined;
    high: number | undefined;
    low: number | undefined;
    close: number | undefined;
    change: number | undefined;
    changePercent: number | undefined;
    ma7: number | undefined;
    ma25: number | undefined;
    ma99: number | undefined;
    vol: number | undefined;
  }>({
    time: undefined,
    open: undefined,
    high: undefined,
    low: undefined,
    close: undefined,
    change: undefined,
    changePercent: undefined,
    ma7: undefined,
    ma25: undefined,
    ma99: undefined,
    vol: undefined,
  });

  const lastCrosshairParamRef = useRef<any>(null);

  // Centralized legend update logic (Wrapped in useCallback to avoid stale closures in effects)
  const updateLegend = useCallback((param: any, currentLatestCandle: CandleDataPoint | null) => {
    if (!priceSeriesRef.current || !volumeSeriesRef.current) {
      return;
    }

    if (!param || !param.time || !param.point || param.point.x < 0) {
      const activeCandle = currentLatestCandle || candleBufferRef.current[candleBufferRef.current.length - 1];
      if (!activeCandle) {
        return;
      }

      const history = candleBufferRef.current;
      const prevCandle = history.length > 1 ? history[history.length - 2] : activeCandle;
      const change = activeCandle.close - (prevCandle?.close || activeCandle.close);
      const changePercent = (change / (prevCandle?.close || 1)) * 100;

      setLegendData({
        time: activeCandle.time,
        open: activeCandle.open,
        high: activeCandle.high,
        low: activeCandle.low,
        close: activeCandle.close,
        change,
        changePercent,
        ma7: undefined,
        ma25: undefined,
        ma99: undefined,
        vol: activeCandle.volume,
      });
      return;
    }

    const candleData = param.seriesData.get(priceSeriesRef.current);
    const ma7SeriesMatch = ma7SeriesRef.current;
    const ma25SeriesMatch = ma25SeriesRef.current;
    const ma99SeriesMatch = ma99SeriesRef.current;
    const volumeSeriesMatch = volumeSeriesRef.current;

    const ma7 = ma7SeriesMatch ? param.seriesData.get(ma7SeriesMatch)?.value : undefined;
    const ma25 = ma25SeriesMatch ? param.seriesData.get(ma25SeriesMatch)?.value : undefined;
    const ma99 = ma99SeriesMatch ? param.seriesData.get(ma99SeriesMatch)?.value : undefined;
    const vol = volumeSeriesMatch ? param.seriesData.get(volumeSeriesMatch)?.value : undefined;

    if (candleData) {
      setLegendData({
        time: candleData.time as number,
        open: candleData.open,
        high: candleData.high,
        low: candleData.low,
        close: candleData.close,
        change: candleData.close - (candleData.open || candleData.close),
        changePercent: (candleData.open ? ((candleData.close - candleData.open) / candleData.open) * 100 : 0),
        ma7: ma7 as number | undefined,
        ma25: ma25 as number | undefined,
        ma99: ma99 as number | undefined,
        vol: vol as number | undefined,
      });
    }
  }, []);
  // priceSeriesRef/volumeSeriesRef are refs, candleBufferRef is a ref

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) {
      return;
    }
    const handleMove = (param: any) => {
      lastCrosshairParamRef.current = param;
      requestAnimationFrame(() => {
        updateLegend(param, latestCandle);
      });
    };
    chart.subscribeCrosshairMove(handleMove);
    return () => {
      chart.unsubscribeCrosshairMove(handleMove);
    };
  }, [latestCandle, updateLegend]);

  useEffect(() => {
    const lastParam = lastCrosshairParamRef.current;
    if (!lastParam || !lastParam.time || !lastParam.point || lastParam.point.x < 0) {
      requestAnimationFrame(() => {
        updateLegend(null, latestCandle);
      });
    }
  }, [latestCandle, updateLegend]);

  const containerClass = [
    'rounded-2xl border border-slate-800/60 bg-slate-950/40 p-2 min-h-[420px] lg:min-h-[560px] relative font-mono',
    props.className ?? '',
  ].filter(Boolean).join(' ');

  const formatPrice = (price: number | undefined) => (price !== undefined ? price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '--');
  const formatVol = (vol: number | undefined) => (vol !== undefined ? vol.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '--');
  const formatDate = (time: number | undefined) => {
    if (!time) {
      return '--';
    }
    const date = new Date(time * 1000);
    return date.toLocaleString('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={containerClass}>
      <div className="pointer-events-none absolute top-2 right-14 left-3 z-10 flex flex-col gap-1 text-[10px] select-none sm:text-xs">
        <div className="flex flex-wrap gap-3 text-slate-400">
          <span className="text-slate-200">{formatDate(legendData.time)}</span>
          <span>
            Open:
            <span className={legendData.open && legendData.close && legendData.open < legendData.close ? 'text-[#10b981]' : 'text-[#ef4444]'}>
              {formatPrice(legendData.open)}
            </span>
          </span>
          <span>
            High:
            <span className="text-slate-200">{formatPrice(legendData.high)}</span>
          </span>
          <span>
            Low:
            <span className="text-slate-200">{formatPrice(legendData.low)}</span>
          </span>
          <span>
            Close:
            <span className={legendData.open && legendData.close && legendData.open < legendData.close ? 'text-[#10b981]' : 'text-[#ef4444]'}>
              {formatPrice(legendData.close)}
            </span>
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {legendData.ma7 !== undefined && (
            <span className="text-[#EAB308]">
              MA(7):
              {formatPrice(legendData.ma7)}
            </span>
          )}
          {legendData.ma25 !== undefined && (
            <span className="text-[#A855F7]">
              MA(25):
              {formatPrice(legendData.ma25)}
            </span>
          )}
          {legendData.ma99 !== undefined && (
            <span className="text-[#F43F5E]">
              MA(99):
              {formatPrice(legendData.ma99)}
            </span>
          )}
        </div>
      </div>
      <div className="h-full w-full rounded-xl bg-slate-950" ref={containerRef} />
      <div className="pointer-events-none absolute bottom-[calc(18%+4px)] left-3 z-10 text-[10px] font-medium select-none sm:text-xs">
        {legendData.vol !== undefined && (
          <span className="text-slate-400">
            Vol(
            {props.symbol.replace('USDT', '') || 'BTC'}
            ):
            <span className="text-slate-200">{formatVol(legendData.vol)}</span>
          </span>
        )}
      </div>
      <div className="pointer-events-none absolute right-14 bottom-[18%] left-0 border-t border-dashed border-slate-800/80" style={{ height: '1px' }} />
    </div>
  );
};

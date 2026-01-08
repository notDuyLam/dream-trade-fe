'use client';

import type {
  HistogramData,
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
import { useEffect, useRef, useState } from 'react';

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
        scaleMargins: {
          top: 0.1,
          bottom: 0.2, // Reserve bottom 20% for volume
        },
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
      crosshair: {
        mode: 1,
      },
    });

    const priceSeries
      = props.chartType === 'candles'
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

    // Initialize MA Series
    const ma7Series = chart.addSeries(LineSeries, {
      color: '#EAB308', // Yellow
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    const ma25Series = chart.addSeries(LineSeries, {
      color: '#A855F7', // Purple
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    const ma99Series = chart.addSeries(LineSeries, {
      color: '#F43F5E', // Pink/Dark Rose
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#334155',
      priceFormat: { type: 'volume' },
      priceScaleId: '', // Overlay on separate scale
    }) as ISeriesApi<'Histogram'>;

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.82, // Volume starts at 82% from top (bottom 18%)
        bottom: 0,
      },
    });

    chartRef.current = chart;
    priceSeriesRef.current = priceSeries;
    volumeSeriesRef.current = volumeSeries;
    ma7SeriesRef.current = ma7Series;
    ma25SeriesRef.current = ma25Series;
    ma99SeriesRef.current = ma99Series;

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
      priceSeriesRef.current = null;
      volumeSeriesRef.current = null;
      ma7SeriesRef.current = null;
      ma25SeriesRef.current = null;
      ma99SeriesRef.current = null;
    };
  }, [props.symbol, props.theme, props.timeframe, props.chartType]);

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

  useEffect(() => {
    const priceSeries = priceSeriesRef.current;
    const volumeSeries = volumeSeriesRef.current;
    const candles = props.candles;

    if (!priceSeries || !volumeSeries || candles.length === 0) {
      return;
    }

    const candleData = candles.map(candle => ({
      time: candle.time as UTCTimestamp,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));

    const lineData = candles.map(candle => ({
      time: candle.time as UTCTimestamp,
      value: candle.close,
    }));

    const volumeData: HistogramData[] = candles.map(candle => ({
      time: candle.time as UTCTimestamp,
      value: candle.volume,
      color: candle.open > candle.close ? '#ef4444' : '#10b981',
    }));

    if (props.chartType === 'candles') {
      (priceSeries as ISeriesApi<'Candlestick'>).setData(candleData);
    } else {
      (priceSeries as ISeriesApi<'Line'>).setData(lineData);
    }

    volumeSeries.setData(volumeData);

    // Update MA Data
    if (ma7SeriesRef.current) {
      ma7SeriesRef.current.setData(calculateSMA(candles, 7));
    }
    if (ma25SeriesRef.current) {
      ma25SeriesRef.current.setData(calculateSMA(candles, 25));
    }
    if (ma99SeriesRef.current) {
      ma99SeriesRef.current.setData(calculateSMA(candles, 99));
    }

    // Only set visible range on INITIAL load (not on every update)
    // We check if the chart already has data to decide if it's an initial load
    // Actually, a simpler way is to check if we haven't set the range yet for this symbol/timeframe
    // But since this effect runs on 'props.candles' change, we need a ref to track if we've initialized

    // However, looking at the code, we are calling setData inside this effect.
    // Ideally we should use 'update' method for new candles instead of 'setData' for everything.
    // But since we are replacing the whole array from parent, 'setData' is used.

    // To fix the user issue: we should likely ONLY auto-scale if the user hasn't scrolled away,
    // OR just do it once on mount/symbol change.

    // Let's use a ref to track if we have initialized the view for the current symbol
    // We can't easily track that inside this effect without extra state.

    // IMPROVEMENT: Just verify if we need to reset.
    // Current logic forces reset every time 'candles' prop changes.
    // We will comment out the auto-zoom logic for updates, and let the user manage scroll.
    // Or only do it if the chart was empty before.

    /*
       AUTO-SCROLL LOGIC DISABLED per user request.
       The chart library handles real-time updates automatically if we use 'update'.
       But here we use 'setData'.

       If we want to keep the chart at the latest candle but allow scrolling back:
       The default behavior of lightweight-charts is usually good.
       The issue is lines 171-189 forcing setVisibleRange every render.
    */

    // Only set visible range if it's the very first data load
    if (chartRef.current && candles.length > 0 && priceSeriesRef.current) {
      // We can check the logical range, but simpler is to just NOT force it every time.
      // Let's remove the forced setVisibleRange block entirely for updates.
      // If it's a new symbol, the 'useEffect' dependency on 'props.symbol' in the CREATE chart effect
      // handles the chart recreation.
    }
  }, [props.candles, props.chartType]);

  // DISABLED: WebSocket updates - using real Binance API data instead
  // The WebSocket was overwriting real data with mock data causing chart to show incorrect prices
  /*
  useEffect(() => {
    const priceSeries = priceSeriesRef.current;

    if (!priceSeries) {
      return;
    }

    const unsubscribe = priceStream.subscribe(props.symbol, (price) => {
      if (props.chartType === 'candles') {
        (priceSeries as ISeriesApi<'Candlestick'>).update({
          time: Math.floor(price.updatedAt / 1000) as UTCTimestamp,
          open: price.price,
          high: price.price,
          low: price.price,
          close: price.price,
        });
      } else {
        (priceSeries as ISeriesApi<'Line'>).update({
          time: Math.floor(price.updatedAt / 1000) as UTCTimestamp,
          value: price.price,
        });
      }
    });

    return unsubscribe;
  }, [props.symbol, props.chartType]);
  */

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

  useEffect(() => {
    if (!chartRef.current || !ma7SeriesRef.current || !ma25SeriesRef.current || !ma99SeriesRef.current || !volumeSeriesRef.current) {
      return;
    }

    const handleCrosshairMove = (param: any) => {
      // If no valid point, default to the last candle (latest data)
      if (!param.time || param.point.x < 0 || param.point.y < 0) {
        // Ideally we show the latest candle data here, but for simplicity let's just show nothing or keep previous
        // To mimic Binance, when not hovering, it usually shows the latest candle's info.
        // For now let's just return undefined to keep it clean or we can fetch the last candle from props.candles
        if (props.candles.length > 0) {
          const lastCandle = props.candles[props.candles.length - 1];
          const prevCandle = props.candles.length > 1 ? props.candles[props.candles.length - 2] : lastCandle;

          if (!lastCandle || !prevCandle) {
            setLegendData({
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
            return;
          }

          const change = lastCandle.close - prevCandle.close;
          const changePercent = (change / prevCandle.close) * 100;

          setLegendData({
            time: lastCandle.time,
            open: lastCandle.open,
            high: lastCandle.high,
            low: lastCandle.low,
            close: lastCandle.close,
            change,
            changePercent,
            ma7: undefined, // Difficult to calculate MA here efficiently without more logic, leaving undefined implies hidden
            ma25: undefined,
            ma99: undefined,
            vol: lastCandle.volume,
          });
        } else {
          setLegendData({
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
        }
        return;
      }

      // Get candle data from price series
      const candleData = param.seriesData.get(priceSeriesRef.current);

      const ma7 = param.seriesData.get(ma7SeriesRef.current)?.value;
      const ma25 = param.seriesData.get(ma25SeriesRef.current)?.value;
      const ma99 = param.seriesData.get(ma99SeriesRef.current)?.value;
      const vol = param.seriesData.get(volumeSeriesRef.current)?.value;

      if (candleData) {
        // Calculate Change (approximate if we don't have prev close easily available in this context without looking up raw data)
        // For accurate 'Change', we need previous candle close.
        // Since we can't easily get 'index' here to look up prev candle in props.candles array O(1),
        // we might just show OHLC.
        // Or we can assume 'open' ~ prevClose for simple 'intraday' change logic, but that's inaccurate.
        // Let's just show OHLC for now.

        setLegendData({
          time: candleData.time as number,
          open: candleData.open,
          high: candleData.high,
          low: candleData.low,
          close: candleData.close,
          change: candleData.close - candleData.open, // Using Body change as proxy or just omit
          changePercent: ((candleData.close - candleData.open) / candleData.open) * 100, // This is body %, not change from yesterday
          ma7,
          ma25,
          ma99,
          vol,
        });
      }
    };

    chartRef.current.subscribeCrosshairMove(handleCrosshairMove);

    return () => {
      chartRef.current?.unsubscribeCrosshairMove(handleCrosshairMove);
    };
  }, [props.candles]);

  const containerClass = [
    'rounded-2xl border border-slate-800/60 bg-slate-950/40 p-2 min-h-[420px] lg:min-h-[560px] relative font-mono',
    props.className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const formatPrice = (price: number | undefined) => price !== undefined ? price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '--';
  const formatVol = (vol: number | undefined) => vol !== undefined ? vol.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '--';
  const formatDate = (time: number | undefined) => {
    if (!time) {
      return '--';
    }
    const date = new Date(time * 1000); // lightweight-charts uses seconds
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
      {/* TOP COMPONENT LEGEND: OHLC + MA */}
      <div className="pointer-events-none absolute top-2 right-14 left-3 z-10 flex flex-col gap-1 text-[10px] select-none sm:text-xs">
        {/* Line 1: OHLC */}
        <div className="flex flex-wrap gap-3 text-slate-400">
          <span className="text-slate-200">{formatDate(legendData.time)}</span>
          <span>
            Open:
            <span className={legendData.open && legendData.close && legendData.open < legendData.close ? 'text-[#10b981]' : 'text-[#ef4444]'}>{formatPrice(legendData.open)}</span>
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
            <span className={legendData.open && legendData.close && legendData.open < legendData.close ? 'text-[#10b981]' : 'text-[#ef4444]'}>{formatPrice(legendData.close)}</span>
          </span>
          {/* <span>Change: <span className={legendData.changePercent && legendData.changePercent >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}>{legendData.changePercent?.toFixed(2)}%</span></span> */}
        </div>
        {/* Line 2: MAs */}
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

      <div
        className="h-full w-full rounded-xl bg-slate-950"
        ref={containerRef}
      />

      {/* VOLUME LEGEND: Positioned just above the volume chart */}
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

      {/* Volume Separator Line (~82% height matching scaleMargins) */}
      <div className="pointer-events-none absolute right-14 bottom-[18%] left-0 border-t border-dashed border-slate-800/80" style={{ height: '1px' }}></div>
    </div>
  );
};

'use client';

import type { HistogramData, IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import type { CandleDataPoint, ChartDisplay, ChartTheme, Timeframe, TradingSymbol } from '@/types/trading';
import { CandlestickSeries, ColorType, createChart, HistogramSeries, LineSeries } from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import { binancePriceStream } from '@/services/binance/binanceWebSocket';

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
} satisfies Record<ChartTheme, { background: string; text: string; grid: string }>;

export const TradingChart = (props: TradingChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const priceSeriesRef = useRef<ISeriesApi<'Candlestick'> | ISeriesApi<'Line'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

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
      },
      timeScale: {
        borderColor: grid,
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

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#334155',
      priceFormat: { type: 'volume' },
      priceScaleId: '',
    }) as ISeriesApi<'Histogram'>;

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    chartRef.current = chart;
    priceSeriesRef.current = priceSeries;
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
      priceSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, [props.symbol, props.theme, props.timeframe, props.chartType]);

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

    // Zoom vào phần cuối sau khi set data
    if (chartRef.current && candles.length > 0) {
      const totalCandles = candles.length;
      const visibleCandles = Math.min(60, totalCandles);
      const startIndex = Math.max(0, totalCandles - visibleCandles);

      const startCandle = candles[startIndex];
      const endCandle = candles[totalCandles - 1];

      if (!startCandle || !endCandle) {
        return;
      }

      const startTime = startCandle.time as UTCTimestamp;
      const endTime = endCandle.time as UTCTimestamp;

      chartRef.current.timeScale().setVisibleRange({
        from: startTime,
        to: endTime,
      });
    }
  }, [props.candles, props.chartType]);

  useEffect(() => {
    const priceSeries = priceSeriesRef.current;
    const candles = props.candles;

    if (!priceSeries || candles.length === 0) {
      return;
    }

    const unsubscribe = binancePriceStream.subscribe(props.symbol, (price) => {
      const lastCandle = candles[candles.length - 1];
      if (!lastCandle) {
        return;
      }

      const updatedCandle = {
        time: lastCandle.time as UTCTimestamp,
        open: lastCandle.open,
        high: Math.max(lastCandle.high, price.price),
        low: Math.min(lastCandle.low, price.price),
        close: price.price,
      };

      if (props.chartType === 'candles') {
        (priceSeries as ISeriesApi<'Candlestick'>).update(updatedCandle);
      } else {
        (priceSeries as ISeriesApi<'Line'>).update({
          time: lastCandle.time as UTCTimestamp,
          value: price.price,
        });
      }
    });

    return unsubscribe;
  }, [props.symbol, props.chartType, props.candles]);

  const containerClass = [
    'rounded-2xl border border-slate-300 dark:border-slate-800/60 bg-slate-100 dark:bg-slate-950/40 p-2 min-h-[420px] lg:min-h-[560px]',
    props.className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClass}>
      <div className="h-full w-full rounded-xl bg-slate-200 dark:bg-slate-950" ref={containerRef} />
    </div>
  );
};

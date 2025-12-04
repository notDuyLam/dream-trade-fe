'use client';

import type { HistogramData, IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import type {
  CandleDataPoint,
  ChartTheme,
  Timeframe,
  TradingSymbol,
} from '@/types/trading';
import { CandlestickSeries, ColorType, createChart, HistogramSeries } from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import { priceStream } from '@/services/websocket/priceStream';

type TradingChartProps = {
  candles: CandleDataPoint[];
  symbol: TradingSymbol;
  timeframe: Timeframe;
  theme?: ChartTheme;
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
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
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

    const candleSeries = chart.addSeries(
      CandlestickSeries,
      {
        upColor: '#10b981',
        downColor: '#ef4444',
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
        borderVisible: false,
      },
    ) as ISeriesApi<'Candlestick'>;

    const volumeSeries = chart.addSeries(
      HistogramSeries,
      {
        color: '#334155',
        priceFormat: { type: 'volume' },
        priceScaleId: '',
      },
    ) as ISeriesApi<'Histogram'>;

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { width, height } = entry.contentRect;
        chart.applyOptions({ width, height });
      });
    });

    observer.observe(containerRef.current);
    chart.timeScale().fitContent();

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, [props.symbol, props.theme, props.timeframe]);

  useEffect(() => {
    const candleSeries = candleSeriesRef.current;
    const volumeSeries = volumeSeriesRef.current;

    if (!candleSeries || !volumeSeries || !props.candles.length) {
      return;
    }

    const candleData = props.candles.map(candle => ({
      time: candle.time as UTCTimestamp,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));

    const volumeData: HistogramData[] = props.candles.map(candle => ({
      time: candle.time as UTCTimestamp,
      value: candle.volume,
      color: candle.open > candle.close ? '#ef4444' : '#10b981',
    }));

    candleSeries.setData(candleData);
    volumeSeries.setData(volumeData);
    chartRef.current?.timeScale().fitContent();
  }, [props.candles]);

  useEffect(() => {
    const candleSeries = candleSeriesRef.current;

    if (!candleSeries) {
      return;
    }

    const unsubscribe = priceStream.subscribe(props.symbol, (price) => {
      candleSeries.update({
        time: Math.floor(price.updatedAt / 1000) as UTCTimestamp,
        open: price.price,
        high: price.price,
        low: price.price,
        close: price.price,
      });
    });

    return unsubscribe;
  }, [props.symbol]);

  return (
    <div className="h-[420px] w-full" ref={containerRef} />
  );
};

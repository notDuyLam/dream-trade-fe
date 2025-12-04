'use client';

import type { CandleDataPoint, Timeframe, TradingSymbol } from '@/types/trading';
import { useCallback, useState } from 'react';
import { mockChartService } from '@/services/mock/chartData';
import { SymbolSelector } from './SymbolSelector';
import { TimeframeSelector } from './TimeframeSelector';
import { TradingChart } from './TradingChart';

type TradingWorkspaceProps = {
  defaultSymbol: TradingSymbol;
  defaultTimeframe: Timeframe;
  initialCandles: CandleDataPoint[];
};

export const TradingWorkspace = (props: TradingWorkspaceProps) => {
  const [symbol, setSymbol] = useState<TradingSymbol>(props.defaultSymbol);
  const [timeframe, setTimeframe] = useState<Timeframe>(props.defaultTimeframe);
  const [candles, setCandles] = useState<CandleDataPoint[]>(props.initialCandles);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SymbolSelector value={symbol} onChange={handleSymbolChange} />
        <TimeframeSelector value={timeframe} onChange={handleTimeframeChange} />
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-3">
        {isLoading
          ? (
              <div className="flex h-[420px] items-center justify-center text-sm tracking-[0.4em] text-slate-500 uppercase">
                Loading data…
              </div>
            )
          : (
              <TradingChart
                candles={candles}
                symbol={symbol}
                timeframe={timeframe}
                theme="dark"
              />
            )}
      </div>
    </div>
  );
};

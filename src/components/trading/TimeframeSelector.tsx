'use client';

import type { Timeframe } from '@/types/trading';

const defaultTimeframes: Timeframe[] = ['1s', '1m', '5m', '15m', '1h', '4h', '1d'];

type TimeframeSelectorProps = {
  value: Timeframe;
  onChange: (timeframe: Timeframe) => void;
  timeframes?: Timeframe[];
};

export const TimeframeSelector = (props: TimeframeSelectorProps) => {
  const options = props.timeframes ?? defaultTimeframes;

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(timeframe => (
        <button
          key={timeframe}
          type="button"
          onClick={() => props.onChange(timeframe)}
          className={[
            'rounded-lg px-3 py-1 text-[10px] font-bold tracking-widest uppercase transition-all duration-300',
            timeframe === props.value
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
              : 'bg-slate-200/50 text-slate-600 hover:bg-slate-300/50 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-700/50',
          ].join(' ')}
        >
          {timeframe}
        </button>
      ))}
    </div>
  );
};

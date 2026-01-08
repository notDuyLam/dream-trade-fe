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
            'rounded-md border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition',
            timeframe === props.value
              ? 'border-emerald-400 bg-emerald-500/10 text-slate-900 dark:text-white'
              : 'border-slate-400 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-500',
          ].join(' ')}
        >
          {timeframe}
        </button>
      ))}
    </div>
  );
};

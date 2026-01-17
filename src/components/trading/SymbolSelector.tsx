'use client';

import type { TradingSymbol } from '@/types/trading';
import { CoinService } from '@/services/coins/coinService';

type SymbolSelectorProps = {
  value: TradingSymbol;
  onChange: (symbol: TradingSymbol) => void;
  symbols?: TradingSymbol[];
};

export const SymbolSelector = (props: SymbolSelectorProps) => {
  const items = props.symbols ?? CoinService.getAllSymbols();

  return (
    <div className="flex flex-wrap gap-2">
      {items.map(symbol => (
        <button
          key={symbol}
          type="button"
          onClick={() => props.onChange(symbol)}
          className={[
            'rounded-full border px-4 py-1.5 text-sm font-medium transition',
            symbol === props.value
              ? 'border-emerald-400 bg-emerald-500/10 text-slate-900 dark:text-white'
              : 'border-slate-400 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-500',
          ].join(' ')}
        >
          {symbol}
        </button>
      ))}
    </div>
  );
};

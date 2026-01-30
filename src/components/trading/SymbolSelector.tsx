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
            'rounded-full px-4 py-1.5 text-xs font-semibold tracking-tight transition-all duration-300',
            symbol === props.value
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
              : 'bg-slate-200/50 text-slate-600 hover:bg-slate-300/50 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-700/50',
          ].join(' ')}
        >
          {symbol}
        </button>
      ))}
    </div>
  );
};

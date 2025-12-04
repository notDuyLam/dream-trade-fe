'use client';

import type { TradingSymbol } from '@/types/trading';

const defaultSymbols: TradingSymbol[] = [
  'BTCUSDT',
  'ETHUSDT',
  'BNBUSDT',
  'SOLUSDT',
  'XRPUSDT',
  'ADAUSDT',
];

type SymbolSelectorProps = {
  value: TradingSymbol;
  onChange: (symbol: TradingSymbol) => void;
  symbols?: TradingSymbol[];
};

export const SymbolSelector = (props: SymbolSelectorProps) => {
  const items = props.symbols ?? defaultSymbols;

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
              ? 'border-emerald-400 bg-emerald-500/10 text-white'
              : 'border-slate-700 text-slate-300 hover:border-slate-500',
          ].join(' ')}
        >
          {symbol}
        </button>
      ))}
    </div>
  );
};

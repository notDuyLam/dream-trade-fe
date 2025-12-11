import type { ReactNode } from 'react';

export default function MarketLayout(props: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      {props.children}
    </div>
  );
}

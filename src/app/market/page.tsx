import type { Metadata } from 'next';
import { CoinList } from '@/components/trading/CoinList';

export const metadata: Metadata = {
  title: 'Market',
  description: 'Browse all available cryptocurrencies and their market data.',
};

export default function MarketPage() {
  return (
    <main className="flex h-full flex-1 flex-col overflow-hidden px-4 py-4 md:px-8 md:py-6">
      <div className="flex h-full flex-col gap-6">
        <div>
          <h1 className="text-3xl font-semibold text-white">Market Overview</h1>
          <p className="mt-2 text-sm text-slate-400">
            Real-time prices and market data for all supported cryptocurrencies
          </p>
        </div>
        <CoinList />
      </div>
    </main>
  );
}

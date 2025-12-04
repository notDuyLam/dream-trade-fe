import type { Metadata } from 'next';
import type { Timeframe, TradingSymbol } from '@/types/trading';
import { TradingWorkspace } from '@/components/trading/TradingWorkspace';
import { mockChartService } from '@/services/mock/chartData';

export const metadata: Metadata = {
  title: 'Workspace',
  description: 'Monitor markets, news, and AI signals in one place.',
};

export default async function DashboardPage() {
  const DEFAULT_SYMBOL: TradingSymbol = 'BTCUSDT';
  const DEFAULT_TIMEFRAME: Timeframe = '1h';

  const initialCandles = await mockChartService.fetchCandles({
    symbol: DEFAULT_SYMBOL,
    timeframe: DEFAULT_TIMEFRAME,
  });

  return (
    <main className="flex h-full flex-1 flex-col overflow-hidden px-4 py-4 md:px-8 md:py-6">
      <TradingWorkspace
        defaultSymbol={DEFAULT_SYMBOL}
        defaultTimeframe={DEFAULT_TIMEFRAME}
        initialCandles={initialCandles}
      />
    </main>
  );
}

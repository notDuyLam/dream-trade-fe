import type { Metadata } from 'next';
import type { Timeframe, TradingSymbol } from '@/types/trading';
import { TradingWorkspace } from '@/components/trading/TradingWorkspace';
import { binanceService } from '@/services/binance/binanceApi';
import { CoinService } from '@/services/coins/coinService';

export const metadata: Metadata = {
  title: 'Workspace',
  description: 'Monitor markets, news, and AI signals in one place.',
};

type DashboardPageProps = {
  searchParams: Promise<{ symbol?: string }>;
};

export default async function DashboardPage(props: DashboardPageProps) {
  const searchParams = await props.searchParams;
  const DEFAULT_SYMBOL: TradingSymbol = (searchParams.symbol as TradingSymbol) || 'BTCUSDT';
  const DEFAULT_TIMEFRAME: Timeframe = '1h';

  // Validate symbol using CoinService
  const validSymbols = CoinService.getAllSymbols();
  const symbol = CoinService.isValidSymbol(DEFAULT_SYMBOL) ? DEFAULT_SYMBOL : (validSymbols[0] ?? 'BTCUSDT');

  const initialCandles = await binanceService.fetchCandles({
    symbol,
    timeframe: DEFAULT_TIMEFRAME,
  });

  return (
    <main className="flex h-full flex-1 flex-col overflow-hidden bg-white px-4 py-4 md:px-8 md:py-6 dark:bg-slate-950">
      <TradingWorkspace defaultSymbol={symbol} defaultTimeframe={DEFAULT_TIMEFRAME} initialCandles={initialCandles} />
    </main>
  );
}

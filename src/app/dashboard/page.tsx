import type { Metadata } from 'next';
import type { Timeframe, TradingSymbol } from '@/types/trading';
import Link from 'next/link';
import { AiInsightsPanel } from '@/components/trading/AiInsightsPanel';
import { NewsFeed } from '@/components/trading/NewsFeed';
import { TradingWorkspace } from '@/components/trading/TradingWorkspace';
import { aiAnalysisService } from '@/services/mock/analysisData';
import { mockChartService } from '@/services/mock/chartData';
import { newsFeedService } from '@/services/mock/newsData';
import { TradingLayout } from '@/templates/TradingLayout';
import { AppConfig } from '@/utils/AppConfig';

export const metadata: Metadata = {
  title: 'Workspace',
  description: 'Monitor markets, news, and AI signals in one place.',
};

export default async function DashboardPage() {
  const DEFAULT_SYMBOL: TradingSymbol = 'BTCUSDT';
  const DEFAULT_TIMEFRAME: Timeframe = '1h';

  const [news, insights, initialCandles] = await Promise.all([
    newsFeedService.list(),
    aiAnalysisService.list(),
    mockChartService.fetchCandles({
      symbol: DEFAULT_SYMBOL,
      timeframe: DEFAULT_TIMEFRAME,
    }),
  ]);

  const header = (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.4em] text-slate-500 uppercase">Workspace</p>
          <h1 className="text-3xl font-semibold text-white">Trading Intelligence</h1>
          <p className="mt-1 text-sm text-slate-400">
            Real-time data infrastructure built for discretionary traders.
          </p>
        </div>

        <Link
          href="/dashboard/profile"
          className="rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-white hover:border-slate-500"
        >
          Manage profile
        </Link>
      </div>

      <dl className="mt-6 grid gap-4 text-sm text-slate-300 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <dt className="text-xs tracking-[0.3em] text-slate-500 uppercase">Volatility</dt>
          <dd className="mt-1 text-2xl font-semibold text-white">23.4%</dd>
          <p className="text-xs text-emerald-400">+4.2% vs 30d avg</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <dt className="text-xs tracking-[0.3em] text-slate-500 uppercase">Funding</dt>
          <dd className="mt-1 text-2xl font-semibold text-white">0.015%</dd>
          <p className="text-xs text-slate-400">Binance perp composite</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <dt className="text-xs tracking-[0.3em] text-slate-500 uppercase">News velocity</dt>
          <dd className="mt-1 text-2xl font-semibold text-white">{news.data.length}</dd>
          <p className="text-xs text-slate-400">Stories in the last 2 hours</p>
        </div>
      </dl>
    </>
  );

  const sidebar = (
    <div className="space-y-6">
      <section>
        <div className="mb-3 flex items-center justify-between text-xs tracking-[0.3em] text-slate-500 uppercase">
          <span>News radar</span>
          <span>{news.data.length}</span>
        </div>
        <NewsFeed articles={news.data} />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between text-xs tracking-[0.3em] text-slate-500 uppercase">
          <span>AI causal insights</span>
          <span>{insights.data.length}</span>
        </div>
        <AiInsightsPanel insights={insights.data} />
      </section>
    </div>
  );

  const footer = (
    <div className="flex flex-wrap gap-4 text-xs text-slate-400">
      <span>
        Powered by
        {' '}
        {AppConfig.name}
      </span>
      <span>Mock data shown — plug your REST/WebSocket endpoints when ready.</span>
    </div>
  );

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12">
      <TradingLayout
        header={header}
        primaryPanel={(
          <TradingWorkspace
            defaultSymbol={DEFAULT_SYMBOL}
            defaultTimeframe={DEFAULT_TIMEFRAME}
            initialCandles={initialCandles}
          />
        )}
        secondaryPanel={sidebar}
        footer={footer}
      />
    </main>
  );
}

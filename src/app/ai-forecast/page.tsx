'use client';

import { VipGuard } from '@/components/subscription/VipGuard';

export default function AiForecastPage() {
  return (
    <VipGuard>
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col gap-8 px-4 py-16">
        <div className="space-y-2">
          <p className="text-sm tracking-[0.3em] text-slate-400 uppercase">
            VIP Feature
          </p>
          <h1 className="text-4xl font-semibold text-white">AI Forecast</h1>
          <p className="text-lg text-slate-300">
            Advanced AI-powered market analysis and predictions
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">Market Predictions</h2>
            <p className="text-sm text-slate-400">
              Get AI-generated forecasts for cryptocurrency price movements based on
              technical analysis, market sentiment, and historical patterns.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">Risk Analysis</h2>
            <p className="text-sm text-slate-400">
              Advanced risk assessment tools to help you make informed trading
              decisions with confidence scores and probability estimates.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">Sentiment Analysis</h2>
            <p className="text-sm text-slate-400">
              Real-time sentiment analysis from news, social media, and market
              indicators to gauge market mood and potential price movements.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">Custom Alerts</h2>
            <p className="text-sm text-slate-400">
              Set up personalized alerts based on AI predictions and market
              conditions to never miss important trading opportunities.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/50 bg-emerald-500/10 p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold text-white">Coming Soon</h3>
          <p className="text-sm text-slate-400">
            AI Forecast features are currently in development. Check back soon for
            advanced market predictions and analysis tools.
          </p>
        </div>
      </main>
    </VipGuard>
  );
}

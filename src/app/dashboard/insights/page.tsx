import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Insights | Dream Trade',
  description: 'AI-powered market insights and analysis',
};

export default function InsightsPage() {
  return (
    <main className="flex h-full flex-1 flex-col items-center justify-center overflow-hidden bg-white px-4 py-6 md:px-8 dark:bg-slate-950">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white">
          AI Insights
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Coming soon - AI-powered market analysis and trading signals
        </p>
      </div>
    </main>
  );
}

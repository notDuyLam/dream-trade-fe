import Link from 'next/link';
import { AppConfig } from '@/utils/AppConfig';

const features = [
  {
    title: 'Streaming Market Data',
    description: 'High fidelity candlestick data sourced from Binance and other tier-1 exchanges.',
  },
  {
    title: 'AI-Ready News Feed',
    description: 'Normalized news stories with metadata designed for downstream sentiment models.',
  },
  {
    title: 'Causal Insights',
    description: 'Explainable AI summaries that connect price structure with macro and micro catalysts.',
  },
  {
    title: 'Account Control',
    description: 'Secure profile management built on Clerk with SOC2-ready authentication flows.',
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col gap-16 px-4 py-16">
      <section className="space-y-6 text-center">
        <p className="text-sm tracking-[0.3em] text-slate-400 uppercase">
          {AppConfig.name}
        </p>
        <h1 className="text-4xl leading-tight font-semibold text-white md:text-5xl">
          {AppConfig.tagline}
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-slate-300">
          {AppConfig.description}
          {' '}
          Build investor-grade dashboards powered by live market data, institutional news, and drop-in AI models.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/sign-up"
            className="rounded-md bg-emerald-500 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
          >
            Create account
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md border border-slate-700 px-6 py-3 font-semibold text-white hover:border-slate-500"
          >
            Launch workspace
          </Link>
          <Link
            href="/pricing"
            className="rounded-md border border-slate-700 px-6 py-3 font-semibold text-white hover:border-slate-500"
          >
            Pricing
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {features.map(feature => (
          <article
            key={feature.title}
            className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg shadow-black/20"
          >
            <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

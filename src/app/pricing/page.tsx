import type { Metadata } from 'next';
import { PricingCard } from '@/components/pricing/PricingCard';
import { getAvailablePlans } from '@/services/subscription/subscriptionService';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Choose the perfect plan for your trading needs',
};

export default function PricingPage() {
  const plans = getAvailablePlans();

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col gap-16 px-4 py-16">
      <section className="space-y-6 text-center">
        <p className="text-sm tracking-[0.3em] text-slate-400 uppercase">
          Pricing
        </p>
        <h1 className="text-4xl leading-tight font-semibold text-white md:text-5xl">
          Choose Your Plan
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-slate-300">
          Start free and upgrade when you need advanced features. All plans include
          real-time market data and basic trading tools.
        </p>
      </section>

      <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {plans.map(plan => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </section>

      <section className="mx-auto max-w-3xl space-y-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-8 text-center">
        <h2 className="text-xl font-semibold text-white">Need help choosing?</h2>
        <p className="text-sm text-slate-400">
          Contact our support team to find the perfect plan for your trading needs.
        </p>
        <a
          href="mailto:support@dreamtrade.com"
          className="inline-block text-sm font-semibold text-emerald-400 hover:text-emerald-300"
        >
          Contact Support →
        </a>
      </section>
    </main>
  );
}

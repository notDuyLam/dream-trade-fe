import type { PricingPlan } from '@/types/subscription';
import Link from 'next/link';
import { PlanFeatures } from './PlanFeatures';

type PricingCardProps = {
  plan: PricingPlan;
};

export const PricingCard = ({ plan }: PricingCardProps) => {
  const isPopular = plan.popular ?? false;
  const isFree = plan.price === 0;

  return (
    <div
      className={[
        'relative flex flex-col rounded-2xl border p-8 transition-all',
        isPopular
          ? 'border-emerald-500 bg-slate-900/60 shadow-lg shadow-emerald-500/20'
          : 'border-slate-800 bg-slate-950/60',
      ].join(' ')}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-emerald-500 px-4 py-1 text-xs font-semibold text-white">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
        <p className="mt-2 text-sm text-slate-400">{plan.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white">
            {plan.price === 0 ? 'Free' : `$${plan.price.toFixed(2)}`}
          </span>
          {plan.price > 0 && (
            <span className="text-sm text-slate-400">/month</span>
          )}
        </div>
      </div>

      <div className="mb-8 flex-1">
        <PlanFeatures features={plan.features} />
      </div>

      <Link
        href={isFree ? '/sign-up' : `/checkout?plan=${plan.id}`}
        className={[
          'inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold transition',
          isPopular
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-400'
            : 'border border-slate-700 bg-slate-900/40 text-white hover:border-slate-600',
        ].join(' ')}
      >
        {plan.ctaText}
      </Link>
    </div>
  );
};

'use client';

import type { CheckoutFormData } from '@/components/checkout/CheckoutForm';
import type { PricingPlan } from '@/types/subscription';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { getPlanById } from '@/services/subscription/subscriptionService';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [plan, setPlan] = useState<PricingPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const planId = searchParams.get('plan') ?? 'vip';
    void (async () => {
      try {
        const selectedPlan = await getPlanById(planId);
        if (!selectedPlan) {
          router.push('/pricing');
          return;
        }
        setPlan(selectedPlan);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load plan:', error);
        router.push('/pricing');
      }
    })();
  }, [searchParams, router]);

  useEffect(() => {
    if (!plan) {
      router.push('/pricing');
    }
  }, [plan, router]);

  const handleSubmit = async (_data: CheckoutFormData) => {
    // Mock payment processing
    // In a real app, this would call the payment API
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Payment processed successfully
  };

  if (isLoading || !plan) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl flex-col gap-8 px-4 py-16">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-white">Checkout</h1>
        <p className="text-sm text-slate-400">
          Complete your purchase to unlock
          {' '}
          {plan.name}
          {' '}
          features
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-8">
          <h2 className="mb-6 text-xl font-semibold text-white">Payment Details</h2>
          <CheckoutForm
            planName={plan.name}
            price={plan.price}
            onSubmit={handleSubmit}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Order Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">
                  {plan.name}
                  {' '}
                  Plan
                </span>
                <span className="text-sm font-semibold text-white">
                  $
                  {plan.price.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Total</span>
                  <span className="text-xl font-bold text-emerald-400">
                    $
                    {plan.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
            <h3 className="mb-3 text-sm font-semibold text-slate-300">What's included</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              {plan.features.filter(f => f.included).map(feature => (
                <li key={feature.id} className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

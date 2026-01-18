'use client';

import type { PricingPlan } from '@/types/subscription';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getPlanById, upgradeToVip } from '@/services/subscription/subscriptionService';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);

  const [plan, setPlan] = useState<PricingPlan | null>(null);

  useEffect(() => {
    const planId = searchParams.get('plan') ?? 'vip';
    void (async () => {
      try {
        const selectedPlan = await getPlanById(planId);
        setPlan(selectedPlan || null);
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

  useEffect(() => {
    if (!plan) {
      return;
    }

    // Update subscription status after payment confirmation
    if (plan.id === 'vip') {
      void upgradeToVip()
        .then(() => {
          setIsProcessing(false);
        })
        .catch((error) => {
          console.error('Failed to upgrade subscription:', error);
          setIsProcessing(false);
        });
      return;
    }

    // Use setTimeout to avoid synchronous setState in effect
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [plan]);

  if (!plan) {
    return null;
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col items-center justify-center gap-8 px-4 py-16">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
          <svg
            className="h-10 w-10 text-emerald-400"
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
        </div>

        <h1 className="mb-2 text-3xl font-semibold text-white">
          Payment Successful!
        </h1>
        <p className="text-slate-400">
          Thank you for subscribing to
          {' '}
          {plan.name}
          {' '}
          plan
        </p>
      </div>

      <div className="w-full space-y-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-8">
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">Subscription Details</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Plan</span>
              <span className="font-semibold text-white">{plan.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Amount</span>
              <span className="font-semibold text-emerald-400">
                $
                {plan.price.toFixed(2)}
                /month
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Status</span>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                Active
              </span>
            </div>
          </div>
        </div>

        {isProcessing && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-center text-sm text-slate-400">
            Activating your subscription...
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="flex-1 rounded-lg bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/settings/billing"
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900/40 px-4 py-3 text-center text-sm font-semibold text-white transition hover:border-slate-600"
          >
            Manage Subscription
          </Link>
        </div>
      </div>

      <p className="text-center text-xs text-slate-500">
        A confirmation email has been sent to your email address.
      </p>
    </main>
  );
}

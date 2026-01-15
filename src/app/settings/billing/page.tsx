'use client';

import type { BillingHistoryItem, SubscriptionInfo } from '@/types/subscription';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BillingHistory } from '@/components/billing/BillingHistory';
import { CurrentPlanCard } from '@/components/billing/CurrentPlanCard';
import { cancelSubscription, getBillingHistory, getUserSubscription } from '@/services/subscription/subscriptionService';

export default function BillingSettingsPage() {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    // Mock user ID - in real app, get from auth context
    const mockUserId = 'default-user';

    void (async () => {
      try {
        const [sub, history] = await Promise.all([
          getUserSubscription(mockUserId),
          getBillingHistory(mockUserId),
        ]);
        setSubscription(sub);
        setBillingHistory(history);
      } catch (error) {
        console.error('Failed to load billing data:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleCancelSubscription = async () => {
    if (!subscription) {
      return;
    }

    // Use window.confirm for now, but in production should use a proper modal component
    // eslint-disable-next-line no-alert
    if (!window.confirm('Are you sure you want to cancel your subscription?')) {
      return;
    }

    setIsCancelling(true);
    try {
      // Mock user ID - in real app, get from auth context
      const mockUserId = 'default-user';
      const updated = await cancelSubscription(mockUserId);
      setSubscription(updated);
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      // In production, use a toast notification or proper error UI
      // eslint-disable-next-line no-alert
      window.alert('Failed to cancel subscription. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </main>
    );
  }

  if (!subscription) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl flex-col gap-8 px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white">Billing Settings</h1>
          <p className="mt-2 text-slate-400">No subscription found</p>
          <Link
            href="/pricing"
            className="mt-4 inline-block rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
          >
            View Plans
          </Link>
        </div>
      </main>
    );
  }

  const isVip = subscription.plan === 'vip';
  const isActive = subscription.status === 'active';

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl flex-col gap-8 px-4 py-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Billing Settings</h1>
        <p className="text-sm text-slate-400">
          Manage your subscription and billing information
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <CurrentPlanCard subscription={subscription} />

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Actions</h3>
          <div className="space-y-3">
            {!isVip && (
              <Link
                href="/pricing"
                className="block w-full rounded-lg bg-emerald-500 px-4 py-2 text-center text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
              >
                Upgrade to VIP
              </Link>
            )}
            {isVip && isActive && (
              <button
                type="button"
                onClick={handleCancelSubscription}
                disabled={isCancelling}
                className="w-full rounded-lg border border-rose-500/50 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-400 transition hover:bg-rose-500/20 disabled:opacity-50"
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
              </button>
            )}
            <Link
              href="/pricing"
              className="block w-full rounded-lg border border-slate-700 bg-slate-900/40 px-4 py-2 text-center text-sm font-semibold text-white transition hover:border-slate-600"
            >
              Change Plan
            </Link>
          </div>
        </div>
      </div>

      <BillingHistory history={billingHistory} />
    </main>
  );
}

'use client';

import type {
  BillingHistoryItem,
  PricingPlan,
  SubscriptionInfo,
} from '@/services/subscription/subscriptionService';
import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { subscriptionService } from '@/services/subscription/subscriptionService';
import { useAuthStore } from '@/stores/authStore';

export function SubscriptionPageContent() {
  const { t } = useLanguage();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const updateUser = useAuthStore(s => s.updateUser);

  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(
    null,
  );
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<
    'upgrade' | 'cancel' | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const [sub, plansRes, history] = await Promise.all([
        subscriptionService.getMySubscription(),
        subscriptionService.getPlans(),
        subscriptionService.getBillingHistory(),
      ]);
      setSubscription(sub);
      setPlans(plansRes);
      setBillingHistory(history);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('subscription.error'));
      setSubscription(null);
      setPlans([]);
      setBillingHistory([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpgrade = async () => {
    setActionLoading('upgrade');
    setError(null);
    setMessage(null);
    try {
      const updated = await subscriptionService.upgrade({ plan: 'vip' });
      setSubscription(updated);
      // Sync account type to Zustand immediately
      updateUser({ accountType: 'vip' });
      setMessage(t('subscription.upgradeSuccess'));
      await fetchData();
    } catch (e) {
      setError(e instanceof Error ? e.message : t('subscription.error'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelClick = () => {
    setShowCancelConfirm(true);
  };

  const handleCancelConfirm = async () => {
    setShowCancelConfirm(false);
    setActionLoading('cancel');
    setError(null);
    setMessage(null);
    try {
      const updated = await subscriptionService.cancel();
      setSubscription(updated);
      // Sync account type to Zustand immediately
      updateUser({ accountType: 'regular' });
      setMessage(t('subscription.cancelSuccess'));
      await fetchData();
    } catch (e) {
      setError(e instanceof Error ? e.message : t('subscription.error'));
    } finally {
      setActionLoading(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">
          {t('subscription.signInRequired')}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">
          {t('common.loading')}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('subscription.title')}
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          {t('subscription.subtitle')}
        </p>
      </div>

      {message && (
        <div className="rounded-lg bg-emerald-500/10 px-4 py-3 text-emerald-600 dark:text-emerald-400">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Current plan */}
      <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/30">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          {t('subscription.currentPlan')}
        </h2>
        {subscription
          ? (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">
                      {t('subscription.plan')}
                      :
                      {' '}
                    </span>
                    <span className="font-medium text-slate-900 capitalize dark:text-white">
                      {subscription.plan}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">
                      {t('subscription.status')}
                      :
                      {' '}
                    </span>
                    <span className="font-medium text-slate-900 capitalize dark:text-white">
                      {subscription.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">
                      {t('subscription.startDate')}
                      :
                      {' '}
                    </span>
                    <span className="text-slate-900 dark:text-white">
                      {new Date(subscription.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  {subscription.endDate && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">
                        {t('subscription.endDate')}
                        :
                        {' '}
                      </span>
                      <span className="text-slate-900 dark:text-white">
                        {new Date(subscription.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {subscription.renewalDate && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">
                        {t('subscription.renewalDate')}
                        :
                        {' '}
                      </span>
                      <span className="text-slate-900 dark:text-white">
                        {new Date(subscription.renewalDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                {subscription.plan === 'vip'
                  && subscription.status === 'active' && (
                  <div className="mt-4 space-y-2">
                    {showCancelConfirm
                      ? (
                          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 dark:border-amber-400/30 dark:bg-amber-500/10">
                            <span className="text-sm text-slate-700 dark:text-slate-200">
                              {t('subscription.cancel')}
                              ?
                            </span>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={handleCancelConfirm}
                                disabled={!!actionLoading}
                                className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-500 disabled:opacity-50"
                              >
                                {actionLoading === 'cancel'
                                  ? t('common.loading')
                                  : t('common.confirm')}
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowCancelConfirm(false)}
                                disabled={!!actionLoading}
                                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                              >
                                {t('common.cancel')}
                              </button>
                            </div>
                          </div>
                        )
                      : (
                          <button
                            type="button"
                            onClick={handleCancelClick}
                            disabled={!!actionLoading}
                            className="rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            {t('subscription.cancel')}
                          </button>
                        )}
                  </div>
                )}
              </>
            )
          : (
              <p className="text-slate-600 dark:text-slate-400">—</p>
            )}
      </section>

      {/* Available plans */}
      <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/30">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          {t('subscription.availablePlans')}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`rounded-lg border p-5 ${
                plan.popular
                  ? 'border-emerald-500/50 bg-emerald-500/5 dark:border-emerald-400/30 dark:bg-emerald-500/10'
                  : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50'
              }`}
            >
              {plan.popular && (
                <span className="mb-2 inline-block rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Popular
                </span>
              )}
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {plan.name}
              </h3>
              <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                {plan.priceDisplay}
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {plan.description}
              </p>
              <ul className="mt-4 space-y-2">
                {plan.features.map(f => (
                  <li
                    key={f.id}
                    className={`flex items-center gap-2 text-sm ${
                      f.included
                        ? 'text-slate-700 dark:text-slate-300'
                        : 'text-slate-400 line-through dark:text-slate-500'
                    }`}
                  >
                    {f.included
                      ? (
                          <span className="text-emerald-500">✓</span>
                        )
                      : (
                          <span className="text-slate-400">—</span>
                        )}
                    {f.name}
                  </li>
                ))}
              </ul>
              {plan.id === 'vip' && subscription?.plan !== 'vip' && (
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={handleUpgrade}
                    disabled={!!actionLoading}
                    className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-400"
                  >
                    {actionLoading === 'upgrade'
                      ? t('common.loading')
                      : plan.ctaText}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Billing history */}
      <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/30">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          {t('subscription.billingHistory')}
        </h2>
        {billingHistory.length === 0
          ? (
              <p className="text-slate-600 dark:text-slate-400">
                {t('subscription.noBillingHistory')}
              </p>
            )
          : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="pb-2 font-medium text-slate-500 dark:text-slate-400">
                        {t('subscription.plan')}
                      </th>
                      <th className="pb-2 font-medium text-slate-500 dark:text-slate-400">
                        Amount
                      </th>
                      <th className="pb-2 font-medium text-slate-500 dark:text-slate-400">
                        Status
                      </th>
                      <th className="pb-2 font-medium text-slate-500 dark:text-slate-400">
                        Date
                      </th>
                      <th className="pb-2 font-medium text-slate-500 dark:text-slate-400">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingHistory.map(row => (
                      <tr
                        key={row.id}
                        className="border-b border-slate-100 dark:border-slate-800"
                      >
                        <td className="py-2 text-slate-900 capitalize dark:text-white">
                          {row.plan}
                        </td>
                        <td className="py-2 text-slate-900 dark:text-white">
                          {row.amount}
                          {' '}
                          {row.currency}
                        </td>
                        <td className="py-2 text-slate-700 capitalize dark:text-slate-300">
                          {row.status}
                        </td>
                        <td className="py-2 text-slate-700 dark:text-slate-300">
                          {new Date(row.date).toLocaleDateString()}
                        </td>
                        <td className="py-2 text-slate-600 dark:text-slate-400">
                          {row.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
      </section>
    </div>
  );
}

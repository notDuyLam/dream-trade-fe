import type { SubscriptionInfo } from '@/types/subscription';
import Link from 'next/link';

type CurrentPlanCardProps = {
  subscription: SubscriptionInfo;
};

export const CurrentPlanCard = ({ subscription }: CurrentPlanCardProps) => {
  const isVip = subscription.plan === 'vip';
  const isActive = subscription.status === 'active';

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Current Plan</h3>
          <p className="mt-1 text-sm text-slate-400">
            {isActive ? 'Active subscription' : 'Subscription inactive'}
          </p>
        </div>
        <span
          className={[
            'rounded-full px-3 py-1 text-xs font-semibold uppercase',
            isVip
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-slate-800 text-slate-400',
          ].join(' ')}
        >
          {subscription.plan}
        </span>
      </div>

      <div className="space-y-3 border-t border-slate-800 pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Status</span>
          <span
            className={[
              'font-semibold',
              isActive ? 'text-emerald-400' : 'text-rose-400',
            ].join(' ')}
          >
            {subscription.status}
          </span>
        </div>
        {subscription.startDate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Start Date</span>
            <span className="font-semibold text-white">
              {new Date(subscription.startDate).toLocaleDateString()}
            </span>
          </div>
        )}
        {subscription.renewalDate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Renewal Date</span>
            <span className="font-semibold text-white">
              {new Date(subscription.renewalDate).toLocaleDateString()}
            </span>
          </div>
        )}
        {subscription.endDate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">End Date</span>
            <span className="font-semibold text-white">
              {new Date(subscription.endDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {!isVip && (
        <div className="mt-6">
          <Link
            href="/pricing"
            className="block w-full rounded-lg bg-emerald-500 px-4 py-2 text-center text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
          >
            Upgrade to VIP
          </Link>
        </div>
      )}
    </div>
  );
};

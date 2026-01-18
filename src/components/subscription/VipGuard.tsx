'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isVip } from '@/services/subscription/subscriptionService';

type VipGuardProps = {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
};

export const VipGuard = ({
  children,
  fallback,
  redirectTo = '/pricing',
}: VipGuardProps) => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const userIsVip = await isVip();
        setHasAccess(userIsVip);
        if (!userIsVip && redirectTo) {
          // Optionally redirect instead of showing fallback
          // router.push(redirectTo);
        }
      } catch (error) {
        console.error('Failed to check VIP status:', error);
        setHasAccess(false);
      } finally {
        setIsChecking(false);
      }
    })();
  }, [redirectTo, router]);

  if (isChecking) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-slate-400">Checking access...</div>
      </div>
    );
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col items-center justify-center gap-6 px-4 py-16">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/20">
            <svg
              className="h-10 w-10 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-3xl font-semibold text-white">VIP Access Required</h1>
          <p className="text-slate-400">
            This feature is only available for VIP subscribers.
          </p>
        </div>

        <div className="w-full space-y-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-8">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-white">Upgrade to VIP</h2>
            <p className="text-sm text-slate-400">
              Unlock advanced features including AI-powered forecasts, unlimited watchlist,
              and priority support.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/pricing"
              className="flex-1 rounded-lg bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
            >
              View Plans
            </Link>
            <Link
              href="/dashboard"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-900/40 px-4 py-3 text-center text-sm font-semibold text-white transition hover:border-slate-600"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

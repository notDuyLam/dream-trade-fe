'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for Zustand store to hydrate from localStorage (defer to avoid synchronous setState in effect)
  useEffect(() => {
    const id = setTimeout(() => setIsHydrated(true), 0);
    return () => clearTimeout(id);
  }, []);

  // Redirect if not authenticated (only after hydration)
  useEffect(() => {
    if (isHydrated && !user) {
      router.push('/sign-in');
    }
  }, [isHydrated, user, router]);

  // Show loading while hydrating or redirecting
  if (!isHydrated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-r-transparent"></div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
            Profile Overview
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your account and view your trading activity
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - User Info */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              {/* Avatar */}
              <div className="mb-6 flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-pink-500 text-3xl font-bold text-white"></div>
              </div>

              {/* User Details */}
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {user!.firstName}
                    {' '}
                    {user!.lastName}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {user!.email}
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        User ID
                      </span>
                      <span className="font-mono text-sm text-slate-900 dark:text-white">
                        {user!.id.slice(0, 8)}
                        ...
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Status
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Activity */}
          <div className="lg:col-span-2">
            {/* Trading Stats */}
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                Trading Overview
              </h3>

              <div className="grid gap-4 md:grid-cols-3">
                {/* Total Trades */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                  <div className="mb-1 text-sm text-slate-600 dark:text-slate-400">
                    Total Trades
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    0
                  </div>
                  <div className="mt-1 text-xs text-slate-500">All time</div>
                </div>

                {/* Profit/Loss */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                  <div className="mb-1 text-sm text-slate-600 dark:text-slate-400">
                    Total P/L
                  </div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    $0.00
                  </div>
                  <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                    +0.00%
                  </div>
                </div>

                {/* Win Rate */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                  <div className="mb-1 text-sm text-slate-600 dark:text-slate-400">
                    Win Rate
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    0%
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    No trades yet
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                Recent Activity
              </h3>

              <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950/50">
                <div className="text-center">
                  <div className="mb-2 text-4xl">📊</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    No trading activity yet
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                    Start trading to see your activity here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

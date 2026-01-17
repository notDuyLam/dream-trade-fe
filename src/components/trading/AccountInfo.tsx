'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';

type AccountBalance = {
  totalBalance: number;
  availableBalance: number;
  lockedBalance: number;
  totalPnL: number;
  pnlPercentage: number;
};

export function AccountInfo() {
  const { user, isAuthenticated } = useAuthStore();
  const [balance, setBalance] = useState<AccountBalance>({
    totalBalance: 10000.0,
    availableBalance: 8500.0,
    lockedBalance: 1500.0,
    totalPnL: 125.5,
    pnlPercentage: 1.27,
  });

  // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu thật
  useEffect(() => {
    if (isAuthenticated) {
      // TODO: Fetch real account data from API
      // fetchAccountBalance().then(setBalance);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="rounded-xl border border-slate-300 bg-slate-100 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/40">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Account Overview</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">Please sign in to view your account information</p>
      </div>
    );
  }

  const isProfitable = balance.totalPnL >= 0;

  return (
    <div className="rounded-xl border border-slate-300 bg-slate-100 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/40">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Account Overview</h3>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-xs text-slate-500 dark:text-slate-400">Live</span>
        </div>
      </div>

      {/* User Info */}
      <div className="mb-6 border-b border-slate-300 pb-6 dark:border-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">Account Holder</p>
        <p className="font-medium text-slate-900 dark:text-white">
          {user?.firstName}
          {' '}
          {user?.lastName}
        </p>
        <p className="mt-1 text-xs text-slate-500">{user?.email}</p>
      </div>

      {/* Balance Overview */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-slate-500 dark:text-slate-400">Total Balance</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            $
            {balance.totalBalance.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-slate-500 dark:text-slate-400">Total P&L</p>
          <div className="flex items-baseline gap-2">
            <p className={`text-2xl font-bold ${isProfitable ? 'text-emerald-500' : 'text-red-500'}`}>
              {isProfitable ? '+' : ''}
              $
              {balance.totalPnL.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <span className={`text-sm ${isProfitable ? 'text-emerald-500' : 'text-red-500'}`}>
              {isProfitable ? '+' : ''}
              {balance.pnlPercentage.toFixed(2)}
              %
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Balances */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400">Available Balance</span>
          <span className="text-sm font-medium text-slate-900 dark:text-white">
            $
            {balance.availableBalance.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400">In Orders</span>
          <span className="text-sm font-medium text-slate-900 dark:text-white">
            $
            {balance.lockedBalance.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        {/* Balance Bar */}
        <div className="pt-2">
          <div className="h-2 overflow-hidden rounded-full bg-slate-300 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{
                width: `${(balance.availableBalance / balance.totalBalance) * 100}%`,
              }}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-slate-500">
            <span>Available</span>
            <span>Locked</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-300 pt-6 dark:border-slate-800">
        <button className="rounded-md bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-500/20 dark:text-emerald-500">
          Deposit
        </button>
        <button className="rounded-md bg-slate-300 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-400 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">
          Withdraw
        </button>
      </div>
    </div>
  );
}

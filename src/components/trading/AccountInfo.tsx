'use client';

import { useAuthStore } from '@/stores/authStore';
import { useEffect, useState } from 'react';

interface AccountBalance {
  totalBalance: number;
  availableBalance: number;
  lockedBalance: number;
  totalPnL: number;
  pnlPercentage: number;
}

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
      <div className="rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/40 p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Account Overview</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm">Please sign in to view your account information</p>
      </div>
    );
  }

  const isProfitable = balance.totalPnL >= 0;

  return (
    <div className="rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/40 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Account Overview</h3>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-slate-500 dark:text-slate-400">Live</span>
        </div>
      </div>

      {/* User Info */}
      <div className="mb-6 pb-6 border-b border-slate-300 dark:border-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">Account Holder</p>
        <p className="text-slate-900 dark:text-white font-medium">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
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
              {isProfitable ? '+' : ''}$
              {balance.totalPnL.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <span className={`text-sm ${isProfitable ? 'text-emerald-500' : 'text-red-500'}`}>
              {isProfitable ? '+' : ''}
              {balance.pnlPercentage.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Balances */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500 dark:text-slate-400">Available Balance</span>
          <span className="text-sm font-medium text-slate-900 dark:text-white">
            $
            {balance.availableBalance.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="flex justify-between items-center">
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
          <div className="h-2 bg-slate-300 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{
                width: `${(balance.availableBalance / balance.totalBalance) * 100}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Available</span>
            <span>Locked</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-300 dark:border-slate-800">
        <button className="px-4 py-2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-500/20 transition-colors text-sm font-medium">
          Deposit
        </button>
        <button className="px-4 py-2 rounded-md bg-slate-300 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-400 dark:hover:bg-slate-700 transition-colors text-sm font-medium">
          Withdraw
        </button>
      </div>
    </div>
  );
}

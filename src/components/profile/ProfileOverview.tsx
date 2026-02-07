'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useProfile } from '@/hooks/useAuth';

export function ProfileOverview() {
  const { user, updateUser } = useAuthStore();
  const { data: profileData } = useProfile();

  // Sync profile data from API into store (ensures accountType is up-to-date)
  if (profileData && user && profileData.accountType !== user.accountType) {
    updateUser({ accountType: profileData.accountType });
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Thông tin tài khoản
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Thông tin cá nhân và trạng thái tài khoản của bạn
        </p>
      </div>

      {/* User Info Card */}
      <div className="space-y-4">
        {/* Avatar & Name */}
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 text-2xl font-bold text-white">
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {user.firstName}
              {' '}
              {user.lastName}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {user.email}
            </p>
          </div>
        </div>

        <div className="h-px bg-slate-200 dark:bg-slate-700" />

        {/* Info Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">
              Email
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-900 dark:text-white">{user.email}</span>
              {user.isVerified && (
                <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Đã xác thực
                </span>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">
              Loại tài khoản
            </div>
            <div className="flex items-center gap-2">
              {user.accountType === 'vip' ? (
                <span className="flex items-center gap-2 font-semibold text-yellow-600 dark:text-yellow-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                  VIP
                </span>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Free
                  </span>
                  <Link
                    href="/dashboard/subscription"
                    className="inline-flex items-center gap-1 rounded-md bg-linear-to-r from-yellow-500 to-amber-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition-all hover:from-yellow-600 hover:to-amber-600 hover:shadow-md"
                  >
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    Nâng cấp VIP
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">
              ID tài khoản
            </div>
            <div className="font-mono text-sm text-slate-900 dark:text-white">
              {user.id}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">
              Trạng thái
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Đang hoạt động
            </span>
          </div>
        </div>
      </div>

      {/* Account Stats */}
      {user.accountType === 'vip' ? (
        <div className="rounded-lg bg-linear-to-br from-emerald-50 to-teal-50 p-6 dark:from-emerald-900/20 dark:to-teal-900/20">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Tài khoản VIP
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Bạn đang sử dụng gói VIP với đầy đủ tính năng cao cấp
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-yellow-200 bg-linear-to-br from-yellow-50 to-amber-50 p-6 dark:border-yellow-800/30 dark:from-yellow-900/10 dark:to-amber-900/10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-yellow-400 to-amber-500 text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Tài khoản Free
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Nâng cấp VIP để sử dụng phân tích AI và các tính năng cao cấp
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/subscription"
              className="shrink-0 rounded-lg bg-linear-to-r from-yellow-500 to-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-yellow-600 hover:to-amber-600 hover:shadow-lg"
            >
              Nâng cấp VIP
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

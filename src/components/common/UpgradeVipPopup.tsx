'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Small badge next to avatar showing account type (like TradingView).
 * - VIP users: golden "VIP" badge
 * - Free users: "Free" badge that links to /dashboard/subscription
 */
export function AccountTypeBadge() {
  const { user, isAuthenticated } = useAuthStore();
  const { t } = useLanguage();

  if (!isAuthenticated || !user) return null;

  if (user.accountType === 'vip') {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-linear-to-r from-yellow-500 to-amber-500 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white shadow-sm">
        <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
        VIP
      </span>
    );
  }

  return (
    <Link
      href="/dashboard/subscription"
      className="group inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 transition-all hover:border-yellow-300 hover:bg-linear-to-r hover:from-yellow-500 hover:to-amber-500 hover:text-white hover:shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-yellow-600"
      title={t('upgrade.popupTitle')}
    >
      Free
      <svg className="h-2.5 w-2.5 text-yellow-500 transition-colors group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    </Link>
  );
}

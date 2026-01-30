'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useLanguage } from '@/contexts/LanguageContext';

const AccountDropdown = dynamic(() => import('@/components/auth/AccountDropdown').then(mod => ({ default: mod.AccountDropdown })), {
  ssr: false,
});

type NavItem = {
  href: string;
  labelKey: string;
};

const navItems: NavItem[] = [
  { href: '/dashboard', labelKey: 'nav.workspace' },
  { href: '/dashboard/insights', labelKey: 'nav.insights' },
  { href: '/dashboard/news', labelKey: 'nav.news' },
  { href: '/dashboard/settings', labelKey: 'nav.settings' },
];

export const DashboardNav = () => {
  const { t } = useLanguage();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(href);
  };

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-300 bg-slate-100 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/50">
      <div>
        <p className="text-[11px] tracking-[0.4em] text-emerald-600 uppercase dark:text-emerald-400">
          {t('trading.dreamTrade')}
        </p>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
          {t('trading.intelligence')}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <button
                type="button"
                className={[
                  'rounded-full border px-4 py-1.5 transition-all',
                  active
                    ? 'border-slate-400 bg-white text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white'
                    : 'border-transparent hover:text-slate-900 dark:hover:text-white',
                ].join(' ')}
              >
                {t(item.labelKey)}
              </button>
            </Link>
          );
        })}
        <AccountDropdown />
      </div>
    </nav>
  );
};

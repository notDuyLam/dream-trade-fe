'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useLanguage } from '@/contexts/LanguageContext';

const AccountDropdown = dynamic(
  () =>
    import('@/components/auth/AccountDropdown').then(mod => ({
      default: mod.AccountDropdown,
    })),
  {
    ssr: false,
  }
);

type NavItem = {
  href: string;
  labelKey: string;
};

const navItems: NavItem[] = [
  { href: '/dashboard', labelKey: 'nav.workspace' },
  { href: '/dashboard/insights', labelKey: 'nav.insights' },
  { href: '/dashboard/news', labelKey: 'nav.news' },
  { href: '/dashboard/subscription', labelKey: 'nav.subscription' },
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
    <nav className="relative z-50 flex items-center justify-between border-b border-slate-200/50 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-xl lg:px-6 dark:border-slate-800/50 dark:bg-slate-950/40">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500 shadow-lg shadow-emerald-500/20">
            <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p className="hidden text-[10px] font-bold tracking-[0.2em] text-emerald-600 uppercase sm:block dark:text-emerald-400">DreamTrade</p>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map(item => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <button
                  type="button"
                  className={[
                    'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-300',
                    active
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/50 dark:hover:text-white',
                  ].join(' ')}
                >
                  {t(item.labelKey)}
                </button>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <AccountDropdown />
      </div>
    </nav>
  );
};

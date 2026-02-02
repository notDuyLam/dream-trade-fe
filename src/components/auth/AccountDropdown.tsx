'use client';

import type { Language } from '@/contexts/LanguageContext';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLogout } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';

export function AccountDropdown() {
  const { user, isAuthenticated } = useAuthStore();
  const { mutate: logout } = useLogout();
  const { theme, toggleTheme } = useThemeStore();
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as Language);
  };

  const handleLogout = () => {
    logout(); // This will call API, clear auth, and redirect to /sign-in
    setIsOpen(false);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const getInitials = () => {
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  const isDarkMode = theme === 'dark';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 rounded-full transition-all hover:opacity-80">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-pink-500 text-sm font-semibold text-white">
          {getInitials()}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 z-9999 mt-2 w-72 rounded-2xl border border-slate-300 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          {/* User Info - Clickable */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              window.location.href = '/profile';
            }}
            className="w-full border-b border-slate-200 px-4 py-4 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-pink-500 font-semibold text-white">
                {getInitials()}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate font-medium text-slate-900 dark:text-white">
                  {user.firstName}
                  {' '}
                  {user.lastName}
                </p>
                <p className="truncate text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
              </div>
              {/* Arrow icon */}
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Menu Items */}
          <div className="py-2">
            {/* Theme Toggle */}
            <div className="px-4 py-3 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-900 dark:text-white">{t('account.theme')}</span>
                <button
                  type="button"
                  onClick={handleThemeToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isDarkMode ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Language Selector */}
            <div className="px-4 py-3 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-900 dark:text-white">{t('account.language')}</span>
                <select
                  value={language}
                  onChange={e => handleLanguageChange(e.target.value)}
                  className="rounded-md border border-slate-300 bg-slate-100 px-3 py-1 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="en">{t('language.en')}</option>
                  <option value="vi">{t('language.vi')}</option>
                  <option value="ja">{t('language.ja')}</option>
                  <option value="ko">{t('language.ko')}</option>
                </select>
              </div>
            </div>

            {/* Divider */}
            <div className="my-2 border-t border-slate-200 dark:border-slate-800" />

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left text-sm font-medium text-red-500 transition-colors hover:bg-slate-100 dark:text-red-400 dark:hover:bg-slate-800/50"
            >
              {t('account.logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

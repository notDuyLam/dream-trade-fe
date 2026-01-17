'use client';

import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AccountDropdown() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
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
    console.log('Toggle theme clicked! Current theme:', theme);
    toggleTheme();
    console.log('Theme after toggle:', useThemeStore.getState().theme);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as Language);
  };

  const handleLogout = () => {
    clearAuth();
    setIsOpen(false);
    router.push('/');
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
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold text-sm">
          {getInitials()}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl z-50">
          {/* User Info */}
          <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                {getInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 dark:text-white font-medium truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Theme Toggle */}
            <div className="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-slate-900 dark:text-white text-sm">{t('account.theme')}</span>
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
            <div className="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-slate-900 dark:text-white text-sm">{t('account.language')}</span>
                <select
                  value={language}
                  onChange={e => handleLanguageChange(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm rounded-md px-3 py-1 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="w-full px-4 py-3 text-left text-red-500 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors text-sm font-medium"
            >
              {t('account.logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

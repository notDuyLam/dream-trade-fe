'use client';

import type { Language } from '@/contexts/LanguageContext';
import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
  ];

  const currentLang = languages.find(lang => lang.code === language) || languages[0];

  return (
    <div className="relative inline-block">
      <select
        value={language}
        onChange={e => setLanguage(e.target.value as Language)}
        className="cursor-pointer appearance-none rounded-full border border-slate-300 bg-white/90 px-4 py-2 pr-10 text-sm font-medium text-slate-900 backdrop-blur-md transition-all hover:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:border-white/30 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code} className="bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-white">
            {lang.flag}
            {' '}
            {lang.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-900 dark:text-white">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

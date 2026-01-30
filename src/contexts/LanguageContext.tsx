'use client';

import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react';
import { getTranslation } from '@/locales';

export type Language = 'en' | 'vi' | 'ja' | 'ko';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    const savedLang = localStorage.getItem('language') as Language | null;
    if (savedLang) {
      timer = setTimeout(() => {
        setLanguageState(prev => prev !== savedLang ? savedLang : prev);
      }, 0);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  }, []);

  const t = useCallback((key: string): string => {
    return getTranslation(language, key);
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
  }), [language, setLanguage, t]);

  return <LanguageContext value={value}>{children}</LanguageContext>;
}

export function useLanguage() {
  const context = use(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

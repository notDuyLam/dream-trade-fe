'use client';

import { createContext, use, useEffect, useState } from 'react';
import { getTranslation } from '@/locales';

export type Language = 'en' | 'vi' | 'ja' | 'ko';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [language, setLanguageState] = useState<Language>(() => {
    // Initialize with default value to avoid hydration mismatch
    return 'en';
  });

  useEffect(() => {
    // Load language from localStorage only on client
    const savedLang = localStorage.getItem('language') as Language | null;
    if (savedLang) {
      setLanguageState(savedLang);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  // Translation function with actual translations
  const t = (key: string): string => {
    return getTranslation(language, key);
  };

  return <LanguageContext value={{ language, setLanguage, t }}>{children}</LanguageContext>;
}

export function useLanguage() {
  const context = use(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

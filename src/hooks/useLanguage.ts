'use client';

import { use } from 'react';
import { LanguageContext } from '@/contexts/LanguageContext';

export function useLanguage() {
  const context = use(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

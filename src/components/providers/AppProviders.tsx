'use client';

import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeInitializer } from './ThemeInitializer';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeInitializer />
      <LanguageProvider>{children}</LanguageProvider>
    </>
  );
}

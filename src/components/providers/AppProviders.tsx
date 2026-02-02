'use client';

import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthInitializer } from './AuthInitializer';
import { ThemeInitializer } from './ThemeInitializer';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeInitializer />
      <AuthInitializer />
      <LanguageProvider>{children}</LanguageProvider>
    </>
  );
}

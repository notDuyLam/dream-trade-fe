'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';

/**
 * Component to initialize theme on client-side
 * This handles hydration properly for Next.js
 */
export function ThemeInitializer() {
  const initializeTheme = useThemeStore(state => state.initializeTheme);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return null;
}

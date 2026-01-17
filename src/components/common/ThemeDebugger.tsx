'use client';

import { useThemeStore } from '@/stores/themeStore';
import { useEffect } from 'react';

/**
 * Component để debug theme - chỉ hiển thị khi development
 * Thêm vào bất kỳ page nào để test theme
 */
export function ThemeDebugger() {
  const { theme, mounted } = useThemeStore();

  useEffect(() => {
    // Log theme changes
    console.log('🎨 Theme changed:', theme);
    console.log('📍 HTML classes:', document.documentElement.className);
    console.log('✅ Mounted:', mounted);
  }, [theme, mounted]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg border-2 border-emerald-500 bg-white dark:bg-slate-900 p-3 shadow-xl text-xs font-mono">
      <div className="font-bold text-emerald-500 mb-2">🎨 Theme Debug</div>
      <div className="space-y-1 text-slate-900 dark:text-white">
        <div>
          Theme: <strong>{theme}</strong>
        </div>
        <div>
          Mounted: <strong>{mounted ? 'Yes' : 'No'}</strong>
        </div>
        <div>
          HTML: <strong className="text-blue-500">{document.documentElement.classList.toString()}</strong>
        </div>
      </div>
    </div>
  );
}

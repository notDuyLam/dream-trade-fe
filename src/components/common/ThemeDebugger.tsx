'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';

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
    <div className="fixed right-4 bottom-4 z-50 rounded-lg border-2 border-emerald-500 bg-white p-3 font-mono text-xs shadow-xl dark:bg-slate-900">
      <div className="mb-2 font-bold text-emerald-500">🎨 Theme Debug</div>
      <div className="space-y-1 text-slate-900 dark:text-white">
        <div>
          Theme:
          {' '}
          <strong>{theme}</strong>
        </div>
        <div>
          Mounted:
          {' '}
          <strong>{mounted ? 'Yes' : 'No'}</strong>
        </div>
        <div>
          HTML:
          {' '}
          <strong className="text-blue-500">{document.documentElement.classList.toString()}</strong>
        </div>
      </div>
    </div>
  );
}

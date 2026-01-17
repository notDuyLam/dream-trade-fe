import { create } from 'zustand';

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  mounted: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark';

  const savedTheme = localStorage.getItem('theme') as Theme | null;
  if (savedTheme) return savedTheme;

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

const applyThemeToDOM = (theme: Theme) => {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('dark', 'light');
  if (theme === 'dark') {
    root.classList.add('dark');
  }
  // Không cần class 'light'
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  console.log('Theme applied:', theme, 'Classes:', root.className);
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'dark', // Default to avoid hydration mismatch
  mounted: false,

  initializeTheme: () => {
    const theme = getInitialTheme();
    applyThemeToDOM(theme);
    set({ theme, mounted: true });
  },

  setTheme: (theme: Theme) => {
    applyThemeToDOM(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const currentTheme = get().theme;
    const nextTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark';
    get().setTheme(nextTheme);
  },
}));

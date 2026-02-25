import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'light',
      isDark: false,

      toggleTheme: () =>
        set((s) => {
          const next: Theme = s.theme === 'light' ? 'dark' : 'light';
          return { theme: next, isDark: next === 'dark' };
        }),

      setTheme: (t) => set({ theme: t, isDark: t === 'dark' }),
    }),
    {
      name: 'todo-theme',
      // Only persist the theme key
      partialize: (s) => ({ theme: s.theme }),
      // After rehydrating from localStorage, sync isDark and apply DOM class
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.isDark = state.theme === 'dark';
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', state.theme === 'dark');
        }
      },
    }
  )
);

/** Drop-in replacement for the old `useTheme()` hook */
export const useTheme = useThemeStore;

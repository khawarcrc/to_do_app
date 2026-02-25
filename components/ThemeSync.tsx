'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

/**
 * Renders nothing — syncs the Zustand theme store to the
 * `dark` CSS class on <html> and seeds from system preference
 * when no value has been stored yet.
 */
export function ThemeSync() {
  const { theme, setTheme } = useThemeStore();

  // Seed from system preference on first visit (no stored value)
  useEffect(() => {
    const stored = localStorage.getItem('todo-theme');
    if (!stored) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) setTheme('dark');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep <html> class in sync whenever theme changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return null;
}

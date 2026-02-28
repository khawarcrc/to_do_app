import { create } from 'zustand';

export interface AuthUser {
  email: string;
}

interface AuthStore {
  user: AuthUser | null;
  initialising: boolean;
  setUser: (user: AuthUser | null) => void;
  setInitialising: (v: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  initialising: true,

  setUser: (user) => set({ user }),
  setInitialising: (v) => set({ initialising: v }),

  logout: async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    set({ user: null });
    window.location.replace('/login');
  },
}));

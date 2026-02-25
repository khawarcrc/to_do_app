import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (opts: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

let _counter = 0;

export const useToastStore = create<ToastStore>()((set, get) => ({
  toasts: [],

  addToast: (opts) => {
    const id = `toast-${++_counter}`;
    const duration = opts.duration ?? 4000;
    set((s) => ({ toasts: [...s.toasts, { ...opts, id }] }));
    if (duration > 0) {
      setTimeout(() => get().dismiss(id), duration);
    }
  },

  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  success: (title, message) => get().addToast({ type: 'success', title, message }),
  error:   (title, message) => get().addToast({ type: 'error',   title, message, duration: 6000 }),
  info:    (title, message) => get().addToast({ type: 'info',    title, message }),
  warning: (title, message) => get().addToast({ type: 'warning', title, message }),
}));

/** Drop-in replacement for the old `useToast()` hook */
export const useToast = useToastStore;

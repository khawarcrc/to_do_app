import { create } from 'zustand';
import { Task, TaskFormData } from '@/types';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = (await res.json().catch(() => ({ error: 'Unknown error' }))) as { error: string };
    throw new Error(body.error ?? 'Request failed');
  }
  return res.json() as Promise<T>;
}

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;

  fetchTasks: () => Promise<void>;
  addTask: (data: TaskFormData) => Promise<Task>;
  editTask: (id: string, data: Partial<TaskFormData>) => Promise<Task>;
  removeTask: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<Task>;
}

export const useTaskStore = create<TaskStore>()((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch<{ tasks: Task[] }>('/api/tasks');
      set({ tasks: data.tasks, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to load tasks',
        loading: false,
      });
    }
  },

  addTask: async (data) => {
    const result = await apiFetch<{ task: Task }>('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    set((s) => ({ tasks: [...s.tasks, result.task] }));
    return result.task;
  },

  editTask: async (id, data) => {
    const result = await apiFetch<{ task: Task }>(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? result.task : t)) }));
    return result.task;
  },

  removeTask: async (id) => {
    await apiFetch<{ success: boolean }>(`/api/tasks/${id}`, { method: 'DELETE' });
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
  },

  toggleStatus: async (id) => {
    const result = await apiFetch<{ task: Task }>(`/api/tasks/${id}`, { method: 'PATCH' });
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? result.task : t)) }));
    return result.task;
  },
}));

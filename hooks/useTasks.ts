'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskFormData, FilterState, SortState, TaskStats, PRIORITY_ORDER } from '@/types';
import { isAfter, isBefore, startOfDay, endOfDay, addDays, parseISO, isValid } from 'date-fns';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = (await res.json().catch(() => ({ error: 'Unknown error' }))) as { error: string };
    throw new Error(body.error ?? 'Request failed');
  }
  return res.json() as Promise<T>;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiFetch<{ tasks: Task[] }>('/api/tasks');
      setTasks(data.tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(async (data: TaskFormData): Promise<Task> => {
    const result = await apiFetch<{ task: Task }>('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setTasks((prev) => [...prev, result.task]);
    return result.task;
  }, []);

  const editTask = useCallback(async (id: string, data: Partial<TaskFormData>): Promise<Task> => {
    const result = await apiFetch<{ task: Task }>(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setTasks((prev) => prev.map((t) => (t.id === id ? result.task : t)));
    return result.task;
  }, []);

  const removeTask = useCallback(async (id: string): Promise<void> => {
    await apiFetch<{ success: boolean }>(`/api/tasks/${id}`, { method: 'DELETE' });
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleStatus = useCallback(async (id: string): Promise<Task> => {
    const result = await apiFetch<{ task: Task }>(`/api/tasks/${id}`, { method: 'PATCH' });
    setTasks((prev) => prev.map((t) => (t.id === id ? result.task : t)));
    return result.task;
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    editTask,
    removeTask,
    toggleStatus,
  };
}

export function filterAndSortTasks(
  tasks: Task[],
  filter: FilterState,
  sort: SortState
): Task[] {
  let result = [...tasks];

  // Search filter
  if (filter.search.trim()) {
    const q = filter.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  // Priority filter
  if (filter.priority !== 'all') {
    result = result.filter((t) => t.priority === filter.priority);
  }

  // Status filter
  if (filter.status !== 'all') {
    result = result.filter((t) => t.status === filter.status);
  }

  // Due date filter
  if (filter.dueDateFilter !== 'all') {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const weekEnd = endOfDay(addDays(now, 7));

    result = result.filter((t) => {
      if (filter.dueDateFilter === 'no-date') return !t.dueDate;
      if (!t.dueDate) return false;
      const due = parseISO(t.dueDate);
      if (!isValid(due)) return false;
      if (filter.dueDateFilter === 'overdue') return isBefore(due, now) && t.status !== 'completed';
      if (filter.dueDateFilter === 'today') return !isBefore(due, todayStart) && !isAfter(due, todayEnd);
      if (filter.dueDateFilter === 'this-week') return !isBefore(due, todayStart) && !isAfter(due, weekEnd);
      return true;
    });
  }

  // Sort
  result.sort((a, b) => {
    let comparison = 0;
    if (sort.field === 'priority') {
      comparison = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    } else if (sort.field === 'dueDate') {
      const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      comparison = da - db;
    } else if (sort.field === 'createdAt') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sort.field === 'timeEstimate') {
      comparison = a.timeEstimate - b.timeEstimate;
    } else if (sort.field === 'title') {
      comparison = a.title.localeCompare(b.title);
    }
    return sort.direction === 'desc' ? -comparison : comparison;
  });

  return result;
}

export function computeStats(tasks: Task[]): TaskStats {
  const now = new Date();
  return {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    overdue: tasks.filter(
      (t) => t.dueDate && isBefore(parseISO(t.dueDate), now) && t.status !== 'completed'
    ).length,
    criticalCount: tasks.filter((t) => t.priority === 'critical').length,
    highCount: tasks.filter((t) => t.priority === 'high').length,
    mediumCount: tasks.filter((t) => t.priority === 'medium').length,
    lowCount: tasks.filter((t) => t.priority === 'low').length,
    totalEstimatedTime: tasks.reduce((sum, t) => sum + t.timeEstimate, 0),
    completedTime: tasks.filter((t) => t.status === 'completed').reduce((sum, t) => sum + t.timeEstimate, 0),
  };
}

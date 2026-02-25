'use client';

import { useState, useMemo, useCallback } from 'react';
import { Task, TaskFormData, FilterState, SortState } from '@/types';
import { useTasks, filterAndSortTasks, computeStats } from '@/hooks/useTasks';
import ThemeToggle from '@/components/ThemeToggle';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import FilterBar from '@/components/FilterBar';
import StatsDashboard from '@/components/StatsDashboard';

const DEFAULT_FILTER: FilterState = {
  priority: 'all',
  status: 'all',
  search: '',
  dueDateFilter: 'all',
};

const DEFAULT_SORT: SortState = {
  field: 'priority',
  direction: 'asc',
};

export default function HomePage() {
  const { tasks, loading, error, addTask, editTask, removeTask, toggleStatus } = useTasks();

  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [sort, setSort] = useState<SortState>(DEFAULT_SORT);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const filteredTasks = useMemo(
    () => filterAndSortTasks(tasks, filter, sort),
    [tasks, filter, sort]
  );

  const stats = useMemo(() => computeStats(tasks), [tasks]);

  const handleFilterChange = useCallback((f: Partial<FilterState>) => {
    setFilter((prev) => ({ ...prev, ...f }));
  }, []);

  const handleSortChange = useCallback((s: Partial<SortState>) => {
    setSort((prev) => ({ ...prev, ...s }));
  }, []);

  const handleOpenCreate = useCallback(() => {
    setEditingTask(null);
    setFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setFormOpen(false);
    setEditingTask(null);
  }, []);

  const handleSubmit = useCallback(
    async (data: TaskFormData) => {
      setActionError(null);
      try {
        if (editingTask) {
          await editTask(editingTask.id, data);
        } else {
          await addTask(data);
        }
      } catch (err) {
        setActionError(err instanceof Error ? err.message : 'Operation failed');
        throw err;
      }
    },
    [editingTask, editTask, addTask]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      setActionError(null);
      try {
        await removeTask(id);
        setDeleteConfirmId(null);
      } catch (err) {
        setActionError(err instanceof Error ? err.message : 'Delete failed');
      }
    },
    [removeTask]
  );

  const handleToggle = useCallback(
    async (id: string) => {
      setActionError(null);
      try {
        await toggleStatus(id);
      } catch (err) {
        setActionError(err instanceof Error ? err.message : 'Toggle failed');
      }
    },
    [toggleStatus]
  );

  const requestDelete = useCallback((id: string) => {
    setDeleteConfirmId(id);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">✅ TodoFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg
                bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600
                text-white transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">New Task</span>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-30 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
            transform transition-transform duration-200 md:relative md:inset-auto md:transform-none md:w-72 md:flex-shrink-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            pt-16 md:pt-0 px-4 md:px-0 pb-6 overflow-y-auto
          `}
        >
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="space-y-6">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Statistics
              </h2>
              <StatsDashboard stats={stats} />
            </div>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Quick Filters
              </h2>
              <div className="space-y-1">
                {([
                  { label: 'All Tasks', priority: 'all', status: 'all' },
                  { label: '🔴 Critical', priority: 'critical', status: 'all' },
                  { label: '🟠 High Priority', priority: 'high', status: 'all' },
                  { label: '⏳ In Progress', priority: 'all', status: 'in-progress' },
                  { label: '✅ Completed', priority: 'all', status: 'completed' },
                ] as Array<{ label: string; priority: FilterState['priority']; status: FilterState['status'] }>).map(
                  (item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        handleFilterChange({ priority: item.priority, status: item.status });
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        filter.priority === item.priority && filter.status === item.status
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 z-20 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 space-y-5">
          {(error ?? actionError) && (
            <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
              <span>⚠ {error ?? actionError}</span>
              <button onClick={() => setActionError(null)} className="text-red-400 hover:text-red-600 dark:hover:text-red-200">
                ✕
              </button>
            </div>
          )}

          <FilterBar
            filter={filter}
            sort={sort}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            taskCount={filteredTasks.length}
          />

          <TaskList
            tasks={filteredTasks}
            onEdit={handleOpenEdit}
            onDelete={requestDelete}
            onToggleStatus={(id) => void handleToggle(id)}
            loading={loading}
          />
        </main>
      </div>

      {/* Task Form Modal */}
      {formOpen && (
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onClose={handleCloseForm}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Delete Task</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
              Are you sure you want to delete this task? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

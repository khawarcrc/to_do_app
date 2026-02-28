'use client';

import { useEffect, useMemo } from 'react';
import { Task, TaskFormData, Status } from '@/types';
import { useTaskStore } from '@/store/taskStore';
import { useToastStore } from '@/store/toastStore';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { filterAndSortTasks, computeStats } from '@/hooks/useTasks';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import KanbanBoard from '@/components/KanbanBoard';
import ListView from '@/components/ListView';
import CalendarView from '@/components/CalendarView';
import TaskModal from '@/components/TaskModal';
import CommandPalette from '@/components/CommandPalette';

export default function Home() {
  /* ── Stores ─────────────────────────────────────────────── */
  const {
    tasks, loading,
    fetchTasks, addTask, editTask, removeTask,
  } = useTaskStore();

  const toast = useToastStore();

  const {
    view, setView,
    sidebarOpen, toggleSidebar,
    selectedTask, isCreating, defaultStatus,
    openNew, openEdit, closeModal,
    cmdOpen, openCmd, closeCmd,
    filter, setFilter,
    sort,
  } = useUIStore();

  const { setUser, setInitialising } = useAuthStore();

  /* ── Bootstrap ──────────────────────────────────────────── */
  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  /* ── Auth init ───────────────────────────────────────────── */
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.email) setUser({ email: data.email, sid: data.sid ?? '', createdAt: data.createdAt });
      })
      .finally(() => setInitialising(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Derived data ───────────────────────────────────────── */
  const filteredTasks = useMemo(
    () => filterAndSortTasks(tasks, filter, sort),
    [tasks, filter, sort]
  );
  const stats = useMemo(() => computeStats(tasks), [tasks]);
  const allTags = useMemo(() => {
    const s = new Set<string>();
    tasks.forEach((t) => t.tags?.forEach((tag) => s.add(tag)));
    return Array.from(s).sort();
  }, [tasks]);

  /* ── Global Ctrl/Cmd + K shortcut ───────────────────────── */
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openCmd();
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [openCmd]);

  /* ── CRUD handlers ──────────────────────────────────────── */
  async function handleSubmit(data: TaskFormData) {
    if (selectedTask) {
      await editTask(selectedTask.id, data);
      toast.success('Task updated');
    } else {
      await addTask(data);
      toast.success('Task created');
    }
  }

  async function handleDelete(id: string) {
    await removeTask(id);
    toast.success('Task deleted');
  }

  async function handleStatusChange(id: string, status: Status) {
    try {
      await editTask(id, { status });
    } catch {
      toast.error('Failed to update status');
    }
  }

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      {/* Top bar */}
      <TopBar
        view={view}
        onViewChange={setView}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={toggleSidebar}
        onNewTask={() => openNew()}
        onCommandPalette={openCmd}
      />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — receives the full FilterState object and a Partial setter */}
        <Sidebar
          open={sidebarOpen}
          filter={filter}
          onFilterChange={setFilter}
          stats={stats}
          allTags={allTags}
          onNewTask={() => openNew()}
        />

        {/* Main content area */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {view === 'kanban' && (
            <KanbanBoard
              tasks={filteredTasks}
              onTaskClick={(t: Task) => openEdit(t)}
              onStatusChange={handleStatusChange}
              onNewTask={openNew}
            />
          )}
          {view === 'list' && (
            <ListView
              tasks={filteredTasks}
              loading={loading}
              onTaskClick={(t: Task) => openEdit(t)}
              onStatusChange={(id, status) => void handleStatusChange(id, status)}
              onPriorityChange={(id, priority) => void editTask(id, { priority })}
              onDelete={(id) => void handleDelete(id)}
            />
          )}
          {view === 'calendar' && (
            <CalendarView
              tasks={filteredTasks}
              onTaskClick={(t: Task) => openEdit(t)}
              onNewTask={() => openNew()}
            />
          )}
        </main>
      </div>

      {/* Task modal */}
      {(isCreating || !!selectedTask) && (
        <TaskModal
          task={selectedTask}
          initialStatus={isCreating ? defaultStatus : undefined}
          onSubmit={handleSubmit}
          onDelete={(id) => void handleDelete(id)}
          onClose={closeModal}
        />
      )}

      {/* Command palette */}
      <CommandPalette
        open={cmdOpen}
        onClose={closeCmd}
        tasks={tasks}
        onTaskClick={(t: Task) => openEdit(t)}
        onNewTask={() => openNew()}
        onViewChange={setView}
      />
    </div>
  );
}

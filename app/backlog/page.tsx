'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import MainNav from '@/components/MainNav';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type TaskCategory = 'technical' | 'communications';

interface BacklogTask {
  id: string;
  title: string;
  completed: boolean;
  category: TaskCategory;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Column config ──────────────────────────────────────────────────────────

const COLUMN_CONFIG: Record<TaskCategory, {
  label: string; icon: string; color: string; border: string; bg: string; description: string;
}> = {
  technical: {
    label: 'Technical',
    icon: '⚙',
    color: '#3b82f6',
    border: 'rgba(59,130,246,0.3)',
    bg: 'rgba(59,130,246,0.06)',
    description: 'Dev tasks, bugs, research',
  },
  communications: {
    label: 'Communications',
    icon: '💬',
    color: '#8b5cf6',
    border: 'rgba(139,92,246,0.3)',
    bg: 'rgba(139,92,246,0.06)',
    description: 'Emails, meetings, updates',
  },
};

// ─── Sortable task item ─────────────────────────────────────────────────────

interface TaskItemProps {
  task: BacklogTask;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

function TaskItem({ task, onToggle, onDelete, onRename }: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  function startEdit() {
    setDraft(task.title);
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }

  function commitEdit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== task.title) onRename(task.id, trimmed);
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') { setEditing(false); setDraft(task.title); }
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '9px 10px',
        borderRadius: '9px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        marginBottom: '5px',
        boxShadow: isDragging ? '0 8px 24px rgba(0,0,0,0.15)' : 'none',
        cursor: 'default',
        userSelect: 'none',
      }}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          background: 'none',
          border: 'none',
          padding: '2px 3px',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          borderRadius: '4px',
          touchAction: 'none',
        }}
      >
        <svg width="12" height="16" viewBox="0 0 14 18" fill="currentColor">
          <circle cx="4" cy="4" r="1.5" />
          <circle cx="10" cy="4" r="1.5" />
          <circle cx="4" cy="9" r="1.5" />
          <circle cx="10" cy="9" r="1.5" />
          <circle cx="4" cy="14" r="1.5" />
          <circle cx="10" cy="14" r="1.5" />
        </svg>
      </button>

      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id, !task.completed)}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        style={{
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          border: task.completed ? 'none' : '2px solid var(--border-strong, #888)',
          backgroundColor: task.completed ? 'var(--accent)' : 'transparent',
          flexShrink: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.15s, border 0.15s',
        }}
      >
        {task.completed && (
          <svg width="10" height="8" viewBox="0 0 11 9" fill="none">
            <path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Title */}
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            fontSize: '13px',
            background: 'var(--bg-hover)',
            border: '1px solid var(--accent)',
            borderRadius: '5px',
            padding: '2px 7px',
            color: 'var(--text-primary)',
            outline: 'none',
            minWidth: 0,
          }}
          autoFocus
        />
      ) : (
        <span
          onDoubleClick={startEdit}
          title="Double-click to edit"
          style={{
            flex: 1,
            fontSize: '13px',
            color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
            textDecoration: task.completed ? 'line-through' : 'none',
            cursor: 'text',
            wordBreak: 'break-word',
            minWidth: 0,
          }}
        >
          {task.title}
        </span>
      )}

      {/* Edit button */}
      {!editing && (
        <button
          onClick={startEdit}
          aria-label="Edit task"
          style={{ background: 'none', border: 'none', padding: '3px', cursor: 'pointer', color: 'var(--text-muted)', borderRadius: '4px', display: 'flex', alignItems: 'center', flexShrink: 0, opacity: 0.45 }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.45')}
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      )}

      {/* Delete */}
      <button
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
        style={{ background: 'none', border: 'none', padding: '3px', cursor: 'pointer', color: '#ef4444', borderRadius: '4px', display: 'flex', alignItems: 'center', flexShrink: 0, opacity: 0.45 }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.45')}
      >
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

// ─── Task column ────────────────────────────────────────────────────────────

interface TaskColumnProps {
  category: TaskCategory;
  tasks: BacklogTask[];
  sensors: ReturnType<typeof useSensors>;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onDragEnd: (event: DragEndEvent, category: TaskCategory) => void;
  onAdd: (category: TaskCategory, title: string) => Promise<void>;
}

function TaskColumn({ category, tasks, sensors, onToggle, onDelete, onRename, onDragEnd, onAdd }: TaskColumnProps) {
  const cfg = COLUMN_CONFIG[category];
  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const done = tasks.filter((t) => t.completed).length;

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) { inputRef.current?.focus(); return; }
    setAdding(true);
    try {
      await onAdd(category, title);
      setNewTitle('');
      inputRef.current?.focus();
    } finally {
      setAdding(false);
    }
  }

  return (
    <div
      className="sm:min-w-[260px]"
      style={{
        flex: '1 1 0',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-subtle, var(--bg-surface))',
        borderRadius: '14px',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
      }}
    >
      {/* Column header */}
      <div
        style={{
          padding: '14px 16px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `2px solid ${cfg.border}`,
          backgroundColor: cfg.bg,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>{cfg.icon}</span>
            <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{cfg.label}</span>
            <span style={{ padding: '1px 8px', borderRadius: '100px', backgroundColor: cfg.bg, color: cfg.color, fontSize: '11px', fontWeight: 700, border: `1px solid ${cfg.border}` }}>
              {tasks.length}
            </span>
            {done > 0 && (
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>{done} done</span>
            )}
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', paddingLeft: '24px' }}>{cfg.description}</span>
        </div>
      </div>

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '6px', flexShrink: 0, backgroundColor: 'var(--bg-surface)' }}
      >
        <input
          ref={inputRef}
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a task…"
          disabled={adding}
          style={{ flex: 1, padding: '7px 11px', borderRadius: '8px', border: '1px solid var(--border-default)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', transition: 'border-color 0.15s', minWidth: 0 }}
          onFocus={(e) => (e.currentTarget.style.borderColor = cfg.color)}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
        />
        <button
          type="submit"
          disabled={adding || !newTitle.trim()}
          title="Add task"
          style={{ width: '30px', height: '30px', borderRadius: '8px', border: `1px solid ${newTitle.trim() ? cfg.border : 'var(--border-default)'}`, backgroundColor: newTitle.trim() ? cfg.bg : 'transparent', color: newTitle.trim() ? cfg.color : 'var(--text-muted)', cursor: newTitle.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '18px', lineHeight: '1', fontWeight: 700, transition: 'all 0.15s' }}
        >
          {adding ? '…' : '+'}
        </button>
      </form>

      {/* Task list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column' }}>
        {tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', fontSize: '13px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '22px' }}>
              {cfg.icon}
            </div>
            <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>No tasks yet</div>
            <div style={{ fontSize: '12px' }}>Add your first {cfg.label.toLowerCase()} task above.</div>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(ev) => onDragEnd(ev, category)}>
            <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              {tasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onRename={onRename} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────────────────────

export default function BacklogPage() {
  const [tasks, setTasks] = useState<BacklogTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );



  const loadTasks = useCallback(() => {
    setLoading(true);
    fetch('/api/backlog-tasks')
      .then((r) => r.json())
      .then((data) => { if (data.tasks) setTasks(data.tasks); })
      .catch(() => setError('Failed to load tasks'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  async function handleAdd(category: TaskCategory, title: string) {
    const res = await fetch('/api/backlog-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category }),
    });
    const data = await res.json() as { task?: BacklogTask; error?: string };
    if (!res.ok) throw new Error(data.error ?? 'Failed');
    setTasks((prev) => [...prev, data.task!]);
  }

  async function handleToggle(id: string, completed: boolean) {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completed } : t));
    try {
      await fetch(`/api/backlog-tasks/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ completed }) });
    } catch { loadTasks(); }
  }

  async function handleRename(id: string, title: string) {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, title } : t));
    try {
      await fetch(`/api/backlog-tasks/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) });
    } catch { loadTasks(); }
  }

  async function handleDelete(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await fetch(`/api/backlog-tasks/${id}`, { method: 'DELETE' });
    } catch { loadTasks(); }
  }

  function handleDragEnd(event: DragEndEvent, category: TaskCategory) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setTasks((prev) => {
      const catTasks = prev.filter((t) => t.category === category);
      const others = prev.filter((t) => t.category !== category);
      const oldIndex = catTasks.findIndex((t) => t.id === active.id);
      const newIndex = catTasks.findIndex((t) => t.id === over.id);
      const reordered = arrayMove(catTasks, oldIndex, newIndex);
      fetch('/api/backlog-tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: reordered.map((t) => t.id) }),
      }).catch(() => loadTasks());
      return [...others, ...reordered];
    });
  }

  const done = tasks.filter((t) => t.completed).length;
  const total = tasks.length;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans, system-ui, sans-serif)', overflow: 'hidden' }}>

      <MainNav />

      {/* Sub-header */}
      <div style={{ flexShrink: 0, padding: '10px clamp(1rem, 3vw, 2rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', gap: '10px', backgroundColor: 'var(--bg-surface)', flexWrap: 'wrap' }}>
        <p className="hidden sm:block" style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
          Double-click a title to edit · Drag ⠿ to reorder within each column
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {total > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '80px', height: '5px', borderRadius: '99px', backgroundColor: 'var(--border-default)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: '99px', backgroundColor: 'var(--accent)', width: `${(done / total) * 100}%`, transition: 'width 0.4s ease' }} />
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>{done}/{total} done</span>
              </div>
              {done > 0 && (
                <button
                  onClick={async () => {
                    const completed = tasks.filter((t) => t.completed);
                    setTasks((prev) => prev.filter((t) => !t.completed));
                    await Promise.all(completed.map((t) => fetch(`/api/backlog-tasks/${t.id}`, { method: 'DELETE' })));
                  }}
                  style={{ fontSize: '12px', color: '#ef4444', background: 'none', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '3px 10px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Clear {done} done
                </button>
              )}
            </>
          )}
          {error && (
            <span style={{ fontSize: '12px', color: '#ef4444', cursor: 'pointer' }} onClick={() => setError('')} title="Dismiss">⚠ {error}</span>
          )}
        </div>
      </div>

      {/* Board */}
      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '14px', gap: '10px' }}>
          Loading tasks…
        </div>
      ) : (
        <div style={{ flex: 1, overflow: 'auto', padding: '20px clamp(1rem, 3vw, 2rem)', display: 'flex', gap: '16px', alignItems: 'stretch', flexDirection: 'column' }} className="sm:!flex-row sm:overflow-x-auto sm:overflow-y-hidden">
          {(['technical', 'communications'] as TaskCategory[]).map((cat) => (
            <TaskColumn
              key={cat}
              category={cat}
              tasks={tasks.filter((t) => t.category === cat)}
              sensors={sensors}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onRename={handleRename}
              onDragEnd={handleDragEnd}
              onAdd={handleAdd}
            />
          ))}
        </div>
      )}
    </div>
  );
}

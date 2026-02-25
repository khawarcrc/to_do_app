'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Task, ViewType, Status } from '@/types';
import { cn } from '@/utils';
import { isPast, parseISO } from 'date-fns';

interface Props {
  open: boolean;
  onClose: () => void;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onNewTask: () => void;
  onViewChange: (view: ViewType) => void;
}

type ItemKind = 'action' | 'task';

interface PaletteItem {
  id: string;
  kind: ItemKind;
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  onSelect: () => void;
}

const VIEWS: { view: ViewType; label: string; icon: React.ReactNode }[] = [
  {
    view: 'kanban',
    label: 'Switch to Board view',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
  },
  {
    view: 'list',
    label: 'Switch to List view',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    view: 'calendar',
    label: 'Switch to Calendar view',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const PRIORITY_EMOJI: Record<string, string> = {
  critical: '🔴',
  high: '🟠',
  medium: '🟡',
  low: '🔵',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'To Do',
  'in-progress': 'In Progress',
  completed: 'Done',
};

export default function CommandPalette({ open, onClose, tasks, onTaskClick, onNewTask, onViewChange }: Props) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Build items from query
  const items = useMemo<PaletteItem[]>(() => {
    const q = query.toLowerCase().trim();

    const actions: PaletteItem[] = [
      {
        id: '__new',
        kind: 'action',
        label: 'Create new task',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        ),
        onSelect: () => { onNewTask(); onClose(); },
      },
      ...VIEWS.map((v) => ({
        id: `__view_${v.view}`,
        kind: 'action' as ItemKind,
        label: v.label,
        icon: v.icon,
        onSelect: () => { onViewChange(v.view); onClose(); },
      })),
    ];

    const matchedTasks: PaletteItem[] = tasks
      .filter((t) => !q || t.title.toLowerCase().includes(q) || (t.description ?? '').toLowerCase().includes(q) || (t.tags ?? []).some((tag) => tag.toLowerCase().includes(q)))
      .slice(0, 8)
      .map((t) => ({
        id: t.id,
        kind: 'task' as ItemKind,
        label: t.title,
        sublabel: `${STATUS_LABEL[t.status] ?? t.status}${t.dueDate && isPast(parseISO(t.dueDate)) && t.status !== 'completed' ? '  ·  Overdue' : ''}`,
        icon: <span className="text-sm">{PRIORITY_EMOJI[t.priority] ?? '⬜'}</span>,
        onSelect: () => { onTaskClick(t); onClose(); },
      }));

    // Filter actions by query
    const filteredActions = q
      ? actions.filter((a) => a.label.toLowerCase().includes(q))
      : actions;

    return [...filteredActions, ...matchedTasks];
  }, [query, tasks, onNewTask, onClose, onTaskClick, onViewChange]);

  // Keep activeIndex in bounds
  useEffect(() => { setActiveIndex(0); }, [items]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, items.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        items[activeIndex]?.onSelect();
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, items, activeIndex, onClose]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelectorAll('[data-item]')[activeIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  if (!open) return null;

  // Split items into groups for display
  const actionItems = items.filter((i) => i.kind === 'action');
  const taskItems = items.filter((i) => i.kind === 'task');

  let idx = 0;
  const renderItem = (item: PaletteItem) => {
    const i = idx++;
    const active = i === activeIndex;
    return (
      <button
        key={item.id}
        data-item
        type="button"
        onClick={item.onSelect}
        onMouseEnter={() => setActiveIndex(i)}
        className={cn(
          'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
          active ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
        )}
      >
        <span className={cn('shrink-0', active ? 'text-white' : 'text-[var(--text-muted)]')}>
          {item.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{item.label}</div>
          {item.sublabel && (
            <div className={cn('text-xs truncate', active ? 'text-white/70' : 'text-[var(--text-muted)]')}>
              {item.sublabel}
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[20vh] px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl animate-scale-in"
        style={{ backgroundColor: 'var(--bg-elevated)', boxShadow: 'var(--shadow-xl)' }}
      >
        {/* Search input */}
        <div
          className="flex items-center gap-3 px-4 py-3 border-b"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <svg className="w-5 h-5 shrink-0 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks or run a command…"
            className="flex-1 bg-transparent outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] rounded border text-[var(--text-muted)]"
            style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--bg-hover)' }}>
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-80 overflow-y-auto py-2">
          {items.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-[var(--text-muted)]">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              {actionItems.length > 0 && (
                <>
                  <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                    Actions
                  </div>
                  {actionItems.map((item) => renderItem(item))}
                </>
              )}
              {taskItems.length > 0 && (
                <>
                  <div className="px-4 py-1.5 mt-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                    Tasks
                  </div>
                  {taskItems.map((item) => renderItem(item))}
                </>
              )}
            </>
          )}
        </div>

        {/* Footer hints */}
        <div
          className="flex items-center gap-4 px-4 py-2 border-t text-[11px] text-[var(--text-muted)]"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <span><kbd className="font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono">↵</kbd> select</span>
          <span><kbd className="font-mono">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

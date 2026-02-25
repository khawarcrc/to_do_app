'use client';

import { useState } from 'react';
import { Task, Status, Priority, PRIORITY_CONFIG, STATUS_CONFIG } from '@/types';
import PriorityBadge from '@/components/PriorityBadge';
import { formatDistanceToNow, parseISO, isValid, isBefore, format } from 'date-fns';
import { formatMinutes, cn } from '@/utils';

interface Props {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onStatusChange: (id: string, status: Status) => void;
  onPriorityChange: (id: string, priority: Priority) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="skeleton w-4 h-4 rounded-full" />
      <div className="skeleton flex-1 h-4 rounded" />
      <div className="skeleton w-16 h-5 rounded" />
      <div className="skeleton w-20 h-5 rounded" />
      <div className="skeleton w-20 h-4 rounded" />
      <div className="skeleton w-16 h-4 rounded" />
    </div>
  );
}

interface InlineSelectProps<T extends string> {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  renderValue: (v: T) => React.ReactNode;
}

function InlineSelect<T extends string>({ value, options, onChange, renderValue }: InlineSelectProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((p) => !p); }}
        className="rounded-md hover:bg-[var(--bg-hover)] p-0.5 transition-colors"
      >
        {renderValue(value)}
      </button>
      {open && (
        <div
          className="absolute z-30 left-0 mt-1 rounded-lg border shadow-lg min-w-[8rem] py-1 animate-slide-down"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-default)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={(e) => {
                e.stopPropagation();
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[var(--bg-hover)] transition-colors ${
                opt.value === value ? 'font-semibold text-[var(--accent)]' : 'text-[var(--text-secondary)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ListView({
  tasks,
  onTaskClick,
  onStatusChange,
  onPriorityChange,
  onDelete,
  loading,
}: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}>
        {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div
        className="rounded-xl border flex flex-col items-center justify-center py-20 text-center"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
      >
        <div className="text-4xl mb-3">📋</div>
        <p className="text-sm font-semibold text-[var(--text-secondary)]">No tasks match your filters</p>
        <p className="text-xs text-[var(--text-muted)] mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  const priorityOptions: { value: Priority; label: string }[] = [
    { value: 'critical', label: '🔴 Critical' },
    { value: 'high', label: '🟠 High' },
    { value: 'medium', label: '🟡 Medium' },
    { value: 'low', label: '🔵 Low' },
  ];

  const statusOptions: { value: Status; label: string }[] = [
    { value: 'pending', label: '⬜ To Do' },
    { value: 'in-progress', label: '🔵 In Progress' },
    { value: 'completed', label: '✅ Done' },
  ];

  return (
    <div
      className="rounded-xl border overflow-hidden animate-fade-in-up"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
    >
      {/* Table header */}
      <div
        className="flex items-center gap-4 px-4 py-2 border-b text-[11px] font-semibold uppercase tracking-wider"
        style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-default)', color: 'var(--text-muted)' }}
      >
        <div className="w-4 shrink-0" />
        <div className="flex-1">Task</div>
        <div className="w-24 hidden sm:block">Priority</div>
        <div className="w-24 hidden md:block">Status</div>
        <div className="w-28 hidden lg:block">Due Date</div>
        <div className="w-16 hidden lg:block">Est.</div>
        <div className="w-8 shrink-0" />
      </div>

      {/* Rows */}
      <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
        {tasks.map((task) => {
          const now = new Date();
          const isOverdue =
            task.dueDate &&
            isValid(parseISO(task.dueDate)) &&
            isBefore(parseISO(task.dueDate), now) &&
            task.status !== 'completed';
          const isCompleted = task.status === 'completed';

          return (
            <div
              key={task.id}
              onMouseEnter={() => setHovered(task.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onTaskClick(task)}
              className={cn(
                'flex items-center gap-4 px-4 py-2.5 cursor-pointer transition-colors text-sm group',
                hovered === task.id ? 'bg-[var(--bg-hover)]' : ''
              )}
            >
              {/* Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(task.id, task.status === 'completed' ? 'pending' : 'completed');
                }}
                className={cn(
                  'shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all',
                  isCompleted
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-[var(--border-strong)] hover:border-emerald-400'
                )}
              >
                {isCompleted && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* Title + tags */}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    'font-medium truncate',
                    isCompleted
                      ? 'line-through text-[var(--text-muted)]'
                      : 'text-[var(--text-primary)]'
                  )}
                >
                  {task.title}
                </p>
                {task.tags && task.tags.length > 0 && (
                  <div className="flex gap-1 mt-0.5">
                    {task.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-1 py-0.5 rounded"
                        style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-muted)' }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Priority (inline select) */}
              <div className="w-24 hidden sm:block shrink-0">
                <InlineSelect
                  value={task.priority}
                  options={priorityOptions}
                  onChange={(p) => onPriorityChange(task.id, p)}
                  renderValue={(v) => <PriorityBadge priority={v} size="xs" />}
                />
              </div>

              {/* Status (inline select) */}
              <div className="w-24 hidden md:block shrink-0">
                <InlineSelect
                  value={task.status}
                  options={statusOptions}
                  onChange={(s) => onStatusChange(task.id, s)}
                  renderValue={(v) => {
                    const cfg = STATUS_CONFIG[v];
                    return (
                      <span className={cn('text-xs font-medium px-2 py-0.5 rounded-md', cfg.color, cfg.bgColor, cfg.darkColor, cfg.darkBgColor)}>
                        {cfg.label}
                      </span>
                    );
                  }}
                />
              </div>

              {/* Due date */}
              <div className="w-28 hidden lg:block shrink-0">
                {task.dueDate && isValid(parseISO(task.dueDate)) ? (
                  <span
                    className={cn(
                      'text-xs',
                      isOverdue ? 'text-red-500 font-medium' : 'text-[var(--text-muted)]'
                    )}
                  >
                    {isOverdue ? '⚠ ' : ''}
                    {format(parseISO(task.dueDate), 'MMM d')}
                  </span>
                ) : (
                  <span className="text-xs text-[var(--text-muted)]">—</span>
                )}
              </div>

              {/* Time estimate */}
              <div className="w-16 hidden lg:block shrink-0 text-xs text-[var(--text-muted)]">
                {task.timeEstimate > 0 ? formatMinutes(task.timeEstimate) : '—'}
              </div>

              {/* Actions */}
              <div
                className={cn(
                  'w-8 shrink-0 flex justify-end transition-opacity',
                  hovered === task.id ? 'opacity-100' : 'opacity-0'
                )}
              >
                {deleteConfirm === task.id ? (
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => { onDelete(task.id); setDeleteConfirm(null); }}
                      className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="p-1 rounded text-[var(--text-muted)] hover:bg-[var(--bg-hover)] text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirm(task.id); }}
                    className="p-1.5 rounded text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

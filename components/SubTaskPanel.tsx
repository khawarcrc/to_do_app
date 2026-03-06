'use client';

import { useState, useRef, useEffect } from 'react';
import { SubTask, SubTaskFormData, Priority, Status, PRIORITY_CONFIG, STATUS_CONFIG } from '@/types';
import { cn, formatDateForInput } from '@/utils';
import { format, parseISO, isValid, isPast, isToday } from 'date-fns';

// ── Constants ────────────────────────────────────────────────────────────────

const EMPTY_FORM: SubTaskFormData = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: '',
  assignee: '',
};

const PRIORITY_OPTS: { value: Priority; label: string }[] = [
  { value: 'critical', label: '🔴 Critical' },
  { value: 'high', label: '🟠 High' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'low', label: '🔵 Low' },
];

const STATUS_OPTS: { value: Status; label: string }[] = [
  { value: 'pending', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Done' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Upgrade a legacy subtask (completed: boolean) to the rich format */
function normalize(s: SubTask): SubTask {
  if (s.createdAt && s.status) return s;
  const now = new Date().toISOString();
  return {
    ...s,
    status: s.completed ? 'completed' : 'pending',
    priority: (s as SubTask).priority ?? 'medium',
    createdAt: (s as SubTask).createdAt ?? now,
    updatedAt: (s as SubTask).updatedAt ?? now,
  };
}

function dueDateChip(dueDate?: string) {
  if (!dueDate) return null;
  const date = parseISO(dueDate);
  if (!isValid(date)) return null;
  const overdue = isPast(date) && !isToday(date);
  const today = isToday(date);
  return { label: format(date, 'MMM d'), overdue, today };
}

// ── Tiny select dropdown ─────────────────────────────────────────────────────

function MiniSelect<T extends string>({
  value,
  options,
  onChange,
  className,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const current = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border transition-colors hover:bg-[var(--bg-hover)]"
        style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
      >
        {current?.label}
        <svg className="w-2.5 h-2.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute z-50 left-0 mt-1 rounded-lg border shadow-lg min-w-[9rem] py-1"
          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-default)', boxShadow: 'var(--shadow-md)' }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={cn(
                'w-full text-left px-3 py-1.5 text-xs transition-colors hover:bg-[var(--bg-hover)]',
                opt.value === value ? 'text-[var(--accent)] font-semibold' : 'text-[var(--text-secondary)]'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── SubTask inline form ───────────────────────────────────────────────────────

interface SubTaskFormProps {
  initial?: SubTaskFormData;
  submitLabel: string;
  onSubmit: (data: SubTaskFormData) => void;
  onCancel: () => void;
}

function SubTaskForm({ initial = EMPTY_FORM, submitLabel, onSubmit, onCancel }: SubTaskFormProps) {
  const [form, setForm] = useState<SubTaskFormData>(initial);
  const [titleErr, setTitleErr] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => titleRef.current?.focus(), 50);
  }, []);

  function upd<K extends keyof SubTaskFormData>(k: K, v: SubTaskFormData[K]) {
    setForm((p) => ({ ...p, [k]: v }));
    if (k === 'title') setTitleErr('');
  }

  function submit() {
    if (!form.title.trim()) { setTitleErr('Title is required'); return; }
    onSubmit({ ...form, title: form.title.trim() });
  }

  const priorityCfg = PRIORITY_CONFIG[form.priority];
  const statusCfg = STATUS_CONFIG[form.status];

  return (
    <div
      className="rounded-xl border p-3 space-y-3 mt-1"
      style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-default)' }}
    >
      {/* Title */}
      <div>
        <input
          ref={titleRef}
          type="text"
          value={form.title}
          onChange={(e) => upd('title', e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } if (e.key === 'Escape') onCancel(); }}
          placeholder="Subtask title..."
          maxLength={200}
          className={cn(
            'w-full text-sm font-medium bg-transparent outline-none border-b pb-1 transition-colors',
            'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
            titleErr ? 'border-red-400' : 'border-[var(--border-default)] focus:border-[var(--accent)]'
          )}
        />
        {titleErr && <p className="text-[11px] text-red-500 mt-0.5">{titleErr}</p>}
      </div>

      {/* Description */}
      <textarea
        value={form.description ?? ''}
        onChange={(e) => upd('description', e.target.value)}
        placeholder="Description (optional)..."
        rows={2}
        className="w-full text-xs bg-transparent outline-none resize-none
          text-[var(--text-secondary)] placeholder:text-[var(--text-muted)]"
      />

      {/* Properties row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-[var(--text-muted)]">Status</span>
          <MiniSelect
            value={form.status}
            options={STATUS_OPTS.map((o) => ({
              value: o.value,
              label: STATUS_CONFIG[o.value].label,
            }))}
            onChange={(v) => upd('status', v)}
          />
        </div>

        <span className="text-[var(--border-default)] text-xs">·</span>

        {/* Priority */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-[var(--text-muted)]">Priority</span>
          <MiniSelect
            value={form.priority}
            options={PRIORITY_OPTS}
            onChange={(v) => upd('priority', v)}
          />
        </div>

        <span className="text-[var(--border-default)] text-xs">·</span>

        {/* Due date */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-[var(--text-muted)]">Due</span>
          <input
            type="date"
            value={form.dueDate ? form.dueDate.slice(0, 10) : ''}
            onChange={(e) => upd('dueDate', e.target.value ? new Date(e.target.value).toISOString() : '')}
            className="text-[11px] px-1.5 py-0.5 rounded border bg-transparent outline-none focus:ring-1 focus:ring-[var(--accent)]
              text-[var(--text-secondary)]"
            style={{ borderColor: 'var(--border-default)' }}
          />
          {form.dueDate && (
            <button type="button" onClick={() => upd('dueDate', '')} className="text-[var(--text-muted)] hover:text-red-500 text-xs">✕</button>
          )}
        </div>
      </div>

      {/* Assignee */}
      <div className="flex items-center gap-2">
        <svg className="w-3 h-3 text-[var(--text-muted)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <input
          type="text"
          value={form.assignee ?? ''}
          onChange={(e) => upd('assignee', e.target.value)}
          placeholder="Assignee (optional)..."
          className="flex-1 text-xs bg-transparent outline-none text-[var(--text-secondary)] placeholder:text-[var(--text-muted)]"
        />
      </div>

      {/* Badges preview */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium',
          priorityCfg.color, priorityCfg.bgColor, priorityCfg.darkColor, priorityCfg.darkBgColor)}>
          {priorityCfg.emoji} {priorityCfg.label}
        </span>
        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium',
          statusCfg.color, statusCfg.bgColor, statusCfg.darkColor, statusCfg.darkBgColor)}>
          {STATUS_OPTS.find(o => o.value === form.status)?.label}
        </span>
        {form.dueDate && (() => {
          const chip = dueDateChip(form.dueDate);
          if (!chip) return null;
          return (
            <span className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium',
              chip.overdue ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
              chip.today   ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                             'bg-[var(--bg-hover)] text-[var(--text-secondary)]'
            )}>
              📅 {chip.label}{chip.overdue ? ' · Overdue' : chip.today ? ' · Today' : ''}
            </span>
          );
        })()}
        {form.assignee?.trim() && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-[var(--bg-hover)] text-[var(--text-secondary)]">
            👤 {form.assignee.trim()}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-1 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg text-white transition-colors"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}

// ── SubTask row item ──────────────────────────────────────────────────────────

interface SubTaskItemProps {
  sub: SubTask;
  onUpdate: (id: string, data: SubTaskFormData) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

function SubTaskItem({ sub, onUpdate, onDelete, onToggleStatus }: SubTaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const priorityCfg = PRIORITY_CONFIG[sub.priority ?? 'medium'];
  const statusCfg = STATUS_CONFIG[sub.status ?? 'pending'];
  const done = sub.status === 'completed';
  const chip = dueDateChip(sub.dueDate);
  const hasDescription = !!sub.description?.trim();

  if (editing) {
    return (
      <SubTaskForm
        initial={{
          title: sub.title,
          description: sub.description ?? '',
          status: sub.status,
          priority: sub.priority,
          dueDate: sub.dueDate ?? '',
          assignee: sub.assignee ?? '',
        }}
        submitLabel="Save Subtask"
        onSubmit={(data) => { onUpdate(sub.id, data); setEditing(false); }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div
      className={cn(
        'group rounded-lg border transition-colors',
        done
          ? 'opacity-70'
          : 'hover:border-[var(--border-strong)]'
      )}
      style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--bg-elevated)' }}
    >
      {/* Main row */}
      <div className="flex items-start gap-2.5 p-2.5">
        {/* Priority indicator */}
        <div className="mt-0.5 shrink-0 flex flex-col items-center gap-1">
          <div
            className="w-1.5 h-1.5 rounded-full mt-1"
            style={{
              backgroundColor:
                sub.priority === 'critical' ? '#ef4444' :
                sub.priority === 'high'     ? '#f97316' :
                sub.priority === 'medium'   ? '#eab308' :
                '#3b82f6',
            }}
            title={priorityCfg.label}
          />
        </div>

        {/* Status toggle */}
        <button
          type="button"
          onClick={() => onToggleStatus(sub.id)}
          title="Toggle status"
          className={cn(
            'w-4 h-4 rounded shrink-0 border flex items-center justify-center mt-0.5 transition-colors',
            done
              ? 'bg-[var(--accent)] border-[var(--accent)]'
              : sub.status === 'in-progress'
                ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'
                : 'border-[var(--border-default)] hover:border-[var(--accent)]'
          )}
        >
          {done && (
            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {sub.status === 'in-progress' && !done && (
            <div className="w-2 h-2 rounded-sm bg-indigo-500" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <span className={cn(
              'text-sm leading-snug',
              done ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
            )}>
              {sub.title}
            </span>
            {/* Actions */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              {hasDescription && (
                <button
                  type="button"
                  onClick={() => setExpanded((p) => !p)}
                  className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                  title={expanded ? 'Collapse' : 'View description'}
                >
                  <svg className={cn('w-3 h-3 transition-transform', expanded ? 'rotate-180' : '')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-hover)] transition-colors"
                title="Edit subtask"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              {deleteConfirm ? (
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => onDelete(sub.id)}
                    className="px-1.5 py-0.5 text-[10px] rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >Del</button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(false)}
                    className="px-1.5 py-0.5 text-[10px] rounded hover:bg-[var(--bg-hover)] text-[var(--text-muted)] transition-colors"
                  >No</button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(true)}
                  className="p-1 rounded text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Delete subtask"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Chips row */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <span className={cn(
              'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium',
              statusCfg.bgColor, statusCfg.color, statusCfg.darkBgColor, statusCfg.darkColor
            )}>
              {STATUS_OPTS.find(o => o.value === sub.status)?.label ?? 'To Do'}
            </span>
            <span className={cn(
              'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium',
              priorityCfg.bgColor, priorityCfg.color, priorityCfg.darkBgColor, priorityCfg.darkColor
            )}>
              {priorityCfg.emoji} {priorityCfg.label}
            </span>
            {chip && (
              <span className={cn(
                'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium',
                chip.overdue ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                chip.today   ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                               'bg-[var(--bg-hover)] text-[var(--text-muted)]'
              )}>
                📅 {chip.label}{chip.overdue ? ' · Overdue' : chip.today ? ' · Today' : ''}
              </span>
            )}
            {sub.assignee?.trim() && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-[var(--bg-hover)] text-[var(--text-muted)]">
                👤 {sub.assignee.trim()}
              </span>
            )}
            {sub.updatedAt && (
              <span className="text-[10px] text-[var(--text-muted)]">
                · updated {format(parseISO(sub.updatedAt), 'MMM d')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Expanded description */}
      {expanded && hasDescription && (
        <div
          className="px-8 pb-2.5 text-xs text-[var(--text-secondary)] border-t pt-2"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          {sub.description}
        </div>
      )}
    </div>
  );
}

// ── SubTaskPanel (exported) ───────────────────────────────────────────────────

interface SubTaskPanelProps {
  subTasks: SubTask[];
  onChange: (updated: SubTask[]) => void;
}

export default function SubTaskPanel({ subTasks, onChange }: SubTaskPanelProps) {
  const [adding, setAdding] = useState(false);
  const normalized = subTasks.map(normalize);

  const total = normalized.length;
  const done = normalized.filter((s) => s.status === 'completed').length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  function handleAdd(data: SubTaskFormData) {
    const now = new Date().toISOString();
    const newSub: SubTask = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description || undefined,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate || undefined,
      assignee: data.assignee?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };
    onChange([...normalized, newSub]);
    setAdding(false);
  }

  function handleUpdate(id: string, data: SubTaskFormData) {
    onChange(
      normalized.map((s) =>
        s.id === id
          ? {
              ...s,
              title: data.title,
              description: data.description || undefined,
              status: data.status,
              priority: data.priority,
              dueDate: data.dueDate || undefined,
              assignee: data.assignee?.trim() || undefined,
              updatedAt: new Date().toISOString(),
            }
          : s
      )
    );
  }

  function handleDelete(id: string) {
    onChange(normalized.filter((s) => s.id !== id));
  }

  function handleToggleStatus(id: string) {
    onChange(
      normalized.map((s) => {
        if (s.id !== id) return s;
        const next: Status =
          s.status === 'pending'      ? 'in-progress' :
          s.status === 'in-progress'  ? 'completed'   :
                                        'pending';
        return { ...s, status: next, updatedAt: new Date().toISOString() };
      })
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span className="text-xs font-semibold text-[var(--text-secondary)]">
            Subtasks
          </span>
          {total > 0 && (
            <span className="text-[11px] text-[var(--text-muted)]">
              {done}/{total} done
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md text-[var(--accent)] hover:bg-[var(--bg-hover)] transition-colors font-medium"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add subtask
        </button>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ backgroundColor: 'var(--bg-hover)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: pct === 100 ? '#22c55e' : 'var(--accent)' }}
          />
        </div>
      )}

      {/* Subtask list */}
      {normalized.length > 0 && (
        <div className="space-y-1.5 mb-2">
          {normalized.map((sub) => (
            <SubTaskItem
              key={sub.id}
              sub={sub}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      {/* Add form */}
      {adding && (
        <SubTaskForm
          submitLabel="Add Subtask"
          onSubmit={handleAdd}
          onCancel={() => setAdding(false)}
        />
      )}

      {/* Empty state */}
      {total === 0 && !adding && (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="w-full text-left px-3 py-2.5 rounded-lg border border-dashed text-xs text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          style={{ borderColor: 'var(--border-default)' }}
        >
          + Break this task into smaller steps...
        </button>
      )}
    </div>
  );
}

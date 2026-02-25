'use client';

import { useState, useEffect, useRef } from 'react';
import { Task, TaskFormData, Priority, Status, PRIORITY_CONFIG, STATUS_CONFIG } from '@/types';
import { parseTimeInput, formatMinutes, formatDateForInput, cn } from '@/utils';
import { format, parseISO, isValid } from 'date-fns';

interface Props {
  task?: Task | null;
  initialStatus?: Status;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

const DEFAULT: TaskFormData = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'pending',
  timeEstimate: 0,
  dueDate: '',
  tags: [],
};

/* ─── Property Row ─────────────────────────────────────── */
function PropRow({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="flex items-center gap-1.5 w-32 shrink-0 text-xs text-[var(--text-muted)] pt-1.5">
        <span className="opacity-70">{icon}</span>
        {label}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

/* ─── Select Pill ──────────────────────────────────────── */
function SelectPill<T extends string>({
  value,
  options,
  onChange,
  renderOption,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  renderOption?: (v: T) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors hover:bg-[var(--bg-hover)] border"
        style={{ borderColor: 'var(--border-default)' }}
      >
        {renderOption ? renderOption(value) : options.find((o) => o.value === value)?.label}
        <svg className="w-3 h-3 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute z-50 left-0 mt-1 rounded-lg border shadow-lg min-w-[8rem] py-1 animate-slide-down"
          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-default)', boxShadow: 'var(--shadow-md)' }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={cn(
                'w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs transition-colors hover:bg-[var(--bg-hover)]',
                opt.value === value ? 'text-[var(--accent)] font-semibold' : 'text-[var(--text-secondary)]'
              )}
            >
              {renderOption ? renderOption(opt.value as T) : opt.label}
              {opt.value === value && (
                <svg className="w-3 h-3 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── TaskModal ────────────────────────────────────────── */
export default function TaskModal({ task, initialStatus, onSubmit, onDelete, onClose }: Props) {
  const [form, setForm] = useState<TaskFormData>(() => ({
    ...DEFAULT,
    status: initialStatus ?? DEFAULT.status,
  }));
  const [timeInput, setTimeInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description ?? '',
        priority: task.priority,
        status: task.status,
        timeEstimate: task.timeEstimate,
        dueDate: task.dueDate ?? '',
        tags: task.tags ?? [],
      });
      setTimeInput(task.timeEstimate > 0 ? formatMinutes(task.timeEstimate) : '');
    } else {
      setForm({ ...DEFAULT, status: initialStatus ?? DEFAULT.status });
      setTimeInput('');
    }
    setTimeout(() => titleRef.current?.focus(), 80);
  }, [task, initialStatus]);

  function set<K extends keyof TaskFormData>(key: K, value: TaskFormData[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    if (key === 'title') setTitleError('');
  }

  function handleTimeBlur() {
    const mins = parseTimeInput(timeInput);
    set('timeEstimate', mins);
    setTimeInput(mins > 0 ? formatMinutes(mins) : '');
  }

  function addTag() {
    const tag = tagInput.trim().replace(/^#/, '');
    if (tag && !(form.tags ?? []).includes(tag)) {
      set('tags', [...(form.tags ?? []), tag]);
      setTagInput('');
    }
  }

  async function handleSubmit() {
    if (!form.title.trim()) { setTitleError('Title is required'); return; }
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
        dueDate: form.dueDate || undefined,
        description: form.description || undefined,
      });
      onClose();
    } catch {
      setSubmitting(false);
    }
  }

  const PRIORITY_OPTS: { value: Priority; label: string }[] = [
    { value: 'critical', label: '🔴 Critical' },
    { value: 'high',     label: '🟠 High' },
    { value: 'medium',   label: '🟡 Medium' },
    { value: 'low',      label: '🔵 Low' },
  ];

  const STATUS_OPTS: { value: Status; label: string }[] = [
    { value: 'pending',     label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed',   label: 'Completed' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-scale-in"
        style={{ backgroundColor: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)' }}
      >
        {/* Modal header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor:
                  form.priority === 'critical' ? '#ef4444' :
                  form.priority === 'high'     ? '#f97316' :
                  form.priority === 'medium'   ? '#eab308' :
                  '#3b82f6',
              }}
            />
            <span className="text-xs font-medium text-[var(--text-muted)]">
              {task ? `Updated ${task.updatedAt ? format(parseISO(task.updatedAt), 'MMM d') : ''}` : 'New Task'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {task && onDelete && (
              deleteConfirm ? (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-[var(--text-muted)]">Delete?</span>
                  <button
                    type="button"
                    onClick={() => { onDelete(task.id); onClose(); }}
                    className="px-2 py-1 text-xs rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >Yes</button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(false)}
                    className="px-2 py-1 text-xs rounded-md hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors"
                  >No</button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(true)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Delete task"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 pt-5 pb-2">
            {/* Title */}
            <input
              ref={titleRef}
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') void handleSubmit(); }}
              placeholder="Task title..."
              maxLength={200}
              className={cn(
                'w-full text-xl font-semibold bg-transparent border-b pb-2 mb-1 outline-none transition-colors',
                'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
                titleError ? 'border-red-400' : 'border-transparent focus:border-[var(--border-strong)]'
              )}
            />
            {titleError && <p className="text-xs text-red-500 mb-2">{titleError}</p>}

            {/* Description */}
            <textarea
              value={form.description ?? ''}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Add a description..."
              rows={3}
              className="w-full mt-3 text-sm bg-transparent outline-none resize-none
                text-[var(--text-secondary)] placeholder:text-[var(--text-muted)]"
            />
          </div>

          {/* Properties */}
          <div
            className="px-6 py-2 border-t border-b mx-6 rounded-xl mb-3"
            style={{
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              margin: '0 1.5rem 0.75rem',
            }}
          >
            {/* Status */}
            <PropRow
              label="Status"
              icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            >
              <SelectPill
                value={form.status}
                options={STATUS_OPTS}
                onChange={(v) => set('status', v)}
                renderOption={(v) => {
                  const c = STATUS_CONFIG[v as Status];
                  return <span className={cn('font-medium', c.color, c.darkColor)}>{c.label}</span>;
                }}
              />
            </PropRow>

            <div className="h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />

            {/* Priority */}
            <PropRow
              label="Priority"
              icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" /></svg>}
            >
              <SelectPill
                value={form.priority}
                options={PRIORITY_OPTS}
                onChange={(v) => set('priority', v)}
                renderOption={(v) => {
                  const c = PRIORITY_CONFIG[v as Priority];
                  return <span className={cn('font-medium', c.color, c.darkColor)}>{c.emoji} {c.label}</span>;
                }}
              />
            </PropRow>

            <div className="h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />

            {/* Due date */}
            <PropRow
              label="Due Date"
              icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            >
              <div className="flex items-center gap-2">
                <input
                  type="datetime-local"
                  value={form.dueDate ? formatDateForInput(form.dueDate) : ''}
                  onChange={(e) => set('dueDate', e.target.value ? new Date(e.target.value).toISOString() : '')}
                  className="text-xs px-2 py-1 rounded-md border bg-transparent outline-none focus:ring-1 focus:ring-[var(--accent)]
                    text-[var(--text-secondary)]"
                  style={{ borderColor: 'var(--border-default)' }}
                />
                {form.dueDate && (
                  <button
                    type="button"
                    onClick={() => set('dueDate', '')}
                    className="text-xs text-[var(--text-muted)] hover:text-red-500 transition-colors"
                  >✕</button>
                )}
              </div>
            </PropRow>

            <div className="h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />

            {/* Time estimate */}
            <PropRow
              label="Estimate"
              icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={timeInput}
                  onChange={(e) => setTimeInput(e.target.value)}
                  onBlur={handleTimeBlur}
                  placeholder="e.g. 1h 30m"
                  className="text-xs px-2 py-1 rounded-md border w-28 bg-transparent outline-none focus:ring-1 focus:ring-[var(--accent)]
                    text-[var(--text-secondary)] placeholder:text-[var(--text-muted)]"
                  style={{ borderColor: 'var(--border-default)' }}
                />
                {form.timeEstimate > 0 && (
                  <span className="text-xs text-[var(--text-muted)]">= {formatMinutes(form.timeEstimate)}</span>
                )}
              </div>
            </PropRow>

            <div className="h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />

            {/* Tags */}
            <PropRow
              label="Tags"
              icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>}
            >
              <div className="flex flex-wrap items-center gap-1.5">
                {(form.tags ?? []).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full"
                    style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => set('tags', form.tags!.filter((t) => t !== tag))}
                      className="opacity-50 hover:opacity-100"
                    >×</button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                  placeholder="Add tag..."
                  className="text-xs px-2 py-1 rounded-md border bg-transparent outline-none focus:ring-1 focus:ring-[var(--accent)] w-24
                    text-[var(--text-secondary)] placeholder:text-[var(--text-muted)]"
                  style={{ borderColor: 'var(--border-default)' }}
                />
              </div>
            </PropRow>

            {/* Metadata */}
            {task && (
              <>
                <div className="h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
                <div className="py-2 flex gap-6 text-[11px] text-[var(--text-muted)]">
                  <span>Created {isValid(parseISO(task.createdAt)) ? format(parseISO(task.createdAt), 'MMM d, yyyy') : '—'}</span>
                  {task.completedAt && <span>Completed {format(parseISO(task.completedAt), 'MMM d, yyyy')}</span>}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-2 px-6 py-4 border-t shrink-0"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={submitting}
            className="px-5 py-2 text-sm font-semibold rounded-lg text-white transition-all active:scale-95 disabled:opacity-60"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            {submitting ? 'Saving…' : task ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}

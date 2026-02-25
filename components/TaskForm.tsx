'use client';

import { useState, useEffect } from 'react';
import { Task, TaskFormData, Priority, Status } from '@/types';
import { parseTimeInput, formatMinutes, formatDateForInput, cn } from '@/utils';

interface Props {
  task?: Task | null;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onClose: () => void;
}

const LABEL = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1';
const INPUT =
  'w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm';

const DEFAULT_FORM: TaskFormData = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'pending',
  timeEstimate: 0,
  dueDate: '',
  tags: [],
};

export default function TaskForm({ task, onSubmit, onClose }: Props) {
  const [form, setForm] = useState<TaskFormData>(DEFAULT_FORM);
  const [timeInput, setTimeInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      setForm(DEFAULT_FORM);
      setTimeInput('');
      setTagInput('');
    }
  }, [task]);

  function set<K extends keyof TaskFormData>(key: K, value: TaskFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
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

  function removeTag(tag: string) {
    set('tags', (form.tags ?? []).filter((t) => t !== tag));
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (form.title.trim().length > 200) errs.title = 'Max 200 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
        dueDate: form.dueDate || undefined,
        description: form.description || undefined,
      });
      onClose();
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Something went wrong' });
    } finally {
      setSubmitting(false);
    }
  }

  // Backdrop click closes
  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={(e) => void handleSubmit(e)} className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className={LABEL}>
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="What needs to be done?"
              className={cn(INPUT, errors.title && 'border-red-400 focus:ring-red-400')}
              maxLength={200}
              autoFocus
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className={LABEL}>Description</label>
            <textarea
              value={form.description ?? ''}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Add more details..."
              rows={3}
              className={cn(INPUT, 'resize-none')}
            />
          </div>

          {/* Priority + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Priority</label>
              <select
                value={form.priority}
                onChange={(e) => set('priority', e.target.value as Priority)}
                className={INPUT}
              >
                <option value="critical">🔴 Critical</option>
                <option value="high">🟠 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🔵 Low</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Status</label>
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value as Status)}
                className={INPUT}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Time Estimate + Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Time Estimate</label>
              <input
                type="text"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                onBlur={handleTimeBlur}
                placeholder="e.g. 1h 30m, 90m"
                className={INPUT}
              />
              {form.timeEstimate > 0 && (
                <p className="mt-1 text-xs text-slate-400">{formatMinutes(form.timeEstimate)}</p>
              )}
            </div>
            <div>
              <label className={LABEL}>Due Date & Time</label>
              <input
                type="datetime-local"
                value={form.dueDate ? formatDateForInput(form.dueDate) : ''}
                onChange={(e) =>
                  set('dueDate', e.target.value ? new Date(e.target.value).toISOString() : '')
                }
                className={INPUT}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={LABEL}>Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add tag & press Enter"
                className={cn(INPUT, 'flex-1')}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 text-sm rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors"
              >
                Add
              </button>
            </div>
            {(form.tags ?? []).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(form.tags ?? []).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {errors.submit && (
            <div className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
              {errors.submit}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="task-form"
            disabled={submitting}
            onClick={(e) => {
              e.preventDefault();
              void handleSubmit(e as unknown as React.FormEvent);
            }}
            className={cn(
              'px-5 py-2 text-sm font-semibold rounded-lg text-white transition-colors',
              submitting
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
            )}
          >
            {submitting ? 'Saving…' : task ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}

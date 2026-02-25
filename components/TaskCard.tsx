'use client';

import { Task, STATUS_CONFIG } from '@/types';
import PriorityBadge from './PriorityBadge';
import TimeEstimate from './TimeEstimate';
import { cn } from '@/utils';
import { format, parseISO, isValid } from 'date-fns';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onToggleStatus }: Props) {
  const statusConfig = STATUS_CONFIG[task.status];
  const isCompleted = task.status === 'completed';
  const isOverdue =
    task.dueDate &&
    isValid(parseISO(task.dueDate)) &&
    new Date(task.dueDate) < new Date() &&
    !isCompleted;

  return (
    <div
      className={cn(
        'group relative rounded-xl border p-4 shadow-sm transition-all duration-200',
        'bg-white dark:bg-slate-800',
        isCompleted
          ? 'border-slate-200 dark:border-slate-700 opacity-75'
          : isOverdue
            ? 'border-red-300 dark:border-red-700 bg-red-50/30 dark:bg-red-900/10'
            : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggleStatus(task.id)}
          aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
          className={cn(
            'mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
            isCompleted
              ? 'bg-emerald-500 border-emerald-500'
              : 'border-slate-300 dark:border-slate-500 hover:border-emerald-400 dark:hover:border-emerald-500'
          )}
        >
          {isCompleted && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                'font-semibold text-slate-800 dark:text-slate-100 leading-snug',
                isCompleted && 'line-through text-slate-400 dark:text-slate-500'
              )}
            >
              {task.title}
            </h3>
            {/* Action buttons */}
            <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(task)}
                aria-label="Edit task"
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(task.id)}
                aria-label="Delete task"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {task.description && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 text-xs rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom row */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <PriorityBadge priority={task.priority} size="sm" />
            <span
              className={cn(
                'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full',
                statusConfig.color,
                statusConfig.bgColor,
                statusConfig.darkColor,
                statusConfig.darkBgColor
              )}
            >
              {statusConfig.label}
            </span>
            <TimeEstimate timeEstimate={task.timeEstimate} dueDate={task.dueDate} status={task.status} />
          </div>

          {/* Created / Completed date */}
          <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            Created {isValid(parseISO(task.createdAt)) ? format(parseISO(task.createdAt), 'MMM d, yyyy') : '—'}
            {task.completedAt && isValid(parseISO(task.completedAt)) && (
              <span> · Completed {format(parseISO(task.completedAt), 'MMM d, yyyy')}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

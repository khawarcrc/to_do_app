'use client';

import { useState } from 'react';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addMonths, subMonths, eachDayOfInterval, isSameMonth,
  isSameDay, isToday, parseISO, isValid, format,
} from 'date-fns';
import { Task } from '@/types';
import PriorityBadge from '@/components/PriorityBadge';

interface Props {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onNewTask: (date?: Date) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarView({ tasks, onTaskClick, onNewTask }: Props) {
  const [month, setMonth] = useState(new Date());

  const start = startOfWeek(startOfMonth(month));
  const end = endOfWeek(endOfMonth(month));
  const days = eachDayOfInterval({ start, end });

  const tasksByDay = new Map<string, Task[]>();
  tasks.forEach((task) => {
    if (!task.dueDate) return;
    const d = parseISO(task.dueDate);
    if (!isValid(d)) return;
    const key = format(d, 'yyyy-MM-dd');
    tasksByDay.set(key, [...(tasksByDay.get(key) ?? []), task]);
  });

  return (
    <div
      className="rounded-xl border overflow-hidden flex flex-col h-full animate-fade-in-up"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
    >
      {/* Month header */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--bg-subtle)' }}
      >
        <button
          onClick={() => setMonth((m) => subMonths(m, 1))}
          className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h2 className="text-sm font-semibold text-[var(--text-primary)]">
          {format(month, 'MMMM yyyy')}
        </h2>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setMonth(new Date())}
            className="px-2 py-1 text-xs rounded-md hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setMonth((m) => addMonths(m, 1))}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Weekday labels */}
      <div
        className="grid grid-cols-7 border-b text-[11px] font-semibold uppercase tracking-wider"
        style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
      >
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center py-2">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 flex-1 overflow-y-auto">
        {days.map((day, idx) => {
          const key = format(day, 'yyyy-MM-dd');
          const dayTasks = tasksByDay.get(key) ?? [];
          const isCurrentMonth = isSameMonth(day, month);
          const _isToday = isToday(day);

          return (
            <div
              key={idx}
              onClick={() => onNewTask(day)}
              className={`cal-cell-hover border-b border-r p-1 min-h-[80px] ${
                !isCurrentMonth ? 'opacity-40' : ''
              }`}
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              {/* Day number */}
              <div className="flex justify-end mb-1">
                <span
                  className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${
                    _isToday
                      ? 'bg-[var(--accent)] text-white'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {format(day, 'd')}
                </span>
              </div>

              {/* Tasks */}
              <div className="space-y-0.5">
                {dayTasks.slice(0, 3).map((task) => (
                  <button
                    key={task.id}
                    onClick={(e) => { e.stopPropagation(); onTaskClick(task); }}
                    className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] leading-snug truncate transition-colors hover:brightness-95 ${
                      task.status === 'completed' ? 'opacity-50 line-through' : ''
                    } priority-bar-${task.priority}`}
                    style={{
                      backgroundColor:
                        task.priority === 'critical' ? '#fef2f2' :
                        task.priority === 'high'     ? '#fff7ed' :
                        task.priority === 'medium'   ? '#fefce8' :
                        '#eff6ff',
                      color:
                        task.priority === 'critical' ? '#dc2626' :
                        task.priority === 'high'     ? '#c2410c' :
                        task.priority === 'medium'   ? '#92400e' :
                        '#1d4ed8',
                    }}
                  >
                    {task.title}
                  </button>
                ))}
                {dayTasks.length > 3 && (
                  <p className="text-[10px] text-[var(--text-muted)] pl-1">
                    +{dayTasks.length - 3} more
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* No-date tasks notice */}
      {tasks.filter((t) => !t.dueDate).length > 0 && (
        <div
          className="px-4 py-2 border-t text-xs text-[var(--text-muted)] flex items-center gap-1"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {tasks.filter((t) => !t.dueDate).length} task{tasks.filter((t) => !t.dueDate).length !== 1 ? 's' : ''} without due date (not shown)
        </div>
      )}
    </div>
  );
}

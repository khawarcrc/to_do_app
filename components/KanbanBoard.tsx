'use client';

import React, { useState, useMemo } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Task, Status, PRIORITY_CONFIG } from '@/types';
import PriorityBadge from '@/components/PriorityBadge';
import { formatDistanceToNow, parseISO, isValid, isBefore } from 'date-fns';
import { formatMinutes } from '@/utils';

interface Props {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onStatusChange: (id: string, status: Status) => void;
  onNewTask: (status?: Status) => void;
}

const COLUMNS: { id: Status; label: string; color: string; dotColor: string }[] = [
  { id: 'pending',     label: 'To Do',      color: 'text-slate-600 dark:text-slate-400', dotColor: 'bg-slate-400' },
  { id: 'in-progress', label: 'In Progress', color: 'text-blue-600 dark:text-blue-400',  dotColor: 'bg-blue-500'  },
  { id: 'completed',   label: 'Done',        color: 'text-green-600 dark:text-green-400', dotColor: 'bg-green-500' },
];

/* ─── Sortable Card ─────────────────────────────────────── */

function KanbanCard({
  task,
  onClick,
  isDragOverlay = false,
}: {
  task: Task;
  onClick: () => void;
  isDragOverlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'task', task },
  });

  const style =
    isDragOverlay
      ? undefined
      : {
          transform: CSS.Transform.toString(transform),
          transition,
        };

  const now = new Date();
  const isOverdue =
    task.dueDate &&
    isValid(parseISO(task.dueDate)) &&
    isBefore(parseISO(task.dueDate), now) &&
    task.status !== 'completed';

  const priorityLeft: Record<Task['priority'], string> = {
    critical: 'border-l-red-500',
    high:     'border-l-orange-500',
    medium:   'border-l-yellow-500',
    low:      'border-l-blue-400',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group rounded-lg border-l-[3px] cursor-grab active:cursor-grabbing
        ${priorityLeft[task.priority]}
        ${isDragging ? 'opacity-40 scale-95' : ''}
        ${isDragOverlay ? 'kanban-drag-overlay rotate-1' : ''}
      `}
      onClick={onClick}
    >
      <div
        className="p-3 rounded-r-lg"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-subtle)',
          borderRight: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Title */}
        <p
          className={`text-sm font-medium leading-snug mb-2 line-clamp-2 ${
            task.status === 'completed'
              ? 'line-through text-[var(--text-muted)]'
              : 'text-[var(--text-primary)]'
          }`}
        >
          {task.title}
        </p>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {task.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 text-[10px] rounded font-medium"
                style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-muted)' }}
              >
                #{tag}
              </span>
            ))}
            {task.tags.length > 2 && (
              <span className="text-[10px] text-[var(--text-muted)]">+{task.tags.length - 2}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 mt-2">
          <PriorityBadge priority={task.priority} size="xs" />

          <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
            {task.timeEstimate > 0 && (
              <span className="flex items-center gap-0.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatMinutes(task.timeEstimate)}
              </span>
            )}
            {task.dueDate && isValid(parseISO(task.dueDate)) && (
              <span className={`flex items-center gap-0.5 ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {isOverdue ? '⚠ ' : ''}
                {formatDistanceToNow(parseISO(task.dueDate), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Droppable Column ──────────────────────────────────── */

function KanbanColumn({
  column,
  tasks,
  onTaskClick,
  onNewTask,
}: {
  column: (typeof COLUMNS)[number];
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onNewTask: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex flex-col w-72 shrink-0 gap-2">
      {/* Column header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${column.dotColor}`} />
          <span className={`text-xs font-semibold uppercase tracking-wider ${column.color}`}>
            {column.label}
          </span>
          <span
            className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-muted)' }}
          >
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onNewTask}
          className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          title="Add task"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 min-h-40 p-2 rounded-xl transition-colors ${
          isOver ? 'ring-2 ring-[var(--accent)] ring-opacity-50' : ''
        }`}
        style={{
          backgroundColor: isOver ? 'var(--bg-selected)' : 'var(--bg-subtle)',
          minHeight: '10rem',
        }}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-[var(--text-muted)]">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Kanban Board ──────────────────────────────────────── */

export default function KanbanBoard({ tasks, onTaskClick, onStatusChange, onNewTask }: Props) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const tasksByStatus = useMemo(() => {
    const map: Record<Status, Task[]> = { pending: [], 'in-progress': [], completed: [] };
    tasks.forEach((t) => map[t.status].push(t));
    return map;
  }, [tasks]);

  function handleDragStart(e: DragStartEvent) {
    const task = e.active.data.current?.task as Task | undefined;
    if (task) setActiveTask(task);
  }

  function handleDragOver(e: DragOverEvent) {
    const overId = e.over?.id as string | undefined;
    if (!overId || !activeTask) return;
    // If hovering over a column header/drop zone (not a card)
    const isColumn = COLUMNS.some((c) => c.id === overId);
    if (isColumn && activeTask.status !== overId) {
      onStatusChange(activeTask.id, overId as Status);
      setActiveTask({ ...activeTask, status: overId as Status });
    }
  }

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over) { setActiveTask(null); return; }

    const overId = over.id as string;
    const activeId = active.id as string;

    const targetTask = tasks.find((t) => t.id === overId);
    const targetStatus: Status | undefined = targetTask?.status ?? (COLUMNS.find((c) => c.id === overId)?.id);

    if (targetStatus && activeTask && activeTask.status !== targetStatus) {
      onStatusChange(activeId, targetStatus);
    }
    setActiveTask(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 h-full overflow-x-auto pb-4 px-1">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            tasks={tasksByStatus[col.id]}
            onTaskClick={onTaskClick}
            onNewTask={() => onNewTask(col.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <KanbanCard task={activeTask} onClick={() => {}} isDragOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

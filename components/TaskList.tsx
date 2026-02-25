'use client';

import { Task } from '@/types';
import TaskCard from './TaskCard';

interface Props {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  loading?: boolean;
}

export default function TaskList({ tasks, onEdit, onDelete, onToggleStatus, loading }: Props) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No tasks found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Add a new task or adjust your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
}

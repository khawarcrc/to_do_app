export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Status = 'pending' | 'in-progress' | 'completed';
export type SortField = 'priority' | 'dueDate' | 'createdAt' | 'timeEstimate' | 'title';
export type SortDirection = 'asc' | 'desc';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  timeEstimate: number; // in minutes
  dueDate?: string; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  completedAt?: string; // ISO string
  tags?: string[];
  actualTime?: number; // in minutes
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  timeEstimate: number;
  dueDate?: string;
  tags?: string[];
}

export interface FilterState {
  priority: Priority | 'all';
  status: Status | 'all';
  search: string;
  dueDateFilter: 'all' | 'overdue' | 'today' | 'this-week' | 'no-date';
}

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  totalEstimatedTime: number;
  completedTime: number;
}

export const PRIORITY_CONFIG: Record<Priority, { label: string; emoji: string; color: string; bgColor: string; borderColor: string; darkColor: string; darkBgColor: string }> = {
  critical: {
    label: 'Critical',
    emoji: '🔴',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    darkColor: 'dark:text-red-300',
    darkBgColor: 'dark:bg-red-900/30',
  },
  high: {
    label: 'High',
    emoji: '🟠',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300',
    darkColor: 'dark:text-orange-300',
    darkBgColor: 'dark:bg-orange-900/30',
  },
  medium: {
    label: 'Medium',
    emoji: '🟡',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300',
    darkColor: 'dark:text-yellow-300',
    darkBgColor: 'dark:bg-yellow-900/30',
  },
  low: {
    label: 'Low',
    emoji: '🔵',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    darkColor: 'dark:text-blue-300',
    darkBgColor: 'dark:bg-blue-900/30',
  },
};

export const STATUS_CONFIG: Record<Status, { label: string; color: string; bgColor: string; darkColor: string; darkBgColor: string }> = {
  pending: {
    label: 'Pending',
    color: 'text-slate-700',
    bgColor: 'bg-slate-100',
    darkColor: 'dark:text-slate-300',
    darkBgColor: 'dark:bg-slate-700',
  },
  'in-progress': {
    label: 'In Progress',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-100',
    darkColor: 'dark:text-indigo-300',
    darkBgColor: 'dark:bg-indigo-900/30',
  },
  completed: {
    label: 'Completed',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
    darkColor: 'dark:text-emerald-300',
    darkBgColor: 'dark:bg-emerald-900/30',
  },
};

export const PRIORITY_ORDER: Record<Priority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

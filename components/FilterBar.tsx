'use client';

import { FilterState, SortState, SortField, SortDirection } from '@/types';

interface Props {
  filter: FilterState;
  sort: SortState;
  onFilterChange: (f: Partial<FilterState>) => void;
  onSortChange: (s: Partial<SortState>) => void;
  taskCount: number;
}

const SELECT_CLASS =
  'px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500';

export default function FilterBar({ filter, sort, onFilterChange, onSortChange, taskCount }: Props) {
  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search tasks..."
          value={filter.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600
            bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200
            placeholder-slate-400 dark:placeholder-slate-500
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-2 items-center">
        <select
          value={filter.priority}
          onChange={(e) => onFilterChange({ priority: e.target.value as FilterState['priority'] })}
          className={SELECT_CLASS}
        >
          <option value="all">All Priorities</option>
          <option value="critical">🔴 Critical</option>
          <option value="high">🟠 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🔵 Low</option>
        </select>

        <select
          value={filter.status}
          onChange={(e) => onFilterChange({ status: e.target.value as FilterState['status'] })}
          className={SELECT_CLASS}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={filter.dueDateFilter}
          onChange={(e) => onFilterChange({ dueDateFilter: e.target.value as FilterState['dueDateFilter'] })}
          className={SELECT_CLASS}
        >
          <option value="all">All Dates</option>
          <option value="overdue">Overdue</option>
          <option value="today">Due Today</option>
          <option value="this-week">Due This Week</option>
          <option value="no-date">No Due Date</option>
        </select>

        {/* Sort */}
        <div className="flex items-center gap-1 ml-auto">
          <select
            value={sort.field}
            onChange={(e) => onSortChange({ field: e.target.value as SortField })}
            className={SELECT_CLASS}
          >
            <option value="priority">Sort: Priority</option>
            <option value="dueDate">Sort: Due Date</option>
            <option value="createdAt">Sort: Created</option>
            <option value="timeEstimate">Sort: Time</option>
            <option value="title">Sort: Title</option>
          </select>
          <button
            onClick={() => onSortChange({ direction: sort.direction === 'asc' ? 'desc' : 'asc' })}
            title={`Sort ${sort.direction === 'asc' ? 'descending' : 'ascending'}`}
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-600
              bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300
              hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            {sort.direction === 'asc' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        {taskCount} task{taskCount !== 1 ? 's' : ''} shown
      </p>
    </div>
  );
}

'use client';

import { FilterState, TaskStats } from '@/types';
import { formatMinutes } from '@/utils';

interface Props {
  open: boolean;
  filter: FilterState;
  onFilterChange: (f: Partial<FilterState>) => void;
  stats: TaskStats;
  allTags: string[];
  onNewTask: () => void;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  priority?: FilterState['priority'];
  status?: FilterState['status'];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'All Tasks',
    priority: 'all',
    status: 'all',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    label: 'In Progress',
    priority: 'all',
    status: 'in-progress',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    label: 'Completed',
    priority: 'all',
    status: 'completed',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Overdue',
    priority: 'all',
    status: 'all',
    icon: (
      <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const PRIORITY_ITEMS = [
  { label: 'Critical', value: 'critical' as const, emoji: '🔴', color: 'text-red-500' },
  { label: 'High',     value: 'high'     as const, emoji: '🟠', color: 'text-orange-500' },
  { label: 'Medium',   value: 'medium'   as const, emoji: '🟡', color: 'text-yellow-500' },
  { label: 'Low',      value: 'low'      as const, emoji: '🔵', color: 'text-blue-500' },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
      {children}
    </p>
  );
}

function NavButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`group w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
        active
          ? 'bg-[var(--accent-subtle)] text-[var(--accent)] font-medium'
          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
      }`}
    >
      <span className={active ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'}>
        {icon}
      </span>
      <span className="flex-1 text-left">{label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center ${
            active ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-hover)] text-[var(--text-muted)]'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export default function Sidebar({ open, filter, onFilterChange, stats, allTags, onNewTask }: Props) {
  const completionPct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const isNavActive = (item: NavItem) =>
    filter.priority === (item.priority ?? 'all') && filter.status === (item.status ?? 'all');

  return (
    <aside
      className={`flex flex-col h-full border-r overflow-hidden transition-all duration-300 ease-in-out shrink-0`}
      style={{
        width: open ? '224px' : '0px',
        minWidth: open ? '224px' : '0px',
        backgroundColor: 'var(--sidebar-bg)',
        borderColor: 'var(--sidebar-border)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      <div className="flex flex-col gap-5 py-3 px-1 overflow-y-auto flex-1 w-56">
        {/* New task shortcut */}
        <button
          onClick={onNewTask}
          className="mx-2 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border-2 border-dashed
            text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>

        {/* Navigation */}
        <div>
          <SectionLabel>Views</SectionLabel>
          <div className="space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <NavButton
                key={item.label}
                active={isNavActive(item)}
                onClick={() => {
                  onFilterChange({
                    priority: item.priority ?? 'all',
                    status: item.status ?? 'all',
                    dueDateFilter: item.label === 'Overdue' ? 'overdue' : 'all',
                  });
                }}
                icon={item.icon}
                label={item.label}
                count={
                  item.label === 'All Tasks'     ? stats.total :
                  item.label === 'In Progress'   ? stats.inProgress :
                  item.label === 'Completed'     ? stats.completed :
                  item.label === 'Overdue'       ? stats.overdue :
                  undefined
                }
              />
            ))}
          </div>
        </div>

        {/* Priority filter */}
        <div>
          <SectionLabel>Priority</SectionLabel>
          <div className="space-y-0.5">
            {PRIORITY_ITEMS.map((p) => (
              <NavButton
                key={p.value}
                active={filter.priority === p.value && filter.status === 'all'}
                onClick={() => onFilterChange({ priority: p.value, status: 'all', dueDateFilter: 'all' })}
                icon={<span className="text-sm">{p.emoji}</span>}
                label={p.label}
                count={
                  p.value === 'critical' ? stats.criticalCount :
                  p.value === 'high'     ? stats.highCount :
                  p.value === 'medium'   ? stats.mediumCount :
                  stats.lowCount
                }
              />
            ))}
          </div>
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div>
            <SectionLabel>Tags</SectionLabel>
            <div className="space-y-0.5">
              {allTags.slice(0, 10).map((tag) => (
                <NavButton
                  key={tag}
                  active={filter.search === `#${tag}` || filter.search === tag}
                  onClick={() =>
                    onFilterChange({ search: filter.search === tag ? '' : tag, priority: 'all', status: 'all' })
                  }
                  icon={
                    <span className="text-[var(--text-muted)]">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </span>
                  }
                  label={tag}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div
        className="border-t px-3 py-3 shrink-0"
        style={{ borderColor: 'var(--border-default)' }}
      >
        <div className="flex justify-between text-[11px] text-[var(--text-muted)] mb-1.5">
          <span>{stats.completed}/{stats.total} done</span>
          <span>{completionPct}%</span>
        </div>
        <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-default)' }}>
          <div
            className="h-1 rounded-full transition-all duration-500"
            style={{ width: `${completionPct}%`, backgroundColor: '#22c55e' }}
          />
        </div>
        {stats.totalEstimatedTime > 0 && (
          <p className="mt-1.5 text-[11px] text-[var(--text-muted)] text-center">
            {formatMinutes(stats.totalEstimatedTime)} estimated
          </p>
        )}
      </div>
    </aside>
  );
}

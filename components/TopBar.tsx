'use client';

import { ViewType } from '@/types';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuthStore } from '@/store/authStore';

interface Props {
  view: ViewType;
  onViewChange: (v: ViewType) => void;
  onNewTask: () => void;
  onCommandPalette: () => void;
  onSidebarToggle: () => void;
  sidebarOpen: boolean;
}

const VIEWS: { id: ViewType; label: string; icon: React.ReactNode }[] = [
  {
    id: 'kanban',
    label: 'Board',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
  },
  {
    id: 'list',
    label: 'List',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function TopBar({ view, onViewChange, onNewTask, onCommandPalette, onSidebarToggle, sidebarOpen }: Props) {
  const { user, logout } = useAuthStore();
  return (
    <header
      className="flex items-center gap-3 px-4 h-14 border-b shrink-0 z-30"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-default)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Sidebar toggle */}
      <button
        onClick={onSidebarToggle}
        title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        className="p-1.5 rounded-md transition-colors hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
      >
        {sidebarOpen ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        )}
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 mr-2">
        <div className="w-6 h-6 rounded-md bg-[var(--accent)] flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="font-semibold text-sm text-[var(--text-primary)] hidden sm:block">TodoFlow</span>
      </div>

      {/* View switcher */}
      <div
        className="flex items-center gap-0.5 p-1 rounded-lg"
        style={{ backgroundColor: 'var(--bg-base)' }}
      >
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => onViewChange(v.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              view === v.id
                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            {v.icon}
            <span className="hidden sm:inline">{v.label}</span>
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Command palette */}
      <button
        onClick={onCommandPalette}
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs
          text-[var(--text-muted)] border transition-colors
          hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
        style={{ borderColor: 'var(--border-default)' }}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Search...</span>
        <kbd className="ml-1 px-1 py-0.5 text-[10px] rounded bg-[var(--bg-base)] border" style={{ borderColor: 'var(--border-default)' }}>
          ⌘K
        </kbd>
      </button>

      {/* New task */}
      <button
        onClick={onNewTask}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
          text-white transition-all hover:brightness-110 active:scale-95 shadow-sm"
        style={{ backgroundColor: 'var(--accent)' }}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
        <span className="hidden sm:inline">New Task</span>
      </button>

      <ThemeToggle />

      {/* User + Logout */}
      {user && (
        <div className="flex items-center gap-2 pl-1 border-l" style={{ borderColor: 'var(--border-default)' }}>
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
              style={{ background: 'var(--accent)' }}
            >
              {user.email[0].toUpperCase()}
            </div>
            <span className="max-w-[120px] truncate">{user.email}</span>
          </div>
          <button
            onClick={() => logout()}
            title="Sign out"
            className="p-1.5 rounded-md transition-colors hover:bg-[var(--bg-hover)]"
            style={{ color: 'var(--text-muted)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      )}
    </header>
  );
}

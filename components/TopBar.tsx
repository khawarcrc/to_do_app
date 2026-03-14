'use client';

import { ViewType } from '@/types';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

const STATIC_PAGES = [
  {
    label: 'Frontend Interview Guide',
    href: '/static/frontend-interview-guide',
    description: '30 Q&A — React, Next.js & Web Fundamentals',
  },
  {
    label: 'Advanced React & Next.js',
    href: '/static/advanced-react-nextjs-interview',
    description: '20 Advanced Q&A — Internals, Architecture & System Design',
  },
  {
    label: 'Backend Interview Guide',
    href: '/static/backend-interview-guide',
    description: '30 Q&A — APIs, Databases, Auth, Architecture & Security',
  },
];

const STUDY_GUIDE_PAGES = [
  {
    label: 'AI Engineering Roadmap',
    href: '/static/ai-engineering-roadmap',
  },
  {
    label: 'Docker & Containerization',
    href: '/static/docker-containerization-guide',
  },
  {
    label: 'Two-Path AI & Data Roadmap',
    href: '/static/two-path-roadmap',
  },
];


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
  const [staticOpen, setStaticOpen] = useState(false);
  const staticRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const [studyGuideOpen, setStudyGuideOpen] = useState(false);
  const studyGuideRef = useRef<HTMLDivElement>(null);
  const studyGuideBtnRef = useRef<HTMLButtonElement>(null);
  const [studyGuideDropdownPos, setStudyGuideDropdownPos] = useState({ top: 0, left: 0 });

  function openDropdown() {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 4, left: rect.left });
    }
    setStudyGuideOpen(false);
    setStaticOpen((o) => !o);
  }

  function openStudyGuideDropdown() {
    if (studyGuideBtnRef.current) {
      const rect = studyGuideBtnRef.current.getBoundingClientRect();
      setStudyGuideDropdownPos({ top: rect.bottom + 4, left: rect.left });
    }
    setStaticOpen(false);
    setStudyGuideOpen((o) => !o);
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (staticRef.current && !staticRef.current.contains(e.target as Node)) {
        setStaticOpen(false);
      }
      if (studyGuideRef.current && !studyGuideRef.current.contains(e.target as Node)) {
        setStudyGuideOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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
        className="p-1.5 rounded-md transition-colors hover:bg-(--bg-hover) text-(--text-secondary)"
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
      <Link
        href="/"
        title="Back to Home"
        className="flex items-center gap-2 mr-2 no-underline hover:opacity-80 transition-opacity"
      >
        <div className="w-6 h-6 rounded-md bg-(--accent) flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="font-semibold text-sm text-foreground hidden sm:block">TodoFlow</span>
      </Link>

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
                ? 'bg-(--bg-surface) text-foreground shadow-sm'
                : 'text-(--text-secondary) hover:text-foreground hover:bg-(--bg-hover)'
            }`}
          >
            {v.icon}
            <span className="hidden sm:inline">{v.label}</span>
          </button>
        ))}
      </div>

      {/* Study Guide dropdown */}
      <div ref={studyGuideRef} className="relative">
        <button
          ref={studyGuideBtnRef}
          onClick={openStudyGuideDropdown}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            studyGuideOpen
              ? 'bg-(--bg-hover) text-foreground'
              : 'text-(--text-secondary) hover:bg-(--bg-hover) hover:text-foreground'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="hidden sm:inline">Study Guide</span>
          <svg className={`w-3 h-3 transition-transform ${studyGuideOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {studyGuideOpen && (
          <div
            className="fixed w-72 rounded-lg border z-9999"
            style={{
              top: studyGuideDropdownPos.top,
              left: studyGuideDropdownPos.left,
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-default)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
            }}
          >
            <div
              className="px-3 py-2"
              style={{ borderBottom: '1px solid var(--border-default)' }}
            >
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', margin: 0 }}>
                Study Guides
              </p>
            </div>
            {STUDY_GUIDE_PAGES.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                onClick={() => setStudyGuideOpen(false)}
                style={{ display: 'block', padding: '7px 12px', textDecoration: 'none' }}
                className="hover:bg-(--bg-hover)"
              >
                <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {page.label}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Static Pages dropdown */}
      <div ref={staticRef} className="relative">
        <button
          ref={btnRef}
          onClick={openDropdown}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            staticOpen
              ? 'bg-(--bg-hover) text-foreground'
              : 'text-(--text-secondary) hover:bg-(--bg-hover) hover:text-foreground'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="hidden sm:inline">Static</span>
          <svg className={`w-3 h-3 transition-transform ${staticOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {staticOpen && (
          <div
            className="fixed w-72 rounded-lg border z-9999"
            style={{
              top: dropdownPos.top,
              left: dropdownPos.left,
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-default)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
            }}
          >
            <div
              className="px-3 py-2"
              style={{ borderBottom: '1px solid var(--border-default)' }}
            >
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', margin: 0 }}>
                Static Pages
              </p>
            </div>
            {STATIC_PAGES.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                onClick={() => setStaticOpen(false)}
                style={{ display: 'block', padding: '10px 12px', textDecoration: 'none' }}
                className="hover:bg-(--bg-hover)"
              >
                <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                  {page.label}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  {page.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Command palette */}
      <button
        onClick={onCommandPalette}
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs
          text-(--text-muted) border transition-colors
          hover:text-(--text-secondary) hover:bg-(--bg-hover)"
        style={{ borderColor: 'var(--border-default)' }}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Search...</span>
        <kbd className="ml-1 px-1 py-0.5 text-[10px] rounded bg-background border" style={{ borderColor: 'var(--border-default)' }}>
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
        <div className="flex items-center gap-1 pl-1 border-l" style={{ borderColor: 'var(--border-default)' }}>
          {/* Avatar — links to profile */}
          <Link
            href="/profile"
            title="My profile"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs
              transition-colors hover:bg-(--bg-hover)"
            style={{ color: 'var(--text-muted)' }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
              style={{ background: 'var(--accent)' }}
            >
              {user.email[0].toUpperCase()}
            </div>
            <span className="max-w-30 truncate">{user.email}</span>
          </Link>
          {/* Mobile — icon only */}
          <Link
            href="/profile"
            title="My profile"
            className="sm:hidden p-1.5 rounded-md transition-colors hover:bg-(--bg-hover)"
            style={{ color: 'var(--text-muted)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
          {/* Logout */}
          <button
            onClick={() => logout()}
            title="Sign out"
            className="p-1.5 rounded-md transition-colors hover:bg-(--bg-hover)"
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

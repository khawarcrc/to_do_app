'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import ThemeToggle from '@/components/ThemeToggle';

const STUDY_GUIDES = [
  { label: 'AI Engineering Roadmap', href: '/static/ai-engineering-roadmap' },
  { label: 'Docker & Containerization', href: '/static/docker-containerization-guide' },
  { label: 'Two-Path AI & Data Roadmap', href: '/static/two-path-roadmap' },
];

const INTERVIEW_GUIDES = [
  { label: 'Frontend Interview Guide', href: '/static/frontend-interview-guide' },
  { label: 'Advanced React & Next.js', href: '/static/advanced-react-nextjs-interview' },
  { label: 'Backend Interview Guide', href: '/static/backend-interview-guide' },
];

export default function StaticNavBar() {
  const pathname = usePathname();
  const [studyOpen, setStudyOpen] = useState(false);
  const [interviewOpen, setInterviewOpen] = useState(false);
  const studyRef = useRef<HTMLDivElement>(null);
  const interviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (studyRef.current && !studyRef.current.contains(e.target as Node)) setStudyOpen(false);
      if (interviewRef.current && !interviewRef.current.contains(e.target as Node)) setInterviewOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 flex items-center gap-1 px-4 h-12 border-b shrink-0"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-default)',
      }}
    >
      {/* Home link */}
      <Link
        href="/"
        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold mr-2 hover:opacity-80 transition-opacity"
        style={{ color: 'var(--accent)' }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
        </svg>
        <span className="hidden sm:inline">Home</span>
      </Link>

      {/* Task Manager link */}
      <Link
        href="/app"
        className="px-2 py-1 rounded-md text-xs font-medium transition-colors hover:bg-[var(--bg-hover)]"
        style={{ color: 'var(--text-secondary)' }}
      >
        Task Manager
      </Link>

      {/* Study Guide dropdown */}
      <div ref={studyRef} className="relative">
        <button
          onClick={() => { setStudyOpen(v => !v); setInterviewOpen(false); }}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
            studyOpen ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]'
          }`}
          style={{ color: 'var(--text-secondary)' }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="hidden sm:inline">Study Guide</span>
          <svg className={`w-3 h-3 transition-transform ${studyOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {studyOpen && (
          <div
            className="absolute top-full left-0 mt-1 w-60 rounded-lg border py-1 shadow-lg"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
          >
            {STUDY_GUIDES.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                onClick={() => setStudyOpen(false)}
                className="block px-3 py-1.5 text-[13px] font-medium truncate hover:bg-[var(--bg-hover)] transition-colors"
                style={{ color: pathname === p.href ? 'var(--accent)' : 'var(--text-primary)' }}
              >
                {p.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Interview Guides dropdown */}
      <div ref={interviewRef} className="relative">
        <button
          onClick={() => { setInterviewOpen(v => !v); setStudyOpen(false); }}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
            interviewOpen ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]'
          }`}
          style={{ color: 'var(--text-secondary)' }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="hidden sm:inline">Interview Guides</span>
          <svg className={`w-3 h-3 transition-transform ${interviewOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {interviewOpen && (
          <div
            className="absolute top-full left-0 mt-1 w-60 rounded-lg border py-1 shadow-lg"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
          >
            {INTERVIEW_GUIDES.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                onClick={() => setInterviewOpen(false)}
                className="block px-3 py-1.5 text-[13px] font-medium truncate hover:bg-[var(--bg-hover)] transition-colors"
                style={{ color: pathname === p.href ? 'var(--accent)' : 'var(--text-primary)' }}
              >
                {p.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Spacer + theme toggle */}
      <div className="flex-1" />
      <ThemeToggle />
    </nav>
  );
}

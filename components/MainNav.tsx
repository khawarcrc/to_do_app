'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import ThemeToggle from '@/components/ThemeToggle';

/* ── Helper ── */
function getDisplayName(email: string) {
  return email.split('@')[0];
}

/* ── Nav link data ── */
const INTERVIEW_LINKS = [
  { label: 'Frontend Interview Guide', href: '/static/frontend-interview-guide', description: '30 Q&A — React, Next.js & Web Fundamentals' },
  { label: 'Advanced React & Next.js', href: '/static/advanced-react-nextjs-interview', description: '20 Advanced Q&A — Internals, Architecture & System Design' },
  { label: 'Backend Interview Guide', href: '/static/backend-interview-guide', description: '30 Q&A — APIs, Databases, Auth, Architecture & Security' },
];

const STUDY_GUIDE_LINKS = [
  { label: 'AI Engineering Roadmap', href: '/static/ai-engineering-roadmap', description: '7-Phase · 1-Month Sprint to Job-Ready AI/ML Engineering' },
  { label: 'Docker & Containerization', href: '/static/docker-containerization-guide', description: '35 Q&A · 12 Scenarios · Source of Truth for DevOps Engineers' },
  { label: 'Two-Path AI & Data Roadmap', href: '/static/two-path-roadmap', description: 'Data Domain vs AI Engineering — Structured Career Guide' },
];

const DYNAMIC_LINKS = [
  {
    label: 'Task Manager', href: '/app', description: 'Kanban, list & calendar views',
    color: '#0c66e4', bg: 'rgba(12,102,228,0.08)',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  },
  {
    label: 'Quotes & Insights', href: '/quotes', description: 'Daily wisdom, life lessons',
    color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
  },
  {
    label: 'BackLog', href: '/backlog', description: 'Quick tasks, drag to reorder',
    color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
  },
];

/* ── Dropdown component ── */
function NavDropdown({ label, badge, children, open, onToggle, onClose }: {
  label: string; badge?: string; children: React.ReactNode;
  open: boolean; onToggle: () => void; onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open, onClose]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '6px 12px', borderRadius: '8px', border: 'none',
          backgroundColor: open ? 'var(--bg-hover)' : 'transparent',
          color: open ? 'var(--text-primary)' : 'var(--text-secondary)',
          fontSize: '13.5px', fontWeight: 500, cursor: 'pointer',
          transition: 'all 0.15s', whiteSpace: 'nowrap',
        }}
      >
        {label}
        {badge && (
          <span style={{
            fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '100px',
            backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)',
          }}>
            {badge}
          </span>
        )}
        <svg style={{ width: '12px', height: '12px', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, minWidth: '220px',
          backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)',
          borderRadius: '12px', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', zIndex: 100,
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MainNav — universal 64px navbar used across all pages
   ═══════════════════════════════════════════════════════════ */
export default function MainNav() {
  const pathname = usePathname();
  const { user, logout, setUser, setInitialising } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [studyGuideOpen, setStudyGuideOpen] = useState(false);
  const [dynamicOpen, setDynamicOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.email)
          setUser({ email: data.email, sid: data.sid ?? '', createdAt: data.createdAt });
      })
      .finally(() => setInitialising(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  const displayName = user?.email ? getDisplayName(user.email) : '';

  return (
    <>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(1rem, 4vw, 3rem)', height: '64px',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(12px)',
        backgroundColor: 'var(--bg-base)',
        position: 'sticky', top: 0, zIndex: 50, gap: '16px',
      }}>
        {/* ── Logo ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'var(--accent)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em' }}>TodoFlow</span>
          </Link>
        </div>

        {/* ── Desktop nav items ── */}
        <div className="hidden sm:flex" style={{ alignItems: 'center', gap: '4px', flex: 1 }}>
          {/* Interview Guides dropdown */}
          <NavDropdown
            label="Static"
            open={interviewOpen}
            onToggle={() => { setInterviewOpen(p => !p); setStudyGuideOpen(false); setDynamicOpen(false); }}
            onClose={() => setInterviewOpen(false)}
          >
            {INTERVIEW_LINKS.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setInterviewOpen(false)}
                style={{ display: 'block', padding: '10px 14px', textDecoration: 'none', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: pathname === item.href ? 'var(--accent)' : 'var(--text-primary)' }}>{item.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.description}</div>
              </Link>
            ))}
          </NavDropdown>

          {/* Study Guide dropdown */}
          <NavDropdown
            label="Study Guide"
            badge={`${STUDY_GUIDE_LINKS.length}`}
            open={studyGuideOpen}
            onToggle={() => { setStudyGuideOpen(p => !p); setInterviewOpen(false); setDynamicOpen(false); }}
            onClose={() => setStudyGuideOpen(false)}
          >
            {STUDY_GUIDE_LINKS.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setStudyGuideOpen(false)}
                style={{ display: 'block', padding: '7px 14px', textDecoration: 'none', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: pathname === item.href ? 'var(--accent)' : 'var(--text-primary)' }}>{item.label}</div>
              </Link>
            ))}
          </NavDropdown>

          {/* Dynamic dropdown */}
          <NavDropdown
            label="Dynamic"
            badge={`${DYNAMIC_LINKS.length}`}
            open={dynamicOpen}
            onToggle={() => { setDynamicOpen(p => !p); setInterviewOpen(false); setStudyGuideOpen(false); }}
            onClose={() => setDynamicOpen(false)}
          >
            <div style={{ padding: '6px' }}>
              {DYNAMIC_LINKS.map((item, i) => (
                <Link key={item.href} href={item.href} onClick={() => setDynamicOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    padding: '10px', borderRadius: '8px', textDecoration: 'none',
                    transition: 'background 0.13s',
                    marginBottom: i < DYNAMIC_LINKS.length - 1 ? '2px' : 0,
                    backgroundColor: pathname === item.href ? 'var(--bg-hover)' : 'transparent',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = pathname === item.href ? 'var(--bg-hover)' : 'transparent')}
                >
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    backgroundColor: item.bg, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: item.color, flexShrink: 0,
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </NavDropdown>
        </div>

        {/* ── Right side: desktop ── */}
        <div className="hidden sm:flex" style={{ alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <ThemeToggle />
          {mounted && user?.email ? (
            <>
              <Link href="/profile" style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 10px', borderRadius: '8px',
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)',
                fontSize: '13px', fontWeight: 500, textDecoration: 'none',
              }}>
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%',
                  background: 'var(--accent)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
                {displayName}
              </Link>
              <button onClick={() => void logout()} style={{
                padding: '6px 14px', borderRadius: '8px',
                border: '1px solid var(--border-default)',
                backgroundColor: 'transparent', color: 'var(--text-muted)',
                fontSize: '13px', fontWeight: 500, cursor: 'pointer',
              }}>
                Sign out
              </button>
            </>
          ) : mounted ? (
            <Link href="/login" style={{
              padding: '6px 16px', borderRadius: '8px',
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--accent)', color: '#fff',
              fontSize: '13px', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap',
            }}>
              Sign in
            </Link>
          ) : null}
        </div>

        {/* ── Right side: mobile ── */}
        <div className="flex sm:hidden" style={{ alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <ThemeToggle />
          <button onClick={() => setMobileMenuOpen(p => !p)} aria-label="Toggle menu"
            style={{
              width: '36px', height: '36px', borderRadius: '8px',
              border: '1px solid var(--border-default)',
              backgroundColor: mobileMenuOpen ? 'var(--bg-hover)' : 'transparent',
              color: 'var(--text-secondary)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* ── Mobile slide-down menu ── */}
      {mobileMenuOpen && (
        <div className="sm:hidden" style={{
          position: 'sticky', top: '64px', zIndex: 49,
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-md)',
          padding: '12px 16px 16px',
          display: 'flex', flexDirection: 'column', gap: '4px',
        }}>
          {/* Static section */}
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '6px 8px 4px' }}>Static</div>
          {INTERVIEW_LINKS.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}
              style={{ display: 'block', padding: '10px', borderRadius: '8px', textDecoration: 'none', color: pathname === item.href ? 'var(--accent)' : 'var(--text-primary)', fontSize: '14px', fontWeight: 500 }}>
              {item.label}
            </Link>
          ))}

          <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '6px 0' }} />

          {/* Study Guide section */}
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '2px 8px 4px' }}>Study Guide</div>
          {STUDY_GUIDE_LINKS.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}
              style={{ display: 'block', padding: '10px', borderRadius: '8px', textDecoration: 'none', color: pathname === item.href ? 'var(--accent)' : 'var(--text-primary)', fontSize: '14px', fontWeight: 500 }}>
              {item.label}
            </Link>
          ))}

          <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '6px 0' }} />

          {/* Dynamic section */}
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '2px 8px 4px' }}>Dynamic</div>
          {DYNAMIC_LINKS.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', textDecoration: 'none' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, flexShrink: 0 }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: pathname === item.href ? 'var(--accent)' : 'var(--text-primary)' }}>{item.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.description}</div>
              </div>
            </Link>
          ))}

          <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '6px 0' }} />

          {/* Auth section */}
          {mounted && user?.email ? (
            <>
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', textDecoration: 'none' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Profile</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.email}</div>
                </div>
              </Link>
              <button onClick={() => { setMobileMenuOpen(false); void logout(); }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg className="w-4 h-4" style={{ color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#ef4444' }}>Sign out</div>
              </button>
            </>
          ) : mounted ? (
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', textDecoration: 'none', backgroundColor: 'var(--accent)', justifyContent: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>Sign in</div>
            </Link>
          ) : null}
        </div>
      )}
    </>
  );
}

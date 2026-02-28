'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Session {
  sid: string;
  device: string;
  ip: string;
  createdAt: string;
  lastSeen: string;
  isCurrent: boolean;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

// ── Device icon ───────────────────────────────────────────────────────────────
function DeviceIcon({ device }: { device: string }) {
  const isMobile = /iPhone|iPad|Android/.test(device);
  return isMobile ? (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ) : (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

// ── Password change form ──────────────────────────────────────────────────────
function ChangePasswordForm() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (next !== confirm) { setStatus('error'); setMsg('New passwords do not match'); return; }
    setStatus('loading'); setMsg('');
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json();
      if (!res.ok) { setStatus('error'); setMsg(data.error ?? 'Failed'); return; }
      setStatus('success');
      setMsg('Password updated successfully.');
      setCurrent(''); setNext(''); setConfirm('');
    } catch {
      setStatus('error');
      setMsg('Network error. Please try again.');
    }
  }

  return (
    <div
      className="rounded-xl border p-6"
      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
    >
      <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        Change Password
      </h2>

      {status === 'success' && (
        <div className="rounded-lg px-4 py-3 mb-4 text-sm border"
          style={{ background: '#1a3b1a', borderColor: '#2d6a2d', color: '#4ade80' }}>
          {msg}
        </div>
      )}
      {status === 'error' && (
        <div className="rounded-lg px-4 py-3 mb-4 text-sm border"
          style={{ background: '#3b1a1a', borderColor: '#7f2929', color: '#f87171' }}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'Current Password', value: current, onChange: setCurrent, autoComplete: 'current-password' },
          { label: 'New Password',     value: next,    onChange: setNext,    autoComplete: 'new-password' },
          { label: 'Confirm New Password', value: confirm, onChange: setConfirm, autoComplete: 'new-password' },
        ].map(({ label, value, onChange, autoComplete }) => (
          <div key={label}>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              {label}
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required
                minLength={label.includes('New') ? 8 : 1}
                autoComplete={autoComplete}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all pr-10"
                style={{
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
              />
              {label === 'Current Password' && (
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                  tabIndex={-1}
                >
                  {showPass ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all
            disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.99]"
          style={{ background: 'var(--accent)' }}
        >
          {status === 'loading' ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Updating…
            </span>
          ) : 'Update Password'}
        </button>
      </form>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [revokeAllLoading, setRevokeAllLoading] = useState(false);

  const loadSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const res = await fetch('/api/auth/sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions ?? []);
      }
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Redirect if not logged in
    fetch('/api/auth/me').then((r) => {
      if (!r.ok) router.replace('/login');
    });
    loadSessions();
  }, [router, loadSessions]);

  async function revokeSession(sid: string) {
    setRevokingId(sid);
    try {
      await fetch(`/api/auth/sessions/${sid}`, { method: 'DELETE' });
      setSessions((prev) => prev.filter((s) => s.sid !== sid));
    } finally {
      setRevokingId(null);
    }
  }

  async function revokeAllOthers() {
    setRevokeAllLoading(true);
    try {
      await fetch('/api/auth/sessions', { method: 'DELETE' });
      setSessions((prev) => prev.filter((s) => s.isCurrent));
    } finally {
      setRevokeAllLoading(false);
    }
  }

  const otherSessions = sessions.filter((s) => !s.isCurrent);

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      {/* Top bar */}
      <header
        className="flex items-center gap-3 px-6 h-14 border-b sticky top-0 z-30"
        style={{
          background: 'var(--bg-surface)',
          borderColor: 'var(--border-default)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 mr-auto"
          style={{ color: 'var(--text-secondary)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Back to app</span>
        </Link>

        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'var(--accent)' }}
          >
            {user?.email?.[0]?.toUpperCase() ?? '?'}
          </div>
          <span className="text-sm font-medium hidden sm:block" style={{ color: 'var(--text-primary)' }}>
            My Profile
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* ── Account info ── */}
        <div
          className="rounded-xl border p-6"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
        >
          <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Account
          </h2>
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0"
              style={{ background: 'var(--accent)' }}
            >
              {user?.email?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="min-w-0">
              <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                {user?.email ?? '—'}
              </p>
              {user?.createdAt && (
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Member since {formatDate(user.createdAt)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Change password ── */}
        <ChangePasswordForm />

        {/* ── Active sessions ── */}
        <div
          className="rounded-xl border p-6"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                Active Sessions
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {sessions.length} device{sessions.length !== 1 ? 's' : ''} logged in
              </p>
            </div>
            {otherSessions.length > 0 && (
              <button
                onClick={revokeAllOthers}
                disabled={revokeAllLoading}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors
                  hover:opacity-80 disabled:opacity-50"
                style={{
                  color: '#f87171',
                  borderColor: '#7f2929',
                  background: '#3b1a1a',
                }}
              >
                {revokeAllLoading ? 'Revoking…' : `Sign out ${otherSessions.length} other${otherSessions.length > 1 ? 's' : ''}`}
              </button>
            )}
          </div>

          {sessionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <svg className="w-5 h-5 animate-spin" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: 'var(--text-muted)' }}>
              No active sessions found
            </p>
          ) : (
            <div className="space-y-2">
              {sessions.map((s) => (
                <div
                  key={s.sid}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{
                    background: s.isCurrent ? 'var(--accent-subtle)' : 'var(--bg-subtle)',
                    border: `1px solid ${s.isCurrent ? 'var(--accent)' : 'var(--border-subtle)'}`,
                  }}
                >
                  <div style={{ color: s.isCurrent ? 'var(--accent)' : 'var(--text-muted)' }}>
                    <DeviceIcon device={s.device} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        {s.device}
                      </span>
                      {s.isCurrent && (
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                          style={{ background: 'var(--accent)', color: '#fff' }}
                        >
                          This device
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {s.ip} · Last seen {timeAgo(s.lastSeen)} · Signed in {formatDate(s.createdAt)}
                    </p>
                  </div>
                  {!s.isCurrent && (
                    <button
                      onClick={() => revokeSession(s.sid)}
                      disabled={revokingId === s.sid}
                      className="shrink-0 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors
                        hover:opacity-80 disabled:opacity-50"
                      style={{ color: '#f87171', background: '#3b1a1a' }}
                    >
                      {revokingId === s.sid ? '…' : 'Revoke'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Danger zone ── */}
        <div
          className="rounded-xl border p-6"
          style={{ background: 'var(--bg-surface)', borderColor: '#7f2929' }}
        >
          <h2 className="text-base font-semibold mb-1" style={{ color: '#f87171' }}>
            Sign Out
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            This will sign you out of this device and clear your session.
          </p>
          <button
            onClick={() => logout()}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors hover:opacity-80"
            style={{ background: '#3b1a1a', color: '#f87171', border: '1px solid #7f2929' }}
          >
            Sign out of this device
          </button>
        </div>

      </main>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'setup-required' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.status === 503 && data.setupRequired) {
        setStatus('setup-required');
        setMessage(data.error);
        return;
      }
      if (!res.ok) {
        setStatus('error');
        setMessage(data.error ?? 'Something went wrong');
        return;
      }
      setStatus('success');
      setMessage(data.message);
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
            style={{ background: 'var(--accent)' }}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>TodoFlow</span>
        </div>

        <div
          className="rounded-2xl p-8 border"
          style={{
            background: 'var(--bg-surface)',
            borderColor: 'var(--border-default)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Success state */}
          {status === 'success' ? (
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: '#1a3b1a', border: '1px solid #2d6a2d' }}
              >
                <svg className="w-6 h-6" style={{ color: '#4ade80' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Check your email
              </h1>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                {message}
              </p>
              <Link
                href="/login"
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                ← Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-5">
                <Link
                  href="/login"
                  className="p-1.5 rounded-lg transition-colors hover:opacity-70"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <div>
                  <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Reset password
                  </h1>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    We&apos;ll send a reset link to your email
                  </p>
                </div>
              </div>

              {/* Setup required banner */}
              {status === 'setup-required' && (
                <div
                  className="rounded-lg px-4 py-3 mb-4 text-sm border"
                  style={{ background: '#2a2000', borderColor: '#7a5500', color: '#fbbf24' }}
                >
                  <p className="font-medium mb-1">Email service not configured</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#d97706' }}>
                    Open <code className="font-mono bg-black/20 px-1 rounded">.env.local</code> and fill in{' '}
                    <code className="font-mono bg-black/20 px-1 rounded">GMAIL_USER</code> and{' '}
                    <code className="font-mono bg-black/20 px-1 rounded">GMAIL_APP_PASSWORD</code>{' '}
                    (create a Gmail App Password under Google Account → Security → App Passwords).
                  </p>
                </div>
              )}

              {status === 'error' && (
                <div
                  className="rounded-lg px-4 py-3 mb-4 text-sm border"
                  style={{ background: '#3b1a1a', borderColor: '#7f2929', color: '#f87171' }}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@gmail.com"
                    required
                    autoComplete="email"
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all"
                    style={{
                      background: 'var(--bg-base)',
                      border: '1px solid var(--border-default)',
                      color: 'var(--text-primary)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
                  />
                </div>

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
                        <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending…
                    </span>
                  ) : 'Send reset link'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

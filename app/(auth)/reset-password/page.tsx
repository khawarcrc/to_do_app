'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // If no token in URL, show error immediately
  const noToken = !token;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setErrorMsg('Passwords do not match');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data.error ?? 'Failed to reset password');
        return;
      }
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
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
          {/* No token */}
          {noToken ? (
            <div className="text-center">
              <h1 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Invalid link
              </h1>
              <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
                This password reset link is missing or invalid.
              </p>
              <Link
                href="/forgot-password"
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                Request a new link →
              </Link>
            </div>
          ) : status === 'success' ? (
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
                Password updated
              </h1>
              <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
                Your password has been reset successfully.
              </p>
              <Link
                href="/login"
                className="inline-block px-5 py-2 rounded-lg text-sm font-semibold text-white hover:brightness-110"
                style={{ background: 'var(--accent)' }}
              >
                Sign in now →
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                Create new password
              </h1>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                Choose a strong password for your account.
              </p>

              {errorMsg && (
                <div
                  className="rounded-lg px-4 py-3 mb-4 text-sm border"
                  style={{ background: '#3b1a1a', borderColor: '#7f2929', color: '#f87171' }}
                >
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all pr-10"
                      style={{
                        background: 'var(--bg-base)',
                        border: '1px solid var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
                    />
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
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Confirm Password
                  </label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat new password"
                    required
                    autoComplete="new-password"
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all"
                    style={{
                      background: 'var(--bg-base)',
                      border: `1px solid ${confirm && confirm !== password ? '#7f2929' : 'var(--border-default)'}`,
                      color: 'var(--text-primary)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = confirm !== password ? '#7f2929' : 'var(--accent)')}
                    onBlur={(e) => (e.target.style.borderColor = confirm && confirm !== password ? '#7f2929' : 'var(--border-default)')}
                  />
                  {confirm && confirm !== password && (
                    <p className="mt-1 text-xs" style={{ color: '#f87171' }}>Passwords do not match</p>
                  )}
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
                      Updating…
                    </span>
                  ) : 'Reset password'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm mt-5" style={{ color: 'var(--text-muted)' }}>
          <Link href="/login" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}

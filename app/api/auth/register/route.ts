import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, signToken } from '@/lib/auth';
import { findUserByEmail, createUser } from '@/lib/userModel';

// Only Gmail addresses allowed
const GMAIL_RE = /^[^\s@]+@gmail\.com$/i;

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
};

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json() as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    if (!GMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Only Gmail addresses (@gmail.com) are allowed' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const hashed = await hashPassword(password);
    await createUser(email, hashed);

    const token = await signToken({ email: email.toLowerCase() });
    const res = NextResponse.json({ success: true, email: email.toLowerCase() }, { status: 201 });
    res.cookies.set('auth-token', token, COOKIE_OPTS);
    return res;
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}

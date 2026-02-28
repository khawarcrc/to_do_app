import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import { findUserByResetToken, updateUserPassword } from '@/lib/userModel';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json() as { token?: string; password?: string };

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const user = await findUserByResetToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 });
    }

    const hashed = await hashPassword(password);
    await updateUserPassword(user.email, hashed);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Reset-password error:', err);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}

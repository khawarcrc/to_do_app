import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, saveResetToken } from '@/lib/userModel';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json() as { email?: string };

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await findUserByEmail(email);

    // Never reveal whether an account exists
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a reset link has been sent.',
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await saveResetToken(email, token, expiry);

    const host = req.headers.get('host') ?? 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const resetUrl = `${protocol}://${host}/reset-password?token=${token}`;

    try {
      await sendPasswordResetEmail(email, resetUrl);
    } catch (emailErr: unknown) {
      const msg = emailErr instanceof Error ? emailErr.message : '';
      if (msg === 'EMAIL_NOT_CONFIGURED') {
        return NextResponse.json({
          error:
            'Email service is not configured. ' +
            'Add your GMAIL_USER and GMAIL_APP_PASSWORD to .env.local ' +
            '(see the comments in that file for setup instructions).',
          setupRequired: true,
        }, { status: 503 });
      }
      throw emailErr;
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset link sent to your email.',
    });
  } catch (err) {
    console.error('Forgot-password error:', err);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { findUserByEmail } from '@/lib/userModel';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const payload = await verifyToken(token);
    const user = await findUserByEmail(payload.email);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 });
    return NextResponse.json({
      email: payload.email,
      sid: payload.sid,
      createdAt: user.createdAt,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
}

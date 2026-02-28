import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { deleteSession } from '@/lib/sessionModel';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (token) {
      const payload = await verifyToken(token).catch(() => null);
      if (payload?.sid) await deleteSession(payload.sid);
    }
  } catch { /* ignore */ }

  const res = NextResponse.json({ success: true });
  res.cookies.set('auth-token', '', { maxAge: 0, path: '/' });
  return res;
}

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
  getSessionsByEmail,
  deleteAllOtherSessions,
} from '@/lib/sessionModel';

// GET /api/auth/sessions — list all sessions for the logged-in user
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const payload = await verifyToken(token);
    const sessions = await getSessionsByEmail(payload.email);

    // Mark which one is the current session
    return NextResponse.json({
      sessions: sessions.map((s) => ({
        sid: s.sid,
        device: s.device,
        ip: s.ip,
        createdAt: s.createdAt,
        lastSeen: s.lastSeen,
        isCurrent: s.sid === payload.sid,
      })),
    });
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
}

// DELETE /api/auth/sessions — revoke all OTHER sessions (keep current)
export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const payload = await verifyToken(token);
    await deleteAllOtherSessions(payload.email, payload.sid);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
}

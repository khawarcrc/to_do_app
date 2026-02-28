import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { deleteSession } from '@/lib/sessionModel';

// DELETE /api/auth/sessions/[sid] — revoke a specific session by its ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ sid: string }> }
) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const payload = await verifyToken(token);
    const { sid } = await params;

    // Cannot revoke your own current session via this endpoint (use /logout for that)
    if (sid === payload.sid) {
      return NextResponse.json({ error: 'Use logout to end your current session' }, { status: 400 });
    }

    await deleteSession(sid);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
}

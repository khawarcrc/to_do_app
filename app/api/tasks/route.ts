import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getTasksByEmail, createTaskForUser } from '@/lib/taskModel';
import { TaskFormData } from '@/types';

async function getEmailFromRequest(req: NextRequest): Promise<string | null> {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) return null;
    const payload = await verifyToken(token);
    return payload.email;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const email = await getEmailFromRequest(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const tasks = await getTasksByEmail(email);
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('GET /api/tasks error:', error);
    return NextResponse.json({ error: 'Failed to read tasks' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const email = await getEmailFromRequest(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = (await req.json()) as TaskFormData;
    const task = await createTaskForUser(email, body);
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create task';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

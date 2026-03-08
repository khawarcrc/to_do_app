import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
  getBacklogTasksByEmail,
  createBacklogTask,
  reorderBacklogTasks,
  TaskCategory,
} from '@/lib/backlogTaskModel';

async function getEmail(req: NextRequest): Promise<string | null> {
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
  const email = await getEmail(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const tasks = await getBacklogTasksByEmail(email);
    return NextResponse.json({ tasks });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const email = await getEmail(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { title, category } = await req.json() as { title: string; category?: TaskCategory };
    const task = await createBacklogTask(email, title, category);
    return NextResponse.json({ task }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to create task';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/** PATCH — bulk reorder: body = { orderedIds: string[] } */
export async function PATCH(req: NextRequest) {
  const email = await getEmail(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { orderedIds } = await req.json() as { orderedIds: string[] };
    await reorderBacklogTasks(email, orderedIds);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to reorder tasks' }, { status: 500 });
  }
}

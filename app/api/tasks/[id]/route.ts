import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
  getTaskByIdForUser,
  updateTaskForUser,
  deleteTaskForUser,
  toggleTaskStatusForUser,
} from '@/lib/taskModel';
import { TaskFormData } from '@/types';

interface Params {
  params: Promise<{ id: string }>;
}

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

export async function GET(req: NextRequest, { params }: Params) {
  const email = await getEmailFromRequest(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const task = await getTaskByIdForUser(id, email);
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    return NextResponse.json({ task });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get task';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const email = await getEmailFromRequest(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const body = (await req.json()) as Partial<TaskFormData>;
    const task = await updateTaskForUser(id, email, body);
    return NextResponse.json({ task });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update task';
    const status = message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const email = await getEmailFromRequest(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const task = await toggleTaskStatusForUser(id, email);
    return NextResponse.json({ task });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to toggle task';
    const status = message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const email = await getEmailFromRequest(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await deleteTaskForUser(id, email);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete task';
    const status = message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

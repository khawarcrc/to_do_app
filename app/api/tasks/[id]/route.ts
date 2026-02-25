import { NextRequest, NextResponse } from 'next/server';
import { getTaskById, updateTask, deleteTask, toggleTaskStatus } from '@/lib/taskStorage';
import { TaskFormData } from '@/types';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const task = getTaskById(id);
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    return NextResponse.json({ task });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get task';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Partial<TaskFormData>;
    const task = await updateTask(id, body);
    return NextResponse.json({ task });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update task';
    const status = message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const task = await toggleTaskStatus(id);
    return NextResponse.json({ task });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to toggle task';
    const status = message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await deleteTask(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete task';
    const status = message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

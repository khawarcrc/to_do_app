import { NextRequest, NextResponse } from 'next/server';
import { readTasks, createTask } from '@/lib/taskStorage';
import { TaskFormData } from '@/types';

export async function GET() {
  try {
    const tasks = readTasks();
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('GET /api/tasks error:', error);
    return NextResponse.json({ error: 'Failed to read tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TaskFormData;
    const task = await createTask(body);
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create task';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

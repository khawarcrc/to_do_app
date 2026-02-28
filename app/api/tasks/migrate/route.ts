/**
 * POST /api/tasks/migrate
 *
 * One-time endpoint. Seeds all tasks from data/tasks.json into MongoDB
 * for the currently logged-in user.
 *
 * - Safe to call multiple times — duplicate tasks are skipped (upsert)
 * - Requires authentication
 * - Returns how many new tasks were inserted
 */
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { bulkUpsertTasksForUser } from '@/lib/taskModel';
import path from 'path';
import fs from 'fs';
import { Task } from '@/types';

export async function POST(req: NextRequest) {
  // Disabled in production — migration is a local-only one-time operation
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  // Auth check
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);

    // Read tasks.json (still present in data/ folder)
    const filePath = path.join(process.cwd(), 'data', 'tasks.json');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'data/tasks.json not found' }, { status: 404 });
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw) as { tasks: Task[] };
    if (!Array.isArray(parsed.tasks)) {
      return NextResponse.json({ error: 'Invalid tasks.json format' }, { status: 400 });
    }

    const inserted = await bulkUpsertTasksForUser(payload.email, parsed.tasks);

    return NextResponse.json({
      success: true,
      total: parsed.tasks.length,
      inserted,
      skipped: parsed.tasks.length - inserted,
      email: payload.email,
      message: `Migration complete. ${inserted} new task(s) added to ${payload.email}.`,
    });
  } catch (err) {
    console.error('Migrate error:', err);
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
  }
}

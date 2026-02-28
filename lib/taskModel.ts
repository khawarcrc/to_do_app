import clientPromise from './mongodb';
import { Collection, Filter } from 'mongodb';
import { Task, TaskFormData } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const DB_NAME = 'todoflow';
const COLLECTION = 'tasks';

// ── Internal document type ────────────────────────────────────────────────────
// Same as Task but with an owner email field
export interface TaskDoc extends Task {
  email: string; // owner — always lowercase
}

async function getCollection(): Promise<Collection<TaskDoc>> {
  const client = await clientPromise;
  const col = client.db(DB_NAME).collection<TaskDoc>(COLLECTION);
  // Compound index: list all tasks for a user fast
  await col.createIndex({ email: 1, createdAt: -1 });
  // Unique per-user task id
  await col.createIndex({ email: 1, id: 1 }, { unique: true });
  return col;
}

// ── Validation (same rules as legacy taskStorage) ─────────────────────────────
function validateTask(data: TaskFormData): void {
  if (!data.title || data.title.trim().length === 0) throw new Error('Title is required');
  if (data.title.trim().length > 200) throw new Error('Title must be under 200 characters');
  if (!['low', 'medium', 'high', 'critical'].includes(data.priority)) throw new Error('Invalid priority');
  if (!['pending', 'in-progress', 'completed'].includes(data.status)) throw new Error('Invalid status');
  if (typeof data.timeEstimate !== 'number' || data.timeEstimate < 0) throw new Error('Time estimate must be a positive number');
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

export async function getTasksByEmail(email: string): Promise<Task[]> {
  const col = await getCollection();
  const docs = await col
    .find({ email: email.toLowerCase() } as Filter<TaskDoc>)
    .sort({ createdAt: -1 })
    .toArray();
  // Strip the internal `email` field before returning to client
  return docs.map(({ email: _e, _id, ...task }) => task as Task);
}

export async function getTaskByIdForUser(id: string, email: string): Promise<Task | null> {
  const col = await getCollection();
  const doc = await col.findOne({ id, email: email.toLowerCase() } as Filter<TaskDoc>);
  if (!doc) return null;
  const { email: _e, _id, ...task } = doc;
  return task as Task;
}

export async function createTaskForUser(email: string, data: TaskFormData): Promise<Task> {
  validateTask(data);
  const col = await getCollection();
  const now = new Date().toISOString();
  const task: Task = {
    id: uuidv4(),
    title: data.title.trim(),
    description: data.description?.trim(),
    priority: data.priority,
    status: data.status,
    timeEstimate: data.timeEstimate,
    dueDate: data.dueDate,
    tags: data.tags ?? [],
    subTasks: data.subTasks ?? [],
    createdAt: now,
    updatedAt: now,
  };
  await col.insertOne({ ...task, email: email.toLowerCase() } as TaskDoc);
  return task;
}

export async function updateTaskForUser(
  id: string,
  email: string,
  data: Partial<TaskFormData>
): Promise<Task> {
  const col = await getCollection();
  const existing = await col.findOne({ id, email: email.toLowerCase() } as Filter<TaskDoc>);
  if (!existing) throw new Error(`Task ${id} not found`);

  const merged: TaskFormData = {
    title: data.title ?? existing.title,
    description: data.description !== undefined ? data.description : existing.description,
    priority: data.priority ?? existing.priority,
    status: data.status ?? existing.status,
    timeEstimate: data.timeEstimate ?? existing.timeEstimate,
    dueDate: data.dueDate !== undefined ? data.dueDate : existing.dueDate,
    tags: data.tags !== undefined ? data.tags : existing.tags,
    subTasks: data.subTasks !== undefined ? data.subTasks : existing.subTasks,
  };
  validateTask(merged);

  const now = new Date().toISOString();
  const updated: Task = {
    ...existing,
    ...merged,
    title: merged.title.trim(),
    updatedAt: now,
    completedAt:
      merged.status === 'completed' && existing.status !== 'completed'
        ? now
        : merged.status !== 'completed'
          ? undefined
          : existing.completedAt,
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id: _ignored, email: _ownEmail, ...taskFields } = existing;
  await col.replaceOne(
    { id, email: email.toLowerCase() } as Filter<TaskDoc>,
    { ...updated, email: email.toLowerCase() } as TaskDoc
  );
  return updated;
}

export async function deleteTaskForUser(id: string, email: string): Promise<void> {
  const col = await getCollection();
  const result = await col.deleteOne({ id, email: email.toLowerCase() } as Filter<TaskDoc>);
  if (result.deletedCount === 0) throw new Error(`Task ${id} not found`);
}

export async function toggleTaskStatusForUser(id: string, email: string): Promise<Task> {
  const col = await getCollection();
  const task = await col.findOne({ id, email: email.toLowerCase() } as Filter<TaskDoc>);
  if (!task) throw new Error(`Task ${id} not found`);
  const newStatus: Task['status'] = task.status === 'completed' ? 'pending' : 'completed';
  return updateTaskForUser(id, email, { status: newStatus });
}

// ── One-time migration helper ─────────────────────────────────────────────────
// Inserts tasks preserving their original ids/timestamps.
// Skips any task that already exists (upsert by id+email).
export async function bulkUpsertTasksForUser(email: string, tasks: Task[]): Promise<number> {
  const col = await getCollection();
  let inserted = 0;
  for (const task of tasks) {
    const result = await col.updateOne(
      { id: task.id, email: email.toLowerCase() } as Filter<TaskDoc>,
      { $setOnInsert: { ...task, email: email.toLowerCase() } as TaskDoc },
      { upsert: true }
    );
    if (result.upsertedCount > 0) inserted++;
  }
  return inserted;
}

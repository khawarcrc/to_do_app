import clientPromise from './mongodb';
import { Collection, Filter } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const DB_NAME = 'todoflow';
const COLLECTION = 'random_tasks';   // keep existing MongoDB collection name to preserve data

export type TaskCategory = 'technical' | 'communications';

export interface BacklogTask {
  id: string;
  title: string;
  completed: boolean;
  category: TaskCategory;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface BacklogTaskDoc extends BacklogTask {
  email: string;
}

async function getCollection(): Promise<Collection<BacklogTaskDoc>> {
  const client = await clientPromise;
  const col = client.db(DB_NAME).collection<BacklogTaskDoc>(COLLECTION);
  await col.createIndex({ email: 1, order: 1 });
  await col.createIndex({ email: 1, id: 1 }, { unique: true });
  return col;
}

export async function getBacklogTasksByEmail(email: string): Promise<BacklogTask[]> {
  const col = await getCollection();
  const docs = await col
    .find({ email: email.toLowerCase() } as Filter<BacklogTaskDoc>)
    .sort({ order: 1 })
    .toArray();
  return docs.map(({ email: _e, _id, ...task }) => task as BacklogTask);
}

export async function createBacklogTask(
  email: string,
  title: string,
  category: TaskCategory = 'technical'
): Promise<BacklogTask> {
  if (!title || title.trim().length === 0) throw new Error('Title is required');
  const col = await getCollection();
  // Place at the end within the same category
  const last = await col
    .find({ email: email.toLowerCase(), category } as Filter<BacklogTaskDoc>)
    .sort({ order: -1 })
    .limit(1)
    .toArray();
  const order = last.length > 0 ? last[0].order + 1 : 0;
  const now = new Date().toISOString();
  const task: BacklogTask = {
    id: uuidv4(),
    title: title.trim(),
    completed: false,
    category,
    order,
    createdAt: now,
    updatedAt: now,
  };
  await col.insertOne({ ...task, email: email.toLowerCase() } as BacklogTaskDoc);
  return task;
}

export async function updateBacklogTask(
  id: string,
  email: string,
  updates: Partial<Pick<BacklogTask, 'title' | 'completed' | 'category'>>
): Promise<BacklogTask | null> {
  const col = await getCollection();
  const now = new Date().toISOString();
  const result = await col.findOneAndUpdate(
    { id, email: email.toLowerCase() } as Filter<BacklogTaskDoc>,
    { $set: { ...updates, updatedAt: now } },
    { returnDocument: 'after' }
  );
  if (!result) return null;
  const { email: _e, _id, ...task } = result;
  return task as BacklogTask;
}

export async function deleteBacklogTask(id: string, email: string): Promise<boolean> {
  const col = await getCollection();
  const result = await col.deleteOne({ id, email: email.toLowerCase() } as Filter<BacklogTaskDoc>);
  return result.deletedCount > 0;
}

/** Bulk-update order values after a drag-and-drop reorder */
export async function reorderBacklogTasks(
  email: string,
  orderedIds: string[]
): Promise<void> {
  const col = await getCollection();
  const now = new Date().toISOString();
  const ops = orderedIds.map((id, index) => ({
    updateOne: {
      filter: { id, email: email.toLowerCase() } as Filter<BacklogTaskDoc>,
      update: { $set: { order: index, updatedAt: now } },
    },
  }));
  if (ops.length > 0) await col.bulkWrite(ops);
}

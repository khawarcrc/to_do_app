import fs from 'fs';
import path from 'path';
import { Task, TaskFormData } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const DATA_DIR = path.join(process.cwd(), 'data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');
const BACKUP_FILE = path.join(DATA_DIR, 'tasks.backup.json');

let writeLock = false;
const writeQueue: (() => Promise<void>)[] = [];

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function ensureTasksFile(): void {
  ensureDataDir();
  if (!fs.existsSync(TASKS_FILE)) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify({ tasks: [] }, null, 2), 'utf-8');
  }
}

async function processQueue(): Promise<void> {
  if (writeLock || writeQueue.length === 0) return;
  writeLock = true;
  const task = writeQueue.shift();
  if (task) {
    try {
      await task();
    } catch (error) {
      console.error('Write queue task failed:', error);
    }
  }
  writeLock = false;
  void processQueue();
}

function enqueueWrite(fn: () => Promise<void>): Promise<void> {
  return new Promise((resolve, reject) => {
    writeQueue.push(async () => {
      try {
        await fn();
        resolve();
      } catch (err) {
        reject(err);
      }
    });
    void processQueue();
  });
}

export function readTasks(): Task[] {
  try {
    ensureTasksFile();
    const raw = fs.readFileSync(TASKS_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as { tasks: Task[] };
    if (!Array.isArray(parsed.tasks)) {
      return [];
    }
    return parsed.tasks;
  } catch (error) {
    console.error('Error reading tasks:', error);
    // Attempt to restore from backup
    try {
      if (fs.existsSync(BACKUP_FILE)) {
        const backupRaw = fs.readFileSync(BACKUP_FILE, 'utf-8');
        const backupParsed = JSON.parse(backupRaw) as { tasks: Task[] };
        return Array.isArray(backupParsed.tasks) ? backupParsed.tasks : [];
      }
    } catch {
      /* ignore */
    }
    return [];
  }
}

export async function writeTasks(tasks: Task[]): Promise<void> {
  return enqueueWrite(async () => {
    ensureDataDir();
    // Create backup of existing file
    if (fs.existsSync(TASKS_FILE)) {
      try {
        fs.copyFileSync(TASKS_FILE, BACKUP_FILE);
      } catch {
        /* non-fatal */
      }
    }
    const data = JSON.stringify({ tasks }, null, 2);
    fs.writeFileSync(TASKS_FILE, data, 'utf-8');
  });
}

function validateTask(data: TaskFormData): void {
  if (!data.title || data.title.trim().length === 0) {
    throw new Error('Title is required');
  }
  if (data.title.trim().length > 200) {
    throw new Error('Title must be under 200 characters');
  }
  if (!['low', 'medium', 'high', 'critical'].includes(data.priority)) {
    throw new Error('Invalid priority');
  }
  if (!['pending', 'in-progress', 'completed'].includes(data.status)) {
    throw new Error('Invalid status');
  }
  if (typeof data.timeEstimate !== 'number' || data.timeEstimate < 0) {
    throw new Error('Time estimate must be a positive number');
  }
}

export async function createTask(data: TaskFormData): Promise<Task> {
  validateTask(data);
  const tasks = readTasks();
  const now = new Date().toISOString();
  const newTask: Task = {
    id: uuidv4(),
    title: data.title.trim(),
    description: data.description?.trim(),
    priority: data.priority,
    status: data.status,
    timeEstimate: data.timeEstimate,
    dueDate: data.dueDate,
    tags: data.tags,
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(newTask);
  await writeTasks(tasks);
  return newTask;
}

export async function updateTask(id: string, data: Partial<TaskFormData>): Promise<Task> {
  const tasks = readTasks();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error(`Task ${id} not found`);

  const existing = tasks[idx];
  const merged: TaskFormData = {
    title: data.title ?? existing.title,
    description: data.description !== undefined ? data.description : existing.description,
    priority: data.priority ?? existing.priority,
    status: data.status ?? existing.status,
    timeEstimate: data.timeEstimate ?? existing.timeEstimate,
    dueDate: data.dueDate !== undefined ? data.dueDate : existing.dueDate,
    tags: data.tags !== undefined ? data.tags : existing.tags,
  };
  validateTask(merged);

  const now = new Date().toISOString();
  const updatedTask: Task = {
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

  tasks[idx] = updatedTask;
  await writeTasks(tasks);
  return updatedTask;
}

export async function deleteTask(id: string): Promise<void> {
  const tasks = readTasks();
  const filtered = tasks.filter((t) => t.id !== id);
  if (filtered.length === tasks.length) throw new Error(`Task ${id} not found`);
  await writeTasks(filtered);
}

export async function toggleTaskStatus(id: string): Promise<Task> {
  const tasks = readTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) throw new Error(`Task ${id} not found`);

  const newStatus: Task['status'] =
    task.status === 'completed' ? 'pending' : 'completed';

  return updateTask(id, { status: newStatus });
}

export function getTaskById(id: string): Task | undefined {
  const tasks = readTasks();
  return tasks.find((t) => t.id === id);
}

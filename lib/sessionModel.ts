import clientPromise from './mongodb';
import { Collection } from 'mongodb';
import crypto from 'crypto';

const DB_NAME = 'todoflow';
const COLLECTION = 'sessions';

export interface SessionDoc {
  sid: string;       // unique session ID embedded in JWT
  email: string;
  device: string;    // browser + OS label
  ip: string;
  createdAt: Date;
  lastSeen: Date;
}

async function getCollection(): Promise<Collection<SessionDoc>> {
  const client = await clientPromise;
  const col = client.db(DB_NAME).collection<SessionDoc>(COLLECTION);
  await col.createIndex({ sid: 1 }, { unique: true });
  await col.createIndex({ email: 1 });
  // Auto-delete sessions older than 7 days
  await col.createIndex({ lastSeen: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });
  return col;
}

// ── Device label helper ───────────────────────────────────────────────────────

export function parseDevice(ua: string): string {
  if (!ua) return 'Unknown device';

  let browser = 'Unknown browser';
  if (ua.includes('Edg/'))        browser = 'Edge';
  else if (ua.includes('OPR/'))   browser = 'Opera';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox'))browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';

  let os = 'Unknown OS';
  if (ua.includes('Windows'))     os = 'Windows';
  else if (ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('iPhone')) os = 'iPhone';
  else if (ua.includes('iPad'))   os = 'iPad';
  else if (ua.includes('Android'))os = 'Android';
  else if (ua.includes('Linux'))  os = 'Linux';

  return `${browser} on ${os}`;
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

export function generateSid(): string {
  return crypto.randomBytes(16).toString('hex');
}

export async function createSession(
  sid: string,
  email: string,
  ua: string,
  ip: string
): Promise<void> {
  const col = await getCollection();
  const now = new Date();
  await col.insertOne({
    sid,
    email: email.toLowerCase(),
    device: parseDevice(ua),
    ip,
    createdAt: now,
    lastSeen: now,
  });
}

export async function touchSession(sid: string): Promise<void> {
  const col = await getCollection();
  await col.updateOne({ sid }, { $set: { lastSeen: new Date() } });
}

export async function getSessionsByEmail(email: string): Promise<SessionDoc[]> {
  const col = await getCollection();
  return col
    .find({ email: email.toLowerCase() })
    .sort({ lastSeen: -1 })
    .toArray();
}

export async function deleteSession(sid: string): Promise<void> {
  const col = await getCollection();
  await col.deleteOne({ sid });
}

export async function deleteAllOtherSessions(email: string, currentSid: string): Promise<void> {
  const col = await getCollection();
  await col.deleteMany({ email: email.toLowerCase(), sid: { $ne: currentSid } });
}

export async function deleteAllSessions(email: string): Promise<void> {
  const col = await getCollection();
  await col.deleteMany({ email: email.toLowerCase() });
}

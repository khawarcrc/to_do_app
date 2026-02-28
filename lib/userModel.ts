import clientPromise from './mongodb';
import { Collection } from 'mongodb';

const DB_NAME = 'todoflow';
const COLLECTION = 'users';

export interface UserDoc {
  email: string;            // stored lowercase
  password: string;         // bcrypt hash
  createdAt: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
}

async function getCollection(): Promise<Collection<UserDoc>> {
  const client = await clientPromise;
  const col = client.db(DB_NAME).collection<UserDoc>(COLLECTION);
  // Ensure unique index – safe to call repeatedly (idempotent)
  await col.createIndex({ email: 1 }, { unique: true });
  return col;
}

export async function findUserByEmail(email: string): Promise<UserDoc | null> {
  const col = await getCollection();
  return col.findOne({ email: email.toLowerCase() });
}

export async function createUser(email: string, hashedPassword: string): Promise<void> {
  const col = await getCollection();
  await col.insertOne({
    email: email.toLowerCase(),
    password: hashedPassword,
    createdAt: new Date(),
  });
}

export async function updateUserPassword(email: string, hashedPassword: string): Promise<void> {
  const col = await getCollection();
  await col.updateOne(
    { email: email.toLowerCase() },
    { $set: { password: hashedPassword }, $unset: { resetToken: '', resetTokenExpiry: '' } }
  );
}

export async function saveResetToken(email: string, token: string, expiry: Date): Promise<void> {
  const col = await getCollection();
  await col.updateOne(
    { email: email.toLowerCase() },
    { $set: { resetToken: token, resetTokenExpiry: expiry } }
  );
}

export async function findUserByResetToken(token: string): Promise<UserDoc | null> {
  const col = await getCollection();
  return col.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: new Date() },
  });
}

export async function clearResetToken(email: string): Promise<void> {
  const col = await getCollection();
  await col.updateOne(
    { email: email.toLowerCase() },
    { $unset: { resetToken: '', resetTokenExpiry: '' } }
  );
}

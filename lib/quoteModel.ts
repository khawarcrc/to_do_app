import clientPromise from './mongodb';
import { Collection, Filter } from 'mongodb';
import { Quote, QuoteFormData } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const DB_NAME = 'todoflow';
const COLLECTION = 'quotes';

// ── Internal document type ────────────────────────────────────────────────────
export interface QuoteDoc extends Quote {
  email: string; // owner — always lowercase
}

async function getCollection(): Promise<Collection<QuoteDoc>> {
  const client = await clientPromise;
  const col = client.db(DB_NAME).collection<QuoteDoc>(COLLECTION);
  // Compound index: list all quotes for a user, sorted by creation date
  await col.createIndex({ email: 1, createdAt: -1 });
  // Unique per-user quote id
  await col.createIndex({ email: 1, id: 1 }, { unique: true });
  // Per-user category listing
  await col.createIndex({ email: 1, category: 1, createdAt: -1 });
  return col;
}

// ── Validation ────────────────────────────────────────────────────────────────
function validateQuote(data: QuoteFormData): void {
  if (!data.content || data.content.trim().length === 0) throw new Error('Quote content is required');
  if (data.content.trim().length > 1000) throw new Error('Quote must be under 1000 characters');
  if (!['daily', 'life-lessons', 'remember'].includes(data.category))
    throw new Error('Invalid category');
  if (data.author && data.author.length > 200) throw new Error('Author must be under 200 characters');
  if (data.source && data.source.length > 200) throw new Error('Source must be under 200 characters');
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

export async function getQuotesByEmail(email: string): Promise<Quote[]> {
  const col = await getCollection();
  const docs = await col
    .find({ email: email.toLowerCase() } as Filter<QuoteDoc>)
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(({ email: _e, _id, ...quote }) => quote as Quote);
}

export async function getQuoteByIdForUser(id: string, email: string): Promise<Quote | null> {
  const col = await getCollection();
  const doc = await col.findOne({ id, email: email.toLowerCase() } as Filter<QuoteDoc>);
  if (!doc) return null;
  const { email: _e, _id, ...quote } = doc;
  return quote as Quote;
}

export async function createQuoteForUser(email: string, data: QuoteFormData): Promise<Quote> {
  validateQuote(data);
  const col = await getCollection();
  const now = new Date().toISOString();
  const quote: Quote = {
    id: uuidv4(),
    content: data.content.trim(),
    author: data.author?.trim() || undefined,
    source: data.source?.trim() || undefined,
    category: data.category,
    createdAt: now,
    updatedAt: now,
  };
  await col.insertOne({ ...quote, email: email.toLowerCase() } as QuoteDoc);
  return quote;
}

export async function updateQuoteForUser(
  id: string,
  email: string,
  data: Partial<QuoteFormData>
): Promise<Quote> {
  if (data.category !== undefined) {
    validateQuote({ content: data.content ?? 'placeholder', category: data.category });
  }
  const col = await getCollection();
  const existing = await col.findOne({ id, email: email.toLowerCase() } as Filter<QuoteDoc>);
  if (!existing) throw new Error('Quote not found');

  const updated: Partial<Quote> = {
    ...(data.content !== undefined && { content: data.content.trim() }),
    ...(data.author !== undefined && { author: data.author?.trim() || undefined }),
    ...(data.source !== undefined && { source: data.source?.trim() || undefined }),
    ...(data.category !== undefined && { category: data.category }),
    updatedAt: new Date().toISOString(),
  };

  await col.updateOne(
    { id, email: email.toLowerCase() } as Filter<QuoteDoc>,
    { $set: updated }
  );

  return { ...existing, ...updated } as Quote;
}

export async function deleteQuoteForUser(id: string, email: string): Promise<void> {
  const col = await getCollection();
  const result = await col.deleteOne({ id, email: email.toLowerCase() } as Filter<QuoteDoc>);
  if (result.deletedCount === 0) throw new Error('Quote not found');
}

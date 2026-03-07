import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
  getQuoteByIdForUser,
  updateQuoteForUser,
  deleteQuoteForUser,
} from '@/lib/quoteModel';
import { QuoteFormData } from '@/types';

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
    const quote = await getQuoteByIdForUser(id, email);
    if (!quote) return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    return NextResponse.json({ quote });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get quote';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const email = await getEmailFromRequest(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const body = (await req.json()) as Partial<QuoteFormData>;
    const quote = await updateQuoteForUser(id, email, body);
    return NextResponse.json({ quote });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update quote';
    const status = message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const email = await getEmailFromRequest(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await deleteQuoteForUser(id, email);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete quote';
    const status = message.includes('not found') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

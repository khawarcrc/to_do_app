import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getQuotesByEmail, createQuoteForUser } from '@/lib/quoteModel';
import { QuoteFormData } from '@/types';

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

export async function GET(req: NextRequest) {
  const email = await getEmailFromRequest(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const quotes = await getQuotesByEmail(email);
    return NextResponse.json({ quotes });
  } catch (error) {
    console.error('GET /api/quotes error:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const email = await getEmailFromRequest(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = (await req.json()) as QuoteFormData;
    const quote = await createQuoteForUser(email, body);
    return NextResponse.json({ quote }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create quote';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

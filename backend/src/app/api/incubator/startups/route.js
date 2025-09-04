import { NextResponse } from 'next/server';
import { getList } from '@/lib/incubatorApi';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const skip = Number(url.searchParams.get('skip') ?? '0') || 0;
    const limit = Number(url.searchParams.get('limit') ?? '100') || 100;
    const data = await getList('/startups', { skip, limit });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? 'Erreur inconnue' },
      { status: 500 }
    );
  }
}


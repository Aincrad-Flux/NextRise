import { NextResponse } from 'next/server';
import { getDetail } from '@/lib/incubatorApi';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const id = params?.id;
    const data = await getDetail(`/news/${id}`);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? 'Erreur inconnue' },
      { status: 500 }
    );
  }
}


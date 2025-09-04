import { NextResponse } from 'next/server';
import { getDetail } from '@/lib/incubatorApi';

export const dynamic = 'force-dynamic';

export async function GET(_req, { params }) {
  try {
    const email = params?.email;
    const data = await getDetail(`/users/email/${encodeURIComponent(email)}`);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? 'Erreur inconnue' },
      { status: 500 }
    );
  }
}


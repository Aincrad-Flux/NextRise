import { NextResponse } from 'next/server';
import { fetchRaw } from '@/lib/incubatorApi';

export const dynamic = 'force-dynamic';

export async function GET(_req, { params }) {
  try {
    const id = params?.id;
    const res = await fetchRaw(`/investors/${id}/image`);
    const ct = res.headers.get('content-type') || 'application/octet-stream';
    const buf = await res.arrayBuffer();
    if (!res.ok) {
      return NextResponse.json({ error: new TextDecoder().decode(buf) }, { status: res.status });
    }
    return new NextResponse(buf, { headers: { 'content-type': ct } });
  } catch (err) {
    return NextResponse.json({ error: err?.message ?? 'Erreur inconnue' }, { status: 500 });
  }
}


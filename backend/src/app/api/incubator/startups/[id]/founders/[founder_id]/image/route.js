import { NextResponse } from 'next/server';
import { fetchRaw } from '@/lib/incubatorApi';

export const dynamic = 'force-dynamic';

export async function GET(_req, { params }) {
  try {
    const startup_id = params?.id; // slug unifié [id]
    const founder_id = params?.founder_id;
    const res = await fetchRaw(`/startups/${startup_id}/founders/${founder_id}/image`);
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

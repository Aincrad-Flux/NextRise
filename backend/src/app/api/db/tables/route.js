import { NextResponse } from 'next/server';
import { fetchPublicTablesMeta } from '@/src/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const meta = await fetchPublicTablesMeta();
        const tables = (meta || [])
            .filter(t => t?.schema === 'public')
            .map(t => t.name)
            .sort((a, b) => a.localeCompare(b));
        return NextResponse.json({ tables });
    } catch (err) {
        return NextResponse.json(
            { error: err?.message ?? 'Erreur inconnue' },
            { status: 500 }
        );
    }
}
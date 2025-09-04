import { NextResponse } from 'next/server';
import { sendRequest, supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const meta = await sendRequest("/event?select=*");

        return NextResponse.json({ tables: meta });
    } catch (err) {
        return NextResponse.json(
            { error: err?.message ?? 'Erreur inconnue' },
            { status: 500 }
        );
    }
}
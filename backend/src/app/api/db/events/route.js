import { NextResponse } from 'next/server';
import { sendRequest } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const sp = url.searchParams;
        // Construire l'objet query; select par défaut = "*" si absent
        const query = {};
        let hasSelect = false;
        for (const [k, v] of sp.entries()) {
            query[k] = v;
            if (k.toLowerCase() === 'select') hasSelect = true;
        }
        if (!hasSelect) query.select = '*';

        const meta = await sendRequest({ path: '/event', query });
        return NextResponse.json({ tables: meta });
    } catch (err) {
        return NextResponse.json(
            { error: err?.message ?? 'Erreur inconnue' },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const payload = await req.json().catch(() => null);
        if (!payload || (typeof payload !== 'object')) {
            return NextResponse.json(
                { error: 'Corps JSON invalide.' },
                { status: 400 }
            );
        }

        const created = await sendRequest({
            path: '/event',
            method: 'POST',
            body: payload,
        });

        return NextResponse.json(created, { status: 201 });
    } catch (err) {
        return NextResponse.json(
            { error: err?.message ?? 'Erreur inconnue' },
            { status: 500 }
        );
    }
}

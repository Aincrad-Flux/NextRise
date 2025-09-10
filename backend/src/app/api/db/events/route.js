import { NextResponse } from 'next/server';
import { sendRequest } from '@/lib/supabase';

// Simple CORS helper (middleware headers were being overwritten by route responses)
function attachCORS(res, req) {
    try {
        const origin = req.headers.get('origin');
        // Allow localhost dev origins by default; could be extended via env
        const allowed = [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
        ];
        if (origin && allowed.includes(origin)) {
            res.headers.set('Access-Control-Allow-Origin', origin);
            res.headers.set('Access-Control-Allow-Credentials', 'true');
        }
        res.headers.set('Vary', 'Origin');
        res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    } catch {}
}

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const sp = url.searchParams;
        const query = {};
        let hasSelect = false;
        for (const [k, v] of sp.entries()) {
            query[k] = v;
            if (k.toLowerCase() === 'select') hasSelect = true;
        }
        if (!hasSelect) query.select = '*';

        const meta = await sendRequest({ path: '/event', query });
        const res = NextResponse.json({ tables: meta });
        attachCORS(res, req);
        return res;
    } catch (err) {
        const res = NextResponse.json(
            { error: err?.message ?? 'Erreur inconnue' },
            { status: 500 }
        );
        attachCORS(res, req);
        return res;
    }
}

export async function POST(req) {
    try {
        const payload = await req.json().catch(() => null);
        if (!payload || (typeof payload !== 'object')) {
            const res = NextResponse.json(
                { error: 'Corps JSON invalide.' },
                { status: 400 }
            );
            attachCORS(res, req);
            return res;
        }

        const created = await sendRequest({
            path: '/event',
            method: 'POST',
            body: payload,
        });

        const res = NextResponse.json(created, { status: 201 });
        attachCORS(res, req);
        return res;
    } catch (err) {
        const res = NextResponse.json(
            { error: err?.message ?? 'Erreur inconnue' },
            { status: 500 }
        );
        attachCORS(res, req);
        return res;
    }
}

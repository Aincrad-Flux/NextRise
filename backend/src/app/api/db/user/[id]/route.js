import { NextResponse } from 'next/server';
import { sendRequest } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(_req, { params }) {
    try {
        const { id } = params || {};
        if (!id) {
            return NextResponse.json({ error: 'Paramètre id manquant.' }, { status: 400 });
        }

        const rows = await sendRequest(`/user?select=*&id=eq.${encodeURIComponent(id)}`);
        const item = Array.isArray(rows) ? rows[0] : null;
        if (!item) {
            return NextResponse.json({ error: 'Événement introuvable.' }, { status: 404 });
        }
        return NextResponse.json(item);
    } catch (err) {
        return NextResponse.json(
            { error: err?.message ?? 'Erreur inconnue' },
            { status: 500 }
        );
    }
}

export async function PATCH(req, { params }) {
    try {
        const { id } = params || {};
        if (!id) {
            return NextResponse.json({ error: 'Paramètre id manquant.' }, { status: 400 });
        }

        const payload = await req.json().catch(() => null);
        if (!payload || typeof payload !== 'object') {
            return NextResponse.json({ error: 'Corps JSON invalide.' }, { status: 400 });
        }

        const updated = await sendRequest({
            path: `/user?id=eq.${encodeURIComponent(id)}`,
            method: 'PATCH',
            body: payload,
        });

        const item = Array.isArray(updated) ? updated[0] : null;
        if (!item) {
            return NextResponse.json({ error: 'Événement introuvable.' }, { status: 404 });
        }
        return NextResponse.json(item);
    } catch (err) {
        return NextResponse.json(
            { error: err?.message ?? 'Erreur inconnue' },
            { status: 500 }
        );
    }
}

export async function DELETE(_req, { params }) {
    try {
        const { id } = params || {};
        if (!id) {
            return NextResponse.json({ error: 'Paramètre id manquant.' }, { status: 400 });
        }

        const deleted = await sendRequest({
            path: `/user?id=eq.${encodeURIComponent(id)}`,
            method: 'DELETE',
        });

        // Avec Prefer: return=representation, PostgREST renvoie les lignes supprimées
        const item = Array.isArray(deleted) ? deleted[0] : null;
        if (!item) {
            return NextResponse.json({ error: 'Événement introuvable.' }, { status: 404 });
        }
        return NextResponse.json(item);
    } catch (err) {
        return NextResponse.json(
            { error: err?.message ?? 'Erreur inconnue' },
            { status: 500 }
        );
    }
}


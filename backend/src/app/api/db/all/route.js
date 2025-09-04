import { NextResponse } from 'next/server';
import { fetchPublicTablesMeta, supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const meta = await fetchPublicTablesMeta();
        const tableNames = (meta || [])
            .filter(t => t?.schema === 'public')
            .map(t => t.name);

        const results = await Promise.all(
            tableNames.map(async (table) => {
                const { data, error } = await supabaseAdmin
                    .from(table)
                    .select('*'); // adaptez: pagination, colonnes, filtres, etc.
                if (error) {
                    return { table, error: error.message, rows: [] };
                }
                return { table, rows: data };
            })
        );

        return NextResponse.json({ tables: results });
    } catch (err) {
        return NextResponse.json(
            { error: err?.message ?? 'Erreur inconnue' },
            { status: 500 }
        );
    }
}
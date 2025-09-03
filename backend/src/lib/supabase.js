import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Variables SUPABASE_URL et SUPABASE_ANON_KEY manquantes.');
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY manquante : /api/db/tables échouera.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
});

export const supabaseAdmin = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY ?? 'invalid',
    { auth: { persistSession: false, autoRefreshToken: false } }
);

export async function fetchPublicTablesMeta() {
    if (!SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY manquante pour pg-meta.');
    }
    const url = `${SUPABASE_URL}/pg/tables?included_schemas=public&exclude_system_schemas=true`;
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });
    if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`pg-meta error ${res.status}: ${body || res.statusText}`);
    }
    return res.json(); // tableau d'objets { name, schema, ... }
}

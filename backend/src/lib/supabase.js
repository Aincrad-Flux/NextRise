import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('SUPABASE_URL et SUPABASE_ANON_KEY sont requis.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
});

export const supabaseAdmin = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY ?? 'invalid',
    { auth: { persistSession: false, autoRefreshToken: false } }
);

export async function sendRequest(options) {
    if (!SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY manquante pour appeler pg-meta.');
    }

    const request = `${SUPABASE_URL}/rest/v1/${options}`
    console.log(`Sending request ${request}`);

    const res = await fetch(
        request,
        {
            method: 'GET',
            headers: {
                apikey: SUPABASE_SERVICE_ROLE_KEY,
                Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        }
    );

    if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`pg-meta error ${res.status}: ${body || res.statusText}`);
    }

    return res.json();
}
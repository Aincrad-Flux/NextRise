import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

function mask(value) {
    if (!value) return '<missing>';
    if (value.length <= 10) return '***';
    return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function getEnv(name) {
    return process.env[name] || undefined;
}

/* initial debug log to help locate env loading issues */
console.log(
    `[supabase] cwd=${process.cwd()} NODE_ENV=${process.env.NODE_ENV || '<unset>'} ` +
    `SUPABASE_URL=${mask(process.env.SUPABASE_URL)} ` +
    `SUPABASE_ANON_KEY=${mask(process.env.SUPABASE_ANON_KEY)} ` +
    `SUPABASE_SERVICE_ROLE_KEY=${mask(process.env.SUPABASE_SERVICE_ROLE_KEY)}`
);

let cachedAnonClient;
let cachedAdminClient;

export function getSupabaseClient({ serviceRole = false } = {}) {
    console.log(`[supabase] getSupabaseClient called serviceRole=${serviceRole}`);
    const url = getEnv('SUPABASE_URL');
    const key = serviceRole ? getEnv('SUPABASE_SERVICE_ROLE_KEY') : getEnv('SUPABASE_ANON_KEY');

    console.log(
        `[supabase] env check inside getSupabaseClient: SUPABASE_URL=${mask(url)} key=${mask(key)}`
    );

    if (!url || !key) {
        const missing = `Missing environment variables: SUPABASE_URL and ${serviceRole ? 'SUPABASE_SERVICE_ROLE_KEY' : 'SUPABASE_ANON_KEY'}.`;
        console.error(`[supabase] ${missing}`);
        throw new Error(missing);
    }

    if (serviceRole) {
        if (!cachedAdminClient) {
            cachedAdminClient = createClient(url, key, {
                auth: { persistSession: false, autoRefreshToken: false },
            });
            console.log('[supabase] created cachedAdminClient');
        }
        return cachedAdminClient;
    }

    if (!cachedAnonClient) {
        cachedAnonClient = createClient(url, key, {
            auth: { persistSession: false, autoRefreshToken: false },
        });
        console.log('[supabase] created cachedAnonClient');
    }
    return cachedAnonClient;
}

export async function fetchPublicTablesMeta() {
    console.log('[supabase] fetchPublicTablesMeta called');
    const url = getEnv('SUPABASE_URL');
    const key = getEnv('SUPABASE_SERVICE_ROLE_KEY');

    console.log(
        `[supabase] env check inside fetchPublicTablesMeta: SUPABASE_URL=${mask(url)} ` +
        `SUPABASE_SERVICE_ROLE_KEY=${mask(key)}`
    );

    if (!url || !key) {
        const errMsg = 'SUPABASE_SERVICE_ROLE_KEY missing for pg-meta.';
        console.error(`[supabase] ${errMsg}`);
        throw new Error(errMsg);
    }

    const res = await fetch(`${url}/pg/tables?included_schemas=public&exclude_system_schemas=true`, {
        method: 'GET',
        headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        const body = await res.text().catch(() => '');
        const err = `pg-meta error ${res.status}: ${body || res.statusText}`;
        console.error('[supabase] ' + err);
        throw new Error(err);
    }

    console.log('[supabase] fetchPublicTablesMeta succeeded');
    return res.json();
}
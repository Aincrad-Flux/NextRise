import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

/**
 * Supabase project URL.
 * @private
 */
const SUPABASE_URL = process.env.SUPABASE_URL;
/**
 * Public anon key used for client operations.
 * @private
 */
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
/**
 * Service role key used for admin PostgREST calls.
 * @private
 */
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY are required.');
}

/**
 * Public Supabase client (anon key).
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
});

/**
 * Admin Supabase client (service role key). Limited to server-side usage.
 */
export const supabaseAdmin = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY ?? 'invalid',
    { auth: { persistSession: false, autoRefreshToken: false } }
);

/**
 * Minimal PostgREST helper using the service role key.
 * Supports string input (path shorthand) or an options object.
 * @async
 * @param {string|{path:string,method?:string,body?:any,headers?:Object,query?:Object}} options
 * @returns {Promise<any>} Parsed JSON or text, or null for 204 responses.
 * @throws {Error} If service role key missing or response not ok.
 */
export async function sendRequest(options) {
    if (!SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is required to call PostgREST.');
    }

    const isString = typeof options === 'string';
    const path = isString ? options : options.path;
    const method = isString ? 'GET' : (options.method || 'GET');
    const body = isString ? undefined : options.body;
    const extraHeaders = isString ? undefined : (options.headers || {});
    const query = isString ? undefined : options.query;

    const base = `${SUPABASE_URL}/rest/v1/`;
    const normalized = path.startsWith('/') ? path.slice(1) : path;
    const url = new URL(base + normalized);

    if (query && typeof query === 'object') {
        for (const [k, v] of Object.entries(query)) {
            url.searchParams.append(k, String(v));
        }
    }

    const headers = {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(['POST', 'PATCH', 'PUT', 'DELETE'].includes(method.toUpperCase())
            ? { Prefer: 'return=representation' }
            : {}),
        ...(extraHeaders || {}),
    };

    const res = await fetch(url.toString(), {
        method,
        headers,
        cache: 'no-store',
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`PostgREST error ${res.status}: ${text || res.statusText}`);
    }

    const contentLength = res.headers.get('content-length');
    if (res.status === 204 || contentLength === '0') {
        return null;
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        return res.json();
    }
    return res.text();
}
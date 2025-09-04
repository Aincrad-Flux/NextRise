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

    // Supporte soit une chaîne (compat), soit un objet détaillé
    const isString = typeof options === 'string';
    const path = isString ? options : options.path;
    const method = isString ? 'GET' : (options.method || 'GET');
    const body = isString ? undefined : options.body;
    const extraHeaders = isString ? undefined : (options.headers || {});
    const query = isString ? undefined : options.query;

    const base = `${SUPABASE_URL}/rest/v1/`;
    // Chemin sans double slash
    const normalized = path.startsWith('/') ? path.slice(1) : path;
    const url = new URL(base + normalized);

    // Ajout des query params si fournis en objet
    if (query && typeof query === 'object') {
        for (const [k, v] of Object.entries(query)) {
            url.searchParams.append(k, String(v));
        }
    }

    console.log(`Sending request ${url.toString()} [${method}]`);

    const headers = {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        // Content-Type uniquement si corps JSON
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        // Par défaut, retourner la représentation pour les écritures
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
        throw new Error(`pg-meta error ${res.status}: ${text || res.statusText}`);
    }

    // Certains DELETE/UPDATE peuvent retourner 204 si Prefer minimal
    const contentLength = res.headers.get('content-length');
    if (res.status === 204 || contentLength === '0') {
        return null;
    }

    // Tente JSON, sinon texte
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        return res.json();
    }
    return res.text();
}
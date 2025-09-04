import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Chargement/validation des variables d'environnement (serveur uniquement)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("SUPABASE_URL:", SUPABASE_URL);
console.log("SUPABASE_ANON_KEY:", SUPABASE_ANON_KEY ? '****' + SUPABASE_ANON_KEY.slice(-4) : null);
console.log("SUPABASE_SERVICE_ROLE_KEY:", SUPABASE_SERVICE_ROLE_KEY ? '****' + SUPABASE_SERVICE_ROLE_KEY.slice(-4) : null);

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('SUPABASE_URL et SUPABASE_ANON_KEY sont requis.');
}

// Client public (clé anonyme)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
});

// Client admin (service role). Si la clé manque, on crée quand même un client
// avec une clé invalide: toute requête échouera clairement côté appelant.
export const supabaseAdmin = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY ?? 'invalid',
    { auth: { persistSession: false, autoRefreshToken: false } }
);

// Récupère les métadonnées des tables publiques via l'endpoint pg-meta de Supabase.
// Nécessite la clé service role; sinon une erreur explicite est levée.
export async function fetchPublicTablesMeta() {
    if (!SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY manquante pour appeler pg-meta.');
    }

    const res = await fetch(
        `${SUPABASE_URL}/pg/tables?included_schemas=public&exclude_system_schemas=true`,
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
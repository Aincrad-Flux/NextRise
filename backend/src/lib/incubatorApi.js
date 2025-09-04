// filepath: /Users/pandorian/Delivery/NextRise/backend/src/lib/incubatorApi.js
import 'dotenv/config';

const BASE_URL = process.env.INCUBATOR_API_BASE_URL;
const API_KEY = process.env.INCUBATOR_API_KEY; // pour header X-Group-Authorization

if (!BASE_URL) {
  console.warn('[incubatorApi] INCUBATOR_API_BASE_URL non défini. Le client ne pourra pas appeler l\'API distante.');
}

function buildUrl(path, params) {
  const base = BASE_URL?.replace(/\/$/, '') || '';
  const clean = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(base + clean);
  if (params && typeof params === 'object') {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) url.searchParams.append(k, String(v));
    }
  }
  return url.toString();
}

async function doFetch(path, params) {
  if (!BASE_URL) throw new Error('INCUBATOR_API_BASE_URL manquant');
  const url = buildUrl(path, params);
  const headers = {
    'Accept': 'application/json',
    ...(API_KEY ? { 'X-Group-Authorization': API_KEY } : {}),
  };
  const res = await fetch(url, { headers, cache: 'no-store' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API incubator error ${res.status} ${res.statusText}: ${text}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

export async function getList(path, { skip = 0, limit = 100 } = {}) {
  return doFetch(path, { skip, limit });
}

export async function getAll(path, { limit = 100, maxPages = 100 } = {}) {
  const out = [];
  let skip = 0;
  for (let i = 0; i < maxPages; i++) {
    const page = await getList(path, { skip, limit });
    if (!Array.isArray(page)) break;
    out.push(...page);
    if (page.length < limit) break;
    skip += limit;
  }
  return out;
}

export async function getDetail(path) {
  return doFetch(path);
}

export function requireApiConfig() {
  if (!BASE_URL) throw new Error('INCUBATOR_API_BASE_URL manquant');
}


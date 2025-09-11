import 'dotenv/config';

/**
 * Base URL of the upstream incubator API.
 * @private
 */
const BASE_URL = process.env.INCUBATOR_API_BASE_URL;

/**
 * Optional API key for header X-Group-Authorization.
 * @private
 */
const API_KEY = process.env.INCUBATOR_API_KEY;

if (!BASE_URL) {
  console.warn('[incubatorApi] INCUBATOR_API_BASE_URL is not defined. Remote API calls will fail.');
}

/**
 * Build a full URL from base and path, appending query params.
 * @param {string} path Resource path, with or without leading slash.
 * @param {Object} [params] Query parameters map.
 * @returns {string} Absolute URL string.
 * @private
 */
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

/**
 * Fetch JSON or text from the incubator API, throwing on non-2xx.
 * @param {string} path Resource path.
 * @param {Object} [params] Query params.
 * @returns {Promise<any>} Parsed JSON or text.
 * @private
 */
async function doFetch(path, params) {
  if (!BASE_URL) throw new Error('INCUBATOR_API_BASE_URL is missing');
  const url = buildUrl(path, params);
  const headers = {
    'Accept': 'application/json',
    ...(API_KEY ? { 'X-Group-Authorization': API_KEY } : {}),
  };
  const res = await fetch(url, { headers, cache: 'no-store' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Incubator API error ${res.status} ${res.statusText}: ${text}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

/**
 * Low-level fetch returning the raw Response.
 * @param {string} path Resource path.
 * @param {Object} [params] Query params.
 * @returns {Promise<Response>}
 */
export async function fetchRaw(path, params) {
  if (!BASE_URL) throw new Error('INCUBATOR_API_BASE_URL is missing');
  const url = buildUrl(path, params);
  const headers = {
    'Accept': '*/*',
    ...(API_KEY ? { 'X-Group-Authorization': API_KEY } : {}),
  };
  return fetch(url, { headers, cache: 'no-store' });
}

/**
 * Fetch a paginated list from the API.
 * @param {string} path Endpoint path.
 * @param {{skip?:number,limit?:number}} [options]
 * @returns {Promise<any[]>}
 */
export async function getList(path, { skip = 0, limit = 100 } = {}) {
  return doFetch(path, { skip, limit });
}

/**
 * Fetch all pages up to maxPages.
 * @param {string} path Endpoint path.
 * @param {{limit?:number,maxPages?:number}} [options]
 * @returns {Promise<any[]>}
 */
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

/**
 * Fetch a single resource detail.
 * @param {string} path Detail path.
 * @returns {Promise<any>}
 */
export async function getDetail(path) {
  return doFetch(path);
}

/**
 * Ensure the API base URL is configured.
 * @throws {Error} If configuration is missing.
 */
export function requireApiConfig() {
  if (!BASE_URL) throw new Error('INCUBATOR_API_BASE_URL is missing');
}

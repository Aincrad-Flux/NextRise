import 'dotenv/config';
import { getAll, getDetail, requireApiConfig } from '@/lib/incubatorApi';
import { sendRequest } from '@/lib/supabase';

// Small helper: chunk an array
function chunk(arr, size) {
	const out = [];
	for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
	return out;
}

// Map with concurrency control
async function mapWithConcurrency(items, limit, mapper) {
	const results = new Array(items.length);
	let i = 0;
	const workers = new Array(Math.min(limit, items.length)).fill(0).map(async () => {
		while (true) {
			const idx = i++;
			if (idx >= items.length) break;
			try {
				results[idx] = await mapper(items[idx], idx);
			} catch (err) {
				results[idx] = { error: err?.message || String(err) };
			}
		}
	});
	await Promise.all(workers);
	return results;
}

// Upsert helper to Supabase via PostgREST
async function upsertTo(table, rows, { onConflict = 'id', batchSize = 500 } = {}) {
	if (!Array.isArray(rows) || rows.length === 0) return { inserted: 0, returned: [] };

	let inserted = 0;
	const returned = [];
	for (const part of chunk(rows, batchSize)) {
		const resp = await sendRequest({
			path: `/${table}`,
			method: 'POST',
			query: onConflict ? { on_conflict: onConflict } : undefined,
			headers: { Prefer: 'return=representation,resolution=merge-duplicates' },
			body: part,
		});
		if (Array.isArray(resp)) {
			inserted += resp.length;
			returned.push(...resp);
		}
	}
	return { inserted, returned };
}

function ensureArray(data) {
	return Array.isArray(data) ? data : [];
}

function hasId(o) {
	return o && (typeof o.id === 'string' || typeof o.id === 'number');
}

// Public imports
export async function importEvents() {
	requireApiConfig();
	const items = ensureArray(await getAll('/events', { limit: 100 }));
	const filtered = items.filter(hasId);
	const res = await upsertTo('event', filtered);
	return { count: filtered.length, upserted: res.inserted };
}

export async function importInvestors() {
	requireApiConfig();
	const items = ensureArray(await getAll('/investors', { limit: 100 }));
	const filtered = items.filter(hasId);
	const res = await upsertTo('investors', filtered);
	return { count: filtered.length, upserted: res.inserted };
}

export async function importPartners() {
	requireApiConfig();
	const items = ensureArray(await getAll('/partners', { limit: 100 }));
	const filtered = items.filter(hasId);
	const res = await upsertTo('partners', filtered);
	return { count: filtered.length, upserted: res.inserted };
}

export async function importNews() {
	requireApiConfig();
	const items = ensureArray(await getAll('/news', { limit: 100 }));
	const filtered = items.filter(hasId);
	const res = await upsertTo('news', filtered);
	return { count: filtered.length, upserted: res.inserted };
}

export async function importUsers() {
	requireApiConfig();
	const items = ensureArray(await getAll('/users', { limit: 100 }));
	const filtered = items.filter(hasId);
	// Table name 'user' is singular in DB per convention above
	const res = await upsertTo('user', filtered);
	return { count: filtered.length, upserted: res.inserted };
}

export async function importStartups() {
	requireApiConfig();
	const base = ensureArray(await getAll('/startups', { limit: 100 }));
	const ids = base.map((s) => s?.id).filter((v) => v !== undefined && v !== null);

	// Fetch details with small concurrency to respect remote API
	const details = await mapWithConcurrency(ids, 5, async (id) => {
		const d = await getDetail(`/startups/${id}`);
		return d;
	});

	const startupRows = details.filter(hasId);

	// Extract founders when present in details (support multiple shapes)
	const founderRows = [];
	for (const d of details) {
		if (!d || !hasId(d)) continue;
		const sid = d.id;
		const list = Array.isArray(d.founders)
			? d.founders
			: Array.isArray(d.team)
				? d.team
				: [];
		for (const f of list) {
			if (!hasId(f)) continue;
			founderRows.push({ ...f, startup_id: sid });
		}
	}

	const up1 = await upsertTo('startup', startupRows);
	let up2 = { inserted: 0 };
	if (founderRows.length) {
		// Try composite on_conflict if your DB has unique on (id) already, keep 'id'
		up2 = await upsertTo('founder', founderRows);
	}

	return {
		startups: { count: startupRows.length, upserted: up1.inserted },
		founders: { count: founderRows.length, upserted: up2.inserted },
	};
}

export async function importAll() {
	const results = {};
	results.events = await importEvents().catch((e) => ({ error: e?.message || String(e) }));
	results.investors = await importInvestors().catch((e) => ({ error: e?.message || String(e) }));
	results.partners = await importPartners().catch((e) => ({ error: e?.message || String(e) }));
	results.news = await importNews().catch((e) => ({ error: e?.message || String(e) }));
	results.startups = await importStartups().catch((e) => ({ error: e?.message || String(e) }));
	results.users = await importUsers().catch((e) => ({ error: e?.message || String(e) }));
	return results;
}



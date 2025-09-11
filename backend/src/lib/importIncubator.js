import 'dotenv/config';
import { getAll, getDetail, requireApiConfig } from '@/lib/incubatorApi';
import { sendRequest } from '@/lib/supabase';

/**
 * Split an array into equally sized chunks (last chunk may be smaller).
 * @param {Array<any>} arr Source array.
 * @param {number} size Desired chunk size (>0).
 * @returns {Array<Array<any>>} Array of chunk arrays.
 * @private
 */
function chunk(arr, size) {
	const out = [];
	for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
	return out;
}

/**
 * Map items with a concurrency limit.
 * @template T,R
 * @param {T[]} items Items to process.
 * @param {number} limit Max parallel operations.
 * @param {(item:T,index:number)=>Promise<R>} mapper Async mapper.
 * @returns {Promise<R[]>} Array of mapped results (errors captured as objects with error key).
 * @private
 */
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

/**
 * Bulk upsert helper using Supabase PostgREST interface with optional conflict target.
 * @param {string} table Table name.
 * @param {Array<Object>} rows Rows to upsert.
 * @param {Object} [options]
 * @param {string} [options.onConflict=id] Column used for conflict resolution.
 * @param {number} [options.batchSize=500] Batch size for splitting payloads.
 * @returns {Promise<{inserted:number,returned:Array<Object>}>}
 * @private
 */
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

/**
 * Ensure a value is an array (return empty array otherwise).
 * @param {any} data Value to normalize.
 * @returns {Array<any>} Normalized array.
 * @private
 */
function ensureArray(data) {
	return Array.isArray(data) ? data : [];
}

/**
 * Check whether an object has a valid id (string or number).
 * @param {any} o Candidate object.
 * @returns {boolean}
 * @private
 */
function hasId(o) {
	return o && (typeof o.id === 'string' || typeof o.id === 'number');
}

/**
 * Keys to strip from upstream incubator API before persisting.
 * @private
 */
const INCUBATOR_KEYS = new Set([
	'incubatorId', 'incubator_id', 'id',
	'groupId', 'group_id',
	'incubator', 'group',
	'organisationId', 'organizationId', 'organization_id', 'organisation_id',
]);

/**
 * Remove incubator-owned identifiers from a single row.
 * @param {Object} row Source row.
 * @returns {Object} Sanitized clone.
 * @private
 */
function sanitizeRow(row) {
	if (!row || typeof row !== 'object') return row;
	const copy = { ...row };
	for (const k of Object.keys(copy)) {
		if (INCUBATOR_KEYS.has(k)) delete copy[k];
	}
	return copy;
}

/**
 * Apply {@link sanitizeRow} to a list of rows.
 * @param {Array<Object>} rows Input rows.
 * @returns {Array<Object>} Sanitized rows.
 * @private
 */
function sanitizeRows(rows) {
	return ensureArray(rows).map(sanitizeRow);
}

/**
 * Import events from remote API and upsert into the `event` table.
 * @returns {Promise<{count:number,upserted:number}>}
 */
export async function importEvents() {
	requireApiConfig();
	const items = ensureArray(await getAll('/events', { limit: 100 }));
	const filtered = items.filter(hasId);
	const cleaned = sanitizeRows(filtered);
	const res = await upsertTo('event', cleaned);
	return { count: cleaned.length, upserted: res.inserted };
}

/**
 * Import investors into the `investors` table.
 * @returns {Promise<{count:number,upserted:number}>}
 */
export async function importInvestors() {
	requireApiConfig();
	const items = ensureArray(await getAll('/investors', { limit: 100 }));
	const filtered = items.filter(hasId);
	const cleaned = sanitizeRows(filtered);
	const res = await upsertTo('investors', cleaned);
	return { count: cleaned.length, upserted: res.inserted };
}

/**
 * Import partners into the `partners` table.
 * @returns {Promise<{count:number,upserted:number}>}
 */
export async function importPartners() {
	requireApiConfig();
	const items = ensureArray(await getAll('/partners', { limit: 100 }));
	const filtered = items.filter(hasId);
	const cleaned = sanitizeRows(filtered);
	const res = await upsertTo('partners', cleaned);
	return { count: cleaned.length, upserted: res.inserted };
}

/**
 * Import news with detail expansion (two-phase fetch) into the `news` table.
 * @returns {Promise<{count:number,upserted:number}>}
 */
export async function importNews() {
	requireApiConfig();
	const list = ensureArray(await getAll('/news', { limit: 100 }));
	const ids = list.map((n) => n?.id).filter((v) => v !== undefined && v !== null);

	const details = await mapWithConcurrency(ids, 5, async (id) => {
		try {
			return await getDetail(`/news/${id}`);
		} catch (e) {
			return { id, error: e?.message || String(e) };
		}
	});

	const newsRows = details.filter(hasId);
	const cleaned = sanitizeRows(newsRows);
	const res = await upsertTo('news', cleaned);
	return { count: cleaned.length, upserted: res.inserted };
}

/**
 * Import users into the singular `user` table.
 * @returns {Promise<{count:number,upserted:number}>}
 */
export async function importUsers() {
	requireApiConfig();
	const items = ensureArray(await getAll('/users', { limit: 100 }));
	const filtered = items.filter(hasId);
	const cleaned = sanitizeRows(filtered);
	const res = await upsertTo('user', cleaned);
	return { count: cleaned.length, upserted: res.inserted };
}

/**
 * Import startups and related founders. Founders are derived from either `founders` or
 * `team` arrays in detail payloads. Two tables written: `startup` and `founders`.
 * @returns {Promise<{startups:{count:number,upserted:number},founders:{count:number,upserted:number}}>} Summary.
 */
export async function importStartups() {
	requireApiConfig();
	const base = ensureArray(await getAll('/startups', { limit: 100 }));
	const ids = base.map((s) => s?.id).filter((v) => v !== undefined && v !== null);

	const details = await mapWithConcurrency(ids, 5, async (id) => {
		try {
			return await getDetail(`/startups/${id}`);
		} catch (e) {
			return { id, error: e?.message || String(e) };
		}
	});

	const startupRows = details.filter(hasId);

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
			const sanitized = sanitizeRow(f);
			founderRows.push({ ...sanitized, startup_id: sid });
		}
	}

	const up1 = await upsertTo('startup', sanitizeRows(startupRows));
	let up2 = { inserted: 0 };
	if (founderRows.length) {
		up2 = await upsertTo('founders', founderRows);
	}

	return {
		startups: { count: startupRows.length, upserted: up1.inserted },
		founders: { count: founderRows.length, upserted: up2.inserted },
	};
}

/**
 * Orchestrate all import tasks sequentially, capturing individual errors.
 * @returns {Promise<Object>} Map of task names to result objects or error descriptors.
 */
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



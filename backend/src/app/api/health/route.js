export const runtime = "nodejs";

import { NextResponse } from "next/server";

// Simple in-memory process start time (evaluated on first import)
const startedAt = Date.now();

/**
 * GET /api/health
 * Basic liveness & readiness probe.
 * Returns:
 *  - status: 'ok' | 'degraded'
 *  - uptime: seconds since process start
 *  - timestamp: current ISO time
 *  - version: read from package.json if available (optional)
 *  - checks: individual sub-system checks (filesystem, env, etc.)
 */
export async function GET() {
  const now = Date.now();
  const uptimeSeconds = Math.round((now - startedAt) / 1000);

  const checks = {};
  let overall = 'ok';

  // Example: environment variables required for supabase integration
  const requiredEnv = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  const missing = requiredEnv.filter((k) => !process.env[k]);
  if (missing.length) {
    checks.env = { status: 'fail', missing };
    overall = 'degraded';
  } else {
    checks.env = { status: 'ok' };
  }

  // (Optional) Lightweight filesystem check leveraging existing data dir logic
  try {
    // Lazy import to avoid unnecessary cost if route unused
    const mod = await import('@/lib/db');
    if (typeof mod.getUsers === 'function') {
      await mod.getUsers(); // triggers ensureDataFile
      checks.storage = { status: 'ok' };
    }
  } catch (err) {
    checks.storage = { status: 'fail', error: err?.message || 'unknown' };
    overall = 'degraded';
  }

  // Attempt to read version from package.json (best effort)
  let version = null;
  try {
    // Using dynamic import with assert for ESM; path relative to project root.
    const pkg = await import('../../../package.json', { assert: { type: 'json' } }).catch(() => null);
    version = pkg?.default?.version || null;
  } catch { /* ignore */ }

  return NextResponse.json({
    status: overall,
    uptime: uptimeSeconds,
    timestamp: new Date(now).toISOString(),
    version,
    checks,
  });
}

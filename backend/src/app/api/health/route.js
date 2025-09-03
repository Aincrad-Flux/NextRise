export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from 'node:fs/promises';
import path from 'node:path';

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

  // Attempt to read version from package.json (best effort, cached after first read)
  let version = null;
  try {
    if (globalThis.__APP_PKG_VERSION === undefined) {
      const pkgPath = path.join(process.cwd(), 'package.json');
      const raw = await fs.readFile(pkgPath, 'utf8');
      globalThis.__APP_PKG_VERSION = JSON.parse(raw)?.version || null;
    }
    version = globalThis.__APP_PKG_VERSION;
  } catch { /* ignore */ }

  return NextResponse.json({
    status: overall,
    uptime: uptimeSeconds,
    timestamp: new Date(now).toISOString(),
    version,
    checks,
  });
}

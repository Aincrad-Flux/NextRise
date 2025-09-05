// Simple logging utility to log incoming requests and outgoing responses in JSON.
// Usage: export const POST = withLogging(async (req) => { ... })

import { NextResponse } from "next/server";

function safeJsonParse(str) {
  try { return JSON.parse(str); } catch { return str; }
}

async function cloneRequestData(req) {
  const { method, headers } = req;
  let body = null;
  if (method !== 'GET' && method !== 'HEAD') {
    try {
      const text = await req.text();
      body = safeJsonParse(text);
    } catch {
      body = null;
    }
  }
  const headerObj = {};
  headers.forEach((v,k)=>{ headerObj[k] = v; });
  return { method, url: req.url, headers: headerObj, body };
}

async function cloneResponseData(res) {
  if (!res) return null;
  const headers = {};
  res.headers.forEach((v,k)=>{ headers[k] = v; });
  let body = null;
  try {
    // We need to clone first else body gets consumed
    const clone = res.clone();
    const text = await clone.text();
    body = safeJsonParse(text);
  } catch {
    body = null;
  }
  return { status: res.status, headers, body };
}

export function withLogging(handler) {
  return async function loggedHandler(req, ctx) {
    const start = Date.now();
    let requestData;
    try {
      requestData = await cloneRequestData(req);
    } catch (e) {
      requestData = { error: 'could_not_read_request', details: String(e) };
    }
    console.log('[API][IN]', JSON.stringify(requestData));

    let response;
    try {
      response = await handler(req, ctx);
    } catch (err) {
      console.error('[API][ERR]', err);
      response = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    try {
      const responseData = await cloneResponseData(response);
      const duration = Date.now() - start;
      console.log('[API][OUT]', JSON.stringify({ ...responseData, durationMs: duration }));
    } catch (e) {
      console.error('[API][LOG_OUT_FAIL]', e);
    }
    return response;
  };
}

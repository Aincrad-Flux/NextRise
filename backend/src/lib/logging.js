// Simple logging utility to log incoming requests and outgoing responses in JSON.
// Usage: export const POST = withLogging(async (req) => { ... })

import { NextResponse } from "next/server";
import { logger } from "@/lib/fileLogger";

function safeJsonParse(str) {
  try { return JSON.parse(str); } catch { return str; }
}

async function cloneRequestData(originalReq) {
  // We purposefully clone so that the original body stream remains readable by the route handler.
  const req = originalReq.clone();
  const { method, headers } = req;
  let body = null;
  let rawBodyText = null;
  if (method !== 'GET' && method !== 'HEAD') {
    try {
      rawBodyText = await req.text();
      body = safeJsonParse(rawBodyText);
    } catch {
      body = null;
    }
  }
  const headerObj = {};
  headers.forEach((v,k)=>{ headerObj[k] = v; });
  return { method, url: req.url, headers: headerObj, body, rawBodyText };
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

function redact(data) {
  if (data && data.body && typeof data.body === 'object') {
    if (data.body.password) data.body.password = '[REDACTED]';
    if (data.body.pass) data.body.pass = '[REDACTED]';
  }
  return data;
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
    redact(requestData);
    logger.info('api_in', { method: requestData.method, url: requestData.url, headers: requestData.headers, body: requestData.body });

    // Provide a wrapped request whose json()/text() return cached body to avoid double parsing issues if handler calls them multiple times.
    let wrappedReq = req;
    if (requestData.rawBodyText !== null) {
      const cachedText = requestData.rawBodyText;
      let parsedOnce = false;
      let parsedValue;
      wrappedReq = new Proxy(req, {
        get(target, prop) {
          if (prop === 'text') {
            return async () => cachedText;
          }
          if (prop === 'json') {
            return async () => {
              if (!parsedOnce) {
                try { parsedValue = JSON.parse(cachedText); } catch { parsedValue = {}; }
                parsedOnce = true;
              }
              return parsedValue;
            };
          }
          return Reflect.get(target, prop);
        }
      });
    }

    let response;
    try {
      response = await handler(wrappedReq, ctx);
    } catch (err) {
      logger.error('api_err', { error: String(err && err.stack || err) });
      response = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    try {
      const responseData = await cloneResponseData(response);
      const duration = Date.now() - start;
      logger.info('api_out', { ...responseData, durationMs: duration });
    } catch (e) {
      logger.error('api_log_out_fail', { error: String(e) });
    }
    return response;
  };
}

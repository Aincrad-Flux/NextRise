// Next.js instrumentation hook (loaded when NEXT_RUNTIME instrumentation enabled)
// Logs all outgoing fetch requests + responses (server side only)

// Avoid importing Node-only modules in Edge. We'll provide a console-based logger
// for Edge and dynamically import the file logger in Node runtime.
let logger = {
  info: (msg, data) => console.log(JSON.stringify({ ts: new Date().toISOString(), level: 'info', msg, ...data })),
  warn: (msg, data) => console.warn(JSON.stringify({ ts: new Date().toISOString(), level: 'warn', msg, ...data })),
  error: (msg, data) => console.error(JSON.stringify({ ts: new Date().toISOString(), level: 'error', msg, ...data })),
};

// Next replaces process.env.NEXT_RUNTIME at build time. If not Edge, try to load file logger.
if (typeof process !== 'undefined' && process.env && process.env.NEXT_RUNTIME !== 'edge') {
  // Dynamic import to keep Edge bundle clean.
  import("@/lib/fileLogger").then(mod => {
    if (mod && mod.logger) logger = mod.logger;
  }).catch(() => { /* keep console logger */ });
}

const originalFetch = global.fetch;

function safeJsonParse(str) { try { return JSON.parse(str); } catch { return str; } }

function redact(obj) {
  if (obj && obj.body && typeof obj.body === 'object') {
    if (obj.body.password) obj.body.password = '[REDACTED]';
    if (obj.body.pass) obj.body.pass = '[REDACTED]';
  }
  return obj;
}

global.fetch = async function loggedFetch(resource, init = {}) {
  const start = Date.now();
  let url = typeof resource === 'string' ? resource : resource.url;
  const method = (init && init.method) || (resource && resource.method) || 'GET';
  let requestBody = null;
  try {
    if (init && init.body) {
  if (typeof init.body === 'string') requestBody = safeJsonParse(init.body);
  else if (typeof Buffer !== 'undefined' && Buffer.isBuffer && Buffer.isBuffer(init.body)) requestBody = init.body.toString('utf8');
      else requestBody = '[unserializable body]';
    }
  } catch {}
  redact({ body: requestBody });
  logger.info('fetch_out', { method, url, body: requestBody });
  try {
    const res = await originalFetch(resource, init);
    let responseBody = null;
    try {
      const clone = res.clone();
      const text = await clone.text();
      responseBody = safeJsonParse(text);
    } catch {}
    redact({ body: responseBody });
    const duration = Date.now() - start;
    logger.info('fetch_in', { url, status: res.status, durationMs: duration, body: responseBody });
    return res;
  } catch (err) {
    const duration = Date.now() - start;
    logger.error('fetch_err', { url, method, durationMs: duration, error: String(err) });
    throw err;
  }
};

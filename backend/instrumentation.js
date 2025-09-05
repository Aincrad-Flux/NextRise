// Next.js instrumentation hook (loaded when NEXT_RUNTIME instrumentation enabled)
// Logs all outgoing fetch requests + responses (server side only)

const originalFetch = global.fetch;

function safeJsonParse(str) { try { return JSON.parse(str); } catch { return str; } }

global.fetch = async function loggedFetch(resource, init = {}) {
  const start = Date.now();
  let url = typeof resource === 'string' ? resource : resource.url;
  const method = (init && init.method) || (resource && resource.method) || 'GET';
  let requestBody = null;
  try {
    if (init && init.body) {
      if (typeof init.body === 'string') requestBody = safeJsonParse(init.body);
      else if (Buffer.isBuffer(init.body)) requestBody = init.body.toString('utf8');
      else requestBody = '[unserializable body]';
    }
  } catch {}
  console.log('[FETCH][OUT]', JSON.stringify({ method, url, body: requestBody }));
  try {
    const res = await originalFetch(resource, init);
    let responseBody = null;
    try {
      const clone = res.clone();
      const text = await clone.text();
      responseBody = safeJsonParse(text);
    } catch {}
    const duration = Date.now() - start;
    console.log('[FETCH][IN]', JSON.stringify({ url, status: res.status, durationMs: duration, body: responseBody }));
    return res;
  } catch (err) {
    const duration = Date.now() - start;
    console.error('[FETCH][ERR]', JSON.stringify({ url, method, durationMs: duration, error: String(err) }));
    throw err;
  }
};

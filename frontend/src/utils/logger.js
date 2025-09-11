// Simple browser logger that sends logs to the Vite dev server endpoint /_log
// In production (static build) this endpoint does not exist. You should
// forward logs to your backend instead (e.g. fetch('/api/log', ...)).

const queue = []
let flushing = false

function send(payload) {
  const body = JSON.stringify(payload)
  // Prefer sendBeacon (fire and forget, good for unload events)
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' })
    navigator.sendBeacon('/_log', blob)
    return
  }
  fetch('/_log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {})
}

function enqueue(level, args) {
  queue.push({ level, msg: args.map(normalize).join(' '), time: Date.now() })
  flushSoon()
}

function normalize(v) {
  if (v instanceof Error) {
    return v.stack || v.message
  }
  if (typeof v === 'object') {
    try { return JSON.stringify(v) } catch { return '[unserializable]' }
  }
  return String(v)
}

function flushSoon() {
  if (flushing) return
  flushing = true
  setTimeout(() => {
    let item
    while ((item = queue.shift())) {
      send(item)
    }
    flushing = false
  }, 200)
}

export const logger = {
  debug: (...a) => enqueue('debug', a),
  info: (...a) => enqueue('info', a),
  warn: (...a) => enqueue('warn', a),
  error: (...a) => enqueue('error', a),
}

// Optionally hook into window errors
export function setupGlobalErrorLogging() {
  window.addEventListener('error', (e) => {
    logger.error('GlobalError', e.error || e.message)
  })
  window.addEventListener('unhandledrejection', (e) => {
    logger.error('UnhandledRejection', e.reason)
  })
}

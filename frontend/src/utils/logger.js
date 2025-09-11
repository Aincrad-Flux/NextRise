/**
 * Browser logging utilities.
 * Sends logs to the dev server endpoint `/_log` during development.
 * In production, consider forwarding logs to your backend.
 * @module logger
 */

const queue = []
let flushing = false

/**
 * Send a single log payload.
 * @param {{level:string,msg:string,time:number}} payload
 * @private
 */
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

/**
 * Enqueue a log line and schedule a flush.
 * @param {string} level
 * @param {any[]} args
 * @private
 */
function enqueue(level, args) {
  queue.push({ level, msg: args.map(normalize).join(' '), time: Date.now() })
  flushSoon()
}

/**
 * Normalize input values to strings for log transport.
 * @param {any} v
 * @returns {string}
 * @private
 */
function normalize(v) {
  if (v instanceof Error) {
    return v.stack || v.message
  }
  if (typeof v === 'object') {
    try { return JSON.stringify(v) } catch { return '[unserializable]' }
  }
  return String(v)
}

/**
 * Schedule a near-future flush of the queue.
 * @private
 */
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

/**
 * Logger API with four levels.
 * @type {{debug:Function,info:Function,warn:Function,error:Function}}
 */
export const logger = {
  debug: (...a) => enqueue('debug', a),
  info: (...a) => enqueue('info', a),
  warn: (...a) => enqueue('warn', a),
  error: (...a) => enqueue('error', a),
}

/**
 * Optionally hook global error and unhandledrejection to the logger.
 */
export function setupGlobalErrorLogging() {
  window.addEventListener('error', (e) => {
    logger.error('GlobalError', e.error || e.message)
  })
  window.addEventListener('unhandledrejection', (e) => {
    logger.error('UnhandledRejection', e.reason)
  })
}

import fs from 'fs';
import path from 'path';

const DEFAULT_PATH = process.env.LOG_FILE || path.join(process.cwd(), 'logs', 'app.log');
const ENABLE_STDOUT = (process.env.LOG_STDOUT || 'true').toLowerCase() !== 'false';

let stream = null;
function ensureStream() {
  if (stream) return stream;
  const dir = path.dirname(DEFAULT_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  stream = fs.createWriteStream(DEFAULT_PATH, { flags: 'a' });
  return stream;
}

function format(level, message, data) {
  const line = {
    ts: new Date().toISOString(),
    level,
    msg: message,
    ...data,
  };
  return JSON.stringify(line);
}

export function logLine(level, message, data = {}) {
  const line = format(level, message, data);
  try {
    ensureStream().write(line + '\n');
  } catch (e) {
    // fallback
    if (ENABLE_STDOUT) console.error('FILE_LOG_FAIL', e);
  }
  if (ENABLE_STDOUT) {
    const printer = level === 'error' ? console.error : console.log;
    printer(line);
  }
}

export const logger = {
  info: (msg, data) => logLine('info', msg, data),
  error: (msg, data) => logLine('error', msg, data),
  warn: (msg, data) => logLine('warn', msg, data),
};

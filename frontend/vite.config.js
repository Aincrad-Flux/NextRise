import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// Simple dev logging plugin: accepts POST /_log and writes lines to logs/YYYY-MM-DD.log
function dailyFileLogger() {
  return {
    name: 'daily-file-logger',
    configureServer(server) {
      server.middlewares.use('/_log', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }
        try {
          const chunks = []
            for await (const chunk of req) {
              chunks.push(chunk)
            }
          const body = Buffer.concat(chunks).toString('utf8') || '{}'
          const now = new Date()
          const datePart = now.toISOString().slice(0, 10)
          const logsDir = path.join(process.cwd(), 'logs')
          if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true })
          const filePath = path.join(logsDir, `${datePart}.log`)
          const line = JSON.stringify({ ts: now.toISOString(), ...safeJsonParse(body) }) + '\n'
          fs.appendFile(filePath, line, (err) => {
            if (err) console.error('Failed to write log', err)
          })
          res.statusCode = 204
          res.end()
        } catch (e) {
          console.error('[daily-file-logger] error', e)
          res.statusCode = 500
          res.end('error')
        }
      })
    },
  }
}

function safeJsonParse(str) {
  try { return JSON.parse(str) } catch { return { message: str } }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), dailyFileLogger()],
  server: {
    allowedHosts: ['dev.devgoblin.me'],
    // Proxy API calls in dev to the backend to avoid 404s when the frontend origin is used
  proxy: {
      '/api': {
    // Prefer explicit env if provided (via docker-compose or local); fallback to localhost for non-docker dev
    target: process.env.VITE_BACKEND_URL || 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        // Preserve cookies and headers for auth
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            // Ensure Set-Cookie is passed through unmodified
            const sc = proxyRes.headers['set-cookie'];
            if (sc && Array.isArray(sc)) {
              proxyRes.headers['set-cookie'] = sc.map((c) => c.replace(/;\s*secure/gi, ''));
            }
          });
        },
      },
    },
  },
})

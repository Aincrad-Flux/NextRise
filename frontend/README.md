# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Dev Daily Logger

Implemented a simple daily log system for development:

1. Vite plugin (`vite.config.js`) exposes `POST /_log` and writes JSON lines into `logs/YYYY-MM-DD.log`.
2. Browser logger utility at `src/utils/logger.js` with methods: `logger.debug|info|warn|error(...)`.
3. Automatically captures global errors & unhandled promise rejections.

Example usage inside any component:

```js
import { logger } from '../utils/logger.js'
logger.info('User clicked', { button: 'save' })
```

Files are created only while running `npm run dev`. For production (static build via Nginx) the browser cannot write files; forward logs to your backend API instead (e.g. create an `/api/log` endpoint server-side and adapt `send()` in `logger.js`).

Log line format (JSONL):

```json
{"ts":"2025-09-09T12:34:56.789Z","level":"info","msg":"Frontend starting...","time":1694262896789}
```

You can tail today’s log:

```bash
tail -f logs/$(date +%F).log
```

Limitations:
- Dev only (no log endpoint in production image)
- Not rotation-aware beyond daily file name
- No size limit (manually clean `logs/` if needed)

To extend:
- Replace `/ _log` with your backend route
- Add user/session context to each payload
- Batch and compress if network overhead becomes significant

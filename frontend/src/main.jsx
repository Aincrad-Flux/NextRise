import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { logger, setupGlobalErrorLogging } from './utils/logger.js'

// Initialize logging (dev only endpoint)
setupGlobalErrorLogging()
logger.info('Frontend starting...')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

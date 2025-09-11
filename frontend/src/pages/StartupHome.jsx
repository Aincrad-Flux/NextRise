import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar.jsx'
import Dashboard from '../components/Dashboard.jsx'
import Sidebar from '../components/Sidebar.jsx'
import StartupProjects from './StartupProjects.jsx'
import StartupProfile from './StartupProfile.jsx'
import StartupMessager from './Messaging.jsx'
import StartupOpportunities from './Opportunities.jsx'

import './Home.css'
import { logger } from '../utils/logger.js'

export default function StartupHome() {
  const [section, setSection] = useState('general')
  const navigate = useNavigate()
  // user removed: Sidebar/UserCard now fetch real user via /api/auth/me

  async function handleLogout() {
    const API_BASE = import.meta?.env?.VITE_BACKEND_URL?.replace(/\/$/, '') || ''
    const url = new URL('/api/auth/logout', API_BASE || window.location.origin)
    logger.info('Logout start', { endpoint: String(url) })
    try {
      const res = await fetch(url, { method: 'POST', credentials: 'include' })
      logger.info('Logout response', { status: res.status, ok: res.ok })
    } catch (e) {
      logger.warn('Logout request failed', e)
    } finally {
      navigate('/')
    }
  }

  return (
    <div className="home-container">
      <TopBar />
      <div className="layout">
        <Sidebar active={section} onSelect={setSection} onLogout={handleLogout} />
        <main className="home-main">
          {section === 'general' && <Dashboard />}
          {section === 'projects' && <StartupProjects embedded />}
          {section === 'profile' && <StartupProfile />}
          {section === 'opportunities' && <StartupOpportunities />}
          {section === 'messaging' && <StartupMessager />}
        </main>
      </div>
    </div>
  )
}

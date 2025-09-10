import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar.jsx'
import Dashboard from '../components/Dashboard.jsx'
import Sidebar from '../components/Sidebar.jsx'
import StartupProjects from './StartupProjects.jsx'
// NOTE: case fixed (Home.css) so styles apply on case-sensitive systems
import './Home.css'
import { logger } from '../utils/logger.js'

export default function StartupHome() {
  const [section, setSection] = useState('general')
  const navigate = useNavigate()
  // TODO: replace mock user with real auth context when available
  const user = {
    firstName: 'Jean',
    lastName: 'Dupont',
    role: 'Startup',
  }

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
  <Sidebar active={section} onSelect={setSection} user={user} onLogout={handleLogout} />
        <main className="home-main">
          {section === 'general' && <Dashboard />}
          {section === 'projects' && <StartupProjects embedded />}
          {section !== 'general' && section !== 'projects' && (
            <div className="placeholder panel">
              <div className="panel-header"><h2>{labelFor(section)}</h2></div>
              <div style={{ padding: '1rem' }}>
                <p>Contenu pour la section {labelFor(section)} à venir.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function labelFor(key) {
  switch (key) {
    case 'startups': return 'Startups'
    case 'projects': return 'Projets'
    case 'investors': return 'Investisseurs'
    case 'mentors': return 'Mentors'
    default: return 'Général'
  }
}

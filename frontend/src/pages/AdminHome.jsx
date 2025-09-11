import { useState } from 'react'
import TopBar from '../components/TopBar.jsx'
import AdminSidebar from '../components/AdminSidebar.jsx'
import DataManager from '../components/DataManager.jsx'
import './AdminHome.css'
import { logger } from '../utils/logger.js'

export default function AdminHome() {
  const [section, setSection] = useState('dashboard')

  async function handleLogout() {
    const API_BASE = import.meta?.env?.VITE_BACKEND_URL?.replace(/\/$/, '') || ''
    const url = new URL('/api/auth/logout', API_BASE || window.location.origin)
    logger.info('Admin logout start', { endpoint: String(url) })
    try {
      const res = await fetch(url, { method: 'POST', credentials: 'include' })
      logger.info('Admin logout response', { status: res.status, ok: res.ok })
    } catch (e) {
      logger.warn('Admin logout request failed', e)
    } finally {
      window.location.href = '/'
    }
  }

  return (
    <div className="admin-home">
      <TopBar />
      <div className="admin-layout">
        <AdminSidebar active={section} onSelect={setSection} onLogout={handleLogout} />
        <main className="admin-main">
          {section === 'dashboard' && (
            <div className="admin-panel">
              <div className="admin-panel__header"><h2 className="admin-panel__title">Admin dashboard</h2></div>
              <div style={{padding:'1rem'}}>
                <p>Welcome. Select a collection on the left to manage data.</p>
              </div>
            </div>
          )}
          {section === 'projects' && <DataManager resource="startup" />}
          {section === 'news' && <DataManager resource="news" />}
          {section === 'events' && <DataManager resource="events" />}
          {section === 'users' && <DataManager resource="user" />}
        </main>
      </div>
    </div>
  )
}

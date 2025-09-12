import { useState } from 'react'
import { useSession } from '../components/SessionProvider.jsx'
import TopBar from '../components/TopBar.jsx'
import AdminSidebar from '../components/AdminSidebar.jsx'
import DataManager from '../components/DataManager.jsx'
import AdminDashboard from '../components/AdminDashboard.jsx'
import './AdminHome.css'
import { logger } from '../utils/logger.js'

export default function AdminHome() {
  const [section, setSection] = useState('dashboard')
  const { logout } = useSession()

  async function handleLogout() { await logout(); window.location.href = '/' }

  return (
    <div className="admin-home">
      <TopBar />
      <div className="admin-layout">
        <AdminSidebar active={section} onSelect={setSection} onLogout={handleLogout} />
        <main className="admin-main">
          {section === 'dashboard' && <AdminDashboard />}
          {section === 'projects' && <DataManager resource="startup" />}
          {section === 'news' && <DataManager resource="news" />}
          {section === 'events' && <DataManager resource="events" />}
          {section === 'users' && <DataManager resource="user" textAlign="left" />}
        </main>
      </div>
    </div>
  )
}

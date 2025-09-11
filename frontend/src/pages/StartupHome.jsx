import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../components/SessionProvider.jsx'
import TopBar from '../components/TopBar.jsx'
import Dashboard from '../components/Dashboard.jsx'
import StartupProjects from './StartupProjects.jsx'
import StartupProfile from './StartupProfile.jsx'
import StartupMessager from './Messaging.jsx'
import StartupOpportunities from './Opportunities.jsx'

import './Home.css'
import { logger } from '../utils/logger.js'

export default function StartupHome() {
  const [section, setSection] = useState('general')
  const navigate = useNavigate()
  const { logout } = useSession()
  // user removed: Sidebar/UserCard now fetch real user via /api/auth/me

  async function handleLogout() { await logout(); navigate('/') }

  return (
    <div className="home-container">
  <TopBar startupSection={section} onStartupSectionChange={setSection} />
      <div className="layout" style={{display:'block'}}>
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

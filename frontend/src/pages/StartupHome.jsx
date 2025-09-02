import { useState } from 'react'
import TopBar from '../components/TopBar.jsx'
import Dashboard from '../components/Dashboard.jsx'
import Sidebar from '../components/Sidebar.jsx'
import './home.css'

export default function StartupHome() {
  const [section, setSection] = useState('general')
  // TODO: replace mock user with real auth context when available
  const user = {
    firstName: 'Jean',
    lastName: 'Dupont',
    role: 'Startup',
  }

  function handleLogout() {
    // Placeholder logout (clear tokens / redirect when auth implemented)
    // eslint-disable-next-line no-alert
    alert('Déconnexion... (à implémenter)')
  }

  return (
    <div className="home-container">
      <TopBar />
      <div className="layout">
  <Sidebar active={section} onSelect={setSection} user={user} onLogout={handleLogout} />
        <main className="home-main">
          {section === 'general' && <Dashboard />}
          {section !== 'general' && (
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

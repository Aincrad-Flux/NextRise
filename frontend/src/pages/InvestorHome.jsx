import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../components/SessionProvider.jsx'
import TopBar from '../components/TopBar.jsx'
import InvestorDashboard from '../components/InvestorDashboard.jsx'
import Opportunities from './Opportunities.jsx'
import Messaging from './Messaging.jsx'
import InvestorProjectsAll from './InvestorProjectsAll.jsx'
import InvestorProjectsInvested from './InvestorProjectsInvested.jsx'
import { InvestorProjectsProvider } from '../components/InvestorProjectsContext.jsx'
import './Home.css'

// Investor home mirrors StartupHome layout but with investor-focused sections.
// Sections: general (KPI dashboard), opportunities (deal flow), messaging, profile.
export default function InvestorHome() {
  const [section, setSection] = useState('general')
  const navigate = useNavigate()
  const { logout, user } = useSession()

  async function handleLogout() { await logout(); navigate('/') }

  return (
    <InvestorProjectsProvider>
      <div className="home-container">
        <TopBar investorSection={section} onInvestorSectionChange={setSection} />
        <div className="layout" style={{display:'block'}}>
          <main className="home-main">
            {section === 'general' && <InvestorDashboard />}
            {section === 'all-projects' && <InvestorProjectsAll />}
            {section === 'investments' && <InvestorProjectsInvested />}
            {section === 'opportunities' && <Opportunities embedded />}
            {section === 'messaging' && <Messaging />}
          </main>
        </div>
      </div>
    </InvestorProjectsProvider>
  )
}

import TopBar from '../components/TopBar.jsx'
import Dashboard from '../components/Dashboard.jsx'
import './home.css'

export default function Home() {
  return (
    <div className="home-container">
      <TopBar />
      <main className="home-main">
        <Dashboard />
      </main>
    </div>
  )
}

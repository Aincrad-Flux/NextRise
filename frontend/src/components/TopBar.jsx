import homeIcon from '../assets/home.svg'
import './TopBar.css'

export default function TopBar() {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="brand">JEB Incubator</h1>
        <a href="/" className="home-link" aria-label="Aller à l'accueil">
          <img src={homeIcon} alt="Accueil" className="home-icon" />
        </a>
      </div>
      {/* Center navigation */}
      <nav className="topbar-nav" aria-label="Principale">
        <a href="/projects" className="nav-btn">Projects</a>
        <a href="/news" className="nav-btn">News</a>
        <a href="/events" className="nav-btn">Events</a>
        <a href="/advanced-search" className="nav-btn">Advanced Search</a>
        <a href="/about" className="nav-btn">About</a>
      </nav>
      <div className="topbar-right">
        <input className="search" placeholder="Search..." />
        <div className="avatar" aria-label="profile" />
      </div>
    </header>
  )
}

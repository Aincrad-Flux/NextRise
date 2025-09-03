import homeIcon from '../assets/home.svg'
import './TopBar.css'
import { useLocation } from 'react-router-dom'

export default function TopBar() {
  const { pathname } = useLocation()
  const isStartup = pathname.startsWith('/startup')
  return (
    <header className={`topbar${isStartup ? ' no-nav' : ''}`}>
      <div className="topbar-left">
        <h1 className="brand">JEB Incubator</h1>
        <a href="/" className="home-link" aria-label="Aller à l'accueil">
          <img src={homeIcon} alt="Accueil" className="home-icon" />
        </a>
      </div>
      {!isStartup && (
        <nav className="topbar-nav" aria-label="Principale">
          <a href="/projects" className="nav-btn">Projects</a>
          <a href="/news" className="nav-btn">News</a>
          <a href="/events" className="nav-btn">Events</a>
          <a href="/advanced-search" className="nav-btn">Advanced Search</a>
          <a href="/about" className="nav-btn">About</a>
        </nav>
      )}
      <div className="topbar-right">
        {!isStartup && (
          // TODO: replace with real auth links when available
          <div className="auth-buttons" aria-label="Authentication">
            <a href="/startup" className="auth-btn sign-in" role="button">Sign in</a>
            <a href="/login" className="auth-btn sign-up" role="button">Sign up</a>
          </div>
        )}
      {isStartup && (
        <div className="avatar" aria-label="profile" />
      )}
      </div>
    </header>
  )
}

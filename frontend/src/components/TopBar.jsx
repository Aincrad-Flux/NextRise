import homeIcon from '../assets/home.svg'
import './TopBar.css'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function TopBar() {
  const { pathname } = useLocation()
  const isStartup = pathname.startsWith('/startup')
  const [menuOpen, setMenuOpen] = useState(false)

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Lock scroll and close with ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    if (menuOpen) {
      document.documentElement.style.overflow = 'hidden'
      window.addEventListener('keydown', onKey)
    } else {
      document.documentElement.style.overflow = ''
    }
    return () => {
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

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

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {!menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="mobile-menu-overlay" role="dialog" aria-modal="true" onClick={() => setMenuOpen(false)}>
          <div
            id="mobile-menu"
            className="mobile-menu"
            aria-label="Menu principal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-menu-header">
              <span className="brand brand-mobile">JEB Incubator</span>
              <button type="button" className="menu-close" aria-label="Fermer le menu" onClick={() => setMenuOpen(false)}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {!isStartup && (
              <nav className="mobile-nav" aria-label="Navigation mobile">
                <a href="/projects" className="nav-btn" onClick={() => setMenuOpen(false)}>Projects</a>
                <a href="/news" className="nav-btn" onClick={() => setMenuOpen(false)}>News</a>
                <a href="/events" className="nav-btn" onClick={() => setMenuOpen(false)}>Events</a>
                <a href="/advanced-search" className="nav-btn" onClick={() => setMenuOpen(false)}>Advanced Search</a>
                <a href="/about" className="nav-btn" onClick={() => setMenuOpen(false)}>About</a>
              </nav>
            )}

            <div className="mobile-actions">
              {!isStartup ? (
                <div className="auth-buttons">
                  <a href="/startup" className="auth-btn sign-in" role="button" onClick={() => setMenuOpen(false)}>Sign in</a>
                  <a href="/login" className="auth-btn sign-up" role="button" onClick={() => setMenuOpen(false)}>Sign up</a>
                </div>
              ) : (
                <div className="profile-row">
                  <div className="avatar" aria-label="profile" />
                  <div className="profile-meta">
                    <span>Mon espace</span>
                    <a href="/startup" className="nav-btn" onClick={() => setMenuOpen(false)}>Aller au dashboard</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

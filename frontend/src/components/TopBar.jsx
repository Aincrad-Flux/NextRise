
import homeIcon from '../assets/home.svg';
import sunIcon from '../assets/sun.svg';
import moonIcon from '../assets/moon.svg';
import './TopBar.css';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AvatarMenu from './AvatarMenu';

/**
 * TopBar component.
 * Global navigation bar with theme toggle and responsive mobile menu.
 * Shows auth buttons on public pages and profile menu on startup/admin sections.
 * @component
 */
export default function TopBar() {
  const { pathname } = useLocation();
  const isStartup = pathname.startsWith('/startup');
  const isAdmin = pathname.startsWith('/admin');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme-dark');
      if (stored !== null) return stored === 'true';
      return document.body.classList.contains('theme-dark');
    }
    return false;
  });

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock scroll and close with ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    if (menuOpen) {
      document.documentElement.style.overflow = 'hidden';
      window.addEventListener('keydown', onKey);
    } else {
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (dark) {
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.remove('theme-dark');
    }
    localStorage.setItem('theme-dark', dark);
  }, [dark]);

  const handleThemeToggle = () => {
    setDark((prev) => !prev);
  };

  return (
  <header className={`topbar${(isStartup || isAdmin) ? ' no-nav' : ''}`}>
      <div className="topbar-left">
        <h1 className="brand">JEB Incubator</h1>
        <a href="/" className="home-link" aria-label="Go to home">
          <img src={homeIcon} alt="Home" className="home-icon" />
        </a>
        <button
          type="button"
          className="theme-toggle-btn"
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={handleThemeToggle}
          style={{
            marginLeft: '0.5rem',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            padding: '0.3rem 0.6rem',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'background .2s, color .2s',
          }}
        >
          <img
      src={dark ? sunIcon : moonIcon}
      alt={dark ? 'Sun icon' : 'Moon icon'}
            style={{ width: 20, height: 20 }}
          />
        </button>
      </div>
  {!(isStartup || isAdmin) && (
    <nav className="topbar-nav" aria-label="Primary">
          <a href="/projects" className="nav-btn">Projects</a>
          <a href="/news" className="nav-btn">News</a>
          <a href="/events" className="nav-btn">Events</a>
        </nav>
      )}
  <div className="topbar-right">
    {!(isStartup || isAdmin) && (
          <div className="auth-buttons" aria-label="Authentication">
            <a href="/login" className="auth-btn sign-in" role="button">Sign in</a>
            <a href="/login#signup" className="auth-btn sign-up" role="button">Sign up</a>
          </div>
        )}
        {(isStartup || isAdmin) && (
          <AvatarMenu />
        )}

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
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
            aria-label="Main menu"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-menu-header">
              <span className="brand brand-mobile">JEB Incubator</span>
              <button type="button" className="menu-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {!(isStartup || isAdmin) && (
              <nav className="mobile-nav" aria-label="Mobile navigation">
                <a href="/projects" className="nav-btn" onClick={() => setMenuOpen(false)}>Projects</a>
                <a href="/news" className="nav-btn" onClick={() => setMenuOpen(false)}>News</a>
                <a href="/events" className="nav-btn" onClick={() => setMenuOpen(false)}>Events</a>
              </nav>
            )}

            <div className="mobile-actions">
              {!(isStartup || isAdmin) ? (
                <div className="auth-buttons">
                  <a href="/login" className="auth-btn sign-in" role="button" onClick={() => setMenuOpen(false)}>Sign in</a>
                  <a href="/login#signup" className="auth-btn sign-up" role="button" onClick={() => setMenuOpen(false)}>Sign up</a>
                </div>
              ) : (
                <div className="profile-row" style={{alignItems:'flex-start'}}>
                  <div style={{marginTop:2}}>
                    <AvatarMenu />
                  </div>
                  <div className="profile-meta">
                    <span>My space</span>
                    <a href="/startup" className="nav-btn" onClick={() => setMenuOpen(false)}>Go to dashboard</a>
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

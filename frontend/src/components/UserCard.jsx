import { useEffect, useState } from 'react'
import './UserCard.css'

// UserCard will fetch /api/auth/me itself if no user prop passed.
// Expected backend shape: { user: { firstName, lastName, role, ... } }
export default function UserCard({ user: userProp, onLogout, avatarImage }) {
  const [user, setUser] = useState(userProp || null)
  const [loading, setLoading] = useState(!userProp)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (userProp) return // external user provided
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const API_BASE = import.meta?.env?.VITE_BACKEND_URL?.replace(/\/$/, '') || ''
        const url = new URL('/api/auth/me', API_BASE || window.location.origin)
        const res = await fetch(url, { credentials: 'include' })
        if (!res.ok) throw new Error('HTTP ' + res.status)
        const data = await res.json()
        if (!cancelled) setUser(data?.user || null)
      } catch (e) {
        if (!cancelled) setError(e.message || 'Erreur chargement')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [userProp])

  if (loading) {
    return (
      <div className="user-card" aria-busy="true" aria-live="polite">
        <div className="user-avatar skeleton" aria-hidden="true" />
        <div className="user-info" style={{ flex: 1 }}>
          <div className="user-name skeleton" style={{ width: '70%', height:'0.9rem' }} />
          <div className="user-role skeleton" style={{ width: '40%', height:'0.7rem', marginTop:'0.4rem' }} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="user-card" role="alert" style={{ flexDirection:'column', alignItems:'flex-start', gap:'0.5rem' }}>
        <div style={{ fontSize:'0.85rem', color:'#b00' }}>Erreur profil: {error}</div>
        <button type="button" className="logout-btn" onClick={() => { setError(null); setLoading(true); setUser(null); }}>
          Réessayer
        </button>
      </div>
    )
  }

  if (!user) return null

  // Normalize fields (support legacy firstName/lastName OR new single name)
  let { firstName, lastName, role, name, email, founder_id, investor_id } = user
  if ((!firstName && !lastName) && name) {
    const parts = String(name).trim().split(/\s+/)
    firstName = parts[0]
    lastName = parts.slice(1).join(' ') || ''
  }
  const initials = (firstName?.[0] || name?.[0] || '').toUpperCase() + (lastName?.[0] || (name?.split(/\s+/)[1]?.[0]) || '').toUpperCase()
  let displayRole = role
  if (role === 'user') {
    if (founder_id) displayRole = 'Founder'
    else if (investor_id) displayRole = 'Investor'
  }

  return (
    <div className="user-card" aria-label="Profil utilisateur">
      <div className="user-avatar" aria-hidden="true">
        {avatarImage ? (
          <img src={avatarImage} alt="Avatar utilisateur" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}} />
        ) : (
          initials
        )}
      </div>
      <div className="user-info">
  <div className="user-name">{firstName} {lastName}</div>
  {displayRole && <div className="user-role">{displayRole}</div>}
  {!displayRole && email && <div className="user-role" style={{ opacity:0.8 }}>{email}</div>}
      </div>
      {onLogout && <button className="logout-btn" onClick={onLogout} type="button">log out</button>}
    </div>
  )
}

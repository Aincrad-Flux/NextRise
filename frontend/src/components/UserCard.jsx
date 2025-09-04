import './UserCard.css'

export default function UserCard({ user, onLogout }) {
  if (!user) return null
  const { firstName, lastName, role } = user
  const initials = (firstName?.[0] || '') + (lastName?.[0] || '')
  return (
    <div className="user-card" aria-label="Profil utilisateur">
      <div className="user-avatar" aria-hidden="true">{initials}</div>
      <div className="user-info">
        <div className="user-name">{firstName} {lastName}</div>
        {role && <div className="user-role">{role}</div>}
      </div>
      <button className="logout-btn" onClick={onLogout} type="button">log out</button>
    </div>
  )
}

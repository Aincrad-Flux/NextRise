import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import UserCard from './UserCard.jsx'
import { getAvatarImageCookie } from '../utils/avatarImage.js'

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { key: 'projects', label: 'Projects', icon: FolderIcon },
  { key: 'news', label: 'News', icon: NewsIcon },
  { key: 'events', label: 'Events', icon: EventsIcon },
  { key: 'users', label: 'Users', icon: UserIcon },
]

export default function AdminSidebar({ active, onSelect, user, onLogout }) {
  const navigate = useNavigate()
  const [avatarImage, setAvatarImage] = useState(() => getAvatarImageCookie())
  useEffect(() => {
    function handler(e) { setAvatarImage(e.detail?.image || getAvatarImageCookie()) }
    window.addEventListener('avatar-updated', handler)
    return () => window.removeEventListener('avatar-updated', handler)
  }, [])
  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <UserCard user={user} onLogout={onLogout} avatarImage={avatarImage} />
        <div className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = active === item.key
            return (
              <button
                key={item.key}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelect(item.key)}
              >
                <Icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </button>
            )
          })}
          <button className="nav-item" onClick={onLogout} style={{marginTop:16}}>
            <LogoutIcon className="nav-icon" />
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

function baseIcon(props, path) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {path}
    </svg>
  )
}
function DashboardIcon(p){return baseIcon(p,<><path d="M3 13h8V3H3z" /><path d="M13 21h8V8h-8z" /><path d="M13 3v4h8V3z" /><path d="M3 17v4h8v-4z" /></>)}
function FolderIcon(p){return baseIcon(p,<><path d="M3 7h6l2 2h10v8a2 2 0 0 1-2 2H3z" /><path d="M3 7V5a2 2 0 0 1 2-2h4l2 2h10a2 2 0 0 1 2 2v2" /></>)}
function NewsIcon(p){return baseIcon(p,<><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h6M7 16h8"/></>)}
function EventsIcon(p){return baseIcon(p,<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4M16 3v4"/></>)}
function UserIcon(p){return baseIcon(p,<><circle cx="12" cy="8" r="4" /><path d="M6 20v-2a6 6 0 0 1 12 0v2" /></>)}
function LogoutIcon(p){return baseIcon(p,<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></>)}

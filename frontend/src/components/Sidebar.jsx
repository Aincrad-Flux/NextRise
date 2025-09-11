import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import UserCard from './UserCard.jsx'
import { getAvatarImageCookie } from '../utils/avatarImage.js'

const navItems = [
  { key: 'general', label: 'General', icon: DashboardIcon, route: '/startup' },
  { key: 'projects', label: 'Projects', icon: FolderIcon, route: '/startup' },
  { key: 'profile', label: 'Startup profile', icon: UserIcon, route: '/startup/profile' },
  { key: 'opportunities', label: 'Opportunities', icon: OpportunityIcon, route: '/startup/opportunities' },
  { key: 'messaging', label: 'Messaging', icon: MessageIcon, route: '/startup/messaging' },
]

/**
 * Sidebar component.
 * Startup dashboard navigation with profile card.
 * @component
 * @param {Object} props
 * @param {string} props.active Current active key.
 * @param {(key:string)=>void} [props.onSelect] Optional internal section selection.
 * @param {Object} props.user Current user object.
 * @param {Function} props.onLogout Logout handler.
 */
export default function Sidebar({ active, onSelect, user, onLogout }) {
  const navigate = useNavigate()
  const [avatarImage, setAvatarImage] = useState(() => getAvatarImageCookie())
  useEffect(() => {
    function handler(e) { setAvatarImage(e.detail?.image || getAvatarImageCookie()) }
    window.addEventListener('avatar-updated', handler)
    return () => window.removeEventListener('avatar-updated', handler)
  }, [])
  const internalKeys = new Set(['general','projects', 'profile', 'opportunities', 'messaging'])
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
                onClick={() => {
                  if (onSelect && internalKeys.has(item.key)) return onSelect(item.key)
                  if (item.route) return navigate(item.route)
                }}
              >
                <Icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

// --- Icons (inline SVG for simplicity) ---
/**
 * Base icon wrapper.
 * @private
 */
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

function DashboardIcon(props) {
  return baseIcon(props, <><path d="M3 13h8V3H3z" /><path d="M13 21h8V8h-8z" /><path d="M13 3v4h8V3z" /><path d="M3 17v4h8v-4z" /></>)
}
function FolderIcon(props) {
  return baseIcon(props, <><path d="M3 7h6l2 2h10v8a2 2 0 0 1-2 2H3z" /><path d="M3 7V5a2 2 0 0 1 2-2h4l2 2h10a2 2 0 0 1 2 2v2" /></>)
}
function UserIcon(props) {
  return baseIcon(props, <><circle cx="12" cy="8" r="4" /><path d="M6 20v-2a6 6 0 0 1 12 0v2" /></>);
}
function OpportunityIcon(props) {
  return baseIcon(props, <><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M9 9h6v6H9z" /></>);
}
function MessageIcon(props) {
  return baseIcon(props, <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6l-10 7L2 6" /></>);
}

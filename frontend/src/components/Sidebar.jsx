import { useState } from 'react'

const navItems = [
  { key: 'general', label: 'Général', icon: DashboardIcon },
  { key: 'startups', label: 'Startups', icon: RocketIcon },
  { key: 'projects', label: 'Projets', icon: FolderIcon },
  { key: 'investors', label: 'Investisseurs', icon: InvestorIcon },
  { key: 'mentors', label: 'Mentors', icon: PeopleIcon },
]

export default function Sidebar({ active, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
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
        </div>
      </div>
    </aside>
  )
}

// --- Icons (inline SVG for simplicity) ---
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
function RocketIcon(props) {
  return baseIcon(props, <><path d="M4 13c2.5-.5 5.5-2.5 7.5-4.5S15.5 4 16 1c2 2 3 5 2 9 0 0 3 3 3 7l-4 4c-4 0-7-3-7-3-4 .97-7-0-9-2 3-.5 6-2.5 8-4.5z" /><path d="M9 15l2 2" /></>)
}
function FolderIcon(props) {
  return baseIcon(props, <><path d="M3 7h6l2 2h10v8a2 2 0 0 1-2 2H3z" /><path d="M3 7V5a2 2 0 0 1 2-2h4l2 2h10a2 2 0 0 1 2 2v2" /></>)
}
function InvestorIcon(props) {
  return baseIcon(props, <><circle cx="12" cy="7" r="4" /><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /></>)
}
function PeopleIcon(props) {
  return baseIcon(props, <><circle cx="9" cy="8" r="4" /><circle cx="17" cy="10" r="3" /><path d="M5 21v-2a5 5 0 0 1 5-5h1" /><path d="M16 21v-2a4 4 0 0 0-4-4h-2" /></>)
}

export default function TopBar() {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="brand">NextRise</h1>
      </div>
      <div className="topbar-right">
        <input className="search" placeholder="Search..." />
        <div className="avatar" aria-label="profile" />
      </div>
    </header>
  )
}

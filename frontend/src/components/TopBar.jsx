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
      <div className="topbar-right">
        <div className="avatar" aria-label="profile" />
      </div>
    </header>
  )
}

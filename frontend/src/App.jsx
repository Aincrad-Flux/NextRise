import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import StartupHome from './pages/StartupHome.jsx'
import NotFound from './pages/NotFound.jsx'
import Login from './pages/Login.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ margin: '0 0 1rem', padding: '0.75rem 1rem', display: 'flex', gap: '1rem', background: '#0f172a' }}>
        <Link style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }} to="/">Accueil</Link>
        <Link style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }} to="/startup">Startups</Link>
        <Link style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600, marginLeft: 'auto' }} to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/startup" element={<StartupHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

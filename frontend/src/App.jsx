import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import StartupHome from './pages/StartupHome.jsx'
import Projects from './pages/Projects.jsx'
import News from './pages/News.jsx'
import Events from './pages/Events.jsx'
import Search from './pages/Search.jsx'
import About from './pages/About.jsx'
import NotFound from './pages/NotFound.jsx'
import Login from './pages/Login.jsx'
import StartupProfile from './pages/StartupProfile.jsx'
import Opportunities from './pages/Opportunities.jsx'
import Messaging from './pages/Messaging.jsx'
import AdminHome from './pages/AdminHome.jsx'
import { SessionProvider } from './components/SessionProvider.jsx'
import UserProfile from './pages/UserProfile.jsx'

function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/startup" element={<StartupHome />} />
        <Route path="/startup/profile" element={<StartupProfile />} />
        <Route path="/startup/opportunities" element={<Opportunities />} />
        <Route path="/startup/messaging" element={<Messaging />} />
        {/* Renamed projects to catalog */}
        <Route path="/catalog" element={<Projects />} />
        {/* Legacy redirect */}
        <Route path="/projects" element={<Navigate to="/catalog" replace />} />
        <Route path="/news" element={<News />} />
        <Route path="/events" element={<Events />} />
        <Route path="/advanced-search" element={<Search />} />
        <Route path="/about" element={<About />} />
  <Route path="/login" element={<Login />} />
  <Route path="/profile" element={<UserProfile />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </SessionProvider>
    </BrowserRouter>
  )
}

export default App

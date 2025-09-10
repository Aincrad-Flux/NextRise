import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import Admin from './pages/Admin.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/startup" element={<StartupHome />} />
        <Route path="/startup/profile" element={<StartupProfile />} />
        <Route path="/startup/opportunities" element={<Opportunities />} />
        <Route path="/startup/messaging" element={<Messaging />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/news" element={<News />} />
        <Route path="/events" element={<Events />} />
        <Route path="/advanced-search" element={<Search />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
  <Route path="/admin/*" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

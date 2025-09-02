import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import StartupHome from './pages/StartupHome.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/startup" element={<StartupHome />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

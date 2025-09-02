import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'

export default function App() {
    return (
        <>
            <nav style={{ marginBottom: 24 }}>
                <Link to="/">Home</Link> | <Link to="/login">Login</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </>
    );
}

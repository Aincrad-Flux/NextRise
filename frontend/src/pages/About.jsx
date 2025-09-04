import TopBar from '../components/TopBar.jsx'
import './home.css'

export default function About() {
    return (
        <div className="home-container">
            <TopBar />
            <main className="home-main constrained" style={{ padding: '2rem' }}>
                <h1>About</h1>
                <p>About page placeholder.</p>
            </main>
        </div>
    )
}

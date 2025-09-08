import TopBar from '../components/TopBar.jsx'
import './Home.css'

export default function Events() {
    return (
        <div className="home-container">
            <TopBar />
            <main className="home-main constrained" style={{ padding: '2rem' }}>
                <h1>Events</h1>
                <p>Events page placeholder.</p>
            </main>
        </div>
    )
}

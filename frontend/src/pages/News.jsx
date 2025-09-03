import TopBar from '../components/TopBar.jsx'
import './home.css'

export default function News() {
    return (
        <div className="home-container">
            <TopBar />
            <main className="home-main constrained" style={{ padding: '2rem' }}>
                <h1>News</h1>
                <p>News page placeholder.</p>
            </main>
        </div>
    )
}

import TopBar from '../components/TopBar.jsx'
import './home.css'

export default function Search() {
    return (
        <div className="home-container">
            <TopBar />
            <main className="home-main constrained" style={{ padding: '2rem' }}>
                <h1>Search</h1>
                <p>Search page placeholder.</p>
            </main>
        </div>
    )
}

import TopBar from '../components/TopBar.jsx'
import './home.css'

export default function Home() {
    return (
        <div className="home-container">
            <TopBar />
            <main className="home-main constrained" style={{ padding: '2rem' }}>
                <h1>Accueil (Général)</h1>
                <p>Cette page d'accueil générale sera développée plus tard.</p>
                <p>Accédez à l'espace Startups via l'URL /startup.</p>
            </main>
        </div>
    )
}

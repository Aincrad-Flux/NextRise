import TopBar from '../components/TopBar.jsx'
import './home.css'

export default function Home() {
  return (
    <div className="home-container">
      <TopBar />
      <main className="home-main constrained" style={{ padding: '2rem' }}>
        <h1>JEB Incubator</h1>
        <p>Uniting breakthrough ideas with global capital. We fast-track early-stage startups by providing
            funding, expertise, and an unparalleled international network.</p>
        <h2>Our Mission</h2>
        <p>To cultivate a vibrant ecosystem where entrepreneurs thrive. Through hands-on mentorship,
            strategic partnerships and seed investment up to £200k, we turn bold visions into scalable
            businesses.</p>
        <h2>What We Offer</h2>
        <p>From product validation to market expansion, JEB provides the critical resources founders need at
            every stage of the journey.</p>
        <h2>Global Reach</h2>
        <p>Headquartered in London with hubs in New York, Singapore and Berlin, our alumni have raised over
            £500 M and created 3 000+ jobs worldwide.</p>
        <h2>Success Stories</h2>
        <p>Discover some of the groundbreaking startups that began their journey at JEB Incubator.</p>
      </main>
    </div>
  )
}

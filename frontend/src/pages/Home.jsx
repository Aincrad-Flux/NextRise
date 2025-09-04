import TopBar from '../components/TopBar.jsx'
import './home.css'

export default function Home() {
  return (
    <div className="home-container">
      <TopBar />
      <h1 className='main-title'>Home page</h1>
      <main className="home-main constrained">
        <div className='image-text-block'>
          <img className='home-page-image' src='https://www.vsisi.co.uk/files/849/startup%20incubator.jpg'></img>
          <div className='text-block'>
            <h1>JEB Incubator</h1>
            <p>Uniting breakthrough ideas with global capital. We fast-track early-stage startups by providing
              funding, expertise, and an unparalleled international network.</p>
          </div>
        </div>
        <div className='image-text-block'>
          <div className='text-block'>
            <h1>Our Mission</h1>
            <p>To cultivate a vibrant ecosystem where entrepreneurs thrive. Through hands-on mentorship,
              strategic partnerships and seed investment up to £200k, we turn bold visions into scalable
              businesses.</p>
          </div>
          <img className='home-page-image' src='https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1350&q=80'></img>
        </div>
        <div className='image-text-block'>
          <img className='home-page-image' src='https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=1350&q=80'></img>
          <div className='text-block'>
            <h1>What We Offer</h1>
            <p>From product validation to market expansion, JEB provides the critical resources founders need at
              every stage of the journey.</p>
          </div>
        </div>
        <div className='image-text-block'>
          <div className='text-block'>
            <h1>Global Reach</h1>
            <p>Headquartered in London with hubs in New York, Singapore and Berlin, our alumni have raised over
              £500 M and created 3 000+ jobs worldwide.</p>
          </div>
          <img className='home-page-image' src='https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1350&q=80'></img>
        </div>
        <div className='image-text-block'>
          <img className='home-page-image' src='https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=400&q=60'></img>
          <div className='text-block'>
            <h1>Success Stories</h1>
            <p>Discover some of the groundbreaking startups that began their journey at JEB Incubator.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

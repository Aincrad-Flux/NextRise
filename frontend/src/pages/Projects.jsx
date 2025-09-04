import TopBar from '../components/TopBar.jsx';
import './home.css';
import './Projects.css';
import { projectsData } from '../data/projectsData.js';

export default function Projects() {
    return (
        <div className="home-container">
            <TopBar />
            <main id="Projects" className="home-main constrained" style={{ padding: '2rem' }}>
                <h1>Projects</h1>
                <div className="projects-grid">
                    {projectsData.map(p => (
                        <article key={p.id}>
                            <img src={p.image} alt={p.title} />
                            <h2>{p.title}</h2>
                            <div className="tags">
                                {p.tags.map(tag => (
                                    <span key={tag} className="tag">{tag}</span>
                                ))}
                            </div>
                            <div className="description">
                                <p>{p.description}</p>
                                <a href="#">Read more</a>
                            </div>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}
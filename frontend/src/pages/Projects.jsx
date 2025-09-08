import { useState, useMemo } from 'react';
import TopBar from '../components/TopBar.jsx';
import './Home.css';
import './Projects.css';
import { projectsData } from '../data/projectsData.js';
import ProjectModal from '../components/ProjectModal.jsx';
import MultiSelect from '../components/MultiSelect.jsx';
import '../components/MultiSelect.css';

export default function Projects() {
    const [activeProject, setActiveProject] = useState(null);
    const [filters, setFilters] = useState({ sector: [], location: [], maturity: [] });

    // Derive location as last token in address (country) - fallback entire address
    const enriched = useMemo(() => projectsData.map(p => ({
        ...p,
        location: (p.address && p.address.split(/[, ]+/).pop()) || p.address || ''
    })), []);

    const options = useMemo(() => {
        const sector = new Set();
        const location = new Set();
        const maturity = new Set();
        enriched.forEach(p => { sector.add(p.sector); location.add(p.location); maturity.add(p.maturity); });
        return { sector: [...sector].sort(), location: [...location].sort(), maturity: [...maturity].sort() };
    }, [enriched]);

    const filtered = useMemo(() => {
        return enriched.filter(p => {
            const match = (key, val) => filters[key].length === 0 || filters[key].includes(val);
            return match('sector', p.sector) && match('location', p.location) && match('maturity', p.maturity);
        });
    }, [enriched, filters]);

    const resetFilters = () => setFilters({ sector: [], location: [], maturity: [] });

    return (
        <div className="home-container">
            <TopBar />
            <main id="Projects" className="home-main constrained" style={{ padding: '2rem' }}>
                <h1>Startups</h1>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                    <MultiSelect
                        label="Sector"
                        options={options.sector}
                        values={filters.sector}
                        onChange={(vals)=>setFilters(f=>({ ...f, sector: vals }))}
                        placeholder="All sectors"
                    />
                    <MultiSelect
                        label="Location"
                        options={options.location}
                        values={filters.location}
                        onChange={(vals)=>setFilters(f=>({ ...f, location: vals }))}
                        placeholder="All locations"
                    />
                    <MultiSelect
                        label="Maturity"
                        options={options.maturity}
                        values={filters.maturity}
                        onChange={(vals)=>setFilters(f=>({ ...f, maturity: vals }))}
                        placeholder="All maturity levels"
                    />
                    <button onClick={resetFilters} style={{ alignSelf:'flex-end', height:'42px', background:'#ffe8e8', border:'1px solid #ffb3b3', color:'#a20000', borderRadius:'10px', padding:'0 .9rem', fontSize:'.65rem', fontWeight:600, cursor:'pointer' }}>Reset</button>
                </div>

                <div className="projects-grid simple">
                    {filtered.map(p => {
                        const desc = (p.description && p.description.trim()) || 'Aucune description.';
                        return (
                            <article key={p.id || p.name} onClick={() => setActiveProject(p)} className="startup-card">
                                <h2>{p.name}</h2>
                                <div className="description">
                                    <p>{desc}</p>
                                    <button className="read-more-btn" onClick={(e) => { e.stopPropagation(); setActiveProject(p); }}>Details</button>
                                </div>
                            </article>
                        );
                    })}
                    {filtered.length === 0 && (
                        <p style={{ gridColumn: '1/-1', opacity: 0.7 }}>Aucun résultat avec ces filtres.</p>
                    )}
                </div>
                <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
            </main>
        </div>
    );
}

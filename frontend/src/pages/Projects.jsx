import { useState, useMemo } from 'react';
import TopBar from '../components/TopBar.jsx';
import './home.css';
import './Projects.css';
import { projectsData } from '../data/projectsData.js';
import ProjectModal from '../components/ProjectModal.jsx';

export default function Projects() {
    const [activeProject, setActiveProject] = useState(null);
    const [selected, setSelected] = useState({ sector: new Set(), location: new Set(), maturity: new Set() });

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

    const toggleValue = (category, value) => {
        setSelected(prev => {
            const next = { ...prev, [category]: new Set(prev[category]) };
            if (next[category].has(value)) next[category].delete(value); else next[category].add(value);
            return next;
        });
    };

    const resetFilters = () => setSelected({ sector: new Set(), location: new Set(), maturity: new Set() });

    const filtered = useMemo(() => {
        return enriched.filter(p => {
            const catMatch = (cat, val) => selected[cat].size === 0 || selected[cat].has(val);
            return catMatch('sector', p.sector) && catMatch('location', p.location) && catMatch('maturity', p.maturity);
        });
    }, [enriched, selected]);

    return (
        <div className="home-container">
            <TopBar />
            <main id="Projects" className="home-main constrained" style={{ padding: '2rem' }}>
                <h1>Startups</h1>

                <div className="filters">
                    {['sector','location','maturity'].map(cat => {
                        const label = cat === 'sector' ? 'Sector' : cat === 'location' ? 'Location' : 'Maturity';
                        const handleChange = (e) => {
                            const values = Array.from(e.target.selectedOptions).map(o => o.value);
                            setSelected(prev => ({ ...prev, [cat]: new Set(values) }));
                        };
                        return (
                            <div key={cat} className="filter-group">
                                <label className="filter-title" htmlFor={`filter-${cat}`}>{label}</label>
                                <select
                                    id={`filter-${cat}`}
                                    className="filter-select"
                                    multiple
                                    value={[...selected[cat]]}
                                    onChange={handleChange}
                                >
                                    {options[cat].map(v => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                </select>
                            </div>
                        );
                    })}
                    <button className="reset-filters" onClick={resetFilters}>Reset</button>
                </div>

                <div className="projects-grid simple">
                    {filtered.map(p => {
                        const desc = (p.description && p.description.trim()) || 'Aucune description.';
                        return (
                            <article key={p.id || p.name} onClick={() => setActiveProject(p)} className="startup-card">
                                <h2>{p.name}</h2>
                                <div className="description">
                                    <p>{desc}</p>
                                    <button className="read-more-btn" onClick={(e) => { e.stopPropagation(); setActiveProject(p); }}>Détails</button>
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

import { useState, useRef, useEffect } from 'react';
import TopBar from '../components/TopBar.jsx';
import './home.css';
import './Projects.css';
import { projectsData } from '../data/projectsData.js';
import ProjectModal from '../components/ProjectModal.jsx';

export default function Projects() {
    const [selectedTags, setSelectedTags] = useState({});
    const [openDropdown, setOpenDropdown] = useState(null);
    const [activeProject, setActiveProject] = useState(null);
    const dropdownRef = useRef();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Group tags by index
    const tagsByIndex = {};
    projectsData.forEach(p => {
        p.tags.forEach((tag, idx) => {
            if (!tagsByIndex[idx]) tagsByIndex[idx] = new Set();
            tagsByIndex[idx].add(tag);
        });
    });

    // Filter projects (AND logic: must match all selected tags)
    const filteredProjects = projectsData.filter(p => {
        return Object.entries(selectedTags).every(([idx, tag]) => {
            return !tag || p.tags[idx] === tag;
        });
    });

    const handleSelect = (idx, tag) => {
        setSelectedTags(prev => ({
            ...prev,
            [idx]: prev[idx] === tag ? null : tag
        }));
    };

    const clearAll = () => setSelectedTags({});

    return (
        <div className="home-container">
            <TopBar />
            <main id="Projects" className="home-main constrained" style={{ padding: '2rem' }}>
                <h1>Projects</h1>

                {/* Multiple dropdowns */}
                <div className="multi-dropdowns" ref={dropdownRef}>
                    {Object.entries(tagsByIndex).map(([idx, tags]) => (
                        <div key={idx} className="dropdown-filter">
                            <button
                                className="dropdown-button"
                                onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
                            >
                                {selectedTags[idx] || `Select Category ${parseInt(idx) + 1}`}
                                <span className="arrow">{openDropdown === idx ? '▲' : '▼'}</span>
                            </button>
                            {openDropdown === idx && (
                                <div className="dropdown-menu">
                                    {[...tags].map(tag => (
                                        <div
                                            key={tag}
                                            className={`dropdown-item ${selectedTags[idx] === tag ? 'selected' : ''}`}
                                            onClick={() => handleSelect(idx, tag)}
                                        >
                                            {tag}
                                        </div>
                                    ))}
                                    <div className="dropdown-item clear" onClick={() => handleSelect(idx, null)}>
                                        Clear
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <button className="clear-all" onClick={clearAll}>Reset All</button>
                </div>

                <div className="projects-grid">
                    {filteredProjects.map(p => (
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
                                <button className="read-more-btn" onClick={() => setActiveProject(p)}>View more</button>
                            </div>
                        </article>
                    ))}
                </div>
                <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
            </main>
        </div>
    );
}

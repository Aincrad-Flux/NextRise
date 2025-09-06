import { useMemo, useState } from 'react';
import TopBar from '../components/TopBar.jsx';
import './Home.css';
import './StartupProjects.css';
import ProjectCard from '../components/ProjectCard.jsx';
import ProjectFormModal from '../components/ProjectFormModal.jsx';
import { projectMock, projectTagSuggestions } from '../data/projectMock.js';

export default function StartupProjects({ embedded = false }) {
    // local state for CRUD on mock data
    const [items, setItems] = useState(() => projectMock);
    const [query, setQuery] = useState('');
    const [tagFilter, setTagFilter] = useState([]); // array of string tags
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null); // project being edited

    const allTags = useMemo(() => {
        const s = new Set();
        items.forEach(p => (p.tags || []).forEach(t => s.add(t)));
        return Array.from(s).sort();
    }, [items]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return items.filter(p => {
            const textMatch = !q || [p.title, p.description, ...(p.tags||[])].join(' ').toLowerCase().includes(q);
            const tagMatch = tagFilter.length === 0 || (p.tags||[]).some(t => tagFilter.includes(t));
            return textMatch && tagMatch;
        });
    }, [items, query, tagFilter]);

    const openCreate = () => { setEditing(null); setModalOpen(true); };
    const openEdit = (p) => { setEditing(p); setModalOpen(true); };
    const closeModal = () => setModalOpen(false);

    const handleSave = (payload) => {
        if (payload.id) {
            setItems(prev => prev.map(it => it.id === payload.id ? { ...it, ...payload } : it));
        } else {
            const newItem = { ...payload, id: `p-${Date.now()}` };
            setItems(prev => [newItem, ...prev]);
        }
        setModalOpen(false);
    };

    const handleDelete = (p) => {
        const ok = window.confirm(`Supprimer le projet "${p.title}" ? Cette action est irréversible.`);
        if (!ok) return;
        setItems(prev => prev.filter(it => it.id !== p.id));
    };

    const toggleTagFilter = (t) => {
        setTagFilter(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
    };
    const resetFilters = () => { setQuery(''); setTagFilter([]); };

    const content = (
        <div id="Projects" style={embedded ? undefined : {}}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', marginBottom:'1rem' }}>
                <h1 style={{ margin: 0 }}>Projets</h1>
                <button className="primary-btn" onClick={openCreate}>Nouveau projet</button>
            </div>

            <div className="filters" style={{ marginTop: '.75rem' }}>
                <div style={{ minWidth: 280 }}>
                    <label className="filter-title">Recherche</label>
                    <input
                        value={query}
                        onChange={e=>setQuery(e.target.value)}
                        placeholder="Titre, description, tag…"
                        style={{ width:'100%', background:'var(--color-surface-alt)', color:'var(--color-text)', border:'1px solid var(--color-border)', borderRadius:'10px', padding:'.55rem .65rem' }}
                    />
                </div>
                <div className="filter-group">
                    <div className="filter-title">Tags</div>
                    <div className="filter-chips">
                        {allTags.length === 0 && <span style={{ opacity:.7, fontSize:'.85rem' }}>Aucun tag (ajoutez-en lors de la création)</span>}
                        {allTags.map(t => (
                            <button key={t} type="button" className={`filter-chip ${tagFilter.includes(t) ? 'active' : ''}`} onClick={()=>toggleTagFilter(t)}>{t}</button>
                        ))}
                    </div>
                </div>
                <button className="reset-filters" onClick={resetFilters}>Réinitialiser</button>
            </div>

            <div className="projects-grid">
                {filtered.map(p => (
                    <ProjectCard
                        key={p.id}
                        project={p}
                        onOpen={openEdit}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                    />
                ))}
                {filtered.length === 0 && (
                    <p style={{ gridColumn: '1/-1', opacity: 0.75 }}>Aucun projet trouvé.</p>
                )}
            </div>

            <ProjectFormModal
                open={modalOpen}
                initial={editing}
                tagSuggestions={Array.from(new Set([...projectTagSuggestions, ...allTags]))}
                onCancel={closeModal}
                onSave={handleSave}
            />
        </div>
    );

    if (embedded) return content;

    return (
        <div className="home-container">
            <TopBar />
            <main className="home-main constrained" style={{ padding: '2rem' }}>
                {content}
            </main>
        </div>
    );
}

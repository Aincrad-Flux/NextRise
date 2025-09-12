import { useMemo, useState } from 'react';
import TopBar from '../components/TopBar.jsx';
import './Home.css';
import './StartupProjects.css';
import ProjectCard from '../components/ProjectCard.jsx';
import ProjectFormModal from '../components/ProjectFormModal.jsx';
import ProjectModal from '../components/ProjectModal.jsx';
import { projectMock, projectTagSuggestions } from '../data/projectMock.js';

export default function StartupProjects({ embedded = false }) {
    // local state for CRUD on mock data
    const [items, setItems] = useState(() => projectMock);
    // removed text search; keep only tag filters
    // removed tag filters
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null); // project being edited
    const [viewing, setViewing] = useState(null); // project being viewed (read-only)

    // allTags removed

    const filtered = useMemo(() => items, [items]);

    const openCreate = () => { setEditing(null); setModalOpen(true); };
    const openEdit = (p) => { setEditing(p); setModalOpen(true); };
    const openView = (p) => { setViewing(p); };
    const closeModal = () => setModalOpen(false);
    const closeView = () => setViewing(null);

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
    const ok = window.confirm(`Delete project "${p.title}"? This action is irreversible.`);
        if (!ok) return;
        setItems(prev => prev.filter(it => it.id !== p.id));
    };

    // tag filter actions removed

    const content = (
        <div id="Projects" style={embedded ? undefined : {}}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', marginBottom:'1rem' }}>
                <h1 style={{ margin: 0 }}>Projects</h1>
                <button className="primary-btn" onClick={openCreate}>New project</button>
            </div>

            {/* filters removed */}

            <div className="projects-grid">
                {filtered.map(p => (
                    <ProjectCard
                        key={p.id}
                        project={p}
                        onOpen={openView}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                    />
                ))}
                {filtered.length === 0 && (
                    <p style={{ gridColumn: '1/-1', opacity: 0.75 }}>No project found.</p>
                )}
            </div>

            <ProjectFormModal
                open={modalOpen}
                initial={editing}
                tagSuggestions={projectTagSuggestions}
                onCancel={closeModal}
                onSave={handleSave}
            />
            {viewing && (
                <ProjectModal project={viewing} onClose={closeView} />
            )}
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

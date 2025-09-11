import React, { useState } from 'react';
import TopBar from '../components/TopBar.jsx';
import Sidebar from '../components/Sidebar';
import './Home.css';
import './Projects.css';
import './Opportunities.css';

const initialOpportunities = [];

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [newOpp, setNewOpp] = useState({ title: '', description: '', type: 'investissement' });
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ title: '', description: '', type: 'investissement' });

  const handleLogout = () => alert('Déconnexion... (à implémenter)');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOpp({ ...newOpp, [name]: value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if(!newOpp.title.trim()) return; // simple validation
    setOpportunities([...opportunities, { ...newOpp, id: Date.now() }]);
    setNewOpp({ title: '', description: '', type: 'investissement' });
  };

  const handleDelete = (id) => {
    setOpportunities(opportunities.filter(o => o.id !== id));
    if (editingId === id) { setEditingId(null); }
  };

  const startEdit = (o) => {
    setEditingId(o.id);
    setDraft({ title: o.title, description: o.description, type: o.type });
  };

  const handleDraftChange = (e) => {
    const { name, value } = e.target;
    setDraft(d => ({ ...d, [name]: value }));
  };

  const saveEdit = (id) => {
    setOpportunities(opportunities.map(o => o.id === id ? { ...o, ...draft } : o));
    setEditingId(null);
  };

  const cancelEdit = () => { setEditingId(null); };

  return (
    <div className="home-container opportunities-page">
      <div className="layout">
        {/* If Sidebar/TopBar needed, they can be reintroduced depending on layout conventions */}
        <main className="home-main">
          <div className="opportunities-header">
            <h2>Opportunités</h2>
          </div>
          <form className="opportunities-form" onSubmit={handleAdd}>
            <input name="title" value={newOpp.title} onChange={handleChange} placeholder="Titre" required />
            <input name="description" value={newOpp.description} onChange={handleChange} placeholder="Description" />
            <select name="type" value={newOpp.type} onChange={handleChange}>
              <option value="investissement">Investissement</option>
              <option value="financement">Financement</option>
              <option value="match">Match Investisseur</option>
            </select>
            <button type="submit">Ajouter</button>
          </form>
          <div className="opportunities-grid">
            {opportunities.length === 0 && (
              <div className="empty-state">Aucune opportunité pour le moment.</div>
            )}
            {opportunities.map(o => {
              const editing = editingId === o.id;
              return (
                <article key={o.id} className="opportunity-card">
                  {editing ? (
                    <>
                      <input
                        className="opportunity-title-input"
                        name="title"
                        value={draft.title}
                        onChange={handleDraftChange}
                        placeholder="Titre"
                      />
                      <select name="type" value={draft.type} onChange={handleDraftChange} className="inline-select">
                        <option value="investissement">Investissement</option>
                        <option value="financement">Financement</option>
                        <option value="match">Match Investisseur</option>
                      </select>
                      <textarea
                        name="description"
                        value={draft.description}
                        onChange={handleDraftChange}
                        className="opportunity-desc-input"
                        placeholder="Description"
                      />
                      <div className="card-actions">
                        <button type="button" className="save" onClick={() => saveEdit(o.id)}>Sauvegarder</button>
                        <button type="button" className="cancel" onClick={cancelEdit}>Annuler</button>
                        <button type="button" className="delete" onClick={() => handleDelete(o.id)}>Supprimer</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="opportunity-type">{o.type}</div>
                      <h3>{o.title}</h3>
                      {o.description && <p className="opportunity-desc">{o.description}</p>}
                      <div className="card-actions">
                        <button type="button" className="edit" onClick={() => startEdit(o)}>Editer</button>
                        <button type="button" className="delete" onClick={() => handleDelete(o.id)}>Supprimer</button>
                      </div>
                    </>
                  )}
                </article>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import TopBar from '../components/TopBar.jsx';
import Sidebar from '../components/Sidebar';
import './Home.css';
import './Projects.css';

const initialOpportunities = [];

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [newOpp, setNewOpp] = useState({ title: '', description: '', type: 'investissement' });
  const user = { firstName: 'Jean', lastName: 'Dupont', role: 'Startup' };
  const handleLogout = () => alert('Déconnexion... (à implémenter)');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOpp({ ...newOpp, [name]: value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setOpportunities([...opportunities, { ...newOpp, id: Date.now() }]);
    setNewOpp({ title: '', description: '', type: 'investissement' });
  };

  const handleDelete = (id) => {
    setOpportunities(opportunities.filter(o => o.id !== id));
  };

  return (
    <div className="home-container">
      <TopBar />
      <div className="layout">
        <Sidebar active="opportunities" user={user} onLogout={handleLogout} />
        <main className="home-main">
          <h2>Opportunités</h2>
          <form className="project-form" onSubmit={handleAdd}>
            <input name="title" value={newOpp.title} onChange={handleChange} placeholder="Titre" />
            <input name="description" value={newOpp.description} onChange={handleChange} placeholder="Description" />
            <select name="type" value={newOpp.type} onChange={handleChange}>
              <option value="investissement">Investissement</option>
              <option value="financement">Financement</option>
              <option value="match">Match Investisseur</option>
            </select>
            <button type="submit">Ajouter</button>
          </form>
          <ul>
            {opportunities.map(o => (
              <li key={o.id}>
                <strong>{o.title}</strong> ({o.type})<br />
                {o.description}
                <button onClick={() => handleDelete(o.id)}>Supprimer</button>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}

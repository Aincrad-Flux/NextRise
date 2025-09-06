import React, { useState } from 'react';
import TopBar from '../components/TopBar.jsx';
import Sidebar from '../components/Sidebar';
import './Home.css';
import './Projects.css';

const initialData = {
  name: '',
  legal_status: '',
  address: '',
  email: '',
  phone: '',
  created_at: '',
  description: '',
  website_url: '',
  social_media_url: '',
  project_status: '',
  sector: '',
  maturity: '',
  founders: '',
  needs: ''
};

export default function StartupProfile() {
  const [formData, setFormData] = useState(initialData);
  const user = { firstName: 'Jean', lastName: 'Dupont', role: 'Startup' };
  const handleLogout = () => alert('Déconnexion... (à implémenter)');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Appel API pour sauvegarder les données
    alert('Modifications enregistrées !');
  };

  return (
    <div className="home-container">
      <TopBar />
      <div className="layout">
        <Sidebar active="profile" user={user} onLogout={handleLogout} />
        <main className="home-main">
          <h2>Profil de la startup</h2>
          <form className="project-form" onSubmit={handleSubmit}>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Nom" />
            <input name="legal_status" value={formData.legal_status} onChange={handleChange} placeholder="Statut légal" />
            <input name="address" value={formData.address} onChange={handleChange} placeholder="Adresse" />
            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Téléphone" />
            <input name="created_at" type="date" value={formData.created_at} onChange={handleChange} placeholder="Date de création" />
            <input name="website_url" value={formData.website_url} onChange={handleChange} placeholder="Site web (URL)" />
            <input name="social_media_url" value={formData.social_media_url} onChange={handleChange} placeholder="Réseaux sociaux (URL)" />
            <input name="project_status" value={formData.project_status} onChange={handleChange} placeholder="Statut du projet" />
            <input name="sector" value={formData.sector} onChange={handleChange} placeholder="Secteur" />
            <input name="maturity" value={formData.maturity} onChange={handleChange} placeholder="Maturité" />
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
            <textarea name="founders" value={formData.founders} onChange={handleChange} placeholder="Fondateur(s)" />
            <textarea name="needs" value={formData.needs} onChange={handleChange} placeholder="Besoins" />
            <button type="submit">Enregistrer</button>
          </form>
        </main>
      </div>
    </div>
  );
}

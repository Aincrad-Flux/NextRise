import React, { useEffect, useState } from 'react';
import TopBar from '../components/TopBar.jsx';
import Sidebar from '../components/Sidebar';
import './Home.css';
import './StartupProfile.css';
import startupMock from '../data/startupMock.js';

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
  const handleLogout = () => alert('Déconnexion... (à implémenter)');

  useEffect(() => {
    // Prefill with mock data for now
    setFormData(prev => ({ ...prev, ...startupMock }));
  }, []);

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
  <Sidebar active="profile" onLogout={handleLogout} />
        <main className="home-main">
          <div className="profile-card">
            <div className="profile-header">
              <h2 className="profile-title">Profil de la startup</h2>
            </div>
            <p className="profile-subtitle">Mettez à jour les informations principales de votre projet.</p>

            <form onSubmit={handleSubmit}>
              <div className="profile-grid">
                <div className="section">
                  <div className="section-title">Général</div>
                </div>

                <div className="form-field col-6">
                  <label htmlFor="name">Nom</label>
                  <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-field col-3">
                  <label htmlFor="legal_status">Statut légal</label>
                  <input id="legal_status" name="legal_status" type="text" value={formData.legal_status} onChange={handleChange} />
                </div>
                <div className="form-field col-3">
                  <label htmlFor="created_at">Date de création</label>
                  <input id="created_at" name="created_at" type="date" value={formData.created_at} onChange={handleChange} />
                </div>

                <div className="form-field col-12">
                  <label htmlFor="description">Description</label>
                  <textarea id="description" name="description" value={formData.description} onChange={handleChange} />
                </div>

                <div className="section">
                  <div className="section-title">Coordonnées</div>
                </div>
                <div className="form-field col-8">
                  <label htmlFor="address">Adresse</label>
                  <input id="address" name="address" type="text" value={formData.address} onChange={handleChange} />
                </div>
                <div className="form-field col-4">
                  <label htmlFor="phone">Téléphone</label>
                  <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="form-field col-6">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-field col-6">
                  <label htmlFor="website_url">Site web</label>
                  <input id="website_url" name="website_url" type="url" value={formData.website_url} onChange={handleChange} />
                </div>
                <div className="form-field col-12">
                  <label htmlFor="social_media_url">Réseaux sociaux (URL)</label>
                  <input id="social_media_url" name="social_media_url" type="url" value={formData.social_media_url} onChange={handleChange} />
                </div>

                <div className="section">
                  <div className="section-title">Projet</div>
                </div>
                <div className="form-field col-4">
                  <label htmlFor="project_status">Statut du projet</label>
                  <input id="project_status" name="project_status" type="text" value={formData.project_status} onChange={handleChange} />
                </div>
                <div className="form-field col-4">
                  <label htmlFor="sector">Secteur</label>
                  <input id="sector" name="sector" type="text" value={formData.sector} onChange={handleChange} />
                </div>
                <div className="form-field col-4">
                  <label htmlFor="maturity">Maturité</label>
                  <input id="maturity" name="maturity" type="text" value={formData.maturity} onChange={handleChange} />
                </div>

                <div className="form-field col-12">
                  <label htmlFor="founders">Fondateur(s)</label>
                  <textarea id="founders" name="founders" value={formData.founders} onChange={handleChange} />
                </div>
                <div className="form-field col-12">
                  <label htmlFor="needs">Besoins</label>
                  <textarea id="needs" name="needs" value={formData.needs} onChange={handleChange} />
                </div>

                <div className="form-actions col-12">
                  <button className="save-btn" type="submit">Enregistrer</button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

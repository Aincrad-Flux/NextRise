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
  const handleLogout = () => alert('Logout... (to implement)');

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
  // TODO: API call to persist the data
  alert('Changes saved!');
  };

  return (
    <div className="home-container">
      <div className="layout">
        <main className="home-main">
          <div className="profile-card">
            <div className="profile-header">
              <h2 className="profile-title">Startup profile</h2>
            </div>
            <p className="profile-subtitle">Update your project's main information.</p>

            <form onSubmit={handleSubmit}>
              <div className="profile-grid">
                <div className="section">
                  <div className="section-title">General</div>
                </div>

                <div className="form-field col-6">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-field col-3">
                  <label htmlFor="legal_status">Legal status</label>
                  <input id="legal_status" name="legal_status" type="text" value={formData.legal_status} onChange={handleChange} />
                </div>
                <div className="form-field col-3">
                  <label htmlFor="created_at">Creation date</label>
                  <input id="created_at" name="created_at" type="date" value={formData.created_at} onChange={handleChange} />
                </div>

                <div className="form-field col-12">
                  <label htmlFor="description">Description</label>
                  <textarea id="description" name="description" value={formData.description} onChange={handleChange} />
                </div>

                <div className="section">
                  <div className="section-title">Contact</div>
                </div>
                <div className="form-field col-8">
                  <label htmlFor="address">Address</label>
                  <input id="address" name="address" type="text" value={formData.address} onChange={handleChange} />
                </div>
                <div className="form-field col-4">
                  <label htmlFor="phone">Phone</label>
                  <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="form-field col-6">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-field col-6">
                  <label htmlFor="website_url">Website</label>
                  <input id="website_url" name="website_url" type="url" value={formData.website_url} onChange={handleChange} />
                </div>
                <div className="form-field col-12">
                  <label htmlFor="social_media_url">Social media (URL)</label>
                  <input id="social_media_url" name="social_media_url" type="url" value={formData.social_media_url} onChange={handleChange} />
                </div>

                <div className="section">
                  <div className="section-title">Project</div>
                </div>
                <div className="form-field col-4">
                  <label htmlFor="project_status">Project status</label>
                  <input id="project_status" name="project_status" type="text" value={formData.project_status} onChange={handleChange} />
                </div>
                <div className="form-field col-4">
                  <label htmlFor="sector">Sector</label>
                  <input id="sector" name="sector" type="text" value={formData.sector} onChange={handleChange} />
                </div>
                <div className="form-field col-4">
                  <label htmlFor="maturity">Maturity</label>
                  <input id="maturity" name="maturity" type="text" value={formData.maturity} onChange={handleChange} />
                </div>

                <div className="form-field col-12">
                  <label htmlFor="founders">Founder(s)</label>
                  <textarea id="founders" name="founders" value={formData.founders} onChange={handleChange} />
                </div>
                <div className="form-field col-12">
                  <label htmlFor="needs">Needs</label>
                  <textarea id="needs" name="needs" value={formData.needs} onChange={handleChange} />
                </div>

                <div className="form-actions col-12">
                  <button className="save-btn" type="submit">Save</button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

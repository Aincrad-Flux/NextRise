import { useEffect, useState } from 'react';
import TopBar from '../components/TopBar.jsx';
import { useSession } from '../components/SessionProvider.jsx';
import { updateUserProfile, fetchUserProfile } from '../utils/userApi.js';
import './StartupProfile.css';

// Simple user profile (not startup project profile)
export default function UserProfile() {
  const { user, refresh } = useSession();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await fetchUserProfile();
        if (!ignore && data) {
          setForm(f => ({ ...f, name: data.name || '', email: data.email || '' }));
        }
      } catch (e) {
        console.warn('Load profile failed', e);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await updateUserProfile({ name: form.name, email: form.email, password: form.password || undefined });
      setStatus('Saved');
      setForm(f => ({ ...f, password: '' }));
      await refresh();
    } catch (e) {
      setStatus(e.message || 'Error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="home-container">
      <TopBar />
      <div className="layout" style={{display:'block'}}>
        <main className="home-main">
          <div className="profile-card">
            <div className="profile-header">
              <h2 className="profile-title">User account</h2>
            </div>
            <p className="profile-subtitle">Update your personal information.</p>
            <form onSubmit={onSubmit}>
              <div className="profile-grid">
                <div className="form-field col-6">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" type="text" value={form.name} onChange={onChange} required />
                </div>
                <div className="form-field col-6">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" value={form.email} onChange={onChange} required />
                </div>
                <div className="form-field col-6">
                  <label htmlFor="password">New password</label>
                  <input id="password" name="password" type="password" value={form.password} onChange={onChange} placeholder="Leave blank to keep current" />
                </div>
                <div className="form-actions col-12">
                  <button className="save-btn" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                  {status && <span style={{marginLeft:'1rem', fontSize:'.9rem'}}>{status}</span>}
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

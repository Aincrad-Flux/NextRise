const API_BASE = import.meta?.env?.VITE_BACKEND_URL?.replace(/\/$/, '') || '';

async function api(path, options = {}) {
  const url = new URL(path, API_BASE || window.location.origin);
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers||{}) },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) {
    let msg = 'HTTP ' + res.status;
    try { const j = await res.json(); msg = j.error || j.message || msg; } catch {}
    throw new Error(msg);
  }
  return res.json().catch(()=>null);
}

export async function fetchUserProfile() {
  const data = await api('/api/user/me', { method: 'GET' });
  return data?.user || data;
}

export async function updateUserProfile(payload) {
  // remove undefined keys
  const body = Object.fromEntries(Object.entries(payload).filter(([,v]) => v !== undefined && v !== ''));
  return api('/api/user/me', { method: 'PATCH', body });
}

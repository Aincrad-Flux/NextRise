import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar.jsx'
import { logger } from '../utils/logger.js'
import './Login.css'

export default function Login() {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [signinForm, setSigninForm] = useState({ email: '', password: '' })
  const [signupForm, setSignupForm] = useState({ email: '', password: '', name: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Base URL (from docker-compose .env -> VITE_BACKEND_URL)
  const API_BASE = import.meta?.env?.VITE_BACKEND_URL?.replace(/\/$/, '') || ''

  function redirectByRole(role) {
    if (role === 'admin') return navigate('/admin/')
    // investor, founder, user -> /startup (default)
    return navigate('/startup')
  }

  function handleChange(e, type) {
    const { name, value } = e.target
    if (type === 'signin') setSigninForm(f => ({ ...f, [name]: value }))
    else setSignupForm(f => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const endpoint = mode === 'signin' ? '/api/auth/login' : '/api/auth/register'
      const body = mode === 'signin' ? signinForm : signupForm
      const url = new URL(endpoint, API_BASE || window.location.origin)
      const t0 = Date.now()

      // Do not log passwords
      const safe = { mode, endpoint, base: API_BASE || window.location.origin, email: body.email || undefined, name: body.name || undefined }
      logger.info('Auth submit start', safe)

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // important: receive/set auth cookie
        body: JSON.stringify(body)
      })

      const data = await res.json().catch(() => ({}))
      logger.debug('Auth response received', { status: res.status, ok: res.ok, ms: Date.now() - t0 })
      if (!res.ok) {
        const msg = data?.error || (mode === 'signin' ? 'Échec de connexion' : "Échec de création du compte")
        logger.warn('Auth error response', { status: res.status, body: data })
        throw new Error(msg)
      }

      const user = data?.user
      if (!user || !user.role) {
        // Fallback: fetch current session if role missing
        try {
          const meUrl = new URL('/api/auth/me', API_BASE || window.location.origin)
          const meRes = await fetch(meUrl, { credentials: 'include' })
          const meData = await meRes.json().catch(() => ({}))
          logger.info('Auth fallback /me', { status: meRes.status, hasUser: !!meData?.user, role: meData?.user?.role })
          if (meRes.ok && meData?.user?.role) {
            const to = meData.user.role === 'admin' ? '/admin/' : '/startup'
            logger.info('Redirect by role', { role: meData.user.role, to })
            return redirectByRole(meData.user.role)
          }
        } catch {}
        logger.info('Redirect default to /startup')
        return navigate('/startup')
      }
      logger.info('Redirect by role', { role: user.role, to: user.role === 'admin' ? '/admin/' : '/startup' })
      return redirectByRole(user.role)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue'
      logger.error('Auth submit failed', err)
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const activeForm = mode === 'signin' ? (
    <form onSubmit={handleSubmit} className="auth-form fade-enter" autoComplete="on">
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={signinForm.email} onChange={e => handleChange(e,'signin')} required />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" value={signinForm.password} onChange={e => handleChange(e,'signin')} required />
      </div>
      <div className="actions">
        <button disabled={loading} type="submit" className="primary-btn">{loading ? 'Signing in...' : 'Sign In'}</button>
        <p className="secondary-link">Don't have an account? <a onClick={() => { setMode('signup'); setError('') }}>Create one</a></p>
      </div>
      {error && <p className="error-text" role="alert">{error}</p>}
    </form>
  ) : (
    <form onSubmit={handleSubmit} className="auth-form fade-enter" autoComplete="on">
      <div className="field">
        <label htmlFor="name">Nom</label>
        <input id="name" name="name" type="text" value={signupForm.name} onChange={e => handleChange(e,'signup')} required />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={signupForm.email} onChange={e => handleChange(e,'signup')} required />
      </div>
      <div className="field">
        <label htmlFor="password">Mot de passe</label>
        <input id="password" name="password" type="password" value={signupForm.password} onChange={e => handleChange(e,'signup')} required />
      </div>
      <div className="actions">
        <button disabled={loading} type="submit" className="primary-btn">{loading ? 'Création...' : 'Créer mon compte'}</button>
        <p className="secondary-link">Déjà un compte ? <a onClick={() => { setMode('signin'); setError('') }}>Se connecter</a></p>
      </div>
      <p className="terms">En créant un compte vous acceptez nos conditions d'utilisation et politique de confidentialité.</p>
      {error && <p className="error-text" role="alert">{error}</p>}
    </form>
  )

  return (
    <>
      <TopBar />
      <div className="login-page">
        <div className="login-inner">
          <div className="auth-card">
            <div className="auth-header">
              <h1>{mode === 'signin' ? 'Welcome' : 'Create an account'}</h1>
              <p className="auth-sub">{mode === 'signin' ? 'Access your dashboard' : 'Join the platform in seconds'}</p>
            </div>
            <div className="auth-tabs" role="tablist">
              <button type="button" className={`auth-tab ${mode==='signin'?'active':''}`} onClick={() => { setMode('signin'); setError('') }} role="tab" aria-selected={mode==='signin'}>Sign In</button>
              <button type="button" className={`auth-tab ${mode==='signup'?'active':''}`} onClick={() => { setMode('signup'); setError('') }} role="tab" aria-selected={mode==='signup'}>Sign Up</button>
            </div>
            {activeForm}
          </div>
        </div>
      </div>
    </>
  )
}
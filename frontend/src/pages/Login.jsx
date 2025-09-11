import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import TopBar from '../components/TopBar.jsx'
import { logger } from '../utils/logger.js'
import './Login.css'

export default function Login() {
  const location = useLocation()
  // derive initial mode from hash or query (?mode=signup or #signup)
  const deriveMode = () => {
    try {
      const hash = location.hash?.replace('#','').toLowerCase()
      if (hash === 'signup' || hash === 'signin') return hash
      const params = new URLSearchParams(location.search)
      const qMode = params.get('mode')?.toLowerCase()
      if (qMode === 'signup' || qMode === 'signin') return qMode
    } catch {}
    return 'signin'
  }
  const [mode, setMode] = useState(deriveMode()) // 'signin' | 'signup'
  const [signinForm, setSigninForm] = useState({ email: '', password: '' })
  const [signupForm, setSignupForm] = useState({ email: '', password: '', name: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  // update mode when hash/query changes (navigation inside SPA)
  useEffect(() => {
    const newMode = deriveMode()
    setMode(m => (m === newMode ? m : newMode))
  }, [location.hash, location.search])

  // when toggling tabs manually, also push hash for deep-linking
  const setModeWithHash = (next) => {
    setMode(next)
    setError('')
    const url = new URL(window.location.href)
    url.hash = next
    // don't duplicate history entries if already same
    if (window.location.hash.replace('#','') !== next) {
      window.history.replaceState(null, '', url.toString())
    }
  }

  // NOTE: On s'appuie sur le proxy Vite: les endpoints '/api/...' sont relatifs.
  // Si un déploiement nécessite un domaine différent en prod, on pourra réintroduire une base via variable d'env.
  const API_BASE = ''

  function redirectByRole(role) {
    if (role === 'admin') return navigate('/admin')
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
  const url = endpoint // relatif -> proxy ou même origine
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
        const msg = data?.error || (mode === 'signin' ? 'Login failed' : "Account creation failed")
        logger.warn('Auth error response', { status: res.status, body: data })
        throw new Error(msg)
      }

      const user = data?.user
      if (!user || !user.role) {
        // Fallback: fetch current session if role missing
        try {
          const meRes = await fetch('/api/auth/me', { credentials: 'include' })
          const meData = await meRes.json().catch(() => ({}))
          logger.info('Auth fallback /me', { status: meRes.status, hasUser: !!meData?.user, role: meData?.user?.role })
          if (meRes.ok && meData?.user?.role) {
            const to = meData.user.role === 'admin' ? '/admin' : '/startup'
            logger.info('Redirect by role', { role: meData.user.role, to })
            return redirectByRole(meData.user.role)
          }
        } catch {}
        logger.info('Redirect default to /startup')
        return navigate('/startup')
      }
      logger.info('Redirect by role', { role: user.role, to: user.role === 'admin' ? '/admin' : '/startup' })
      return redirectByRole(user.role)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred'
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
  <p className="secondary-link">Don't have an account? <a onClick={() => { setModeWithHash('signup') }}>Create one</a></p>
      </div>
      {error && <p className="error-text" role="alert">{error}</p>}
    </form>
  ) : (
    <form onSubmit={handleSubmit} className="auth-form fade-enter" autoComplete="on">
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" value={signupForm.name} onChange={e => handleChange(e,'signup')} required />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={signupForm.email} onChange={e => handleChange(e,'signup')} required />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" value={signupForm.password} onChange={e => handleChange(e,'signup')} required />
      </div>
      <div className="actions">
        <button disabled={loading} type="submit" className="primary-btn">{loading ? 'Creating...' : 'Create my account'}</button>
  <p className="secondary-link">Already have an account? <a onClick={() => { setModeWithHash('signin') }}>Sign in</a></p>
      </div>
      <p className="terms">By creating an account you accept our terms of use and privacy policy.</p>
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
              <button type="button" className={`auth-tab ${mode==='signin'?'active':''}`} onClick={() => setModeWithHash('signin')} role="tab" aria-selected={mode==='signin'}>Sign In</button>
              <button type="button" className={`auth-tab ${mode==='signup'?'active':''}`} onClick={() => setModeWithHash('signup')} role="tab" aria-selected={mode==='signup'}>Sign Up</button>
            </div>
            {activeForm}
          </div>
        </div>
      </div>
    </>
  )
}
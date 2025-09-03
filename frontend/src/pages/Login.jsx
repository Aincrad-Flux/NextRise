import { useState } from 'react'
import TopBar from '../components/TopBar.jsx'
import './Login.css'

export default function Login() {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [signinForm, setSigninForm] = useState({ email: '', password: '' })
  const [signupForm, setSignupForm] = useState({ email: '', password: '', name: '' })
  const [loading, setLoading] = useState(false)

  function handleChange(e, type) {
    const { name, value } = e.target
    if (type === 'signin') setSigninForm(f => ({ ...f, [name]: value }))
    else setSignupForm(f => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'signin') {
        console.log('Sign in attempt', signinForm)
        // TODO: call API /auth/login
      } else {
        console.log('Sign up attempt', signupForm)
        // TODO: call API /auth/register
      }
    } finally { setLoading(false) }
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
        <p className="secondary-link">Pas de compte ? <a onClick={() => setMode('signup')}>Créer un compte</a></p>
      </div>
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
        <p className="secondary-link">Déjà un compte ? <a onClick={() => setMode('signin')}>Se connecter</a></p>
      </div>
      <p className="terms">En créant un compte vous acceptez nos conditions d'utilisation et politique de confidentialité.</p>
    </form>
  )

  return (
    <>
      <TopBar />
      <div className="login-page">
        <div className="login-inner">
          <div className="auth-card">
            <div className="auth-header">
              <h1>{mode === 'signin' ? 'Bienvenue' : 'Créer un compte'}</h1>
              <p className="auth-sub">{mode === 'signin' ? 'Accédez à votre tableau de bord' : 'Rejoignez la plateforme en quelques secondes'}</p>
            </div>
            <div className="auth-tabs" role="tablist">
              <button type="button" className={`auth-tab ${mode==='signin'?'active':''}`} onClick={() => setMode('signin')} role="tab" aria-selected={mode==='signin'}>Sign In</button>
              <button type="button" className={`auth-tab ${mode==='signup'?'active':''}`} onClick={() => setMode('signup')} role="tab" aria-selected={mode==='signup'}>Sign Up</button>
            </div>
            {activeForm}
            <div className="divider">ou</div>
            <div className="social-row">
              <button className="social-btn" type="button">Google</button>
              <button className="social-btn" type="button">GitHub</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
import { Link } from 'react-router-dom'
import '../App.css'
import illustration from '../assets/404.svg'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.5rem',
      background: 'linear-gradient(135deg,#0f172a,#1e293b)',
      color: '#e2e8f0',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <img src={illustration} alt='404 illustration' style={{maxWidth: '360px', width: '90%', filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))'}} />
      <h1 style={{fontSize: 'clamp(2.5rem,8vw,4rem)', margin: '0', letterSpacing: '2px'}}>Oups...</h1>
      <p style={{maxWidth: '520px', lineHeight: 1.5, margin: 0}}>La page que vous cherchez n'existe pas ou a été déplacée. Vérifiez l'URL ou revenez à l'accueil.</p>
      <Link to='/' style={{
        textDecoration: 'none',
        background: '#38bdf8',
        color: '#0f172a',
        padding: '0.9rem 1.5rem',
        borderRadius: '0.75rem',
        fontWeight: 600,
        boxShadow: '0 6px 18px -4px rgba(56,189,248,0.4)',
        transition: 'transform .15s, box-shadow .2s'
      }}
        onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';}}
        onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';}}
      >Retour accueil</Link>
    </div>
  )
}

import { useEffect, useState, useMemo } from 'react'
import TopBar from '../components/TopBar.jsx'
import { logger } from '../utils/logger.js'
import './Home.css'
import './News.css'

// Backend base URL aligné avec Events page (fallback localhost:3000)
const API_BASE = import.meta?.env?.VITE_BACKEND_URL?.replace(/\/$/, '')
  || (typeof window !== 'undefined' ? `${window.location.protocol}//localhost:3000` : 'http://localhost:3000')

function api(path, query) {
  const url = new URL(path.startsWith('/') ? path : `/${path}`, API_BASE)
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null) url.searchParams.append(k, v)
    }
  }
  return url.toString()
}

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2344&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

function stripMarkdown(md = '') {
  return md
    .replace(/```[\s\S]*?```/g, '') // code blocks
    .replace(/`[^`]*`/g, '')
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/>\s?/g, '')
    .replace(/\r/g, '')
    .trim()
}

export default function News() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null) // For modal / expansion future

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const url = api('/api/db/news', { select: '*' })
        logger.info('[News] Fetch start', { url })
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) {
          const txt = await res.text().catch(() => '')
            throw new Error(`HTTP ${res.status} ${res.statusText} ${txt}`.trim())
        }
        const data = await res.json()
        const table = data.tables || []
        logger.info(`[News] Fetched news count=${table.length}`)
        setItems(table.sort((a,b)=> new Date(b.news_date||0) - new Date(a.news_date||0)))
      } catch (e) {
        if (e.name !== 'AbortError') {
          logger.error('[News] Fetch error', { message: e.message })
          setError(e.message === 'Failed to fetch' ? 'Réseau indisponible. Backend?' : e.message)
        }
      } finally {
        setLoading(false)
        logger.info('[News] Fetch end')
      }
    }
    load()
    return () => controller.abort()
  }, [])

  const grid = useMemo(() => items.map(n => {
    const preview = stripMarkdown(n.description || '').slice(0, 320) + ( (n.description||'').length > 320 ? '…' : '')
    return { ...n, preview }
  }), [items])

  return (
    <div className="home-container">
      <TopBar />
      <main id="News" className="home-main constrained" style={{ padding: '2rem' }}>
        <h1>News</h1>

        {loading && <p style={{opacity:.7}}>Chargement…</p>}
        {!loading && error && <p style={{color:'var(--danger,crimson)'}}>Erreur: {error}</p>}
        {!loading && !error && grid.length === 0 && <p>Aucune news.</p>}

        <div className="news-grid">
          {grid.map(n => (
            <article key={n.id} onClick={()=> setSelected(n)} style={{cursor:'pointer'}}>
              <img src={DEFAULT_IMG} alt={n.title} />
              <h2>{n.title}</h2>
              <div>
                <p style={{whiteSpace:'pre-wrap'}}>{n.preview}</p>
                <small style={{display:'block', marginTop:'.4rem', opacity:.7}}>
                  {new Date(n.news_date).toLocaleDateString(undefined,{year:'numeric', month:'short', day:'2-digit'})}
                  {n.location ? ` • ${n.location}` : ''}
                  {n.category ? ` • ${n.category}` : ''}
                </small>
                <button className="button" style={{marginTop:'.6rem'}} onClick={(e)=>{e.stopPropagation(); setSelected(n)}}>Lire</button>
              </div>
            </article>
          ))}
        </div>

        {selected && (
          <div className="modal-backdrop" onClick={()=> setSelected(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:'800px'}}>
              <header style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h2 style={{margin:0}}>{selected.title}</h2>
                <button className="button" onClick={()=> setSelected(null)}>Fermer</button>
              </header>
              <small style={{opacity:.7}}>
                {new Date(selected.news_date).toLocaleDateString(undefined,{year:'numeric', month:'long', day:'2-digit'})}
                {selected.location ? ` • ${selected.location}` : ''}
                {selected.category ? ` • ${selected.category}` : ''}
              </small>
              <img src={DEFAULT_IMG} alt={selected.title} style={{width:'100%', marginTop:'1rem', borderRadius:'4px'}} />
              <div style={{marginTop:'1rem', lineHeight:1.45, fontSize:'.95rem', whiteSpace:'pre-wrap'}}>
                {stripMarkdown(selected.description)}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

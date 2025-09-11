import { useEffect, useMemo, useState } from 'react'
import { logger } from '../utils/logger.js'
import './AdminDashboard.css'

/**
 * AdminDashboard
 * Fetches multiple collections in parallel and renders:
 *  - KPI cards (counts)
 *  - Pie chart (user roles distribution)
 *  - Bar chart (events per month for current year)
 */
export default function AdminDashboard() {
  const API_BASE = (import.meta?.env?.VITE_BACKEND_URL || '').replace(/\/$/, '')
  const endpoints = useMemo(() => ([
    { key: 'users', path: '/api/db/user' },
    { key: 'startups', path: '/api/db/startup' },
    { key: 'events', path: '/api/db/events' },
    { key: 'news', path: '/api/db/news' },
    { key: 'investors', path: '/api/db/investors' },
    { key: 'partners', path: '/api/db/partners' },
  ]), [])

  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true); setError(null)
      try {
        const results = await Promise.all(endpoints.map(async ep => {
          const url = `${API_BASE}${ep.path}?select=*`
          const res = await fetch(url, { credentials: 'include' })
          if (!res.ok) throw new Error(`${ep.key} ${res.status}`)
          const json = await res.json()
          const arr = Array.isArray(json) ? json : (json.tables || json.items || Object.values(json).find(v=>Array.isArray(v)) || [])
          return [ep.key, arr]
        }))
        if (!cancelled) {
          const obj = Object.fromEntries(results)
          setData(obj)
        }
      } catch (e) {
        if (!cancelled) setError(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [endpoints, API_BASE])

  const kpis = useMemo(() => ({
    users: data.users?.length || 0,
    startups: data.startups?.length || 0,
    events: data.events?.length || 0,
    news: data.news?.length || 0,
    investors: data.investors?.length || 0,
    partners: data.partners?.length || 0,
  }), [data])

  const rolePie = useMemo(() => {
    const counts = {}
    for (const u of data.users || []) {
      const role = u.role || 'unknown'
      counts[role] = (counts[role] || 0) + 1
    }
    const total = Object.values(counts).reduce((a,b)=>a+b,0) || 1
    const segments = []
    let acc = 0
    Object.entries(counts).forEach(([role,count]) => {
      const val = (count/total)*100
      segments.push({ role, count, start: acc, end: acc + val })
      acc += val
    })
    return segments
  }, [data.users])

  const eventsPerMonth = useMemo(() => {
    const arr = new Array(12).fill(0)
    const year = new Date().getFullYear()
    for (const ev of data.events || []) {
      const raw = ev.dates || ev.date || ev.event_date
      if (!raw) continue
      const dt = new Date(raw)
      if (isNaN(dt) || dt.getFullYear() !== year) continue
      arr[dt.getMonth()]++
    }
    return arr
  }, [data.events])

  return (
    <div className="admin-dash">
      <div className="admin-dash__row">
        <h2 className="admin-dash__title">Overview</h2>
        {loading && <span className="muted" style={{fontSize:'.7rem'}}>Loading…</span>}
        {error && <span className="error" style={{fontSize:'.7rem'}}>{error}</span>}
      </div>
      <div className="kpi-grid">
        {Object.entries(kpis).map(([k,v]) => <KpiCard key={k} label={k} value={v} />)}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Users by Role</h3>
          <PieChart segments={rolePie} />
        </div>
        <div className="chart-card">
          <h3>Events per Month</h3>
          <BarChart data={eventsPerMonth} />
        </div>
      </div>
    </div>
  )
}

function KpiCard({ label, value }) {
  return (
    <div className="kpi-card">
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
    </div>
  )
}

function PieChart({ segments }) {
  if (!segments.length) return <p style={{fontSize:'.7rem',opacity:.6}}>No data</p>
  const size = 140
  const stroke = 16
  const radius = (size - stroke) / 2
  return (
    <div className="pie-wrapper" style={{width:size, height:size}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>{segments.map((s,i)=>{
        const dash = ((s.end - s.start)/100)*Math.PI*2*radius
        const gap = Math.PI*2*radius - dash
        return <circle key={s.role} r={radius} cx={size/2} cy={size/2} fill="none" stroke={pickColor(i)} strokeWidth={stroke} strokeDasharray={`${dash} ${gap}`} strokeDashoffset={- (s.start/100)*Math.PI*2*radius} />
      })}</svg>
      <ul className="legend">
        {segments.map((s,i)=>(<li key={s.role}><span className="swatch" style={{background:pickColor(i)}} /> {s.role} ({s.count})</li>))}
      </ul>
    </div>
  )
}

function BarChart({ data }) {
  const max = Math.max(1, ...data)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return (
    <div className="bar-chart">
      {data.map((v,i)=>{
        const h = (v/max)*100
        return <div key={i} className="bar" title={`${months[i]}: ${v}`}> <div className="bar__inner" style={{height:`${h}%`}} /> <span className="bar__label">{months[i]}</span></div>
      })}
    </div>
  )
}

function pickColor(i) {
  const palette = ['#6366f1','#ec4899','#10b981','#f59e0b','#06b6d4','#8b5cf6','#ef4444']
  return palette[i % palette.length]
}

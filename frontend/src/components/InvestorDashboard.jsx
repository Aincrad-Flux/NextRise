import { useMemo } from 'react'
import { useInvestorProjects } from './InvestorProjectsContext.jsx'
import './Dashboard.css'

// Simple investor-oriented dashboard using existing chart primitives from Dashboard.css styling
export default function InvestorDashboard() {
  const { allProjects, invested, notInvested, stats } = useInvestorProjects()

  const tagBreakdown = useMemo(() => {
    const counts = new Map()
    allProjects.forEach(p => (p.tags||[]).forEach(t => counts.set(t, (counts.get(t)||0)+1)))
    return Array.from(counts.entries()).map(([label,value])=>({label,value})).sort((a,b)=>b.value-a.value).slice(0,8)
  }, [allProjects])

  const investedTagBreakdown = useMemo(() => {
    const counts = new Map()
    invested.forEach(p => (p.tags||[]).forEach(t => counts.set(t, (counts.get(t)||0)+1)))
    return Array.from(counts.entries()).map(([label,value])=>({label,value}))
  }, [invested])

  return (
    <section className="dashboard">
      <div className="cards-grid">
        <KpiCard label="Total Projects" value={stats.totalProjects} />
        <KpiCard label="Invested Projects" value={stats.investedCount} />
        <KpiCard label="Available Projects" value={stats.availableCount} />
        <KpiCard label="Invested Amount" value={formatCurrency(stats.investedAmount)} />
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-header"><h2>Top Tags (All)</h2></div>
          {tagBreakdown.length ? (
            <TagList data={tagBreakdown} />
          ) : <Empty text="No tags" />}
        </div>
        <div className="panel">
          <div className="panel-header"><h2>My Invested Tags</h2></div>
          {investedTagBreakdown.length ? (
            <TagList data={investedTagBreakdown} />
          ) : <Empty text="No investments yet" />}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header"><h2>Recently Added (Sample)</h2></div>
        <div className="table">
          <div className="table-row table-head">
            <div>Name</div>
            <div>Tags</div>
            <div>Progress</div>
          </div>
          {allProjects.slice(-6).map(p => (
            <div key={p.id} className="table-row">
              <div>{p.title}</div>
              <div>{(p.tags||[]).slice(0,3).join(', ')}</div>
              <div>{p.progress || 0}%</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function KpiCard({ label, value }) {
  return (
    <div className="card">
      <div className="card-value">{value}</div>
      <div className="card-label">{label}</div>
    </div>
  )
}

function TagList({ data }) {
  return (
    <ul className="legend">
      {data.map(d => (
        <li key={d.label}>
          <span className="dot" style={{ background: randomColor(d.label) }} />
          <span className="name">{d.label}</span>
          <span className="value">{d.value}</span>
        </li>
      ))}
    </ul>
  )
}

function Empty({ text }) { return <div className="empty">{text}</div> }

function randomColor(seed) {
  const palette = ['var(--violet-500)', 'var(--rose-400)', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#eab308', '#f97316', '#10b981']
  let h = 0; for (let i=0;i<seed.length;i++) h = (h*31 + seed.charCodeAt(i)) % palette.length
  return palette[h]
}

function formatCurrency(v) { return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v || 0) }

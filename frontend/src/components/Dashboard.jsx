import { useMemo } from 'react'
import './Dashboard.css'
import { projectMock } from '../data/projectMock'
import { projectsData } from '../data/projectsData'

export default function Dashboard() {
  // My projects (startup perspective)
  const myProjects = projectMock

  const kpis = useMemo(() => {
    const total = myProjects.length
    const avgProgress = Math.round(
      total ? myProjects.reduce((s, p) => s + (p.progress || 0), 0) / total : 0
    )
    const investors = myProjects.reduce((s, p) => s + (p.investorsWanted || 0), 0)
    const need = myProjects.reduce((s, p) => s + (p.amountNeeded || 0), 0)
    return { total, avgProgress, investors, need }
  }, [myProjects])

  const tagBreakdown = useMemo(() => {
    const counts = new Map()
    myProjects.forEach(p => (p.tags || []).forEach(t => counts.set(t, (counts.get(t) || 0) + 1)))
    const entries = Array.from(counts.entries()).map(([label, value]) => ({ label, value }))
    return entries.sort((a, b) => b.value - a.value)
  }, [myProjects])

  // Incubator-wide context from projectsData
  const latest = useMemo(() => {
    const items = projectsData
      .map(p => ({ name: p.name, sector: p.sector, created_at: new Date(p.created_at) }))
      .sort((a, b) => b.created_at - a.created_at)
      .slice(0, 6)
    return items
  }, [])

  const sectorPie = useMemo(() => {
    const counts = new Map()
    projectsData.forEach(p => counts.set(p.sector, (counts.get(p.sector) || 0) + 1))
    const list = Array.from(counts.entries()).map(([label, value]) => ({ label, value }))
    return list.sort((a, b) => b.value - a.value)
  }, [])

  const monthlySeries = useMemo(() => {
    // last 12 months inclusive
    const now = new Date()
    const months = []
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      months.push({ key, label: key, value: 0 })
    }
    const map = new Map(months.map(m => [m.key, m]))
    projectsData.forEach(p => {
      const d = new Date(p.created_at)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (map.has(key)) map.get(key).value++
    })
    return months
  }, [])

  const myProgressBars = useMemo(() => (
    myProjects.map(p => ({ label: p.title, value: p.progress || 0 }))
  ), [myProjects])

  return (
    <section className="dashboard">
      <div className="cards-grid">
        <KpiCard label="Mes projets" value={kpis.total} />
        <KpiCard label="Progression moyenne" value={`${kpis.avgProgress}%`} />
        <KpiCard label="Investisseurs recherchés" value={kpis.investors} />
        <KpiCard label="Besoin total" value={formatCurrency(kpis.need)} />
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-header"><h2>Tags de mes projets</h2></div>
          {tagBreakdown.length ? (
            <div className="chart-row">
              <DonutMulti data={withColors(tagBreakdown)} />
              <Legend items={withColors(tagBreakdown)} />
            </div>
          ) : (
            <EmptyState text="Aucun tag" />
          )}
        </div>

        <div className="panel">
          <div className="panel-header"><h2>Progression par projet</h2></div>
          {myProgressBars.length ? (
            <BarChartMini data={withColors(myProgressBars)} max={100} unit="%" />
          ) : (
            <EmptyState text="Aucun projet" />
          )}
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-header"><h2>Créations sur 12 mois</h2></div>
          <LineChartMini data={withColors(monthlySeries)} />
        </div>

        <div className="panel">
          <div className="panel-header"><h2>Répartition par secteur</h2></div>
          <div className="chart-row">
            <DonutMulti data={withColors(sectorPie)} />
            <Legend items={withColors(sectorPie)} />
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header"><h2>Dernières créations</h2></div>
        <div className="table">
          <div className="table-row table-head">
            <div>Nom</div>
            <div>Secteur</div>
            <div>Date</div>
          </div>
          {latest.map(r => (
            <div key={`${r.name}-${r.created_at.toISOString()}`} className="table-row">
              <div>{r.name}</div>
              <div>{r.sector}</div>
              <div>{formatDate(r.created_at)}</div>
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

function DonutMulti({ data, size = 160, stroke = 28 }) {
  const radius = (size - stroke) / 2
  const circ = 2 * Math.PI * radius
  const total = Math.max(1, data.reduce((s, d) => s + d.value, 0))
  let acc = 0
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="chart-donut">
      <circle cx={size/2} cy={size/2} r={radius} stroke="var(--color-border)" strokeWidth={stroke} fill="none" />
      {data.map((d, i) => {
        const ratio = d.value / total
        const dash = circ * ratio
        const offset = circ * acc
        acc += ratio
        return (
          <circle key={`${d.label}-${i}`}
            cx={size/2}
            cy={size/2}
            r={radius}
            stroke={d.color}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
            transform={`rotate(-90 ${size/2} ${size/2})`}
          />
        )
      })}
    </svg>
  )
}

function BarChartMini({ data, width = 560, height = 220, max = Math.max(...data.map(d => d.value), 1), unit }) {
  const padding = { t: 12, r: 12, b: 36, l: 36 }
  const innerW = width - padding.l - padding.r
  const innerH = height - padding.t - padding.b
  const barW = innerW / data.length - 8
  const scaleY = (v) => innerH - (v / max) * innerH
  return (
    <svg className="chart-bar" width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      <g transform={`translate(${padding.l},${padding.t})`}>
        <line x1={0} y1={innerH} x2={innerW} y2={innerH} stroke="var(--color-border)" />
        {data.map((d, i) => {
          const x = i * (barW + 8)
          const y = scaleY(d.value)
          const h = innerH - y
          return (
            <g key={`${d.label}-${i}`} transform={`translate(${x},0)`}>
              <rect x={0} y={y} width={barW} height={h} rx={4} fill={d.color} />
              <text x={barW / 2} y={innerH + 16} textAnchor="middle" className="chart-axis">
                {truncate(d.label, 10)}
              </text>
              <text x={barW / 2} y={y - 6} textAnchor="middle" className="chart-value">
                {d.value}{unit || ''}
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}

function LineChartMini({ data, width = 560, height = 220 }) {
  const padding = { t: 12, r: 12, b: 28, l: 36 }
  const innerW = width - padding.l - padding.r
  const innerH = height - padding.t - padding.b
  const xs = data.map((_, i) => (i / Math.max(1, data.length - 1)) * innerW)
  const max = Math.max(1, ...data.map(d => d.value))
  const ys = data.map(d => innerH - (d.value / max) * innerH)
  const points = xs.map((x, i) => `${x},${ys[i]}`).join(' ')
  const area = `0,${innerH} ${points} ${innerW},${innerH}`
  return (
    <svg className="chart-line" width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      <g transform={`translate(${padding.l},${padding.t})`}>
        <polyline fill="rgba(59,130,246,0.15)" stroke="none" points={area} />
        <polyline fill="none" stroke="var(--color-accent, #3b82f6)" strokeWidth="2" points={points} />
        {xs.map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={ys[i]} r={3} fill="var(--color-accent, #3b82f6)" />
            {i % 2 === 0 && (
              <text x={x} y={innerH + 16} textAnchor="middle" className="chart-axis">{shortMonth(data[i].label)}</text>
            )}
          </g>
        ))}
      </g>
    </svg>
  )
}

function Legend({ items }) {
  return (
    <ul className="legend">
      {items.map((it, i) => (
        <li key={`${it.label}-${i}`}>
          <span className="dot" style={{ background: it.color }} />
          <span className="name">{it.label}</span>
          <span className="value">{it.value}</span>
        </li>
      ))}
    </ul>
  )
}

function EmptyState({ text }) {
  return (
    <div className="empty">{text}</div>
  )
}

function withColors(arr) {
  const palette = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#eab308', '#f97316', '#10b981']
  return arr.map((d, i) => ({ ...d, color: d.color || palette[i % palette.length] }))
}

function truncate(s, n) { return s.length > n ? s.slice(0, n - 1) + '…' : s }
function shortMonth(key) { const [y, m] = key.split('-'); return `${m}/${y.slice(2)}` }
function formatCurrency(v) { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v || 0) }
function formatDate(d) { return new Intl.DateTimeFormat('fr-FR').format(d) }

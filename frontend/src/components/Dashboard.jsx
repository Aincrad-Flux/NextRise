const stats = [
  { label: 'Startups in the incubator', value: 42 },
  { label: 'Active projects', value: 18 },
  { label: 'Available invetisor', value: 12 },
  { label: 'Applications this month', value: 67 },
]

const recent = [
  { name: 'AstraBio', type: 'Startup', status: 'Onboarding' },
  { name: 'GreenGrid', type: 'Project', status: 'In Review' },
  { name: 'QuantumLeap', type: 'Startup', status: 'Active' },
  { name: 'FinFlow', type: 'Project', status: 'Planning' },
]

const engagements = { engaged: 54, total: 120 }
const engagementPct = Math.round((engagements.engaged / engagements.total) * 100)

export default function Dashboard() {
  return (
    <section className="dashboard">
      <div className="cards-grid">
        {stats.map((s) => (
          <div key={s.label} className="card">
            <div className="card-value">{s.value}</div>
            <div className="card-label">{s.label}</div>
          </div>
        ))}
        <div className="card engagement-card">
          <div className="card-label" style={{ marginBottom: '.5rem' }}>engagement rate</div>
          <div className="pie-wrapper">
            <PieChart engaged={engagements.engaged} total={engagements.total} />
            <div className="pie-center">
              <div className="pie-value">{engagementPct}%</div>
              <div className="pie-sub">{engagements.engaged}/{engagements.total}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>Recent Activity</h2>
        </div>
        <div className="table">
          <div className="table-row table-head">
            <div>Name</div>
            <div>Type</div>
            <div>Status</div>
          </div>

          {recent.map((r) => (
            <div key={r.name} className="table-row">
              <div>{r.name}</div>
              <div>{r.type}</div>
              <div>
                <span className={`status ${r.status.toLowerCase().replace(' ', '-')}`}>
                  {r.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PieChart({ engaged, total, size = 120, stroke = 14 }) {
  const radius = (size - stroke) / 2
  const circ = 2 * Math.PI * radius
  const ratio = engaged / total
  const dash = circ * ratio
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="pie-chart">
      <circle cx={size/2} cy={size/2} r={radius} stroke="var(--color-border)" strokeWidth={stroke} fill="none" />
      <circle
        cx={size/2}
        cy={size/2}
        r={radius}
        stroke="url(#grad)"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
      />
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-accent)" />
          <stop offset="100%" stopColor="#7dd3fc" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const stats = [
  { label: 'Startups in JEB Incubator', value: 42 },
  { label: 'Active Projects', value: 18 },
  { label: 'Mentors Available', value: 12 },
  { label: 'Applications This Month', value: 67 },
]

const recent = [
  { name: 'AstraBio', type: 'Startup', status: 'Onboarding' },
  { name: 'GreenGrid', type: 'Project', status: 'In Review' },
  { name: 'QuantumLeap', type: 'Startup', status: 'Active' },
  { name: 'FinFlow', type: 'Project', status: 'Planning' },
]

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

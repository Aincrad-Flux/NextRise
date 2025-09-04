export default function ProjectsPanel() {
  const projects = [
    { name: 'GreenGrid Optimizer', owner: 'GreenGrid', status: 'Active', progress: 72 },
    { name: 'AstraBio Analytics', owner: 'AstraBio', status: 'In Review', progress: 43 },
    { name: 'QuantumLeap SDK', owner: 'QuantumLeap', status: 'Planning', progress: 15 },
    { name: 'FinFlow Mobile', owner: 'FinFlow', status: 'Active', progress: 58 },
  ]

  return (
    <section className="panel">
      <div className="panel-header"><h2>Projets</h2></div>
      <div className="table">
        <div className="table-row table-head">
          <div>Name</div>
          <div>Startup</div>
          <div>Status</div>
        </div>
        {projects.map(p => (
          <div key={p.name} className="table-row">
            <div>{p.name}</div>
            <div>{p.owner}</div>
            <div><span className={`status ${cssStatus(p.status)}`}>{p.status}</span></div>
          </div>
        ))}
      </div>
    </section>
  )
}

function cssStatus(label) {
  switch (label) {
    case 'Actif': return 'active'
    case 'En revue': return 'in-review'
    case 'Planification': return 'planning'
    default: return ''
  }
}
export default function ProjectsPanel() {
  const projects = [
    { name: 'GreenGrid Optimizer', owner: 'GreenGrid', status: 'Actif', progress: 72 },
    { name: 'AstraBio Analytics', owner: 'AstraBio', status: 'En revue', progress: 43 },
    { name: 'QuantumLeap SDK', owner: 'QuantumLeap', status: 'Planification', progress: 15 },
    { name: 'FinFlow Mobile', owner: 'FinFlow', status: 'Actif', progress: 58 },
  ]

  return (
    <section className="panel">
      <div className="panel-header"><h2>Projets</h2></div>
      <div className="table">
        <div className="table-row table-head">
          <div>Nom</div>
          <div>Startup</div>
          <div>Statut</div>
          <div>Avancement</div>
        </div>
        {projects.map(p => (
          <div key={p.name} className="table-row">
            <div>{p.name}</div>
            <div>{p.owner}</div>
            <div><span className={`status ${cssStatus(p.status)}`}>{p.status}</span></div>
            <div>
              <div className="progress-bar"><span style={{ width: `${p.progress}%` }} /></div>
            </div>
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
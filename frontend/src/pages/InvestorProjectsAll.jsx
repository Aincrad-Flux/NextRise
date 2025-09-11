import { useState, useMemo } from 'react'
import { useInvestorProjects } from '../components/InvestorProjectsContext.jsx'
import MultiSelect from '../components/MultiSelect.jsx'
import ProjectCard from '../components/ProjectCard.jsx'

export default function InvestorProjectsAll() {
  const { notInvested, invest } = useInvestorProjects()
  const [nameQuery, setNameQuery] = useState('')
  const allTags = useMemo(() => Array.from(new Set(notInvested.flatMap(p => p.tags||[]))).sort(), [notInvested])
  const [selectedTags, setSelectedTags] = useState([])
  const [pending, setPending] = useState(null)

  const filtered = useMemo(() => {
    return notInvested.filter(p => {
      const matchName = nameQuery ? p.title.toLowerCase().includes(nameQuery.toLowerCase()) : true
      const matchTags = selectedTags.length ? selectedTags.every(t => (p.tags||[]).includes(t)) : true
      return matchName && matchTags
    })
  }, [notInvested, nameQuery, selectedTags])

  function confirmInvest(p) { setPending(p) }
  function doInvest() { if (pending) invest(pending.id); setPending(null) }

  return (
    <section className="investor-projects">
      <div className="filters" style={{display:'flex',gap:'1rem',flexWrap:'wrap',marginBottom:'1rem'}}>
        <div style={{flex:'1 1 220px'}}>
          <label style={{display:'block',fontSize:'.7rem',fontWeight:600,letterSpacing:'.5px',textTransform:'uppercase',marginBottom:4}}>Search by name</label>
          <input value={nameQuery} onChange={e=>setNameQuery(e.target.value)} placeholder="Type project name..." style={inputStyle} />
        </div>
        <div style={{flex:'1 1 260px',minWidth:260}}>
          <MultiSelect label="Filter tags" options={allTags} values={selectedTags} onChange={setSelectedTags} placeholder="Tags" />
        </div>
      </div>
      {filtered.length === 0 && <p style={{opacity:.7}}>No projects match the current filters.</p>}
      <div className="cards-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'1rem'}}>
        {filtered.map(p => (
          <div key={p.id} className="invest-card-wrapper">
            <ProjectCard project={p} />
            <button className="primary-btn" onClick={()=>confirmInvest(p)} style={{marginTop:'.5rem',width:'100%'}}>Invest</button>
          </div>
        ))}
      </div>
      {pending && (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={()=>setPending(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()} style={modalStyle}>
            <h2 style={{marginTop:0}}>Confirm Investment</h2>
            <p>Do you confirm investing in <strong>{pending.title}</strong>?</p>
            <div style={{display:'flex',gap:'.75rem',justifyContent:'flex-end',marginTop:'1rem'}}>
              <button type="button" onClick={()=>setPending(null)} className="pc-btn">Cancel</button>
              <button type="button" onClick={doInvest} className="primary-btn">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

const inputStyle = { width:'100%',padding:'.65rem .75rem',border:'1px solid var(--color-border)',borderRadius:'10px',background:'var(--color-surface-alt)',color:'var(--color-text)',font:'inherit' }
const modalStyle = { background:'var(--color-surface)',padding:'1.5rem',borderRadius:'18px',border:'1px solid var(--color-border)',maxWidth:400,width:'100%' }

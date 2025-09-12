import ProjectCard from '../components/ProjectCard.jsx'
import { useInvestorProjects } from '../components/InvestorProjectsContext.jsx'

export default function InvestorProjectsInvested() {
  const { invested, divest } = useInvestorProjects()
  return (
    <section>
      <h2 style={{marginTop:0}}>My Investments</h2>
      {invested.length === 0 && <p style={{opacity:.7}}>You have not invested in any project yet.</p>}
      <div className="cards-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'1rem'}}>
        {invested.map(p => (
          <div key={p.id} className="invest-card-wrapper">
            <ProjectCard project={p} />
            <button className="pc-btn danger" style={{marginTop:'.5rem',width:'100%'}} onClick={()=>divest(p.id)}>Remove</button>
          </div>
        ))}
      </div>
    </section>
  )
}

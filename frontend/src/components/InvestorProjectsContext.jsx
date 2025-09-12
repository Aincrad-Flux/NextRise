import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { projectMock } from '../data/projectMock'

const InvestorProjectsContext = createContext(null)

export function InvestorProjectsProvider({ children }) {
  const [investedIds, setInvestedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('investedProjectIds')||'[]') } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('investedProjectIds', JSON.stringify(investedIds))
  }, [investedIds])

  const allProjects = projectMock
  const invested = useMemo(() => allProjects.filter(p => investedIds.includes(p.id)), [allProjects, investedIds])
  const notInvested = useMemo(() => allProjects.filter(p => !investedIds.includes(p.id)), [allProjects, investedIds])

  const invest = useCallback((id) => {
    setInvestedIds(ids => ids.includes(id) ? ids : [...ids, id])
  }, [])
  const divest = useCallback((id) => {
    setInvestedIds(ids => ids.filter(x => x !== id))
  }, [])

  const stats = useMemo(() => {
    const totalAmount = invested.reduce((s,p)=>s+(p.amountNeeded||0),0)
    return {
      totalProjects: allProjects.length,
      investedCount: invested.length,
      availableCount: notInvested.length,
      investedAmount: totalAmount
    }
  }, [invested, allProjects, notInvested])

  return (
    <InvestorProjectsContext.Provider value={{ allProjects, invested, notInvested, invest, divest, investedIds, stats }}>
      {children}
    </InvestorProjectsContext.Provider>
  )
}

export function useInvestorProjects() {
  const ctx = useContext(InvestorProjectsContext)
  if (!ctx) throw new Error('useInvestorProjects must be used within InvestorProjectsProvider')
  return ctx
}

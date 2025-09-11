import { useEffect, useMemo, useState } from 'react'
import { logger } from '../utils/logger.js'
import './DataManager.css'

/**
 * Generic CRUD manager for arbitrary backend resources exposed under /api/db/{resource}.
 * Automatically fetches list, infers columns from data, and provides create / edit / delete.
 * Simplistic implementation; adjust for pagination, validation, auth, etc.
 *
 * Props:
 *  - resource (string) required: backend collection path segment.
 *  - idField (string) default 'id': primary key param name.
 *  - columns (array) optional: [{ key, label, render?: (value,row) => JSX }]. If omitted, derived from first row keys.
 *  - pageSize (number) default 25 (client side slice only).
 *  - transformSubmit (fn) optional: (formObj, isEdit) => payload to send.
 */
export default function DataManager({ resource, idField = 'id', columns, pageSize = 25, transformSubmit }) {
  const API_BASE = (import.meta?.env?.VITE_BACKEND_URL || '').replace(/\/$/, '')
  const baseUrl = `${API_BASE}/api/db/${resource}`.replace(/\/+$/, '')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [editItem, setEditItem] = useState(null) // object or null
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState(null) // id value
  const [refreshIndex, setRefreshIndex] = useState(0)

  useEffect(() => { fetchList() }, [refreshIndex])

  async function fetchList() {
    setLoading(true); setError(null)
    try {
      const url = `${baseUrl}?select=*`
      logger.info('DataManager fetch', { resource, url })
      const res = await fetch(url, { credentials: 'include' })
      if (!res.ok) throw new Error(`List failed ${res.status}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setItems(data)
      } else if (data) {
        if (Array.isArray(data.items)) setItems(data.items)
        else if (Array.isArray(data.tables)) setItems(data.tables)
        else {
          // fallback: first array property
            const firstArray = Object.values(data).find(v => Array.isArray(v))
            if (Array.isArray(firstArray)) setItems(firstArray)
            else setItems([])
        }
      } else {
        setItems([])
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const effectiveColumns = useMemo(() => {
    if (columns && columns.length) return columns
    const first = items[0]
    if (!first) return []
    return Object.keys(first).filter(k => !['password','secret','token'].includes(k)).map(k => ({ key: k, label: k }))
  }, [columns, items])

  function openCreate() { setEditItem(null); setShowForm(true) }
  function openEdit(row) { setEditItem(row); setShowForm(true) }
  function closeForm() { setShowForm(false); setEditItem(null) }

  async function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const obj = {}
    for (const [k,v] of formData.entries()) {
      if (v === '') continue
      // naive number parse
      obj[k] = v === 'true' ? true : v === 'false' ? false : (Number.isFinite(Number(v)) && v.trim() !== '' && v === String(Number(v))) ? Number(v) : v
    }
    const payload = transformSubmit ? transformSubmit(obj, !!editItem) : obj
    const isEdit = !!editItem
    const targetUrl = isEdit ? `${baseUrl}/${encodeURIComponent(editItem[idField])}` : baseUrl
    const method = isEdit ? 'PATCH' : 'POST'
    logger.info('DataManager submit', { resource, method, targetUrl })
    try {
      const res = await fetch(targetUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      })
      if (!res.ok) throw new Error(`${method} failed ${res.status}`)
      closeForm(); setRefreshIndex(i => i+1)
    } catch (e) {
      alert(e.message)
    }
  }

  async function confirmDelete(id) {
    if (!window.confirm('Delete item?')) return
    try {
      const res = await fetch(`${baseUrl}/${encodeURIComponent(id)}`, { method: 'DELETE', credentials: 'include' })
      if (!res.ok) throw new Error(`Delete failed ${res.status}`)
      setRefreshIndex(i => i+1)
    } catch (e) {
      alert(e.message)
    } finally { setDeleting(null) }
  }

  return (
    <div className="data-manager">
      <div className="dm-header">
        <h2 style={{margin:0,textTransform:'capitalize'}}>{resource}</h2>
        <div className="dm-actions">
          <button onClick={() => setRefreshIndex(i=>i+1)} disabled={loading}>Refresh</button>
          <button onClick={openCreate}>New</button>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{color:'var(--color-danger,#c00)'}}>{error}</p>}
      <div className="dm-cards-grid">
        {items.slice(0,pageSize).map(row => (
          <article key={row[idField]} className="dm-card">
            <h3 className="dm-card__title">{row[idField] || '(no id)'}</h3>
            <div className="dm-card__fields">
              {effectiveColumns.filter(c => c.key !== idField).map(c => (
                <div key={c.key} className="dm-card__field">
                  <span>{c.label}</span>
                  <div>{c.render ? c.render(row[c.key], row) : formatCell(row[c.key])}</div>
                </div>
              ))}
            </div>
            <div className="dm-card__actions">
              <button onClick={() => openEdit(row)}>Edit</button>
              <button className="delete" onClick={() => confirmDelete(row[idField])}>Delete</button>
            </div>
          </article>
        ))}
        {!loading && items.length === 0 && (
          <div style={{gridColumn:'1/-1',opacity:.7,fontSize:'.8rem'}}>No data</div>
        )}
      </div>
      {showForm && (
        <div className="dm-modal" style={modalStyle}>
          <div className="dm-dialog" style={dialogStyle}>
            <h3 style={{marginTop:0}}>{editItem ? 'Edit' : 'Create'} {resource}</h3>
            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:8}}>
              {renderFormFields(editItem, effectiveColumns, idField)}
              <div style={{display:'flex',gap:8,marginTop:8}}>
                <button type="submit">Save</button>
                <button type="button" onClick={closeForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function renderFormFields(editItem, columns, idField) {
  const fields = columns.filter(c => c.key !== idField)
  if (fields.length === 0 && editItem) return <p>No editable fields</p>
  if (fields.length === 0) return <p>No fields detected (add first row manually via API)</p>
  return fields.map(c => {
    const val = editItem ? editItem[c.key] : ''
    const type = typeof val
    if (type === 'number') return fieldWrapper(c.key, <input name={c.key} defaultValue={val} type="number" />)
    if (type === 'boolean') return fieldWrapper(c.key, <select name={c.key} defaultValue={String(val)}><option value="true">true</option><option value="false">false</option></select>)
    if (val && typeof val === 'object') return fieldWrapper(c.key, <textarea name={c.key} defaultValue={JSON.stringify(val,null,2)} rows={4} />)
    return fieldWrapper(c.key, <input name={c.key} defaultValue={val} />)
  })
}

function fieldWrapper(label, control) {
  return <label key={label} style={{display:'flex',flexDirection:'column',fontSize:12,gap:4}}>{label}{control}</label>
}

function formatCell(v) {
  if (v == null) return ''
  if (typeof v === 'object') return <code style={{fontSize:11}}>{JSON.stringify(v)}</code>
  const s = String(v)
  if (s.length > 60) return s.slice(0,57)+'…'
  return s
}

const modalStyle = {
  position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000
}
const dialogStyle = {background:'#fff',color:'#111',padding:20,minWidth:300,maxWidth:600,borderRadius:8,boxShadow:'0 4px 16px rgba(0,0,0,0.25)'}

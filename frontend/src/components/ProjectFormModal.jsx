import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../pages/Projects.css';

export default function ProjectFormModal({ open, initial, tagSuggestions = [], onCancel, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0);
  const [investorsWanted, setInvestorsWanted] = useState(0);
  const [amountNeeded, setAmountNeeded] = useState(0);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  const overlayRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title || '');
    setDescription(initial?.description || '');
    setProgress(Number.isFinite(initial?.progress) ? initial.progress : 0);
    setInvestorsWanted(Number.isFinite(initial?.investorsWanted) ? initial.investorsWanted : 0);
    setAmountNeeded(Number.isFinite(initial?.amountNeeded) ? initial.amountNeeded : 0);
    setTags(Array.isArray(initial?.tags) ? initial.tags : []);
    setTagInput('');
    setErrors({});
  }, [open, initial]);

  // simple validation
  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = 'Titre requis';
    if (!description.trim()) e.description = 'Description requise';
    if (!(progress >= 0 && progress <= 100)) e.progress = 'Avancement 0-100';
    if (!(investorsWanted >= 0)) e.investorsWanted = 'Valeur >= 0';
    if (!(amountNeeded >= 0)) e.amountNeeded = 'Montant >= 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addTag = (t) => {
    const v = t.trim();
    if (!v) return;
    if (!tags.includes(v)) setTags([...tags, v]);
    setTagInput('');
  };
  const removeTag = (t) => setTags(tags.filter(x => x !== t));

  const filteredSuggestions = useMemo(() => tagSuggestions
    .filter(s => s.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(s))
    .slice(0, 6), [tagSuggestions, tagInput, tags]);

  const submit = (e) => {
    e?.preventDefault?.();
    if (!validate()) return;
    const payload = {
      ...(initial?.id ? { id: initial.id } : {}),
      title: title.trim(),
      description: description.trim(),
      progress: Math.round(Number(progress) || 0),
      investorsWanted: Math.round(Number(investorsWanted) || 0),
      amountNeeded: Math.round(Number(amountNeeded) || 0),
      tags
    };
    onSave?.(payload);
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={(e)=>{ if (e.target === overlayRef.current) onCancel?.(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="pfm-title" onClick={(e)=>e.stopPropagation()}>
        <button className="close-btn" onClick={onCancel} aria-label="Fermer">×</button>
        <h2 id="pfm-title" style={{ marginBottom: '.75rem' }}>{initial?.id ? 'Modifier le projet' : 'Nouveau projet'}</h2>
        <form className="project-form" onSubmit={submit}>
          <div>
            <label>Title*</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Titre du projet" />
            {errors.title && <div style={{ color: 'var(--color-danger)', fontSize: '.75rem' }}>{errors.title}</div>}
          </div>
          <div>
            <label>Avancement (0-100)*</label>
            <input type="number" min={0} max={100} value={progress} onChange={e=>setProgress(Number(e.target.value))} />
            {errors.progress && <div style={{ color: 'var(--color-danger)', fontSize: '.75rem' }}>{errors.progress}</div>}
          </div>
          <div>
            <label>Investisseurs recherchés*</label>
            <input type="number" min={0} value={investorsWanted} onChange={e=>setInvestorsWanted(Number(e.target.value))} />
            {errors.investorsWanted && <div style={{ color: 'var(--color-danger)', fontSize: '.75rem' }}>{errors.investorsWanted}</div>}
          </div>
          <div>
            <label>Montant nécessaire (€)*</label>
            <input type="number" min={0} step={1000} value={amountNeeded} onChange={e=>setAmountNeeded(Number(e.target.value))} />
            {errors.amountNeeded && <div style={{ color: 'var(--color-danger)', fontSize: '.75rem' }}>{errors.amountNeeded}</div>}
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label>Description*</label>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Décrivez le projet, les objectifs, le marché, etc." />
            {errors.description && <div style={{ color: 'var(--color-danger)', fontSize: '.75rem' }}>{errors.description}</div>}
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label>Tags</label>
            <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <input style={{ flex: '1 1 220px' }} value={tagInput} onChange={e=>setTagInput(e.target.value)} placeholder="Ajouter un tag et Entrée" onKeyDown={e=>{ if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); } }} />
              <button type="button" className="pc-btn" onClick={()=>addTag(tagInput)}>Ajouter</button>
            </div>
            {filteredSuggestions.length > 0 && (
              <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginTop: '.5rem' }}>
                {filteredSuggestions.map(s => (
                  <button key={s} type="button" className="pc-chip" onClick={()=>addTag(s)}>{s}</button>
                ))}
              </div>
            )}
            {tags.length > 0 && (
              <div className="project-card__tags" style={{ marginTop: '.6rem' }}>
                {tags.map(t => (
                  <span key={t} className="pc-tag" onClick={()=>removeTag(t)} title="Cliquer pour retirer">{t} ×</span>
                ))}
              </div>
            )}
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '.6rem', justifyContent: 'flex-end', marginTop: '.4rem' }}>
            <button type="button" className="pc-btn" onClick={onCancel}>Annuler</button>
            <button type="submit" className="primary-btn">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
}

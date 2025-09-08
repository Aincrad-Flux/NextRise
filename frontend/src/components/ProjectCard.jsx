import React from 'react';

export default function ProjectCard({ project, onEdit, onDelete, onOpen }) {
  const { title, description, progress = 0, investorsWanted = 0, amountNeeded = 0, tags = [] } = project;

  const shortDesc = (description || '').split('\n')[0];
  const amountFmt = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amountNeeded || 0);

  return (
    <article className="project-card">
      <header className="project-card__header">
        <h3 className="project-card__title" title={title}>{title}</h3>
        <div className="project-card__actions">
          {onEdit && <button className="pc-btn" onClick={() => onEdit(project)} aria-label="Modifier">Éditer</button>}
          {onDelete && <button className="pc-btn danger" onClick={() => onDelete(project)} aria-label="Supprimer">Supprimer</button>}
        </div>
      </header>

      {tags?.length > 0 && (
        <div className="project-card__tags">
          {tags.slice(0, 6).map(t => (
            <span key={t} className="pc-tag">{t}</span>
          ))}
          {tags.length > 6 && <span className="pc-tag more">+{tags.length - 6}</span>}
        </div>
      )}

      <p className="project-card__desc">{shortDesc || 'Aucune description.'}</p>

      <div className="project-card__meta">
        <div className="pc-progress">
          <div className="pc-progress__bar"><span style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} /></div>
          <div className="pc-progress__label">Avancement: {Math.round(progress)}%</div>
        </div>
        <div className="pc-stats">
          <div className="pc-stat"><strong>{investorsWanted}</strong><span>Investisseurs recherchés</span></div>
          <div className="pc-stat"><strong>{amountFmt}</strong><span>Montant nécessaire</span></div>
        </div>
      </div>

      {onOpen && <button className="primary-btn" onClick={() => onOpen(project)} style={{ marginTop: '.5rem' }}>Détails</button>}
    </article>
  );
}

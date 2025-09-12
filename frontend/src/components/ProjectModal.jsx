import { useRef } from 'react';
import jsPDF from 'jspdf';
import ProjectCard from './ProjectCard.jsx';
import { projectMock } from '../data/projectMock.js';
import './TopBar.css';

// Helper: readable labels
function formatLabel(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, c => c.toUpperCase());
}

// Helper: value formatting (arrays, objects, primitives)
function formatValue(val) {
  if (val == null || val === '') return '';
  if (Array.isArray(val)) return val.length ? val.join(', ') : '';
  if (typeof val === 'object') {
    try { return JSON.stringify(val, null, 2); } catch { return String(val); }
  }
  return String(val);
}

export default function ProjectModal({ project, onClose }) {
  const contentRef = useRef(null);
  if (!project) return null;

  // For demo: assign 1-2 mock projects to each startup
  const relatedProjects = projectMock.filter((p, i) => (project.id % 2 === 0 ? i % 2 === 0 : i % 2 === 1));

  const handleExport = () => {
    const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // --- Page 1: Startup info in two columns by categories ---
    const leftX = 40;
    const rightX = pageWidth / 2 + 10; // small gutter
    let yLeft = 70;
    let yRight = 70;

  pdf.setFontSize(22);
    pdf.text(project.name || 'Startup', leftX, 40, { maxWidth: pageWidth - 80 });
  pdf.setFontSize(12);

    const columnWidth = pageWidth / 2 - 50; // margin & gutter
  const lineHeight = 16;

    const drawCategory = (catLabel, items, column) => {
      const startX = column === 'left' ? leftX : rightX;
      let y = column === 'left' ? yLeft : yRight;

      // Ensure space; if near page end, add new page and reset both columns
      const ensureSpace = (needed = lineHeight * 3) => {
        if (y > pageHeight - needed) {
          pdf.addPage();
          yLeft = yRight = 70;
          y = column === 'left' ? yLeft : yRight;
        }
      };

      ensureSpace();
  pdf.setFont(undefined, 'bold');
  pdf.setFontSize(13);
  pdf.text(catLabel, startX, y);
  pdf.setFontSize(12);
      pdf.setFont(undefined, 'normal');
  y += lineHeight - 4; // slightly tighter after heading

      items.forEach(({ label, value }) => {
        if (!value) return;
        const fullLine = `${label}: ${value}`;
        const wrapped = pdf.splitTextToSize(fullLine, columnWidth);
        wrapped.forEach(line => {
          ensureSpace();
          pdf.text(line, startX, y, { maxWidth: columnWidth });
          y += lineHeight;
        });
      });
  y += 10; // larger gap after category

      if (column === 'left') yLeft = y; else yRight = y;
    };

    // Prepare categories preserving original order but excluding duplicates
    const categoriesDef = [
      { label: 'General', keys: ['description','sector','maturity','project_status','needs'] },
      { label: 'Contact', keys: ['email','phone','website_url','social_media_url','address'] },
      { label: 'Legal', keys: ['legal_status','created_at'] },
      { label: 'Team', keys: ['founders'] },
      { label: 'Status', keys: ['project_status','maturity','needs'] },
      { label: 'Online Presence', keys: ['website_url','social_media_url'] },
      { label: 'Location', keys: ['address'] }
    ];

    const usedCat = new Set();
    const finalCats = categoriesDef.filter(c => {
      const hasAny = c.keys.some(k => project[k] && project[k] !== '' && project[k] != null);
      if (!hasAny || usedCat.has(c.label)) return false;
      usedCat.add(c.label);
      return true;
    });

    // Map to label/value pairs
    const mappedCats = finalCats.map(c => ({
      label: c.label,
      items: c.keys.map(k => {
        let raw = project[k];
        if (!raw || raw === '' || raw == null) return null;
        if (k === 'founders' && Array.isArray(raw)) raw = raw.map(f => f.name).join(', ');
        if (k === 'created_at') { try { raw = new Date(raw).toLocaleDateString(); } catch {} }
        return { label: formatLabel(k), value: Array.isArray(raw) ? raw.join(', ') : String(raw) };
      }).filter(Boolean)
    }));

    // Alternate columns left/right
    mappedCats.forEach((cat, idx) => {
      const column = idx % 2 === 0 ? 'left' : 'right';
      drawCategory(cat.label, cat.items, column);
    });

    // --- Page 2: Related projects list ---
    pdf.addPage();
  pdf.setFontSize(18);
    pdf.setFont(undefined, 'bold');
    pdf.text(`Projets réalisés par ${project.name || ''}`.trim(), 40, 50, { maxWidth: pageWidth - 80 });
    pdf.setFont(undefined, 'normal');
  pdf.setFontSize(12);

    let y = 80;
    const maxWidth = pageWidth - 80;
  const writeWrapped = (text, style='normal') => {
      pdf.setFont(undefined, style);
      const lines = pdf.splitTextToSize(text, maxWidth);
      lines.forEach(l => {
        if (y > pageHeight - 60) { pdf.addPage(); y = 50; }
        pdf.text(l, 40, y);
        y += lineHeight;
      });
      pdf.setFont(undefined, 'normal');
    };

    relatedProjects.forEach((p, idx) => {
      writeWrapped(`## Name : ${p.title || p.name || 'Projet'}`, 'bold');
      if (p.description) writeWrapped(`Description : ${p.description}`);
      if (p.tags && p.tags.length) writeWrapped(`Tags : ${p.tags.join(', ')}`);
      if (p.investorsWanted != null) writeWrapped(`Investors wanted : ${p.investorsWanted}`);
      if (p.amountNeeded != null) writeWrapped(`Amount needed : ${p.amountNeeded} EUR`);
      if (idx < relatedProjects.length - 1) {
        if (y > pageHeight - 70) { pdf.addPage(); y = 50; }
        pdf.setDrawColor(200);
        pdf.line(40, y, pageWidth - 40, y);
        y += 18;
      }
    });

    // Add hyperlinks for website and social media on first page (simple link area near bottom if present)
    const urlFields = ['website_url','social_media_url'].filter(f => project[f] && /^https?:\/\//i.test(project[f]));
    if (urlFields.length) {
      pdf.addPage();
      pdf.setFontSize(14);
      pdf.setFont(undefined,'bold');
      pdf.text('Liens utiles', 40, 60);
      pdf.setFont(undefined,'normal');
      pdf.setFontSize(12);
      let ly = 90;
      urlFields.forEach(f => {
        const url = project[f];
        const label = formatLabel(f);
        pdf.textWithLink(`${label}: ${url}`, 40, ly, { url });
        ly += 22;
      });
    }

    pdf.save(`${(project.name || 'projet').replace(/[^a-z0-9]/gi,'_')}.pdf`);
  };

  // Group info by category
  const categories = [
    {
      label: 'General',
      keys: ['name', 'description', 'sector', 'maturity', 'project_status', 'needs']
    },
    {
      label: 'Contact',
      keys: ['email', 'phone', 'website_url', 'social_media_url', 'address']
    },
    {
      label: 'Legal',
      keys: ['legal_status', 'created_at', 'founders']
    },
    {
      label: 'Team',
      keys: ['founders']
    },
    {
      label: 'Status',
      keys: ['project_status', 'maturity', 'needs']
    },
    {
      label: 'Online Presence',
      keys: ['website_url', 'social_media_url']
    },
    {
      label: 'Location',
      keys: ['address']
    }
  ];
  const entries = Object.entries(project).filter(([k,v]) => v != null && v !== '');
  const getEntry = key => entries.find(([k]) => k === key);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{maxWidth:'700px'}}>
        <button className="close-btn" onClick={onClose} aria-label="Close">×</button>
        <button className="export-btn" onClick={handleExport}>Export</button>
        <div ref={contentRef} className="modal-content" style={{ color: '#000' }}>
          {/* Added extra top margin to push text below the Export/Close buttons */}
          <h2 style={{margin:'1.6rem 0 .6rem 0', textAlign:'left'}}>{project.name}</h2>
          {getEntry('description') && (
            <p style={{ marginBottom: '1.2rem', whiteSpace: 'pre-line', fontSize:'1.05rem', color:'#444', textAlign:'left' }}>{getEntry('description')[1]}</p>
          )}
          <div className="modal-categories-grid" style={{
            display:'grid',
            gridTemplateColumns:'repeat(2, minmax(180px, 1fr))',
            gap:'1.5rem',
            marginBottom:'2rem'
          }}>
            {categories.map(cat => {
              // Only show category if at least one key is present
              const hasAny = cat.keys.some(key => getEntry(key));
              if (!hasAny) return null;
              return (
                <div key={cat.label} style={{minWidth:'180px'}}>
                  <h4 style={{margin:'0 0 .4rem 0', fontSize:'.98rem', color:'var(--violet-700,#7c3aed)', textAlign:'left'}}>{cat.label}</h4>
                  <ul style={{listStyle:'none', padding:0, margin:0, fontSize:'.92rem'}}>
                    {cat.keys.map(key => {
                      const entry = getEntry(key);
                      if (!entry) return null;
                      let value = formatValue(entry[1]);
                      if (key === 'founders' && Array.isArray(entry[1])) {
                        value = entry[1].map(f => f.name).join(', ');
                      }
                      if (key === 'created_at') {
                        value = new Date(entry[1]).toLocaleDateString();
                      }
                      if (!value) return null;

                      // Detect URL fields and render as hyperlink
                      const isUrlField = ['website_url','social_media_url'].includes(key) && /^https?:\/\//i.test(value);
                      const renderedValue = isUrlField ? (
                        <a href={value} target="_blank" rel="noopener noreferrer" style={{color:'var(--violet-600,#7c3aed)', textDecoration:'underline'}}>{value}</a>
                      ) : value;

                      return (
                        <li key={key} style={{marginBottom:'.3rem', textAlign:'left'}}>
                          <span style={{fontWeight:600, opacity:.7}}>{formatLabel(key)}: </span>
                          <span>{renderedValue}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
          <div style={{marginTop:'1.5rem'}}>
            <h3 style={{marginBottom:'.7rem', fontSize:'1.1rem', color:'var(--violet-700,#7c3aed)'}}>Projets réalisés</h3>
            <div style={{display:'flex', flexWrap:'wrap', gap:'1.2rem'}}>
              {relatedProjects.map(proj => (
                <div key={proj.id} style={{flex:'1 1 260px', minWidth:'220px', maxWidth:'320px'}}>
                  <ProjectCard project={proj} />
                </div>
              ))}
              {relatedProjects.length === 0 && <p style={{opacity:.6}}>Aucun projet associé.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

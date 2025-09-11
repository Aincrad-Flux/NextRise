import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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

  const handleExport = async () => {
    if (!contentRef.current) return;
    const element = contentRef.current;
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 60;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let y = 40;
    pdf.setFontSize(18);
    pdf.text(project.name || 'Projet', 30, y);
    y += 22;
    pdf.setFontSize(10);
    // Build a condensed meta block (first few key/value lines)
    const metaKeys = Object.keys(project).filter(k => !['id','name','description'].includes(k));
    const preview = metaKeys.slice(0, 6).map(k => `${formatLabel(k)}: ${formatValue(project[k])}`);
    preview.forEach(line => { pdf.text(line.substring(0, 110), 30, y); y += 12; });
    y += 6;

    if (imgHeight < pageHeight - y - 40) {
      pdf.addImage(imgData, 'PNG', 30, y, imgWidth, imgHeight);
    } else {
      let remainingHeight = imgHeight;
      let position = y;
      let sourceY = 0;
      const sliceHeight = canvas.height * ((pageHeight - y - 40) / imgHeight);
      let pageIndex = 0;
      while (remainingHeight > 0) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        const currentSliceHeight = Math.min(sliceHeight, canvas.height - sourceY);
        tempCanvas.height = currentSliceHeight;
        const ctx = tempCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, sourceY, canvas.width, currentSliceHeight, 0, 0, canvas.width, currentSliceHeight);
        const sliceData = tempCanvas.toDataURL('image/png');
        const sliceDisplayHeight = (currentSliceHeight * imgWidth) / canvas.width;
        if (pageIndex > 0) { pdf.addPage(); position = 40; }
        pdf.addImage(sliceData, 'PNG', 30, position, imgWidth, sliceDisplayHeight);
        remainingHeight -= sliceDisplayHeight;
        sourceY += currentSliceHeight;
        pageIndex++;
      }
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
            <h3 style={{marginBottom:'.7rem', fontSize:'1.1rem', color:'var(--violet-700,#7c3aed)'}}>Projects by this startup</h3>
            <div style={{display:'flex', flexWrap:'wrap', gap:'1.2rem'}}>
              {relatedProjects.map(proj => (
                <div key={proj.id} style={{flex:'1 1 260px', minWidth:'220px', maxWidth:'320px'}}>
                  <ProjectCard project={proj} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

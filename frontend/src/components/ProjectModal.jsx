import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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

  // Prepare ordered entries: name, description first
  const entries = Object.entries(project).filter(([k,v]) => v != null && v !== '')
    .sort(([a],[b]) => a.localeCompare(b));
  const nameEntry = entries.find(e => e[0] === 'name');
  const descriptionEntry = entries.find(e => e[0] === 'description');
  const rest = entries.filter(([k]) => !['name','description'].includes(k));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Fermer">×</button>
        <button className="export-btn" onClick={handleExport}>Export</button>
        <div ref={contentRef} className="modal-content" style={{ color: '#000' }}>
          {nameEntry && <h2>{nameEntry[1]}</h2>}
          {descriptionEntry && (
            <p style={{ marginBottom: '1rem', whiteSpace: 'pre-line' }}>{descriptionEntry[1]}</p>
          )}
          <div className="details-grid" style={{ display: 'grid', gap: '0.6rem 1.25rem', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', marginTop: '0.5rem' }}>
            {rest.map(([k,v]) => {
              const formatted = formatValue(v);
              if (!formatted) return null;
              return (
                <div key={k} style={{ fontSize: '.8rem', lineHeight: '1.25' }}>
                  <strong style={{ display: 'block', fontSize: '.7rem', letterSpacing: '.5px', textTransform: 'uppercase', opacity: .7 }}>{formatLabel(k)}</strong>
                  <span>{formatted}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

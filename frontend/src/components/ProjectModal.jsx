import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './TopBar.css'; // reuse potential variables / fonts

export default function ProjectModal({ project, onClose }) {
  const contentRef = useRef(null);

  if (!project) return null;

  const handleExport = async () => {
    if (!contentRef.current) return;
    // Use html2canvas to capture content
    const element = contentRef.current;
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Calculate dimensions to fit width while keeping aspect ratio
    const imgWidth = pageWidth - 60; // margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let y = 40;
    pdf.setFontSize(18);
    pdf.text(project.title, 30, y);
    y += 20;
    pdf.setFontSize(10);
    pdf.text(`Tags: ${project.tags.join(', ')}`, 30, y);
    y += 15;

    if (imgHeight < pageHeight - y - 40) {
      pdf.addImage(imgData, 'PNG', 30, y, imgWidth, imgHeight);
    } else {
      // Split across pages
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
        ctx.drawImage(
          canvas,
          0,
          sourceY,
          canvas.width,
          currentSliceHeight,
          0,
          0,
          canvas.width,
          currentSliceHeight
        );
        const sliceData = tempCanvas.toDataURL('image/png');
        const sliceDisplayHeight = (currentSliceHeight * imgWidth) / canvas.width;
        if (pageIndex > 0) {
          pdf.addPage();
          position = 40;
        }
        pdf.addImage(sliceData, 'PNG', 30, position, imgWidth, sliceDisplayHeight);
        remainingHeight -= sliceDisplayHeight;
        sourceY += currentSliceHeight;
        pageIndex++;
      }
    }

    pdf.save(`${project.title.replace(/[^a-z0-9]/gi,'_')}.pdf`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close">×</button>
        <button className="export-btn" onClick={handleExport}>Export</button>
  <div ref={contentRef} className="modal-content" style={{ color: '#000' }}>
          <img src={project.image} alt={project.title} className="modal-image" />
          <h2>{project.title}</h2>
          <div className="modal-tags">
            {project.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
          {project.description.split('\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

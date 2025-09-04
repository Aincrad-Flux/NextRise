import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './TopBar.css';

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
    pdf.text(project.name, 30, y);
    y += 22;
    pdf.setFontSize(10);
    const metaLines = [
      `Legal status: ${project.legal_status}`,
      `Sector: ${project.sector}`,
      `Maturity: ${project.maturity}`,
      `Email: ${project.email}`,
      `Phone: ${project.phone}`,
      `Address: ${project.address}`
    ];
    metaLines.forEach(line => { pdf.text(line, 30, y); y += 12; });
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
    pdf.save(`${project.name.replace(/[^a-z0-9]/gi,'_')}.pdf`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close">×</button>
        <button className="export-btn" onClick={handleExport}>Export</button>
        <div ref={contentRef} className="modal-content" style={{ color: '#000' }}>
          <h2>{project.name}</h2>
          <div className="modal-tags">
            <span className="tag">{project.sector}</span>
            <span className="tag">{project.maturity}</span>
            <span className="tag">{project.legal_status}</span>
          </div>
          <p><strong>Email:</strong> {project.email}</p>
            <p><strong>Téléphone:</strong> {project.phone}</p>
            <p><strong>Adresse:</strong> {project.address}</p>
        </div>
      </div>
    </div>
  );
}

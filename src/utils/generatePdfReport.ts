import { jsPDF } from 'jspdf';
import { AssessmentResult } from '../types';
import { QUESTIONS_DATA } from '../data/assessmentData';

export function generateConfidentialPdfReport(
  assessment: AssessmentResult,
  answers: Record<string, number | null> = {}
): void {
  // Create PDF document in A4 format (210 x 297 mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // 1. Top Decorative Header Banner (Twilight Plum & Rose)
  doc.setFillColor(24, 11, 41); // Deep plum #180b29
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Rose accent line
  doc.setFillColor(244, 114, 182); // #f472b6
  doc.rect(0, 36, pageWidth, 2, 'F');

  // Brand and Security Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(249, 168, 212);
  doc.text('VITALITY SHIELD • PROTOCOLO 0-TRACE', margin, 12);

  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text('INFORME CONFIDENCIAL DE EVALUACIÓN LABORAL', margin, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(233, 213, 255);
  doc.text('Marco Legal: Ley 1010 de 2006 (República de Colombia) • Espacio Seguro y Privado', margin, 28);

  // Security Badge in top right
  doc.setFillColor(134, 25, 143); // Fuchsia #86198f
  doc.roundedRect(pageWidth - margin - 35, 10, 35, 7, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 249, 253);
  doc.text('100% CONFIDENCIAL', pageWidth - margin - 32, 14.5);

  let currentY = 46;

  // 2. Metadata Box (Anonymous UUID & Timestamp)
  doc.setFillColor(250, 245, 255); // Soft lavender pearl #faf5ff
  doc.setDrawColor(192, 132, 252);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 20, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(88, 28, 135);
  doc.text('IDENTIFICADOR ANÓNIMO:', margin + 4, currentY + 7);
  doc.setFont('courier', 'bold');
  doc.setTextColor(157, 23, 77);
  doc.text(assessment.anonymousId || 'uuid-v4-anonimo-89f2', margin + 46, currentY + 7);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(88, 28, 135);
  doc.text('FECHA Y HORA DE EMISIÓN:', margin + 4, currentY + 14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(35, 17, 54);
  const formattedDate = new Date().toLocaleString('es-CO', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
  doc.text(formattedDate, margin + 48, currentY + 14);

  // Security tag
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(134, 25, 143);
  doc.text('ESTADO: En RAM • 0-Trace', pageWidth - margin - 46, currentY + 10);

  currentY += 26;

  // 3. Risk Level & Score Box
  const isHigh = assessment.riskLevel === 'alto' || assessment.score >= 65;
  const isMed = assessment.riskLevel === 'medio' || (assessment.score >= 35 && assessment.score < 65);

  if (isHigh) {
    doc.setFillColor(255, 241, 242); // Rose 50
    doc.setDrawColor(225, 29, 72);
  } else if (isMed) {
    doc.setFillColor(255, 251, 235); // Amber 50
    doc.setDrawColor(217, 119, 6);
  } else {
    doc.setFillColor(236, 253, 245); // Emerald 50
    doc.setDrawColor(5, 150, 105);
  }

  doc.roundedRect(margin, currentY, contentWidth, 30, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(35, 17, 54);
  doc.text('RESULTADO DEL ANÁLISIS DE RIESGO', margin + 4, currentY + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  if (isHigh) {
    doc.setTextColor(190, 18, 60);
  } else if (isMed) {
    doc.setTextColor(180, 83, 9);
  } else {
    doc.setTextColor(4, 120, 87);
  }
  doc.text(`${assessment.score} / 100`, margin + 4, currentY + 20);

  doc.setFontSize(11);
  const riskTitle = isHigh ? 'NIVEL DE RIESGO: ALTO' : isMed ? 'NIVEL DE RIESGO: MEDIO' : 'NIVEL DE RIESGO: BAJO';
  doc.text(riskTitle, margin + 48, currentY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(59, 35, 84);
  const factorsLine = doc.splitTextToSize(
    `Factores tipificados: ${assessment.factors.join(', ')}`,
    contentWidth - 52
  );
  doc.text(factorsLine.slice(0, 2), margin + 48, currentY + 20);

  currentY += 36;

  // 4. Breakdown of Evaluated Criteria (Ley 1010)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(88, 28, 135);
  doc.text('DETALLE DE CRITERIOS EVALUADOS (LEY 1010 DE 2006)', margin, currentY);

  currentY += 4;

  const optionLabels = [
    'Nunca (No ha ocurrido - 0 pts)',
    'Ocasionalmente (1 o 2 veces aisladas - 1 pt)',
    'Frecuentemente (Varias veces al mes - 2 pts)',
    'Constantemente (De forma sistemática - 3 pts)',
  ];

  QUESTIONS_DATA.forEach((q, index) => {
    const rawPts = answers[q.id];
    const hasAnswer = rawPts !== null && rawPts !== undefined;
    const pts = hasAnswer ? rawPts : 0;
    const selectedText = hasAnswer ? (optionLabels[pts] || `${pts} pts`) : 'Sin responder';

    doc.setFillColor(252, 248, 254);
    doc.setDrawColor(233, 213, 255);
    doc.setLineWidth(0.2);
    doc.roundedRect(margin, currentY, contentWidth, 12, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.setTextColor(35, 17, 54);
    doc.text(`${index + 1}. ${q.title} (${q.legalRef})`, margin + 3, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(75, 50, 102);
    doc.text(`Respuesta: ${selectedText}`, margin + 3, currentY + 9.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    if (pts >= 2) {
      doc.setTextColor(190, 18, 60);
      doc.text('INDICIO CRÍTICO', pageWidth - margin - 26, currentY + 7);
    } else if (pts === 1) {
      doc.setTextColor(180, 83, 9);
      doc.text('INDICIO INICIAL', pageWidth - margin - 26, currentY + 7);
    } else {
      doc.setTextColor(4, 120, 87);
      doc.text('SIN INDICIO', pageWidth - margin - 24, currentY + 7);
    }

    currentY += 13.5;
  });

  currentY += 2;

  // 5. Key Recommendations Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(88, 28, 135);
  doc.text('RUTA RECOMENDADA EN 3 PASOS', margin, currentY);

  currentY += 4;

  const recommendations = [
    {
      num: '1',
      title: 'Bitácora segura',
      desc: 'Registra fechas, horas y testigos en un medio personal externo al computador o correo de la empresa.',
    },
    {
      num: '2',
      title: 'Comité de Convivencia Laboral',
      desc: 'Presenta solicitud formal escrita invocando el procedimiento preventivo de la Ley 1010 de 2006.',
    },
    {
      num: '3',
      title: 'Respaldo institucional',
      desc: 'Si no hay respuesta efectiva, acude al Ministerio del Trabajo, Personería o Defensoría del Pueblo.',
    },
  ];

  recommendations.forEach((rec) => {
    doc.setFillColor(247, 238, 252);
    doc.setDrawColor(216, 180, 254);
    doc.roundedRect(margin, currentY, contentWidth, 11, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.setTextColor(88, 28, 135);
    doc.text(`[Paso ${rec.num}] ${rec.title}:`, margin + 3, currentY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(59, 35, 84);
    doc.text(rec.desc, margin + 3, currentY + 8.5);

    currentY += 12.5;
  });

  currentY += 2;

  // 6. National Emergency Hotlines (Colombia)
  doc.setFillColor(24, 11, 41); // #180b29
  doc.setDrawColor(244, 114, 182);
  doc.roundedRect(margin, currentY, contentWidth, 16, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(249, 168, 212);
  doc.text('LÍNEAS GRATUITAS DE ATENCIÓN INMEDIATA (COLOMBIA):', margin + 3, currentY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('• Línea 155:', margin + 3, currentY + 11.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(233, 213, 255);
  doc.text('Orientación a Mujeres (24/7)', margin + 20, currentY + 11.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('• Línea 122:', margin + 70, currentY + 11.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(233, 213, 255);
  doc.text('Fiscalía General', margin + 88, currentY + 11.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('• Línea 106:', margin + 122, currentY + 11.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(233, 213, 255);
  doc.text('Apoyo Emocional', margin + 140, currentY + 11.5);

  // 7. Security & Zero-Trace Disclaimer at bottom
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.8);
  doc.setTextColor(107, 79, 133);
  const disclaimer =
    'AVISO DE CERO RASTREO: Documento emitido localmente en memoria volátil (RAM) sin persistencia en historial web del navegador.';
  doc.text(disclaimer, margin, pageHeight - 8);

  // Output as Blob and trigger safe download without browser history entry
  const pdfBlob = doc.output('blob');
  const blobUrl = URL.createObjectURL(pdfBlob);

  const anchor = document.createElement('a');
  anchor.style.display = 'none';
  anchor.href = blobUrl;
  anchor.download = `VitalityShield_Informe_0Trace_${assessment.anonymousId || 'confidencial'}.pdf`;

  document.body.appendChild(anchor);
  anchor.click();

  document.body.removeChild(anchor);
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 100);
}

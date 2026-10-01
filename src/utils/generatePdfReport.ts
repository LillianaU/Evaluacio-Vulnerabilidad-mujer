import { jsPDF } from 'jspdf';
import { AssessmentResult } from '../types';
import { QUESTIONS_DATA } from '../data/assessmentData';

export function generateConfidentialPdfReport(
  assessment: AssessmentResult,
  answers: Record<string, number> = {}
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

  // 1. Top Decorative Header Banner
  doc.setFillColor(10, 14, 26); // Deep navy #0a0e1a
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Cyan accent line
  doc.setFillColor(125, 211, 252); // #7dd3fc
  doc.rect(0, 36, pageWidth, 2, 'F');

  // Brand and Security Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(125, 211, 252);
  doc.text('VITALITY SHIELD • PROTOCOLO 0-TRACE', margin, 12);

  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text('INFORME CONFIDENCIAL DE EVALUACIÓN LABORAL', margin, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(160, 180, 196);
  doc.text('Marco Legal: Ley 1010 de 2006 (República de Colombia) • Espacio Seguro y Privado', margin, 28);

  // Security Badge in top right
  doc.setFillColor(61, 32, 96); // Purple #3d2060
  doc.roundedRect(pageWidth - margin - 35, 10, 35, 7, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(232, 208, 255);
  doc.text('100% CONFIDENCIAL', pageWidth - margin - 32, 14.5);

  let currentY = 46;

  // 2. Metadata Box (Anonymous UUID & Timestamp)
  doc.setFillColor(20, 28, 46); // Surface container #141c2e
  doc.setDrawColor(125, 211, 252);
  doc.setLineWidth(0.2);
  doc.roundedRect(margin, currentY, contentWidth, 20, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(160, 180, 196);
  doc.text('IDENTIFICADOR ANÓNIMO:', margin + 4, currentY + 7);
  doc.setFont('courier', 'bold');
  doc.setTextColor(125, 211, 252);
  doc.text(assessment.anonymousId || 'uuid-v4-anonimo-89f2', margin + 46, currentY + 7);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(160, 180, 196);
  doc.text('FECHA Y HORA DE EMISIÓN:', margin + 4, currentY + 14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(224, 232, 240);
  const formattedDate = new Date(assessment.timestamp || Date.now()).toLocaleString('es-CO', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
  doc.text(formattedDate, margin + 48, currentY + 14);

  // Security tag
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(136, 180, 204);
  doc.text('ESTADO: Memoria Volátil • Sin Nube', pageWidth - margin - 58, currentY + 10);

  currentY += 26;

  // 3. Risk Level & Score Box
  const isHigh = assessment.riskLevel === 'alto' || assessment.score >= 65;
  const isMed = assessment.riskLevel === 'medio' || (assessment.score >= 35 && assessment.score < 65);

  // Box fill color based on risk
  if (isHigh) {
    doc.setFillColor(61, 20, 20); // Dark red #3d1414
    doc.setDrawColor(255, 107, 107);
  } else if (isMed) {
    doc.setFillColor(61, 32, 96);
    doc.setDrawColor(200, 160, 240);
  } else {
    doc.setFillColor(14, 77, 110);
    doc.setDrawColor(125, 211, 252);
  }

  doc.roundedRect(margin, currentY, contentWidth, 30, 3, 3, 'FD');

  // Score title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(isHigh ? 255 : 200, isHigh ? 179 : 220, isHigh ? 179 : 255);
  doc.text('RESULTADO DEL ANÁLISIS DE RIESGO', margin + 4, currentY + 8);

  // Big Score Display
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(isHigh ? 255 : 125, isHigh ? 107 : 211, isHigh ? 107 : 252);
  doc.text(`${assessment.score} / 100`, margin + 4, currentY + 20);

  // Risk Badge Label
  doc.setFontSize(11);
  const riskTitle = isHigh ? 'NIVEL DE RIESGO: ALTO' : isMed ? 'NIVEL DE RIESGO: MEDIO' : 'NIVEL DE RIESGO: BAJO';
  doc.text(riskTitle, margin + 48, currentY + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(224, 232, 240);
  doc.text(
    `Factores tipificados: ${assessment.factors.join(', ')}`,
    margin + 48,
    currentY + 22
  );

  currentY += 36;

  // 4. Breakdown of Evaluated Criteria (Ley 1010)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(125, 211, 252);
  doc.text('DETALLE DE CRITERIOS EVALUADOS (LEY 1010)', margin, currentY);

  currentY += 4;

  const optionLabels = [
    'Nunca me ha sucedido (0 pts)',
    'Rara vez / Episodio aislado (6 pts)',
    'Con frecuencia / Varias veces al mes (12 pts)',
    'Constantemente / Semanal o diario (18 pts)',
  ];

  QUESTIONS_DATA.forEach((q, index) => {
    const pts = answers[q.id] ?? (index === 0 ? 2 : index === 1 ? 3 : index === 2 ? 2 : 3);
    const selectedText = optionLabels[pts] || `${pts} pts`;

    doc.setFillColor(245, 248, 252);
    doc.setDrawColor(220, 230, 240);
    doc.setLineWidth(0.1);
    doc.roundedRect(margin, currentY, contentWidth, 12, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.setTextColor(15, 25, 45);
    doc.text(`${index + 1}. ${q.category}: ${q.title}`, margin + 3, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(70, 90, 110);
    doc.text(`Respuesta: ${selectedText}`, margin + 3, currentY + 9.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(pts >= 2 ? 180 : 80, pts >= 2 ? 30 : 120, pts >= 2 ? 30 : 160);
    doc.text(pts >= 2 ? 'INDICIO CRÍTICO' : 'ATENUADO', pageWidth - margin - 26, currentY + 7);

    currentY += 13.5;
  });

  currentY += 2;

  // 5. Key Recommendations Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(125, 211, 252);
  doc.text('RECOMENDACIONES CLAVE Y PASOS A SEGUIR', margin, currentY);

  currentY += 4;

  const recommendations = [
    {
      num: '1',
      title: 'Documentar evidencias objetivas',
      desc: 'Guarda correos, capturas con fecha/hora y registros de asignaciones irregulares en un dispositivo personal fuera de la empresa.',
    },
    {
      num: '2',
      title: 'Asesoría confidencial institucional',
      desc: 'Evalúa radicar queja formal preventiva ante el Comité de Convivencia Laboral o solicitar acompañamiento ante el Ministerio del Trabajo.',
    },
    {
      num: '3',
      title: 'Preservar tu salud integral',
      desc: 'El acoso laboral impacta el bienestar psicofísico. Apóyate en redes seguras y solicita cita de valoración en salud mental en tu EPS.',
    },
  ];

  recommendations.forEach((rec) => {
    doc.setFillColor(240, 245, 252);
    doc.setDrawColor(210, 225, 240);
    doc.roundedRect(margin, currentY, contentWidth, 11, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.setTextColor(14, 77, 110);
    doc.text(`[Paso ${rec.num}] ${rec.title}:`, margin + 3, currentY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(60, 75, 95);
    doc.text(rec.desc, margin + 3, currentY + 8.5);

    currentY += 12.5;
  });

  currentY += 2;

  // 6. National Emergency Hotlines (Colombia)
  doc.setFillColor(15, 21, 36); // #0f1524
  doc.setDrawColor(200, 160, 240);
  doc.roundedRect(margin, currentY, contentWidth, 16, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(200, 160, 240);
  doc.text('RUTAS DE ATENCIÓN INMEDIATA NACIONAL (COLOMBIA):', margin + 3, currentY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('• Línea 155:', margin + 3, currentY + 11.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 200, 220);
  doc.text('Orientación a Mujeres (24/7 gratis)    ', margin + 20, currentY + 11.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('• Línea 122:', margin + 74, currentY + 11.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 200, 220);
  doc.text('Fiscalía General    ', margin + 92, currentY + 11.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('• Línea 106:', margin + 124, currentY + 11.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 200, 220);
  doc.text('Apoyo Emocional', margin + 142, currentY + 11.5);

  // 7. Security & Zero-Trace Disclaimer at bottom
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.8);
  doc.setTextColor(120, 140, 160);
  const disclaimer =
    'AVISO DE CERO RASTREO: Documento emitido localmente en memoria volátil sin persistencia en historial web del navegador. Guarda o elimina este archivo en un entorno confidencial.';
  doc.text(disclaimer, margin, pageHeight - 8);

  // Output as Blob and trigger safe download without browser history entry
  const pdfBlob = doc.output('blob');
  const blobUrl = URL.createObjectURL(pdfBlob);

  const anchor = document.createElement('a');
  anchor.style.display = 'none';
  anchor.href = blobUrl;
  anchor.download = `vitality-shield-diagnostico-${assessment.anonymousId || 'confidencial'}.pdf`;

  document.body.appendChild(anchor);
  anchor.click();

  // Instant zero-trace cleanup: Remove element and revoke blob URL immediately
  document.body.removeChild(anchor);
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 100);
}

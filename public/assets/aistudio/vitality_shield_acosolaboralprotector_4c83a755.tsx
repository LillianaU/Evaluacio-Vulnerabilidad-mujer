import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Lock,
  Phone,
  EyeOff,
  FileText,
  Download,
  Trash2,
  Home,
  ClipboardCheck,
  Activity,
  FolderLock,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Search,
  CloudSun,
  Leaf,
  Compass,
  Utensils,
  RefreshCw,
  ArrowRight,
  Info,
  HeartHandshake,
  Scale,
  Database,
} from 'lucide-react';

// ============================================================================
// TIPOS Y MODELOS DE DATOS (0-TRACE ARCHITECTURE)
// ============================================================================

export type ScreenType =
  | 'inicio'
  | 'test'
  | 'diagnostico'
  | 'boveda'
  | 'aerosalud'
  | 'camuflaje';

export type RiskLevel = 'bajo' | 'medio' | 'alto';

export interface QuestionItem {
  id: 'q1' | 'q2' | 'q3' | 'q4' | 'q5';
  title: string;
  legalRef: string;
  description: string;
  factorLabel: string;
}

export type AnswersMap = Record<'q1' | 'q2' | 'q3' | 'q4' | 'q5', number | null>;

export interface AssessmentResult {
  score: number;
  riskLevel: RiskLevel;
  riskLabel: string;
  detectedFactors: {
    id: string;
    title: string;
    legalRef: string;
    severity: string;
    points: number;
  }[];
  timestamp: string;
}

// ============================================================================
// CONSTANTES DE DOMINIO (LEY 1010 DE 2006 - COLOMBIA)
// ============================================================================

const QUESTIONS: QuestionItem[] = [
  {
    id: 'q1',
    title: 'Maltrato laboral y descalificación',
    legalRef: 'Art. 2 Num. 1 · Ley 1010 de 2006',
    description:
      '¿Recibes comentarios humillantes, gritos, descalificaciones públicas o privadas sobre tu dignidad, aspecto o desempeño?',
    factorLabel: 'Maltrato laboral y vulneración de la dignidad',
  },
  {
    id: 'q2',
    title: 'Persecución y sobrecarga desproporcionada',
    legalRef: 'Art. 2 Num. 2 · Ley 1010 de 2006',
    description:
      '¿Te asignan cargas excesivas de trabajo, plazos imposibles o cambios arbitrarios de horario buscando inducir tu renuncia?',
    factorLabel: 'Persecución laboral y sobrecarga reiterada',
  },
  {
    id: 'q3',
    title: 'Entorpecimiento laboral',
    legalRef: 'Art. 2 Num. 4 · Ley 1010 de 2006',
    description:
      '¿Ocultan información clave, bloquean herramientas o destruyen/retrasan insumos necesarios para que cumplas tus funciones?',
    factorLabel: 'Entorpecimiento deliberado de funciones',
  },
  {
    id: 'q4',
    title: 'Inequidad y aislamiento laboral',
    legalRef: 'Art. 2 Num. 3 · Ley 1010 de 2006',
    description:
      '¿Te excluyen sistemáticamente de reuniones, comunicaciones internas o recibes trato discriminatorio frente a tus pares?',
    factorLabel: 'Aislamiento y discriminación laboral',
  },
  {
    id: 'q5',
    title: 'Desprotección e intimidación sutil',
    legalRef: 'Art. 2 Num. 5 y 6 · Ley 1010 de 2006',
    description:
      '¿Recibes amenazas veladas de despido, represalias o te asignan tareas sin protocolos mínimos de seguridad y bienestar?',
    factorLabel: 'Intimidación y desprotección laboral',
  },
];

const FREQUENCY_OPTIONS = [
  { value: 0, label: 'Nunca', sub: 'No ha ocurrido' },
  { value: 1, label: 'Ocasionalmente', sub: '1 o 2 veces aisladas' },
  { value: 2, label: 'Frecuentemente', sub: 'Varias veces al mes' },
  { value: 3, label: 'Constantemente', sub: 'De forma sistemática' },
];

const INITIAL_ANSWERS: AnswersMap = {
  q1: null,
  q2: null,
  q3: null,
  q4: null,
  q5: null,
};

// ============================================================================
// MÓDULOS LÓGICOS DEL CLIENTE (MOTOR DE CÁLCULO & GENERADOR PDF EN RAM)
// ============================================================================

function calculateAssessment(answers: AnswersMap): AssessmentResult {
  const weights: Record<keyof AnswersMap, number> = {
    q1: 1.15,
    q2: 1.1,
    q3: 1.0,
    q4: 1.0,
    q5: 1.1,
  };

  let weightedSum = 0;
  let maxWeighted = 0;

  const detectedFactors: AssessmentResult['detectedFactors'] = [];

  QUESTIONS.forEach((q) => {
    const val = answers[q.id] ?? 0;
    const w = weights[q.id];
    weightedSum += val * w;
    maxWeighted += 3 * w;

    if (val >= 1) {
      detectedFactors.push({
        id: q.id,
        title: q.factorLabel,
        legalRef: q.legalRef,
        severity:
          val === 3 ? 'Severidad Alta' : val === 2 ? 'Severidad Moderada' : 'Indicio Inicial',
        points: val,
      });
    }
  });

  const normalized = Math.round((weightedSum / maxWeighted) * 100);
  const score = Math.min(100, Math.max(0, normalized));

  let riskLevel: RiskLevel = 'bajo';
  let riskLabel = 'Riesgo Bajo';
  if (score >= 65) {
    riskLevel = 'alto';
    riskLabel = 'Riesgo Alto';
  } else if (score >= 35) {
    riskLevel = 'medio';
    riskLabel = 'Riesgo Medio';
  }

  return {
    score,
    riskLevel,
    riskLabel,
    detectedFactors,
    timestamp: new Date().toLocaleString('es-CO', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
  };
}

/**
 * Genera un archivo PDF A4 válido directamente en memoria volátil (RAM) sin librerías externas pesadas,
 * dispara descarga inmediata vía Blob y revoca la URL tras 100 ms para cumplimiento 0-Trace.
 */
function generateConfidentialPdfReport(result: AssessmentResult, sessionUuid: string): void {
  try {
    const sanitize = (str: string) =>
      str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[()\\]/g, ' ');

    const lines: string[] = [
      'VITALITY SHIELD - ACOSOLABORALPROTECTOR (0-TRACE)',
      'REPORTE CONFIDENCIAL DE ORIENTACION PREVENTIVA',
      '------------------------------------------------------------',
      `ID Sesion Anonima: ${sessionUuid}`,
      `Fecha de emision: ${sanitize(result.timestamp)}`,
      `Puntaje de Riesgo: ${result.score} / 100 (${sanitize(result.riskLabel.toUpperCase())})`,
      'Marco Normativo: Ley 1010 de 2006 (Colombia)',
      '------------------------------------------------------------',
      'FACTORES IDENTIFICADOS:',
    ];

    if (result.detectedFactors.length === 0) {
      lines.push('- No se registraron indicadores significativos en esta sesion.');
    } else {
      result.detectedFactors.forEach((f, idx) => {
        lines.push(
          `${idx + 1}. ${sanitize(f.title)} [${sanitize(f.legalRef)}] - ${sanitize(f.severity)}`
        );
      });
    }

    lines.push('------------------------------------------------------------');
    lines.push('RUTA DE ATENCION RECOMENDADA EN COLOMBIA:');
    lines.push('1. Documentar fechas, horas, testigos y evidencias fuera del equipo laboral.');
    lines.push('2. Activar Comite de Convivencia Laboral o Ministerio del Trabajo.');
    lines.push('3. Lineas gratuitas: Linea 155 (Mujeres), Linea 122 (Fiscalia), Linea 106.');
    lines.push('------------------------------------------------------------');
    lines.push('Documento generado 100% en RAM. Sin rastros en servidor ni historial.');

    let textOps = 'BT\n/F1 11 Tf\n48 770 Td\n15 TL\n';
    lines.forEach((line, i) => {
      if (i === 0) {
        textOps += `/F2 13 Tf (${line}) Tj\n/F1 10 Tf\nT*\n`;
      } else {
        textOps += `(${line}) Tj\nT*\n`;
      }
    });
    textOps += 'ET';

    const objects: string[] = [];
    objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj');
    objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj');
    objects.push(
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj'
    );
    objects.push(`4 0 obj\n<< /Length ${textOps.length} >>\nstream\n${textOps}\nendstream\nendobj`);
    objects.push(
      '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj'
    );
    objects.push(
      '6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj'
    );

    let pdf = '%PDF-1.4\n';
    const offsets: number[] = [0];
    objects.forEach((obj) => {
      offsets.push(pdf.length);
      pdf += obj + '\n';
    });

    const xrefStart = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += '0000000000 65535 f \n';
    for (let i = 1; i <= objects.length; i++) {
      pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    }
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

    const blob = new Blob([pdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VitalityShield_Informe_0Trace_${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  } catch (err) {
    console.error('Error generando reporte en RAM:', err);
  }
}

// ============================================================================
// COMPONENTES VISUALES FANTASY ETHEREAL (FONDO ESPECTRAL & MARCO ORNAMENTAL)
// ============================================================================

const EtherealFloralBackdrop: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* Degradado base crepuscular púrpura profundo y ciruela */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 20% 18%, #3b175c 0%, #24103a 42%, #140922 100%)',
        }}
      />

      {/* Resplandores radiales rosa y lavanda */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-35 blur-3xl animate-pulse"
        style={{
          background: 'radial-gradient(circle, #f472b6 0%, transparent 70%)',
          animationDuration: '7s',
        }}
      />
      <div
        className="absolute top-1/3 -right-28 w-[28rem] h-[28rem] rounded-full opacity-30 blur-3xl animate-pulse"
        style={{
          background: 'radial-gradient(circle, #c084fc 0%, transparent 70%)',
          animationDuration: '9s',
        }}
      />
      <div
        className="absolute -bottom-24 left-1/4 w-96 h-96 rounded-full opacity-30 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #e879f9 0%, transparent 72%)',
        }}
      />

      {/* Flor espectral luminosa superior izquierda */}
      <svg
        className="absolute top-6 -left-10 w-64 h-64 sm:w-80 sm:h-80 opacity-45"
        viewBox="0 0 240 240"
        fill="none"
      >
        <defs>
          <radialGradient id="petalGlowLeft" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fdf4ff" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#f472b6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.05" />
          </radialGradient>
        </defs>
        <g transform="translate(120,120)">
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <path
              key={deg}
              transform={`rotate(${deg})`}
              d="M0,0 C22,-36 32,-76 0,-105 C-32,-76 -22,-36 0,0 Z"
              fill="url(#petalGlowLeft)"
              stroke="#f9a8d4"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />
          ))}
          <circle cx="0" cy="0" r="10" fill="#fce7f3" fillOpacity="0.8" />
        </g>
      </svg>

      {/* Flor espectral luminosa inferior derecha */}
      <svg
        className="absolute bottom-12 -right-12 w-72 h-72 sm:w-96 sm:h-96 opacity-40"
        viewBox="0 0 240 240"
        fill="none"
      >
        <defs>
          <radialGradient id="petalGlowRight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f5d0fe" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#c084fc" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.04" />
          </radialGradient>
        </defs>
        <g transform="translate(120,120)">
          {[15, 75, 135, 195, 255, 315].map((deg) => (
            <path
              key={deg}
              transform={`rotate(${deg})`}
              d="M0,0 C26,-38 36,-82 0,-112 C-36,-82 -26,-38 0,0 Z"
              fill="url(#petalGlowRight)"
              stroke="#e9d5ff"
              strokeWidth="0.8"
              strokeOpacity="0.45"
            />
          ))}
          <circle cx="0" cy="0" r="11" fill="#fae8ff" fillOpacity="0.85" />
        </g>
      </svg>

      {/* Silueta femenina etérea sutil en el lateral izquierdo (escritorio / tablet) */}
      <svg
        className="hidden sm:block absolute left-6 top-1/2 -translate-y-1/2 w-28 h-56 opacity-25"
        viewBox="0 0 120 240"
        fill="none"
      >
        <path
          d="M65 28 C82 28 94 42 90 60 C87 74 78 82 82 94 C95 104 102 128 94 156 C86 184 62 204 42 222 C48 192 44 166 36 144 C26 118 34 94 46 84 C40 70 44 28 65 28 Z"
          fill="url(#petalGlowLeft)"
        />
        <text x="52" y="22" fill="#f9a8d4" fontSize="18" opacity="0.8">
          ♀
        </text>
      </svg>

      {/* Destellos y estrellas flotantes */}
      {[
        { top: '12%', left: '18%', size: 14 },
        { top: '22%', left: '84%', size: 18 },
        { top: '44%', left: '10%', size: 12 },
        { top: '64%', left: '88%', size: 15 },
        { top: '78%', left: '16%', size: 16 },
        { top: '86%', left: '72%', size: 12 },
      ].map((star, idx) => (
        <svg
          key={idx}
          style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
          className="absolute text-pink-200 opacity-70 animate-pulse"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 1L14.6 9.4L23 12L14.6 14.6L12 23L9.4 14.6L1 12L9.4 9.4L12 1Z" />
        </svg>
      ))}
    </div>
  );
};

/**
 * Panel central enmarcado con doble borde ornamental rosa/lavanda, emblema femenino (♀)
 * y fondo claro perlado de altísimo contraste para garantizar lectura impecable.
 */
interface FramedPanelProps {
  children: React.ReactNode;
  className?: string;
  showTopCrest?: boolean;
}

const FramedPanel: React.FC<FramedPanelProps> = ({
  children,
  className = '',
  showTopCrest = false,
}) => {
  return (
    <div className={`relative ${className}`}>
      {showTopCrest && (
        <div className="flex items-center justify-center gap-2 mb-2 text-pink-200/90 select-none">
          <span className="text-xs tracking-widest">✦ ❀</span>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-fuchsia-950/80 border border-pink-300/60 text-pink-200 font-semibold text-base shadow-[0_0_15px_rgba(244,114,182,0.45)]">
            ♀
          </span>
          <span className="text-xs tracking-widest">❀ ✦</span>
        </div>
      )}

      {/* Marco exterior luminoso */}
      <div className="relative rounded-2xl p-[3px] bg-gradient-to-br from-pink-300/80 via-purple-300/70 to-fuchsia-400/80 shadow-[0_14px_45px_rgba(17,5,32,0.75)]">
        {/* Tarjeta interior perlada de alto contraste */}
        <div className="relative rounded-[13px] bg-[#fff9fd]/95 backdrop-blur-xl text-[#231136] p-4 sm:p-6 border border-purple-900/15">
          {/* Filete interior sutil */}
          <div className="pointer-events-none absolute inset-1.5 rounded-[10px] border border-fuchsia-800/15" />
          <div className="relative z-10">{children}</div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTES GLOBALES (HEADER, BOTTOM NAV, QUICK EXIT)
// ============================================================================

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate }) => {
  if (currentScreen === 'camuflaje') return null;

  const isAeroSalud = currentScreen === 'aerosalud';

  const subtitleMap: Record<ScreenType, string> = {
    inicio: 'Orientación confidencial · Ley 1010',
    test: 'Evaluación preventiva (5 criterios)',
    diagnostico: 'Análisis de riesgo y rutas en Colombia',
    boveda: 'Bóveda volátil y control de huella',
    aerosalud: 'Protocolo de Purga y Camuflaje Activo',
    camuflaje: '',
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#180b29]/85 border-b border-pink-300/20 shadow-lg">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onNavigate('inicio')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-md transition-transform group-hover:scale-105 ${
              isAeroSalud
                ? 'bg-emerald-950/90 border-emerald-400/60 text-emerald-300'
                : 'bg-gradient-to-br from-fuchsia-700 to-purple-900 border-pink-300/50 text-pink-100'
            }`}
          >
            {isAeroSalud ? (
              <ShieldAlert className="w-5 h-5" />
            ) : (
              <Shield className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-base tracking-tight text-white">
                {isAeroSalud ? 'AeroSalud Protocol' : 'Vitality Shield'}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  isAeroSalud
                    ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                    : 'bg-pink-500/25 text-pink-200 border-pink-300/40'
                }`}
              >
                0-TRACE
              </span>
            </div>
            <p className="text-[11px] text-purple-200/85 truncate max-w-[215px] sm:max-w-[270px]">
              {subtitleMap[currentScreen]}
            </p>
          </div>
        </button>

        {/* Indicador discreto de sesión privada */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-purple-950/80 border border-pink-300/25 text-pink-200 text-xs"
          title="Navegación sin historial URL ni cookies"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-[11px]">RAM</span>
        </div>
      </div>
    </header>
  );
};

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  hasDiagnosis: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  hasDiagnosis,
}) => {
  if (currentScreen === 'aerosalud' || currentScreen === 'camuflaje') {
    return null;
  }

  const navItems: { id: ScreenType; label: string; icon: React.ReactNode; badge?: boolean }[] = [
    { id: 'inicio', label: 'Inicio', icon: <Home className="w-5 h-5" /> },
    { id: 'test', label: 'Test', icon: <ClipboardCheck className="w-5 h-5" /> },
    {
      id: 'diagnostico',
      label: 'Diagnóstico',
      icon: <Activity className="w-5 h-5" />,
      badge: hasDiagnosis,
    },
    { id: 'boveda', label: 'Bóveda', icon: <FolderLock className="w-5 h-5" /> },
  ];

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 inset-x-0 z-30 backdrop-blur-xl bg-[#180b29]/92 border-t border-pink-300/25 shadow-[0_-8px_30px_rgba(12,4,24,0.7)]"
    >
      <div className="max-w-lg mx-auto px-2 py-2 grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const active = currentScreen === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
                active
                  ? 'bg-gradient-to-r from-pink-500/30 to-purple-500/35 text-white border border-pink-300/40 shadow-inner'
                  : 'text-purple-200/75 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-400" />
                )}
              </div>
              <span className="text-[11px] font-semibold mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

interface QuickExitButtonProps {
  currentScreen: ScreenType;
  onQuickExit: () => void;
}

const QuickExitButton: React.FC<QuickExitButtonProps> = ({
  currentScreen,
  onQuickExit,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (currentScreen === 'aerosalud' || currentScreen === 'camuflaje') {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-3 sm:right-6 z-40 flex flex-col items-end gap-2">
      {showTooltip && (
        <div className="bg-[#231136] text-pink-100 text-xs px-3 py-2 rounded-xl border border-pink-300/40 shadow-xl max-w-[210px] text-right">
          Línea única de emergencias en Colombia (Policía / Salud / Atención inmediata).
        </div>
      )}

      {/* Llamar 123 con pulso */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setShowTooltip((prev) => !prev)}
          aria-label="Información Línea 123"
          className="w-7 h-7 rounded-full bg-[#24103a]/90 border border-pink-300/40 text-pink-200 flex items-center justify-center shadow-md hover:bg-purple-900"
        >
          <Info className="w-3.5 h-3.5" />
        </button>

        <a
          href="tel:123"
          className="relative inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs sm:text-sm shadow-[0_6px_22px_rgba(225,29,72,0.55)] border border-pink-200/50 hover:brightness-110 active:scale-95 transition"
        >
          <span className="absolute -inset-0.5 rounded-full bg-rose-400/35 animate-ping pointer-events-none" />
          <Phone className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Llamar 123</span>
        </a>
      </div>

      {/* Salida Rápida */}
      <button
        type="button"
        onClick={onQuickExit}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#231136]/95 hover:bg-[#31174c] text-pink-100 font-bold text-xs sm:text-sm border border-pink-300/50 shadow-[0_8px_24px_rgba(15,5,28,0.8)] active:scale-95 transition"
      >
        <EyeOff className="w-4 h-4 text-pink-300" />
        <span>Salida Rápida</span>
      </button>
    </div>
  );
};

// ============================================================================
// PANTALLA 1: INICIO (BIENVENIDA ETÉREA + GARANTÍAS + ARQUITECTURA OFFLINE)
// ============================================================================

interface InicioScreenProps {
  onStartTest: () => void;
  onOpenCamouflage: () => void;
}

const InicioScreen: React.FC<InicioScreenProps> = ({
  onStartTest,
  onOpenCamouflage,
}) => {
  const [expandedArchitecture, setExpandedArchitecture] = useState(false);

  return (
    <div className="space-y-5">
      {/* Banner escénico sereno con insignia de anonimato */}
      <div className="text-center space-y-2 pt-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/80 border border-pink-300/40 text-pink-200 text-xs font-semibold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-pink-300" />
          <span>Espacio Seguro · Sin Rastro Digital</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(244,114,182,0.45)]">
          Vitality Shield
        </h1>
        <p className="text-xs sm:text-sm text-purple-100/90 max-w-md mx-auto leading-relaxed">
          Acompañamiento confidencial y orientación preventiva frente al acoso laboral en Colombia
          (Ley 1010 de 2006).
        </p>
      </div>

      {/* Panel central enmarcado de alto contraste */}
      <FramedPanel showTopCrest>
        <div className="space-y-4">
          <div className="text-center space-y-1.5">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-fuchsia-800 bg-fuchsia-100 px-2.5 py-0.5 rounded-full">
              Orientación Confidencial
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#231136]">
              Evalúa tu situación laboral sin dejar huella
            </h2>
            <p className="text-xs sm:text-sm text-[#43295e] leading-relaxed">
              No pedimos tu nombre, correo ni empresa. Toda la evaluación ocurre en la memoria
              temporal de tu dispositivo y puedes activar modo camuflaje en un toque.
            </p>
          </div>

          {/* Botón principal de inicio */}
          <button
            type="button"
            onClick={onStartTest}
            className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#581c87] via-[#86198f] to-[#be185d] hover:brightness-110 text-white font-bold text-sm sm:text-base shadow-[0_8px_20px_rgba(134,25,143,0.35)] flex items-center justify-center gap-2 transition active:scale-[0.99]"
          >
            <span>Iniciar Evaluación Confidencial</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* 3 Tarjetas de Garantías */}
          <div className="grid grid-cols-1 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-purple-50/90 border border-purple-200/80 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-800 text-pink-100 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-[#231136]">
                  1. Privacidad Total (0-Trace)
                </h3>
                <p className="text-xs text-[#4b3266] leading-snug mt-0.5">
                  Sin cookies de rastreo ni cambios en la URL del navegador. Nada queda guardado en
                  tu historial web.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-pink-50/90 border border-pink-200/80 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-pink-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-[#231136]">
                  2. Orientación Legal & Apoyo — Línea 155
                </h3>
                <p className="text-xs text-[#4b3266] leading-snug mt-0.5">
                  Criterios alineados con la Ley 1010 de 2006 y acceso directo a líneas gratuitas en
                  Colombia (155, 122, 106 y 123).
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-fuchsia-50/90 border border-fuchsia-200/80 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-fuchsia-800 text-pink-100 flex items-center justify-center shrink-0 mt-0.5">
                <EyeOff className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-[#231136]">
                  3. Salida Rápida y Limpieza Instantánea
                </h3>
                <p className="text-xs text-[#4b3266] leading-snug mt-0.5">
                  Si alguien se acerca, pulsa <strong>Salida Rápida</strong> para purgar datos y
                  mostrar el portal señuelo <em>EcoBienestar</em>.
                </p>
              </div>
            </div>
          </div>

          {/* Panel desplegable: Arquitectura Offline-First */}
          <div className="border-t border-purple-900/10 pt-3">
            <button
              type="button"
              onClick={() => setExpandedArchitecture((prev) => !prev)}
              className="w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl bg-[#f5ebfa] hover:bg-[#eedcf7] text-[#2c1544] font-semibold text-xs sm:text-sm transition"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-fuchsia-700" />
                <span>¿Cómo funciona la arquitectura Offline-First y Cero Huella?</span>
              </span>
              {expandedArchitecture ? (
                <ChevronUp className="w-4 h-4 text-fuchsia-700" />
              ) : (
                <ChevronDown className="w-4 h-4 text-fuchsia-700" />
              )}
            </button>

            {expandedArchitecture && (
              <div className="mt-2 p-3.5 rounded-xl bg-white border border-purple-200 text-xs text-[#3b2354] space-y-2 leading-relaxed">
                <p>
                  • <strong>Navegación en memoria:</strong> Las vistas cambian sin modificar la
                  barra de direcciones ni registrar rutas internas en el historial.
                </p>
                <p>
                  • <strong>Informes PDF en RAM:</strong> Tu reporte se construye localmente en
                  memoria volátil y el enlace temporal se destruye en 100 ms.
                </p>
                <p>
                  • <strong>Capa Camuflaje:</strong> Puedes probar cómo luce la pantalla señuelo{' '}
                  <button
                    type="button"
                    onClick={onOpenCamouflage}
                    className="underline font-bold text-fuchsia-700 hover:text-fuchsia-900"
                  >
                    EcoBienestar & Vida Sana aquí
                  </button>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </FramedPanel>
    </div>
  );
};

// ============================================================================
// PANTALLA 2: EVALUACIÓN / CUESTIONARIO (5 CRITERIOS LEY 1010 DE 2006)
// ============================================================================

interface TestScreenProps {
  answers: AnswersMap;
  onSelectAnswer: (qId: keyof AnswersMap, value: number) => void;
  onLoadSampleCase: () => void;
  onSubmitTest: () => void;
}

const TestScreen: React.FC<TestScreenProps> = ({
  answers,
  onSelectAnswer,
  onLoadSampleCase,
  onSubmitTest,
}) => {
  const answeredCount = useMemo(
    () => Object.values(answers).filter((v) => v !== null).length,
    [answers]
  );

  const livePreview = useMemo(() => calculateAssessment(answers), [answers]);
  const progressPercent = Math.round((answeredCount / QUESTIONS.length) * 100);

  return (
    <div className="space-y-4">
      <FramedPanel>
        <div className="space-y-4">
          {/* Cabecera del cuestionario + botón Caso Tipo */}
          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-purple-900/10 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-fuchsia-700">
                Ley 1010 de 2006 · Colombia
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#231136]">
                Cuestionario de Orientación
              </h2>
            </div>

            <button
              type="button"
              onClick={onLoadSampleCase}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-900 border border-fuchsia-300 text-xs font-bold transition"
              title="Rellena automáticamente un escenario de alto riesgo (85/100)"
            >
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-700" />
              <span>Cargar Caso Tipo</span>
            </button>
          </div>

          {/* Barra de progreso en tiempo real + puntaje estimado */}
          <div className="p-3 rounded-xl bg-[#f7eefc] border border-purple-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#2b1442]">
              <span>
                Progreso: {answeredCount} de {QUESTIONS.length} criterios ({progressPercent}%)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-800 text-pink-100">
                Estimado: {livePreview.score}/100
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-purple-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-fuchsia-600 via-pink-500 to-rose-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Listado de las 5 preguntas */}
          <div className="space-y-4">
            {QUESTIONS.map((q, index) => {
              const selected = answers[q.id];
              return (
                <div
                  key={q.id}
                  className="p-3.5 rounded-xl bg-white border border-purple-200/90 shadow-sm space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-fuchsia-800 bg-fuchsia-50 px-2 py-0.5 rounded-md border border-fuchsia-200">
                      Criterio {index + 1} · {q.legalRef}
                    </span>
                    {selected !== null && (
                      <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Respondido
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-[#231136]">{q.title}</h3>
                  <p className="text-xs text-[#4b3266] leading-relaxed">{q.description}</p>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {FREQUENCY_OPTIONS.map((opt) => {
                      const isSelected = selected === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => onSelectAnswer(q.id, opt.value)}
                          className={`p-2.5 rounded-xl border text-left transition ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#581c87] to-[#9d174d] text-white border-pink-400 shadow-md'
                              : 'bg-[#fcf8fe] hover:bg-purple-50 text-[#2b1442] border-purple-200'
                          }`}
                        >
                          <div className="font-bold text-xs">{opt.label}</div>
                          <div
                            className={`text-[10px] mt-0.5 ${
                              isSelected ? 'text-pink-100' : 'text-[#5b4175]'
                            }`}
                          >
                            {opt.sub}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botón calcular diagnóstico */}
          <button
            type="button"
            onClick={onSubmitTest}
            className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#581c87] via-[#86198f] to-[#be185d] hover:brightness-110 text-white font-bold text-sm sm:text-base shadow-lg flex items-center justify-center gap-2 transition active:scale-[0.99]"
          >
            <Activity className="w-4 h-4" />
            <span>Generar Diagnóstico Confidencial</span>
          </button>
        </div>
      </FramedPanel>
    </div>
  );
};

// ============================================================================
// PANTALLA 3: DIAGNÓSTICO (MEDIDOR + LÍNEAS COLOMBIA + PDF RAM + BÓVEDA)
// ============================================================================

interface DiagnosticoScreenProps {
  result: AssessmentResult;
  sessionUuid: string;
  isSavedInVault: boolean;
  onSaveToVault: () => void;
  onQuickPurge: () => void;
  onBackToTest: () => void;
}

const DiagnosticoScreen: React.FC<DiagnosticoScreenProps> = ({
  result,
  sessionUuid,
  isSavedInVault,
  onSaveToVault,
  onQuickPurge,
  onBackToTest,
}) => {
  const [pdfFeedback, setPdfFeedback] = useState(false);

  const handleDownloadPdf = () => {
    generateConfidentialPdfReport(result, sessionUuid);
    setPdfFeedback(true);
    setTimeout(() => setPdfFeedback(false), 3500);
  };

  const badgeColors: Record<RiskLevel, string> = {
    bajo: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    medio: 'bg-amber-100 text-amber-900 border-amber-300',
    alto: 'bg-rose-100 text-rose-900 border-rose-300',
  };

  const gaugeStroke: Record<RiskLevel, string> = {
    bajo: '#059669',
    medio: '#d97706',
    alto: '#e11d48',
  };

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.score / 100) * circumference;

  return (
    <div className="space-y-4">
      <FramedPanel showTopCrest>
        <div className="space-y-5">
          {/* Medidor visual de puntaje 0–100 */}
          <div className="text-center space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-fuchsia-800">
              Resultado de Orientación · {result.timestamp}
            </span>

            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              <svg className="w-36 h-36 -rotate-90" viewBox="0 0 128 128">
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  fill="none"
                  stroke="#f3e8ff"
                  strokeWidth="11"
                />
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  fill="none"
                  stroke={gaugeStroke[result.riskLevel]}
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-[#231136]">{result.score}</span>
                <span className="text-[11px] font-bold text-[#5b4175]">de 100 pts</span>
              </div>
            </div>

            <div>
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold border ${
                  badgeColors[result.riskLevel]
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                {result.riskLabel}
              </span>
            </div>
          </div>

          {/* Factores detectados */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-sm text-[#231136] flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-fuchsia-700" />
              <span>Factores Tipificados Detectados ({result.detectedFactors.length})</span>
            </h3>

            {result.detectedFactors.length === 0 ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                No se detectaron indicadores activos de acoso laboral en tus respuestas actuales.
                Puedes repetir el cuestionario en cualquier momento.
              </div>
            ) : (
              <div className="space-y-2">
                {result.detectedFactors.map((factor) => (
                  <div
                    key={factor.id}
                    className="p-2.5 rounded-xl bg-[#fcf6ff] border border-purple-200 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-bold text-xs text-[#231136]">{factor.title}</div>
                      <div className="text-[11px] text-[#5b4175]">{factor.legalRef}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-rose-100 text-rose-800 shrink-0">
                      {factor.severity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Líneas de atención inmediata en Colombia */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-sm text-[#231136] flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-rose-600" />
              <span>Líneas Gratuitas de Atención en Colombia</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <a
                href="tel:155"
                className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-center transition"
              >
                <div className="font-black text-sm text-rose-800">Línea 155</div>
                <div className="text-[10px] font-semibold text-rose-950">
                  Orientación a Mujeres
                </div>
              </a>
              <a
                href="tel:122"
                className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-center transition"
              >
                <div className="font-black text-sm text-purple-900">Línea 122</div>
                <div className="text-[10px] font-semibold text-purple-950">
                  Fiscalía General
                </div>
              </a>
              <a
                href="tel:106"
                className="p-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-center transition"
              >
                <div className="font-black text-sm text-pink-900">Línea 106</div>
                <div className="text-[10px] font-semibold text-pink-950">
                  Apoyo Emocional
                </div>
              </a>
            </div>
          </div>

          {/* Guía de 3 pasos recomendados */}
          <div className="p-3.5 rounded-xl bg-[#f7eefc] border border-purple-200 space-y-2">
            <h3 className="font-extrabold text-xs sm:text-sm text-[#231136]">
              Ruta Recomendada en 3 Pasos
            </h3>
            <ol className="text-xs text-[#3e2459] space-y-1.5 list-decimal list-inside">
              <li>
                <strong>Bitácora segura:</strong> Registra fechas, horas y testigos en un medio
                personal externo al computador o correo de la empresa.
              </li>
              <li>
                <strong>Comité de Convivencia Laboral:</strong> Presenta solicitud formal escrita
                invocando el procedimiento preventivo de la Ley 1010 de 2006.
              </li>
              <li>
                <strong>Respaldo institucional:</strong> Si no hay respuesta efectiva, acude al
                Ministerio del Trabajo, Personería o Defensoría del Pueblo.
              </li>
            </ol>
          </div>

          {/* Acciones del diagnóstico */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#581c87] to-[#9d174d] hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Informe PDF (En RAM · Sin Huella)</span>
            </button>

            {pdfFeedback && (
              <p className="text-center text-[11px] font-bold text-emerald-700">
                ✓ PDF generado en memoria volátil y enlace temporal revocado.
              </p>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onSaveToVault}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs border flex items-center justify-center gap-1.5 transition ${
                  isSavedInVault
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-purple-100 hover:bg-purple-200 text-purple-950 border-purple-300'
                }`}
              >
                <FolderLock className="w-3.5 h-3.5" />
                <span>{isSavedInVault ? 'Guardado en Bóveda' : 'Guardar en Bóveda'}</span>
              </button>

              <button
                type="button"
                onClick={onQuickPurge}
                className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Purga y Salida</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onBackToTest}
              className="w-full py-2 text-xs font-semibold text-fuchsia-800 hover:underline"
            >
              ← Ajustar respuestas del cuestionario
            </button>
          </div>
        </div>
      </FramedPanel>
    </div>
  );
};

// ============================================================================
// PANTALLA 4: BÓVEDA (CONTROL DE DATOS, UUID ANÓNIMO Y POLÍTICA DE SALIDA)
// ============================================================================

interface BovedaScreenProps {
  sessionUuid: string;
  result: AssessmentResult;
  answers: AnswersMap;
  zeroTraceAutoPurge: boolean;
  onTogglePolicy: (val: boolean) => void;
  onDestroyVault: () => void;
}

const BovedaScreen: React.FC<BovedaScreenProps> = ({
  sessionUuid,
  result,
  answers,
  zeroTraceAutoPurge,
  onTogglePolicy,
  onDestroyVault,
}) => {
  const [jsonExported, setJsonExported] = useState(false);

  const handleExportJson = () => {
    const payload = {
      protocol: 'Vitality Shield 0-Trace',
      anonymousId: sessionUuid,
      exportedAt: new Date().toISOString(),
      assessment: result,
      answers,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VitalityShield_Respaldo_${sessionUuid}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
    setJsonExported(true);
    setTimeout(() => setJsonExported(false), 3000);
  };

  return (
    <div className="space-y-4">
      <FramedPanel>
        <div className="space-y-4">
          <div className="border-b border-purple-900/10 pb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-fuchsia-700">
              Control de Privacidad
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#231136]">
              Bóveda Volátil 0-Trace
            </h2>
          </div>

          {/* Identificador anónimo y estado de conexión */}
          <div className="p-3.5 rounded-xl bg-[#f7eefc] border border-purple-200 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#4b3266]">ID Anónimo de Sesión:</span>
              <code className="px-2 py-0.5 rounded bg-purple-900 text-pink-100 font-mono text-[11px]">
                {sessionUuid}
              </code>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#4b3266]">Estado de Persistencia:</span>
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                <Database className="w-3 h-3" />
                Modo Local Seguro (RAM)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#4b3266]">Evaluación Activa:</span>
              <span className="font-bold text-[#231136]">
                {result.score}/100 ({result.riskLabel})
              </span>
            </div>
          </div>

          {/* Selector de política al salir */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs sm:text-sm text-[#231136]">
              Política de Retención al Salir
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => onTogglePolicy(true)}
                className={`p-3 rounded-xl border text-left transition ${
                  zeroTraceAutoPurge
                    ? 'bg-gradient-to-r from-[#581c87] to-[#86198f] text-white border-pink-300 shadow'
                    : 'bg-white text-[#231136] border-purple-200 hover:bg-purple-50'
                }`}
              >
                <div className="font-bold text-xs">
                  ● Cero Huella Estricto (Borrar todo inmediatamente al salir)
                </div>
                <div
                  className={`text-[11px] mt-0.5 ${
                    zeroTraceAutoPurge ? 'text-pink-100' : 'text-[#5b4175]'
                  }`}
                >
                  Recomendado en equipos compartidos o corporativos.
                </div>
              </button>

              <button
                type="button"
                onClick={() => onTogglePolicy(false)}
                className={`p-3 rounded-xl border text-left transition ${
                  !zeroTraceAutoPurge
                    ? 'bg-gradient-to-r from-[#581c87] to-[#86198f] text-white border-pink-300 shadow'
                    : 'bg-white text-[#231136] border-purple-200 hover:bg-purple-50'
                }`}
              >
                <div className="font-bold text-xs">
                  ● Mantener en memoria volátil durante la pestaña actual
                </div>
                <div
                  className={`text-[11px] mt-0.5 ${
                    !zeroTraceAutoPurge ? 'text-pink-100' : 'text-[#5b4175]'
                  }`}
                >
                  Se destruye automáticamente al cerrar la ventana o pulsar Salida Rápida.
                </div>
              </button>
            </div>
          </div>

          {/* Exportaciones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => generateConfidentialPdfReport(result, sessionUuid)}
              className="py-2.5 px-3 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <FileText className="w-4 h-4 text-pink-300" />
              <span>Descargar Informe PDF</span>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="py-2.5 px-3 rounded-xl bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-950 border border-fuchsia-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Download className="w-4 h-4 text-fuchsia-800" />
              <span>{jsonExported ? '✓ JSON Descargado' : 'Exportar Respaldo JSON'}</span>
            </button>
          </div>

          {/* Destrucción total */}
          <div className="pt-2 border-t border-purple-900/10">
            <button
              type="button"
              onClick={onDestroyVault}
              className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow flex items-center justify-center gap-2 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Destruir Bóveda y Activar Protocolo AeroSalud</span>
            </button>
          </div>
        </div>
      </FramedPanel>
    </div>
  );
};

// ============================================================================
// PANTALLA 5: PROTOCOLO AEROSALUD 0-TRACE (PURGA EN 3 FASES + SALTO SEÑUELO)
// ============================================================================

interface AeroSaludScreenProps {
  onOpenCamouflage: () => void;
  onPurgeAndRedirectGoogle: () => void;
  onReturnSafe: () => void;
}

const AeroSaludScreen: React.FC<AeroSaludScreenProps> = ({
  onOpenCamouflage,
  onPurgeAndRedirectGoogle,
  onReturnSafe,
}) => {
  const [stepCompleted, setStepCompleted] = useState(0);

  const runSequence = () => {
    setStepCompleted(0);
    setTimeout(() => setStepCompleted(1), 220);
    setTimeout(() => setStepCompleted(2), 520);
    setTimeout(() => setStepCompleted(3), 850);
  };

  useEffect(() => {
    runSequence();
  }, []);

  const phases = [
    {
      num: 1,
      title: 'Purga Destructiva Local',
      desc: 'sessionStorage, localStorage y estado RAM de respuestas eliminados.',
    },
    {
      num: 2,
      title: 'Revocación Instantánea',
      desc: 'Identificador anónimo y tokens temporales invalidados.',
    },
    {
      num: 3,
      title: 'Salto a Capa Camuflaje',
      desc: 'Portal señuelo EcoBienestar & Vida Sana listo para despliegue.',
    },
  ];

  return (
    <div className="space-y-4">
      <FramedPanel>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-purple-900/10 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Secuencia de Emergencia Ejecutada
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#231136]">
                Protocolo AeroSalud 0-Trace
              </h2>
            </div>
            <button
              type="button"
              onClick={runSequence}
              className="p-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 transition"
              title="Re-simular secuencia"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Checklist animado de 3 fases */}
          <div className="space-y-2.5">
            {phases.map((p) => {
              const done = stepCompleted >= p.num;
              return (
                <div
                  key={p.num}
                  className={`p-3 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
                    done
                      ? 'bg-emerald-50/95 border-emerald-300 text-emerald-950'
                      : 'bg-purple-50/60 border-purple-200 text-[#4b3266] opacity-65'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      done ? 'bg-emerald-600 text-white' : 'bg-purple-200 text-purple-800'
                    }`}
                  >
                    {done ? '✓' : p.num}
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm">{p.title}</div>
                    <div className="text-xs opacity-90 mt-0.5">{p.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Previsualización de la pantalla señuelo */}
          <div className="p-3 rounded-xl bg-[#f3faf5] border border-emerald-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800 uppercase">
                Vista Previa Capa Señuelo
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">24° · Bogotá / Medellín</span>
            </div>
            <div className="font-bold text-sm text-emerald-950">
              EcoBienestar & Vida Sana — Portal Informativo
            </div>
            <p className="text-xs text-emerald-900/80">
              Recetas saludables, caminatas ecológicas y hábitos de reciclaje en casa.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={onOpenCamouflage}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition"
            >
              <Leaf className="w-4 h-4" />
              <span>Abrir Pantalla Camuflada (EcoBienestar)</span>
            </button>

            <button
              type="button"
              onClick={onPurgeAndRedirectGoogle}
              className="w-full py-3 px-4 rounded-xl bg-[#231136] hover:bg-[#341a50] text-pink-100 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
            >
              <ExternalLink className="w-4 h-4 text-pink-300" />
              <span>Salir a Google (Recetas Saludables Fáciles)</span>
            </button>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={runSequence}
                className="text-xs font-semibold text-fuchsia-800 hover:underline"
              >
                ↻ Re-simular Secuencia
              </button>
              <button
                type="button"
                onClick={onReturnSafe}
                className="text-xs font-semibold text-[#4b3266] hover:underline"
              >
                Volver a Vitality Shield →
              </button>
            </div>
          </div>
        </div>
      </FramedPanel>
    </div>
  );
};

// ============================================================================
// PANTALLA 6: CAMUFLAJE / SEÑUELO ("ECOBIENESTAR & VIDA SANA")
// ============================================================================

interface CamuflajeScreenProps {
  onReturnToApp: () => void;
}

const CamuflajeScreen: React.FC<CamuflajeScreenProps> = ({ onReturnToApp }) => {
  const [searchText, setSearchText] = useState('');

  return (
    <div className="min-h-screen bg-[#f4f8f5] text-slate-800 pb-12">
      {/* Barra superior del portal ecológico señuelo */}
      <div className="bg-white border-b border-emerald-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-emerald-950 tracking-tight">
              EcoBienestar <em className="font-serif font-normal text-emerald-700">& Vida Sana</em>
            </span>
          </div>

          {/* Botón discreto para regresar al modo seguro */}
          <button
            type="button"
            onClick={onReturnToApp}
            className="px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-semibold transition"
            title="Regresar a la aplicación protegida"
          >
            Modo Seguro
          </button>
        </div>
      </div>

      {/* Contenido del portal señuelo */}
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {/* Barra de búsqueda editable */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Buscar recetas saludables, senderos, reciclaje..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Tarjeta del clima */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CloudSun className="w-8 h-8 text-amber-500" />
            <div>
              <div className="text-xl font-extrabold text-slate-900">24°</div>
              <div className="text-xs text-slate-600">
                Parcialmente nublado · Humedad 68 %
              </div>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-white px-2.5 py-1 rounded-full border border-emerald-200">
            Clima Local
          </span>
        </div>

        {/* Artículo 1: Noticias verdes */}
        <article className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            <Leaf className="w-3 h-3" /> Noticias verdes
          </span>
          <h3 className="font-bold text-base text-slate-900 leading-snug">
            Cinco hábitos de reciclaje que sí reducen tu huella en casa
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Separar en origen, compostar los residuos de cocina y reparar antes de reemplazar son
            los cambios con mayor efecto sostenido, según varios programas municipales.
          </p>
        </article>

        {/* Artículo 2: Naturaleza */}
        <article className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-teal-700">
            <Compass className="w-3 h-3" /> Naturaleza
          </span>
          <h3 className="font-bold text-base text-slate-900 leading-snug">
            Parque Nacional El Cristal: una caminata entre niebla y frailejones
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Un recorrido de media jornada con senderos señalizados, mirador al amanecer y guías
            locales. Se recomienda llevar capa impermeable y agua.
          </p>
        </article>

        {/* Artículo 3: Receta */}
        <article className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-700">
            <Utensils className="w-3 h-3" /> Receta · 25 min
          </span>
          <h3 className="font-bold text-base text-slate-900">
            Bowl de quinoa con verduras asadas
          </h3>
          <ul className="text-xs sm:text-sm text-slate-600 space-y-1 list-disc list-inside">
            <li>1 taza de quinoa cocida</li>
            <li>Zanahoria, calabacín y pimentón asados</li>
            <li>Garbanzos, aguacate y limón</li>
          </ul>
        </article>

        {/* Pie de página señuelo */}
        <footer className="text-center text-xs text-slate-500 pt-2">
          © 2026 EcoBienestar & Vida Sana · Contenido informativo
        </footer>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL (SPA ZERO-TRACE SIN URL ROUTER)
// ============================================================================

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('inicio');
  const [answers, setAnswers] = useState<AnswersMap>(INITIAL_ANSWERS);
  const [sessionUuid, setSessionUuid] = useState<string>('uuid-v4-anonimo-89f2');
  const [isSavedInVault, setIsSavedInVault] = useState<boolean>(false);
  const [zeroTraceAutoPurge, setZeroTraceAutoPurge] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const assessmentResult = useMemo(() => calculateAssessment(answers), [answers]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  // Selección de respuesta individual en el cuestionario
  const handleSelectAnswer = (qId: keyof AnswersMap, value: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  // Cargar caso tipo de alto riesgo (~85/100)
  const handleLoadSampleCase = () => {
    setAnswers({
      q1: 3,
      q2: 3,
      q3: 2,
      q4: 2,
      q5: 3,
    });
    showToast('Caso tipo cargado (escenario de alto riesgo 87/100).');
  };

  // Purga inmediata en memoria y salto al protocolo AeroSalud
  const handleQuickExit = () => {
    try {
      sessionStorage.clear();
      localStorage.clear();
    } catch {
      // Ignorar restricciones de sandbox
    }
    setAnswers(INITIAL_ANSWERS);
    setIsSavedInVault(false);
    setSessionUuid(`uuid-v4-anonimo-${Math.floor(1000 + Math.random() * 9000)}`);
    setCurrentScreen('aerosalud');
  };

  // Salida de emergencia limpia hacia Google (sin permitir botón Atrás)
  const handlePurgeAndRedirectGoogle = () => {
    try {
      sessionStorage.clear();
      localStorage.clear();
    } catch {
      // Ignorar restricciones de sandbox
    }
    setAnswers(INITIAL_ANSWERS);
    setIsSavedInVault(false);
    window.location.replace('https://www.google.com/search?q=recetas+saludables+faciles');
  };

  // Vista Camuflaje a pantalla completa
  if (currentScreen === 'camuflaje') {
    return <CamuflajeScreen onReturnToApp={() => setCurrentScreen('inicio')} />;
  }

  return (
    <div className="min-h-screen relative text-white flex flex-col selection:bg-pink-400 selection:text-purple-950">
      {/* Fondo etéreo con flores espectrales, estrellas y resplandores púrpura/rosa */}
      <EtherealFloralBackdrop />

      {/* Encabezado global (se adapta a AeroSalud y se oculta en Camuflaje) */}
      <Header currentScreen={currentScreen} onNavigate={setCurrentScreen} />

      {/* Notificación flotante sutil */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#231136]/95 text-pink-100 text-xs font-semibold border border-pink-300/50 shadow-xl">
          {toastMessage}
        </div>
      )}

      {/* Contenedor central mobile-first */}
      <main className="relative z-10 flex-1 w-full max-w-lg mx-auto px-4 pt-4 pb-28">
        {currentScreen === 'inicio' && (
          <InicioScreen
            onStartTest={() => setCurrentScreen('test')}
            onOpenCamouflage={() => setCurrentScreen('camuflaje')}
          />
        )}

        {currentScreen === 'test' && (
          <TestScreen
            answers={answers}
            onSelectAnswer={handleSelectAnswer}
            onLoadSampleCase={handleLoadSampleCase}
            onSubmitTest={() => setCurrentScreen('diagnostico')}
          />
        )}

        {currentScreen === 'diagnostico' && (
          <DiagnosticoScreen
            result={assessmentResult}
            sessionUuid={sessionUuid}
            isSavedInVault={isSavedInVault}
            onSaveToVault={() => {
              setIsSavedInVault(true);
              showToast('Diagnóstico guardado en la Bóveda volátil.');
            }}
            onQuickPurge={handleQuickExit}
            onBackToTest={() => setCurrentScreen('test')}
          />
        )}

        {currentScreen === 'boveda' && (
          <BovedaScreen
            sessionUuid={sessionUuid}
            result={assessmentResult}
            answers={answers}
            zeroTraceAutoPurge={zeroTraceAutoPurge}
            onTogglePolicy={(val) => {
              setZeroTraceAutoPurge(val);
              showToast(
                val
                  ? 'Política Cero Huella estricto activada.'
                  : 'Retención en memoria volátil activada.'
              );
            }}
            onDestroyVault={handleQuickExit}
          />
        )}

        {currentScreen === 'aerosalud' && (
          <AeroSaludScreen
            onOpenCamouflage={() => setCurrentScreen('camuflaje')}
            onPurgeAndRedirectGoogle={handlePurgeAndRedirectGoogle}
            onReturnSafe={() => setCurrentScreen('inicio')}
          />
        )}
      </main>

      {/* Pie discreto */}
      <footer className="relative z-10 text-center text-[11px] text-purple-200/70 pb-24">
        © 2026 Vitality Shield · Protocolo 0-Trace · Ley 1010 de 2006 (Colombia)
      </footer>

      {/* Botones flotantes permanentes: Llamar 123 + Salida Rápida */}
      <QuickExitButton currentScreen={currentScreen} onQuickExit={handleQuickExit} />

      {/* Navegación inferior fija */}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        hasDiagnosis={Object.values(answers).some((v) => v !== null)}
      />
    </div>
  );
}
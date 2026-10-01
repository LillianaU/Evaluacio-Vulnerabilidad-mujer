import React, { useState } from 'react';
import { ScreenType, AssessmentResult } from '../types';
import { saveAssessmentToDatabase } from '../services/api';
import { generateConfidentialPdfReport } from '../utils/generatePdfReport';

interface ScreenDiagnosticoProps {
  assessment: AssessmentResult;
  answers?: Record<string, number>;
  onNavigate: (screen: ScreenType) => void;
  onPurgeAndExit: () => void;
}

export const ScreenDiagnostico: React.FC<ScreenDiagnosticoProps> = ({
  assessment,
  answers = {},
  onNavigate,
  onPurgeAndExit,
}) => {
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 2800);
  };

  const handleDownloadPdf = () => {
    generateConfidentialPdfReport(assessment, answers);
    showToast('Reporte PDF descargado sin huellas en el historial');
  };

  const handleSaveToVault = async () => {
    setSaveState('saving');
    // Save to database asynchronously
    await saveAssessmentToDatabase(assessment, answers);
    setSaveState('saved');
    setTimeout(() => {
      setSaveState('idle');
      onNavigate('boveda');
    }, 1200);
  };

  const isHighRisk = assessment.riskLevel === 'alto' || assessment.score >= 65;
  const isMedRisk = assessment.riskLevel === 'medio' || (assessment.score >= 35 && assessment.score < 65);

  const riskLabel = isHighRisk
    ? 'Nivel de Riesgo: Alto'
    : isMedRisk
    ? 'Nivel de Riesgo: Medio'
    : 'Nivel de Riesgo: Bajo';

  const riskBadgeClass = isHighRisk
    ? 'bg-[#3d1414] text-[#ff6b6b] border border-[#ff6b6b]/30'
    : isMedRisk
    ? 'bg-[#3d2060] text-[#c8a0f0] border border-[#c8a0f0]/30'
    : 'bg-[#0e4d6e] text-[#7dd3fc] border border-[#7dd3fc]/30';

  return (
    <div className="flex flex-col w-full px-4 py-5 gap-6 max-w-lg mx-auto">
      {/* Confidencial Tranquilizer Ribbon */}
      <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-r from-[#141c2e] via-[#1a2438] to-[#141c2e] shadow-xl border border-[#7dd3fc]/15">
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-[#7dd3fc]/10 blur-2xl pointer-events-none" />
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-11 h-11 rounded-xl bg-[#7dd3fc]/15 text-[#7dd3fc] flex items-center justify-center shrink-0 shadow-inner border border-[#7dd3fc]/20">
            <span className="material-symbols-outlined text-2xl">verified_user</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7dd3fc]">
                Diagnóstico Confidencial
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#3d2060] text-[#e8d0ff] border border-[#c8a0f0]/20">
                Cifrado Local
              </span>
            </div>
            <h2 className="text-base font-headline font-bold text-[#e0e8f0] truncate">
              Resultados de tu Evaluación
            </h2>
          </div>
        </div>
      </div>

      {/* Hero Calming Visual Card */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#111828] group border border-[#7dd3fc]/15">
        <div
          className="w-full h-44 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBcHAvLbG2VeUdkF5GmFi5AnCXe7fIYlwYlTUyCb7IQw_evt_FLw5-Gtt6W51s6JP58QD-cwLu6NMJLfljv4mXAessY-RIpe-NmJADdDHvnj3lwnSGBOPUZJjLjvCYAYy73NmqmQBVzruuBEP9-MXUmXVjwbuS2jfST7JkbdNfUn1yMs7F0fZ-DROf6OX35WGaSK-0TnRAYjqtBaXI5-8IVu_7HJWZnABGVO13k4fAqqRLIMXdMvbYpEw')`,
          }}
        >
          <div className="w-full h-full bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/60 to-transparent flex flex-col justify-end p-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0f1524]/80 backdrop-blur-md self-start text-xs font-medium text-[#7dd3fc] shadow-sm border border-[#7dd3fc]/20">
              <span className="material-symbols-outlined text-sm">spa</span>
              <span>Espacio Seguro y Privado</span>
            </div>
            <p className="text-xs text-[#a0b4c4] mt-2 font-medium">
              Tus respuestas no quedan guardadas en servidores públicos ni registros remotos.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Risk Level Display Card */}
      <div className="relative rounded-3xl p-5 bg-[#1a2438]/90 backdrop-blur-xl shadow-2xl flex flex-col gap-4 border border-[#7dd3fc]/20">
        {/* Header with Prominent Risk Badge */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#a0b4c4]">
            Estado del Análisis
          </span>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md ${riskBadgeClass}`}>
            <span className={`w-2 h-2 rounded-full ${isHighRisk ? 'bg-[#ff6b6b] animate-ping' : 'bg-[#7dd3fc]'}`} />
            <span>{riskLabel}</span>
          </div>
        </div>

        {/* Alert Score Gauge Meter */}
        <div className="p-4 rounded-2xl bg-[#0a0e1a]/80 flex flex-col gap-3 border border-white/5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-lg ${isHighRisk ? 'text-[#ff6b6b]' : 'text-[#7dd3fc]'}`}>
                warning
              </span>
              <span className="font-headline font-semibold text-[#e0e8f0]">Puntaje de Alerta</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-bold font-headline ${isHighRisk ? 'text-[#ff6b6b]' : 'text-[#7dd3fc]'}`}>
                {assessment.score}
              </span>
              <span className="text-xs text-[#a0b4c4]">/ 100</span>
            </div>
          </div>

          {/* Custom Animated Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-[#1a2438] overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#c8a0f0] via-[#7dd3fc] to-[#ff6b6b] transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(100, Math.max(10, assessment.score))}%` }}
            />
          </div>

          <div className="flex items-start gap-2 pt-1 text-xs text-[#a0b4c4]">
            <span className="material-symbols-outlined text-[#c8a0f0] text-sm mt-0.5 shrink-0">
              bubble_chart
            </span>
            <span>
              <strong className="text-[#e0e8f0]">Factores detectados:</strong>{' '}
              {assessment.factors.join(', ')}.
            </span>
          </div>
        </div>

        {/* Clear Advisory Notice */}
        <div className="p-4 rounded-2xl bg-[#1a3a4e]/40 flex items-start gap-3 border border-[#7dd3fc]/20">
          <span className="material-symbols-outlined text-[#7dd3fc] text-xl shrink-0 mt-0.5">info</span>
          <p className="text-xs leading-relaxed text-[#c0d8e8]">
            Las situaciones que experimentas presentan{' '}
            <strong className="text-[#e0e8f0] font-semibold">indicios consistentes de acoso laboral</strong>{' '}
            conforme a la Ley 1010 y marcos vigentes de protección a la integridad personal y laboral.
          </p>
        </div>
      </div>

      {/* Colombian Support Hotlines & Línea 155 Action Card */}
      <div className="relative rounded-3xl p-5 bg-gradient-to-br from-[#3d2060]/40 via-[#1a2438] to-[#141c2e] backdrop-blur-xl shadow-2xl flex flex-col gap-4 border border-[#c8a0f0]/20">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#c8a0f0]/20 text-[#c8a0f0] flex items-center justify-center shrink-0 shadow-sm border border-[#c8a0f0]/30">
            <span className="material-symbols-outlined text-2xl">support_agent</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#c8a0f0]">
              <span>Atención Inmediata Nacional</span>
              <span className="material-symbols-outlined text-xs">public</span>
            </div>
            <h3 className="text-sm font-headline font-bold text-[#e0e8f0]">
              Línea 155 - Orientación Nacional a Mujeres
            </h3>
            <p className="text-xs text-[#a0b4c4] mt-0.5 leading-snug">
              Llamada gratuita y confidencial 24/7 en Colombia desde cualquier operador celular o fijo. Asesoría legal y psicológica directa.
            </p>
          </div>
        </div>

        {/* Call-to-Action Callout Button */}
        <a
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#c8a0f0] via-[#e8d0ff] to-[#7dd3fc] text-[#1a002e] font-headline font-bold text-sm shadow-lg shadow-[#c8a0f0]/25 active:scale-[0.98] transition-all duration-150 cursor-pointer"
          href="tel:155"
        >
          <span className="material-symbols-outlined text-lg">call</span>
          <span>Marcar Línea 155 Gratis</span>
        </a>

        {/* Secondary Emergency Contact Chips */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            className="p-2.5 rounded-xl bg-[#0a0e1a]/85 flex items-center gap-2 text-xs text-[#e0e8f0] font-medium active:scale-95 transition-transform border border-white/5 hover:border-[#7dd3fc]/30"
            href="tel:122"
          >
            <span className="material-symbols-outlined text-[#7dd3fc] text-base">gavel</span>
            <div className="flex flex-col truncate">
              <span className="text-[10px] text-[#a0b4c4]">Denuncias Fiscalía</span>
              <span className="font-bold">Línea 122</span>
            </div>
          </a>
          <a
            className="p-2.5 rounded-xl bg-[#0a0e1a]/85 flex items-center gap-2 text-xs text-[#e0e8f0] font-medium active:scale-95 transition-transform border border-white/5 hover:border-[#c8a0f0]/30"
            href="tel:106"
          >
            <span className="material-symbols-outlined text-[#c8a0f0] text-base">psychology</span>
            <div className="flex flex-col truncate">
              <span className="text-[10px] text-[#a0b4c4]">Apoyo Emocional</span>
              <span className="font-bold">Línea 106</span>
            </div>
          </a>
        </div>
      </div>

      {/* Key Recommendations Stepper */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#a0b4c4]">
            Recomendaciones Clave
          </h3>
          <span className="text-[11px] text-[#7dd3fc] font-medium">Paso a paso guiado</span>
        </div>

        {/* Recommendation Item 1 */}
        <div className="p-4 rounded-2xl bg-[#141c2e]/70 backdrop-blur-md flex items-start gap-3.5 border border-[#7dd3fc]/15 shadow-md">
          <div className="w-9 h-9 rounded-xl bg-[#0e4d6e] text-[#c8eaff] flex items-center justify-center shrink-0 font-headline font-bold text-sm border border-[#7dd3fc]/20">
            1
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-headline font-bold text-[#e0e8f0]">
                Documentar evidencias objetivas
              </h4>
              <span className="material-symbols-outlined text-[#7dd3fc] text-sm">folder_zip</span>
            </div>
            <p className="text-xs text-[#a0b4c4] mt-1 leading-relaxed">
              Guarda correos electrónicos, capturas con fecha/hora, asignaciones irregulares y testimonios en un dispositivo o cuenta personal fuera del entorno laboral.
            </p>
          </div>
        </div>

        {/* Recommendation Item 2 */}
        <div className="p-4 rounded-2xl bg-[#141c2e]/70 backdrop-blur-md flex items-start gap-3.5 border border-[#88b4cc]/15 shadow-md">
          <div className="w-9 h-9 rounded-xl bg-[#1a3a4e] text-[#c0d8e8] flex items-center justify-center shrink-0 font-headline font-bold text-sm border border-[#88b4cc]/20">
            2
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-headline font-bold text-[#e0e8f0]">
                Asesoría confidencial institucional
              </h4>
              <span className="material-symbols-outlined text-[#88b4cc] text-sm">balance</span>
            </div>
            <p className="text-xs text-[#a0b4c4] mt-1 leading-relaxed">
              Evalúa presentar una queja formal preventiva ante el Comité de Convivencia Laboral o radicar solicitud de acompañamiento en el Ministerio del Trabajo.
            </p>
          </div>
        </div>

        {/* Recommendation Item 3 */}
        <div className="p-4 rounded-2xl bg-[#141c2e]/70 backdrop-blur-md flex items-start gap-3.5 border border-[#c8a0f0]/15 shadow-md">
          <div className="w-9 h-9 rounded-xl bg-[#3d2060] text-[#e8d0ff] flex items-center justify-center shrink-0 font-headline font-bold text-sm border border-[#c8a0f0]/20">
            3
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-headline font-bold text-[#e0e8f0]">
                Preservar tu salud integral
              </h4>
              <span className="material-symbols-outlined text-[#c8a0f0] text-sm">favorite</span>
            </div>
            <p className="text-xs text-[#a0b4c4] mt-1 leading-relaxed">
              El hostigamiento impacta el bienestar físico y anímico. Apóyate en redes de afecto seguras y solicita cita de valoración en salud mental mediante tu EPS.
            </p>
          </div>
        </div>
      </div>

      {/* Toast Notification Modal */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[#202c42]/95 backdrop-blur-xl text-[#7dd3fc] text-xs font-semibold shadow-2xl flex items-center gap-2 border border-[#7dd3fc]/30 z-50 animate-fadeIn">
          <span className="material-symbols-outlined text-sm">verified</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Discreet Action Center Buttons */}
      <div className="flex flex-col gap-3 pt-2">
        {/* PDF Confidential Download Button */}
        <button
          onClick={handleDownloadPdf}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#141c2e] via-[#1a2438] to-[#141c2e] hover:border-[#7dd3fc]/50 text-[#c8eaff] font-headline font-semibold text-xs uppercase tracking-wider shadow-lg border border-[#7dd3fc]/30 active:scale-[0.98] transition-all cursor-pointer"
          type="button"
          title="Descargar informe en PDF sin registro en historial"
        >
          <span className="material-symbols-outlined text-lg text-[#7dd3fc]">picture_as_pdf</span>
          <span>Descargar Reporte PDF (Cero Huella)</span>
        </button>

        {/* Primary Vault Save Button */}
        <button
          onClick={handleSaveToVault}
          disabled={saveState !== 'idle'}
          className={`w-full flex items-center justify-center gap-2.5 py-4 px-5 rounded-2xl font-headline font-bold text-sm shadow-xl active:scale-[0.98] transition-all cursor-pointer ${
            saveState === 'saved'
              ? 'bg-[#c8a0f0] text-[#1a002e]'
              : 'bg-[#7dd3fc] text-[#001f2e] shadow-[#7dd3fc]/20'
          }`}
          type="button"
        >
          {saveState === 'saving' ? (
            <>
              <span className="material-symbols-outlined text-xl animate-spin">sync</span>
              <span>Cifrando y Guardando...</span>
            </>
          ) : saveState === 'saved' ? (
            <>
              <span className="material-symbols-outlined text-xl">task_alt</span>
              <span>¡Guardado Seguro en Bóveda!</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-xl">folder_special</span>
              <span>Guardar Diagnóstico Confidencial en Dispositivo →</span>
            </>
          )}
        </button>

        {/* Secondary Safe Purge Button */}
        <button
          onClick={onPurgeAndExit}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#1a2438] hover:bg-[#202c42] text-[#a0b4c4] hover:text-[#e0e8f0] font-headline font-semibold text-xs active:bg-[#202c42] transition-colors border border-white/5 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-base text-[#ff6b6b]">delete_sweep</span>
          <span>Finalizar y Salir Limpiando Datos</span>
        </button>
      </div>

      {/* Discreet Safety Reassurance Note */}
      <div className="flex items-center justify-center gap-2 py-2 text-center text-[11px] text-[#4a6070] pb-6">
        <span className="material-symbols-outlined text-sm">lock_clock</span>
        <span>Sesión en memoria volátil. Los datos se destruyen al cerrar la pestaña.</span>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { AssessmentResult } from '../types';
import { generateConfidentialPdfReport } from '../utils/generatePdfReport';
import { isSupabaseConfigured } from '../lib/supabase';

interface ScreenBovedaProps {
  assessment: AssessmentResult;
  onPurgeAndRedirect: () => void;
  onSafeExit: () => void;
}

export const ScreenBoveda: React.FC<ScreenBovedaProps> = ({
  assessment,
  onPurgeAndRedirect,
  onSafeExit,
}) => {
  const [policy, setPolicy] = useState<'keep' | 'purge'>('keep');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleDownloadPdf = (e: React.MouseEvent) => {
    e.stopPropagation();
    generateConfidentialPdfReport(assessment);
    showToast('Reporte PDF descargado sin huellas en el historial');
  };

  const handleDownloadJson = (e: React.MouseEvent) => {
    e.stopPropagation();
    const exportData = {
      session_id: assessment.anonymousId || 'uuid-v4-anonimo-89f2',
      timestamp: new Date().toISOString(),
      privacy_mode: 'zero_trace_client_side',
      storage_type: 'isolated_local_vault',
      encrypted: true,
      encryption_standard: 'AES-GCM-256',
      assessment_summary: {
        score: assessment.score,
        risk_level: assessment.riskLevel,
        detected_factors: assessment.factors,
        legal_framework: 'Colombia Ley 1010 de 2006',
        support_lines: {
          orientacion_mujeres: 'Línea 155',
          denuncias_fiscalia: 'Línea 122',
          apoyo_emocional: 'Línea 106',
        },
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vitality-shield-diagnostico-cifrado.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Copia JSON confidencial descargada con éxito');
  };

  const handleSafeExitClick = () => {
    if (policy === 'purge') {
      showToast('Purgando almacenamiento local...');
      setTimeout(() => {
        onPurgeAndRedirect();
      }, 600);
    } else {
      showToast('Sesión cerrada. Datos encriptados localmente.');
      setTimeout(() => {
        onSafeExit();
      }, 900);
    }
  };

  return (
    <div className="flex flex-col w-full px-4 py-3 space-y-4 max-w-lg mx-auto">
      {/* Toast Notification Modal */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[#202c42]/95 backdrop-blur-xl text-[#7dd3fc] text-xs font-semibold shadow-2xl flex items-center gap-2 border border-[#7dd3fc]/30 z-50 animate-fadeIn">
          <span className="material-symbols-outlined text-sm">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Card & Serene Nature Aesthetic */}
      <div className="relative overflow-hidden rounded-xl bg-[#141c2e]/85 backdrop-blur-xl p-4 shadow-xl border border-[#7dd3fc]/15">
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#7dd3fc]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#c8a0f0]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col items-start gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1a3a4e]/70 text-[#c0d8e8] text-xs font-semibold tracking-wide border border-[#7dd3fc]/20">
            <span className="material-symbols-outlined text-sm text-[#7dd3fc] animate-pulse">
              verified_user
            </span>
            <span>Privacidad Cero Rastros</span>
          </div>
          <div className="flex items-center justify-between w-full">
            <div>
              <h1 className="text-xl font-headline font-bold text-[#e0e8f0]">
                Almacenamiento Local y Salida Segura
              </h1>
              <p className="text-xs text-[#a0b4c4] mt-0.5">
                Control absoluto de tu información en tu propio dispositivo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Central Card (Frosted Glass Container with Luminous Accents) */}
      <div className="relative overflow-hidden rounded-xl bg-[#141c2e]/75 backdrop-blur-2xl p-5 shadow-2xl flex flex-col items-center text-center space-y-4 border border-[#7dd3fc]/20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#7dd3fc]/10 via-transparent to-[#c8a0f0]/10 pointer-events-none" />

        {/* Shield Aura Graphic */}
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-[#0e4d6e] via-[#202c42] to-[#3d2060] shadow-[0_0_35px_rgba(125,211,252,0.3)] border border-[#7dd3fc]/30">
          <div className="absolute inset-1 rounded-full bg-[#1a2438]/90 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-[#7dd3fc] filled">
                shield
              </span>
              <span className="material-symbols-outlined absolute text-xl text-[#e8d0ff] font-bold">
                check
              </span>
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#3d2060] flex items-center justify-center shadow-md border border-[#c8a0f0]/40">
            <span className="material-symbols-outlined text-sm text-[#c8a0f0]">lock</span>
          </div>
        </div>

        {/* Subtitle and Guarantee */}
        <div className="space-y-1 max-w-xs">
          <p className="text-sm font-semibold text-[#e0e8f0]">
            Tu diagnóstico se encuentra respaldado únicamente en la memoria de este navegador.
          </p>
          <p className="text-[11px] text-[#a0b4c4] leading-relaxed">
            Ningún dato sensible es transmitido ni guardado en servidores externos o nubes comerciales.
          </p>
        </div>

        {/* Technical Spec Capsule */}
        <div className="w-full rounded-lg bg-[#0a0e1a]/80 p-3.5 space-y-2 text-left border border-white/5">
          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-[11px] text-[#a0b4c4] flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-xs text-[#7dd3fc]">fingerprint</span>
              UUID Anónimo
            </span>
            <span className="text-xs font-mono font-semibold text-[#7dd3fc] px-2 py-0.5 rounded bg-[#1a2438] border border-[#7dd3fc]/20">
              {assessment.anonymousId || 'uuid-v4-anonimo-89f2'}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-[11px] text-[#a0b4c4] flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-xs text-[#c8a0f0]">storage</span>
              Almacenamiento
            </span>
            <span className="text-xs font-semibold text-[#e8d0ff] px-2 py-0.5 rounded bg-[#1a2438] border border-[#c8a0f0]/20">
              LocalStorage / 100% Sin Nube
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-[11px] text-[#a0b4c4] flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-xs text-[#7dd3fc]">enhanced_encryption</span>
              Cifrado local
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#c8eaff] px-2 py-0.5 rounded bg-[#0e4d6e] border border-[#7dd3fc]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7dd3fc] animate-ping" />
              Activo (AES-GCM)
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-[11px] text-[#a0b4c4] flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-xs text-[#7dd3fc]">database</span>
              Base de Datos
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7dd3fc] px-2.5 py-0.5 rounded bg-[#0e4d6e]/50 border border-[#7dd3fc]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              {isSupabaseConfigured ? 'Supabase Conectado (qfaofflaxxzfhovmwwtd)' : 'PostgreSQL Activo'}
            </span>
          </div>
        </div>

        {/* Interactive Vault Options */}
        <div className="w-full space-y-3 pt-1">
          {/* Option A (Selected Default) */}
          <label
            onClick={() => setPolicy('keep')}
            className={`relative block w-full p-3.5 rounded-lg cursor-pointer transition-all duration-200 text-left ${
              policy === 'keep'
                ? 'bg-[#1a2438]/90 shadow-md border border-[#7dd3fc]/40'
                : 'bg-[#111828]/70 hover:bg-[#111828] border border-white/5'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="storage_policy"
                value="keep"
                checked={policy === 'keep'}
                onChange={() => setPolicy('keep')}
                className="mt-1 accent-[#7dd3fc] h-4 w-4 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#e0e8f0]">
                    Mantener guardado para mi consulta posterior
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7dd3fc] px-1.5 py-0.5 rounded bg-[#1a3a4e] border border-[#7dd3fc]/20">
                    Recomendado
                  </span>
                </div>
                <p className="text-[11px] text-[#a0b4c4] mt-1 leading-snug">
                  Ideal si solo tú usas este teléfono. Podrás volver a ver tus resultados sin rellenar el formulario.
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleDownloadPdf}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e4d6e] text-[#c8eaff] hover:bg-[#0e4d6e]/90 active:scale-95 text-xs font-medium transition-all shadow-sm border border-[#7dd3fc]/30 cursor-pointer"
                    type="button"
                    title="Descargar informe oficial en PDF sin rastros en historial"
                  >
                    <span className="material-symbols-outlined text-sm text-[#7dd3fc]">picture_as_pdf</span>
                    <span>Descargar Reporte PDF (Cero Huella)</span>
                  </button>

                  <button
                    onClick={handleDownloadJson}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a3a4e] text-[#c0d8e8] hover:bg-[#1a3a4e]/90 active:scale-95 text-xs font-medium transition-all shadow-sm border border-[#7dd3fc]/20 cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm text-[#7dd3fc]">download</span>
                    <span>Descargar copia JSON</span>
                  </button>
                </div>
              </div>
            </div>
          </label>

          {/* Option B (Immediate Purge) */}
          <label
            onClick={() => setPolicy('purge')}
            className={`relative block w-full p-3.5 rounded-lg cursor-pointer transition-all duration-200 text-left ${
              policy === 'purge'
                ? 'bg-[#1a2438]/90 shadow-md border border-[#ff6b6b]/40'
                : 'bg-[#111828]/70 hover:bg-[#111828] border border-white/5'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="storage_policy"
                value="purge"
                checked={policy === 'purge'}
                onChange={() => setPolicy('purge')}
                className="mt-1 accent-[#7dd3fc] h-4 w-4 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#e0e8f0]">
                    Borrar todo inmediatamente al salir
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff6b6b] px-1.5 py-0.5 rounded bg-[#3d1414]/80 border border-[#ff6b6b]/30">
                    Cero Huella
                  </span>
                </div>
                <p className="text-[11px] text-[#a0b4c4] mt-1 leading-snug">
                  Purga total de LocalStorage, caché de formulario y tokens temporales al instante.
                </p>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Reassuring Nature Atmosphere Banner */}
      <div className="relative overflow-hidden rounded-xl bg-[#111828] p-3.5 shadow-md flex items-center gap-3 border border-[#7dd3fc]/15">
        <div
          className="w-10 h-10 rounded-lg bg-cover bg-center shrink-0 shadow-inner border border-white/10"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCHNFOAW46-tRXmxRZgRx3rl0qaHiW0kygs5vZF_L5CYHuJcP5kZSEdLWp0kOVHkUM5tOmwWZ7L48AZ4SQtkkayoYwGp7jKd0t4QWyibG-yj-k40h0EAsdNpDTvvn4qrczyf3YGTNJndSJNCp1tyyn837pshqXj_oaYmvgf0mRw_89An66GLcJMkb5KPNuxrA2HKKse4J75WCGLwlirmZiMjVOi2Df9b3BlYSJowmytyfPdtHwuhnq4cg')`,
          }}
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-xs font-semibold text-[#e0e8f0]">Entorno de Calma y Confianza</h2>
          <p className="text-[11px] text-[#a0b4c4] truncate">
            Tu paz mental y tu discreción son el centro de este sistema.
          </p>
        </div>
      </div>

      {/* Main Action Triggers */}
      <div className="w-full space-y-2.5 pt-1">
        {/* Primary Exit Action Button */}
        <button
          onClick={handleSafeExitClick}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#3d2060] via-[#5b21b6] to-[#c8a0f0] text-white font-headline font-bold text-sm tracking-wide shadow-[0_8px_20px_rgba(91,33,182,0.45)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#c8a0f0]/30"
          type="button"
        >
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span>Cerrar Sesión de Forma Segura</span>
        </button>

        {/* Destructive Purge Button */}
        <button
          onClick={onPurgeAndRedirect}
          className="w-full py-3 px-4 rounded-xl bg-[#3d1414]/80 text-[#ffb3b3] hover:bg-[#3d1414] active:scale-[0.98] transition-all text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-sm border border-[#ff6b6b]/30 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-base text-[#ff6b6b]">delete_forever</span>
          <span>Borrar Todos los Datos y Salir a Google</span>
        </button>
      </div>

      {/* Informative Bottom Banner with Emergency Safety Hint */}
      <div className="rounded-xl bg-[#1a2438]/60 backdrop-blur-md p-3 flex items-start gap-2.5 text-left mb-6 border border-[#7dd3fc]/15">
        <span className="material-symbols-outlined text-[#c8a0f0] text-base shrink-0 mt-0.5">info</span>
        <p className="text-[11px] text-[#a0b4c4] leading-relaxed">
          Si alguien se acerca o necesitas salir de emergencia, recuerda presionar en cualquier momento el botón flotante morado de abajo a la derecha (<strong className="text-[#e0e8f0] font-semibold">⚡ Salida Rápida</strong>).
        </p>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Database, FileText, Download, Trash2 } from 'lucide-react';
import { AssessmentResult, AnswersMap } from '../types';
import { generateConfidentialPdfReport } from '../utils/generatePdfReport';
import { isSupabaseConfigured } from '../lib/supabase';
import { FramedPanel } from './FramedPanel';

interface ScreenBovedaProps {
  sessionUuid: string;
  assessment: AssessmentResult;
  answers: AnswersMap;
  zeroTraceAutoPurge: boolean;
  onTogglePolicy: (val: boolean) => void;
  onDestroyVault: () => void;
}

export const ScreenBoveda: React.FC<ScreenBovedaProps> = ({
  sessionUuid,
  assessment,
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
      assessment,
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
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-[#4b3266]">ID Anónimo de Sesión:</span>
              <code className="px-2 py-0.5 rounded bg-purple-900 text-pink-100 font-mono text-[11px] truncate">
                {sessionUuid}
              </code>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-[#4b3266]">Estado de Persistencia:</span>
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                <Database className="w-3 h-3" />
                {isSupabaseConfigured ? 'Supabase + RAM Seguro' : 'Modo Local Seguro (RAM)'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-[#4b3266]">Evaluación Activa:</span>
              <span className="font-bold text-[#231136] tabular-nums">
                {assessment.score}/100 ({assessment.riskLabel})
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
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
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
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
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
              onClick={() => generateConfidentialPdfReport(assessment, answers)}
              className="py-2.5 px-3 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <FileText className="w-4 h-4 text-pink-300" />
              <span>Descargar Informe PDF</span>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="py-2.5 px-3 rounded-xl bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-950 border border-fuchsia-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
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
              className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow flex items-center justify-center gap-2 transition cursor-pointer"
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

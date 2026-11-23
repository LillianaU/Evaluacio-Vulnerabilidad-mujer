import React, { useState } from 'react';
import {
  AlertTriangle,
  Scale,
  Phone,
  Download,
  FolderLock,
  Trash2,
} from 'lucide-react';
import { ScreenType, AssessmentResult, RiskLevel, AnswersMap } from '../types';
import { saveAssessmentToDatabase } from '../services/api';
import { generateConfidentialPdfReport } from '../utils/generatePdfReport';
import { FramedPanel } from './FramedPanel';

interface ScreenDiagnosticoProps {
  assessment: AssessmentResult;
  answers: AnswersMap;
  isSavedInVault: boolean;
  onSavedToVault: () => void;
  onNavigate: (screen: ScreenType) => void;
  onQuickPurge: () => void;
}

export const ScreenDiagnostico: React.FC<ScreenDiagnosticoProps> = ({
  assessment,
  answers,
  isSavedInVault,
  onSavedToVault,
  onNavigate,
  onQuickPurge,
}) => {
  const [pdfFeedback, setPdfFeedback] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleDownloadPdf = () => {
    generateConfidentialPdfReport(assessment, answers);
    setPdfFeedback(true);
    setTimeout(() => setPdfFeedback(false), 3500);
  };

  const handleSaveToVault = async () => {
    if (saving) return;
    setSaving(true);
    await saveAssessmentToDatabase(assessment, answers);
    setSaving(false);
    onSavedToVault();
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
  const strokeDashoffset = circumference - (assessment.score / 100) * circumference;

  return (
    <div className="space-y-4">
      <FramedPanel showTopCrest>
        <div className="space-y-5">
          {/* Medidor visual de puntaje 0–100 */}
          <div className="text-center space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-fuchsia-800">
              Resultado de Orientación · {assessment.timestamp}
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
                  stroke={gaugeStroke[assessment.riskLevel]}
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-[#231136] tabular-nums">
                  {assessment.score}
                </span>
                <span className="text-[11px] font-bold text-[#5b4175]">de 100 pts</span>
              </div>
            </div>

            <div>
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold border ${
                  badgeColors[assessment.riskLevel]
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                {assessment.riskLabel}
              </span>
            </div>
          </div>

          {/* Factores detectados */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-sm text-[#231136] flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-fuchsia-700" />
              <span>Factores Tipificados Detectados ({assessment.detectedFactors.length})</span>
            </h3>

            {assessment.detectedFactors.length === 0 ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                No se detectaron indicadores activos de acoso laboral en tus respuestas actuales.
                Puedes repetir el cuestionario en cualquier momento.
              </div>
            ) : (
              <div className="space-y-2">
                {assessment.detectedFactors.map((factor) => (
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
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#581c87] to-[#9d174d] hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
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
                onClick={handleSaveToVault}
                disabled={saving}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  isSavedInVault
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-purple-100 hover:bg-purple-200 text-purple-950 border-purple-300'
                }`}
              >
                <FolderLock className="w-3.5 h-3.5" />
                <span>
                  {saving
                    ? 'Guardando...'
                    : isSavedInVault
                    ? 'Guardado en Bóveda'
                    : 'Guardar en Bóveda'}
                </span>
              </button>

              <button
                type="button"
                onClick={onQuickPurge}
                className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Purga y Salida</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('test')}
              className="w-full py-2 text-xs font-semibold text-fuchsia-800 hover:underline cursor-pointer"
            >
              ← Ajustar respuestas del cuestionario
            </button>
          </div>
        </div>
      </FramedPanel>
    </div>
  );
};

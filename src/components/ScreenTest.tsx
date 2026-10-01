import React from 'react';
import { ScreenType, AssessmentResult } from '../types';
import { QUESTIONS_DATA, calculateAssessment, DEFAULT_ASSESSMENT } from '../data/assessmentData';

interface ScreenTestProps {
  answers: Record<string, number>;
  onAnswerChange: (questionId: string, points: number) => void;
  onSetAllAnswers: (answers: Record<string, number>) => void;
  onNavigate: (screen: ScreenType) => void;
  currentResult: AssessmentResult;
}

export const ScreenTest: React.FC<ScreenTestProps> = ({
  answers,
  onAnswerChange,
  onSetAllAnswers,
  onNavigate,
  currentResult,
}) => {
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / QUESTIONS_DATA.length) * 100);

  const handleLoadReferencePreset = () => {
    // Preset matching 85/100 score with High Risk factors
    const preset = {
      q1: 2, // Con frecuencia (Descalificación)
      q2: 3, // Constantemente (Sobrecarga selectiva)
      q3: 2, // Con frecuencia (Entorpecimiento)
      q4: 3, // Constantemente (Aislamiento)
      q5: 3, // Constantemente (Intimidación sutil)
    };
    onSetAllAnswers(preset);
  };

  const handleCalculateAndNavigate = () => {
    onNavigate('diagnostico');
  };

  return (
    <div className="flex flex-col w-full px-4 py-4 gap-5 max-w-lg mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-r from-[#141c2e] via-[#1a2438] to-[#141c2e] shadow-xl border border-[#7dd3fc]/15">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0e4d6e]/50 text-[#7dd3fc] flex items-center justify-center shrink-0 border border-[#7dd3fc]/30">
              <span className="material-symbols-outlined text-2xl">assignment</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7dd3fc]">
                  Cuestionario Objetivo
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#1a3a4e] text-[#c0d8e8]">
                  Ley 1010
                </span>
              </div>
              <h1 className="text-base font-headline font-bold text-[#e0e8f0]">
                Evaluación de Acoso Laboral
              </h1>
            </div>
          </div>
          <button
            onClick={handleLoadReferencePreset}
            className="text-[10px] px-2.5 py-1 rounded-lg bg-[#3d2060]/70 text-[#e8d0ff] border border-[#c8a0f0]/30 hover:bg-[#3d2060] transition-colors shrink-0"
            title="Cargar respuestas de ejemplo de alto riesgo"
            type="button"
          >
            Cargar Caso Tipo
          </button>
        </div>

        {/* Progress Bar & Real-time Indicator */}
        <div className="mt-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#a0b4c4]">
            <span>Progreso: {answeredCount} de {QUESTIONS_DATA.length} evaluados</span>
            <span className="text-[#7dd3fc] font-semibold">
              Puntaje estimado: {currentResult.score}/100
            </span>
          </div>
          <div className="w-full bg-[#0a0e1a]/80 rounded-full h-2 overflow-hidden border border-[#7dd3fc]/10">
            <div
              className="bg-gradient-to-r from-[#7dd3fc] via-[#c8a0f0] to-[#ff6b6b] h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.max(progressPercent, 10)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="flex flex-col gap-4">
        {QUESTIONS_DATA.map((q, idx) => {
          const selectedPoints = answers[q.id];
          return (
            <div
              key={q.id}
              className="rounded-2xl bg-[#141c2e]/75 backdrop-blur-xl p-4 shadow-lg border border-[#7dd3fc]/15 flex flex-col gap-3 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#0e4d6e]/70 text-[#7dd3fc] flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7dd3fc]">
                    {q.category}
                  </span>
                </div>
                {q.legalArticle && (
                  <span className="text-[9px] text-[#a0b4c4] bg-[#1a2438] px-2 py-0.5 rounded-full border border-white/5">
                    {q.legalArticle}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-sm font-headline font-semibold text-[#e0e8f0]">
                  {q.title}
                </h3>
                <p className="text-xs text-[#a0b4c4] mt-1 leading-relaxed">
                  {q.description}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2 pt-1">
                {q.options.map((opt) => {
                  const isSelected = selectedPoints === opt.points;
                  return (
                    <button
                      key={opt.points}
                      type="button"
                      onClick={() => onAnswerChange(q.id, opt.points)}
                      className={`flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? 'bg-[#0e4d6e]/70 border border-[#7dd3fc] text-[#c8eaff] font-medium shadow-md shadow-[#7dd3fc]/10'
                          : 'bg-[#111828]/80 hover:bg-[#1a2438] text-[#e0e8f0] border border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-[#7dd3fc] bg-[#7dd3fc]'
                              : 'border-[#4a6070]'
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#001f2e]" />}
                        </span>
                        <span>{opt.label}</span>
                      </div>
                      <span className="text-[10px] text-[#88b4cc] font-mono">
                        +{opt.points * 6} pts
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Calculate Diagnostic CTA */}
      <div className="pt-2 pb-6 flex flex-col gap-3">
        <button
          onClick={handleCalculateAndNavigate}
          className="w-full flex items-center justify-center gap-2.5 py-4 px-5 rounded-2xl bg-gradient-to-r from-[#0e4d6e] via-[#5b21b6] to-[#7dd3fc] text-white font-headline font-bold text-sm shadow-xl shadow-[#7dd3fc]/20 active:scale-[0.98] transition-all cursor-pointer border border-[#7dd3fc]/30"
          type="button"
        >
          <span className="material-symbols-outlined text-xl">analytics</span>
          <span>Calcular y Ver Diagnóstico Completo →</span>
        </button>

        <div className="flex items-center justify-center gap-2 text-center text-[11px] text-[#a0b4c4]">
          <span className="material-symbols-outlined text-xs text-[#7dd3fc]">lock</span>
          <span>Tus respuestas no se envían a ningún servidor</span>
        </div>
      </div>
    </div>
  );
};

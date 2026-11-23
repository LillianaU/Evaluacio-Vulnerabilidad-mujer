import React, { useMemo } from 'react';
import { Sparkles, CheckCircle2, Activity } from 'lucide-react';
import { ScreenType, AssessmentResult, AnswersMap, QuestionId } from '../types';
import { QUESTIONS_DATA } from '../data/assessmentData';
import { FramedPanel } from './FramedPanel';

interface ScreenTestProps {
  answers: AnswersMap;
  onAnswerChange: (questionId: QuestionId, points: number) => void;
  onLoadSampleCase: () => void;
  onNavigate: (screen: ScreenType) => void;
  currentResult: AssessmentResult;
}

export const ScreenTest: React.FC<ScreenTestProps> = ({
  answers,
  onAnswerChange,
  onLoadSampleCase,
  onNavigate,
  currentResult,
}) => {
  const answeredCount = useMemo(
    () => Object.values(answers).filter((v) => v !== null).length,
    [answers]
  );

  const progressPercent = Math.round((answeredCount / QUESTIONS_DATA.length) * 100);

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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-900 border border-fuchsia-300 text-xs font-bold transition cursor-pointer"
              title="Rellena automáticamente un escenario de alto riesgo (87/100)"
            >
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-700" />
              <span>Cargar Caso Tipo</span>
            </button>
          </div>

          {/* Barra de progreso en tiempo real + puntaje estimado */}
          <div className="p-3 rounded-xl bg-[#f7eefc] border border-purple-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#2b1442]">
              <span>
                Progreso: {answeredCount} de {QUESTIONS_DATA.length} criterios ({progressPercent}%)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-800 text-pink-100 tabular-nums">
                Estimado: {currentResult.score}/100
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
            {QUESTIONS_DATA.map((q, index) => {
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
                    {q.options.map((opt) => {
                      const isSelected = selected === opt.points;
                      return (
                        <button
                          key={opt.points}
                          type="button"
                          onClick={() => onAnswerChange(q.id, opt.points)}
                          className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
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
            onClick={() => onNavigate('diagnostico')}
            className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#581c87] via-[#86198f] to-[#be185d] hover:brightness-110 text-white font-bold text-sm sm:text-base shadow-lg flex items-center justify-center gap-2 transition active:scale-[0.99] cursor-pointer"
          >
            <Activity className="w-4 h-4" />
            <span>Generar Diagnóstico Confidencial</span>
          </button>
        </div>
      </FramedPanel>
    </div>
  );
};

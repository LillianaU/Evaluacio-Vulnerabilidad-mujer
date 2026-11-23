import { Question, AssessmentResult, AnswersMap, DetectedFactor } from '../types';

export const FREQUENCY_OPTIONS = [
  { points: 0, label: 'Nunca', sub: 'No ha ocurrido' },
  { points: 1, label: 'Ocasionalmente', sub: '1 o 2 veces aisladas' },
  { points: 2, label: 'Frecuentemente', sub: 'Varias veces al mes' },
  { points: 3, label: 'Constantemente', sub: 'De forma sistemática' },
];

export const INITIAL_ANSWERS: AnswersMap = {
  q1: null,
  q2: null,
  q3: null,
  q4: null,
  q5: null,
};

export const QUESTIONS_DATA: Question[] = [
  {
    id: 'q1',
    category: 'Maltrato Laboral',
    title: 'Maltrato laboral y descalificación',
    legalRef: 'Art. 2 Num. 1 · Ley 1010 de 2006',
    legalArticle: 'Ley 1010 Art. 2 Num. 1',
    description:
      '¿Recibes comentarios humillantes, gritos, descalificaciones públicas o privadas sobre tu dignidad, aspecto o desempeño?',
    factorLabel: 'Maltrato laboral y vulneración de la dignidad',
    options: FREQUENCY_OPTIONS,
  },
  {
    id: 'q2',
    category: 'Persecución Laboral',
    title: 'Persecución y sobrecarga desproporcionada',
    legalRef: 'Art. 2 Num. 2 · Ley 1010 de 2006',
    legalArticle: 'Ley 1010 Art. 2 Num. 2',
    description:
      '¿Te asignan cargas excesivas de trabajo, plazos imposibles o cambios arbitrarios de horario buscando inducir tu renuncia?',
    factorLabel: 'Persecución laboral y sobrecarga reiterada',
    options: FREQUENCY_OPTIONS,
  },
  {
    id: 'q3',
    category: 'Entorpecimiento Laboral',
    title: 'Entorpecimiento laboral',
    legalRef: 'Art. 2 Num. 4 · Ley 1010 de 2006',
    legalArticle: 'Ley 1010 Art. 2 Num. 4',
    description:
      '¿Ocultan información clave, bloquean herramientas o destruyen/retrasan insumos necesarios para que cumplas tus funciones?',
    factorLabel: 'Entorpecimiento deliberado de funciones',
    options: FREQUENCY_OPTIONS,
  },
  {
    id: 'q4',
    category: 'Inequidad y Aislamiento',
    title: 'Inequidad y aislamiento laboral',
    legalRef: 'Art. 2 Num. 3 · Ley 1010 de 2006',
    legalArticle: 'Ley 1010 Art. 2 Num. 3',
    description:
      '¿Te excluyen sistemáticamente de reuniones, comunicaciones internas o recibes trato discriminatorio frente a tus pares?',
    factorLabel: 'Aislamiento y discriminación laboral',
    options: FREQUENCY_OPTIONS,
  },
  {
    id: 'q5',
    category: 'Desprotección e Intimidación',
    title: 'Desprotección e intimidación sutil',
    legalRef: 'Art. 2 Num. 5 y 6 · Ley 1010 de 2006',
    legalArticle: 'Ley 1010 Art. 2 Num. 5 y 6',
    description:
      '¿Recibes amenazas veladas de despido, represalias o te asignan tareas sin protocolos mínimos de seguridad y bienestar?',
    factorLabel: 'Intimidación y desprotección laboral',
    options: FREQUENCY_OPTIONS,
  },
];

export const DEFAULT_ASSESSMENT: AssessmentResult = {
  score: 0,
  riskLevel: 'bajo',
  riskLabel: 'Riesgo Bajo',
  factors: ['Sin indicios registrados en esta sesión'],
  detectedFactors: [],
  answeredCount: 0,
  totalQuestions: 5,
  timestamp: new Date().toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }),
  anonymousId: 'uuid-v4-anonimo-89f2',
};

export function calculateAssessment(
  answers: Record<string, number | null>,
  anonymousId = 'uuid-v4-anonimo-89f2'
): AssessmentResult {
  const weights: Record<'q1' | 'q2' | 'q3' | 'q4' | 'q5', number> = {
    q1: 1.15,
    q2: 1.1,
    q3: 1.0,
    q4: 1.0,
    q5: 1.1,
  };

  let weightedSum = 0;
  let maxWeighted = 0;
  let answeredCount = 0;

  const detectedFactors: DetectedFactor[] = [];
  const factors: string[] = [];

  for (const q of QUESTIONS_DATA) {
    const raw = answers[q.id];
    if (raw !== null && raw !== undefined) {
      answeredCount += 1;
    }
    const val = raw ?? 0;
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
      factors.push(q.factorLabel);
    }
  }

  if (factors.length === 0) {
    factors.push('Sin indicios significativos registrados');
  }

  const normalized = Math.round((weightedSum / maxWeighted) * 100);
  const score = Math.min(100, Math.max(0, normalized));

  let riskLevel: 'bajo' | 'medio' | 'alto' = 'bajo';
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
    factors,
    detectedFactors,
    answeredCount,
    totalQuestions: QUESTIONS_DATA.length,
    timestamp: new Date().toLocaleString('es-CO', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
    anonymousId,
  };
}

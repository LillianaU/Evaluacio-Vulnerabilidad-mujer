import { Question, AssessmentResult } from '../types';

export const QUESTIONS_DATA: Question[] = [
  {
    id: 'q1',
    category: 'Intimidación & Maltrato',
    legalArticle: 'Ley 1010 Art. 2 (Maltrato)',
    title: 'Descalificación y comentarios hostiles',
    description: '¿Has recibido gritos, insultos, comentarios sarcásticos o descalificaciones injustificadas frente a otros o en privado?',
    options: [
      { label: 'Nunca me ha sucedido', points: 0 },
      { label: 'Rara vez (episodio aislado)', points: 1 },
      { label: 'Con frecuencia (varias veces al mes)', points: 2 },
      { label: 'Constantemente (semanal o diario)', points: 3 },
    ],
  },
  {
    id: 'q2',
    category: 'Persecución & Sobrecarga',
    legalArticle: 'Ley 1010 Art. 2 (Persecución)',
    title: 'Sobrecarga selectiva y plazos irreales',
    description: '¿Te imponen cargas de trabajo desproporcionadas, horarios arbitrarios o exigencias inalcanzables que no se exigen a tus pares?',
    options: [
      { label: 'Nunca', points: 0 },
      { label: 'Rara vez', points: 1 },
      { label: 'Con frecuencia', points: 2 },
      { label: 'Constantemente', points: 3 },
    ],
  },
  {
    id: 'q3',
    category: 'Entorpecimiento Laboral',
    legalArticle: 'Ley 1010 Art. 2 (Entorpecimiento)',
    title: 'Ocultamiento de información y bloqueo de herramientas',
    description: '¿Te niegan el acceso a datos esenciales, correos o insumos de trabajo indispensables para poder cumplir tus metas?',
    options: [
      { label: 'Nunca', points: 0 },
      { label: 'Rara vez', points: 1 },
      { label: 'Con frecuencia', points: 2 },
      { label: 'Constantemente', points: 3 },
    ],
  },
  {
    id: 'q4',
    category: 'Aislamiento & Inequidad',
    legalArticle: 'Ley 1010 Art. 2 (Inequidad y Discriminación)',
    title: 'Aislamiento social y exclusión deliberada',
    description: '¿Te excluyen de reuniones clave, decisiones del área o grupos de comunicación laboral afectando tu integración?',
    options: [
      { label: 'Nunca', points: 0 },
      { label: 'Rara vez', points: 1 },
      { label: 'Con frecuencia', points: 2 },
      { label: 'Constantemente', points: 3 },
    ],
  },
  {
    id: 'q5',
    category: 'Amenazas e Intimidación Sutil',
    legalArticle: 'Ley 1010 Art. 2 (Desprotección e Intimidación)',
    title: 'Presión para renunciar o amenazas veladas',
    description: '¿Has recibido advertencias directas o indirectas insinuando tu despido, desmejora salarial o afectación reputacional si reclamas?',
    options: [
      { label: 'Nunca', points: 0 },
      { label: 'Rara vez', points: 1 },
      { label: 'Con frecuencia', points: 2 },
      { label: 'Constantemente', points: 3 },
    ],
  },
];

export const DEFAULT_ASSESSMENT: AssessmentResult = {
  score: 85,
  riskLevel: 'alto',
  factors: [
    'Intimidación sutil',
    'Sobrecarga selectiva',
    'Persecución laboral reiterada',
  ],
  answeredCount: 5,
  totalQuestions: 5,
  timestamp: new Date().toISOString(),
  anonymousId: 'uuid-v4-anonimo-89f2',
};

export function calculateAssessment(answers: Record<string, number>): AssessmentResult {
  const keys = Object.keys(answers);
  if (keys.length === 0) {
    return DEFAULT_ASSESSMENT;
  }

  let totalPoints = 0;
  const maxPossible = QUESTIONS_DATA.length * 3;
  const factors: string[] = [];

  for (const q of QUESTIONS_DATA) {
    const pts = answers[q.id] ?? 0;
    totalPoints += pts;

    if (pts >= 2) {
      if (q.id === 'q1') factors.push('Descalificación verbal');
      if (q.id === 'q2') factors.push('Sobrecarga selectiva');
      if (q.id === 'q3') factors.push('Entorpecimiento laboral');
      if (q.id === 'q4') factors.push('Aislamiento profesional');
      if (q.id === 'q5') factors.push('Intimidación sutil');
    }
  }

  if (factors.length === 0) {
    factors.push('Sin indicios recurrentes de acoso');
  }

  const normalizedScore = Math.min(100, Math.round((totalPoints / maxPossible) * 100));

  let riskLevel: 'bajo' | 'medio' | 'alto' = 'bajo';
  if (normalizedScore >= 65) {
    riskLevel = 'alto';
  } else if (normalizedScore >= 35) {
    riskLevel = 'medio';
  } else {
    riskLevel = 'bajo';
  }

  return {
    score: normalizedScore,
    riskLevel,
    factors,
    answeredCount: keys.length,
    totalQuestions: QUESTIONS_DATA.length,
    timestamp: new Date().toISOString(),
    anonymousId: 'uuid-v4-anonimo-89f2',
  };
}

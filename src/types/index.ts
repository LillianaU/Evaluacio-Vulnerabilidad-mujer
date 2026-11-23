export type ScreenType =
  | 'inicio'
  | 'test'
  | 'diagnostico'
  | 'boveda'
  | 'aerosalud'
  | 'camuflaje';

export type RiskLevel = 'bajo' | 'medio' | 'alto';

export type QuestionId = 'q1' | 'q2' | 'q3' | 'q4' | 'q5';

export interface Question {
  id: QuestionId;
  category: string;
  title: string;
  legalRef: string;
  legalArticle?: string;
  description: string;
  factorLabel: string;
  options: {
    label: string;
    sub: string;
    points: number; // 0: Nunca, 1: Ocasionalmente, 2: Frecuentemente, 3: Constantemente
  }[];
}

export type AnswersMap = Record<QuestionId, number | null>;

export interface DetectedFactor {
  id: string;
  title: string;
  legalRef: string;
  severity: string;
  points: number;
}

export interface AssessmentResult {
  score: number; // 0 to 100
  riskLevel: RiskLevel;
  riskLabel: string;
  factors: string[];
  detectedFactors: DetectedFactor[];
  answeredCount: number;
  totalQuestions: number;
  timestamp: string;
  anonymousId: string;
}

export interface VaultSettings {
  policy: 'keep' | 'purge';
  anonymousId: string;
  encryptionAlgorithm: string;
  lastUpdated: string;
}

export type ScreenType = 'inicio' | 'test' | 'diagnostico' | 'boveda' | 'aerosalud' | 'camuflaje';

export type RiskLevel = 'bajo' | 'medio' | 'alto';

export interface Question {
  id: string;
  category: string;
  title: string;
  description: string;
  legalArticle?: string;
  options: {
    label: string;
    points: number; // 0: Nunca, 1: Rara vez, 2: Con frecuencia, 3: Constantemente
  }[];
}

export interface AssessmentResult {
  score: number; // 0 to 100
  riskLevel: RiskLevel;
  factors: string[];
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

export interface AnalysisResult {
  id: string;
  companyName: string;
  vacancyTitle: string;
  idealCandidateImageUrl: string;
  analysisParagraph: string; // First paragraph for ScoreCard
  analysisTips: string; // List content for Analyse card
  score?: number;
  timestamp: Date;
  meta?: {
    source?: string;
    analysisId?: string;
    submittedAt?: string;
  };
}

export type AppState = 'idle' | 'showing' | 'processing' | 'ai-transition';

export interface AppConfig {
  typeformUrl: string;
  displaySeconds: number;
  kioskTitle: string;
  kioskSubtitle: string;
}

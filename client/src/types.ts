export interface AnalysisResult {
  id: string;
  companyName: string;
  vacancyTitle: string;
  idealCandidateImageUrl: string;
  analysisContent: string; // HTML content for analysis results
  score?: number;
  timestamp: Date;
  meta?: {
    source?: string;
    analysisId?: string;
    submittedAt?: string;
  };
}

export type AppState = 'idle' | 'showing' | 'processing';

export interface AppConfig {
  typeformUrl: string;
  displaySeconds: number;
  kioskTitle: string;
  kioskSubtitle: string;
}

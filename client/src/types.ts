export interface AnalysisResult {
  id: string;
  companyName: string;
  vacancyTitle: string;
  idealCandidateImageUrl: string;
  tips: string[];
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
}

import { z } from 'zod';

// Zod schema for webhook payload validation
export const WebhookPayloadSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  vacancy_title: z.string().min(1, 'Vacancy title is required'),
  ideal_candidate_image_url: z.string().url('Invalid image URL'),
  // Accept HTML content for analysis results
  analysis_content: z.string().min(1, 'Analysis content is required'),
  score: z.union([z.string(), z.number()]).optional(),
  Score: z.union([z.string(), z.number()]).optional(),
  meta: z.object({
    source: z.string().optional(),
    analysis_id: z.string().optional(),
    submitted_at: z.string().optional(),
  }).optional(),
});

export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;

// Internal analysis result type
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

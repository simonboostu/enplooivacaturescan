import { z } from 'zod';

// Zod schema for webhook payload validation
export const WebhookPayloadSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  vacancy_title: z.string().min(1, 'Vacancy title is required'),
  ideal_candidate_image_url: z.string().min(1, 'Image URL is required'),
  // Accept HTML content in either analysis_content or tips field (for backward compatibility)
  analysis_content: z.string().min(1, 'Analysis content is required').optional(),
  tips: z.string().min(1, 'Tips content is required').optional(),
  score: z.union([z.string(), z.number()]).optional(),
  Score: z.union([z.string(), z.number()]).optional(),
  meta: z.object({
    source: z.string().optional(),
    analysis_id: z.string().optional(),
    submitted_at: z.string().optional(),
  }).optional(),
}).refine((data) => data.analysis_content || data.tips, {
  message: "Either analysis_content or tips must be provided",
  path: ["analysis_content"],
});

export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;

// Internal analysis result type
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

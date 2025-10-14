import { z } from 'zod';

// Zod schema for webhook payload validation
export const WebhookPayloadSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  vacancy_title: z.string().min(1, 'Vacancy title is required'),
  ideal_candidate_image_url: z.string().url('Invalid image URL'),
  // Accept either an array of tips or a single string with separators (\n, ;, |)
  tips: z.union([
    z.array(z.string().min(1, 'Tip cannot be empty')).min(1, 'At least one tip'),
    z.string().min(1, 'Tips string cannot be empty'),
  ]),
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
  tips: string[];
  timestamp: Date;
  meta?: {
    source?: string;
    analysisId?: string;
    submittedAt?: string;
  };
}

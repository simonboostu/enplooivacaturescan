import dotenv from 'dotenv';

dotenv.config();

export interface Config {
  port: number;
  typeformUrl: string;
  webhookAuthToken: string;
  displaySeconds: number;
  brandPrimary: string;
  brandAccent: string;
  brandBg: string;
  brandText: string;
  kioskTitle: string;
}

export const config: Config = {
  port: parseInt(process.env['PORT'] || '3000', 10),
  typeformUrl: process.env['TYPEFORM_URL'] || '',
  webhookAuthToken: process.env['WEBHOOK_AUTH_TOKEN'] || '',
  displaySeconds: parseInt(process.env['DISPLAY_SECONDS'] || '15', 10),
  brandPrimary: process.env['BRAND_PRIMARY'] || '#2563eb',
  brandAccent: process.env['BRAND_ACCENT'] || '#f59e0b',
  brandBg: process.env['BRAND_BG'] || '#ffffff',
  brandText: process.env['BRAND_TEXT'] || '#1f2937',
  kioskTitle: process.env['KIOSK_TITLE'] || 'Gratis Vacaturescan',
};

// Validate required config
if (!config.typeformUrl) {
  throw new Error('TYPEFORM_URL is required');
}

if (!config.webhookAuthToken) {
  throw new Error('WEBHOOK_AUTH_TOKEN is required');
}

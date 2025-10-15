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
  kioskSubtitle: string;
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
  kioskTitle: process.env['KIOSK_TITLE'] || 'Is jouw vacature basic of briljant?\nStart hier je AI vacaturescan!',
  kioskSubtitle: process.env['KIOSK_SUBTITLE'] || 'Heb je vacatures die maar niet ingevuld raken? Geen of weinig reacties? Niet de juiste profielen?\n\nVoeg hier de URL van je vacaturetekst in en onze AI scan analyseert jouw vacaturetekst en geeft advies over hoe het beter kan.',
};

// Validate required config
if (!config.typeformUrl) {
  throw new Error('TYPEFORM_URL is required');
}

if (!config.webhookAuthToken) {
  throw new Error('WEBHOOK_AUTH_TOKEN is required');
}

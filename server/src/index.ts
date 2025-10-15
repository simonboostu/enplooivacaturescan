import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { config } from './config';
import { WebhookPayloadSchema, AnalysisResult } from './types';
import { validateToken, generateAnalysisId, sanitizeString } from './security';
import { analysisStorage } from './storage';
import { initializeSockets, emitNewAnalysis } from './sockets';

/**
 * Validate and potentially process image URLs
 * For download URLs, we'll pass them through but add some metadata
 */
function processImageUrl(url: string): string {
  // For now, we'll pass through the URL as-is
  // In the future, we could add image proxying or validation here
  return url;
}

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
initializeSockets(httpServer);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"],
    },
  },
}));

app.use(cors({
  origin: process.env['NODE_ENV'] === 'production' ? false : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Serve static files (before API routes)
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// Rate limiting for webhook endpoint
const webhookRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: 'Too many webhook requests',
  standardHeaders: true,
  legacyHeaders: false,
});

// Health check endpoint
app.get('/healthz', (_req, res) => {
  res.json({
    ok: true,
    queue: analysisStorage.getSize(),
    timestamp: new Date().toISOString(),
  });
});

// Config endpoint for client
app.get('/api/config', (_req, res) => {
  res.json({
    typeformUrl: config.typeformUrl,
    displaySeconds: config.displaySeconds,
    kioskTitle: config.kioskTitle,
    kioskSubtitle: config.kioskSubtitle,
    brandPrimary: config.brandPrimary,
    brandAccent: config.brandAccent,
    brandBg: config.brandBg,
    brandText: config.brandText,
  });
});

// Get latest analysis result (for fallback polling)
app.get('/api/last', (_req, res) => {
  const latest = analysisStorage.getLatest();
  if (!latest) {
    return res.status(404).json({ error: 'No analysis results available' });
  }
  return res.json(latest);
});

// Webhook endpoint for receiving analysis results
app.post('/api/webhook/v1/result', webhookRateLimit, (req, res) => {
  try {
    // Validate authentication
    const authHeader = req.headers.authorization;
    const queryToken = req.query['token'] as string;
    
    if (!validateToken(authHeader, queryToken, config.webhookAuthToken)) {
      return res.status(401).json({ error: 'Invalid or missing authentication token' });
    }

    // Try to validate payload
    const validationResult = WebhookPayloadSchema.safeParse(req.body);
    let result: AnalysisResult;

    if (validationResult.success) {
      // Valid payload - process normally
      const payload = validationResult.data;
      
      // Process HTML content and filter out matching percentage line
      // Accept content from either analysis_content or tips field
      let processedContent = payload.analysis_content || payload.tips || '';
      
      // Remove the first line if it starts with "##" (matching percentage or similar)
      const lines = processedContent.split('\n');
      if (lines.length > 0 && lines[0] && lines[0].trim().startsWith('##')) {
        processedContent = lines.slice(1).join('\n').trim();
      }

      // Split content into paragraph and tips list
      let analysisParagraph = '';
      let analysisTips = '';
      
      // Find the first <ul> tag to split content
      const ulIndex = processedContent.indexOf('<ul>');
      if (ulIndex !== -1) {
        analysisParagraph = processedContent.substring(0, ulIndex).trim();
        analysisTips = processedContent.substring(ulIndex).trim();
      } else {
        // If no <ul> found, put everything in tips
        analysisTips = processedContent;
      }
      
      // Convert score to number if it's a string (handle both "score" and "Score")
      let scoreNum: number | undefined;
      const rawScore = (payload as any).score || (payload as any).Score;
      if (rawScore !== undefined) {
        const parsedScore = typeof rawScore === 'string' ? parseFloat(rawScore) : rawScore;
        if (!isNaN(parsedScore) && parsedScore >= 0 && parsedScore <= 100) {
          scoreNum = parsedScore;
        }
      }

      result = {
        id: generateAnalysisId(),
        companyName: sanitizeString(payload.company_name),
        vacancyTitle: sanitizeString(payload.vacancy_title),
        idealCandidateImageUrl: processImageUrl(payload.ideal_candidate_image_url),
        analysisParagraph: analysisParagraph, // Don't sanitize HTML content
        analysisTips: analysisTips, // Don't sanitize HTML content
        score: scoreNum,
        timestamp: new Date(),
        meta: payload.meta ? {
          source: payload.meta.source,
          analysisId: payload.meta.analysis_id,
          submittedAt: payload.meta.submitted_at,
        } : undefined,
      };
      console.log(`Valid analysis received: ${result.companyName} - ${result.vacancyTitle} (content length=${processedContent.length}, score=${result.score})`);
    } else {
      // Invalid payload - create fallback result with mock data
      console.warn('Webhook validation failed, creating fallback result:', validationResult.error.errors);
      
      // Extract what we can from the invalid payload
      const body = req.body;
      const fallbackCompany = sanitizeString(body.company_name || body.companyName || 'Onbekend Bedrijf');
      const fallbackTitle = sanitizeString(body.vacancy_title || body.vacancyTitle || body.job_title || 'Vacature');
      
      // Try to parse HTML content from the invalid payload
      let fallbackContent = body.analysis_content || body.tips || body.content || '';
      
      // Remove the first line if it starts with "##" (matching percentage or similar)
      if (fallbackContent) {
        const lines = fallbackContent.split('\n');
        if (lines.length > 0 && lines[0] && lines[0].trim().startsWith('##')) {
          fallbackContent = lines.slice(1).join('\n').trim();
        }
      }
      
      // Split fallback content into paragraph and tips list
      let fallbackParagraph = '';
      let fallbackTips = '';
      
      if (fallbackContent) {
        const ulIndex = fallbackContent.indexOf('<ul>');
        if (ulIndex !== -1) {
          fallbackParagraph = fallbackContent.substring(0, ulIndex).trim();
          fallbackTips = fallbackContent.substring(ulIndex).trim();
        } else {
          fallbackTips = fallbackContent;
        }
      }
      
      // If no content available, create default content
      if (!fallbackParagraph && !fallbackTips) {
        fallbackParagraph = `<p>De vacaturetekst voor ${fallbackTitle} bij ${fallbackCompany} heeft een goede basis, maar er zijn enkele verbeterpunten mogelijk.</p>`;
        fallbackTips = `
          <ul>
            <li>
              <h3>Specifieke vereisten toevoegen</h3>
              <p>Voeg meer specifieke vereisten toe aan je vacature om de juiste kandidaten aan te trekken.</p>
            </li>
            <li>
              <h3>Bedrijfscultuur beschrijven</h3>
              <p>Beschrijf de bedrijfscultuur en waarden om kandidaten een beter beeld te geven van de werkomgeving.</p>
            </li>
            <li>
              <h3>Salaris vermelden</h3>
              <p>Vermeld het salaris of salarisrange om transparantie te bieden en geschikte kandidaten aan te trekken.</p>
            </li>
            <li>
              <h3>Thuiswerk mogelijkheden</h3>
              <p>Specificeer thuiswerk mogelijkheden om flexibiliteit te bieden en meer kandidaten aan te spreken.</p>
            </li>
          </ul>
        `;
      }
      
      // Try to parse score from the invalid payload (handle both "score" and "Score")
      const rawScore = body.score || body.Score;
      let parsedScore: number | undefined;
      if (rawScore !== undefined && rawScore !== null) {
        const scoreNum = Number(rawScore);
        if (!isNaN(scoreNum) && scoreNum >= 0 && scoreNum <= 100) {
          parsedScore = scoreNum;
        }
      }
      
      result = {
        id: generateAnalysisId(),
        companyName: fallbackCompany,
        vacancyTitle: fallbackTitle,
        idealCandidateImageUrl: processImageUrl(body.ideal_candidate_image_url || 'https://via.placeholder.com/400x300/2563eb/ffffff?text=Ideal+Candidate'),
        analysisParagraph: fallbackParagraph, // Don't sanitize HTML content
        analysisTips: fallbackTips, // Don't sanitize HTML content
        score: parsedScore,
        timestamp: new Date(),
        meta: {
          source: 'fallback',
          analysisId: 'fallback-' + Date.now(),
          submittedAt: new Date().toISOString(),
        },
      };
      console.log(`Fallback result created: ${result.companyName} - ${result.vacancyTitle} (content length=${fallbackContent.length}, score=${result.score})`);
    }

    // Store result
    analysisStorage.add(result);

    // Emit to connected clients
    emitNewAnalysis(result);

    return res.status(200).json({
      success: true,
      analysisId: result.id,
      message: validationResult.success ? 'Analysis result processed successfully' : 'Fallback result created with mock data',
      fallback: !validationResult.success,
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process analysis result',
    });
  }
});

// Catch-all handler for SPA routing (only for non-API routes)
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api/') || req.path.startsWith('/healthz')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Error handling middleware
app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env['NODE_ENV'] === 'development' ? error.message : 'Something went wrong',
  });
});

// Start server
httpServer.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`📊 Health check: http://localhost:${config.port}/healthz`);
  console.log(`🔗 Webhook endpoint: http://localhost:${config.port}/api/webhook/v1/result`);
  
  if (process.env['NODE_ENV'] === 'production') {
    console.log(`📱 Kiosk app: http://localhost:${config.port}`);
  }
});

export default app;

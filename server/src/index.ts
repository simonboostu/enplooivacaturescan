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

    // Validate payload
    const validationResult = WebhookPayloadSchema.safeParse(req.body);
    if (!validationResult.success) {
      console.error('Webhook validation failed:', validationResult.error);
      return res.status(422).json({
        error: 'Invalid payload',
        details: validationResult.error.errors,
      });
    }

    const payload = validationResult.data;

    // Create analysis result
    const result: AnalysisResult = {
      id: generateAnalysisId(),
      companyName: sanitizeString(payload.company_name),
      vacancyTitle: sanitizeString(payload.vacancy_title),
      idealCandidateImageUrl: payload.ideal_candidate_image_url,
      tips: payload.tips.map(sanitizeString),
      timestamp: new Date(),
      meta: payload.meta ? {
        source: payload.meta.source,
        analysisId: payload.meta.analysis_id,
        submittedAt: payload.meta.submitted_at,
      } : undefined,
    };

    // Store result
    analysisStorage.add(result);

    // Emit to connected clients
    emitNewAnalysis(result);

    console.log(`Analysis received and processed: ${result.companyName} - ${result.vacancyTitle}`);

    return res.status(200).json({
      success: true,
      analysisId: result.id,
      message: 'Analysis result processed successfully',
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

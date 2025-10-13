const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const path = require('path');

const app = express();
const httpServer = createServer(app);

// Basic middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/healthz', (req, res) => {
  res.json({
    ok: true,
    queue: 0,
    timestamp: new Date().toISOString(),
  });
});

// Mock webhook endpoint
app.post('/api/webhook/v1/result', (req, res) => {
  console.log('Webhook received:', req.body);
  
  // Mock response
  res.json({
    success: true,
    analysisId: 'test-123',
    message: 'Analysis result processed successfully',
  });
});

// Get latest result
app.get('/api/last', (req, res) => {
  res.json({
    id: 'test-123',
    companyName: 'Test Company',
    vacancyTitle: 'Software Developer',
    idealCandidateImageUrl: 'https://picsum.photos/600/750',
    tips: [
      'Maak de intro compacter en resultaatgerichter',
      'Voeg doorgroeimogelijkheden en opleidingsbudget toe',
      'Gebruik taal en visuals passend bij je doelgroep',
      'Toon salarisrange en secundaire voordelen duidelijker'
    ],
    timestamp: new Date().toISOString(),
    meta: {
      source: 'test',
      analysisId: 'test-123'
    }
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/healthz`);
  console.log(`🔗 Webhook endpoint: http://localhost:${PORT}/api/webhook/v1/result`);
});


# Enplooi Vacature Scanner Kiosk

A full-screen TV kiosk application for displaying vacancy analysis results at fairs and events. Visitors scan a QR code to fill out a Typeform, and the results are displayed on the kiosk screen in real-time.

## Features

- 🎯 **Real-time Results**: Instant display of analysis results via Socket.IO
- 📱 **QR Code Integration**: Easy access to Typeform via QR code
- 🎨 **Enplooi Branding**: Customizable brand colors and styling
- ⏱️ **Timed Display**: Automatic rotation between results
- 🔒 **Secure Webhooks**: Bearer token authentication for webhook endpoints
- 📊 **Queue Management**: Handles multiple results with intelligent queuing
- 🖥️ **Kiosk Mode**: Full-screen, cursor-hidden interface
- 🐳 **Docker Ready**: Production-ready containerization

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling with CSS variables
- **Framer Motion** for smooth animations
- **Socket.IO Client** for real-time communication
- **QRCode.react** for QR code generation

### Backend
- **Node.js** with Express and TypeScript
- **Socket.IO** for real-time communication
- **Zod** for request validation
- **Helmet** for security headers
- **Rate limiting** for webhook protection

## Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm 8+

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd EnplooiVacatureScan
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start development servers:**
   ```bash
   pnpm dev
   ```

4. **Test with mock webhook:**
   ```bash
   chmod +x scripts/mock-webhook.sh
   ./scripts/mock-webhook.sh
   ```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TYPEFORM_URL` | Public Typeform link for QR code | Required |
| `WEBHOOK_AUTH_TOKEN` | Secret token for webhook authentication | Required |
| `DISPLAY_SECONDS` | How long to show each result | `15` |
| `BRAND_PRIMARY` | Primary brand color | `#2563eb` |
| `BRAND_ACCENT` | Accent brand color | `#f59e0b` |
| `BRAND_BG` | Background color | `#ffffff` |
| `BRAND_TEXT` | Text color | `#1f2937` |
| `KIOSK_TITLE` | Main title on QR screen | `Gratis Vacaturescan` |
| `PORT` | Server port | `3000` |

### Client Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_TYPEFORM_URL` | Typeform URL for client | Same as server |
| `VITE_DISPLAY_SECONDS` | Display duration | Same as server |
| `VITE_KIOSK_TITLE` | Kiosk title | Same as server |
| `VITE_SERVER_URL` | Server URL for Socket.IO | `http://localhost:3000` |

## API Reference

### Webhook Endpoint

**POST** `/api/webhook/v1/result`

Accepts analysis results from Zapier or other webhook sources.

#### Authentication
- **Header**: `Authorization: Bearer <token>`
- **Query**: `?token=<token>`

#### Request Body
```json
{
  "company_name": "Acme NV",
  "vacancy_title": "Sales Manager", 
  "ideal_candidate_image_url": "https://example.com/image.png",
  "tips": [
    "Tip 1: Make intro more compact",
    "Tip 2: Add growth opportunities", 
    "Tip 3: Use target audience language",
    "Tip 4: Show salary range clearly"
  ],
  "meta": {
    "source": "zapier",
    "analysis_id": "zap-123",
    "submitted_at": "2025-01-16T10:21:00+02:00"
  }
}
```

#### Response
```json
{
  "success": true,
  "analysisId": "abc123",
  "message": "Analysis result processed successfully"
}
```

### Other Endpoints

- **GET** `/healthz` - Health check
- **GET** `/api/last` - Get latest analysis result (for fallback polling)

## Development

### Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── lib/           # Utilities and theme
│   │   └── types.ts       # TypeScript types
│   └── package.json
├── server/                # Express backend  
│   ├── src/
│   │   ├── config.ts      # Configuration
│   │   ├── security.ts    # Authentication
│   │   ├── storage.ts     # In-memory storage
│   │   ├── sockets.ts     # Socket.IO setup
│   │   └── index.ts       # Main server
│   └── package.json
├── scripts/               # Utility scripts
└── package.json           # Root workspace config
```

### Available Scripts

```bash
# Development
pnpm dev                  # Start both client and server
pnpm --filter client dev  # Client only
pnpm --filter server dev  # Server only

# Building
pnpm build               # Build both client and server
pnpm --filter client build # Client only
pnpm --filter server build # Server only

# Production
pnpm start               # Start production server

# Code Quality
pnpm lint                # Run ESLint
pnpm format              # Run Prettier
pnpm type-check          # TypeScript checking
```

## Production Deployment

### Docker

```bash
# Build image
docker build -t vacature-scanner .

# Run container
docker run -p 3000:3000 \
  -e TYPEFORM_URL="https://form.typeform.com/to/your-form" \
  -e WEBHOOK_AUTH_TOKEN="your-secret-token" \
  vacature-scanner
```

### Docker Compose

```bash
# Copy environment file
cp env.example .env

# Start services
docker-compose up -d
```

### Manual Deployment

```bash
# Build application
pnpm build

# Start production server
NODE_ENV=production pnpm start
```

## Security Features

- **Bearer Token Authentication**: Secure webhook endpoints
- **Rate Limiting**: Prevent webhook spam (30 req/min)
- **Input Validation**: Zod schema validation for all webhook data
- **HTML Escaping**: Sanitize all displayed content
- **CORS Protection**: Restrict origins in production
- **Security Headers**: Helmet.js security middleware

## Monitoring

### Health Check
```bash
curl http://localhost:3000/healthz
```

Response:
```json
{
  "ok": true,
  "queue": 3,
  "timestamp": "2025-01-16T10:21:00.000Z"
}
```

### Logs
The application logs important events:
- Socket.IO connections/disconnections
- Webhook processing
- Analysis result storage
- Error conditions

## Troubleshooting

### Common Issues

1. **Socket.IO Connection Failed**
   - Check server is running on correct port
   - Verify CORS settings
   - Check firewall settings

2. **Webhook Authentication Failed**
   - Verify `WEBHOOK_AUTH_TOKEN` matches
   - Check Authorization header format
   - Ensure token is not URL encoded

3. **QR Code Not Displaying**
   - Verify `TYPEFORM_URL` is set
   - Check URL is accessible
   - Ensure URL is valid

4. **Images Not Loading**
   - Check image URLs are accessible
   - Verify HTTPS/HTTP protocol
   - Check CORS headers for image domains

### Debug Mode

Set `NODE_ENV=development` for additional logging and error details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is proprietary software for Enplooi. All rights reserved.


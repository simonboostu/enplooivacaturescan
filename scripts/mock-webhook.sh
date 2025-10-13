#!/bin/bash

# Mock webhook script for testing the Vacature Scanner
# Usage: ./scripts/mock-webhook.sh

# Check if WEBHOOK_AUTH_TOKEN is set
if [ -z "$WEBHOOK_AUTH_TOKEN" ]; then
    echo "Error: WEBHOOK_AUTH_TOKEN environment variable is not set"
    echo "Please set it to your webhook authentication token"
    exit 1
fi

# Default server URL
SERVER_URL=${SERVER_URL:-"http://localhost:3000"}

echo "🚀 Sending mock webhook to $SERVER_URL"
echo "🔑 Using token: ${WEBHOOK_AUTH_TOKEN:0:8}..."

# Send the webhook
curl -X POST "$SERVER_URL/api/webhook/v1/result" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $WEBHOOK_AUTH_TOKEN" \
  -d '{
    "company_name": "Petsolutions",
    "vacancy_title": "Heftruck Chauffeur",
    "ideal_candidate_image_url": "https://picsum.photos/600/750?random=1",
    "tips": [
      "Maak de intro compacter en resultaatgerichter. Focus op de belangrijkste taken en verantwoordelijkheden.",
      "Voeg doorgroeimogelijkheden en opleidingsbudget toe. Dit trekt ambitieuze kandidaten aan.",
      "Gebruik taal en visuals passend bij je doelgroep. Vermijd jargon en maak het toegankelijk.",
      "Toon salarisrange en secundaire voordelen duidelijker. Transparantie zorgt voor betere matches."
    ],
    "meta": {
      "source": "mock",
      "analysis_id": "dev-'$(date +%s)'",
      "submitted_at": "'$(date -u +%Y-%m-%dT%H:%M:%S+02:00)'"
    }
  }'

echo ""
echo "✅ Mock webhook sent successfully!"
echo "📱 Check your kiosk display for the result"

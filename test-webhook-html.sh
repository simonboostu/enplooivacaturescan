#!/bin/bash

# Test webhook with HTML content in tips field (as Zapier is sending it)
SERVER_URL=${1:-"http://localhost:3000"}
WEBHOOK_TOKEN=${2:-"your-secret-token-here"}

echo "Testing webhook with HTML content in tips field..."
echo "Server URL: $SERVER_URL"
echo "Token: $WEBHOOK_TOKEN"

curl -X POST "$SERVER_URL/api/webhook/v1/result" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $WEBHOOK_TOKEN" \
  -d '{
    "company_name": "BMS Logistics",
    "vacancy_title": "Transportplanner",
    "ideal_candidate_image_url": "https://zapier-dev-files.s3.amazonaws.com/cli-platform/20376/4Od4ZhO3sJSVh6rf8TGL97w0tU8sXBKcg3Tpbhwh3dFvCxZbl-oeNKB-ijLCSTFowlugLE16IilFSFvhnePzgwtkkglc32_VPHn0PRj81jynJ58e2bIGk8Pa85xqoI0ekJ9aX-HZAnkZ-CbIdswJOyhp8E720Eso-HNhtIaaNgo",
    "tips": "<p>De vacaturetekst voor de rol van Transportplanner bij BMS Logistics sluit voor 65% aan bij het profiel van de ideale kandidaat. De tekst vraagt om ervaring in planning en coördinatie, terwijl de ideale kandidaat een starter is zonder ervaring. De nadruk op strategische en operationele verantwoordelijkheden kan intimiderend zijn voor een starter. De dynamische bedrijfscultuur en de noodzaak voor communicatieve en analytische vaardigheden komen wel overeen met de verwachtingen. Er is ruimte voor verbetering om de vacature aantrekkelijker te maken voor starters.</p>\n\n<ul>\n  <li>\n    <h3>Vereisten aanpassen voor starters</h3>\n    <p>De huidige tekst benadrukt strategische en operationele verantwoordelijkheden die mogelijk te hoog gegrepen zijn voor een starter. Overweeg om de tekst aan te passen door te benadrukken dat er training en begeleiding beschikbaar is, en dat starters welkom zijn om te groeien in de rol.</p>\n  </li>\n  <li>\n    <h3>Functie aantrekkelijker maken</h3>\n    <p>Voeg elementen toe die de rol aantrekkelijk maken voor starters, zoals doorgroeimogelijkheden, een mentorprogramma of een dynamische werkomgeving. Dit kan helpen om de vacature aantrekkelijker te maken voor kandidaten zonder ervaring.</p>\n  </li>\n  <li>\n    <h3>Bedrijfscultuur en voordelen verduidelijken</h3>\n    <p>Verduidelijk wat de organisatie biedt, zoals een dynamische werkomgeving en de mogelijkheid om snel te leren en te groeien. Dit kan starters aantrekken die op zoek zijn naar een uitdagende en leerzame eerste baan.</p>\n  </li>\n</ul>",
    "score": 65
  }'

echo ""
echo "Webhook test completed!"

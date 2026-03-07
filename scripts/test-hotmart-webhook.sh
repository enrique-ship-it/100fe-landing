#!/usr/bin/env bash

set -euo pipefail

WEBHOOK_URL="${1:-https://100fe-landing.vercel.app/api/hotmart-webhook}"
TOKEN="${HOTMART_WEBHOOK_TOKEN:-}"

if [[ -z "${TOKEN}" ]]; then
  echo "Error: define HOTMART_WEBHOOK_TOKEN en tu terminal."
  echo "Ejemplo: export HOTMART_WEBHOOK_TOKEN='tu_token'"
  exit 1
fi

TX_ID="tx_test_$(date +%s)"

echo "Probando webhook en: ${WEBHOOK_URL}"
echo "Transacción de prueba: ${TX_ID}"

curl -sS -X POST "${WEBHOOK_URL}" \
  -H "Content-Type: application/json" \
  -d "{
    \"hottok\": \"${TOKEN}\",
    \"status\": \"approved\",
    \"purchase\": {
      \"transaction\": \"${TX_ID}\",
      \"currency\": \"MXN\",
      \"price\": { \"value\": 149.64 }
    },
    \"buyer\": {
      \"email\": \"comprador@example.com\",
      \"checkout_phone\": \"5215512345678\"
    }
  }" | cat

echo
echo "Si ves 'ok: true' y 'tracked: purchase', el endpoint está funcionando."

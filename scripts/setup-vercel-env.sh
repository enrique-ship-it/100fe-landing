#!/usr/bin/env bash

set -euo pipefail

ENV_FILE="${1:-.env.deploy}"

if ! command -v vercel >/dev/null 2>&1; then
  echo "Error: Vercel CLI no está instalada. Instala con: npm i -g vercel"
  exit 1
fi

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Error: No existe ${ENV_FILE} en la raíz del proyecto."
  echo "Crea ${ENV_FILE} usando .env.example como base."
  exit 1
fi

if [[ ! -f .vercel/project.json ]]; then
  echo "Error: el proyecto no está enlazado a Vercel (.vercel/project.json no existe)."
  echo "Ejecuta una vez: vercel link"
  exit 1
fi

required_vars=(
  HOTMART_WEBHOOK_TOKEN
  META_PIXEL_ID
  META_ACCESS_TOKEN
  GA4_MEASUREMENT_ID
  GA4_API_SECRET
  LANDING_URL
)

is_placeholder() {
  local value="$1"
  [[ -z "$value" || "$value" == coloca_* || "$value" == "your_"* || "$value" == "changeme"* ]]
}

missing_real_vars=()

for var_name in "${required_vars[@]}"; do
  if ! grep -q "^${var_name}=" "${ENV_FILE}"; then
    echo "Error: Falta ${var_name} en ${ENV_FILE}"
    exit 1
  fi

  raw_value="$(grep -E "^${var_name}=" "${ENV_FILE}" | sed -E "s/^${var_name}=//")"
  raw_value="${raw_value%\"}"
  raw_value="${raw_value#\"}"
  raw_value="${raw_value%\'}"
  raw_value="${raw_value#\'}"

  if is_placeholder "${raw_value}"; then
    missing_real_vars+=("${var_name}")
  fi
done

for env_name in "${required_vars[@]}"; do
  value="$(grep -E "^${env_name}=" "${ENV_FILE}" | sed -E "s/^${env_name}=//")"

  # Limpiar posible comillado simple/doble
  value="${value%\"}"
  value="${value#\"}"
  value="${value%\'}"
  value="${value#\'}"

  if ! is_placeholder "${value}"; then
    echo "Configurando ${env_name} en preview y production..."
    printf "%s" "${value}" | vercel env add "${env_name}" preview >/dev/null || true
    printf "%s" "${value}" | vercel env add "${env_name}" production >/dev/null || true
  fi
done

if [[ ${#missing_real_vars[@]} -gt 0 ]]; then
  echo
  echo "Faltan valores reales para estas variables (se omitieron):"
  printf '  - %s\n' "${missing_real_vars[@]}"
fi

echo "Variables enviadas. Ejecuta redeploy para aplicar cambios:"
echo "  vercel --prod"

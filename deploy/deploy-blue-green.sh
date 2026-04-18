#!/bin/sh
set -eu

SLOT="${1:-blue}"
PROJECT_PATH="${PROJECT_PATH:-/home/g2023171020/proyecto-node}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.gcp.yml}"
ACTIVE_FILE="${ACTIVE_FILE:-$PROJECT_PATH/deploy/.active-slot}"

if [ "$SLOT" != "blue" ] && [ "$SLOT" != "green" ]; then
  echo "Uso: ./deploy/deploy-blue-green.sh [blue|green]"
  exit 1
fi

cd "$PROJECT_PATH"

echo "Construyendo y levantando stack en slot $SLOT"
docker compose -f "$COMPOSE_FILE" up -d --build

mkdir -p "$(dirname "$ACTIVE_FILE")"
printf "%s\n" "$SLOT" > "$ACTIVE_FILE"

echo "Slot activo registrado en $ACTIVE_FILE"
echo "Valida manualmente con:"
echo "curl -H 'X-Release-Slot: $SLOT' http://35.239.188.208/health"
echo "Si todo responde bien, mantienes ese slot como promovido."
